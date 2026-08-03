"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Fixture, Team } from "@/lib/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LiveScoreStrip({ initial, teams }: { initial: Fixture[]; teams: Team[] }) {
  const [fixtures, setFixtures] = useState(initial);
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const channel = supabase
      .channel("public-live-scores")
      .on("postgres_changes", { event: "*", schema: "public", table: "fixtures" }, async () => {
        const { data } = await supabase.from("fixtures").select("*").in("status", ["live", "half-time"]).order("starts_at");
        setFixtures((data ?? []).map((item) => ({
          id: item.id,
          round: item.round_name,
          homeTeamId: item.home_team_id,
          awayTeamId: item.away_team_id,
          startsAt: item.starts_at,
          venue: item.venue_name ?? "",
          status: item.status,
          homeScore: item.home_score,
          awayScore: item.away_score
        })));
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, []);

  if (!fixtures.length) return null;
  return (
    <div className="live-strip">
      <div className="shell">
        <strong><i /> Live</strong>
        {fixtures.map((fixture) => {
          const home = teams.find((team) => team.id === fixture.homeTeamId);
          const away = teams.find((team) => team.id === fixture.awayTeamId);
          return <Link href="/fixtures" key={fixture.id}><span>{home?.shortName}</span><b>{fixture.homeScore ?? 0} – {fixture.awayScore ?? 0}</b><span>{away?.shortName}</span></Link>;
        })}
      </div>
    </div>
  );
}
