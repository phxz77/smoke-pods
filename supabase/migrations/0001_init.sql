-- =====================================================================
-- Smoke Pods — schema inicial
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em "Run".
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Tabela `produtos`
-- ---------------------------------------------------------------------

create table if not exists public.produtos (
  id           uuid          primary key default gen_random_uuid(),
  nome         text          not null,
  modelo       text          not null,
  sabor        text,
  categoria    text          not null default 'Pods Descartáveis',
  descricao    text          not null default '',
  preco        numeric(10,2) not null check (preco >= 0),
  preco_original numeric(10,2) check (preco_original is null or preco_original >= 0),
  estoque      integer       not null default 0 check (estoque >= 0),
  imagem_url   text          not null default '',
  -- status é derivado do estoque: > 0 => disponivel, = 0 => esgotado
  status       text          generated always as (
                                case when estoque > 0 then 'disponivel' else 'esgotado' end
                             ) stored,
  puffs        text,
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now()
);

create index if not exists produtos_modelo_idx    on public.produtos (modelo);
create index if not exists produtos_categoria_idx on public.produtos (categoria);
create index if not exists produtos_status_idx    on public.produtos (status);

-- Trigger para manter updated_at sincronizado.
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_produtos_updated_at on public.produtos;
create trigger trg_produtos_updated_at
before update on public.produtos
for each row execute function public.tg_set_updated_at();

-- ---------------------------------------------------------------------
-- 2) Row Level Security
-- ---------------------------------------------------------------------

alter table public.produtos enable row level security;

drop policy if exists "produtos_select_public" on public.produtos;
create policy "produtos_select_public"
  on public.produtos
  for select
  to anon, authenticated
  using (true);

drop policy if exists "produtos_insert_auth" on public.produtos;
create policy "produtos_insert_auth"
  on public.produtos
  for insert
  to authenticated
  with check (true);

drop policy if exists "produtos_update_auth" on public.produtos;
create policy "produtos_update_auth"
  on public.produtos
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "produtos_delete_auth" on public.produtos;
create policy "produtos_delete_auth"
  on public.produtos
  for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 3) Realtime
-- ---------------------------------------------------------------------

-- Garante que a tabela faça parte da publicação default do Supabase Realtime.
alter table public.produtos replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'produtos'
  ) then
    execute 'alter publication supabase_realtime add table public.produtos';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 4) Storage bucket `produtos-imagens`
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'produtos-imagens',
  'produtos-imagens',
  true,
  5 * 1024 * 1024,            -- 5 MB
  array['image/png','image/jpeg','image/webp','image/svg+xml','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Policies para o bucket (qualquer um vê, autenticado escreve).
drop policy if exists "produtos_imagens_public_read" on storage.objects;
create policy "produtos_imagens_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'produtos-imagens');

drop policy if exists "produtos_imagens_auth_insert" on storage.objects;
create policy "produtos_imagens_auth_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'produtos-imagens');

drop policy if exists "produtos_imagens_auth_update" on storage.objects;
create policy "produtos_imagens_auth_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'produtos-imagens')
  with check (bucket_id = 'produtos-imagens');

drop policy if exists "produtos_imagens_auth_delete" on storage.objects;
create policy "produtos_imagens_auth_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'produtos-imagens');
