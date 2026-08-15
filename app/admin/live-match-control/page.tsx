import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { LiveMatchControl } from "@/components/live-match-control";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Live Match Control", robots: { index: false, follow: false } };

export default async function LiveMatchControlPage() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (!profile || !["owner", "admin", "editor"].includes(profile.role)) redirect("/admin?error=unauthorised");
  }

  return <AdminShell active="live-match-control"><LiveMatchControl /></AdminShell>;
}
