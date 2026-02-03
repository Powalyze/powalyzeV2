import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function CockpitPage() {
  const supabase = await createClient();
  
  // Vérifier si l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // Récupérer le profile pour avoir l'organization_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();
  
  if (!profile?.organization_id) {
    // Pas d'organisation → Onboarding
    redirect('/cockpit/pro/onboarding');
  }
  
  // Compter les projets de l'organisation
  const { count } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', profile.organization_id);
  
  if (count === 0) {
    // Aucun projet → Onboarding
    redirect('/cockpit/pro/onboarding');
  }
  
  // A des projets → Dashboard pro
  redirect('/cockpit/pro');
}

