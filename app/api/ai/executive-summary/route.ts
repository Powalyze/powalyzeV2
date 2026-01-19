import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ExecutiveSummaryRequest, ExecutiveSummaryResponse } from '@/types/cockpit';

// ============================================
// POST /api/ai/executive-summary
// Génère un résumé exécutif narratif via Azure OpenAI
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body: ExecutiveSummaryRequest = await request.json();
    const { organization_id, scope = 'all', filters, committee_id } = body;

    if (!organization_id) {
      return NextResponse.json(
        { success: false, error: 'organization_id is required' },
        { status: 400 }
      );
    }

    // ============================================
    // 1. Récupérer les données du cockpit
    // ============================================
    
    // Projets critiques
    let projectsQuery = supabaseAdmin
      .from('projects')
      .select('*')
      .eq('organization_id', organization_id)
      .in('status', ['ACTIVE', 'ON_HOLD']);

    if (filters?.criticality) {
      projectsQuery = projectsQuery.in('criticality', filters.criticality);
    }

    const { data: projects, error: projectsError } = await projectsQuery;

    // Risques actifs
    const { data: risks, error: risksError } = await supabaseAdmin
      .from('risks')
      .select('*, projects(name)')
      .eq('organization_id', organization_id)
      .in('status', ['IDENTIFIED', 'ASSESSED', 'MITIGATING'])
      .gte('score', 30)
      .order('score', { ascending: false })
      .limit(10);

    // Décisions en attente
    const { data: decisions, error: decisionsError } = await supabaseAdmin
      .from('decisions')
      .select('*, projects(name)')
      .eq('organization_id', organization_id)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(10);

    // Actions prioritaires en retard ou critiques
    const today = new Date().toISOString().split('T')[0];
    const { data: actions, error: actionsError } = await supabaseAdmin
      .from('actions')
      .select('*, projects(name)')
      .eq('organization_id', organization_id)
      .in('status', ['TODO', 'IN_PROGRESS', 'BLOCKED'])
      .or(`due_date.lt.${today},priority.eq.CRITICAL`)
      .order('due_date', { ascending: true })
      .limit(15);

    if (projectsError || risksError || decisionsError || actionsError) {
      throw new Error('Error fetching cockpit data');
    }

    // ============================================
    // 2. Construire le prompt structuré pour l'IA
    // ============================================
    
    const prompt = buildExecutivePrompt({
      organization_id,
      projects: projects || [],
      risks: risks || [],
      decisions: decisions || [],
      actions: actions || [],
      scope,
    });

    // ============================================
    // 3. Appeler Azure OpenAI
    // ============================================
    
    const aiResponse = await callAzureOpenAI(prompt);

    // ============================================
    // 4. Parser et structurer la réponse
    // ============================================
    
    const summary: ExecutiveSummaryResponse = {
      summary: aiResponse.summary,
      critical_points: aiResponse.critical_points || [],
      risks_highlight: risks?.slice(0, 5).map((risk: any) => ({
        risk,
        narrative: aiResponse.risks_narrative?.[risk.id] || risk.description,
      })) || [],
      decisions_required: decisions?.map((decision: any) => ({
        decision,
        context: aiResponse.decisions_context?.[decision.id] || decision.description,
        recommendation: aiResponse.decisions_recommendations?.[decision.id] || '',
      })) || [],
      actions_priority: actions?.slice(0, 10).map((action: any) => ({
        action,
        urgency: action.priority === 'CRITICAL' || new Date(action.due_date) < new Date() ? 'URGENT' : 'IMPORTANT',
      })) || [],
      scenarios: aiResponse.scenarios || [],
      recommendations: aiResponse.recommendations || [],
      generated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: summary,
    });

  } catch (error: any) {
    console.error('Executive summary error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// Helper: Construire le prompt pour l'IA
// ============================================

function buildExecutivePrompt(data: any): string {
  const { projects, risks, decisions, actions, scope } = data;

  return `
Tu es un assistant exécutif expert en gouvernance de projets et gestion de portefeuille.
Génère un résumé exécutif narratif, professionnel et actionnable basé sur les données suivantes :

## CONTEXTE
- Scope: ${scope}
- Nombre de projets actifs: ${projects.length}
- Nombre de risques critiques: ${risks.length}
- Nombre de décisions en attente: ${decisions.length}
- Nombre d'actions prioritaires: ${actions.length}

## PROJETS ACTIFS
${projects.map((p: any) => `
- ${p.name} (${p.status}, RAG: ${p.rag_status})
  Budget: ${p.budget}€ | Coût actuel: ${p.actual_cost}€
  Avancement: ${p.completion_percentage}% | Criticité: ${p.criticality}
  Sponsor: ${p.sponsor} | PM: ${p.pm || 'Non assigné'}
`).join('\n')}

## RISQUES CRITIQUES
${risks.map((r: any) => `
- ${r.title} (Score: ${r.score}, Probabilité: ${r.probability}%, Impact: ${r.impact}%)
  Projet: ${r.projects?.name || 'Transverse'}
  Statut: ${r.status} | Owner: ${r.owner}
  ${r.description}
`).join('\n')}

## DÉCISIONS EN ATTENTE
${decisions.map((d: any) => `
- ${d.title} (Type: ${d.type})
  Projet: ${d.projects?.name || 'Transverse'}
  Owner: ${d.owner}
  ${d.description}
`).join('\n')}

## ACTIONS PRIORITAIRES
${actions.map((a: any) => `
- ${a.title} (${a.priority}, Due: ${a.due_date})
  Projet: ${a.projects?.name || 'Transverse'}
  Statut: ${a.status} | Owner: ${a.owner}
`).join('\n')}

## FORMAT ATTENDU (JSON)
{
  "summary": "Paragraphe de synthèse exécutive (3-5 lignes, ton professionnel, focus sur l'essentiel)",
  "critical_points": ["Point critique 1", "Point critique 2", "Point critique 3"],
  "risks_narrative": { "risk_id": "Narration contextuelle du risque" },
  "decisions_context": { "decision_id": "Contexte et enjeux de la décision" },
  "decisions_recommendations": { "decision_id": "Recommandation d'arbitrage" },
  "scenarios": [
    {
      "title": "Scénario optimiste/pessimiste/réaliste",
      "description": "Description du scénario",
      "probability": 60,
      "impact": "Description de l'impact"
    }
  ],
  "recommendations": ["Recommandation 1", "Recommandation 2", "Recommandation 3"]
}

Génère ce résumé avec un ton exécutif, orienté décision et action.
`;
}

// ============================================
// Helper: Appeler Azure OpenAI
// ============================================

async function callAzureOpenAI(prompt: string): Promise<any> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';

  if (!endpoint || !apiKey) {
    throw new Error('Azure OpenAI credentials not configured');
  }

  const response = await fetch(
    `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant exécutif expert en gouvernance de projets. Tu produis des analyses narratives structurées et actionnables.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Azure OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  return JSON.parse(content);
}
