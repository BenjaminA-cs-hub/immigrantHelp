import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("users").insert([
    { username, email, password: hashedPassword },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}