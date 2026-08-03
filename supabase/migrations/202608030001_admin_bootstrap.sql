-- Ensure the first authenticated account can actually administer the site.
-- Existing installs with no owner promote the oldest profile once.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role text;
begin
  select case
    when exists (select 1 from public.profiles where role = 'owner') then 'viewer'
    else 'owner'
  end into assigned_role;

  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    assigned_role
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(public.profiles.display_name, excluded.display_name);

  return new;
end;
$$;

-- Repair databases created with the original migration, where every user was a viewer.
do $$
declare
  first_profile uuid;
begin
  if not exists (select 1 from public.profiles where role = 'owner') then
    select id into first_profile
    from public.profiles
    order by created_at asc
    limit 1;

    if first_profile is not null then
      update public.profiles
      set role = 'owner', updated_at = now()
      where id = first_profile;
    end if;
  end if;
end;
$$;
