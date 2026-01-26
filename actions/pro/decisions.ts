"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProDecision(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const decision_maker = formData.get("decision_maker") as string;
  const project_id = formData.get("project_id") as string;

  const { data, error } = await supabase
    .from("decisions")
    .insert({
      user_id: user.id,
      project_id: project_id || null,
      title,
      description,
      decision_maker,
      status: "pending"
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création décision pro:", error);
    throw new Error("Erreur lors de la création de la décision");
  }

  revalidatePath("/cockpit/decisions");
  redirect("/cockpit/decisions");
}

export async function updateProDecision(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const decision_maker = formData.get("decision_maker") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("decisions")
    .update({
      title,
      description,
      decision_maker,
      status,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur mise à jour décision pro:", error);
    throw new Error("Erreur lors de la mise à jour de la décision");
  }

  revalidatePath("/cockpit/decisions");
  revalidatePath(`/cockpit/decisions/${id}`);
  redirect("/cockpit/decisions");
}

export async function deleteProDecision(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { error } = await supabase
    .from("decisions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur suppression décision pro:", error);
    throw new Error("Erreur lors de la suppression de la décision");
  }

  revalidatePath("/cockpit/decisions");
  redirect("/cockpit/decisions");
}

export async function getProDecisions() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("decisions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération décisions pro:", error);
    return [];
  }

  return data || [];
}

export async function getProDecision(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("decisions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erreur récupération décision pro:", error);
    return null;
  }

  return data;
}
