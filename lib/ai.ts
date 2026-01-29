// ============================================================================
// POWALYZE — IA NARRATIVE EXÉCUTIVE (Azure OpenAI)
// ============================================================================
// Ce module contient les helpers pour l'IA narrative Powalyze :
// 1) Client OpenAI configuré
// 2) Prompts système et user pour chaque cas d'usage
// 3) Fonctions helper typées
// ============================================================================

import OpenAI from 'openai';
import type { Project, Risk, Decision, Action } from '@/types/cockpit';

// ============================================================================
// 1) CLIENT OPENAI
// ============================================================================

// Support OpenAI et Azure OpenAI
const isAzure = !!process.env.AZURE_OPENAI_ENDPOINT;

export const ai = isAzure
  ? new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY || '',
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4'}`,
      defaultQuery: { 'api-version': '2024-02-15-preview' },
    })
  : new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

// Modèle par défaut
const DEFAULT_MODEL = isAzure
  ? process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4'
  : 'gpt-4o-mini';

// ============================================================================
// 2) PROMPTS SYSTÈME POWALYZE
// ============================================================================

const SYSTEM_PROMPT_BASE = `Tu es l'IA narrative de Powalyze, un cockpit exécutif suisse de gouvernance.
Tu t'adresses à des dirigeants, des PMO, des directeurs de programmes et des conseils.

Ton style est :
- suisse, précis, minimaliste
- orienté décision, pas bavard
- structuré, hiérarchisé, lisible
- sans jargon inutile

Tu reçois des données structurées : projets, risques, décisions, actions, comités, logs.
Tu dois produire des synthèses exécutives, des scénarios, des arbitrages et des recommandations actionnables.`;

const SYSTEM_PROMPT_EXECUTIVE_SUMMARY = `${SYSTEM_PROMPT_BASE}

Tu produis des synthèses exécutives claires, structurées, orientées décision.
Tes synthèses permettent aux dirigeants de comprendre rapidement la situation et d'agir.`;

const SYSTEM_PROMPT_COMMITTEE_BRIEF = `${SYSTEM_PROMPT_BASE}

Tu es spécialisé en préparation de comités exécutifs.
Tu produis des notes de préparation structurées, claires, lisibles en 2 minutes.`;

const SYSTEM_PROMPT_PRIORITY_ACTIONS = `${SYSTEM_PROMPT_BASE}

Tu es spécialisé dans la priorisation des actions exécutives.
Tu produis des vues synthétiques orientées pilotage et prise de décision.`;

// ============================================================================
// 3) TYPES D'ENTRÉE/SORTIE
// ============================================================================

export type ExecSummaryInput = {
  organizationContext: string;
  projects: Project[];
  risks: Risk[];
  decisions: Decision[];
  actions: Action[];
};

export type CommitteeBriefInput = {
  organizationContext: string;
  committeeName: string;
  committeeDate: string;
  projects: Project[];
  decisions: Decision[];
  risks: Risk[];
  actions: Action[];
};

export type PriorityActionsInput = {
  organizationContext: string;
  actions: Action[];
};

// ============================================================================
// 4) HELPER : SYNTHÈSE EXÉCUTIVE
// ============================================================================

export async function generateExecutiveSummary(
  input: ExecSummaryInput
): Promise<string> {
  const { organizationContext, projects, risks, decisions, actions } = input;

  const userPrompt = `
Contexte organisation :
${organizationContext}

Projets (${projects.length}) :
${JSON.stringify(projects, null, 2)}

Risques (${risks.length}) :
${JSON.stringify(risks, null, 2)}

Décisions (${decisions.length}) :
${JSON.stringify(decisions, null, 2)}

Actions (${actions.length}) :
${JSON.stringify(actions, null, 2)}

Génère une synthèse exécutive structurée avec la structure suivante :

1. Résumé exécutif (3 à 5 phrases maximum)
2. Points d'attention critiques (liste à puces)
3. Risques majeurs (liste à puces)
4. Arbitrages nécessaires (liste à puces)
5. Recommandations actionnables (liste à puces)
6. Préparation du prochain comité (liste à puces)

Contraintes :
- Style suisse, précis, sobre.
- Pas de phrases longues.
- Pas de storytelling inutile.
- Tu parles comme un copilote exécutif, pas comme un marketeur.
`;

  const completion = await ai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT_EXECUTIVE_SUMMARY,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content ?? '';
}

// ============================================================================
// 5) HELPER : PRÉPARATION DE COMITÉ
// ============================================================================

export async function generateCommitteeBrief(
  input: CommitteeBriefInput
): Promise<string> {
  const {
    organizationContext,
    committeeName,
    committeeDate,
    projects,
    decisions,
    risks,
    actions,
  } = input;

  const userPrompt = `
Contexte organisation :
${organizationContext}

Comité ciblé :
${committeeName} · Prochaine séance : ${committeeDate}

Projets concernés (${projects.length}) :
${JSON.stringify(projects, null, 2)}

Décisions à l'ordre du jour (${decisions.length}) :
${JSON.stringify(decisions, null, 2)}

Risques critiques (${risks.length}) :
${JSON.stringify(risks, null, 2)}

Actions en retard (${actions.length}) :
${JSON.stringify(actions, null, 2)}

Génère une note de préparation de comité structurée :

1. Objet du comité
2. Dossiers à traiter en priorité
3. Décisions attendues
4. Risques à adresser
5. Points de tension / arbitrages
6. Recommandations pour le sponsor du comité

Style :
- exécutif, direct
- phrases courtes
- lisible en 2 minutes
`;

  const completion = await ai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT_COMMITTEE_BRIEF,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content ?? '';
}

// ============================================================================
// 6) HELPER : ACTIONS PRIORITAIRES
// ============================================================================

export async function generatePriorityActionsView(
  input: PriorityActionsInput
): Promise<string> {
  const { organizationContext, actions } = input;

  const userPrompt = `
Contexte organisation :
${organizationContext}

Actions (${actions.length}) :
${JSON.stringify(actions, null, 2)}

Génère une vue exécutive des actions prioritaires :

1. Synthèse globale (1 paragraphe)
2. Actions critiques (priorité = CRITICAL ou HIGH, statut = TODO ou IN_PROGRESS)
3. Actions en retard (due_date < aujourd'hui)
4. Actions à clôturer rapidement (statut = IN_PROGRESS, due_date proche)
5. Recommandations de pilotage

Style :
- très synthétique
- orienté pilotage
`;

  const completion = await ai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT_PRIORITY_ACTIONS,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  return completion.choices[0].message.content ?? '';
}

// ============================================================================
// 7) HELPER : VÉRIFICATION DE LA CONFIGURATION
// ============================================================================

export function isAIConfigured(): boolean {
  if (isAzure) {
    return !!(
      process.env.AZURE_OPENAI_ENDPOINT &&
      process.env.AZURE_OPENAI_API_KEY &&
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME
    );
  }
  return !!process.env.OPENAI_API_KEY;
}

export function getAIConfigStatus(): string {
  if (!isAIConfigured()) {
    return isAzure
      ? 'Azure OpenAI non configuré (variables manquantes)'
      : 'OpenAI non configuré (clé API manquante)';
  }

  return isAzure
    ? `Azure OpenAI configuré (${process.env.AZURE_OPENAI_DEPLOYMENT_NAME})`
    : 'OpenAI configuré (gpt-4o-mini)';
}
