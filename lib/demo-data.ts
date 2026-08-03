import type { Article, SiteData, Sponsor, Standing, Team, Venue } from "./types";

const associationLogo =
  "https://cdn-app.teamlinkt.com/media/association_data/31505/logo.png?1753873853";
const siteLogo =
  "https://cdn-app.teamlinkt.com/media/association_data/31505/site_data/images/1.png?v=1785146394";
const originalTeamLogos = [
  "https://cdn-app.teamlinkt.com/media/team_data/918339/images/logo_800.png?1785150241",
  "https://cdn-app.teamlinkt.com/media/team_data/918342/images/logo_800.png?1785150637",
  "https://cdn-app.teamlinkt.com/media/team_data/918341/images/logo_800.png?1785150698",
  "https://cdn-app.teamlinkt.com/media/team_data/918349/images/logo_800.png?1785150919",
  "https://cdn-app.teamlinkt.com/media/team_data/918329/images/logo_800.png?1785151090",
  "https://cdn-app.teamlinkt.com/media/team_data/918326/images/logo_800.png?1785151231",
  "https://cdn-app.teamlinkt.com/media/team_data/918327/images/logo_800.png?1785151308",
  "https://cdn-app.teamlinkt.com/media/team_data/918336/images/logo_800.png?1785225367",
  "https://cdn-app.teamlinkt.com/media/team_data/918332/images/logo_800.png?1785225613",
  "https://cdn-app.teamlinkt.com/media/team_data/918330/images/logo_800.png?1785225816",
  "https://cdn-app.teamlinkt.com/media/team_data/918340/images/logo_800.png?1785225940"
];

const teamNames = [
  "Altona",
  "Ballarat",
  "Bendigo",
  "Broadmeadows",
  "Bulleen",
  "Casey",
  "Dandenong",
  "Diamond Valley",
  "Eltham",
  "Frankston",
  "Geelong",
  "Keilor",
  "Kilsyth",
  "Knox",
  "McKinnon",
  "Melbourne",
  "Nunawading",
  "Pakenham",
  "Sandringham",
  "Sunbury",
  "Wangaratta",
  "Waverley",
  "Whittlesea",
  "Wyndham"
] as const;

const palettes: Array<[string, string]> = [
  ["#00a4e4", "#111827"],
  ["#c81d25", "#ffffff"],
  ["#003b70", "#f2b705"],
  ["#d71920", "#111827"],
  ["#1b5e20", "#f4c430"],
  ["#0057b8", "#ffffff"],
  ["#e31837", "#003478"],
  ["#00529b", "#f6c400"]
];

export const teams: Team[] = teamNames.map((name, index) => ({
  id: `team-${index + 1}`,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  name,
  shortName: name.slice(0, 3).toUpperCase(),
  location: `${name}, Victoria`,
  colours: palettes[index % palettes.length],
  logoUrl: originalTeamLogos[index] ?? associationLogo,
  description: `${name} competes in the VJDA 2025/26 Under 16 division.`
}));

export const standings: Standing[] = teams.map((team) => ({
  teamId: team.id,
  played: 0,
  won: 0,
  lost: 0,
  drawn: 0,
  pointsFor: 0,
  pointsAgainst: 0,
  points: 0
}));

export const venues: Venue[] = [
  ["cobblebank-stadium", "Cobblebank Stadium", "14 Stadium Drive, Cobblebank VIC"],
  ["dandenong-stadium", "Dandenong Stadium", "270 Stud Road, Dandenong North VIC"],
  ["eagle-stadium", "Eagle Stadium", "35 Ballan Road, Werribee VIC"],
  ["geelong-arena", "Geelong Arena", "110 Victoria Street, North Geelong VIC"],
  ["greenvale-recreation-centre", "Greenvale Recreation Centre", "27 Barrymore Road, Greenvale VIC"],
  ["hume-city-stadium", "Hume City Stadium", "Broadmeadows, VIC"],
  ["red-energy-arena", "Red Energy Arena Bendigo", "91 Inglis Street, Bendigo VIC"]
].map(([slug, name, address], index) => ({ id: `venue-${index + 1}`, slug, name, address }));

export const sponsors: Sponsor[] = [
  ["3-point-motors", "3 Point Motors", "https://showroom.mb3point.com.au/", "https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12691.png?1771757665", "major"],
  ["hungry-jacks", "Hungry Jack’s", "https://www.hungryjacks.com.au/home", "https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12695.png?1771757897", "major"],
  ["aami", "AAMI", "https://www.aami.com.au/", "https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12693.png?1771757803", "official"],
  ["hyundai", "Hyundai", "https://www.hyundai.com/au/en", "https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_10443.png?1754210385", "official"],
  ["gatorade", "Gatorade", "https://www.gatorade.com.au/", "https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_10442.png?1754210276", "official"],
  ["kfc", "KFC", "https://www.kfc.com.au/", "https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_10444.png?1754210442", "official"],
  ["harvey-norman", "Harvey Norman", "https://www.harveynorman.com.au/", "https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12692.png?1771757709", "official"],
  ["qatar-airways", "Qatar Airways", "https://www.qatarairways.com/en-au/homepage.html", "https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12696.png?1771757947", "official"],
  ["chemist-warehouse", "Chemist Warehouse", "https://www.chemistwarehouse.com.au/", "https://cdn-app.teamlinkt.com/media/association_data/31505/sponsors/images/logo_12694.png?1771757846", "official"]
].map(([id, name, url, logoUrl, tier]) => ({
  id,
  name,
  url,
  logoUrl,
  tier: tier as Sponsor["tier"]
}));

