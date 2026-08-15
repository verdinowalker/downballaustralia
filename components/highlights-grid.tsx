import Link from "next/link";

type Highlight = {
  id: string;
  title: string;
  description?: string | null;
  video_url: string;
  thumbnail_url?: string | null;
  featured_player?: string | null;
  published_at: string;
};

export function HighlightsGrid({ items }: { items: Highlight[] }) {
  if (!items.length) {
    return <div className="empty-state"><span className="eyebrow">Highlights</span><h2>No highlights yet</h2><p>Match highlights will appear here after they are published by the Downball Australia media team.</p></div>;
  }

  return (
    <div className="news-grid">
      {items.map((item) => (
        <article className="news-card" key={item.id}>
          <a href={item.video_url} target="_blank" rel="noreferrer" className="news-card-media">
            {item.thumbnail_url ? <img src={item.thumbnail_url} alt="" /> : <div className="news-card-placeholder"><span>▶</span></div>}
            <span className="news-card-badge">HIGHLIGHTS</span>
          </a>
          <div className="news-card-body">
            <p className="eyebrow">{new Date(item.published_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</p>
            <h2><a href={item.video_url} target="_blank" rel="noreferrer">{item.title}</a></h2>
            {item.description && <p>{item.description}</p>}
            {item.featured_player && <span className="tag">Player: {item.featured_player}</span>}
          </div>
        </article>
      ))}
    </div>
  );
}
