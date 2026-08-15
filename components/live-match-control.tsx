"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Radio, Save, RefreshCw } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Fixture = {
  id: string;
  round_name: string;
  starts_at: string;
  status: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number | null;
  away_score: number | null;
};
type Team = { id: string; name: string; logo_url?: string | null };
type Player = { id: string; name: string; jersey_number?: number | null; position?: string | null; team_id: string; photo_url?: string | null };
type Stat = {
  id?: string;
  fixture_id: string;
  player_id: string;
  team_id: string;
  minutes: number;
  plus_one: number;
  plus_two: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  cherries: number;
  outs: number;
  kings: number;
  queens: number;
  points: number;
  aces: number;
  plus_minus: number;
};

const statFields: Array<{ key: keyof Omit<Stat, "id" | "fixture_id" | "player_id" | "team_id">; label: string }> = [
  { key: "minutes", label: "MIN" },
  { key: "plus_one", label: "+1" },
  { key: "plus_two", label: "+2" },
  { key: "assists", label: "AST" },
  { key: "steals", label: "STL" },
  { key: "blocks", label: "BLK" },
  { key: "turnovers", label: "TO" },
  { key: "cherries", label: "CHE" },
  { key: "outs", label: "OUT" },
  { key: "kings", label: "KNG" },
  { key: "queens", label: "QN" },
  { key: "points", label: "PTS" },
  { key: "aces", label: "ACE" },
  { key: "plus_minus", label: "+/-" }
];

function blankStat(fixtureId: string, player: Player): Stat {
  return {
    fixture_id: fixtureId,
    player_id: player.id,
    team_id: player.team_id,
    minutes: 0,
    plus_one: 0,
    plus_two: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    cherries: 0,
    outs: 0,
    kings: 0,
    queens: 0,
    points: 0,
    aces: 0,
    plus_minus: 0
  };
}

