"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDemoRisk(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const impact = parseInt(formData.get("impact") as string);
  const probability = parseInt(formData.get("probability") as string);
  const mitigation = formData.get("mitigation") as string;
  const project_id = formData.get("project_id") as string;

  const { data, error } = await supabase
    .from("demo_risks")
    .insert({
      user_id: user.id,
      project_id: project_id || null,
      title,
      description,
      impact,
      probability,
      mitigation,
      status: "active"
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création risque demo:", error);
    throw new Error("Erreur lors de la création du risque");
  }

  revalidatePath("/cockpit-demo/risques");
  redirect("/cockpit-demo/risques");
}

export async function updateDemoRisk(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const impact = parseInt(formData.get("impact") as string);
  const probability = parseInt(formData.get("probability") as string);
  const status = formData.get("status") as string;
  const mitigation = formData.get("mitigation") as string;

  const { error } = await supabase
    .from("demo_risks")
    .update({
      title,
      description,
      impact,
      probability,
      status,
      mitigation,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur mise à jour risque demo:", error);
    throw new Error("Erreur lors de la mise à jour du risque");
  }

  revalidatePath("/cockpit-demo/risques");
  revalidatePath(`/cockpit-demo/risques/${id}`);
  redirect("/cockpit-demo/risques");
}

export async function deleteDemoRisk(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { error } = await supabase
    .from("demo_risks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur suppression risque demo:", error);
    throw new Error("Erreur lors de la suppression du risque");
  }

  revalidatePath("/cockpit-demo/risques");
  redirect("/cockpit-demo/risques");
}

export async function getDemoRisks() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("demo_risks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération risques demo:", error);
    return [];
  }

  return data || [];
}

export async function getDemoRisk(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("demo_risks")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erreur récupération risque demo:", error);
    return null;
  }

  return data;
}
