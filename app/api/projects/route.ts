import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Les policies RLS filtrent automatiquement par owner_id = auth.uid()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`Fetched ${data?.length || 0} projects for user ${user.id}`);
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: body.name,
      status: body.status ?? "draft",
      owner_id: body.owner_id ?? user.id,
      start_date: body.start_date ?? null,
      end_date: body.end_date ?? null,
      progress: body.progress ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
