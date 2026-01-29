// ============================================
// AI GÉNÉRATIVE - AUTO-GÉNÉRATION CONTENU
// ============================================
// Génération narratives, rapports, recommandations
// Utilise OpenAI GPT-4 ou Azure OpenAI

import OpenAI from 'openai';

// Check if API keys are available
const hasApiKey = !!(process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY);

const openai = hasApiKey ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT 
    ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`
    : undefined,
  defaultQuery: process.env.AZURE_OPENAI_ENDPOINT ? { 'api-version': '2024-02-15-preview' } : undefined
}) : null;

// ============================================
// GÉNÉRATION NARRATIVE EXÉCUTIVE
// ============================================

export async function generateExecutiveNarrative(
  projectData: any,
  options?: {
    tone?: 'executive' | 'technical' | 'operational';
    length?: 'short' | 'medium' | 'long';
    focus?: string[];
  }
): Promise<string> {
  // Return mock data if no API key
  if (!hasApiKey || !openai) {
    return "Narrative IA non disponible - Clé API manquante. Configurez OPENAI_API_KEY dans vos variables d'environnement.";
  }

  const tone = options?.tone || 'executive';
  const length = options?.length || 'medium';
  const wordCount = length === 'short' ? 200 : length === 'long' ? 600 : 400;

  const prompt = `Tu es un Chief of Staff expert en gouvernance de projets. Génère une synthèse exécutive ${tone} pour le projet suivant.

DONNÉES PROJET :
- Nom : ${projectData.name}
- Avancement : ${projectData.progress}%
- Budget : ${projectData.budget_used}k€ / ${projectData.budget_total}k€
- Équipe : ${projectData.team_size} personnes
- Statut : ${projectData.rag_status}
- Risques critiques : ${projectData.critical_risks_count || 0}
- Décisions récentes : ${projectData.recent_decisions_count || 0}

INSTRUCTIONS :
- Style ${tone} (${tone === 'executive' ? 'vision stratégique, décisionnaire' : tone === 'technical' ? 'détails techniques, architecture' : 'opérationnel, actions concrètes'})
- ${wordCount} mots maximum
- Structure : Situation → Problèmes → Recommandations
- Utilise emojis pour clarté visuelle
- Sois factuel et actionnable

Génère UNIQUEMENT la narrative, pas de préambule.`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
      messages: [
        { role: 'system', content: 'Tu es un expert en gouvernance de projets IT.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    return completion.choices[0]?.message?.content || 'Erreur génération narrative';
  } catch (error) {
    console.error('AI Generative error:', error);
    // Fallback si pas d'API key
    return generateFallbackNarrative(projectData);
  }
}

// ============================================
// GÉNÉRATION RAPPORT COMEX
// ============================================

export async function generateComexReport(
  portfolioData: any,
  options?: {
    format?: 'brief' | 'detailed';
    sections?: string[];
  }
): Promise<{
  title: string;
  date: string;
  sections: Array<{
    title: string;
    content: string;
    kpis?: Record<string, any>;
  }>;
}> {
  // Return mock data if no API key
  if (!hasApiKey || !openai) {
    return {
      title: "Rapport COMEX (Mode Démo)",
      date: new Date().toISOString(),
      sections: [{
        title: "Configuration requise",
        content: "IA non disponible - Configurez OPENAI_API_KEY pour générer des rapports COMEX.",
        kpis: {}
      }]
    };
  }

  const prompt = `Génère un rapport COMEX professionnel basé sur le portefeuille suivant :

PORTFOLIO :
- Projets actifs : ${portfolioData.active_projects}
- Budget total : ${portfolioData.total_budget}M€
- Projets en retard : ${portfolioData.delayed_projects}
- Risques critiques portfolio : ${portfolioData.critical_risks}

Format : ${options?.format || 'brief'}

Structure attendue :
1. Synthèse Exécutive (3 bullets max)
2. KPIs Clés (chiffres)
3. Top 3 Alertes
4. Top 3 Succès
5. Décisions Requises (si format detailed)

Sois concis, factuel, orienté décision. Format Markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
      messages: [
        { role: 'system', content: 'Tu es un executive assistant spécialisé en reporting COMEX.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 1200
    });

    const content = completion.choices[0]?.message?.content || '';
    
    return parseComexReport(content, portfolioData);
  } catch (error) {
    console.error('AI Generative error:', error);
    return generateFallbackComexReport(portfolioData);
  }
}

// ============================================
// GÉNÉRATION RECOMMANDATIONS SMART
// ============================================

