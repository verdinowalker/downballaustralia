-- Downball Australia / TeamLinkt migration seed
-- Safe to run after the 202607310001 migration.

insert into public.site_settings (
  id, site_name, tagline, logo_url, primary_colour, accent_colour,
  contact_email, contact_phone, location
) values (
  '00000000-0000-0000-0000-000000000005',
  'Downball Australia',
  'The home of Australian Downball',
  'https://cdn-app.teamlinkt.com/media/association_data/31505/site_data/images/1.png?v=1785146394',
  '#090909',
  '#f5c518',
  'admin@downballaustralia.com.au',
  '(041) 939-1939',
  'Melbourne, Victoria'
) on conflict (id) do update set
  site_name = excluded.site_name,
  tagline = excluded.tagline,
  logo_url = excluded.logo_url,
  primary_colour = excluded.primary_colour,
  accent_colour = excluded.accent_colour,
  contact_email = excluded.contact_email,
  contact_phone = excluded.contact_phone,
  location = excluded.location;

insert into public.competitions (
  id, name, slug, description, logo_url, competition_type, region, status
) values (
  '00000000-0000-0000-0000-000000000001',
  'Downball Australia',
  'downball-australia',
  'The official national Downball competition platform.',
  'https://cdn-app.teamlinkt.com/media/association_data/31505/site_data/images/1.png?v=1785146394',
  'League and tournament',
  'Australia',
  'active'
) on conflict (id) do nothing;

insert into public.seasons (id, competition_id, name, slug, starts_on, ends_on, status)
values (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  '2025/26',
  '2025-26',
  '2025-07-01',
  '2026-06-30',
  'active'
) on conflict (id) do nothing;

insert into public.leagues (id, competition_id, season_id, name, slug, description, status)
values (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'Victorian Junior Downball Association',
  'vjda',
  'The migrated VJDA league.',
  'active'
) on conflict (id) do nothing;

insert into public.divisions (id, competition_id, season_id, league_id, name, slug, description, status)
values (
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  'VJDA 2025/26 Under 16',
  'vjda-2025-26-u16',
  'Twenty-four Victorian clubs.',
  'active'
) on conflict (id) do nothing;

insert into public.venues (id, name, slug, address) values
  ('10000000-0000-0000-0000-000000000001','Cobblebank Stadium','cobblebank-stadium','14 Stadium Drive, Cobblebank VIC'),
  ('10000000-0000-0000-0000-000000000002','Dandenong Stadium','dandenong-stadium','270 Stud Road, Dandenong North VIC'),
  ('10000000-0000-0000-0000-000000000003','Eagle Stadium','eagle-stadium','35 Ballan Road, Werribee VIC'),
  ('10000000-0000-0000-0000-000000000004','Geelong Arena','geelong-arena','110 Victoria Street, North Geelong VIC'),
  ('10000000-0000-0000-0000-000000000005','Greenvale Recreation Centre','greenvale-recreation-centre','27 Barrymore Road, Greenvale VIC'),
  ('10000000-0000-0000-0000-000000000006','Hume City Stadium','hume-city-stadium','Broadmeadows, VIC'),
  ('10000000-0000-0000-0000-000000000007','Red Energy Arena Bendigo','red-energy-arena','91 Inglis Street, Bendigo VIC')
on conflict (id) do update set name = excluded.name, address = excluded.address;

