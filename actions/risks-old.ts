"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTableName } from "@/lib/modeDetection";

export async function createRisk(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const impact = parseInt(formData.get("impact") as string);
  const probability = parseInt(formData.get("probability") as string);
  const project_id = formData.get("project_id") as string;

  const tableName = await getTableName("risks");

  const { data, error } = await supabase
    .from(tableName)
    .insert({
      user_id: user.id,
      project_id: project_id || null,
      title,
      description,
      impact,
      probability,
      status: "active"
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création risque:", error);
    throw new Error("Erreur lors de la création du risque");
  }

  revalidatePath("/cockpit/risques");
  redirect("/cockpit/risques");
}

export async function updateRisk(id: string, formData: FormData) {
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

  const tableName = await getTableName("risks");

  const { error } = await supabase
    .from(tableName)
    .update({
      title,
      description,
      impact,
      probability,
      status,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur mise à jour risque:", error);
    throw new Error("Erreur lors de la mise à jour du risque");
  }

  revalidatePath("/cockpit/risques");
  revalidatePath(`/cockpit/risques/${id}`);
  redirect("/cockpit/risques");
}

export async function deleteRisk(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const tableName = await getTableName("risks");

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erreur suppression risque:", error);
    throw new Error("Erreur lors de la suppression du risque");
  }

  revalidatePath("/cockpit/risques");
  redirect("/cockpit/risques");
}
