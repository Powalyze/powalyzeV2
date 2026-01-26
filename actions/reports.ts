"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTableName } from "@/lib/modeDetection";

export async function createReport(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const report_type = formData.get("report_type") as string;
  const project_id = formData.get("project_id") as string;

  const tableName = await getTableName("reports");

  const { data, error } = await supabase
    .from(tableName)
    .insert({
      user_id: user.id,
      project_id: project_id || null,
      title,
      content,
      report_type: report_type || "general"
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création rapport:", error);
    throw new Error("Erreur lors de la création du rapport");
  }

  revalidatePath("/cockpit/rapports");
  redirect("/cockpit/rapports");
}

export async function updateReport(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const report_type = formData.get("report_type") as string;

  const tableName = await getTableName("reports");

  const { error } = await supabase
    .from(tableName)
    .update({
      title,
      content,
      report_type,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur mise à jour rapport:", error);
    throw new Error("Erreur lors de la mise à jour du rapport");
  }

  revalidatePath("/cockpit/rapports");
  revalidatePath(`/cockpit/rapports/${id}`);
  redirect("/cockpit/rapports");
}

export async function deleteReport(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const tableName = await getTableName("reports");

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur suppression rapport:", error);
    throw new Error("Erreur lors de la suppression du rapport");
  }

  revalidatePath("/cockpit/rapports");
  redirect("/cockpit/rapports");
}

export async function getReports() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const tableName = await getTableName("reports");

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération rapports:", error);
    return [];
  }

  return data || [];
}

export async function getReport(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const tableName = await getTableName("reports");

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erreur récupération rapport:", error);
    return null;
  }

  return data;
}
