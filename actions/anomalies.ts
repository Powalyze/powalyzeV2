"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTableName } from "@/lib/modeDetection";

export async function createAnomaly(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const severity = formData.get("severity") as string;
  const project_id = formData.get("project_id") as string;

  const tableName = await getTableName("anomalies");

  const { data, error } = await supabase
    .from(tableName)
    .insert({
      user_id: user.id,
      project_id: project_id || null,
      title,
      description,
      severity: severity || "medium",
      status: "open"
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création anomalie:", error);
    throw new Error("Erreur lors de la création de l'anomalie");
  }

  revalidatePath("/cockpit/anomalies");
  redirect("/cockpit/anomalies");
}

export async function updateAnomaly(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const severity = formData.get("severity") as string;
  const status = formData.get("status") as string;

  const updateData: any = {
    title,
    description,
    severity,
    status,
    updated_at: new Date().toISOString()
  };

  // Si l'anomalie est résolue, on ajoute la date
  if (status === "resolved") {
    updateData.resolved_at = new Date().toISOString();
  }

  const tableName = await getTableName("anomalies");

  const { error } = await supabase
    .from(tableName)
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur mise à jour anomalie:", error);
    throw new Error("Erreur lors de la mise à jour de l'anomalie");
  }

  revalidatePath("/cockpit/anomalies");
  revalidatePath(`/cockpit/anomalies/${id}`);
  redirect("/cockpit/anomalies");
}

export async function deleteAnomaly(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const tableName = await getTableName("anomalies");

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur suppression anomalie:", error);
    throw new Error("Erreur lors de la suppression de l'anomalie");
  }

  revalidatePath("/cockpit/anomalies");
  redirect("/cockpit/anomalies");
}

export async function getAnomalies() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const tableName = await getTableName("anomalies");

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération anomalies:", error);
    return [];
  }

  return data || [];
}

export async function getAnomaly(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const tableName = await getTableName("anomalies");

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erreur récupération anomalie:", error);
    return null;
  }

  return data;
}