const publishedArticles: Article[] = [
  {
    id: "article-34569",
    slug: "jack-rangi-new-zealand-world-cup-comeback",
    title: "Jack Rangi leads New Zealand to historic World Cup comeback",
    excerpt: "New Zealand completed a record Downball World Cup comeback against India.",
    body: "New Zealand recovered from a major halftime deficit to win a memorable World Cup contest. Jack Rangi led the turnaround with an outstanding second-half performance.",
    imageUrl: "https://cdn-app.teamlinkt.com/media/news_items/34569/news_item.jpeg?v=1753962346",
    publishedAt: "2025-07-31T09:00:00+10:00",
    status: "published",
    sourceUrl: "https://leagues.teamlinkt.com/leagues/NewsItem/31505/34569"
  },
  {
    id: "article-36895",
    slug: "south-africa-upsets-england-dandenong",
    title: "South Africa upsets England 116–112 in Dandenong",
    excerpt: "South Africa secured a four-point Downball World Cup victory over England.",
    body: "South Africa defeated England 116–112 in a high-scoring match at Dandenong Stadium. The result was one of the standout upsets of the competition.",
    imageUrl: "https://cdn-app.teamlinkt.com/media/news_items/36895/news_item.jpeg?v=1760220317",
    publishedAt: "2025-10-11T09:00:00+11:00",
    status: "published",
    sourceUrl: "https://leagues.teamlinkt.com/leagues/NewsItem/31505/36895"
  },
  {
    id: "article-36639",
    slug: "south-africa-australia-team-updates",
    title: "South Africa vs Australia: team updates",
    excerpt: "Squad news ahead of the Downball World Cup clash between South Africa and Australia.",
    body: "South Africa and Australia confirmed their squads ahead of a major Downball World Cup meeting. The match brings together two teams with strong tournament ambitions.",
    imageUrl: "https://cdn-app.teamlinkt.com/media/news_items/36639/news_item.jpeg?v=1759472443",
    publishedAt: "2025-10-03T09:00:00+10:00",
    status: "published",
    sourceUrl: "https://leagues.teamlinkt.com/leagues/NewsItem/31505/36639"
  },
  {
    id: "article-34879",
    slug: "argentina-brazil-bendigo-downball-upset",
    title: "Argentina wins 103–98 Downball upset over Brazil",
    excerpt: "Argentina claimed a close World Cup victory over Brazil at Red Energy Arena.",
    body: "Argentina defeated Brazil 103–98 in Bendigo, with Bruno Fernandez producing a composed all-round performance in a close finish.",
    imageUrl: "https://cdn-app.teamlinkt.com/media/news_items/34879/news_item.jpeg?v=1754873447",
    publishedAt: "2025-08-11T17:40:00+10:00",
    status: "published",
    sourceUrl: "https://leagues.teamlinkt.com/leagues/NewsItem/31505/34879"
  }
];

const archivedIds = [46520,41410,40761,40725,38440,37983,37721,37476,37016,36971,36919,36897,36684,36490,35980,35945,35907,35825,35790,35588,35476,35474,35440,35337,35242,35170,35056,34974,34915,34777,34703,34702,34586];
const archivedArticles: Article[] = archivedIds.map((sourceId, index) => ({
  id: `teamlinkt-archive-${index + 1}`,
  slug: `teamlinkt-archive-${String(index + 1).padStart(2, "0")}`,
  title: `Imported TeamLinkt draft ${String(index + 1).padStart(2, "0")}`,
  excerpt: "Imported for administrator review before publication.",
  body: "This original-site record is preserved as a private draft. Review and edit it in the administration dashboard before publishing.",
  imageUrl: siteLogo,
  publishedAt: new Date(Date.UTC(2026, 6, 17 - index)).toISOString(),
  status: "draft" as const,
  sourceUrl: `https://leagues.teamlinkt.com/leagues/NewsItem/31505/${sourceId}`
}));

export const articles = [...publishedArticles, ...archivedArticles];

export const demoData: SiteData = {
  settings: {
    siteName: "Downball Australia",
    tagline: "The home of Australian Downball",
    logoUrl: siteLogo,
    primaryColour: "#090909",
    accentColour: "#f5c518",
    contactEmail: "admin@downballaustralia.com.au",
    contactPhone: "(041) 939-1939",
    location: "Melbourne, Victoria"
  },
  teams,
  standings,
  fixtures: [],
  articles,
  sponsors,
  venues,
  players: []
};
