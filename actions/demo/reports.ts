"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDemoReport(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const content = formData.get("content") as string;
  const project_id = formData.get("project_id") as string;

  const { data, error } = await supabase
    .from("demo_reports")
    .insert({
      user_id: user.id,
      project_id: project_id || null,
      title,
      type,
      content
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création rapport demo:", error);
    throw new Error("Erreur lors de la création du rapport");
  }

  revalidatePath("/cockpit-demo/rapports");
  redirect("/cockpit-demo/rapports");
}

export async function updateDemoReport(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const content = formData.get("content") as string;

  const { error } = await supabase
    .from("demo_reports")
    .update({
      title,
      type,
      content,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur mise à jour rapport demo:", error);
    throw new Error("Erreur lors de la mise à jour du rapport");
  }

  revalidatePath("/cockpit-demo/rapports");
  revalidatePath(`/cockpit-demo/rapports/${id}`);
  redirect("/cockpit-demo/rapports");
}

export async function deleteDemoReport(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { error } = await supabase
    .from("demo_reports")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur suppression rapport demo:", error);
    throw new Error("Erreur lors de la suppression du rapport");
  }

  revalidatePath("/cockpit-demo/rapports");
  redirect("/cockpit-demo/rapports");
}

export async function getDemoReports() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("demo_reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération rapports demo:", error);
    return [];
  }

  return data || [];
}

export async function getDemoReport(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("demo_reports")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erreur récupération rapport demo:", error);
    return null;
  }

  return data;
}
