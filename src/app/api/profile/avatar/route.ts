import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("avatar") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const path = `${session.user.email.replace("@", "_")}/${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
