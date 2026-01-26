"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProConnector(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const api_url = formData.get("api_url") as string;
  const api_key = formData.get("api_key") as string;

  const { data, error } = await supabase
    .from("connectors")
    .insert({
      user_id: user.id,
      name,
      type,
      api_url,
      api_key,
      status: "active"
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création connecteur pro:", error);
    throw new Error("Erreur lors de la création du connecteur");
  }

  revalidatePath("/cockpit/connecteurs");
  redirect("/cockpit/connecteurs");
}

export async function updateProConnector(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const api_url = formData.get("api_url") as string;
  const api_key = formData.get("api_key") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("connectors")
    .update({
      name,
      type,
      api_url,
      api_key,
      status,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur mise à jour connecteur pro:", error);
    throw new Error("Erreur lors de la mise à jour du connecteur");
  }

  revalidatePath("/cockpit/connecteurs");
  revalidatePath(`/cockpit/connecteurs/${id}`);
  redirect("/cockpit/connecteurs");
}

export async function deleteProConnector(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { error } = await supabase
    .from("connectors")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur suppression connecteur pro:", error);
    throw new Error("Erreur lors de la suppression du connecteur");
  }

  revalidatePath("/cockpit/connecteurs");
  redirect("/cockpit/connecteurs");
}

export async function getProConnectors() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("connectors")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération connecteurs pro:", error);
    return [];
  }

  return data || [];
}

export async function getProConnector(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("connectors")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erreur récupération connecteur pro:", error);
    return null;
  }

  return data;
}
