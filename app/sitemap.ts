import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://downball-world-cup.pages.dev";
  const data = await getSiteData();
  const sections = ["news","competitions","leagues","divisions","teams","players","fixtures","results","standings","rankings","records","venues","about","contact"];
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...sections.map((section) => ({ url: `${base}/${section}`, changeFrequency: "weekly" as const, priority: .8 })),
    ...data.teams.map((team) => ({ url: `${base}/teams/${team.slug}`, changeFrequency: "weekly" as const, priority: .7 })),
    ...data.venues.map((venue) => ({ url: `${base}/venues/${venue.slug}`, changeFrequency: "monthly" as const, priority: .5 })),
    ...data.articles.filter((article) => article.status === "published").map((article) => ({
      url: `${base}/news/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: "monthly" as const,
      priority: .75
    }))
  ];
}
