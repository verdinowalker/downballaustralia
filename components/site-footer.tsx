import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="footer-brand">
            <span className="brand-mark">
              <Image alt="" fill sizes="54px" src={settings.logoUrl} />
            </span>
            <strong>{settings.siteName}</strong>
          </div>
          <p>{settings.tagline}. News, fixtures, results, teams and competition information.</p>
        </div>
        <div>
          <h3>Competition</h3>
          <Link href="/fixtures">Fixtures</Link>
          <Link href="/results">Results</Link>
          <Link href="/standings">Standings</Link>
          <Link href="/teams">Teams</Link>
        </div>
        <div>
          <h3>Information</h3>
          <Link href="/news">News</Link>
          <Link href="/venues">Venues</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <h3>Contact</h3>
          <p>{settings.location}</p>
          <a href={`tel:${settings.contactPhone.replace(/\D/g, "")}`}>{settings.contactPhone}</a>
          <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} {settings.siteName}</span>
        <span>Official competition platform</span>
      </div>
    </footer>
  );
}
