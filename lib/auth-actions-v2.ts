// ============================================================
// POWALYZE V2 — AUTH ACTIONS (Server Actions)
// ============================================================
// Actions serveur pour login, signup, logout
// ============================================================

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'Email et mot de passe requis' };
  }
  
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  // Récupérer le plan pour rediriger vers le bon cockpit
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Erreur d\'authentification' };
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();
  
  const plan = profile?.plan || 'demo';
  
  revalidatePath('/', 'layout');
  
  // Rediriger vers le bon cockpit
  if (plan === 'demo') {
    redirect('/cockpit/demo');
  } else {
    redirect('/cockpit/pro');
  }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  
  if (!email || !password) {
    return { error: 'Email et mot de passe requis' };
  }
  
  const supabase = await createClient();
  
  // 1. Créer le compte auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });
  
  if (authError) {
    return { error: authError.message };
  }
  
  if (!authData.user) {
    return { error: 'Erreur lors de la création du compte' };
  }
  
  // 2. Créer une organization pour ce nouvel utilisateur
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: `Organisation de ${firstName || email}`,
    })
    .select()
    .single();
  
  if (orgError || !org) {
    console.error('Error creating organization:', orgError);
    return { error: 'Erreur lors de la création de l\'organisation' };
  }
  
  // 3. Créer le profile avec plan demo par défaut
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      organization_id: org.id,
      email,
      first_name: firstName,
      last_name: lastName,
      plan: 'demo',
      role: 'owner',
    });
  
  if (profileError) {
    console.error('Error creating profile:', profileError);
    return { error: 'Erreur lors de la création du profil' };
  }
  
  revalidatePath('/', 'layout');
  redirect('/cockpit/demo');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function upgradeToPro() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login-v2');
  }
  
  await supabase
    .from('profiles')
    .update({ plan: 'pro' })
    .eq('id', user.id);
  
  revalidatePath('/', 'layout');
  redirect('/cockpit/pro');
}
