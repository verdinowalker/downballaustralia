import Link from "next/link";
import type { Standing, Team } from "@/lib/types";
import { TeamBadge } from "./team-badge";

export function StandingsTable({
  standings,
  teams,
  limit
}: {
  standings: Standing[];
  teams: Team[];
  limit?: number;
}) {
  const rows = limit ? standings.slice(0, limit) : standings;
  return (
    <div className="table-scroll">
      <table className="standings-table">
        <thead>
          <tr>
            <th>#</th><th>Team</th><th>P</th><th>W</th><th>L</th><th>D</th><th>+/-</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const team = teams.find((item) => item.id === row.teamId);
            if (!team) return null;
            return (
              <tr key={row.teamId}>
                <td><span className="position">{index + 1}</span></td>
                <td>
                  <Link className="table-team" href={`/teams/${team.slug}`}>
                    <TeamBadge team={team} size="sm" />
                    <strong>{team.name}</strong>
                  </Link>
                </td>
                <td>{row.played}</td><td>{row.won}</td><td>{row.lost}</td><td>{row.drawn}</td>
                <td>{row.pointsFor - row.pointsAgainst}</td><td><strong>{row.points}</strong></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
