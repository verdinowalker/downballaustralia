"use client";

import { useMemo, useState } from "react";
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import type { AdminResource } from "@/lib/admin-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { generateRoundRobin } from "@/lib/tournament";

type Row = Record<string, unknown> & { id?: string };

function normaliseValue(value: FormDataEntryValue, type?: string) {
  if (type === "number") return value === "" ? null : Number(value);
  if (type === "boolean") return value === "true";
  return value === "" ? null : value;
}

export function ResourceManager({
  resource,
  initialRows,
  configured
}: {
  resource: AdminResource;
  initialRows: Row[];
  configured: boolean;
}) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [roundRobinOpen, setRoundRobinOpen] = useState(false);

  const filtered = useMemo(() => rows.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(query.toLowerCase())
  ), [rows, query]);

  function launch(row?: Row) {
    setEditing(row ?? {});
    setMessage("");
    setOpen(true);
  }

  async function upload(file: File, field: string) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const extension = file.name.split(".").pop() ?? "png";
    const path = `${resource.table}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
    if (error) return setMessage(error.message);
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    setEditing((current) => ({ ...(current ?? {}), [field]: data.publicUrl }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return setMessage("Connect Supabase to save changes. The controls are ready.");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(resource.fields.map((field) => [
      field.key,
      normaliseValue(formData.get(field.key) ?? "", field.type)
    ]));
    const operation = editing?.id
      ? supabase.from(resource.table).update(payload).eq("id", editing.id).select().single()
      : supabase.from(resource.table).insert(payload).select().single();
    const { data, error } = await operation;
    setBusy(false);
    if (error) return setMessage(error.message);
    setRows((current) => editing?.id ? current.map((row) => row.id === editing.id ? data : row) : [data, ...current]);
    setOpen(false);
  }

  async function remove(row: Row) {
    if (!configured || !row.id || !window.confirm(`Delete this ${resource.singular}?`)) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.from(resource.table).delete().eq("id", row.id);
    if (error) return setMessage(error.message);
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  async function createRoundRobin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return setMessage("Connect Supabase before generating fixtures.");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const { data: teamRows, error: teamError } = await supabase.from("teams").select("id").eq("archived", false).order("name");
    if (teamError || !teamRows?.length) {
      setBusy(false);
      return setMessage(teamError?.message ?? "Add teams before generating fixtures.");
    }
    const rounds = generateRoundRobin(teamRows.map((team) => team.id));
    const start = new Date(String(form.get("starts_at")));
    const fixtures = rounds.flatMap((round, roundIndex) => round.map(([home, away], matchIndex) => ({
      competition_id: String(form.get("competition_id")),
      season_id: String(form.get("season_id")),
      division_id: String(form.get("division_id")),
      league_id: String(form.get("league_id") || "") || null,
      round_name: `Round ${roundIndex + 1}`,
      home_team_id: home,
      away_team_id: away,
      starts_at: new Date(start.getTime() + roundIndex * 7 * 86_400_000 + matchIndex * 20 * 60_000).toISOString(),
      venue_id: String(form.get("venue_id") || "") || null,
      status: "scheduled"
    })));
    const { data, error } = await supabase.from("fixtures").insert(fixtures).select();
    setBusy(false);
    if (error) return setMessage(error.message);
    setRows((current) => [...(data ?? []), ...current]);
    setRoundRobinOpen(false);
    setMessage(`${fixtures.length} fixtures created across ${rounds.length} rounds.`);
  }

  return (
    <>
      <div className="admin-page-head">
        <div><span className="eyebrow">Content manager</span><h1>{resource.label}</h1><p>{resource.description}</p></div>
        <div className="admin-head-actions">
          {resource.table === "fixtures" && <button className="button button-outline-dark" onClick={() => setRoundRobinOpen(true)}>Generate round robin</button>}
          <button className="button button-gold" onClick={() => launch()}><Plus size={17} /> Add {resource.singular}</button>
        </div>
      </div>
      {!configured && <div className="setup-banner">Preview mode: add Supabase environment variables and run the included migration to enable saving, uploads and authentication.</div>}
      <div className="admin-toolbar">
        <label><Search size={17} /><input onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${resource.label.toLowerCase()}…`} value={query} /></label>
        <span>{filtered.length} item{filtered.length === 1 ? "" : "s"}</span>
      </div>
      {message && <p className="form-error admin-message">{message}</p>}
      <div className="admin-list">
        {filtered.map((row, index) => (
          <article key={row.id ?? index}>
            <div>
              <small>{String(row.status ?? row.tier ?? (row.active === false ? "Inactive" : "Active"))}</small>
              <h2>{String(row[resource.titleKey] ?? `Untitled ${resource.singular}`)}</h2>
              <p>{String(row.description ?? row.excerpt ?? row.location ?? row.address ?? "")}</p>
            </div>
            <div>
              <button aria-label="Edit" onClick={() => launch(row)}><Pencil size={17} /></button>
              {!resource.singleton && <button aria-label="Delete" onClick={() => remove(row)}><Trash2 size={17} /></button>}
            </div>
          </article>
        ))}
        {!filtered.length && <div className="admin-empty"><h2>No {resource.label.toLowerCase()} yet</h2><p>Add the first one with the button above.</p></div>}
      </div>

      {open && editing && (
        <div className="modal-backdrop" role="presentation">
          <div className="admin-modal" role="dialog" aria-modal="true" aria-label={`Edit ${resource.singular}`}>
            <div className="modal-head"><div><span className="eyebrow">{editing.id ? "Edit" : "Create"}</span><h2>{resource.singular}</h2></div><button onClick={() => setOpen(false)} aria-label="Close"><X /></button></div>
            <form onSubmit={save}>
              <div className="admin-form-grid">
                {resource.fields.map((field) => {
                  const value = editing[field.key];
                  if (field.type === "textarea") return <label className="wide" key={field.key}>{field.label}<textarea defaultValue={String(value ?? "")} name={field.key} required={field.required} rows={5} /></label>;
                  if (field.type === "select") return <label key={field.key}>{field.label}<select defaultValue={String(value ?? field.options?.[0]?.value ?? "")} name={field.key}>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
                  if (field.type === "boolean") return <label key={field.key}>{field.label}<select defaultValue={String(value ?? false)} name={field.key}><option value="false">No</option><option value="true">Yes</option></select></label>;
                  if (field.type === "image") return (
                    <label className="image-field" key={field.key}>{field.label}
                      <input name={field.key} onChange={(event) => setEditing((current) => ({ ...(current ?? {}), [field.key]: event.target.value }))} type="url" value={String(value ?? "")} />
                      <span><ImagePlus size={16} /> Upload image<input accept="image/*" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0], field.key)} type="file" /></span>
                    </label>
                  );
                  return <label key={field.key}>{field.label}<input defaultValue={String(value ?? "")} name={field.key} required={field.required} type={field.type ?? "text"} /></label>;
                })}
              </div>
              {message && <p className="form-error">{message}</p>}
              <div className="modal-actions"><button type="button" onClick={() => setOpen(false)}>Cancel</button><button className="button button-gold" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button></div>
            </form>
          </div>
        </div>
      )}
      {roundRobinOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Generate round robin">
            <div className="modal-head"><div><span className="eyebrow">Schedule builder</span><h2>Generate round robin</h2></div><button onClick={() => setRoundRobinOpen(false)} aria-label="Close"><X /></button></div>
            <form onSubmit={createRoundRobin}>
              <p className="modal-intro">Every active team will play every other team once. Rounds are scheduled seven days apart.</p>
              <div className="admin-form-grid">
                <label>Competition ID<input name="competition_id" required /></label>
                <label>Season ID<input name="season_id" required /></label>
                <label>League ID<input name="league_id" /></label>
                <label>Division ID<input name="division_id" required /></label>
                <label>First match date and time<input name="starts_at" required type="datetime-local" /></label>
                <label>Default venue ID<input name="venue_id" /></label>
              </div>
              {message && <p className="form-error">{message}</p>}
              <div className="modal-actions"><button type="button" onClick={() => setRoundRobinOpen(false)}>Cancel</button><button className="button button-gold" disabled={busy}>{busy ? "Generating…" : "Generate fixtures"}</button></div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
