# Downball Australia

A complete Next.js competition platform for Downball Australia, migrated from the original TeamLinkt league site and designed for long-term use without code edits.

## Included

- Public news, competitions, leagues, divisions, teams, players, fixtures, results, standings, rankings, records, venues, about, contact and search pages
- 24 VJDA 2025/26 Under 16 teams
- 7 original competition venues
- 9 original sponsor records
- 37 migrated news records (4 published sports stories and 33 private review drafts)
- Empty fixture, result and player states matching the source site at migration time
- Secure Supabase administrator login
- Content managers for branding, competitions, seasons, tournaments, leagues, divisions, teams, players, player statistics, coaches, venues, fixtures, live scores, standings, news, rankings, records and sponsors
- Supabase Storage uploads for logos, banners, photos and sponsor artwork
- Round-robin fixture generator
- Automatic standings recalculation when finished scores change
- Realtime public score updates
- Responsive black, gold and white sports-media design
- Search-engine metadata, structured data, sitemap, robots rules, social previews and canonical URLs
- Vercel and OpenAI Sites compatible configuration

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The website displays the complete migrated demo dataset when Supabase variables are not set.

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run:
   - `supabase/migrations/202607310001_downball_world_cup.sql`
   - `supabase/seed.sql`
3. In Authentication, create the administrator account.
4. Promote that user to owner in the SQL editor:

```sql
update public.profiles
set role = 'owner'
where email = 'YOUR_ADMIN_EMAIL';
```

5. Copy the project URL and anon key into `.env.local`.
6. Add the production URL to Supabase Authentication redirect URLs:
   - `https://YOUR-DOMAIN/auth/callback`

The service-role key is only required for the optional asset migration script. Never expose it through a `NEXT_PUBLIC_` variable.

## Environment variables

```dotenv
NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=SERVER-ONLY-KEY
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=OPTIONAL-SEARCH-CONSOLE-TOKEN
ADMIN_EMAIL=YOUR-ADMIN-EMAIL
```

## TeamLinkt media migration

The seed keeps the source TeamLinkt image URLs so the imported branding remains visible immediately. To copy every configured TeamLinkt-hosted image into your own Supabase Storage bucket:

```bash
npm run assets:migrate
```

Run this with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set in a trusted local environment. After migration, database records are updated to use your Supabase Storage URLs. Logos and images can also be replaced at any time in `/admin`.

## Administrator dashboard

Visit `/admin`. Once Supabase is configured:

- unauthenticated visitors are redirected to `/admin/login`
- only users with `owner`, `admin` or `editor` roles can change data
- owner accounts can manage administrator profiles through Supabase
- public users only see active/published records
- private news drafts never appear on the public website or sitemap

The fixture manager supports manual scheduling and a full round-robin generator. Mark a match `live` or `half-time` to show it in the realtime score strip; mark it `finished` to update standings.

## Search visibility

The code prepares the website for Google and Bing, but no platform can guarantee an instant search ranking.

After deploying publicly:

1. Set `NEXT_PUBLIC_SITE_URL` to the final domain.
2. Add that domain to Google Search Console.
3. Put the Search Console verification value in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
4. Submit `https://YOUR-DOMAIN/sitemap.xml`.
5. Keep the site public and publish useful original updates regularly.
6. If replacing the old TeamLinkt URL with a custom domain, configure redirects from any old domain you control.

## Commands

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm run build:vercel
npm run db:seed:generate
```

## Repository workflow

Development branch:

```text
feature/downball-world-cup-platform
```

The project is ready for a pull request into `main`.
