-- Cuantía: espacio compartido de pareja ("Nosotros").
-- Ejecuta este script una vez en Supabase > SQL Editor > New query > Run.
--
-- Qué crea:
--   * Un espacio al que se unen dos personas con un código (máximo 2 miembros, un espacio por persona).
--   * Gastos compartidos con su reparto, pagos entre ustedes (para saldar) y metas de ahorro compartidas.
-- Seguridad: solo las personas del espacio pueden ver o tocar sus datos (RLS). Tus datos personales
-- (la tabla finanzas_docs) no se tocan y siguen siendo privados.

-- 1. Espacios y miembros -------------------------------------------------------------
create table if not exists public.espacios (
  id         uuid        primary key default gen_random_uuid(),
  nombre     text        not null default 'Nosotros' check (char_length(nombre) between 1 and 40),
  codigo     text        not null unique check (codigo ~ '^[A-Z2-9]{8}$'),
  creado_por uuid        not null references auth.users (id) on delete cascade,
  creado     timestamptz not null default now()
);

create table if not exists public.espacio_miembros (
  espacio_id uuid        not null references public.espacios (id) on delete cascade,
  user_id    uuid        not null references auth.users (id) on delete cascade,
  alias      text        not null default '' check (char_length(alias) <= 30),
  unido      timestamptz not null default now(),
  primary key (espacio_id, user_id),
  unique (user_id)
);

-- Intentos fallidos de unirse con un código (para frenar adivinanzas).
create table if not exists public.espacio_intentos (
  id      bigint      generated always as identity primary key,
  user_id uuid        not null references auth.users (id) on delete cascade,
  creado  timestamptz not null default now()
);
create index if not exists espacio_intentos_user_idx on public.espacio_intentos (user_id, creado desc);

-- 2. Funciones de ayuda para las reglas de acceso ------------------------------------
create or replace function public.es_miembro(p_espacio uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.espacio_miembros where espacio_id = p_espacio and user_id = auth.uid());
$$;

create or replace function public.es_miembro_de(p_espacio uuid, p_user uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.espacio_miembros where espacio_id = p_espacio and user_id = p_user);
$$;

revoke all on function public.es_miembro(uuid) from public;
revoke all on function public.es_miembro_de(uuid, uuid) from public;
grant execute on function public.es_miembro(uuid) to authenticated;
grant execute on function public.es_miembro_de(uuid, uuid) to authenticated;

-- 3. Datos compartidos ---------------------------------------------------------------
create table if not exists public.espacio_gastos (
  id          uuid          primary key default gen_random_uuid(),
  espacio_id  uuid          not null references public.espacios (id) on delete cascade,
  pagado_por  uuid          not null references auth.users (id),
  monto       numeric(14,2) not null check (monto > 0 and monto < 100000000000),
  descripcion text          not null default '' check (char_length(descripcion) <= 120),
  categoria   text          not null default 'Otros' check (char_length(categoria) <= 40),
  fecha       date          not null default current_date,
  -- porcentaje del gasto que le corresponde a quien pagó; el resto lo debe la otra persona
  pct_pagador numeric(5,2)  not null default 50 check (pct_pagador between 0 and 100),
  creado_por  uuid          not null default auth.uid() references auth.users (id),
  creado      timestamptz   not null default now()
);
create index if not exists espacio_gastos_idx on public.espacio_gastos (espacio_id, fecha desc);

create table if not exists public.espacio_liquidaciones (
  id         uuid          primary key default gen_random_uuid(),
  espacio_id uuid          not null references public.espacios (id) on delete cascade,
  de         uuid          not null references auth.users (id),
  a          uuid          not null references auth.users (id),
  monto      numeric(14,2) not null check (monto > 0 and monto < 100000000000),
  fecha      date          not null default current_date,
  creado_por uuid          not null default auth.uid() references auth.users (id),
  creado     timestamptz   not null default now(),
  check (de <> a)
);
create index if not exists espacio_liq_idx on public.espacio_liquidaciones (espacio_id, fecha desc);

create table if not exists public.espacio_metas (
  id         uuid          primary key default gen_random_uuid(),
  espacio_id uuid          not null references public.espacios (id) on delete cascade,
  nombre     text          not null check (char_length(nombre) between 1 and 60),
  objetivo   numeric(14,2) not null check (objetivo > 0 and objetivo < 100000000000),
  icono      text          not null default 'metas' check (char_length(icono) <= 12),
  color      text          not null default '' check (color = '' or color ~ '^#[0-9a-fA-F]{6}$'),
  creado     timestamptz   not null default now()
);
create index if not exists espacio_metas_idx on public.espacio_metas (espacio_id);

create table if not exists public.espacio_aportes (
  id          uuid          primary key default gen_random_uuid(),
  meta_id     uuid          not null references public.espacio_metas (id) on delete cascade,
  espacio_id  uuid          not null references public.espacios (id) on delete cascade,
  aportado_por uuid         not null references auth.users (id),
  monto       numeric(14,2) not null check (monto > 0 and monto < 100000000000),
  fecha       date          not null default current_date,
  creado      timestamptz   not null default now()
);
create index if not exists espacio_aportes_idx on public.espacio_aportes (espacio_id, meta_id);

-- 4. Reglas de acceso (RLS): solo los miembros del espacio ---------------------------
alter table public.espacios              enable row level security;
alter table public.espacio_miembros      enable row level security;
alter table public.espacio_intentos      enable row level security;
alter table public.espacio_gastos        enable row level security;
alter table public.espacio_liquidaciones enable row level security;
alter table public.espacio_metas         enable row level security;
alter table public.espacio_aportes       enable row level security;

