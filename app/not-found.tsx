import Link from "next/link";

export default function NotFound() {
  return <section className="page-hero"><div className="shell"><span className="eyebrow">404</span><h1>Page not found</h1><p>The page you requested is not available.</p><Link className="button button-gold" href="/">Return home</Link></div></section>;
}