export async function generateSmartRecommendations(
  context: {
    project: any;
    risks: any[];
    prediction?: any;
  }
): Promise<Array<{
  id: string;
  priority: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
}>> {
  // Return mock data if no API key
  if (!hasApiKey || !openai) {
    return generateFallbackRecommendations(context);
  }

  const prompt = `Analyse le projet et génère 5 recommandations prioritaires SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporelles).

CONTEXTE :
- Projet : ${context.project.name}
- Avancement : ${context.project.progress}%
- Risques : ${context.risks.length} identifiés
- Budget variance : ${context.prediction?.predictions?.budget?.variance || 0}%

Génère 5 recommandations au format JSON :
[{
  "priority": "critical|high|medium",
  "title": "Action courte",
  "description": "Détails 1-2 phrases",
  "impact": "Gain attendu quantifié",
  "effort": "low|medium|high",
  "timeline": "1 semaine|2 semaines|1 mois"
}]

UNIQUEMENT le JSON array, pas de texte avant/après.`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
      messages: [
        { role: 'system', content: 'Tu es un consultant PMO expert.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content || '[]';
    const recommendations = JSON.parse(content);
    
    return recommendations.map((rec: any, i: number) => ({
      id: `rec-${Date.now()}-${i}`,
      ...rec
    }));
  } catch (error) {
    console.error('AI Generative error:', error);
    return generateFallbackRecommendations(context);
  }
}

// ============================================
// AUTO-COMPLÉTION INTELLIGENTE
// ============================================

export async function generateAutoComplete(
  field: 'risk_title' | 'risk_description' | 'decision_title' | 'project_description',
  context: string,
  projectContext?: any
): Promise<string[]> {
  // Return mock data if no API key
  if (!hasApiKey || !openai) {
    return ["Configuration IA requise"];
  }

  const prompts: Record<typeof field, string> = {
    risk_title: `Génère 3 titres de risques pertinents pour un projet ${projectContext?.category || 'IT'} en contexte : "${context}". Format: ["Risque 1", "Risque 2", "Risque 3"]`,
    risk_description: `Complète la description du risque : "${context}". 1 phrase courte et factuelle.`,
    decision_title: `Génère 3 titres de décisions type COMEX pour projet ${projectContext?.name || 'IT'} : "${context}". Format: ["Décision 1", "Décision 2", "Décision 3"]`,
    project_description: `Génère une description projet professionnelle (2-3 phrases) pour : "${context}"`
  };

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
      messages: [
        { role: 'system', content: 'Tu es un assistant PMO.' },
        { role: 'user', content: prompts[field] }
      ],
      temperature: 0.8,
      max_tokens: 150
    });

    const content = completion.choices[0]?.message?.content || '';
    
    if (field.includes('title')) {
      try {
        return JSON.parse(content);
      } catch {
        return [content];
      }
    }
    
    return [content];
  } catch (error) {
    console.error('AI Generative error:', error);
    return [];
  }
}

// ============================================
// FALLBACKS (SI PAS D'API KEY)
// ============================================

function generateFallbackNarrative(projectData: any): string {
  return `**Synthèse Exécutive IA — ${new Date().toLocaleDateString('fr-FR')}**

Le projet **${projectData.name}** est actuellement à **${projectData.progress}%** d'avancement avec un statut **${projectData.rag_status}**.

**📊 Situation**
• Budget : ${projectData.budget_used}k€ consommés sur ${projectData.budget_total}k€ (${Math.round((projectData.budget_used / projectData.budget_total) * 100)}%)
• Équipe : ${projectData.team_size} personnes mobilisées
• Risques : ${projectData.critical_risks_count || 0} critiques identifiés

**🔴 Points d'attention**
${projectData.progress < 50 ? '• Avancement inférieur à 50%, vigilance requise\n' : ''}${(projectData.budget_used / projectData.budget_total) > 0.8 ? '• Budget largement consommé, risque dépassement\n' : ''}${projectData.critical_risks_count > 2 ? '• Plusieurs risques critiques à traiter en priorité\n' : ''}

**💡 Recommandations**
1. Maintenir vélocité actuelle et suivre de près les indicateurs clés
2. Activer plans de mitigation sur les risques critiques identifiés
3. Préparer point de synchronisation avec les parties prenantes

*Narrative générée automatiquement par Powalyze AI*`;
}

function parseComexReport(content: string, data: any) {
  return {
    title: 'Rapport COMEX Portfolio',
    date: new Date().toLocaleDateString('fr-FR'),
    sections: [
      {
        title: 'Synthèse Exécutive',
        content: content.split('\n').slice(0, 5).join('\n')
      },
      {
        title: 'KPIs',
        content: content.split('\n').slice(5, 10).join('\n'),
        kpis: {
          projects: data.active_projects,
          budget: data.total_budget,
          risks: data.critical_risks
        }
      }
    ]
  };
}

function generateFallbackComexReport(data: any) {
  return {
    title: 'Rapport COMEX Portfolio',
    date: new Date().toLocaleDateString('fr-FR'),
    sections: [
      {
        title: 'Synthèse',
        content: `${data.active_projects} projets actifs, budget ${data.total_budget}M€`
      }
    ]
  };
}

function generateFallbackRecommendations(context: any) {
  return [
    {
      id: 'rec-1',
      priority: 'high' as const,
      title: 'Optimiser allocation ressources',
      description: 'Rééquilibrer équipe sur jalons critiques',
      impact: 'Gain vélocité +15%',
      effort: 'medium' as const,
      timeline: '2 semaines'
    }
  ];
}
