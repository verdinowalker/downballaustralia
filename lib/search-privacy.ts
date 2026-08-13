export const SEARCH_BLOCKED_NAMES = ["Ved Suthar"] as const;

export function containsSearchBlockedName(value: unknown): boolean {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  const normalized = text.toLowerCase();
  return SEARCH_BLOCKED_NAMES.some((name) => normalized.includes(name.toLowerCase()));
}

export const noIndexMetadata = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
  },
} as const;
