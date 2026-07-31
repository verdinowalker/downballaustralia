import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionTitle({
  eyebrow,
  title,
  href,
  linkLabel = "View all"
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {href && <Link href={href}>{linkLabel}<ArrowRight size={16} /></Link>}
    </div>
  );
}
