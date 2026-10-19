-- Mis Finanzas: tabla de datos por usuario.
-- Ejecuta este script una vez en Supabase > SQL Editor > New query > Run.

create table if not exists public.finanzas_docs (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  doc_id     text        not null,          -- "config" o "m-AAAA-MM"
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, doc_id)
);

-- Seguridad: cada persona solo puede leer y escribir sus propias filas.
alter table public.finanzas_docs enable row level security;

drop policy if exists "finanzas_select_propias" on public.finanzas_docs;
drop policy if exists "finanzas_insert_propias" on public.finanzas_docs;
drop policy if exists "finanzas_update_propias" on public.finanzas_docs;
drop policy if exists "finanzas_delete_propias" on public.finanzas_docs;

create policy "finanzas_select_propias" on public.finanzas_docs
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "finanzas_insert_propias" on public.finanzas_docs
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "finanzas_update_propias" on public.finanzas_docs
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "finanzas_delete_propias" on public.finanzas_docs
  for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.finanzas_docs to authenticated;
