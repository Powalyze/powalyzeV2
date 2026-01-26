"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createConnector(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const name = formData.get("name") as string;
  const connector_type = formData.get("connector_type") as string;
  const api_key = formData.get("api_key") as string;
  const secret = formData.get("secret") as string;
  const api_url = formData.get("api_url") as string;

  const { data, error } = await supabase
    .from("connectors")
    .insert({
      user_id: user.id,
      name,
      connector_type,
      api_key,
      secret,
      api_url,
      status: "active"
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création connecteur:", error);
    throw new Error("Erreur lors de la création du connecteur");
  }

  revalidatePath("/cockpit/connecteurs");
  redirect("/cockpit/connecteurs");
}

export async function updateConnector(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const name = formData.get("name") as string;
  const connector_type = formData.get("connector_type") as string;
  const api_key = formData.get("api_key") as string;
  const secret = formData.get("secret") as string;
  const api_url = formData.get("api_url") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("connectors")
    .update({
      name,
      connector_type,
      api_key,
      secret,
      api_url,
      status,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur mise à jour connecteur:", error);
    throw new Error("Erreur lors de la mise à jour du connecteur");
  }

  revalidatePath("/cockpit/connecteurs");
  revalidatePath(`/cockpit/connecteurs/${id}`);
  redirect("/cockpit/connecteurs");
}

export async function deleteConnector(id: string) {
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
    console.error("Erreur suppression connecteur:", error);
    throw new Error("Erreur lors de la suppression du connecteur");
  }

  revalidatePath("/cockpit/connecteurs");
  redirect("/cockpit/connecteurs");
}

export async function testConnector(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  // Mettre à jour la date de dernière synchronisation
  const { error } = await supabase
    .from("connectors")
    .update({
      last_sync: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur test connecteur:", error);
    throw new Error("Erreur lors du test du connecteur");
  }

  revalidatePath(`/cockpit/connecteurs/${id}`);
  return { success: true };
}
