import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data ?? {});
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const updates: Record<string, string> = {};
  if (body.username !== undefined) updates.username = body.username;
  if (body.ethnicity !== undefined) updates.ethnicity = body.ethnicity;
  if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url;

  const { error, count } = await supabase
    .from("users")
    .update(updates, { count: "exact" })
    .eq("email", session.user.email);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (count === 0) return NextResponse.json({ error: "No user found to update. Check your Supabase RLS policies." }, { status: 400 });

  return NextResponse.json({ success: true });
}
