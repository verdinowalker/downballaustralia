import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

export function NewsCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article className={`news-card ${featured ? "news-card-featured" : ""}`}>
      <Link className="news-image" href={`/news/${article.slug}`}>
        <Image alt="" fill sizes={featured ? "(max-width: 800px) 100vw, 66vw" : "(max-width: 800px) 100vw, 33vw"} src={article.imageUrl} />
        <span>News</span>
      </Link>
      <div className="news-copy">
        <time dateTime={article.publishedAt}>
          {new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.publishedAt))}
        </time>
        <h3><Link href={`/news/${article.slug}`}>{article.title}</Link></h3>
        <p>{article.excerpt}</p>
      </div>
    </article>
  );
}
