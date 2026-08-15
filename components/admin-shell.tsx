"use client";

import Link from "next/link";
import { Activity, LogOut, ShieldCheck, Video } from "lucide-react";
import { adminNav } from "@/lib/admin-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminShell({ children, active }: { children: React.ReactNode; active?: string }) {
  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-title" href="/admin"><ShieldCheck size={24} /><span>Control room<small>Downball Australia</small></span></Link>
        <nav>
          <Link className={!active ? "active" : ""} href="/admin">Dashboard</Link>
          <Link className={active === "live-match-control" ? "active" : ""} href="/admin/live-match-control"><Activity size={15} /> Live Match Control</Link>
          <Link className={active === "highlights" ? "active" : ""} href="/admin/highlights"><Video size={15} /> Highlights</Link>
          {adminNav.map((item) => <Link className={active === item.slug ? "active" : ""} href={`/admin/${item.slug}`} key={item.slug}>{item.label}</Link>)}
        </nav>
        <button onClick={signOut}><LogOut size={16} /> Sign out</button>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
