import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", params.id)
    .eq("created_by", user.id)
    .single();

  if (error || !data)
    return NextResponse.json({ error: error?.message ?? "Not found" }, { status: 404 });

  const { error: storageError } = await supabase.storage
    .from("documents")
    .remove([data.storage_path]);

  if (storageError)
    return NextResponse.json({ error: storageError.message }, { status: 500 });

  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("id", params.id)
    .eq("created_by", user.id);

  if (deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
