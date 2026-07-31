import Image from "next/image";
import type { Sponsor } from "@/lib/types";

export function Sponsors({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <section className="sponsors-section">
      <div className="shell">
        <p className="sponsor-label">Official partners</p>
        <div className="sponsor-grid">
          {sponsors.map((sponsor) => (
            <a href={sponsor.url} key={sponsor.id} rel="noreferrer" target="_blank">
              {sponsor.logoUrl && <span className="sponsor-logo"><Image alt={`${sponsor.name} logo`} fill sizes="150px" src={sponsor.logoUrl} /></span>}
              <span>{sponsor.name}</span>
              <small>{sponsor.tier === "major" ? "Major partner" : "Official partner"}</small>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
