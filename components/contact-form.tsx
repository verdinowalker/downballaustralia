"use client";

import { useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form))
    });
    setState(response.ok ? "sent" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>Name<input name="name" required /></label>
      <label>Email<input name="email" required type="email" /></label>
      <label>Subject<input name="subject" required /></label>
      <label>Message<textarea name="message" required rows={7} /></label>
      <button className="button button-gold" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button>
      {state === "sent" && <p className="form-success">Thanks — your message has been received.</p>}
      {state === "error" && <p className="form-error">The message could not be sent. Please try again.</p>}
    </form>
  );
}
