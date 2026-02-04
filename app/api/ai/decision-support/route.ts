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
    const { decisionId } = await req.json();

    if (!decisionId) {
      return NextResponse.json({ error: 'Missing decision ID' }, { status: 400 });
    }

    // Récupérer la décision
    const { data: decision, error: decisionError } = await supabase
      .from('decisions')
      .select('*')
      .eq('id', decisionId)
      .eq('tenant_id', tenantId)
      .single();

    if (decisionError || !decision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
    }

    // Récupérer le contexte (projets, risques, capacités)
    const [projects, risks, capacities] = await Promise.all([
      supabase.from('projects').select('*').eq('tenant_id', tenantId),
      supabase.from('risks').select('*').eq('tenant_id', tenantId),
      supabase.from('capacities').select('*').eq('tenant_id', tenantId),
    ]);

    // TODO: Appel à OpenAI GPT-4 pour analyse de décision
    // Pour l'instant, génération d'un score mock basé sur les données
    const analysis = analyzeDecision(decision, {
      projects: projects.data || [],
      risks: risks.data || [],
      capacities: capacities.data || [],
    });

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('[AI Decision Support] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function analyzeDecision(decision: any, context: any) {
  const { projects, risks, capacities } = context;

  // Calcul du score de faisabilité (0-100)
  let feasibilityScore = 70;

  // Facteurs d'ajustement
  const activeProjects = projects.filter((p: any) => p.status === 'in_progress').length;
  const criticalRisks = risks.filter((r: any) => r.severity > 70).length;
  const saturatedCapacities = capacities.filter((c: any) => c.saturation_risk > 80).length;

  // Ajustement du score
  if (activeProjects > 10) feasibilityScore -= 10;
  if (criticalRisks > 3) feasibilityScore -= 15;
  if (saturatedCapacities > 2) feasibilityScore -= 20;

  // Calcul du score d'impact stratégique (0-100)
  const impactScore = decision.priority === 'critical' ? 90 : 
                      decision.priority === 'high' ? 70 :
                      decision.priority === 'medium' ? 50 : 30;

  // Recommandation
  let recommendation = 'approve';
  let rationale = '';

  if (feasibilityScore < 40) {
    recommendation = 'reject';
    rationale = `Faisabilité trop faible (${feasibilityScore}%). Contexte : ${activeProjects} projets actifs, ${criticalRisks} risques critiques, ${saturatedCapacities} capacités saturées.`;
  } else if (feasibilityScore < 60) {
    recommendation = 'conditional';
    rationale = `Faisabilité moyenne (${feasibilityScore}%). Recommandation : réduire la charge existante avant d'approuver. Prévoir un plan d'atténuation des risques.`;
  } else {
    recommendation = 'approve';
    rationale = `Bonne faisabilité (${feasibilityScore}%). Impact stratégique élevé (${impactScore}%). Le contexte actuel permet l'exécution de cette décision.`;
  }

  return {
    decision_id: decision.id,
    recommendation,
    feasibility_score: feasibilityScore,
    impact_score: impactScore,
    confidence: 0.85,
    rationale,
    risks_identified: [
      criticalRisks > 0 ? `${criticalRisks} risques critiques nécessitent une attention` : null,
      saturatedCapacities > 0 ? `${saturatedCapacities} capacités proches de la saturation` : null,
      activeProjects > 10 ? 'Portefeuille déjà très chargé' : null,
    ].filter(Boolean),
    alternatives: [
      {
        option: 'Différer de 3 mois',
        pros: 'Réduire la charge actuelle, meilleure préparation',
        cons: 'Impact stratégique retardé',
        score: 65
      },
      {
        option: 'Exécution par phases',
        pros: 'Répartir la charge, validation progressive',
        cons: 'Durée totale augmentée',
        score: 75
      }
    ]
  };
}
