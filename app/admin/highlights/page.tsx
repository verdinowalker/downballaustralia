import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { HighlightsAdmin } from "@/components/highlights-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Highlights manager", robots: { index: false, follow: false } };

export default async function AdminHighlightsPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <AdminShell active="highlights"><HighlightsAdmin initialRows={[]} fixtures={[]} players={[]} /></AdminShell>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || !["owner", "admin", "editor"].includes(profile.role)) redirect("/admin?error=unauthorised");

  const [{ data: highlights }, { data: fixtures }, { data: players }] = await Promise.all([
    supabase.from("highlights").select("*").order("published_at", { ascending: false }).limit(500),
    supabase.from("fixtures").select("id, round_name, starts_at, home_team_id, away_team_id").order("starts_at", { ascending: false }).limit(500),
    supabase.from("players").select("id, name").order("name").limit(500)
  ]);
  const teamIds = [...new Set((fixtures ?? []).flatMap((f) => [f.home_team_id, f.away_team_id]).filter(Boolean))];
  const { data: teams } = teamIds.length ? await supabase.from("teams").select("id, name").in("id", teamIds) : { data: [] as { id: string; name: string }[] };
  const teamMap = new Map((teams ?? []).map((t) => [t.id, t.name]));
  const fixtureOptions = (fixtures ?? []).map((f) => ({ id: f.id, label: `${teamMap.get(f.home_team_id) ?? "Team"} v ${teamMap.get(f.away_team_id) ?? "Team"} · ${f.round_name} · ${new Date(f.starts_at).toLocaleString("en-AU")}` }));
  const playerOptions = (players ?? []).map((p) => ({ id: p.id, label: p.name }));
  return <AdminShell active="highlights"><HighlightsAdmin initialRows={(highlights ?? []) as never} fixtures={fixtureOptions} players={playerOptions} /></AdminShell>;
}
