"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProAnomaly(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const severity = formData.get("severity") as string;
  const project_id = formData.get("project_id") as string;

  const { data, error } = await supabase
    .from("anomalies")
    .insert({
      user_id: user.id,
      project_id: project_id || null,
      title,
      description,
      severity,
      status: "open"
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création anomalie pro:", error);
    throw new Error("Erreur lors de la création de l'anomalie");
  }

  revalidatePath("/cockpit/anomalies");
  redirect("/cockpit/anomalies");
}

export async function updateProAnomaly(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const severity = formData.get("severity") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("anomalies")
    .update({
      title,
      description,
      severity,
      status,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur mise à jour anomalie pro:", error);
    throw new Error("Erreur lors de la mise à jour de l'anomalie");
  }

  revalidatePath("/cockpit/anomalies");
  revalidatePath(`/cockpit/anomalies/${id}`);
  redirect("/cockpit/anomalies");
}

export async function deleteProAnomaly(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { error } = await supabase
    .from("anomalies")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur suppression anomalie pro:", error);
    throw new Error("Erreur lors de la suppression de l'anomalie");
  }

  revalidatePath("/cockpit/anomalies");
  redirect("/cockpit/anomalies");
}

export async function getProAnomalies() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("anomalies")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération anomalies pro:", error);
    return [];
  }

  return data || [];
}

export async function getProAnomaly(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("anomalies")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erreur récupération anomalie pro:", error);
    return null;
  }

  return data;
}
