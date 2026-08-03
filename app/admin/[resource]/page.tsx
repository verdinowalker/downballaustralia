import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { ResourceManager } from "@/components/resource-manager";
import { adminResources } from "@/lib/admin-resource-enhancements";
import { demoData } from "@/lib/demo-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Content manager", robots: { index: false, follow: false } };

function demoRows(resource: string): Record<string, unknown>[] {
  if (resource === "teams") return demoData.teams.map((item) => ({
    id: item.id, name: item.name, slug: item.slug, short_name: item.shortName, logo_url: item.logoUrl,
    primary_colour: item.colours[0], secondary_colour: item.colours[1], location: item.location, description: item.description, archived: false
  }));
  if (resource === "players") return demoData.players.map((item) => ({
    id: item.id, team_id: item.teamId, name: item.name, slug: item.slug, photo_url: item.photoUrl,
    jersey_number: item.number, position: item.position, height_cm: item.heightCm, weight_kg: item.weightKg,
    nationality: item.nationality, archived: false
  }));
  if (resource === "venues") return demoData.venues;
  if (resource === "sponsors") return demoData.sponsors.map((item, sort_order) => ({ id: item.id, name: item.name, website_url: item.url, logo_url: item.logoUrl, tier: item.tier, sort_order, active: true }));
  if (resource === "news") return demoData.articles.map((item) => ({ ...item, image_url: item.imageUrl, published_at: item.publishedAt, source_url: item.sourceUrl }));
  if (resource === "branding") return [{ id: "settings", site_name: demoData.settings.siteName, tagline: demoData.settings.tagline, logo_url: demoData.settings.logoUrl, primary_colour: demoData.settings.primaryColour, accent_colour: demoData.settings.accentColour, contact_email: demoData.settings.contactEmail, contact_phone: demoData.settings.contactPhone, location: demoData.settings.location }];
  return [];
}

export default async function AdminResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: slug } = await params;
  const resource = adminResources[slug];
  if (!resource) notFound();
  const supabase = await createSupabaseServerClient();
  let rows = demoRows(slug);

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (!profile || !["owner", "admin", "editor"].includes(profile.role)) {
      redirect("/admin?error=unauthorised");
    }

    const { data } = await supabase.from(resource.table).select("*").limit(500);
    rows = data ?? [];
  }

  return <AdminShell active={slug}><ResourceManager configured={Boolean(supabase)} initialRows={rows} resource={resource} /></AdminShell>;
}