drop policy if exists "espacios_select"  on public.espacios;
drop policy if exists "espacios_update"  on public.espacios;
create policy "espacios_select" on public.espacios for select to authenticated using (public.es_miembro(id));
create policy "espacios_update" on public.espacios for update to authenticated
  using (public.es_miembro(id)) with check (public.es_miembro(id));

drop policy if exists "miembros_select" on public.espacio_miembros;
drop policy if exists "miembros_update" on public.espacio_miembros;
create policy "miembros_select" on public.espacio_miembros for select to authenticated using (public.es_miembro(espacio_id));
create policy "miembros_update" on public.espacio_miembros for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "gastos_todo" on public.espacio_gastos;
create policy "gastos_todo" on public.espacio_gastos for all to authenticated
  using (public.es_miembro(espacio_id))
  with check (public.es_miembro(espacio_id) and public.es_miembro_de(espacio_id, pagado_por));

drop policy if exists "liq_todo" on public.espacio_liquidaciones;
create policy "liq_todo" on public.espacio_liquidaciones for all to authenticated
  using (public.es_miembro(espacio_id))
  with check (public.es_miembro(espacio_id) and public.es_miembro_de(espacio_id, de) and public.es_miembro_de(espacio_id, a));

drop policy if exists "metas_todo" on public.espacio_metas;
create policy "metas_todo" on public.espacio_metas for all to authenticated
  using (public.es_miembro(espacio_id)) with check (public.es_miembro(espacio_id));

drop policy if exists "aportes_todo" on public.espacio_aportes;
create policy "aportes_todo" on public.espacio_aportes for all to authenticated
  using (public.es_miembro(espacio_id))
  with check (public.es_miembro(espacio_id) and public.es_miembro_de(espacio_id, aportado_por)
              and exists (select 1 from public.espacio_metas m where m.id = meta_id and m.espacio_id = espacio_aportes.espacio_id));

revoke all on public.espacios, public.espacio_miembros, public.espacio_intentos, public.espacio_gastos,
              public.espacio_liquidaciones, public.espacio_metas, public.espacio_aportes from anon;
revoke all on public.espacio_intentos from authenticated;
grant select, update on public.espacios to authenticated;
grant select, update on public.espacio_miembros to authenticated;
grant select, insert, update, delete on public.espacio_gastos, public.espacio_liquidaciones,
      public.espacio_metas, public.espacio_aportes to authenticated;

-- 5. Crear, unirse y salir (funciones; las tablas no se escriben directamente) -------
create or replace function public.crear_espacio(p_nombre text, p_alias text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_id uuid; v_cod text := ''; v_b bytea; i int;
  v_chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
begin
  if auth.uid() is null then return jsonb_build_object('ok', false, 'error', 'sesion'); end if;
  if exists (select 1 from public.espacio_miembros where user_id = auth.uid()) then
    return jsonb_build_object('ok', false, 'error', 'ya_tienes');
  end if;
  loop
    v_cod := '';
    v_b := decode(replace(gen_random_uuid()::text, '-', ''), 'hex');
    for i in 0..7 loop
      v_cod := v_cod || substr(v_chars, 1 + (get_byte(v_b, i) % 32), 1);
    end loop;
    exit when not exists (select 1 from public.espacios where codigo = v_cod);
  end loop;
  insert into public.espacios (nombre, codigo, creado_por)
  values (left(coalesce(nullif(btrim(p_nombre), ''), 'Nosotros'), 40), v_cod, auth.uid())
  returning id into v_id;
  insert into public.espacio_miembros (espacio_id, user_id, alias)
  values (v_id, auth.uid(), left(coalesce(btrim(p_alias), ''), 30));
  return jsonb_build_object('ok', true, 'id', v_id, 'codigo', v_cod);
end;
$$;

create or replace function public.unirse_espacio(p_codigo text, p_alias text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_n int; v_cod text;
begin
  if auth.uid() is null then return jsonb_build_object('ok', false, 'error', 'sesion'); end if;
  if exists (select 1 from public.espacio_miembros where user_id = auth.uid()) then
    return jsonb_build_object('ok', false, 'error', 'ya_tienes');
  end if;
  if (select count(*) from public.espacio_intentos where user_id = auth.uid() and creado > now() - interval '1 hour') >= 10 then
    return jsonb_build_object('ok', false, 'error', 'demasiados');
  end if;
  v_cod := upper(regexp_replace(coalesce(p_codigo, ''), '[^A-Za-z0-9]', '', 'g'));
  select id into v_id from public.espacios where codigo = v_cod;
  if v_id is null then
    insert into public.espacio_intentos (user_id) values (auth.uid());
    return jsonb_build_object('ok', false, 'error', 'codigo');
  end if;
  select count(*) into v_n from public.espacio_miembros where espacio_id = v_id;
  if v_n >= 2 then return jsonb_build_object('ok', false, 'error', 'lleno'); end if;
  insert into public.espacio_miembros (espacio_id, user_id, alias)
  values (v_id, auth.uid(), left(coalesce(btrim(p_alias), ''), 30));
  return jsonb_build_object('ok', true, 'id', v_id);
end;
$$;

create or replace function public.salir_espacio()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('ok', false, 'error', 'sesion'); end if;
  delete from public.espacio_miembros where user_id = auth.uid() returning espacio_id into v_id;
  if v_id is not null and not exists (select 1 from public.espacio_miembros where espacio_id = v_id) then
    delete from public.espacios where id = v_id;   -- si nadie queda, se borra el espacio y sus datos
  end if;
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.crear_espacio(text, text)  from public;
revoke all on function public.unirse_espacio(text, text) from public;
revoke all on function public.salir_espacio()            from public;
grant execute on function public.crear_espacio(text, text)  to authenticated;
grant execute on function public.unirse_espacio(text, text) to authenticated;
grant execute on function public.salir_espacio()            to authenticated;
