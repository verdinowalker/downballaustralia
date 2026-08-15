"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Highlight = {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  fixture_id: string | null;
  featured_player: string | null;
  published_at: string;
  featured: boolean;
  status: string;
};

type Option = { id: string; label: string };

export function HighlightsAdmin({ initialRows, fixtures, players }: { initialRows: Highlight[]; fixtures: Option[]; players: Option[] }) {
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<Partial<Highlight> | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function open(row?: Highlight) {
    setEditing(row ?? { title: "", description: "", video_url: "", thumbnail_url: "", fixture_id: "", featured_player: "", published_at: new Date().toISOString(), featured: false, status: "published" });
    setVideoFile(null); setThumbnailFile(null); setMessage("");
  }

  async function upload(file: File, folder: string) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) throw new Error("Supabase is not configured.");
    const extension = file.name.split(".").pop() ?? "mp4";
    const path = `highlights/${folder}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false, contentType: file.type || undefined });
    if (error) throw error;
    return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true); setMessage("");
    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) throw new Error("Connect Supabase to save highlights.");
      let videoUrl = editing.video_url ?? "";
      let thumbnailUrl = editing.thumbnail_url ?? null;
      if (videoFile) videoUrl = await upload(videoFile, "videos");
      if (thumbnailFile) thumbnailUrl = await upload(thumbnailFile, "thumbnails");
      if (!videoUrl) throw new Error("Upload a highlight video or provide a video URL.");
      const payload = {
        title: editing.title?.trim(), description: editing.description || null, video_url: videoUrl, thumbnail_url: thumbnailUrl,
        fixture_id: editing.fixture_id || null, featured_player: editing.featured_player || null,
        published_at: editing.published_at || new Date().toISOString(), featured: Boolean(editing.featured), status: editing.status || "published"
      };
      if (!payload.title) throw new Error("Add a highlight title.");
      const result = editing.id
        ? await supabase.from("highlights").update(payload).eq("id", editing.id).select().single()
        : await supabase.from("highlights").insert(payload).select().single();
      if (result.error) throw result.error;
      setRows((current) => editing.id ? current.map((row) => row.id === editing.id ? result.data : row) : [result.data, ...current]);
      setEditing(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save highlight.");
    } finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this highlight?")) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.from("highlights").delete().eq("id", id);
    if (error) return setMessage(error.message);
    setRows((current) => current.filter((row) => row.id !== id));
  }

  return (
    <>
      <div className="admin-page-head"><div><span className="eyebrow">Downball Australia Media</span><h1>Highlights</h1><p>Upload, schedule and manage official match videos.</p></div><button className="button button-gold" onClick={() => open()}><Plus size={17} /> Add highlight</button></div>
      {message && <p className="form-error admin-message">{message}</p>}
      <div className="admin-list">
        {rows.map((row) => <article key={row.id}>
          <div><small>{row.status} · {new Date(row.published_at).toLocaleString("en-AU")}</small><h2>{row.title}</h2><p>{row.description ?? "Official match highlight"}</p></div>
          <div><button aria-label="Edit" onClick={() => open(row)}><Pencil size={17} /></button><button aria-label="Delete" onClick={() => remove(row.id)}><Trash2 size={17} /></button></div>
        </article>)}
        {!rows.length && <div className="admin-empty"><h2>No highlights yet</h2><p>Upload your first match video.</p></div>}
      </div>
      {editing && <div className="modal-backdrop"><div className="admin-modal" role="dialog" aria-modal="true">
        <div className="modal-head"><div><span className="eyebrow">{editing.id ? "Edit" : "Create"}</span><h2>Match highlight</h2></div><button onClick={() => setEditing(null)} aria-label="Close"><X /></button></div>
        <form onSubmit={save}><div className="admin-form-grid">
          <label>Title<input required value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
          <label>Publish date & time<input type="datetime-local" value={editing.published_at ? new Date(editing.published_at).toISOString().slice(0,16) : ""} onChange={(e) => setEditing({ ...editing, published_at: new Date(e.target.value).toISOString() })} /></label>
          <label className="wide">Description<textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
          <label>Match<select value={editing.fixture_id ?? ""} onChange={(e) => setEditing({ ...editing, fixture_id: e.target.value })}><option value="">No match linked</option>{fixtures.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
          <label>Featured player<select value={editing.featured_player ?? ""} onChange={(e) => setEditing({ ...editing, featured_player: e.target.value })}><option value="">None</option>{players.map((o) => <option key={o.id} value={o.label}>{o.label}</option>)}</select></label>
          <label>Video URL<input type="url" placeholder="https://…" value={editing.video_url ?? ""} onChange={(e) => setEditing({ ...editing, video_url: e.target.value })} /></label>
          <label className="upload-field">Upload video<span><Upload size={16} /> Choose video<input accept="video/*" type="file" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} /></span>{videoFile && <small>{videoFile.name}</small>}</label>
          <label>Thumbnail URL<input type="url" placeholder="https://…" value={editing.thumbnail_url ?? ""} onChange={(e) => setEditing({ ...editing, thumbnail_url: e.target.value })} /></label>
          <label className="upload-field">Upload thumbnail<span><Upload size={16} /> Choose image<input accept="image/*" type="file" onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)} /></span>{thumbnailFile && <small>{thumbnailFile.name}</small>}</label>
          <label>Status<select value={editing.status ?? "published"} onChange={(e) => setEditing({ ...editing, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
          <label>Featured<select value={String(Boolean(editing.featured))} onChange={(e) => setEditing({ ...editing, featured: e.target.value === "true" })}><option value="false">No</option><option value="true">Yes</option></select></label>
        </div>{message && <p className="form-error">{message}</p>}<div className="modal-actions"><button type="button" onClick={() => setEditing(null)}>Cancel</button><button className="button button-gold" disabled={busy}>{busy ? "Uploading…" : "Save highlight"}</button></div></form>
      </div></div>}
    </>
  );
}
