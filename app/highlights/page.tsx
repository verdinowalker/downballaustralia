import type { Metadata } from "next";
import { HighlightsGrid } from "@/components/highlights-grid";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Highlights | Downball Australia",
  description: "Official Downball Australia match highlights and video coverage."
};

export default async function HighlightsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("highlights").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(100)
    : { data: [] as Record<string, unknown>[] };
  const items = data ?? [];

  return (
    <section className="section shell">
      <div className="page-hero">
        <span className="eyebrow">Downball Australia Media</span>
        <h1>HIGHLIGHTS</h1>
        <p>Watch the biggest plays, match moments and official video coverage from Downball Australia.</p>
      </div>
      <HighlightsGrid items={items.map((item) => ({
        id: String(item.id),
        title: String(item.title ?? "Untitled highlight"),
        description: item.description ? String(item.description) : null,
        video_url: String(item.video_url),
        thumbnail_url: item.thumbnail_url ? String(item.thumbnail_url) : null,
        featured_player: item.featured_player ? String(item.featured_player) : null,
        published_at: String(item.published_at)
      }))} />
    </section>
  );
}
