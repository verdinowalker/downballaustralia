export const SEARCH_BLOCKED_NAMES = ["Ved Suthar"] as const;
export const PUBLIC_PLAYER_NAME = "Private Player";
export const PUBLIC_PLAYER_SLUG = "private-player";

export function containsSearchBlockedName(value: unknown): boolean {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  const normalized = text.toLowerCase();
  return SEARCH_BLOCKED_NAMES.some((name) => normalized.includes(name.toLowerCase()));
}

export function redactPublicText(value: string): string {
  return SEARCH_BLOCKED_NAMES.reduce((text, name) => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(escapedName, "gi"), PUBLIC_PLAYER_NAME);
  }, value);
}

export function isPrivatePlayer(value: { name?: unknown; slug?: unknown } | null | undefined): boolean {
  const name = typeof value?.name === "string" ? value.name.trim().toLowerCase() : "";
  const slug = typeof value?.slug === "string" ? value.slug.toLowerCase() : "";
  return name === PUBLIC_PLAYER_NAME.toLowerCase() || slug.startsWith(`${PUBLIC_PLAYER_SLUG}-`);
}

// Keep affected pages/resources visible to normal site visitors, but prevent
// them from being indexed by Google and other crawlers that support robots rules.
export const noIndexMetadata = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
    noimageindex: true,
  },
} as const;
