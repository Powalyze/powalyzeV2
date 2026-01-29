import projects from "@/supabase/demo_seed/projects.json";
import risks from "@/supabase/demo_seed/risks.json";
import decisions from "@/supabase/demo_seed/decisions.json";
import reports from "@/supabase/demo_seed/reports.json";

export async function seedDemoData(userId: string, supabase: any) {
  console.log('[seedDemoData] Starting for user:', userId);

  // Create organization for demo user
  const orgId = crypto.randomUUID();
  
  await supabase.from("organizations").insert({
    id: orgId,
    name: "Espace Demo",
    owner_id: userId
  });
  console.log('[seedDemoData] ✅ Organization created:', orgId);

  // Update profile with organization_id
  await supabase.from("profiles").update({
    organization_id: orgId
  }).eq("id", userId);
  console.log('[seedDemoData] ✅ Profile updated with organization_id');

  // Add user to organization_members
  await supabase.from("organization_members").insert({
    id: crypto.randomUUID(),
    organization_id: orgId,
    user_id: userId,
    role: "admin"
  });
  console.log('[seedDemoData] ✅ User added to organization_members');

  // Seed demo data with organization_id
  if (projects.length) {
    await supabase.from("projects").insert(
      projects.map((p: any) => ({ ...p, organization_id: orgId }))
    );
    console.log('[seedDemoData] ✅ Projects seeded');
  }

  if (risks.length) {
    await supabase.from("risks").insert(
      risks.map((r: any) => ({ ...r, organization_id: orgId }))
    );
    console.log('[seedDemoData] ✅ Risks seeded');
  }

  if (decisions.length) {
    await supabase.from("decisions").insert(
      decisions.map((d: any) => ({ ...d, organization_id: orgId }))
    );
    console.log('[seedDemoData] ✅ Decisions seeded');
  }

  if (reports.length) {
    await supabase.from("reports").insert(
      reports.map((r: any) => ({ ...r, organization_id: orgId }))
    );
    console.log('[seedDemoData] ✅ Reports seeded');
  }

  return {
    organizationId: orgId,
    projects: projects.length,
    risks: risks.length,
    decisions: decisions.length,
    reports: reports.length
  };
}
