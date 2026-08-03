import type { Fixture, Standing, Team } from "./types";

export function calculateStandings(fixtures: Fixture[], teams: Team[]): Standing[] {
  const table = new Map(
    teams.map((team) => [
      team.id,
      {
        teamId: team.id,
        played: 0,
        won: 0,
        lost: 0,
        drawn: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        points: 0
      }
    ])
  );

  for (const fixture of fixtures.filter((item) => item.status === "finished")) {
    const home = table.get(fixture.homeTeamId);
    const away = table.get(fixture.awayTeamId);
    if (!home || !away || fixture.homeScore == null || fixture.awayScore == null) continue;
    home.played += 1;
    away.played += 1;
    home.pointsFor += fixture.homeScore;
    home.pointsAgainst += fixture.awayScore;
    away.pointsFor += fixture.awayScore;
    away.pointsAgainst += fixture.homeScore;
    if (fixture.homeScore === fixture.awayScore) {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    } else if (fixture.homeScore > fixture.awayScore) {
      home.won += 1;
      away.lost += 1;
      home.points += 3;
    } else {
      away.won += 1;
      home.lost += 1;
      away.points += 3;
    }
  }

  return [...table.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.pointsFor - b.pointsAgainst - (a.pointsFor - a.pointsAgainst) ||
      b.pointsFor - a.pointsFor
  );
}

export function generateRoundRobin(teamIds: string[]): Array<[string, string][]> {
  const ids = [...teamIds];
  if (ids.length % 2) ids.push("bye");
  const rounds: Array<[string, string][]> = [];
  for (let round = 0; round < ids.length - 1; round += 1) {
    const pairings: Array<[string, string]> = [];
    for (let i = 0; i < ids.length / 2; i += 1) {
      const home = ids[i];
      const away = ids[ids.length - 1 - i];
      if (home !== "bye" && away !== "bye") pairings.push([home, away]);
    }
    rounds.push(pairings);
    ids.splice(1, 0, ids.pop()!);
  }
  return rounds;
}
