alter table public.players
add column if not exists weight_kg numeric(5,2);

comment on column public.players.weight_kg is 'Player weight in kilograms, editable by authorised administrators.';
