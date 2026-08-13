import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";
import { containsSearchBlockedName } from "@/lib/search-privacy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://downball-world-cup.goutgout67.chatgpt.site";
  const data = await getSiteData();

  const publishedArticles = data.articles.filter((article) => article.status === "published");
  const newsListingContainsBlockedName = containsSearchBlockedName(
    publishedArticles.map((article) => ({ title: article.title, excerpt: article.excerpt }))
  );
  const homeContainsBlockedName = containsSearchBlockedName([
    ...publishedArticles.map((article) => article.title),
    ...publishedArticles
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      .slice(0, 4)
      .map((article) => article.excerpt),
  ]);

  const sections = ["competitions","leagues","divisions","teams","fixtures","results","standings","rankings","records","venues","about","contact"];
  if (!newsListingContainsBlockedName) sections.unshift("news");

  const indexableTeams = data.teams.filter((team) => {
    const roster = data.players.filter((player) => player.teamId === team.id);
    return !containsSearchBlockedName({ team, roster });
  });

  const indexableArticles = publishedArticles.filter((article) =>
    !containsSearchBlockedName({ title: article.title, excerpt: article.excerpt, body: article.body })
  );

  return [
    ...(!homeContainsBlockedName ? [{ url: base, changeFrequency: "daily" as const, priority: 1 }] : []),
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
