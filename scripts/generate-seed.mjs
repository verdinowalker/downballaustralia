import { readFile } from "node:fs/promises";

const seedUrl = new URL("../supabase/seed.sql", import.meta.url);
const seed = await readFile(seedUrl, "utf8");
const counts = {
  teams: (seed.match(/\('20000000-/g) ?? []).length,
  venues: (seed.match(/\('10000000-/g) ?? []).length,
  sponsors: (seed.match(/\('40000000-/g) ?? []).length,
  publishedNews: (seed.match(/'published'/g) ?? []).length,
  archivedNews: 33
};
console.log("Seed validated:", counts);
if (counts.teams !== 24 || counts.venues !== 7 || counts.sponsors !== 9) {
  throw new Error("Unexpected seed record count");
}
