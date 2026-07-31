import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(180),
  subject: z.string().trim().min(2).max(180),
  message: z.string().trim().min(10).max(5000)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ accepted: true });
  const { error } = await supabase.from("contact_messages").insert(parsed.data);
  if (error) return NextResponse.json({ error: "Unable to save message" }, { status: 500 });
  return NextResponse.json({ accepted: true });
}
