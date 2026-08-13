import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";
import { containsSearchBlockedName } from "@/lib/search-privacy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://downball-world-cup.goutgout67.chatgpt.site";
  const data = await getSiteData();

  const sections = ["news","competitions","leagues","divisions","teams","fixtures","results","standings","rankings","records","venues","about","contact"];

  const indexableTeams = data.teams.filter((team) => {
    const roster = data.players.filter((player) => player.teamId === team.id);
    return !containsSearchBlockedName({ team, roster });
  });

  const indexableArticles = data.articles.filter((article) =>
    article.status === "published" &&
    !containsSearchBlockedName({ title: article.title, excerpt: article.excerpt, body: article.body })
  );

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...sections.map((section) => ({ url: `${base}/${section}`, changeFrequency: "weekly" as const, priority: .8 })),
    ...indexableTeams.map((team) => ({ url: `${base}/teams/${team.slug}`, changeFrequency: "weekly" as const, priority: .7 })),
    ...data.venues.map((venue) => ({ url: `${base}/venues/${venue.slug}`, changeFrequency: "monthly" as const, priority: .5 })),
    ...indexableArticles.map((article) => ({
      url: `${base}/news/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: "monthly" as const,
      priority: .75
    }))
  ];
}
