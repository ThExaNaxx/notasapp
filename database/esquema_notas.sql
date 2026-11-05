-- =====================================================================
--  SISTEMA DE NOTAS - SCRIPT DE BASE DE DATOS (Supabase / PostgreSQL)
--  Pegar TODO este script en: Supabase > SQL Editor > New query > Run
-- =====================================================================

-- ---------------------------------------------------------------
-- 1) TABLA PERFILES: datos extra de cada estudiante registrado
--    (el email y la contraseña los guarda Supabase Auth en auth.users)
-- ---------------------------------------------------------------
create table public.perfiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  nombres     text not null default '',
  apellidos   text not null default '',
  codigo      text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- 2) TABLA CURSOS: un registro por cada curso del estudiante
--    Pesos: P1 10% | P2 20% | P3 20% | Examen final 30% | Continuas 20%
-- ---------------------------------------------------------------
create table public.cursos (
  id            bigint generated always as identity primary key,
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nombre        text not null check (char_length(nombre) between 2 and 100),
  parcial_1     numeric(4,2) not null default 0 check (parcial_1    between 0 and 20),
  parcial_2     numeric(4,2) not null default 0 check (parcial_2    between 0 and 20),
  parcial_3     numeric(4,2) not null default 0 check (parcial_3    between 0 and 20),
  examen_final  numeric(4,2) not null default 0 check (examen_final between 0 and 20),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- 3) TABLA CONTINUAS: cada nota continua pertenece a un curso
--    (un curso puede tener 1, 2, 3... N continuas)
-- ---------------------------------------------------------------
create table public.continuas (
  id        bigint generated always as identity primary key,
  curso_id  bigint not null references public.cursos (id) on delete cascade,
  user_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  numero    int not null check (numero >= 1),
  nota      numeric(4,2) not null check (nota between 0 and 20),
  unique (curso_id, numero)
);

-- Índices para que las búsquedas sean rápidas
create index cursos_user_id_idx    on public.cursos (user_id);
create index continuas_curso_id_idx on public.continuas (curso_id);
create index continuas_user_id_idx  on public.continuas (user_id);

-- ---------------------------------------------------------------
-- 4) PERMISOS: los usuarios con sesión iniciada (authenticated)
--    pueden usar estas tablas desde la API de Supabase
-- ---------------------------------------------------------------
grant select, update                 on public.perfiles  to authenticated;
grant select, insert, update, delete on public.cursos    to authenticated;
grant select, insert, update, delete on public.continuas to authenticated;

-- ---------------------------------------------------------------
-- 5) SEGURIDAD (RLS): cada estudiante SOLO ve y modifica lo suyo
-- ---------------------------------------------------------------
alter table public.perfiles  enable row level security;
alter table public.cursos    enable row level security;
alter table public.continuas enable row level security;

-- PERFILES
create policy "Ver mi perfil" on public.perfiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "Editar mi perfil" on public.perfiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- CURSOS
create policy "Ver mis cursos" on public.cursos
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Crear mis cursos" on public.cursos
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Editar mis cursos" on public.cursos
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Eliminar mis cursos" on public.cursos
  for delete to authenticated using ((select auth.uid()) = user_id);

-- CONTINUAS
create policy "Ver mis continuas" on public.continuas
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Crear mis continuas" on public.continuas
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.cursos c
      where c.id = curso_id and c.user_id = (select auth.uid())
    )
  );

create policy "Editar mis continuas" on public.continuas
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Eliminar mis continuas" on public.continuas
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------
-- 6) TRIGGER: al registrarse un usuario, se crea su perfil
--    automáticamente con los datos enviados desde React
-- ---------------------------------------------------------------
create or replace function public.crear_perfil_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombres, apellidos, codigo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombres', ''),
    coalesce(new.raw_user_meta_data ->> 'apellidos', ''),
    new.raw_user_meta_data ->> 'codigo'
  );
  return new;
end;
$$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo_usuario();

-- ---------------------------------------------------------------
-- 7) TRIGGER: actualiza "updated_at" cada vez que se edita un curso
-- ---------------------------------------------------------------
create or replace function public.actualizar_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cursos_updated_at
  before update on public.cursos
  for each row execute function public.actualizar_updated_at();

-- FIN DEL SCRIPT ✅