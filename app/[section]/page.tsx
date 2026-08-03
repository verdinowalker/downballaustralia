import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, MapPin, Trophy, UserRound, Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { NewsCard } from "@/components/news-card";
import { StandingsTable } from "@/components/standings-table";
import { TeamBadge } from "@/components/team-badge";
import { getSiteData } from "@/lib/data";
import { teamCoaches, teamRosters } from "@/lib/rosters";
import { notFound } from "next/navigation";

const validSections = [
  "news", "competitions", "leagues", "divisions", "teams", "players", "fixtures",
  "results", "standings", "rankings", "records", "venues", "about"
] as const;

const labels: Record<string, { eyebrow: string; title: string; intro: string }> = {
  news: { eyebrow: "Newsroom", title: "Latest news", intro: "Official stories and announcements from Downball Australia." },
  competitions: { eyebrow: "Play Downball", title: "Competitions", intro: "Explore competitions, seasons, leagues and divisions." },
  leagues: { eyebrow: "Competition structure", title: "Leagues", intro: "The leagues that make up Australian Downball." },
  divisions: { eyebrow: "2025/26 season", title: "Divisions", intro: "Find division information, fixtures, results and ladders." },
  teams: { eyebrow: "VJDA Under 16", title: "Teams", intro: "Meet the 24 Victorian clubs in the 2025/26 competition." },
  players: { eyebrow: "Athletes", title: "Players", intro: "Meet the VJDA Under 16 players and coaches." },
  fixtures: { eyebrow: "Match centre", title: "Fixtures", intro: "Dates, times and venues for upcoming Downball matches." },
  results: { eyebrow: "Match centre", title: "Results", intro: "Official scores and completed match information." },
  standings: { eyebrow: "VJDA 2025/26 · Under 16", title: "Standings", intro: "The official competition ladder." },
  rankings: { eyebrow: "Performance", title: "Rankings", intro: "Official team and player rankings." },
  records: { eyebrow: "History", title: "Records", intro: "Competition milestones and all-time achievements." },
  venues: { eyebrow: "Where we play", title: "Venues", intro: "Courts and stadiums used by Downball Australia." },
  about: { eyebrow: "Our game", title: "About Downball Australia", intro: "Building a national home for Downball." }
};

export function generateStaticParams() {
  return validSections.map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  return labels[section] ? { title: labels[section].title, description: labels[section].intro } : {};
}

function PageHero({ section }: { section: string }) {
  const copy = labels[section];
  return (
    <section className="page-hero">
      <div className="shell">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </div>
    </section>
  );
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!validSections.includes(section as (typeof validSections)[number])) notFound();
  const data = await getSiteData();
  const published = data.articles.filter((article) => article.status === "published").sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  return (
    <>
      <PageHero section={section} />
      <section className="section shell">
        {section === "news" && (
          <div className="news-grid">{published.map((article) => <NewsCard article={article} key={article.id} />)}</div>
        )}

        {section === "teams" && (
          <div className="team-grid">
            {data.teams.map((team) => (
              <Link className="team-card" href={`/teams/${team.slug}`} key={team.id}>
                <TeamBadge team={team} size="lg" />
                <h3>{team.name}</h3>
                <p><MapPin size={14} /> {team.location}</p>
                <span>View club <ArrowRight size={15} /></span>
              </Link>
            ))}
          </div>
        )}

        {section === "standings" && (
          <div className="content-card">
            <div className="filter-row">
              <label>Season<select defaultValue="2025"><option value="2025">2025/26</option></select></label>
              <label>Division<select defaultValue="u16"><option value="u16">VJDA Under 16</option></select></label>
            </div>
            <StandingsTable standings={data.standings} teams={data.teams} />
          </div>
        )}

        {section === "venues" && (
          <div className="venue-grid">
            {data.venues.map((venue) => (
              <article className="venue-card" key={venue.id}>
                <span><Building2 size={26} /></span>
                <h2>{venue.name}</h2>
                <p><MapPin size={16} /> {venue.address}</p>
                <Link href={`/venues/${venue.slug}`}>Venue details <ArrowRight size={15} /></Link>
              </article>
            ))}
          </div>
        )}

        {section === "fixtures" && (
          <EmptyState title="Fixtures coming soon" text="There are no events on the original TeamLinkt schedule. Administrators can add matches manually or generate a complete round-robin schedule." />
        )}
        {section === "results" && (
          <EmptyState title="No results yet" text="Official results will appear here after scores are entered and matches are marked finished." />
        )}
        {section === "players" && (
          <div className="profile-layout">
            {data.teams.map((team) => {
              const roster = teamRosters[team.name] ?? [];
              const coach = teamCoaches[team.name];
              return (
                <article className="content-card" key={team.id}>
                  <Link href={`/teams/${team.slug}`}><h2>{team.name}</h2></Link>
                  {coach && <p><strong>Head coach:</strong> {coach}</p>}
                  <div className="team-grid">
                    {roster.map((player) => (
                      <div className="team-card" key={`${team.id}-${player}`}>
                        <UserRound size={26} />
                        <h3>{player}</h3>
                        <p>{team.name}</p>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {(section === "rankings" || section === "records") && (
          <EmptyState title={`${labels[section].title} coming soon`} text="This section is ready for administrators to publish official competition data." />
        )}

        {section === "competitions" && (
          <div className="feature-grid">
            <Link className="feature-card feature-card-gold" href="/divisions">
              <Trophy size={34} /><span>Active competition</span><h2>Downball Australia</h2><p>VJDA 2025/26 · Under 16 · 24 teams</p>
            </Link>
            <div className="feature-card"><CalendarDays size={34} /><span>Season</span><h2>2025/26</h2><p>Current active competition season</p></div>
            <div className="feature-card"><Users size={34} /><span>Clubs</span><h2>24 teams</h2><p>Across metropolitan and regional Victoria</p></div>
          </div>
        )}

        {(section === "leagues" || section === "divisions") && (
          <div className="content-card competition-card">
            <span className="status-pill">Active</span>
            <h2>{section === "leagues" ? "Victorian Junior Downball Association" : "VJDA 2025/26 Under 16"}</h2>
            <p>{section === "leagues" ? "The current league for the migrated 2025/26 season." : "Twenty-four clubs competing across Victoria."}</p>
            <div className="quick-links">
              <Link href="/teams">Teams <ArrowRight size={15} /></Link>
              <Link href="/fixtures">Fixtures <ArrowRight size={15} /></Link>
              <Link href="/standings">Standings <ArrowRight size={15} /></Link>
            </div>
          </div>
        )}

        {section === "about" && (
          <div className="prose-layout">
            <div>
              <h2>A platform built for the game</h2>
              <p>Downball Australia connects players, clubs, families and supporters with official competition information in one modern home.</p>
              <p>The platform supports competitions, seasons, leagues, divisions, teams, players, coaches, venues, fixtures, live scores, results, standings, news, rankings, records and sponsors.</p>
            </div>
            <aside><strong>24</strong><span>Victorian clubs</span><strong>7</strong><span>Competition venues</span><strong>1</strong><span>national platform</span></aside>
          </div>
        )}
      </section>
    </>
  );
}
