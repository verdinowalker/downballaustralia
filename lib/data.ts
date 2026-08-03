import { cache } from "react";
import { demoData } from "./demo-data";
import { createSupabaseServerClient } from "./supabase/server";
import type { SiteData, PlayerMatchStatistic } from "./types";

export const getSiteData = cache(async (): Promise<SiteData> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoData;

  const [settings, teams, standings, fixtures, articles, sponsors, venues, players, playerStats] =
    await Promise.all([
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
      supabase.from("teams").select("*").eq("archived", false).order("name"),
      supabase.from("standings").select("*").order("points", { ascending: false }),
      supabase.from("fixtures").select("*").order("starts_at"),
      supabase.from("articles").select("*").eq("status", "published").order("published_at", { ascending: false }),
      supabase.from("sponsors").select("*").eq("active", true).order("sort_order"),
      supabase.from("venues").select("*").eq("archived", false).order("name"),
      supabase.from("players").select("*").eq("archived", false).order("name"),
      supabase.from("player_match_statistics").select("*").order("created_at")
    ]);

  if (teams.error || !teams.data?.length) return demoData;

  const data: SiteData = {
    settings: settings.data
      ? {
          siteName: settings.data.site_name,
          tagline: settings.data.tagline,
          logoUrl: settings.data.logo_url,
          primaryColour: settings.data.primary_colour,
          accentColour: settings.data.accent_colour,
          contactEmail: settings.data.contact_email,
          contactPhone: settings.data.contact_phone,
          location: settings.data.location
        }
      : demoData.settings,
    teams: teams.data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      shortName: item.short_name,
      location: item.location,
      colours: [item.primary_colour, item.secondary_colour],
      logoUrl: item.logo_url,
      venue: item.home_venue_id ?? undefined,
      description: item.description
    })),
    standings: (standings.data ?? []).map((item: any) => ({
      teamId: item.team_id,
      played: item.played,
      won: item.won,
      lost: item.lost,
      drawn: item.drawn,
      pointsFor: item.points_for,
      pointsAgainst: item.points_against,
      points: item.points
    })),
    fixtures: (fixtures.data ?? []).map((item: any) => ({
      id: item.id,
      round: item.round_name,
      homeTeamId: item.home_team_id,
      awayTeamId: item.away_team_id,
      startsAt: item.starts_at,
      venue: item.venue_name ?? "",
      status: item.status,
      homeScore: item.home_score,
      awayScore: item.away_score
    })),
    articles: (articles.data ?? []).map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      body: item.body,
      imageUrl: item.image_url,
      publishedAt: item.published_at,
      status: item.status,
      sourceUrl: item.source_url
    })),
    sponsors: (sponsors.data ?? []).map((item: any) => ({
      id: item.id,
      name: item.name,
      url: item.website_url,
      logoUrl: item.logo_url,
      tier: item.tier
    })),
    venues: (venues.data ?? []).map((item: any) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      address: item.address
    })),
    players: (players.data ?? []).map((item: any) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      teamId: item.team_id,
      number: item.jersey_number,
      position: item.position,
      nationality: item.nationality
    })),
    playerMatchStatistics: (playerStats.data ?? []).map((row: any) => ({
      id: row.id,
      fixtureId: row.fixture_id,
      playerId: row.player_id,
      teamId: row.team_id,
      minutes: row.minutes,
      points: row.points,
      assists: row.assists,
      cherries: row.cherries,
      outs: row.outs,
      queens: row.queens,
      kings: row.kings,
      aces: row.aces,
      plusMinus: row.plus_minus
    }))
  };

  return data;
});
