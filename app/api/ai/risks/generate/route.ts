// ============================================================
// API ROUTE: AI RISKS GENERATION
// POST /api/ai/risks/generate
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RISKS_GENERATION_PROMPT = `Tu es un expert en gestion de projet et analyse des risques.

Ton rôle est d'identifier les risques potentiels d'un projet en analysant:
- Le nom du projet
- Sa description
- Son budget (si fourni)
- Son échéance (si fournie)

RÈGLES:
1. Génère entre 3 et 5 risques pertinents et réalistes
2. Chaque risque doit avoir:
   - title (court, 5-10 mots)
   - description (détaillée, 50-100 mots)
   - level: "critical", "high", "medium" ou "low"
   - probability: 1-100 (probabilité d'occurrence en %)
   - impact: 1-100 (impact si le risque se matérialise en %)
   - mitigation_plan: stratégie pour réduire ou éviter le risque (50-150 mots)
   - category: "TECHNICAL", "ORGANIZATIONAL", "FINANCIAL", "SCHEDULE", "QUALITY"

3. Privilégie les risques concrets et actionnables
4. Le mitigation_plan doit contenir des actions spécifiques
5. Varie les niveaux de risque (au moins 1 critical/high)

RÉPONDS UNIQUEMENT avec un JSON valide (array de risques):
[
  {
    "title": "...",
    "description": "...",
    "level": "...",
    "probability": ...,
    "impact": ...,
    "mitigation_plan": "...",
    "category": "..."
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
    const { projectId, projectName, projectDescription, budget, deadline } = body;

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

    // 6. Appeler OpenAI
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: RISKS_GENERATION_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const latency = Date.now() - startTime;
    const response = completion.choices[0].message.content;
    
    if (!response) {
      throw new Error('Empty response from OpenAI');
    }

    // 7. Parser la réponse
    const parsedResponse = JSON.parse(response);
    const risks = Array.isArray(parsedResponse) ? parsedResponse : parsedResponse.risks || [];

    // 8. Insérer les risques dans la base
    const risksToInsert = risks.map((risk: any) => ({
      organization_id: organizationId,
      project_id: projectId,
      title: risk.title,
      description: risk.description,
      level: risk.level,
      probability: risk.probability,
      impact: risk.impact,
      mitigation_plan: risk.mitigation_plan,
      category: risk.category,
      status: 'open',
    }));

    const { data: insertedRisks, error: insertError } = await supabase
      .from('risks')
      .insert(risksToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting risks:', insertError);
      throw insertError;
    }

    // 9. Logger la génération IA
    await supabase.from('ai_generations').insert({
      organization_id: organizationId,
      project_id: projectId,
      entity_type: 'risk',
      generation_type: 'risks_identification',
      input_data: { projectName, projectDescription, budget, deadline },
      output_data: risks,
      tokens_used: completion.usage?.total_tokens || 0,
      latency_ms: latency,
      success: true,
    });

    // 10. Retourner les risques
    return NextResponse.json({
      success: true,
      risks: insertedRisks,
      meta: {
        count: insertedRisks?.length || 0,
        tokens: completion.usage?.total_tokens || 0,
        latency_ms: latency,
      },
    });

  } catch (error: any) {
    console.error('Error in AI risks generation:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate risks',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
