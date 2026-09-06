import { describe, expect, it } from "vitest";
import { containsSearchBlockedName, isPrivatePlayer, redactPublicText } from "./search-privacy";

describe("search privacy", () => {
  const privateName = atob("VmVkIFN1dGhhcg==");

  it("redacts the private player name from public text", () => {
    expect(containsSearchBlockedName(privateName)).toBe(true);
    expect(redactPublicText(`${privateName} scored twice`)).toBe("Private Player scored twice");
  });

  it("identifies the sanitized public player record", () => {
    expect(isPrivatePlayer({ name: "Private Player", slug: "private-player-123" })).toBe(true);
  });
});
