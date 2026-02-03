// ============================================================
// API ROUTE: AI SCENARIOS GENERATION
// POST /api/ai/scenarios/generate
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';
import { MOCK_SCENARIOS, simulateAPIDelay, calculateMockTokens } from '@/lib/ai-mock-data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const USE_MOCK = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-fake');

const SCENARIOS_GENERATION_PROMPT = `Tu es un expert en prévisions de projet et analyse prédictive.

Ton rôle est de créer 3 scénarios prévisionnels pour un projet:
1. Optimiste: Tout se passe mieux que prévu
2. Central (réaliste): Scénario le plus probable
3. Pessimiste: Plusieurs difficultés surviennent

Pour chaque scénario, fournis:
- type: "optimistic", "central" ou "pessimistic"
- probability: probabilité d'occurrence (optimistic ~20%, central ~60%, pessimistic ~20%)
- delivery_date: date de livraison estimée (format ISO 8601)
- final_budget: budget final estimé (number)
- business_impacts: array de 3-5 impacts business (strings détaillés, 30-80 mots chacun)
- actions: array de 3-5 actions recommandées pour ce scénario (strings, 30-80 mots)

RÈGLES:
1. Base-toi sur:
   - Les données projet (budget initial, deadline initiale)
   - Les risques identifiés
   - Les décisions à prendre

2. Scénario Optimiste:
   - Livraison 10-20% plus tôt que prévu
   - Budget 5-15% inférieur
   - Impacts business très positifs
   - Actions pour maximiser les gains

3. Scénario Central:
   - Livraison ±5% de la deadline initiale
   - Budget ±10% du budget initial
   - Impacts business équilibrés
   - Actions pour maintenir le cap

4. Scénario Pessimiste:
   - Livraison 15-30% plus tard
   - Budget 15-30% supérieur
   - Impacts business négatifs mais gérables
   - Actions pour limiter les dégâts

5. Sois réaliste: les scénarios doivent être crédibles
6. Les impacts business doivent être mesurables ou observables
7. Les actions doivent être concrètes et actionnables

RÉPONDS UNIQUEMENT avec un JSON valide:
{
  "scenarios": [
    {
      "type": "optimistic",
      "probability": 20,
      "delivery_date": "2025-06-01T00:00:00Z",
      "final_budget": 2000000,
      "business_impacts": ["...", "...", "..."],
      "actions": ["...", "...", "..."]
    },
    {
      "type": "central",
      "probability": 60,
      "delivery_date": "2025-09-01T00:00:00Z",
      "final_budget": 2500000,
      "business_impacts": ["...", "...", "..."],
      "actions": ["...", "...", "..."]
    },
    {
      "type": "pessimistic",
      "probability": 20,
      "delivery_date": "2025-12-01T00:00:00Z",
      "final_budget": 3200000,
      "business_impacts": ["...", "...", "..."],
      "actions": ["...", "...", "..."]
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Récupérer le profil et organization_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.organization_id) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    const organizationId = profile.organization_id;

    // 3. Parser le body
    const body = await request.json();
    const { projectId, projectName, projectDescription, budget, deadline, risks, decisions } = body;

    if (!projectId || !projectName || !projectDescription) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, projectName, projectDescription' },
        { status: 400 }
      );
    }

    // 4. Vérifier que le projet appartient à l'organisation
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, organization_id')
      .eq('id', projectId)
      .eq('organization_id', organizationId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // 5. Construire le prompt utilisateur
    let userPrompt = `Projet: ${projectName}\n\nDescription: ${projectDescription}`;
    
    if (budget) {
      userPrompt += `\n\nBudget Initial: ${budget.toLocaleString('fr-FR')} €`;
    }
    
    if (deadline) {
      userPrompt += `\n\nDeadline Initiale: ${new Date(deadline).toLocaleDateString('fr-FR')}`;
    }

    // Ajouter les risques si fournis
    if (risks && Array.isArray(risks) && risks.length > 0) {
      userPrompt += `\n\n### Risques Identifiés:\n`;
      risks.slice(0, 5).forEach((risk: any, index: number) => {
        userPrompt += `\n${index + 1}. ${risk.title} (${risk.level}, prob: ${risk.probability}%, impact: ${risk.impact}%)`;
      });
    }

    // Ajouter les décisions si fournies
    if (decisions && Array.isArray(decisions) && decisions.length > 0) {
      userPrompt += `\n\n### Décisions Stratégiques:\n`;
      decisions.slice(0, 4).forEach((decision: any, index: number) => {
        userPrompt += `\n${index + 1}. ${decision.title} (${decision.urgency})`;
      });
    }

    // 6. Appeler OpenAI OU utiliser mock
    const startTime = Date.now();
    let scenarios: any[];
    let tokensUsed = 0;

    if (USE_MOCK) {
      // MODE MOCK : Simuler délai et utiliser données mockées
      await simulateAPIDelay(6000, 10000);
      scenarios = MOCK_SCENARIOS;
      tokensUsed = calculateMockTokens(userPrompt.length, JSON.stringify(scenarios).length);
    } else {
      // MODE PRODUCTION : Appel réel OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SCENARIOS_GENERATION_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      });

      const response = completion.choices[0].message.content;
      
      if (!response) {
        throw new Error('Empty response from OpenAI');
      }

      const parsedResponse = JSON.parse(response);
      scenarios = parsedResponse.scenarios || [];
      tokensUsed = completion.usage?.total_tokens || 0;
    }

    const latency = Date.now() - startTime;

    if (scenarios.length !== 3) {
      throw new Error('Expected exactly 3 scenarios (optimistic, central, pessimistic)');
    }

    // 8. Insérer les scénarios dans la base
    const scenariosToInsert = scenarios.map((scenario: any) => ({
      organization_id: organizationId,
      project_id: projectId,
      type: scenario.type,
      probability: scenario.probability,
      delivery_date: scenario.delivery_date,
      final_budget: scenario.final_budget,
      business_impacts: scenario.business_impacts,
      actions: scenario.actions,
    }));

    const { data: insertedScenarios, error: insertError } = await supabase
      .from('scenarios')
      .insert(scenariosToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting scenarios:', insertError);
      throw insertError;
    }

    // 9. Logger la génération IA
    await supabase.from('ai_generations').insert({
      organization_id: organizationId,
      project_id: projectId,
      entity_type: 'scenario',
      generation_type: 'predictive_scenarios',
      input_data: { projectName, projectDescription, budget, deadline, risks, decisions },
      output_data: scenarios,
      tokens_used: tokensUsed,
      latency_ms: latency,
      success: true,
    });

    // 10. Retourner les scénarios
    return NextResponse.json({
      success: true,
      scenarios: insertedScenarios,
      meta: {
        count: insertedScenarios?.length || 0,
        tokens: tokensUsed,
        latency_ms: latency,
        mode: USE_MOCK ? 'mock' : 'production',
      },
    });

  } catch (error: any) {
    console.error('Error in AI scenarios generation:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate scenarios',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
