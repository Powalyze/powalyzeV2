// ============================================================================
// Seed Demo Data - Injecte les données demo depuis JSON
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import projectsData from '@/demo_seed/projects.json';
import risksData from '@/demo_seed/risks.json';
import decisionsData from '@/demo_seed/decisions.json';
import reportsData from '@/demo_seed/reports.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function seedDemoData(userId: string) {
  console.log('[seedDemoData] Starting for user:', userId);

  // 1. Projets
  await supabaseAdmin.from('projects').insert(
    projectsData.map(p => ({ ...p, user_id: userId }))
  );
  console.log('[seedDemoData] ✅ Projects seeded');

  // 2. Risques
  await supabaseAdmin.from('risks').insert(
    risksData.map(r => ({ ...r, user_id: userId }))
  );
  console.log('[seedDemoData] ✅ Risks seeded');

  // 3. Décisions
  await supabaseAdmin.from('decisions').insert(
    decisionsData.map(d => ({ ...d, user_id: userId }))
  );
  console.log('[seedDemoData] ✅ Decisions seeded');

  // 4. Rapports
  await supabaseAdmin.from('reports').insert(
    reportsData.map(r => ({ ...r, user_id: userId }))
  );
  console.log('[seedDemoData] ✅ Reports seeded');

  return {
    projects: projectsData.length,
    risks: risksData.length,
    decisions: decisionsData.length,
    reports: reportsData.length
  };
}
