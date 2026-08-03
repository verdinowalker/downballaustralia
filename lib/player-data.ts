import { teamRosters } from "./rosters";
import type { Player, Team } from "./types";

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildFallbackPlayers(teams: Team[]): Player[] {
  return teams.flatMap((team) =>
    (teamRosters[team.name] ?? []).map((name, index) => ({
      id: `${team.id}-player-${index + 1}`,
      slug: `${slugify(name)}-${slugify(team.name)}`,
      name,
      teamId: team.id
    }))
  );
}

export function mergePlayersWithFallback(teams: Team[], databasePlayers: Player[]): Player[] {
  const fallback = buildFallbackPlayers(teams);
  if (!databasePlayers.length) return fallback;

  const databaseKeys = new Set(databasePlayers.map((player) => `${player.teamId}:${player.name.toLowerCase()}`));
  return [
    ...databasePlayers,
    ...fallback.filter((player) => !databaseKeys.has(`${player.teamId}:${player.name.toLowerCase()}`))
  ];
}
