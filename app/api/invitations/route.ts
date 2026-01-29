import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { email, role } = await req.json();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id, role")
    .eq("id", session.user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const token = crypto.randomUUID();

  const { error } = await supabase.from("invitations").insert({
    id: crypto.randomUUID(),
    organization_id: profile.organization_id,
    email,
    role: role ?? "member",
    token
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: Send email with invitation link
  // const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?invitation=${token}`;
  // await sendInvitationEmail(email, invitationUrl);

  return NextResponse.json({ ok: true, token });
}
