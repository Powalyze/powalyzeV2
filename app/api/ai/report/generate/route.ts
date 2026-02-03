// ============================================================
// API ROUTE: AI REPORT GENERATION
// POST /api/ai/report/generate
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';
import { MOCK_REPORT, simulateAPIDelay, calculateMockTokens } from '@/lib/ai-mock-data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const USE_MOCK = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-fake');

const REPORT_GENERATION_PROMPT = `Tu es un expert en rédaction de rapports exécutifs et synthèses de projet.

Ton rôle est de créer un rapport exécutif complet pour un projet en analysant:
- Les informations projet (nom, description, budget, échéance)
- Les risques identifiés
- Les décisions stratégiques
- Les scénarios prévisionnels
- Les objectifs SMART

RÈGLES:
1. Le rapport doit contenir:
   - summary (synthèse exécutive de 300-500 mots):
     * Contexte et enjeux du projet
     * Principaux risques et décisions critiques
     * Analyse des scénarios (optimiste/central/pessimiste)
     * Vue d'ensemble des objectifs
     * Recommandation globale
   
   - recommendations (array de 4-6 recommandations stratégiques):
     * Actions prioritaires à entreprendre
     * Arbitrages à faire
     * Investissements nécessaires
     * Points de vigilance
     * Quick wins possibles

2. Ton style doit être:
   - Exécutif: Direct, concis, orienté décision
   - Factuel: Basé sur les données fournies
   - Synthétique: Aller à l'essentiel
   - Actionable: Donner des recommandations concrètes

3. Structure de la synthèse:
   - Paragraphe 1: Contexte et enjeux
   - Paragraphe 2: Risques majeurs et leur mitigation
   - Paragraphe 3: Décisions critiques et impacts
   - Paragraphe 4: Analyse des scénarios
   - Paragraphe 5: Objectifs et mesure de succès
   - Paragraphe 6: Recommandation finale

4. Recommandations:
   - Classées par priorité
   - Chacune 30-60 mots
   - Incluant l'impact attendu
   - Actionnables immédiatement

RÉPONDS UNIQUEMENT avec un JSON valide:
{
  "summary": "...",
  "recommendations": [
    "Recommandation 1...",
    "Recommandation 2...",
    "Recommandation 3...",
    "Recommandation 4...",
    "Recommandation 5...",
    "Recommandation 6..."
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
    const { 
      projectId, 
      projectName, 
      projectDescription, 
      budget, 
      deadline,
      risks,
      decisions,
      scenarios,
      objectives
    } = body;

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

    // 5. Construire le prompt utilisateur avec toutes les données
    let userPrompt = `# PROJET: ${projectName}\n\n## DESCRIPTION\n${projectDescription}`;
    
    if (budget) {
      userPrompt += `\n\n## BUDGET\n${budget.toLocaleString('fr-FR')} €`;
    }
    
    if (deadline) {
      userPrompt += `\n\n## ÉCHÉANCE\n${new Date(deadline).toLocaleDateString('fr-FR')}`;
    }

    // Risques
    if (risks && Array.isArray(risks) && risks.length > 0) {
      userPrompt += `\n\n## RISQUES IDENTIFIÉS (${risks.length})`;
      risks.forEach((risk: any, index: number) => {
        userPrompt += `\n\n### ${index + 1}. ${risk.title} (${risk.level})`;
        userPrompt += `\n- Probabilité: ${risk.probability}% | Impact: ${risk.impact}%`;
        userPrompt += `\n- ${risk.description}`;
        if (risk.mitigation_plan) {
          userPrompt += `\n- **Mitigation**: ${risk.mitigation_plan}`;
        }
      });
    }

    // Décisions
    if (decisions && Array.isArray(decisions) && decisions.length > 0) {
      userPrompt += `\n\n## DÉCISIONS STRATÉGIQUES (${decisions.length})`;
      decisions.forEach((decision: any, index: number) => {
        userPrompt += `\n\n### ${index + 1}. ${decision.title} (${decision.urgency})`;
        userPrompt += `\n- ${decision.description}`;
        if (decision.impacts && decision.impacts.length > 0) {
          userPrompt += `\n- **Impacts**: ${decision.impacts.join(', ')}`;
        }
      });
    }

    // Scénarios
    if (scenarios && Array.isArray(scenarios) && scenarios.length > 0) {
      userPrompt += `\n\n## SCÉNARIOS PRÉVISIONNELS (${scenarios.length})`;
      scenarios.forEach((scenario: any) => {
        userPrompt += `\n\n### ${scenario.type.toUpperCase()} (${scenario.probability}%)`;
        userPrompt += `\n- Livraison: ${new Date(scenario.delivery_date).toLocaleDateString('fr-FR')}`;
        userPrompt += `\n- Budget Final: ${scenario.final_budget.toLocaleString('fr-FR')} €`;
        if (scenario.business_impacts && scenario.business_impacts.length > 0) {
          userPrompt += `\n- **Impacts**: ${scenario.business_impacts.slice(0, 2).join(', ')}`;
        }
      });
    }

    // Objectifs
    if (objectives && Array.isArray(objectives) && objectives.length > 0) {
      userPrompt += `\n\n## OBJECTIFS SMART (${objectives.length})`;
      objectives.forEach((objective: any, index: number) => {
        userPrompt += `\n\n### ${index + 1}. ${objective.title} (${objective.priority})`;
        userPrompt += `\n- KPI: ${objective.measurable}`;
        userPrompt += `\n- Échéance: ${new Date(objective.deadline).toLocaleDateString('fr-FR')}`;
      });
    }

    // 6. Appeler OpenAI OU utiliser mock
    const startTime = Date.now();
    let summary: string;
    let recommendations: any[];
    let tokensUsed = 0;

    if (USE_MOCK) {
      // MODE MOCK : Simuler délai et utiliser données mockées
      await simulateAPIDelay(8000, 12000); // Plus long pour le rapport
      summary = MOCK_REPORT.summary;
      recommendations = MOCK_REPORT.recommendations;
      tokensUsed = calculateMockTokens(userPrompt.length, summary.length + JSON.stringify(recommendations).length);
    } else {
      // MODE PRODUCTION : Appel réel OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: REPORT_GENERATION_PROMPT },
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
      summary = parsedResponse.summary;
      recommendations = parsedResponse.recommendations;
      tokensUsed = completion.usage?.total_tokens || 0;
    }

    const latency = Date.now() - startTime;

    // 8. Créer un rapport dans la table reports
    const { data: insertedReport, error: insertError } = await supabase
      .from('reports')
      .insert({
        organization_id: organizationId,
        project_id: projectId,
        title: `Rapport Exécutif - ${projectName}`,
        type: 'executive',
        status: 'ready',
        content: {
          summary,
          recommendations,
          generated_at: new Date().toISOString(),
          project_data: {
            name: projectName,
            description: projectDescription,
            budget,
            deadline,
          },
          stats: {
            risks_count: risks?.length || 0,
            decisions_count: decisions?.length || 0,
            scenarios_count: scenarios?.length || 0,
            objectives_count: objectives?.length || 0,
          }
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting report:', insertError);
      throw insertError;
    }

    // 9. Logger la génération IA
    await supabase.from('ai_generations').insert({
      organization_id: organizationId,
      project_id: projectId,
      entity_type: 'report',
      generation_type: 'executive_report',
      input_data: { 
        projectName, 
        projectDescription, 
        budget, 
        deadline,
        risks_count: risks?.length || 0,
        decisions_count: decisions?.length || 0,
        scenarios_count: scenarios?.length || 0,
        objectives_count: objectives?.length || 0,
      },
      output_data: { summary, recommendations },
      tokens_used: tokensUsed,
      latency_ms: latency,
      success: true,
    });

    // 10. Retourner le rapport
    return NextResponse.json({
      success: true,
      report: insertedReport,
      summary,
      recommendations,
      meta: {
        tokens: tokensUsed,
        latency_ms: latency,
        mode: USE_MOCK ? 'mock' : 'production',
      },
    });

  } catch (error: any) {
    console.error('Error in AI report generation:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate report',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
