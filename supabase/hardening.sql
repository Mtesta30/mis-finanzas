-- Mis Finanzas: refuerzos de seguridad.
-- Ejecuta este script una vez en Supabase > SQL Editor (después de schema.sql).

-- 1. Los usuarios sin sesión no tienen ningún permiso sobre la tabla.
--    (Las reglas RLS ya los bloqueaban; esto lo cierra también a nivel de permisos.)
revoke all on public.finanzas_docs from anon;

-- 2. Solo se aceptan los documentos que usa la app:
--    "config" y un documento por mes ("m-AAAA-MM", años 2000-2099).
--    Así nadie puede llenar la base con miles de filas basura desde su cuenta.
alter table public.finanzas_docs drop constraint if exists finanzas_doc_id_formato;
alter table public.finanzas_docs add constraint finanzas_doc_id_formato
  check (doc_id ~ '^(config|m-20[0-9]{2}-(0[1-9]|1[0-2]))$');

-- 3. Límite de tamaño por documento (256 KB): de sobra para un mes de movimientos,
--    pero evita que alguien suba datos enormes.
alter table public.finanzas_docs drop constraint if exists finanzas_data_tamano;
alter table public.finanzas_docs add constraint finanzas_data_tamano
  check (pg_column_size(data) <= 262144 and jsonb_typeof(data) = 'object');
