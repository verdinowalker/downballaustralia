-- Migration: add player_match_statistics table
-- Date: 2026-08-03

create table if not exists public.player_match_statistics (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid not null references public.fixtures(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  minutes integer not null default 0,
  points integer not null default 0,
  assists integer not null default 0,
  cherries integer not null default 0,
  outs integer not null default 0,
  queens integer not null default 0,
  kings integer not null default 0,
  aces integer not null default 0,
  plus_minus integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(fixture_id, player_id),
  check (minutes >= 0),
  check (points >= 0),
  check (assists >= 0),
  check (cherries >= 0),
  check (outs >= 0),
  check (queens >= 0),
  check (kings >= 0),
  check (aces >= 0),
  check (kings <= queens)
);

create index if not exists player_match_stats_fixture_idx on public.player_match_statistics(fixture_id);
create index if not exists player_match_stats_player_idx on public.player_match_statistics(player_id);
