"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTableName } from "@/lib/modeDetection";

export async function createDecision(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const decision_maker = formData.get("decision_maker") as string;
  const project_id = formData.get("project_id") as string;

  const tableName = await getTableName("decisions");

  const { data, error } = await supabase
    .from(tableName)
    .insert({
      user_id: user.id,
      project_id: project_id || null,
      title,
      description,
      status: status || "pending",
      decision_maker
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création décision:", error);
    throw new Error("Erreur lors de la création de la décision");
  }

  revalidatePath("/cockpit/decisions");
  redirect("/cockpit/decisions");
}

export async function updateDecision(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const decision_maker = formData.get("decision_maker") as string;

  const updateData: any = {
    title,
    description,
    status,
    decision_maker,
    updated_at: new Date().toISOString()
  };

  // Si la décision est validée, on ajoute la date
  if (status === "approved" || status === "rejected") {
    updateData.decided_at = new Date().toISOString();
  }

  const tableName = await getTableName("decisions");

  const { error } = await supabase
    .from(tableName)
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur mise à jour décision:", error);
    throw new Error("Erreur lors de la mise à jour de la décision");
  }

  revalidatePath("/cockpit/decisions");
  revalidatePath(`/cockpit/decisions/${id}`);
  redirect("/cockpit/decisions");
}

export async function deleteDecision(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const tableName = await getTableName("decisions");

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur suppression décision:", error);
    throw new Error("Erreur lors de la suppression de la décision");
  }

  revalidatePath("/cockpit/decisions");
  redirect("/cockpit/decisions");
}

export async function getDecisions() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const tableName = await getTableName("decisions");

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération décisions:", error);
    return [];
  }

  return data || [];
}

export async function getDecision(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const tableName = await getTableName("decisions");

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erreur récupération décision:", error);
    return null;
  }

  return data;
}
