import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const primaryLinks = [
  ["News", "/news"],
  ["Highlights", "/highlights"],
  ["Competitions", "/competitions"],
  ["Teams", "/teams"],
  ["Fixtures", "/fixtures"],
  ["Results", "/results"],
  ["Standings", "/standings"]
];

const moreLinks = [
  ["Leagues", "/leagues"],
  ["Divisions", "/divisions"],
  ["Players", "/players"],
  ["Rankings", "/rankings"],
  ["Records", "/records"],
  ["Venues", "/venues"],
  ["About", "/about"],
  ["Contact", "/contact"]
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>VJDA 2025/26 · Under 16</span>
          <div><Link href="/admin">Admin</Link><Link href="/contact">Contact</Link></div>
        </div>
      </div>
      <header className="site-header">
        <div className="shell nav-shell">
          <Link className="brand" href="/" aria-label={`${settings.siteName} home`}>
            <span className="brand-mark"><Image alt="" fill priority sizes="54px" src={settings.logoUrl} /></span>
            <span><strong>{settings.siteName}</strong><small>{settings.tagline}</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {primaryLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            <details><summary>More</summary><div className="nav-dropdown">{moreLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div></details>
          </nav>
          <div className="nav-actions">
            <Link className="icon-button" href="/search" aria-label="Search"><Search size={19} /></Link>
            <details className="mobile-menu">
              <summary aria-label="Open navigation"><span /><span /><span /></summary>
              <div className="mobile-panel">{[...primaryLinks, ...moreLinks].map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
