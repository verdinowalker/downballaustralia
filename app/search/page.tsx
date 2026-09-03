import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { getSiteData } from "@/lib/data";
import { containsSearchBlockedName, PUBLIC_PLAYER_NAME } from "@/lib/search-privacy";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  if (containsSearchBlockedName(q)) redirect(`/search?q=${encodeURIComponent(PUBLIC_PLAYER_NAME)}`);
  const data = await getSiteData();
  const query = q.trim().toLowerCase();
  const results = query
    ? [
        ...data.teams.filter((item) => `${item.name} ${item.location}`.toLowerCase().includes(query)).map((item) => ({ title: item.name, type: "Team", href: `/teams/${item.slug}`, text: item.location })),
        ...data.players.filter((item) => `${item.name} ${item.position ?? ""}`.toLowerCase().includes(query)).map((item) => ({
          title: item.name,
          type: "Player",
          href: `/players/${item.slug}`,
          text: data.teams.find((team) => team.id === item.teamId)?.name ?? "Player profile"
        })),
        ...data.articles.filter((item) => item.status === "published" && `${item.title} ${item.excerpt}`.toLowerCase().includes(query)).map((item) => ({ title: item.title, type: "News", href: `/news/${item.slug}`, text: item.excerpt })),
        ...data.venues.filter((item) => `${item.name} ${item.address}`.toLowerCase().includes(query)).map((item) => ({ title: item.name, type: "Venue", href: `/venues/${item.slug}`, text: item.address }))
      ]
    : [];

  return (
    <>
      <section className="page-hero"><div className="shell"><span className="eyebrow">Find anything</span><h1>Search</h1><p>Search news, teams and venues.</p></div></section>
      <section className="section shell search-page">
        <form className="search-form">
          <Search size={22} /><input autoFocus defaultValue={q} name="q" placeholder="Search Downball Australia…" /><button className="button button-gold">Search</button>
        </form>
        {query && <p className="result-count">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>}
        <div className="search-results">
          {results.map((result) => <Link href={result.href} key={`${result.type}-${result.href}`}><span>{result.type}</span><h2>{result.title}</h2><p>{result.text}</p></Link>)}
        </div>
      </section>
    </>
  );
}
