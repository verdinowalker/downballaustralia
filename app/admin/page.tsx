import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, ShieldCheck, Trophy, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { getSiteData } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin dashboard", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
  }
  const data = await getSiteData();
  const cards = [
    { label: "Teams", value: data.teams.length, href: "/admin/teams", icon: Users },
    { label: "Fixtures", value: data.fixtures.length, href: "/admin/fixtures", icon: CalendarDays },
    { label: "News records", value: data.articles.length, href: "/admin/news", icon: FileText },
    { label: "Sponsors", value: data.sponsors.length, href: "/admin/sponsors", icon: Trophy }
  ];
  return (
    <AdminShell>
      <div className="admin-page-head"><div><span className="eyebrow">Overview</span><h1>Dashboard</h1><p>Everything needed to run the Downball Australia platform.</p></div><Link className="button button-gold" href="/">View website <ArrowRight size={16} /></Link></div>
      {!supabase && <div className="setup-banner"><ShieldCheck size={18} /> The dashboard is in preview mode. Connect Supabase using the included setup guide to enable secure login and saved changes.</div>}
      <div className="admin-stat-grid">
        {cards.map(({ label, value, href, icon: Icon }) => <Link href={href} key={label}><Icon size={22} /><strong>{value}</strong><span>{label}</span><ArrowRight size={16} /></Link>)}
      </div>
      <div className="admin-dashboard-grid">
        <section className="admin-panel"><div className="panel-title"><h2>Quick actions</h2></div>
          <div className="quick-action-grid">
            <Link href="/admin/fixtures">Create a fixture</Link><Link href="/admin/news">Publish news</Link>
            <Link href="/admin/teams">Add a team</Link><Link href="/admin/branding">Update branding</Link>
            <Link href="/admin/sponsors">Manage sponsors</Link><Link href="/admin/standings">Update standings</Link>
          </div>
        </section>
        <section className="admin-panel"><div className="panel-title"><h2>Migration status</h2></div>
          <ul className="migration-list">
            <li><span>✓</span> 24 VJDA teams imported</li><li><span>✓</span> 7 venues imported</li>
            <li><span>✓</span> 9 sponsors imported</li><li><span>✓</span> 37 news records preserved</li>
            <li><span>✓</span> Standings structure imported</li><li><span>✓</span> Fixture manager ready</li>
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
