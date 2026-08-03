export type Team = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  location: string;
  colours: [string, string];
  logoUrl: string;
  venue?: string;
  description: string;
};

export type Standing = {
  teamId: string;
  played: number;
  won: number;
  lost: number;
  drawn: number;
  pointsFor: number;
  pointsAgainst: number;
  points: number;
};

export type Fixture = {
  id: string;
  round: string;
  homeTeamId: string;
  awayTeamId: string;
  startsAt: string;
  venue: string;
  status: "scheduled" | "live" | "half-time" | "delayed" | "postponed" | "cancelled" | "finished";
  homeScore?: number;
  awayScore?: number;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  publishedAt: string;
  status: "published" | "draft";
  sourceUrl?: string;
};

export type Sponsor = {
  id: string;
  name: string;
  url: string;
  logoUrl?: string;
  tier: "major" | "official";
};

export type Venue = {
  id: string;
  slug: string;
  name: string;
  address: string;
};

export type Player = {
  id: string;
  slug: string;
  name: string;
  teamId: string;
  number?: number;
  position?: string;
  nationality?: string;
  photoUrl?: string;
  heightCm?: number;
  weightKg?: number;
  biography?: string;
  awards?: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  logoUrl: string;
  primaryColour: string;
  accentColour: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
};

export type SiteData = {
  settings: SiteSettings;
  teams: Team[];
  standings: Standing[];
  fixtures: Fixture[];
  articles: Article[];
  sponsors: Sponsor[];
  venues: Venue[];
  players: Player[];
};
