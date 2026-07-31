import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.");

const supabase = createClient(url, key, { auth: { persistSession: false } });
const sources = [
  ["site_settings", "logo_url"],
  ["site_settings", "banner_url"],
  ["teams", "logo_url"],
  ["articles", "image_url"],
  ["sponsors", "logo_url"]
];

for (const [table, field] of sources) {
  const { data, error } = await supabase.from(table).select(`id,${field}`).not(field, "is", null);
  if (error) throw error;
  for (const record of data ?? []) {
    const source = record[field];
    if (!source?.includes("cdn-app.teamlinkt.com")) continue;
    const response = await fetch(source);
    if (!response.ok) {
      console.warn(`Skipped ${table}/${record.id}: HTTP ${response.status}`);
      continue;
    }
    const contentType = response.headers.get("content-type") || "image/png";
    const extension = contentType.includes("jpeg") ? "jpg" : contentType.includes("svg") ? "svg" : "png";
    const path = `teamlinkt/${table}/${record.id}-${field}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("media").upload(path, await response.arrayBuffer(), { contentType, upsert: true });
    if (uploadError) throw uploadError;
    const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);
    const { error: updateError } = await supabase.from(table).update({ [field]: publicUrl.publicUrl }).eq("id", record.id);
    if (updateError) throw updateError;
    console.log(`Migrated ${table}/${record.id}/${field}`);
  }
}
