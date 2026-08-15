create table if not exists public.match_player_statistics (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid not null references public.fixtures(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  minutes numeric(6,1) not null default 0,
  plus_one integer not null default 0,
  plus_two integer not null default 0,
  assists integer not null default 0,
  steals integer not null default 0,
  blocks integer not null default 0,
  turnovers integer not null default 0,
  cherries integer not null default 0,
  outs integer not null default 0,
  kings integer not null default 0,
  queens integer not null default 0,
  points integer not null default 0,
  aces integer not null default 0,
  plus_minus integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(fixture_id, player_id)
);

create index if not exists match_player_stats_fixture_idx on public.match_player_statistics(fixture_id);
create index if not exists match_player_stats_player_idx on public.match_player_statistics(player_id);

create or replace function public.refresh_official_player_statistics(target_player uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from public.player_statistics
  where player_id = target_player and label like 'Official %';

  insert into public.player_statistics (player_id, season_id, label, matches, points, wins, losses, is_career)
  select
    m.player_id,
    f.season_id,
    'Official ' || coalesce(s.name, 'Season'),
    count(distinct f.id)::int,
    coalesce(sum(m.points), 0)::int,
    count(distinct f.id) filter (where
      (m.team_id = f.home_team_id and f.home_score > f.away_score) or
      (m.team_id = f.away_team_id and f.away_score > f.home_score)
    )::int,
    count(distinct f.id) filter (where
      (m.team_id = f.home_team_id and f.home_score < f.away_score) or
      (m.team_id = f.away_team_id and f.away_score < f.home_score)
    )::int,
    false
  from public.match_player_statistics m
  join public.fixtures f on f.id = m.fixture_id and f.status = 'finished'
  left join public.seasons s on s.id = f.season_id
  where m.player_id = target_player
  group by m.player_id, f.season_id, s.name;

  insert into public.player_statistics (player_id, season_id, label, matches, points, wins, losses, is_career)
  select
    m.player_id,
    null,
    'Official Career',
    count(distinct f.id)::int,
    coalesce(sum(m.points), 0)::int,
    count(distinct f.id) filter (where
      (m.team_id = f.home_team_id and f.home_score > f.away_score) or
      (m.team_id = f.away_team_id and f.away_score > f.home_score)
    )::int,
    count(distinct f.id) filter (where
      (m.team_id = f.home_team_id and f.home_score < f.away_score) or
      (m.team_id = f.away_team_id and f.away_score < f.home_score)
    )::int,
    true
  from public.match_player_statistics m
  join public.fixtures f on f.id = m.fixture_id and f.status = 'finished'
  where m.player_id = target_player
  group by m.player_id
  having count(distinct f.id) > 0;
end $$;

create or replace function public.match_player_stats_refresh_trigger()
returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_official_player_statistics(old.player_id);
    return old;
  end if;

  perform public.refresh_official_player_statistics(new.player_id);
  if tg_op = 'UPDATE' and old.player_id is distinct from new.player_id then
    perform public.refresh_official_player_statistics(old.player_id);
  end if;
  return new;
end $$;

drop trigger if exists match_player_stats_refresh on public.match_player_statistics;
create trigger match_player_stats_refresh
after insert or update or delete on public.match_player_statistics
for each row execute function public.match_player_stats_refresh_trigger();

create or replace function public.fixture_player_stats_refresh_trigger()
returns trigger language plpgsql as $$
declare
  player_row record;
begin
  if tg_op = 'UPDATE' and (new.status is distinct from old.status or new.home_score is distinct from old.home_score or new.away_score is distinct from old.away_score) then
    for player_row in select distinct player_id from public.match_player_statistics where fixture_id = new.id loop
      perform public.refresh_official_player_statistics(player_row.player_id);
    end loop;
  end if;
  return new;
end $$;

drop trigger if exists fixture_player_stats_refresh on public.fixtures;
create trigger fixture_player_stats_refresh
after update of status, home_score, away_score on public.fixtures
for each row execute function public.fixture_player_stats_refresh_trigger();

alter table public.match_player_statistics enable row level security;
create policy "Public read match player statistics" on public.match_player_statistics for select using (true);
create policy "Admins manage match player statistics" on public.match_player_statistics for all using (public.is_admin()) with check (public.is_admin());

do $$ begin
  alter publication supabase_realtime add table public.match_player_statistics;
exception when duplicate_object then null;
end $$;

create trigger set_updated_at before update on public.match_player_statistics
for each row execute function public.set_updated_at();
