create table if not exists public.highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  video_url text not null,
  thumbnail_url text,
  fixture_id uuid references public.fixtures(id) on delete set null,
  featured_player text,
  published_at timestamptz not null default now(),
  featured boolean not null default false,
  status text not null default 'published' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists highlights_published_at_idx on public.highlights(published_at desc);
create index if not exists highlights_status_idx on public.highlights(status);
create index if not exists highlights_fixture_idx on public.highlights(fixture_id);

alter table public.highlights enable row level security;

drop policy if exists "Public can view published highlights" on public.highlights;
create policy "Public can view published highlights"
  on public.highlights for select
  using (status = 'published');

drop policy if exists "Admins manage highlights" on public.highlights;
create policy "Admins manage highlights"
  on public.highlights for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('owner','admin','editor')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('owner','admin','editor')));

create or replace function public.set_highlights_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists highlights_updated_at on public.highlights;
create trigger highlights_updated_at before update on public.highlights
for each row execute function public.set_highlights_updated_at();