insert into public.teams (
  id, name, slug, short_name, logo_url, primary_colour, secondary_colour, location, description
) values
  ('20000000-0000-0000-0000-000000000001','Altona','altona','ALT','https://cdn-app.teamlinkt.com/media/team_data/918339/images/logo_800.png?1785150241','#00a4e4','#111827','Altona, Victoria','Altona competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000002','Ballarat','ballarat','BAL','https://cdn-app.teamlinkt.com/media/team_data/918342/images/logo_800.png?1785150637','#c81d25','#ffffff','Ballarat, Victoria','Ballarat competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000003','Bendigo','bendigo','BEN','https://cdn-app.teamlinkt.com/media/team_data/918341/images/logo_800.png?1785150698','#003b70','#f2b705','Bendigo, Victoria','Bendigo competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000004','Broadmeadows','broadmeadows','BRO','https://cdn-app.teamlinkt.com/media/team_data/918349/images/logo_800.png?1785150919','#d71920','#111827','Broadmeadows, Victoria','Broadmeadows competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000005','Bulleen','bulleen','BUL','https://cdn-app.teamlinkt.com/media/team_data/918329/images/logo_800.png?1785151090','#1b5e20','#f4c430','Bulleen, Victoria','Bulleen competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000006','Casey','casey','CAS','https://cdn-app.teamlinkt.com/media/team_data/918326/images/logo_800.png?1785151231','#0057b8','#ffffff','Casey, Victoria','Casey competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000007','Dandenong','dandenong','DAN','https://cdn-app.teamlinkt.com/media/team_data/918327/images/logo_800.png?1785151308','#e31837','#003478','Dandenong, Victoria','Dandenong competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000008','Diamond Valley','diamond-valley','DIA','https://cdn-app.teamlinkt.com/media/team_data/918336/images/logo_800.png?1785225367','#00529b','#f6c400','Diamond Valley, Victoria','Diamond Valley competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000009','Eltham','eltham','ELT','https://cdn-app.teamlinkt.com/media/team_data/918332/images/logo_800.png?1785225613','#00a4e4','#111827','Eltham, Victoria','Eltham competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000010','Frankston','frankston','FRA','https://cdn-app.teamlinkt.com/media/team_data/918330/images/logo_800.png?1785225816','#c81d25','#ffffff','Frankston, Victoria','Frankston competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000011','Geelong','geelong','GEE','https://cdn-app.teamlinkt.com/media/team_data/918340/images/logo_800.png?1785225940','#003b70','#f2b705','Geelong, Victoria','Geelong competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000012','Keilor','keilor','KEI','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#d71920','#111827','Keilor, Victoria','Keilor competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000013','Kilsyth','kilsyth','KIL','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#1b5e20','#f4c430','Kilsyth, Victoria','Kilsyth competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000014','Knox','knox','KNO','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#0057b8','#ffffff','Knox, Victoria','Knox competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000015','McKinnon','mckinnon','MCK','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#e31837','#003478','McKinnon, Victoria','McKinnon competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000016','Melbourne','melbourne','MEL','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#00529b','#f6c400','Melbourne, Victoria','Melbourne competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000017','Nunawading','nunawading','NUN','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#00a4e4','#111827','Nunawading, Victoria','Nunawading competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000018','Pakenham','pakenham','PAK','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#c81d25','#ffffff','Pakenham, Victoria','Pakenham competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000019','Sandringham','sandringham','SAN','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#003b70','#f2b705','Sandringham, Victoria','Sandringham competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000020','Sunbury','sunbury','SUN','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#d71920','#111827','Sunbury, Victoria','Sunbury competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000021','Wangaratta','wangaratta','WAN','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#1b5e20','#f4c430','Wangaratta, Victoria','Wangaratta competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000022','Waverley','waverley','WAV','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#0057b8','#ffffff','Waverley, Victoria','Waverley competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000023','Whittlesea','whittlesea','WHI','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#e31837','#003478','Whittlesea, Victoria','Whittlesea competes in the VJDA 2025/26 Under 16 division.'),
  ('20000000-0000-0000-0000-000000000024','Wyndham','wyndham','WYN','https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853','#00529b','#f6c400','Wyndham, Victoria','Wyndham competes in the VJDA 2025/26 Under 16 division.')
on conflict (id) do update set name = excluded.name, logo_url = excluded.logo_url, location = excluded.location;

insert into public.team_divisions (team_id, division_id)
select id, '00000000-0000-0000-0000-000000000004' from public.teams
where id::text like '20000000-0000-0000-0000-%'
on conflict do nothing;

select public.refresh_division_standings('00000000-0000-0000-0000-000000000004');

insert into public.sponsors (id, name, website_url, logo_url, tier, sort_order, active) values
  ('40000000-0000-0000-0000-000000000001','3 Point Motors','https://showroom.mb3point.com.au/','https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12691.png?1771757665','major',1,true),
  ('40000000-0000-0000-0000-000000000002','Hungry Jack’s','https://www.hungryjacks.com.au/home','https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12695.png?1771757897','major',2,true),
  ('40000000-0000-0000-0000-000000000003','AAMI','https://www.aami.com.au/','https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12693.png?1771757803','official',3,true),
  ('40000000-0000-0000-0000-000000000004','Hyundai','https://www.hyundai.com/au/en','https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_10443.png?1754210385','official',4,true),
  ('40000000-0000-0000-0000-000000000005','Gatorade','https://www.gatorade.com.au/','https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_10442.png?1754210276','official',5,true),
  ('40000000-0000-0000-0000-000000000006','KFC','https://www.kfc.com.au/','https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_10444.png?1754210442','official',6,true),
  ('40000000-0000-0000-0000-000000000007','Harvey Norman','https://www.harveynorman.com.au/','https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12692.png?1771757709','official',7,true),
  ('40000000-0000-0000-0000-000000000008','Qatar Airways','https://www.qatarairways.com/en-au/homepage.html','https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12696.png?1771757947','official',8,true),
  ('40000000-0000-0000-0000-000000000009','Chemist Warehouse','https://www.chemistwarehouse.com.au/','https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12694.png?1771757846','official',9,true)
