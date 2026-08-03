import { describe, expect, it } from "vitest";
import { calculateStandings, generateRoundRobin } from "./tournament";
import { teams } from "./demo-data";

describe("competition helpers", () => {
  it("creates every round-robin pairing", () => {
    const rounds = generateRoundRobin(["a", "b", "c", "d"]);
    expect(rounds).toHaveLength(3);
    expect(rounds.flat()).toHaveLength(6);
  });

  it("calculates a finished result", () => {
    const result = calculateStandings(
      [{
        id: "1",
        round: "1",
        homeTeamId: teams[0].id,
        awayTeamId: teams[1].id,
        startsAt: new Date().toISOString(),
        venue: "Test",
        status: "finished",
        homeScore: 11,
        awayScore: 8
      }],
      teams.slice(0, 2)
    );
    expect(result[0].teamId).toBe(teams[0].id);
    expect(result[0].points).toBe(3);
  });
});
