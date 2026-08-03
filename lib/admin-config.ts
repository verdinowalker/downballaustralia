export type AdminField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "date" | "datetime-local" | "color" | "url" | "select" | "boolean" | "image";
  options?: Array<{ label: string; value: string }>;
  required?: boolean;
};

export type AdminResource = {
  table: string;
  label: string;
  singular: string;
  description: string;
  titleKey: string;
  fields: AdminField[];
  singleton?: boolean;
};

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" }
];

export const adminResources: Record<string, AdminResource> = {
  branding: {
    table: "site_settings",
    label: "Branding",
    singular: "branding settings",
    description: "Control the site name, logo, colours, contact details and social links.",
    titleKey: "site_name",
    singleton: true,
    fields: [
      { key: "site_name", label: "Site name", required: true },
      { key: "tagline", label: "Tagline" },
      { key: "logo_url", label: "Logo", type: "image" },
      { key: "banner_url", label: "Banner", type: "image" },
      { key: "primary_colour", label: "Primary colour", type: "color" },
      { key: "accent_colour", label: "Accent colour", type: "color" },
      { key: "contact_email", label: "Contact email" },
      { key: "contact_phone", label: "Contact phone" },
      { key: "location", label: "Location" },
      { key: "facebook_url", label: "Facebook URL", type: "url" },
      { key: "instagram_url", label: "Instagram URL", type: "url" },
      { key: "youtube_url", label: "YouTube URL", type: "url" }
    ]
  },
  competitions: {
    table: "competitions", label: "Competitions", singular: "competition", titleKey: "name",
    description: "Create and manage unlimited competitions.",
    fields: [
      { key: "name", label: "Name", required: true }, { key: "slug", label: "Slug", required: true },
      { key: "description", label: "Description", type: "textarea" }, { key: "logo_url", label: "Logo", type: "image" },
      { key: "banner_url", label: "Banner", type: "image" }, { key: "competition_type", label: "Competition type" },
      { key: "region", label: "Country or region" }, { key: "starts_on", label: "Start date", type: "date" },
      { key: "ends_on", label: "End date", type: "date" }, { key: "status", label: "Status", type: "select", options: statusOptions }
    ]
  },
  seasons: {
    table: "seasons", label: "Seasons", singular: "season", titleKey: "name", description: "Create active and archived seasons.",
    fields: [
      { key: "competition_id", label: "Competition ID", required: true }, { key: "name", label: "Name", required: true },
      { key: "slug", label: "Slug", required: true }, { key: "starts_on", label: "Start date", type: "date" },
      { key: "ends_on", label: "End date", type: "date" }, { key: "status", label: "Status", type: "select", options: statusOptions }
    ]
  },
  tournaments: {
    table: "tournaments", label: "Tournaments", singular: "tournament", titleKey: "name", description: "Manage cup and tournament formats.",
    fields: [
      { key: "competition_id", label: "Competition ID", required: true }, { key: "season_id", label: "Season ID" },
      { key: "name", label: "Name", required: true }, { key: "slug", label: "Slug", required: true },
      { key: "description", label: "Description", type: "textarea" }, { key: "starts_on", label: "Start date", type: "date" },
      { key: "ends_on", label: "End date", type: "date" }, { key: "status", label: "Status", type: "select", options: statusOptions }
    ]
  },
  leagues: {
    table: "leagues", label: "Leagues", singular: "league", titleKey: "name", description: "Create, order and archive leagues.",
    fields: [
      { key: "competition_id", label: "Competition ID", required: true }, { key: "season_id", label: "Season ID" },
      { key: "name", label: "Name", required: true }, { key: "slug", label: "Slug", required: true },
      { key: "description", label: "Description", type: "textarea" }, { key: "sort_order", label: "Order", type: "number" },
      { key: "status", label: "Status", type: "select", options: statusOptions }
    ]
  },
  divisions: {
    table: "divisions", label: "Divisions", singular: "division", titleKey: "name", description: "Organise teams, fixtures and standings by division.",
    fields: [
      { key: "competition_id", label: "Competition ID", required: true }, { key: "season_id", label: "Season ID", required: true },
      { key: "league_id", label: "League ID" }, { key: "name", label: "Name", required: true },
      { key: "slug", label: "Slug", required: true }, { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Order", type: "number" }, { key: "status", label: "Status", type: "select", options: statusOptions }
    ]
  },
  teams: {
    table: "teams", label: "Teams", singular: "team", titleKey: "name", description: "Control club profiles, logos, colours and venues.",
    fields: [
      { key: "name", label: "Team name", required: true }, { key: "slug", label: "Slug", required: true },
      { key: "short_name", label: "Short name" }, { key: "logo_url", label: "Team logo", type: "image" },
      { key: "primary_colour", label: "Primary colour", type: "color" }, { key: "secondary_colour", label: "Secondary colour", type: "color" },
      { key: "location", label: "Location" }, { key: "home_venue_id", label: "Home venue ID" },
      { key: "description", label: "Description", type: "textarea" }, { key: "archived", label: "Archived", type: "boolean" }
    ]
  },
  players: {
    table: "players", label: "Players", singular: "player", titleKey: "name", description: "Manage player profiles, teams and statistics.",
    fields: [
      { key: "team_id", label: "Team ID" }, { key: "season_id", label: "Season ID" },
      { key: "name", label: "Player name", required: true }, { key: "slug", label: "Slug", required: true },
      { key: "photo_url", label: "Player photo", type: "image" }, { key: "jersey_number", label: "Jersey number", type: "number" },
      { key: "position", label: "Position" }, { key: "height_cm", label: "Height (cm)", type: "number" },
      { key: "nationality", label: "Nationality" }, { key: "age_group", label: "Age or age group" },
      { key: "biography", label: "Biography", type: "textarea" }, { key: "awards", label: "Awards", type: "textarea" },
      { key: "archived", label: "Archived", type: "boolean" }
    ]
  },
  coaches: {
    table: "coaches", label: "Coaches", singular: "coach", titleKey: "name", description: "Manage coaches and team assignments.",
    fields: [
      { key: "name", label: "Name", required: true }, { key: "slug", label: "Slug", required: true },
      { key: "photo_url", label: "Photo", type: "image" }, { key: "role", label: "Role" },
      { key: "biography", label: "Biography", type: "textarea" }, { key: "archived", label: "Archived", type: "boolean" }
    ]
  },
  venues: {
    table: "venues", label: "Venues", singular: "venue", titleKey: "name", description: "Manage venue addresses and details.",
    fields: [
      { key: "name", label: "Venue name", required: true }, { key: "slug", label: "Slug", required: true },
      { key: "address", label: "Address", required: true }, { key: "map_url", label: "Map URL", type: "url" },
      { key: "description", label: "Description", type: "textarea" }, { key: "archived", label: "Archived", type: "boolean" }
    ]
  },
  fixtures: {
    table: "fixtures", label: "Fixtures & scores", singular: "fixture", titleKey: "round_name", description: "Schedule matches and update live or final scores.",
    fields: [
      { key: "competition_id", label: "Competition ID", required: true }, { key: "season_id", label: "Season ID", required: true },
      { key: "league_id", label: "League ID" }, { key: "division_id", label: "Division ID" },
      { key: "round_name", label: "Round", required: true }, { key: "home_team_id", label: "Home team ID", required: true },
      { key: "away_team_id", label: "Away team ID", required: true }, { key: "starts_at", label: "Date and time", type: "datetime-local", required: true },
      { key: "venue_id", label: "Venue ID" }, { key: "notes", label: "Notes", type: "textarea" },
      { key: "status", label: "Status", type: "select", options: [
        { label: "Scheduled", value: "scheduled" }, { label: "Live", value: "live" }, { label: "Half-time", value: "half-time" },
        { label: "Delayed", value: "delayed" }, { label: "Postponed", value: "postponed" }, { label: "Cancelled", value: "cancelled" },
        { label: "Finished", value: "finished" }
      ] },
      { key: "home_score", label: "Home score", type: "number" }, { key: "away_score", label: "Away score", type: "number" }
    ]
  },
  standings: {
    table: "standings", label: "Standings", singular: "standing row", titleKey: "team_id", description: "Review or adjust the official ladder. Finished fixtures update it automatically.",
    fields: [
      { key: "division_id", label: "Division ID", required: true }, { key: "team_id", label: "Team ID", required: true },
      { key: "played", label: "Played", type: "number" }, { key: "won", label: "Won", type: "number" }, { key: "lost", label: "Lost", type: "number" },
      { key: "drawn", label: "Drawn", type: "number" }, { key: "points_for", label: "Points for", type: "number" },
      { key: "points_against", label: "Points against", type: "number" }, { key: "points", label: "Competition points", type: "number" }
    ]
  },
  "player-statistics": {
    table: "player_statistics", label: "Player statistics", singular: "statistics row", titleKey: "label", description: "Maintain current-season and career player statistics.",
    fields: [
      { key: "player_id", label: "Player ID", required: true }, { key: "season_id", label: "Season ID" },
      { key: "label", label: "Display label", required: true }, { key: "matches", label: "Matches", type: "number" },
      { key: "points", label: "Points", type: "number" }, { key: "wins", label: "Wins", type: "number" },
      { key: "losses", label: "Losses", type: "number" }, { key: "is_career", label: "Career total", type: "boolean" }
    ]
  },
  news: {
    table: "articles", label: "News", singular: "article", titleKey: "title", description: "Write, schedule and publish official news.",
    fields: [
      { key: "title", label: "Headline", required: true }, { key: "slug", label: "Slug", required: true },
      { key: "excerpt", label: "Summary", type: "textarea" }, { key: "body", label: "Article body", type: "textarea" },
      { key: "image_url", label: "Feature image", type: "image" }, { key: "published_at", label: "Publish date", type: "datetime-local" },
      { key: "status", label: "Status", type: "select", options: [{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }, { label: "Archived", value: "archived" }] },
      { key: "featured", label: "Featured", type: "boolean" }, { key: "source_url", label: "Original source URL", type: "url" }
    ]
  },
  sponsors: {
    table: "sponsors", label: "Sponsors", singular: "sponsor", titleKey: "name", description: "Control sponsor names, logos, links, tiers and order.",
    fields: [
      { key: "name", label: "Sponsor name", required: true }, { key: "logo_url", label: "Sponsor logo", type: "image" },
      { key: "website_url", label: "Website URL", type: "url" }, { key: "tier", label: "Tier", type: "select", options: [{ label: "Major partner", value: "major" }, { label: "Official partner", value: "official" }] },
      { key: "sort_order", label: "Order", type: "number" }, { key: "active", label: "Active", type: "boolean" }
    ]
  },
  rankings: {
    table: "rankings", label: "Rankings", singular: "ranking", titleKey: "label", description: "Publish team and player rankings.",
    fields: [
      { key: "season_id", label: "Season ID" }, { key: "division_id", label: "Division ID" },
      { key: "entity_type", label: "Type", type: "select", options: [{ label: "Team", value: "team" }, { label: "Player", value: "player" }] },
      { key: "entity_id", label: "Team or player ID" }, { key: "label", label: "Display label" },
      { key: "position", label: "Position", type: "number" }, { key: "points", label: "Points", type: "number" }
    ]
  },
  records: {
    table: "records", label: "Records", singular: "record", titleKey: "title", description: "Maintain official competition records.",
    fields: [
      { key: "competition_id", label: "Competition ID" }, { key: "title", label: "Record title", required: true },
      { key: "holder_name", label: "Holder" }, { key: "value", label: "Value" },
      { key: "achieved_on", label: "Date achieved", type: "date" }, { key: "description", label: "Description", type: "textarea" }
    ]
  }
};

export const adminNav = Object.entries(adminResources).map(([slug, resource]) => ({ slug, label: resource.label }));
