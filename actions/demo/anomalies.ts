"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDemoAnomaly(formData: FormData) {
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
    .from("demo_anomalies")
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
    console.error("Erreur création anomalie demo:", error);
    throw new Error("Erreur lors de la création de l'anomalie");
  }

  revalidatePath("/cockpit-demo/anomalies");
  redirect("/cockpit-demo/anomalies");
}

export async function updateDemoAnomaly(id: string, formData: FormData) {
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
    .from("demo_anomalies")
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
    console.error("Erreur mise à jour anomalie demo:", error);
    throw new Error("Erreur lors de la mise à jour de l'anomalie");
  }

  revalidatePath("/cockpit-demo/anomalies");
  revalidatePath(`/cockpit-demo/anomalies/${id}`);
  redirect("/cockpit-demo/anomalies");
}

export async function deleteDemoAnomaly(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { error } = await supabase
    .from("demo_anomalies")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur suppression anomalie demo:", error);
    throw new Error("Erreur lors de la suppression de l'anomalie");
  }

  revalidatePath("/cockpit-demo/anomalies");
  redirect("/cockpit-demo/anomalies");
}

export async function getDemoAnomalies() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("demo_anomalies")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération anomalies demo:", error);
    return [];
  }

  return data || [];
}

export async function getDemoAnomaly(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("demo_anomalies")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erreur récupération anomalie demo:", error);
    return null;
  }

  return data;
}
