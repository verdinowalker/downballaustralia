"use client";

import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";
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
          {adminNav.map((item) => <Link className={active === item.slug ? "active" : ""} href={`/admin/${item.slug}`} key={item.slug}>{item.label}</Link>)}
        </nav>
        <button onClick={signOut}><LogOut size={16} /> Sign out</button>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
