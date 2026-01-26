"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProReport(formData: FormData) {
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
    .from("reports")
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
    console.error("Erreur création rapport pro:", error);
    throw new Error("Erreur lors de la création du rapport");
  }

  revalidatePath("/cockpit/rapports");
  redirect("/cockpit/rapports");
}

export async function updateProReport(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const content = formData.get("content") as string;

  const { error } = await supabase
    .from("reports")
    .update({
      title,
      type,
      content,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur mise à jour rapport pro:", error);
    throw new Error("Erreur lors de la mise à jour du rapport");
  }

  revalidatePath("/cockpit/rapports");
  revalidatePath(`/cockpit/rapports/${id}`);
  redirect("/cockpit/rapports");
}

export async function deleteProReport(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur suppression rapport pro:", error);
    throw new Error("Erreur lors de la suppression du rapport");
  }

  revalidatePath("/cockpit/rapports");
  redirect("/cockpit/rapports");
}

export async function getProReports() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false});

  if (error) {
    console.error("Erreur récupération rapports pro:", error);
    return [];
  }

  return data || [];
}

export async function getProReport(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erreur récupération rapport pro:", error);
    return null;
  }

  return data;
}
