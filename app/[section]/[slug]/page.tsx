import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { TeamBadge } from "@/components/team-badge";
import { getSiteData } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ section: string; slug: string }> }): Promise<Metadata> {
  const { section, slug } = await params;
  const data = await getSiteData();
  const title =
    section === "teams" ? data.teams.find((item) => item.slug === slug)?.name :
    section === "news" ? data.articles.find((item) => item.slug === slug)?.title :
    section === "venues" ? data.venues.find((item) => item.slug === slug)?.name : undefined;
  return title ? { title } : {};
}

export default async function DetailPage({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const data = await getSiteData();

  if (section === "news") {
    const article = data.articles.find((item) => item.slug === slug && item.status === "published");
    if (!article) notFound();
    return (
      <article>
        <div className="article-hero">
          <Image alt="" fill priority sizes="100vw" src={article.imageUrl} />
          <div className="article-overlay" />
          <div className="shell article-title">
            <Link href="/news"><ArrowLeft size={16} /> News</Link>
            <time>{new Intl.DateTimeFormat("en-AU", { dateStyle: "long" }).format(new Date(article.publishedAt))}</time>
            <h1>{article.title}</h1>
          </div>
        </div>
        <div className="shell article-body">
          <p className="article-lead">{article.excerpt}</p>
          {article.body.split("\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {article.sourceUrl && <a className="source-link" href={article.sourceUrl} rel="noreferrer" target="_blank">Original TeamLinkt record <ExternalLink size={15} /></a>}
        </div>
      </article>
    );
  }

  if (section === "teams") {
    const team = data.teams.find((item) => item.slug === slug);
    if (!team) notFound();
    return (
      <>
        <section className="team-profile-hero" style={{ "--team-primary": team.colours[0] } as React.CSSProperties}>
          <div className="shell team-profile-grid">
            <TeamBadge team={team} size="lg" />
            <div><span className="eyebrow">VJDA 2025/26 · Under 16</span><h1>{team.name}</h1><p><MapPin size={16} /> {team.location}</p></div>
          </div>
        </section>
        <section className="section shell">
          <div className="profile-layout">
            <div className="content-card"><h2>Club overview</h2><p>{team.description}</p><div className="colour-swatches"><span style={{ background: team.colours[0] }} /><span style={{ background: team.colours[1] }} /></div></div>
            <div className="content-card"><h2>Upcoming fixtures</h2><EmptyState title="Schedule coming soon" text="No fixtures have been published for this club." /></div>
            <div className="content-card"><h2>Player roster</h2><EmptyState title="Roster coming soon" text="No public player data was available on TeamLinkt." /></div>
          </div>
        </section>
      </>
    );
  }

  if (section === "venues") {
    const venue = data.venues.find((item) => item.slug === slug);
    if (!venue) notFound();
    return (
      <>
        <section className="page-hero"><div className="shell"><span className="eyebrow">Venue</span><h1>{venue.name}</h1><p><MapPin size={18} /> {venue.address}</p></div></section>
        <section className="section shell"><EmptyState title="No fixtures scheduled" text="Matches at this venue will appear here when the schedule is published." /></section>
      </>
    );
  }

  notFound();
}
