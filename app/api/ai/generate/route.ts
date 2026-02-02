import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

/**
 * POST /api/ai/generate
 * Génère un rapport IA (COMEX, risques, etc.)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer organization et settings
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id, plan, pro_active')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 });
    }

    const isDemo = profile.plan === 'demo' || !profile.pro_active;

    // Récupérer settings IA
    const { data: aiSettings } = await supabaseAdmin
      .from('ai_settings')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .single();

    if (!aiSettings?.enabled && !isDemo) {
      return NextResponse.json({ error: 'IA non activée' }, { status: 403 });
    }

    const { type } = await request.json();

    // Mode Demo: retourner données fictives
    if (isDemo || !aiSettings) {
      const demoBrief = generateDemoBrief();
      return NextResponse.json({
        brief: demoBrief,
        generation_time_ms: Date.now() - startTime,
        mode: 'demo',
      });
    }

    // Mode Pro: Génération réelle
    const brief = await generateRealBrief(profile.organization_id, type, aiSettings);

    // Enregistrer dans historique
    await supabaseAdmin.from('ai_generations').insert({
      organization_id: profile.organization_id,
      type,
      prompt_used: aiSettings.tone,
      output_content: JSON.stringify(brief),
      model_used: aiSettings.model,
      tone_used: aiSettings.tone,
      generation_time_ms: Date.now() - startTime,
      created_by: user.id,
    });

    return NextResponse.json({
      brief,
      generation_time_ms: Date.now() - startTime,
      mode: 'pro',
    });
  } catch (error: any) {
    console.error('Erreur génération IA:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * Génère un brief demo
 */
function generateDemoBrief() {
  return {
    synthese: "Sur les 12 projets du portefeuille, 3 sont en statut RED nécessitant une attention immédiate. Les risques financiers représentent 40% des alertes actuelles. Les décisions prises ce mois-ci vont permettre de débloquer 2 projets clés. La dérive budgétaire globale est de +8%, principalement due au projet 'Migration Cloud'.",
    projets_critiques: [
      {
        name: 'Migration Cloud',
        status: 'RED',
        risk: 'Dépassement budgétaire de 35%, retard de 6 semaines sur le planning initial',
      },
      {
        name: 'Refonte CRM',
        status: 'YELLOW',
        risk: 'Ressources critiques non disponibles, risque de dérive',
      },
      {
        name: 'Transformation Digitale',
        status: 'RED',
        risk: 'Résistance au changement forte, KPI adoption à 45% de la cible',
      },
    ],
    top_risques: [
      {
        title: 'Budget global dépassé de 8%',
        score: 8.5,
        mitigation: 'Revoir les priorités, geler les projets non critiques',
      },
      {
        title: 'Pénurie de compétences Cloud',
        score: 7.8,
        mitigation: 'Lancer plan de recrutement et formation interne',
      },
      {
        title: 'Dépendances inter-projets non gérées',
        score: 7.2,
        mitigation: 'Mettre en place gouvernance transverse',
      },
      {
        title: 'Délais non tenus sur 4 projets',
        score: 6.9,
        mitigation: 'Re-prioriser le backlog, ajuster ressources',
      },
      {
        title: 'Taux d\'adoption faible (52%)',
        score: 6.5,
        mitigation: 'Renforcer conduite du changement',
      },
    ],
    decisions_strategiques: [
      {
        title: 'Gel des projets non prioritaires',
        impact: 'Libère 3 ressources clés pour projets critiques',
      },
      {
        title: 'Externalisation infrastructure',
        impact: 'Réduit OPEX de 20%, accélère Migration Cloud',
      },
      {
        title: 'Budget additionnel +500K€',
        impact: 'Couvre dépassements Migration Cloud et CRM',
      },
    ],
    kpi_alerte: [
      {
        name: 'Budget consommé',
        value: 108,
        deviation: '+8% vs prévision',
      },
      {
        name: 'Taux de livraison',
        value: 68,
        deviation: '-12% vs objectif 80%',
      },
      {
        name: 'Vélocité équipes',
        value: 42,
        deviation: '-18% vs N-1',
      },
    ],
    recommandations: [
      'Organiser COMEX extraordinaire sur Migration Cloud pour arbitrer budget et délais',
      'Lancer plan de recrutement immédiat sur compétences Cloud et DevOps',
      'Mettre en place gouvernance PMO renforcée avec points hebdomadaires',
      'Suspendre 2 projets non critiques pour réallouer ressources',
      'Intensifier conduite du changement avec accompagnement terrain',
    ],
  };
}

/**
 * Génère un brief réel avec données Supabase + OpenAI
 */
async function generateRealBrief(organizationId: string, type: string, settings: any) {
  // Récupérer les données réelles
  const { data: projects } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('organization_id', organizationId);

  const { data: risks } = await supabaseAdmin
    .from('risks')
    .select('*')
    .eq('organization_id', organizationId)
    .order('risk_score', { ascending: false })
    .limit(10);

  const { data: decisions } = await supabaseAdmin
    .from('decisions')
    .select('*')
    .eq('organization_id', organizationId)
    .order('decision_date', { ascending: false })
    .limit(5);

  // Récupérer le prompt personnalisé
  const { data: customPrompt } = await supabaseAdmin
    .from('ai_prompts')
    .select('content')
    .eq('organization_id', organizationId)
    .eq('type', 'comex')
    .single();

  const prompt = customPrompt?.content || `Rédige un brief exécutif de 500 mots maximum, en mettant l'accent sur les décisions à prendre et les risques financiers. Utilise un ton factuel et précis. Structurez en 4 sections : Synthèse, Projets Critiques, Top Risques, Recommandations.`;

  // TODO: Appeler OpenAI/Claude/Azure OpenAI
  // Pour l'instant, retourner données structurées depuis Supabase

  const projets_critiques = projects
    ?.filter((p: any) => p.rag_status === 'RED')
    .slice(0, 3)
    .map((p: any) => ({
      name: p.name,
      status: p.rag_status,
      risk: p.description || 'Risque non spécifié',
    })) || [];

  const top_risques = risks?.slice(0, 5).map((r: any) => ({
    title: r.title,
    score: r.risk_score,
    mitigation: r.mitigation_plan || 'En cours d\'analyse',
  })) || [];

  const decisions_strategiques = decisions?.slice(0, 3).map((d: any) => ({
    title: d.title,
    impact: d.description || 'Impact en cours d\'évaluation',
  })) || [];

  return {
    synthese: `Analyse du portefeuille (${projects?.length || 0} projets). ${projets_critiques.length} projets en statut critique nécessitent une attention immédiate. ${top_risques.length} risques majeurs identifiés.`,
    projets_critiques,
    top_risques,
    decisions_strategiques,
    kpi_alerte: [
      {
        name: 'Projets RED',
        value: projets_critiques.length,
        deviation: `${projets_critiques.length} / ${projects?.length || 0}`,
      },
    ],
    recommandations: [
      'Prioriser les actions correctives sur les projets en statut RED',
      'Renforcer le suivi des risques critiques',
      'Organiser revue de portefeuille hebdomadaire',
    ],
  };
}
