create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'viewer' check (role in ('owner','admin','editor','viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role in ('owner','admin','editor')); $$;

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'owner'); $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users for each row execute function public.handle_new_user();

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Downball Australia',
  tagline text,
  logo_url text,
  banner_url text,
  primary_colour text not null default '#090909',
  accent_colour text not null default '#f5c518',
  contact_email text,
  contact_phone text,
  location text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.competitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  banner_url text,
  competition_type text,
  region text,
  starts_on date,
  ends_on date,
  status text not null default 'active' check (status in ('active','archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seasons (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  name text not null,
  slug text not null,
  starts_on date,
  ends_on date,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(competition_id, slug)
);

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  season_id uuid references public.seasons(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  starts_on date,
  ends_on date,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(competition_id, slug)
);

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  season_id uuid references public.seasons(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  sort_order integer not null default 0,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(competition_id, season_id, slug)
);

create table if not exists public.divisions (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  league_id uuid references public.leagues(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  sort_order integer not null default 0,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(competition_id, season_id, slug)
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  address text not null,
  map_url text,
  description text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_name text,
  logo_url text,
  primary_colour text not null default '#111111',
  secondary_colour text not null default '#ffffff',
  location text,
  home_venue_id uuid references public.venues(id) on delete set null,
  description text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_divisions (
  team_id uuid not null references public.teams(id) on delete cascade,
  division_id uuid not null references public.divisions(id) on delete cascade,
  primary key(team_id, division_id)
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete set null,
  season_id uuid references public.seasons(id) on delete set null,
  name text not null,
  slug text not null unique,
  photo_url text,
  jersey_number integer,
  position text,
  height_cm integer,
  nationality text,
  age_group text,
  biography text,
  awards text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.player_statistics (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  season_id uuid references public.seasons(id) on delete set null,
  label text not null,
  matches integer not null default 0,
  points integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  is_career boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  photo_url text,
  role text,
  biography text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_coaches (
  team_id uuid not null references public.teams(id) on delete cascade,
  coach_id uuid not null references public.coaches(id) on delete cascade,
  season_id uuid references public.seasons(id) on delete cascade,
  role text,
  primary key(team_id, coach_id, season_id)
);

create table if not exists public.fixtures (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  league_id uuid references public.leagues(id) on delete set null,
  division_id uuid references public.divisions(id) on delete set null,
  round_name text not null,
  home_team_id uuid not null references public.teams(id) on delete restrict,
  away_team_id uuid not null references public.teams(id) on delete restrict,
  starts_at timestamptz not null,
  venue_id uuid references public.venues(id) on delete set null,
  venue_name text,
  notes text,
  status text not null default 'scheduled' check (status in ('scheduled','live','half-time','delayed','postponed','cancelled','finished')),
  home_score integer,
  away_score integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (home_team_id <> away_team_id)
);

create table if not exists public.match_events (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid not null references public.fixtures(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  player_id uuid references public.players(id) on delete set null,
  minute integer,
  event_type text not null,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists public.standings (
  id uuid primary key default gen_random_uuid(),
  division_id uuid not null references public.divisions(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  played integer not null default 0,
  won integer not null default 0,
  lost integer not null default 0,
  drawn integer not null default 0,
  points_for integer not null default 0,
  points_against integer not null default 0,
  points integer not null default 0,
  updated_at timestamptz not null default now(),
  unique(division_id, team_id)
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  image_url text,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  tier text not null default 'official' check (tier in ('major','official')),
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rankings (
  id uuid primary key default gen_random_uuid(),
  season_id uuid references public.seasons(id) on delete cascade,
  division_id uuid references public.divisions(id) on delete cascade,
  entity_type text not null check (entity_type in ('team','player')),
  entity_id uuid,
  label text,
  position integer not null,
  points numeric not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid references public.competitions(id) on delete cascade,
  title text not null,
  holder_name text,
  value text,
  achieved_on date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','read','closed')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','site_settings','competitions','seasons','tournaments','leagues','divisions',
    'venues','teams','players','player_statistics','coaches','fixtures','standings',
    'articles','sponsors','rankings','records'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name);
  end loop;
end $$;

create or replace function public.refresh_division_standings(target_division uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from public.standings where division_id = target_division;
  insert into public.standings (division_id, team_id, played, won, lost, drawn, points_for, points_against, points)
  select
    target_division,
    td.team_id,
    count(f.id) filter (where f.status = 'finished')::int,
    count(f.id) filter (where f.status = 'finished' and ((f.home_team_id = td.team_id and f.home_score > f.away_score) or (f.away_team_id = td.team_id and f.away_score > f.home_score)))::int,
    count(f.id) filter (where f.status = 'finished' and ((f.home_team_id = td.team_id and f.home_score < f.away_score) or (f.away_team_id = td.team_id and f.away_score < f.home_score)))::int,
    count(f.id) filter (where f.status = 'finished' and f.home_score = f.away_score)::int,
    coalesce(sum(case when f.home_team_id = td.team_id then f.home_score when f.away_team_id = td.team_id then f.away_score else 0 end) filter (where f.status = 'finished'), 0)::int,
    coalesce(sum(case when f.home_team_id = td.team_id then f.away_score when f.away_team_id = td.team_id then f.home_score else 0 end) filter (where f.status = 'finished'), 0)::int,
    (
      3 * count(f.id) filter (where f.status = 'finished' and ((f.home_team_id = td.team_id and f.home_score > f.away_score) or (f.away_team_id = td.team_id and f.away_score > f.home_score))) +
      count(f.id) filter (where f.status = 'finished' and f.home_score = f.away_score)
    )::int
  from public.team_divisions td
  left join public.fixtures f on f.division_id = target_division and (f.home_team_id = td.team_id or f.away_team_id = td.team_id)
  where td.division_id = target_division
  group by td.team_id;
end $$;

create or replace function public.fixture_standings_trigger()
returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' and old.division_id is not null then
    perform public.refresh_division_standings(old.division_id);
  end if;
  if new.division_id is not null and (tg_op = 'INSERT' or new.division_id is distinct from old.division_id) then
    perform public.refresh_division_standings(new.division_id);
  end if;
  return new;
end $$;

drop trigger if exists fixture_refresh_standings on public.fixtures;
create trigger fixture_refresh_standings after insert or update on public.fixtures
for each row execute function public.fixture_standings_trigger();

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.competitions enable row level security;
alter table public.seasons enable row level security;
alter table public.tournaments enable row level security;
alter table public.leagues enable row level security;
alter table public.divisions enable row level security;
alter table public.venues enable row level security;
alter table public.teams enable row level security;
alter table public.team_divisions enable row level security;
alter table public.players enable row level security;
alter table public.player_statistics enable row level security;
alter table public.coaches enable row level security;
alter table public.team_coaches enable row level security;
alter table public.fixtures enable row level security;
alter table public.match_events enable row level security;
alter table public.standings enable row level security;
alter table public.articles enable row level security;
alter table public.sponsors enable row level security;
alter table public.rankings enable row level security;
alter table public.records enable row level security;
alter table public.contact_messages enable row level security;

create policy "Public read settings" on public.site_settings for select using (true);
create policy "Public read active competitions" on public.competitions for select using (status = 'active' or public.is_admin());
create policy "Public read active seasons" on public.seasons for select using (status = 'active' or public.is_admin());
create policy "Public read active tournaments" on public.tournaments for select using (status = 'active' or public.is_admin());
create policy "Public read active leagues" on public.leagues for select using (status = 'active' or public.is_admin());
create policy "Public read active divisions" on public.divisions for select using (status = 'active' or public.is_admin());
create policy "Public read venues" on public.venues for select using (not archived or public.is_admin());
create policy "Public read teams" on public.teams for select using (not archived or public.is_admin());
create policy "Public read team divisions" on public.team_divisions for select using (true);
create policy "Public read players" on public.players for select using (not archived or public.is_admin());
create policy "Public read player statistics" on public.player_statistics for select using (true);
create policy "Public read coaches" on public.coaches for select using (not archived or public.is_admin());
create policy "Public read team coaches" on public.team_coaches for select using (true);
create policy "Public read fixtures" on public.fixtures for select using (true);
create policy "Public read match events" on public.match_events for select using (true);
create policy "Public read standings" on public.standings for select using (true);
create policy "Public read published news" on public.articles for select using (status = 'published' or public.is_admin());
create policy "Public read active sponsors" on public.sponsors for select using (active or public.is_admin());
create policy "Public read rankings" on public.rankings for select using (true);
create policy "Public read records" on public.records for select using (true);
create policy "Users read own profile" on public.profiles for select using (id = auth.uid() or public.is_owner());
create policy "Owners update profiles" on public.profiles for all using (public.is_owner()) with check (public.is_owner());
create policy "Anyone sends contact" on public.contact_messages for insert with check (true);
create policy "Admins read contact" on public.contact_messages for select using (public.is_admin());

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'site_settings','competitions','seasons','tournaments','leagues','divisions','venues',
    'teams','team_divisions','players','player_statistics','coaches','team_coaches','fixtures',
    'match_events','standings','articles','sponsors','rankings','records','contact_messages'
  ] loop
    execute format('create policy "Admins manage %1$s" on public.%1$I for all using (public.is_admin()) with check (public.is_admin())', table_name);
  end loop;
end $$;

insert into storage.buckets (id, name, public) values ('media','media',true)
on conflict (id) do update set public = excluded.public;
create policy "Public media read" on storage.objects for select using (bucket_id = 'media');
create policy "Admins upload media" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
create policy "Admins update media" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
create policy "Admins delete media" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

do $$ begin
  alter publication supabase_realtime add table public.fixtures;
exception when duplicate_object then null;
end $$;

create index if not exists fixtures_starts_at_idx on public.fixtures(starts_at);
create index if not exists fixtures_division_idx on public.fixtures(division_id);
create index if not exists articles_status_date_idx on public.articles(status, published_at desc);
create index if not exists teams_name_idx on public.teams(name);
