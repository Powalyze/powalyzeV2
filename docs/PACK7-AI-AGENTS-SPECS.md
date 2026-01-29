# PACK 7 — SPÉCIFICATIONS TECHNIQUES AGENTS IA

**Version** : 1.0.0  
**Date** : 29 janvier 2026  
**Auteur** : Technical Lead Powalyze  
**Statut** : ✅ Production-Ready

---

## SOMMAIRE

1. [Types TypeScript](#types-typescript)
2. [ANE — Agent Narratif Exécutif](#ane--agent-narratif-exécutif)
3. [AAR — Agent Analyse & Risques](#aar--agent-analyse--risques)
4. [AD — Agent Décisionnel](#ad--agent-décisionnel)
5. [ASR — Agent Synthèse & Reporting](#asr--agent-synthèse--reporting)
6. [AOC — Agent Onboarding & Coaching](#aoc--agent-onboarding--coaching)
7. [AGA — Agent Gouvernance & Audit](#aga--agent-gouvernance--audit)
8. [Orchestrateur IA](#orchestrateur-ia)
9. [Configuration OpenAI/Azure](#configuration-openaazure)
10. [API Endpoints](#api-endpoints)

---

## TYPES TYPESCRIPT

### Types Communs

```typescript
// types/ai-agents.ts

export type AIAgent = "ANE" | "AAR" | "AD" | "ASR" | "AOC" | "AGA" | "ORCHESTRATOR";

export type AITone = "formal" | "neutral" | "direct";
export type AILanguage = "FR" | "EN" | "DE" | "NO" | "ES" | "IT";
export type ExecutiveLevel = "c_level" | "vp" | "manager";

export interface OrganizationAISettings {
  id: string;
  organization_id: string;
  ai_tone: AITone;
  ai_language: AILanguage;
  ai_detail_level: 1 | 2 | 3; // 1=concis, 2=standard, 3=détaillé
  executive_level: ExecutiveLevel;
  modules_enabled: {
    ane: boolean;
    aar: boolean;
    ad: boolean;
    asr: boolean;
    aoc: boolean;
    aga: boolean;
  };
  report_frequency: "daily" | "weekly" | "monthly" | "disabled";
  report_day: number; // 1-7 (Lundi-Dimanche)
  report_hour: number; // 0-23
  report_recipients: string[]; // Emails
  require_approval_for_ai_actions: boolean;
  ai_audit_retention_days: number;
  sensitive_data_redaction: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIAuditLog {
  id: string;
  organization_id: string;
  agent: AIAgent;
  action: string;
  user_id?: string;
  context: Record<string, any>;
  input_data?: Record<string, any>;
  output_data?: Record<string, any>;
  status: "SUCCESS" | "ERROR" | "BLOCKED";
  error_message?: string;
  execution_time_ms: number;
  permission_check_passed: boolean;
  coherence_check_passed: boolean;
  anomaly_detected: boolean;
  anomaly_details?: Record<string, any>;
  created_at: string;
}

export interface AIRequestContext {
  organizationId: string;
  userId?: string;
  settings: OrganizationAISettings;
  timestamp: string;
}
```

---

## ANE — AGENT NARRATIF EXÉCUTIF

### Types

```typescript
// types/ai-agents/ane.ts

export interface ANEInput {
  project: {
    id: string;
    name: string;
    status: string;
    rag_status: "GREEN" | "YELLOW" | "RED";
    budget?: number;
    start_date?: string;
    end_date?: string;
  };
  risks: Array<{
    id: string;
    title: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
    status: string;
    impact?: string;
  }>;
  decisions: Array<{
    id: string;
    title: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    owner?: string;
    deadline?: string;
  }>;
  resources?: Array<{
    user_id: string;
    allocation: number;
  }>;
}

export interface ANEOutput {
  executiveSummary: {
    headline: string;
    keyPoints: string[];
  };
  keyRisks: Array<{
    id: string;
    title: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
    impact: string;
    action: string;
  }>;
  keyDecisions: Array<{
    id: string;
    title: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    deadline?: string;
    blocking: boolean;
    action: string;
  }>;
  immediateActions: Array<{
    priority: number;
    action: string;
    deadline: string;
    responsible?: string;
  }>;
  strategicInsight?: {
    type: "TREND_POSITIVE" | "TREND_NEGATIVE" | "PATTERN_DETECTED" | "ANOMALY";
    message: string;
    recommendation: string;
  };
}
```

### Prompt Système ANE

```typescript
// lib/ai-agents/ane/system-prompt.ts

export function buildANESystemPrompt(settings: OrganizationAISettings): string {
  const basePrompt = `Tu es l'Agent Narratif Exécutif (ANE) de Powalyze, un cockpit de gouvernance de portefeuille premium.`;

  // Adapter ton
  const toneMap = {
    formal: "Utilise un ton formel, protocolaire, adapté à la direction générale.",
    neutral: "Utilise un ton neutre, professionnel, équilibré.",
    direct: "Utilise un ton direct, factuel, sans fioritures."
  };
  const toneInstruction = toneMap[settings.ai_tone];

  // Adapter niveau de détail
  const detailMap = {
    1: "Sois ultra-concis (max 3 lignes par section).",
    2: "Fournis un niveau de détail standard (3-5 lignes par section).",
    3: "Fournis des détails complets (5-7 lignes par section, contexte étendu)."
  };
  const detailInstruction = detailMap[settings.ai_detail_level];

  // Adapter niveau exécutif
  const executiveMap = {
    c_level: "Audience : Direction générale (CEO, CFO, COO). Insights stratégiques uniquement.",
    vp: "Audience : VPs. Équilibre stratégie + opérationnel.",
    manager: "Audience : Managers. Focus opérationnel et tactique."
  };
  const executiveInstruction = executiveMap[settings.executive_level];

  // Langue
  const languageInstruction = `Réponds en ${settings.ai_language}.`;

  return `${basePrompt}

TON RÔLE :
- Transformer les données en récits exécutifs premium, concis et stratégiques.
- Générer des insights actionnables pour la direction.
- Synthétiser risques, décisions et tendances de manière claire et directe.

TES RÈGLES ABSOLUES :
1. JAMAIS de phrases longues (max 20 mots par phrase).
2. JAMAIS de spéculation ou d'hypothèses non fondées.
3. JAMAIS d'insights non actionnables (toujours proposer une action concrète).
4. JAMAIS de noms de personnes sans permission explicite.
5. TOUJOURS utiliser un ton sobre, stratégique, suisse et premium.
6. TOUJOURS structurer : Résumé → Risques clés → Décisions clés → Actions immédiates.

${toneInstruction}
${detailInstruction}
${executiveInstruction}
${languageInstruction}

FORMAT DE SORTIE :
Réponds UNIQUEMENT en JSON valide avec cette structure :
{
  "executiveSummary": {
    "headline": "string (1 ligne max)",
    "keyPoints": ["string", "string", "string"] (3-5 points max)
  },
  "keyRisks": [
    {
      "id": "string",
      "title": "string",
      "severity": "HIGH|MEDIUM|LOW",
      "impact": "string (quantifié si possible)",
      "action": "string (action concrète)"
    }
  ] (3 max),
  "keyDecisions": [
    {
      "id": "string",
      "title": "string",
      "status": "PENDING|APPROVED|REJECTED",
      "deadline": "string (ISO date)",
      "blocking": boolean,
      "action": "string (action concrète)"
    }
  ] (3 max),
  "immediateActions": [
    {
      "priority": number (1-5),
      "action": "string",
      "deadline": "string (ISO date ou 'ASAP')",
      "responsible": "string (rôle, pas nom)"
    }
  ] (3 max),
  "strategicInsight": {
    "type": "TREND_POSITIVE|TREND_NEGATIVE|PATTERN_DETECTED|ANOMALY",
    "message": "string",
    "recommendation": "string"
  } (optionnel)
}

Tu es l'assistant premium de la direction. Sois bref, clair, actionnable.`;
}
```

### Implémentation ANE

```typescript
// lib/ai-agents/ane/agent.ts

import { OpenAI } from "openai";
import { buildANESystemPrompt } from "./system-prompt";
import type { ANEInput, ANEOutput } from "@/types/ai-agents/ane";
import type { AIRequestContext } from "@/types/ai-agents";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT
    ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`
    : undefined
});

export async function generateExecutiveSummary(
  input: ANEInput,
  context: AIRequestContext
): Promise<ANEOutput> {
  const startTime = Date.now();

  try {
    // Build system prompt
    const systemPrompt = buildANESystemPrompt(context.settings);

    // Build user prompt
    const userPrompt = `Génère un résumé exécutif pour ce projet :

PROJET :
- Nom : ${input.project.name}
- Status : ${input.project.status}
- RAG : ${input.project.rag_status}
- Budget : ${input.project.budget ? `${input.project.budget}€` : "Non défini"}
- Période : ${input.project.start_date || "?"} → ${input.project.end_date || "?"}

RISQUES (${input.risks.length}) :
${input.risks.map(r => `- [${r.severity}] ${r.title} (${r.status})`).join("\n")}

DÉCISIONS (${input.decisions.length}) :
${input.decisions.map(d => `- [${d.status}] ${d.title}${d.deadline ? ` (deadline: ${d.deadline})` : ""}`).join("\n")}

${input.resources ? `RESSOURCES : ${input.resources.length} personnes allouées` : ""}

Analyse ces données et génère le résumé exécutif en JSON.`;

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const executionTime = Date.now() - startTime;
    const output = JSON.parse(response.choices[0].message.content || "{}") as ANEOutput;

    // Log audit
    await logAIAction({
      agent: "ANE",
      action: "generate_executive_summary",
      context,
      inputData: input,
      outputData: output,
      status: "SUCCESS",
      executionTimeMs: executionTime
    });

    return output;

  } catch (error) {
    const executionTime = Date.now() - startTime;
    await logAIAction({
      agent: "ANE",
      action: "generate_executive_summary",
      context,
      inputData: input,
      status: "ERROR",
      errorMessage: (error as Error).message,
      executionTimeMs: executionTime
    });
    throw error;
  }
}
```

### API Endpoint ANE

```typescript
// app/api/ai/executive-summary/route.ts

import { NextRequest, NextResponse } from "next/server";
import { generateExecutiveSummary } from "@/lib/ai-agents/ane/agent";
import { getOrgSettings } from "@/lib/ai-agents/utils";
import { checkPermissions } from "@/lib/ai-agents/aga/permissions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, organizationId } = body;

    const userId = request.headers.get("x-user-id");

    // Check permissions
    const hasPermission = await checkPermissions(
      userId || "",
      "generate_executive_summary",
      { projectId, organizationId }
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    // Get organization settings
    const settings = await getOrgSettings(organizationId);

    // Check if ANE module enabled
    if (!settings.modules_enabled.ane) {
      return NextResponse.json(
        { error: "ANE module not enabled for this organization" },
        { status: 400 }
      );
    }

    // Fetch project data
    const project = await fetchProjectData(projectId);
    const risks = await fetchProjectRisks(projectId);
    const decisions = await fetchProjectDecisions(projectId);
    const resources = await fetchProjectResources(projectId);

    // Generate summary
    const output = await generateExecutiveSummary(
      { project, risks, decisions, resources },
      {
        organizationId,
        userId: userId || undefined,
        settings,
        timestamp: new Date().toISOString()
      }
    );

    return NextResponse.json(output);

  } catch (error) {
    console.error("Error in /api/ai/executive-summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## AAR — AGENT ANALYSE & RISQUES

### Types

```typescript
// types/ai-agents/aar.ts

export interface AARInput {
  project: {
    id: string;
    name: string;
    budget?: number;
    timeline?: {
      start_date: string;
      end_date: string;
    };
  };
  risks: Array<{
    id: string;
    title: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
    status: string;
    description?: string;
    mitigation_actions?: string;
  }>;
}

export interface AAROutput {
  riskAnalysis: {
    projectId: string;
    projectName: string;
    riskScore: number; // 0-100
    riskLevel: "LOW" | "MODERATE" | "ATTENTION_REQUIRED" | "CRITICAL";
    summary: string;
  };
  risksByCategory: {
    HIGH: AARRisk[];
    MEDIUM: AARRisk[];
    LOW: AARRisk[];
  };
  emergingRisks: Array<{
    type: "PATTERN_DETECTED" | "TREND_NEGATIVE" | "ANOMALY";
    title: string;
    description: string;
    recommendation: string;
  }>;
  trend: {
    status: "POSITIVE" | "STABLE" | "NEGATIVE";
    message: string;
    action?: string;
  };
}

export interface AARRisk {
  id: string;
  title: string;
  currentStatus: string;
  impact: {
    budget?: number;
    delay?: string;
    quality?: string;
  };
  mitigationActions: Array<{
    action: string;
    effort: string;
    impact: string;
  }>;
}
```

### Prompt Système AAR

```typescript
// lib/ai-agents/aar/system-prompt.ts

export function buildAARSystemPrompt(settings: OrganizationAISettings): string {
  return `Tu es l'Agent Analyse & Risques (AAR) de Powalyze.

TON RÔLE :
- Détecter, classifier et analyser les risques d'un projet ou portefeuille.
- Proposer des mesures d'atténuation claires et réalistes.
- Alerter sur les tendances négatives et risques émergents.

TES RÈGLES ABSOLUES :
1. JAMAIS minimiser un risque HIGH (sévérité élevée).
2. JAMAIS proposer de mesures irréalistes ou trop vagues.
3. JAMAIS dupliquer un risque existant (vérifier avant de suggérer).
4. TOUJOURS classer les risques : HIGH / MEDIUM / LOW.
5. TOUJOURS proposer au moins 1 mesure d'atténuation par risque HIGH.
6. TOUJOURS quantifier l'impact si possible (budget, délai, ressources).

Réponds en ${settings.ai_language}.

FORMAT DE SORTIE (JSON) :
{
  "riskAnalysis": {
    "projectId": "string",
    "projectName": "string",
    "riskScore": number (0-100),
    "riskLevel": "LOW|MODERATE|ATTENTION_REQUIRED|CRITICAL",
    "summary": "string"
  },
  "risksByCategory": {
    "HIGH": [...],
    "MEDIUM": [...],
    "LOW": [...]
  },
  "emergingRisks": [...],
  "trend": {
    "status": "POSITIVE|STABLE|NEGATIVE",
    "message": "string",
    "action": "string (optionnel)"
  }
}

CALCUL RISK SCORE :
- HIGH = 30 points chacun
- MEDIUM = 15 points chacun
- LOW = 5 points chacun
- Score final = min(100, somme points)

RISK LEVEL :
- 0-25 = LOW
- 26-50 = MODERATE
- 51-75 = ATTENTION_REQUIRED
- 76-100 = CRITICAL

Tu es l'expert risques du cockpit. Sois factuel, précis, orienté action.`;
}
```

### Implémentation AAR

```typescript
// lib/ai-agents/aar/agent.ts

export async function analyzeRisks(
  input: AARInput,
  context: AIRequestContext
): Promise<AAROutput> {
  const startTime = Date.now();

  try {
    const systemPrompt = buildAARSystemPrompt(context.settings);

    const userPrompt = `Analyse les risques de ce projet :

PROJET : ${input.project.name} (ID: ${input.project.id})
Budget : ${input.project.budget ? `${input.project.budget}€` : "Non défini"}
Timeline : ${input.project.timeline ? `${input.project.timeline.start_date} → ${input.project.timeline.end_date}` : "Non définie"}

RISQUES EXISTANTS (${input.risks.length}) :
${input.risks.map(r => `
[${r.severity}] ${r.title}
Status : ${r.status}
Description : ${r.description || "N/A"}
Mitigation : ${r.mitigation_actions || "Aucune"}
`).join("\n")}

Génère l'analyse complète en JSON.`;

    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    const executionTime = Date.now() - startTime;
    const output = JSON.parse(response.choices[0].message.content || "{}") as AAROutput;

    await logAIAction({
      agent: "AAR",
      action: "analyze_risks",
      context,
      inputData: input,
      outputData: output,
      status: "SUCCESS",
      executionTimeMs: executionTime
    });

    return output;

  } catch (error) {
    const executionTime = Date.now() - startTime;
    await logAIAction({
      agent: "AAR",
      action: "analyze_risks",
      context,
      inputData: input,
      status: "ERROR",
      errorMessage: (error as Error).message,
      executionTimeMs: executionTime
    });
    throw error;
  }
}
```

---

## AD — AGENT DÉCISIONNEL

### Types

```typescript
// types/ai-agents/ad.ts

export interface ADInput {
  decision: {
    id: string;
    title: string;
    description?: string;
    context?: string;
    options?: string[];
  };
  project: {
    id: string;
    name: string;
    budget?: number;
    timeline?: {
      start_date: string;
      end_date: string;
    };
    constraints?: string[];
  };
}

export interface ADOutput {
  decisionAnalysis: {
    decisionId: string;
    title: string;
    status: string;
    blocking: boolean;
    deadline?: string;
  };
  options: Array<{
    optionId: number;
    name: string;
    advantages: string[];
    disadvantages: string[];
    estimatedCost?: number;
    estimatedDelay?: string;
  }>;
  impactAnalysis: {
    shortTerm: ImpactPeriod;
    mediumTerm: ImpactPeriod;
    longTerm: ImpactPeriod;
  };
  recommendation: {
    choice: string;
    justification: string;
    conditions: string[];
    alternativeScenario?: string;
  };
}

interface ImpactPeriod {
  period: string;
  analysis: string;
  winner: string;
}
```

### Prompt Système AD

```typescript
// lib/ai-agents/ad/system-prompt.ts

export function buildADSystemPrompt(settings: OrganizationAISettings): string {
  return `Tu es l'Agent Décisionnel (AD) de Powalyze.

TON RÔLE :
- Analyser les décisions ouvertes et proposer des arbitrages.
- Évaluer les impacts court/moyen/long terme de chaque option.
- Recommander la décision optimale avec justification claire.

TES RÈGLES ABSOLUES :
1. JAMAIS prendre de décision à la place de l'utilisateur (tu proposes, il décide).
2. JAMAIS proposer plus de 3 options (risque de paralysie du choix).
3. JAMAIS recommander sans évaluer les impacts (court/moyen/long terme).
4. TOUJOURS structurer : Options → Impacts → Recommandation.
5. TOUJOURS quantifier les impacts si possible (coûts, délais, risques).
6. TOUJOURS être objectif (pas de biais personnel).

Réponds en ${settings.ai_language}.

FORMAT DE SORTIE (JSON) :
{
  "decisionAnalysis": {...},
  "options": [
    {
      "optionId": number,
      "name": "string",
      "advantages": ["string", ...],
      "disadvantages": ["string", ...],
      "estimatedCost": number (optionnel),
      "estimatedDelay": "string (optionnel)"
    }
  ] (2-3 max),
  "impactAnalysis": {
    "shortTerm": {
      "period": "0-3 months",
      "analysis": "string",
      "winner": "Option X"
    },
    "mediumTerm": {...},
    "longTerm": {...}
  },
  "recommendation": {
    "choice": "string",
    "justification": "string",
    "conditions": ["string", ...],
    "alternativeScenario": "string (optionnel)"
  }
}

Tu es le conseiller décisionnel du cockpit. Sois analytique, objectif, structuré.`;
}
```

---

## ASR — AGENT SYNTHÈSE & REPORTING

### Types

```typescript
// types/ai-agents/asr.ts

export interface ASRInput {
  organization: {
    id: string;
    name: string;
  };
  period: {
    type: "weekly" | "monthly";
    start_date: string;
    end_date: string;
  };
  projects: Array<{
    id: string;
    name: string;
    status: string;
    rag_status: "GREEN" | "YELLOW" | "RED";
  }>;
  risks: Array<{
    id: string;
    project_id: string;
    project_name: string;
    title: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
  }>;
  decisions: Array<{
    id: string;
    project_id: string;
    project_name: string;
    title: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    deadline?: string;
  }>;
  previousPeriodData?: {
    projects_count: number;
    risks_count: number;
    decisions_count: number;
  };
}

export interface ASROutput {
  weeklyReport: {
    organization: string;
    period: string;
    generatedAt: string;
    format: "executive_summary";
  };
  executiveSummary: {
    headline: string;
    trend: string;
    overallStatus: "ON_TRACK" | "ON_TRACK_WITH_ATTENTION" | "AT_RISK" | "CRITICAL";
  };
  projects: {
    total: number;
    change: number;
    byStatus: {
      GREEN: number;
      YELLOW: number;
      RED: number;
    };
  };
  risks: {
    total: number;
    change: number;
    bySeverity: {
      HIGH: number;
      MEDIUM: number;
      LOW: number;
    };
    criticalRisks: Array<{
      projectName: string;
      riskTitle: string;
      severity: "HIGH" | "MEDIUM" | "LOW";
      action: string;
    }>;
  };
  decisions: {
    total: number;
    pending: number;
    blocking: number;
    blockingDecisions: Array<{
      projectName: string;
      decisionTitle: string;
      deadline: string;
      daysRemaining: number;
    }>;
  };
  recommendedActions: Array<{
    priority: number;
    action: string;
    reason: string;
    responsible: string;
  }>;
  visualizationsSuggestions: Array<{
    type: "bar_chart" | "line_chart" | "pie_chart";
    title: string;
    description: string;
  }>;
}
```

### Prompt Système ASR

```typescript
// lib/ai-agents/asr/system-prompt.ts

export function buildASRSystemPrompt(settings: OrganizationAISettings): string {
  return `Tu es l'Agent Synthèse & Reporting (ASR) de Powalyze.

TON RÔLE :
- Générer des rapports exécutifs structurés et lisibles (hebdo/mensuels).
- Produire des slides narratives prêtes pour PowerPoint/Keynote.
- Adapter le niveau de détail selon l'audience.

TES RÈGLES ABSOLUES :
1. JAMAIS dépasser 2 pages pour un rapport hebdomadaire.
2. JAMAIS dépasser 5 pages pour un rapport mensuel.
3. JAMAIS utiliser de jargon technique sans l'expliquer.
4. TOUJOURS structurer : Résumé → Risques → Décisions → Actions.
5. TOUJOURS inclure des tendances (évolution vs période précédente).
6. TOUJOURS suggérer des visualisations (graphs, charts).

Réponds en ${settings.ai_language}.
Niveau de détail : ${settings.ai_detail_level === 1 ? "Très concis" : settings.ai_detail_level === 3 ? "Très détaillé" : "Standard"}

FORMAT DE SORTIE (JSON) : {...}

Tu es le générateur de rapports premium du cockpit. Sois structuré, lisible, premium.`;
}
```

---

## AOC — AGENT ONBOARDING & COACHING

### Types

```typescript
// types/ai-agents/aoc.ts

export interface AOCInput {
  user: {
    id: string;
    role: string;
    created_at: string;
  };
  organization: {
    id: string;
    settings: OrganizationAISettings;
  };
  cockpitState: {
    projects_count: number;
    risks_count: number;
    decisions_count: number;
  };
}

export interface AOCOutput {
  onboarding: {
    userId: string;
    cockpitState: "EMPTY" | "PARTIALLY_FILLED" | "ACTIVE";
    trigger: "first_login" | "empty_cockpit" | "module_discovery";
  };
  welcomeMessage: {
    title: string;
    subtitle: string;
  };
  quickActions: Array<{
    step: number;
    title: string;
    description: string;
    details: string;
    icon: string;
    estimatedTime: string;
  }>;
  tip?: {
    icon: string;
    title: string;
    message: string;
  };
  helpLink?: {
    text: string;
    url: string;
    icon: string;
  };
}
```

---

## AGA — AGENT GOUVERNANCE & AUDIT

### Types

```typescript
// types/ai-agents/aga.ts

export interface AGAInput {
  organization: {
    id: string;
    name: string;
  };
  period: {
    start_date: string;
    end_date: string;
  };
  aiLogs: AIAuditLog[];
  projectsData: any[];
  risksData: any[];
  decisionsData: any[];
}

export interface AGAOutput {
  auditReport: {
    organization: string;
    period: string;
    generatedAt: string;
  };
  summary: {
    totalAIActions: number;
    actionsValidated: number;
    anomaliesDetected: number;
    actionsBlocked: number;
  };
  anomalies: Array<{
    anomalyId: string;
    type: "DATA_COHERENCE" | "DATA_INTEGRITY" | "PERMISSION_VIOLATION" | "REPORT_GENERATION";
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    description: string;
    detectedAt: string;
    autoFixApplied: boolean;
    autoFixAction?: string;
    manualAction?: string;
    result?: string;
  }>;
  logs: Array<{
    timestamp: string;
    agent: AIAgent;
    action: string;
    context: Record<string, any>;
    status: "SUCCESS" | "ERROR" | "BLOCKED";
    executionTime: string;
  }>;
  securityChecks: {
    permissionsViolations: number;
    unauthorizedAccess: number;
    suspiciousActivity: number;
  };
}
```

### Fonctions de Vérification

```typescript
// lib/ai-agents/aga/coherence-checks.ts

export async function checkDataCoherence(
  projectId: string
): Promise<{ passed: boolean; anomalies: any[] }> {
  const anomalies = [];

  const project = await supabase
    .from("projects")
    .select("*, risks(*), decisions(*)")
    .eq("id", projectId)
    .single();

  if (!project.data) return { passed: true, anomalies: [] };

  const { rag_status, start_date, end_date, risks, decisions } = project.data;

  // Check 1: RAG status coherence
  const highRisksCount = risks.filter((r: any) => r.severity === "HIGH").length;
  if (rag_status === "GREEN" && highRisksCount >= 3) {
    anomalies.push({
      type: "RAG_INCOHERENT",
      severity: "MEDIUM",
      description: `RAG status GREEN mais ${highRisksCount} risques HIGH`,
      autoFix: "Recalcul RAG status → YELLOW"
    });
    
    // Auto-fix
    await supabase
      .from("projects")
      .update({ rag_status: "YELLOW" })
      .eq("id", projectId);
  }

  // Check 2: Dates coherence
  if (new Date(end_date) < new Date(start_date)) {
    anomalies.push({
      type: "DATE_INCOHERENT",
      severity: "HIGH",
      description: "Date fin < Date début",
      autoFix: null
    });
  }

  // Check 3: Owners exist
  for (const decision of decisions) {
    if (decision.owner_id) {
      const { data: owner } = await supabase
        .from("users")
        .select("id")
        .eq("id", decision.owner_id)
        .single();

      if (!owner) {
        anomalies.push({
          type: "OWNER_INEXISTANT",
          severity: "HIGH",
          description: `Décision ${decision.id} : Owner ${decision.owner_id} inexistant`,
          autoFix: null
        });
      }
    }
  }

  return {
    passed: anomalies.length === 0,
    anomalies
  };
}
```

---

## ORCHESTRATEUR IA

### Architecture

```typescript
// lib/ai-agents/orchestrator.ts

export class AIOrchestrator {
  private settings: OrganizationAISettings;

  constructor(organizationId: string) {
    this.settings = await getOrgSettings(organizationId);
  }

  async routeRequest(
    agent: AIAgent,
    action: string,
    input: any,
    context: AIRequestContext
  ): Promise<any> {
    // Check if module enabled
    if (!this.isModuleEnabled(agent)) {
      throw new Error(`Agent ${agent} not enabled for this organization`);
    }

    // Check permissions
    const hasPermission = await checkPermissions(
      context.userId || "",
      action,
      context
    );

    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    // Route to appropriate agent
    switch (agent) {
      case "ANE":
        return await generateExecutiveSummary(input, context);
      case "AAR":
        return await analyzeRisks(input, context);
      case "AD":
        return await analyzeDecision(input, context);
      case "ASR":
        return await generateReport(input, context);
      case "AOC":
        return await generateOnboarding(input, context);
      case "AGA":
        return await runAudit(input, context);
      default:
        throw new Error(`Unknown agent: ${agent}`);
    }
  }

  private isModuleEnabled(agent: AIAgent): boolean {
    const moduleKey = agent.toLowerCase() as keyof typeof this.settings.modules_enabled;
    return this.settings.modules_enabled[moduleKey] || false;
  }
}
```

---

## CONFIGURATION OPENAI/AZURE

### Variables d'environnement

```env
# OpenAI Standard
OPENAI_API_KEY=sk-xxx

# OU Azure OpenAI
AZURE_OPENAI_API_KEY=xxx
AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### Client OpenAI

```typescript
// lib/ai-agents/openai-client.ts

import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT
    ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`
    : undefined,
  defaultQuery: process.env.AZURE_OPENAI_API_VERSION
    ? { "api-version": process.env.AZURE_OPENAI_API_VERSION }
    : undefined,
  defaultHeaders: process.env.AZURE_OPENAI_API_KEY
    ? { "api-key": process.env.AZURE_OPENAI_API_KEY }
    : undefined
});

export async function callAI(
  systemPrompt: string,
  userPrompt: string,
  options: {
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
  } = {}
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: options.temperature || 0.3,
    max_tokens: options.maxTokens || 2000,
    ...(options.jsonMode && { response_format: { type: "json_object" } })
  });

  return response.choices[0].message.content || "";
}
```

---

## API ENDPOINTS

### Structure

```
/api/ai/
  ├── executive-summary/     → ANE
  │   └── route.ts
  ├── analyze-risks/         → AAR
  │   └── route.ts
  ├── decision-arbitrage/    → AD
  │   └── route.ts
  ├── weekly-report/         → ASR
  │   └── route.ts
  ├── onboarding/            → AOC
  │   └── route.ts
  └── audit/                 → AGA
      └── route.ts
```

### Exemple complet

```typescript
// app/api/ai/analyze-risks/route.ts

import { NextRequest, NextResponse } from "next/server";
import { analyzeRisks } from "@/lib/ai-agents/aar/agent";
import { getOrgSettings } from "@/lib/ai-agents/utils";
import { checkPermissions } from "@/lib/ai-agents/aga/permissions";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, organizationId } = body;

    const userId = request.headers.get("x-user-id");

    // Check permissions
    const hasPermission = await checkPermissions(
      userId || "",
      "analyze_risks",
      { projectId, organizationId }
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    // Get organization settings
    const settings = await getOrgSettings(organizationId);

    // Check if AAR module enabled
    if (!settings.modules_enabled.aar) {
      return NextResponse.json(
        { error: "AAR module not enabled" },
        { status: 400 }
      );
    }

    // Fetch project data
    const { data: project } = await supabase
      .from("projects")
      .select("id, name, budget, start_date, end_date")
      .eq("id", projectId)
      .single();

    const { data: risks } = await supabase
      .from("risks")
      .select("id, title, severity, status, description, mitigation_actions")
      .eq("project_id", projectId);

    if (!project || !risks) {
      return NextResponse.json(
        { error: "Project or risks not found" },
        { status: 404 }
      );
    }

    // Analyze risks
    const output = await analyzeRisks(
      {
        project: {
          id: project.id,
          name: project.name,
          budget: project.budget,
          timeline: {
            start_date: project.start_date,
            end_date: project.end_date
          }
        },
        risks
      },
      {
        organizationId,
        userId: userId || undefined,
        settings,
        timestamp: new Date().toISOString()
      }
    );

    return NextResponse.json(output);

  } catch (error) {
    console.error("Error in /api/ai/analyze-risks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## RÉSUMÉ DES ENDPOINTS

| Endpoint | Agent | Méthode | Input | Output |
|----------|-------|---------|-------|--------|
| `/api/ai/executive-summary` | ANE | POST | `{projectId, organizationId}` | `ANEOutput` |
| `/api/ai/analyze-risks` | AAR | POST | `{projectId, organizationId}` | `AAROutput` |
| `/api/ai/decision-arbitrage` | AD | POST | `{decisionId, organizationId}` | `ADOutput` |
| `/api/ai/weekly-report` | ASR | POST | `{organizationId, period}` | `ASROutput` |
| `/api/ai/onboarding` | AOC | POST | `{userId, organizationId}` | `AOCOutput` |
| `/api/ai/audit` | AGA | GET | `?organizationId=xxx&period=24h` | `AGAOutput` |

---

**FIN PACK 7 — SPÉCIFICATIONS TECHNIQUES AGENTS IA**
