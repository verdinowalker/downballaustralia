import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Trophy } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { EmptyState } from "@/components/empty-state";
import { NewsCard } from "@/components/news-card";
import { LiveScoreStrip } from "@/components/live-score-strip";
import { SectionTitle } from "@/components/section-title";
import { Sponsors } from "@/components/sponsors";
import { StandingsTable } from "@/components/standings-table";
import { TeamBadge } from "@/components/team-badge";
import { getSiteData } from "@/lib/data";
import { containsSearchBlockedName, noIndexMetadata } from "@/lib/search-privacy";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  const published = data.articles.filter((article) => article.status === "published").sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  const renderedNews = [
    ...published.map((article) => article.title),
    ...published.slice(0, 4).map((article) => article.excerpt),
  ];

  return containsSearchBlockedName(renderedNews)
    ? { robots: noIndexMetadata }
    : {};
}

export default async function HomePage() {
  const data = await getSiteData();
  const published = data.articles.filter((article) => article.status === "published").sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  const featured = published[0];
  const upcoming = data.fixtures.filter((fixture) => fixture.status === "scheduled").slice(0, 3);
  const results = data.fixtures.filter((fixture) => fixture.status === "finished").slice(-3).reverse();
  const live = data.fixtures.filter((fixture) => fixture.status === "live" || fixture.status === "half-time");

  return (
    <>
      <div className="ticker">
        <div className="shell ticker-inner">
          <strong>Latest</strong>
          <div className="ticker-track">
            {published.map((article) => <span key={article.id}>{article.title}</span>)}
          </div>
        </div>
      </div>
      <LiveScoreStrip initial={live} teams={data.teams} />

      <section className="hero">
        <div className="hero-noise" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="hero-kicker"><Trophy size={16} /> The official competition platform</span>
            <h1>Australian<br /><em>Downball</em><br />Starts Here.</h1>
            <p>Follow every club, fixture, result and ladder from the VJDA and the road to the Downball World Cup.</p>
            <div className="hero-actions">
              <Link className="button button-gold" href="/fixtures">View fixtures <ArrowRight size={17} /></Link>
              <Link className="button button-outline" href="/teams">Explore teams</Link>
            </div>
          </div>
          <div className="hero-visual">
            <span className="hero-ring hero-ring-one" />
            <span className="hero-ring hero-ring-two" />
            <div className="hero-logo">
              <Image alt="Downball Australia" fill priority sizes="360px" src={data.settings.logoUrl} />
            </div>
            <div className="hero-card">
              <span>Season</span><strong>2025/26</strong><small>VJDA · U16</small>
            </div>
          </div>
        </div>
      </section>

      <section className="selectors">
        <div className="shell selector-grid">
          <label><span>Competition</span><select defaultValue="downball-australia"><option value="downball-australia">Downball Australia</option></select></label>
          <label><span>Season</span><select defaultValue="2025-26"><option value="2025-26">2025/26</option></select></label>
          <label><span>Division</span><select defaultValue="u16"><option value="u16">VJDA Under 16</option></select></label>
          <Link href="/standings">Open competition <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="section shell">
        <SectionTitle eyebrow="From the newsroom" title="Latest news" href="/news" />
        <div className="news-layout">
          {featured && <NewsCard article={featured} featured />}
          <div className="news-side">
            {published.slice(1, 4).map((article) => <NewsCard article={article} key={article.id} />)}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell">
          <SectionTitle eyebrow="Match centre" title="Fixtures & results" href="/fixtures" linkLabel="Full schedule" />
          <div className="match-columns">
            <div>
              <h3 className="subheading"><CalendarDays size={19} /> Upcoming fixtures</h3>
              {upcoming.length ? upcoming.map((fixture) => <div key={fixture.id}>{fixture.round}</div>) : (
                <EmptyState title="Fixtures coming soon" text="The original TeamLinkt schedule currently has no events. New fixtures will appear here as soon as they are published." />
              )}
            </div>
            <div>
              <h3 className="subheading"><Trophy size={19} /> Latest results</h3>
              {results.length ? results.map((fixture) => <div key={fixture.id}>{fixture.round}</div>) : (
                <EmptyState title="No results yet" text="Scores and completed matches will be displayed here when the season begins." />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionTitle eyebrow="VJDA 2025/26 · Under 16" title="Competition ladder" href="/standings" />
        <div className="ladder-panel">
          <StandingsTable standings={data.standings} teams={data.teams} limit={8} />
          <aside className="countdown-panel">
            <span className="eyebrow">Next major event</span>
            <h3>World Cup countdown</h3>
            <p>The next chapter of Australian Downball starts here.</p>
            <Countdown />
            <Link href="/competitions">Competition details <ArrowRight size={16} /></Link>
          </aside>
        </div>
      </section>

      <section className="section teams-showcase">
        <div className="shell">
          <SectionTitle eyebrow="24 Victorian clubs" title="Meet the teams" href="/teams" />
          <div className="team-grid home-team-grid">
            {data.teams.slice(0, 8).map((team) => (
              <Link className="team-card" href={`/teams/${team.slug}`} key={team.id}>
                <TeamBadge team={team} size="lg" />
                <h3>{team.name}</h3>
                <p><MapPin size={14} /> {team.location}</p>
                <span>View club <ArrowRight size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Sponsors sponsors={data.sponsors} />
    </>
  );
}
