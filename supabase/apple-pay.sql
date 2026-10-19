-- Mis Finanzas: pagos con Apple Pay detectados por un Atajo del iPhone.
-- Ejecuta este script una vez en Supabase > SQL Editor > New query > Run.
--
-- Cómo funciona:
--   1. Cada persona genera una "clave" desde su perfil en la app. En la base solo se guarda
--      su huella (SHA-256), nunca la clave. La clave se copia una vez al Atajo del iPhone.
--   2. Cuando pagas con una tarjeta de la Cartera, el Atajo llama a la función
--      registrar_pago_atajo con la clave, el monto y el comercio.
--   3. La función valida la clave y deja el pago en la bandeja "pagos_pendientes".
--      Nada se registra como gasto hasta que la persona lo confirma en la app.

-- 1. Claves de los Atajos (una por persona) -----------------------------------------
create table if not exists public.atajo_tokens (
  user_id    uuid        primary key default auth.uid() references auth.users (id) on delete cascade,
  token_hash text        not null check (token_hash ~ '^[0-9a-f]{64}$'),
  creado     timestamptz not null default now()
);

alter table public.atajo_tokens enable row level security;
drop policy if exists "atajo_tokens_propia" on public.atajo_tokens;
create policy "atajo_tokens_propia" on public.atajo_tokens
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on public.atajo_tokens from anon;
grant select, insert, update, delete on public.atajo_tokens to authenticated;

-- 2. Bandeja de pagos detectados -----------------------------------------------------
create table if not exists public.pagos_pendientes (
  id       uuid          primary key default gen_random_uuid(),
  user_id  uuid          not null references auth.users (id) on delete cascade,
  monto    numeric(14,2) not null check (monto > 0 and monto < 100000000000),
  comercio text          not null default '' check (char_length(comercio) <= 120),
  tarjeta  text          not null default '' check (char_length(tarjeta) <= 60),
  creado   timestamptz   not null default now()
);
create index if not exists pagos_pendientes_user_idx on public.pagos_pendientes (user_id, creado desc);

alter table public.pagos_pendientes enable row level security;
drop policy if exists "pagos_pendientes_select" on public.pagos_pendientes;
drop policy if exists "pagos_pendientes_delete" on public.pagos_pendientes;
create policy "pagos_pendientes_select" on public.pagos_pendientes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "pagos_pendientes_delete" on public.pagos_pendientes
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Las personas solo pueden ver y descartar su bandeja; los pagos entran únicamente por la función.
revoke all on public.pagos_pendientes from anon;
grant select, delete on public.pagos_pendientes to authenticated;

-- 3. Lectura tolerante del monto ("45.000", "45,000.50", "$ 12,5", "12.50"...) ---------
create or replace function public.parse_monto(t text)
returns numeric
language plpgsql
immutable
set search_path = public
as $$
declare
  s     text;
  p_dot int;
  p_com int;
  sep   text;
  cnt   int;
  desp  int;
begin
  s := regexp_replace(coalesce(t, ''), '[^0-9.,]', '', 'g');
  if s !~ '[0-9]' then
    return null;
  end if;
  p_dot := case when position('.' in s) > 0 then length(s) - position('.' in reverse(s)) + 1 else 0 end;
  p_com := case when position(',' in s) > 0 then length(s) - position(',' in reverse(s)) + 1 else 0 end;
  if p_dot > 0 and p_com > 0 then
    -- si hay punto y coma, el que aparece al final es el decimal
    if p_dot > p_com then
      s := replace(s, ',', '');
    else
      s := replace(replace(s, '.', ''), ',', '.');
    end if;
  elsif p_dot > 0 or p_com > 0 then
    sep  := case when p_dot > 0 then '.' else ',' end;
    cnt  := length(s) - length(replace(s, sep, ''));
    desp := length(s) - greatest(p_dot, p_com);
    if cnt > 1 or desp = 3 then
      s := replace(s, sep, '');   -- separador de miles (45.000)
    else
      s := replace(s, sep, '.');  -- decimal (12,5)
    end if;
  end if;
  if s !~ '^[0-9]+(\.[0-9]+)?$' then
    return null;
  end if;
  return s::numeric;
end;
$$;
revoke all on function public.parse_monto(text) from public;

-- 4. La función que llama el Atajo -----------------------------------------------------
create or replace function public.registrar_pago_atajo(
  p_token    text,
  p_monto    text,
  p_comercio text default '',
  p_tarjeta  text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user  uuid;
  v_monto numeric;
  v_com   text;
  v_tar   text;
  v_n     int;
begin
  if p_token is null or char_length(p_token) < 32 or char_length(p_token) > 200 then
    return jsonb_build_object('ok', false, 'error', 'clave');
  end if;

  select user_id into v_user
    from public.atajo_tokens
   where token_hash = encode(sha256(convert_to(p_token, 'utf8')), 'hex');
  if v_user is null then
    return jsonb_build_object('ok', false, 'error', 'clave');
  end if;

  v_monto := public.parse_monto(p_monto);
  if v_monto is null or v_monto <= 0 or v_monto >= 100000000000 then
    return jsonb_build_object('ok', false, 'error', 'monto');
  end if;

  v_com := left(coalesce(btrim(p_comercio), ''), 120);
  v_tar := left(coalesce(btrim(p_tarjeta), ''), 60);

  -- Si el Atajo se dispara dos veces seguidas por el mismo pago, no se duplica.
  if exists (
    select 1 from public.pagos_pendientes
     where user_id = v_user and monto = v_monto and comercio = v_com
       and creado > now() - interval '30 seconds'
  ) then
    return jsonb_build_object('ok', true, 'duplicado', true);
  end if;

  select count(*) into v_n from public.pagos_pendientes where user_id = v_user;
  if v_n >= 200 then
    return jsonb_build_object('ok', false, 'error', 'bandeja_llena');
  end if;

  insert into public.pagos_pendientes (user_id, monto, comercio, tarjeta)
  values (v_user, v_monto, v_com, v_tar);

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.registrar_pago_atajo(text, text, text, text) from public;
grant execute on function public.registrar_pago_atajo(text, text, text, text) to anon, authenticated;
