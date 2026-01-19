import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { CommitteeBriefRequest, CommitteeBriefResponse } from '@/types/cockpit';

export async function POST(request: NextRequest) {
  try {
    const body: CommitteeBriefRequest = await request.json();
    const { committee_id, meeting_date, include_projects, focus_areas } = body;

    if (!committee_id || !meeting_date) {
      return NextResponse.json(
        { success: false, error: 'committee_id and meeting_date are required' },
        { status: 400 }
      );
    }

    const { data: committee, error: committeeError } = await supabaseAdmin
      .from('committees')
      .select('*')
      .eq('id', committee_id)
      .single();

    if (committeeError || !committee) {
      return NextResponse.json(
        { success: false, error: 'Committee not found' },
        { status: 404 }
      );
    }

    let projectsQuery = supabaseAdmin
      .from('projects')
      .select('*')
      .eq('organization_id', committee.organization_id)
      .in('status', ['ACTIVE', 'ON_HOLD']);

    if (include_projects && include_projects.length > 0) {
      projectsQuery = projectsQuery.in('id', include_projects);
    }

    const [projectsRes, risksRes, decisionsRes, actionsRes] = await Promise.all([
      projectsQuery,
      supabaseAdmin
        .from('risks')
        .select('*')
        .eq('organization_id', committee.organization_id)
        .in('status', ['IDENTIFIED', 'ASSESSED', 'MITIGATING'])
        .gte('score', 40)
        .order('score', { ascending: false })
        .limit(15),
      supabaseAdmin
        .from('decisions')
        .select('*')
        .eq('organization_id', committee.organization_id)
        .or(`committee_id.eq.${committee_id},status.eq.PENDING`)
        .order('created_at', { ascending: false })
        .limit(20),
      supabaseAdmin
        .from('actions')
        .select('*')
        .eq('organization_id', committee.organization_id)
        .in('status', ['TODO', 'IN_PROGRESS', 'BLOCKED'])
        .in('priority', ['HIGH', 'CRITICAL'])
        .order('due_date', { ascending: true })
        .limit(20),
    ]);

    const prompt = buildCommitteeBriefPrompt({
      committee,
      meeting_date,
      projects: projectsRes.data || [],
      risks: risksRes.data || [],
      decisions: decisionsRes.data || [],
      actions: actionsRes.data || [],
      focus_areas,
    });

    const aiResponse = await callAzureOpenAI(prompt);

    const brief: CommitteeBriefResponse = {
      committee,
      executive_summary: aiResponse.executive_summary || '',
      agenda_items: aiResponse.agenda_items || [],
      decision_points: aiResponse.decision_points || [],
      kpi_dashboard: aiResponse.kpi_dashboard || [],
      generated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: brief,
    });

  } catch (error: any) {
    console.error('Committee brief error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

function buildCommitteeBriefPrompt(data: any): string {
  const { committee, meeting_date, projects, risks, decisions, actions, focus_areas } = data;

  return `
Tu es un assistant exécutif expert en préparation de comités de direction.
Génère un brief exécutif complet pour un comité de direction, structuré et actionnable.

## CONTEXTE DU COMITÉ
- Comité : ${committee.name} (${committee.type})
- Date de séance : ${meeting_date}
- Fréquence : ${committee.frequency || 'Non définie'}
- Membres : ${JSON.stringify(committee.members || [])}
- Description : ${committee.description || 'N/A'}
${focus_areas ? `- Axes de focus : ${focus_areas.join(', ')}` : ''}

## DONNÉES DU PORTFOLIO

### Projets actifs (${projects.length})
${projects.map((p: any) => `
- ${p.name} (${p.status}, RAG: ${p.rag_status})
  Criticité: ${p.criticality} | Avancement: ${p.completion_percentage}%
  Budget: ${p.budget}€ (Coût: ${p.actual_cost}€)
  Sponsor: ${p.sponsor} | PM: ${p.pm || 'Non assigné'}
  Dates: ${p.start_date} → ${p.end_date}
`).join('\n')}

### Risques critiques (${risks.length})
${risks.map((r: any) => `
- ${r.title} (Score: ${r.score})
  Probabilité: ${r.probability}% | Impact: ${r.impact}%
  Statut: ${r.status} | Owner: ${r.owner}
  ${r.description}
`).join('\n')}

### Décisions en attente (${decisions.length})
${decisions.map((d: any) => `
- ${d.title} (${d.type}, ${d.status})
  Owner: ${d.owner}
  ${d.description}
  ${d.justification ? 'Justification: ' + d.justification : ''}
`).join('\n')}

### Actions prioritaires (${actions.length})
${actions.map((a: any) => `
- ${a.title} (${a.priority}, ${a.status})
  Owner: ${a.owner} | Due: ${a.due_date}
`).join('\n')}

## FORMAT ATTENDU (JSON)
{
  "executive_summary": "Synthèse exécutive (3-5 lignes) pour ouvrir le comité, mettant en avant les enjeux clés",
  "agenda_items": [
    {
      "title": "Titre du point d'agenda",
      "type": "decision|update|risk|action",
      "priority": "high|medium|low",
      "description": "Description détaillée du point",
      "supporting_data": {
        "projects": ["id1", "id2"],
        "risks": ["id1"],
        "metrics": {"key": "value"}
      }
    }
  ],
  "decision_points": [
    {
      "decision_id": "id de la décision",
      "title": "Titre de la décision",
      "context": "Contexte et enjeux de la décision",
      "options": [
        "Option 1 : description avec avantages/inconvénients",
        "Option 2 : description avec avantages/inconvénients"
      ],
      "recommendation": "Recommandation argumentée avec justification"
    }
  ],
  "kpi_dashboard": [
    {
      "metric": "Nom de la métrique (ex: Taux de projets on-track)",
      "value": "Valeur (nombre ou texte)",
      "trend": "up|down|stable",
      "status": "GREEN|YELLOW|RED|GRAY"
    }
  ]
}

Génère ce brief avec un ton exécutif, structuré, orienté décision et action.
Les agenda_items doivent être ordonnés par priorité (high d'abord).
Les decision_points doivent présenter des options claires et une recommandation argumentée.
Les KPIs doivent être pertinents pour le type de comité.
`;
}

async function callAzureOpenAI(prompt: string): Promise<any> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';

  if (!endpoint || !apiKey) {
    return {
      executive_summary: 'Configuration Azure OpenAI manquante. Brief généré en mode démonstration.',
      agenda_items: [
        {
          title: 'Revue du portefeuille projets',
          type: 'update',
          priority: 'high',
          description: 'Point de situation sur les projets critiques',
        },
        {
          title: 'Arbitrage décisions stratégiques',
          type: 'decision',
          priority: 'high',
          description: 'Validation des décisions en attente',
        },
        {
          title: 'Risques majeurs',
          type: 'risk',
          priority: 'high',
          description: 'Revue des risques critiques et plans de mitigation',
        },
      ],
      decision_points: [],
      kpi_dashboard: [
        { metric: 'Projets on-track', value: '67%', trend: 'stable', status: 'YELLOW' },
        { metric: 'Risques critiques', value: '3', trend: 'down', status: 'GREEN' },
        { metric: 'Budget global', value: '92%', trend: 'up', status: 'YELLOW' },
      ],
    };
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
            content: 'Tu es un assistant exécutif expert en préparation de comités de direction. Tu produis des briefs structurés, clairs et actionnables.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
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
