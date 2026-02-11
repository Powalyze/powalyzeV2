/// app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const path = `user-${user.id}/${Date.now()}-${file.name}`;

  const { data: storageData, error: storageError } = await supabase.storage
    .from("documents")
    .upload(path, buffer, {
      contentType: file.type,
    });

  if (storageError)
    return NextResponse.json({ error: storageError.message }, { status: 500 });

  const { error: insertError } = await supabase.from("documents").insert({
    name: file.name,
    size: file.size,
    type: file.type,
    version: 1,
    storage_path: storageData?.path ?? path,
    created_by: user.id,
  });

  if (insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