on conflict (id) do update set name = excluded.name, website_url = excluded.website_url, logo_url = excluded.logo_url, tier = excluded.tier, sort_order = excluded.sort_order;

insert into public.articles (
  id, title, slug, excerpt, body, image_url, published_at, status, featured, source_url
) values
  ('30000000-0000-0000-0000-000000000001','Jack Rangi leads New Zealand to historic World Cup comeback','jack-rangi-new-zealand-world-cup-comeback','New Zealand completed a record Downball World Cup comeback against India.','New Zealand recovered from a major halftime deficit to win a memorable World Cup contest. Jack Rangi led the turnaround with an outstanding second-half performance.','https://cdn-app.teamlinkt.com/media/news_items/34569/news_item.jpeg?v=1753962346','2025-07-31 09:00:00+10','published',true,'https://leagues.teamlinkt.com/leagues/NewsItem/31505/34569'),
  ('30000000-0000-0000-0000-000000000002','South Africa upsets England 116–112 in Dandenong','south-africa-upsets-england-dandenong','South Africa secured a four-point Downball World Cup victory over England.','South Africa defeated England 116–112 in a high-scoring match at Dandenong Stadium. The result was one of the standout upsets of the competition.','https://cdn-app.teamlinkt.com/media/news_items/36895/news_item.jpeg?v=1760220317','2025-10-11 09:00:00+11','published',false,'https://leagues.teamlinkt.com/leagues/NewsItem/31505/36895'),
  ('30000000-0000-0000-0000-000000000003','South Africa vs Australia: team updates','south-africa-australia-team-updates','Squad news ahead of the Downball World Cup clash between South Africa and Australia.','South Africa and Australia confirmed their squads ahead of a major Downball World Cup meeting. The match brings together two teams with strong tournament ambitions.','https://cdn-app.teamlinkt.com/media/news_items/36639/news_item.jpeg?v=1759472443','2025-10-03 09:00:00+10','published',false,'https://leagues.teamlinkt.com/leagues/NewsItem/31505/36639'),
  ('30000000-0000-0000-0000-000000000004','Argentina wins 103–98 Downball upset over Brazil','argentina-brazil-bendigo-downball-upset','Argentina claimed a close World Cup victory over Brazil at Red Energy Arena.','Argentina defeated Brazil 103–98 in Bendigo, with Bruno Fernandez producing a composed all-round performance in a close finish.','https://cdn-app.teamlinkt.com/media/news_items/34879/news_item.jpeg?v=1754873447','2025-08-11 17:40:00+10','published',false,'https://leagues.teamlinkt.com/leagues/NewsItem/31505/34879')
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  excerpt = excluded.excerpt,
  body = excluded.body,
  image_url = excluded.image_url,
  published_at = excluded.published_at,
  status = excluded.status,
  featured = excluded.featured,
  source_url = excluded.source_url;

insert into public.articles (
  id, title, slug, excerpt, body, image_url, published_at, status, featured, source_url
)
select
  ('30000000-0000-0000-0000-' || lpad((n + 4)::text, 12, '0'))::uuid,
  'Imported TeamLinkt draft ' || lpad(n::text, 2, '0'),
  'teamlinkt-archive-' || lpad(n::text, 2, '0'),
  'Imported for administrator review before publication.',
  'This original-site record is preserved as a private draft. Review and edit it in the administration dashboard before publishing.',
  'https://cdn-app.teamlinkt.com/media/association_data/31505/site_data/images/1.png?v=1785146394',
  now() - (n || ' days')::interval,
  'draft',
  false,
  'https://leagues.teamlinkt.com/leagues/NewsItem/31505/' ||
    (array[46520,41410,40761,40725,38440,37983,37721,37476,37016,36971,36919,36897,36684,36490,35980,35945,35907,35825,35790,35588,35476,35474,35440,35337,35242,35170,35056,34974,34915,34777,34703,34702,34586])[n]::text
from generate_series(1, 33) as n
on conflict (id) do nothing;

-- The original TeamLinkt schedule had no events and no public player rosters
-- at migration time, so fixtures, results and players intentionally begin empty.
