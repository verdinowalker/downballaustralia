import Image from "next/image";
import type { Team } from "@/lib/types";

export function TeamBadge({ team, size = "md" }: { team: Team; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      className={`team-badge team-badge-${size}`}
      style={{ "--team-primary": team.colours[0], "--team-secondary": team.colours[1] } as React.CSSProperties}
    >
      <Image alt={`${team.name} logo`} fill sizes={size === "lg" ? "120px" : "64px"} src={team.logoUrl} />
      <b>{team.shortName}</b>
    </span>
  );
}