export function LiveMatchControl() {
  const supabase = createSupabaseBrowserClient();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedFixtureId, setSelectedFixtureId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [stats, setStats] = useState<Stat[]>([]);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [status, setStatus] = useState("scheduled");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const selectedFixture = fixtures.find((fixture) => fixture.id === selectedFixtureId);
  const homeTeam = teams.find((team) => team.id === selectedFixture?.home_team_id);
  const awayTeam = teams.find((team) => team.id === selectedFixture?.away_team_id);
  const matchTeams = [homeTeam, awayTeam].filter(Boolean) as Team[];

  const teamPlayers = useMemo(() => {
    if (!selectedTeamId || !selectedFixture) return [];
    return players.filter((player) => player.team_id === selectedTeamId);
  }, [players, selectedTeamId, selectedFixture]);

  async function loadBaseData() {
    if (!supabase) return setMessage("Connect Supabase to use Live Match Control.");
    const [{ data: fixtureRows, error: fixtureError }, { data: teamRows, error: teamError }, { data: playerRows, error: playerError }] = await Promise.all([
      supabase.from("fixtures").select("id,round_name,starts_at,status,home_team_id,away_team_id,home_score,away_score").order("starts_at", { ascending: false }),
      supabase.from("teams").select("id,name,logo_url").eq("archived", false).order("name"),
      supabase.from("players").select("id,name,jersey_number,position,team_id,photo_url").eq("archived", false).order("name")
    ]);
    if (fixtureError || teamError || playerError) return setMessage(fixtureError?.message ?? teamError?.message ?? playerError?.message ?? "Could not load match data.");
    setFixtures(fixtureRows ?? []);
    setTeams(teamRows ?? []);
    setPlayers(playerRows ?? []);
    if (!selectedFixtureId && fixtureRows?.[0]) setSelectedFixtureId(fixtureRows[0].id);
  }

  async function loadMatch(fixtureId: string) {
    if (!supabase || !fixtureId) return;
    const fixture = fixtures.find((item) => item.id === fixtureId);
    if (fixture) {
      setScore({ home: fixture.home_score ?? 0, away: fixture.away_score ?? 0 });
      setStatus(fixture.status);
      setSelectedTeamId(fixture.home_team_id);
    }
    const { data, error } = await supabase.from("match_player_statistics").select("*").eq("fixture_id", fixtureId);
    if (error) return setMessage(error.message);
    setStats((data ?? []) as Stat[]);
  }

  useEffect(() => {
    void loadBaseData();
  }, []);

  useEffect(() => {
    if (selectedFixtureId) void loadMatch(selectedFixtureId);
  }, [selectedFixtureId, fixtures.length]);

  useEffect(() => {
    if (!supabase || !selectedFixtureId) return;
    const channel = supabase
      .channel(`live-match-${selectedFixtureId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "match_player_statistics", filter: `fixture_id=eq.${selectedFixtureId}` }, () => {
        void loadMatch(selectedFixtureId);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "fixtures", filter: `id=eq.${selectedFixtureId}` }, () => {
        void loadBaseData();
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [selectedFixtureId]);

  function ensurePlayerStats() {
    if (!selectedFixture) return;
    setStats((current) => {
      const existing = new Set(current.map((item) => item.player_id));
      return [...current, ...players.filter((player) => (player.team_id === selectedFixture.home_team_id || player.team_id === selectedFixture.away_team_id) && !existing.has(player.id)).map((player) => blankStat(selectedFixture.id, player))];
    });
  }

  function updateStat(playerId: string, key: string, value: string) {
    const numeric = value === "" ? 0 : Number(value);
    setStats((current) => current.map((item) => item.player_id === playerId ? { ...item, [key]: Number.isFinite(numeric) ? numeric : 0 } : item));
  }

  async function saveAll() {
    if (!supabase || !selectedFixture) return;
    setBusy(true);
    setMessage("");
    ensurePlayerStats();
    const rows = stats.length ? stats : players.filter((player) => player.team_id === selectedFixture.home_team_id || player.team_id === selectedFixture.away_team_id).map((player) => blankStat(selectedFixture.id, player));
    const { error: fixtureError } = await supabase.from("fixtures").update({ home_score: score.home, away_score: score.away, status }).eq("id", selectedFixture.id);
    if (fixtureError) {
      setBusy(false);
      return setMessage(fixtureError.message);
    }
    const { data, error } = await supabase.from("match_player_statistics").upsert(rows, { onConflict: "fixture_id,player_id" }).select();
    setBusy(false);
    if (error) return setMessage(error.message);
    setStats((data ?? rows) as Stat[]);
    setFixtures((current) => current.map((fixture) => fixture.id === selectedFixture.id ? { ...fixture, home_score: score.home, away_score: score.away, status } : fixture));
    setMessage(status === "finished" ? "Match and official player statistics saved. Player season/career totals have been refreshed." : "Live match statistics saved.");
  }

  const displayStats = useMemo(() => {
    if (!selectedFixture) return [];
    const byPlayer = new Map(stats.map((item) => [item.player_id, item]));
    return teamPlayers.map((player) => byPlayer.get(player.id) ?? blankStat(selectedFixture.id, player));
  }, [stats, teamPlayers, selectedFixture]);

  return (
    <div>
      <div className="admin-page-head">
        <div><span className="eyebrow">Live control</span><h1>Live Match Control</h1><p>Edit scores and every player statistic while the match is live or after it has finished.</p></div>
        <div className="admin-head-actions"><button className="button button-outline-dark" onClick={() => selectedFixtureId && loadMatch(selectedFixtureId)}><RefreshCw size={16} /> Refresh</button><button className="button button-gold" disabled={busy || !selectedFixture} onClick={saveAll}><Save size={16} /> {busy ? "Saving…" : "Save match + stats"}</button></div>
      </div>

      <div className="content-card" style={{ marginBottom: 20 }}>
        <label style={{ display: "grid", gap: 8 }}>Match
          <select value={selectedFixtureId} onChange={(event) => setSelectedFixtureId(event.target.value)}>
            <option value="">Select a match…</option>
            {fixtures.map((fixture) => {
              const home = teams.find((team) => team.id === fixture.home_team_id)?.name ?? "Team";
              const away = teams.find((team) => team.id === fixture.away_team_id)?.name ?? "Team";
              return <option key={fixture.id} value={fixture.id}>{home} vs {away} · {fixture.round_name} · {new Date(fixture.starts_at).toLocaleString("en-AU")}</option>;
            })}
          </select>
        </label>
        {selectedFixture && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto", gap: 14, alignItems: "end", marginTop: 18 }}>
            <label>{homeTeam?.name ?? "Team"}<input min={0} onChange={(event) => setScore((current) => ({ ...current, home: Number(event.target.value) || 0 }))} type="number" value={score.home} /></label>
            <strong style={{ paddingBottom: 10 }}>—</strong>
            <label>{awayTeam?.name ?? "Team"}<input min={0} onChange={(event) => setScore((current) => ({ ...current, away: Number(event.target.value) || 0 }))} type="number" value={score.away} /></label>
            <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="scheduled">Scheduled</option><option value="live">Live</option><option value="half-time">Half-time</option><option value="delayed">Delayed</option><option value="finished">Finished</option><option value="postponed">Postponed</option><option value="cancelled">Cancelled</option></select></label>
          </div>
        )}
      </div>

      {selectedFixture && <>
        <div className="content-card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}><Radio size={18} /><strong>{homeTeam?.name} {score.home} — {score.away} {awayTeam?.name}</strong>{status === "live" && <span className="status-pill"><Check size={13} /> LIVE</span>}<button className="button button-outline-dark" onClick={ensurePlayerStats}>Load all players</button></div>
          <div style={{ display: "flex", gap: 8, marginTop: 18, overflowX: "auto" }}>
            {matchTeams.map((team) => <button className={selectedTeamId === team.id ? "button button-gold" : "button button-outline-dark"} key={team.id} onClick={() => setSelectedTeamId(team.id)}>{team.name}</button>)}
          </div>
        </div>

        <div className="content-card" style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 1120 }}>
            <div style={{ display: "grid", gridTemplateColumns: "240px repeat(14, 72px)", gap: 6, padding: "10px 6px", fontSize: 12, fontWeight: 800, opacity: .7 }}>
              <span>PLAYER</span>{statFields.map((field) => <span key={field.key}>{field.label}</span>)}
            </div>
            {displayStats.map((stat) => {
              const player = players.find((item) => item.id === stat.player_id);
              if (!player) return null;
              return <div key={player.id} style={{ display: "grid", gridTemplateColumns: "240px repeat(14, 72px)", gap: 6, alignItems: "center", padding: "8px 6px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                <div><strong>{player.jersey_number ? `#${player.jersey_number} ` : ""}{player.name}</strong><small style={{ display: "block", opacity: .55 }}>{player.position ?? ""}</small></div>
                {statFields.map((field) => <input key={field.key} aria-label={`${player.name} ${field.label}`} min={0} onChange={(event) => updateStat(player.id, field.key, event.target.value)} step={field.key === "minutes" ? "0.1" : "1"} type="number" value={Number(stat[field.key]) || 0} />)}
              </div>;
            })}
            {!displayStats.length && <p style={{ padding: 24, opacity: .7 }}>No players are attached to this team's roster.</p>}
          </div>
        </div>
      </>}
      {message && <p className="form-error admin-message">{message}</p>}
    </div>
  );
}
