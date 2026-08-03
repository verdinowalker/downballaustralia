"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function login(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Add your Supabase environment variables to enable administrator login.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMessage(error.message);
    window.location.href = "/admin";
  }

  return (
    <form className="admin-login-form" onSubmit={login}>
      <span className="eyebrow">Secure administration</span>
      <h1>Welcome back</h1>
      <p>Sign in to manage Downball Australia.</p>
      <label>Email<input autoComplete="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
      <label>Password<input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
      <button className="button button-gold">Sign in</button>
      {message && <p className="form-error">{message}</p>}
    </form>
  );
}
