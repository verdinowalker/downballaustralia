import { teamRosters } from "./rosters";
import { containsSearchBlockedName, isPrivatePlayer, PUBLIC_PLAYER_NAME, PUBLIC_PLAYER_SLUG, redactPublicText } from "./search-privacy";
import type { Player, Team } from "./types";

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function redactPlayer(player: Player): Player {
  if (!containsSearchBlockedName(player) && !isPrivatePlayer(player)) return player;

  return {
    ...player,
    name: PUBLIC_PLAYER_NAME,
    slug: `${PUBLIC_PLAYER_SLUG}-${player.id}`,
    biography: player.biography ? redactPublicText(player.biography) : undefined,
    awards: player.awards ? redactPublicText(player.awards) : undefined
  };
}

export function buildFallbackPlayers(teams: Team[]): Player[] {
  return teams.flatMap((team) =>
    (teamRosters[team.name] ?? []).map((name, index) => ({
      id: `${team.id}-player-${index + 1}`,
      slug: `${slugify(name)}-${slugify(team.name)}`,
      name,
      teamId: team.id
    })).map(redactPlayer)
  );
}

export function mergePlayersWithFallback(teams: Team[], databasePlayers: Player[]): Player[] {
  const fallback = buildFallbackPlayers(teams);
  if (!databasePlayers.length) return fallback;

  const publicDatabasePlayers = databasePlayers.map(redactPlayer);
  const databaseKeys = new Set(publicDatabasePlayers.map((player) => `${player.teamId}:${player.name.toLowerCase()}`));
  return [
    ...publicDatabasePlayers,
    ...fallback.filter((player) => !databaseKeys.has(`${player.teamId}:${player.name.toLowerCase()}`))
  ];
}
