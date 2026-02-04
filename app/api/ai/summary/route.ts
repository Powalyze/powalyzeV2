import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const tenantId = req.headers.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
  }

  try {
    // Récupérer toutes les données pour le contexte IA
    const [overview, projects, risks, decisions, anomalies] = await Promise.all([
      supabase.from('executive_overview').select('*').eq('tenant_id', tenantId).single(),
      supabase.from('projects').select('*').eq('tenant_id', tenantId),
      supabase.from('risks').select('*').eq('tenant_id', tenantId),
      supabase.from('decisions').select('*').eq('tenant_id', tenantId).eq('status', 'pending'),
      supabase.from('anomalies').select('*').eq('tenant_id', tenantId).eq('resolved', false),
    ]);

    // Construction du contexte pour l'IA
    const context = {
      overview: overview.data,
      projects: projects.data || [],
      risks: risks.data || [],
      decisions: decisions.data || [],
      anomalies: anomalies.data || [],
    };

    // TODO: Appel à OpenAI GPT-4 pour générer le résumé
    // Pour l'instant, génération d'un résumé mock basé sur les données
    const summary = generateMockSummary(context);

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('[AI Summary] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateMockSummary(context: any) {
  const { overview, projects, risks, decisions, anomalies } = context;

  const activeProjects = projects.filter((p: any) => p.status === 'in_progress').length;
  const criticalRisks = risks.filter((r: any) => r.severity > 70).length;
  const highPriorityDecisions = decisions.filter((d: any) => d.priority === 'critical' || d.priority === 'high').length;

  return {
    executive_summary: `Le portefeuille affiche ${overview?.projects_active || 0} projets actifs avec un alignement stratégique moyen de ${overview?.strategic_alignment?.toFixed(1) || 0}%. ${activeProjects} projets sont actuellement en cours d'exécution. Le budget consommé s'élève à ${overview?.budget_spent_total?.toLocaleString() || 0} CHF sur ${overview?.budget_planned_total?.toLocaleString() || 0} CHF planifiés.`,
    
    risks_summary: `${criticalRisks} risques critiques nécessitent une attention immédiate. Les principaux domaines d'alerte concernent ${risks.length > 0 ? 'les délais et les budgets' : 'aucun domaine spécifique'}. Une revue des risques est recommandée pour les projets présentant un niveau de sévérité élevé.`,
    
    decisions_summary: `${decisions.length} décisions sont en attente de validation, dont ${highPriorityDecisions} à haute priorité. ${highPriorityDecisions > 0 ? 'Ces décisions critiques nécessitent une action rapide pour éviter les blocages.' : 'Le pipeline de décisions est sous contrôle.'}`,
    
    priorities_summary: `Priorités immédiates : ${anomalies.length > 0 ? `résoudre ${anomalies.length} anomalie(s) détectée(s), ` : ''}valider les décisions en attente depuis plus de 30 jours, et assurer le suivi des projets présentant un écart budgétaire. Focus sur l'alignement stratégique pour maintenir la performance globale du portefeuille.`
  };
}
