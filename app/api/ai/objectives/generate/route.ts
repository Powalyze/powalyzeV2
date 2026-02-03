// ============================================================
// API ROUTE: AI OBJECTIVES GENERATION
// POST /api/ai/objectives/generate
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OBJECTIVES_GENERATION_PROMPT = `Tu es un expert en définition d'objectifs SMART et gestion par objectifs (MBO).

Ton rôle est de créer des objectifs SMART pour un projet:
- Specific (Spécifique)
- Measurable (Mesurable)
- Achievable (Atteignable)
- Relevant (Pertinent)
- Time-bound (Temporel)

RÈGLES:
1. Génère entre 3 et 5 objectifs SMART
2. Chaque objectif doit avoir:
   - title (court, 5-10 mots, formulé comme un objectif clair)
   - description (détaillée, 80-150 mots expliquant l'objectif et son importance)
   - measurable (KPI mesurable et quantifié, ex: "Réduire les coûts de 15%", "Atteindre 95% de satisfaction")
   - deadline (date limite au format ISO 8601)
   - status: toujours "not_started"
   - priority: "HIGH", "MEDIUM" ou "LOW"
   - category: "BUSINESS", "TECHNICAL", "QUALITY", "PERFORMANCE" ou "SATISFACTION"

3. Les objectifs doivent:
   - Être alignés avec le projet
   - Couvrir différents aspects (business, technique, qualité)
   - Avoir des KPIs mesurables et réalistes
   - Avoir des deadlines échelonnées dans le temps
   - Être ambitieux mais atteignables

4. Privilégie:
   - Des KPIs quantifiables (pourcentages, montants, délais)
   - Des deadlines réalistes par rapport au projet
   - Une variété de catégories
   - Des objectifs ayant un impact business

RÉPONDS UNIQUEMENT avec un JSON valide:
{
  "objectives": [
    {
      "title": "...",
      "description": "...",
      "measurable": "...",
      "deadline": "2025-12-31T23:59:59Z",
      "status": "not_started",
      "priority": "HIGH",
      "category": "BUSINESS"
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
      const projectDeadline = new Date(deadline);
      userPrompt += `\n\nÉchéance Projet: ${projectDeadline.toLocaleDateString('fr-FR')}`;
      
      // Ajouter contexte temporel pour les objectifs
      const today = new Date();
      const daysRemaining = Math.ceil((projectDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      userPrompt += `\n\nContexte: Le projet doit être livré dans ${daysRemaining} jours. Les objectifs doivent avoir des deadlines échelonnées entre aujourd'hui et la fin du projet.`;
    }

    // 6. Appeler OpenAI
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: OBJECTIVES_GENERATION_PROMPT },
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
    const objectives = parsedResponse.objectives || [];

    // 8. Insérer les objectifs dans la base
    const objectivesToInsert = objectives.map((objective: any) => ({
      organization_id: organizationId,
      project_id: projectId,
      title: objective.title,
      description: objective.description,
      measurable: objective.measurable,
      deadline: objective.deadline,
      status: 'not_started',
      priority: objective.priority,
      category: objective.category,
    }));

    const { data: insertedObjectives, error: insertError } = await supabase
      .from('project_objectives')
      .insert(objectivesToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting objectives:', insertError);
      throw insertError;
    }

    // 9. Logger la génération IA
    await supabase.from('ai_generations').insert({
      organization_id: organizationId,
      project_id: projectId,
      entity_type: 'objective',
      generation_type: 'smart_objectives',
      input_data: { projectName, projectDescription, budget, deadline },
      output_data: objectives,
      tokens_used: completion.usage?.total_tokens || 0,
      latency_ms: latency,
      success: true,
    });

    // 10. Retourner les objectifs
    return NextResponse.json({
      success: true,
      objectives: insertedObjectives,
      meta: {
        count: insertedObjectives?.length || 0,
        tokens: completion.usage?.total_tokens || 0,
        latency_ms: latency,
      },
    });

  } catch (error: any) {
    console.error('Error in AI objectives generation:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate objectives',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
