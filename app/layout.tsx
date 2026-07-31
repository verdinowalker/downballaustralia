import type { Metadata, Viewport } from "next";
import { getSiteData } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://downball-world-cup.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Downball Australia | Official Competition Website", template: "%s | Downball Australia" },
  description: "The official home of Downball Australia: news, teams, fixtures, results, standings, venues and competition information.",
  keywords: ["Downball Australia", "Downball World Cup", "VJDA", "Downball Victoria", "Downball fixtures"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Downball Australia",
    title: "Downball Australia",
    description: "The home of Australian Downball.",
    url: "/"
  },
  twitter: { card: "summary_large_image", title: "Downball Australia" },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
};

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "dark"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { settings } = await getSiteData();
  const organisation = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: settings.siteName,
    url: siteUrl,
    logo: settings.logoUrl,
    address: { "@type": "PostalAddress", addressLocality: "Melbourne", addressRegion: "VIC", addressCountry: "AU" }
  };

  return (
    <html lang="en-AU">
      <body>
        <SiteHeader settings={settings} />
        <main>{children}</main>
        <SiteFooter settings={settings} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }} />
      </body>
    </html>
  );
}
