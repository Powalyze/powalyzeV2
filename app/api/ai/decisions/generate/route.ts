// ============================================================
// API ROUTE: AI DECISIONS GENERATION
// POST /api/ai/decisions/generate
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';
import { MOCK_DECISIONS, simulateAPIDelay, calculateMockTokens } from '@/lib/ai-mock-data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const USE_MOCK = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-fake');

const DECISIONS_GENERATION_PROMPT = `Tu es un expert en gouvernance de projet et aide à la décision stratégique.

Ton rôle est d'identifier les décisions clés à prendre pour un projet en analysant:
- Le contexte du projet (nom, description, budget, échéance)
- Les risques identifiés

RÈGLES:
1. Génère entre 2 et 4 décisions stratégiques importantes
2. Chaque décision doit avoir:
   - title (court, 5-10 mots, formulé comme une question ou un choix)
   - description (détaillée, 80-150 mots expliquant le contexte)
   - type: "strategic", "technical", "financial" ou "organizational"
   - urgency: "URGENT", "HIGH", "MEDIUM" ou "LOW"
   - status: toujours "pending" (décision à prendre)
   - committee: "COMEX", "CODIR", "PROJECT_COMMITTEE" ou null
   - options: array de 2-4 options possibles (strings courtes)
   - impacts: array de 2-4 impacts business potentiels (strings)
   - estimated_cost: coût estimé si applicable (number ou null)

3. Privilégie les décisions:
   - Critiques pour le succès du projet
   - Ayant un impact business significatif
   - Nécessitant l'arbitrage d'un comité
   - Urgentes ou bloquantes

4. Les options doivent être concrètes et actionnables
5. Les impacts doivent être mesurables ou observables

RÉPONDS UNIQUEMENT avec un JSON valide (array de décisions):
[
  {
    "title": "...",
    "description": "...",
    "type": "...",
    "urgency": "...",
    "status": "pending",
    "committee": "...",
    "options": ["...", "..."],
    "impacts": ["...", "..."],
    "estimated_cost": ... ou null
  }
]`;

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
    const { projectId, projectName, projectDescription, budget, deadline, risks } = body;

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
      userPrompt += `\n\nBudget: ${budget.toLocaleString('fr-FR')} €`;
    }
    
    if (deadline) {
      userPrompt += `\n\nÉchéance: ${new Date(deadline).toLocaleDateString('fr-FR')}`;
    }

    // Ajouter les risques si fournis
    if (risks && Array.isArray(risks) && risks.length > 0) {
      userPrompt += `\n\n### Risques Identifiés:\n`;
      risks.forEach((risk: any, index: number) => {
        userPrompt += `\n${index + 1}. ${risk.title} (${risk.level})\n   ${risk.description}`;
      });
    }

    // 6. Appeler OpenAI OU utiliser mock
    const startTime = Date.now();
    let decisions: any[];
    let tokensUsed = 0;

    if (USE_MOCK) {
      // MODE MOCK : Simuler délai et utiliser données mockées
      await simulateAPIDelay(5000, 9000);
      decisions = MOCK_DECISIONS;
      tokensUsed = calculateMockTokens(userPrompt.length, JSON.stringify(decisions).length);
    } else {
      // MODE PRODUCTION : Appel réel OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: DECISIONS_GENERATION_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      
      if (!response) {
        throw new Error('Empty response from OpenAI');
      }

      const parsedResponse = JSON.parse(response);
      decisions = Array.isArray(parsedResponse) ? parsedResponse : parsedResponse.decisions || [];
      tokensUsed = completion.usage?.total_tokens || 0;
    }

    const latency = Date.now() - startTime;

    // 8. Insérer les décisions dans la base
    const decisionsToInsert = decisions.map((decision: any) => ({
      organization_id: organizationId,
      project_id: projectId,
      title: decision.title,
      description: decision.description,
      type: decision.type,
      urgency: decision.urgency,
      status: 'pending',
      committee: decision.committee,
      options: decision.options,
      impacts: decision.impacts,
      estimated_cost: decision.estimated_cost,
    }));

    const { data: insertedDecisions, error: insertError } = await supabase
      .from('decisions')
      .insert(decisionsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting decisions:', insertError);
      throw insertError;
    }

    // 9. Logger la génération IA
    await supabase.from('ai_generations').insert({
      organization_id: organizationId,
      project_id: projectId,
      entity_type: 'decision',
      generation_type: 'strategic_decisions',
      input_data: { projectName, projectDescription, budget, deadline, risks },
      output_data: decisions,
      tokens_used: tokensUsed,
      latency_ms: latency,
      success: true,
    });

    // 10. Retourner les décisions
    return NextResponse.json({
      success: true,
      decisions: insertedDecisions,
      meta: {
        count: insertedDecisions?.length || 0,
        tokens: tokensUsed,
        latency_ms: latency,
        mode: USE_MOCK ? 'mock' : 'production',
      },
    });

  } catch (error: any) {
    console.error('Error in AI decisions generation:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate decisions',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
