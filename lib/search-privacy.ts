export const SEARCH_BLOCKED_NAMES = ["Ved Suthar"] as const;

export function containsSearchBlockedName(value: unknown): boolean {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  const normalized = text.toLowerCase();
  return SEARCH_BLOCKED_NAMES.some((name) => normalized.includes(name.toLowerCase()));
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
