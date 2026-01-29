# PACK 7 — GUIDE D'IMPLÉMENTATION IA

**Version** : 1.0.0  
**Date** : 29 janvier 2026  
**Auteur** : Technical Lead Powalyze  
**Statut** : ✅ Prêt pour implémentation

---

## OBJECTIF

Guide étape par étape pour implémenter l'architecture IA narrative multi-agents de Powalyze.

**Estimation** : 7-10 jours développement + 2-3 jours tests/validation.

---

## AVANT DE COMMENCER

### Prérequis

- [ ] PACK 4 (Design System) complété
- [ ] PACK 5 (Release Pipeline) complété
- [ ] PACK 6 (Mobile UX) complété (pour intégration mobile)
- [ ] Mode LIVE fonctionnel (Supabase opérationnel)
- [ ] OpenAI API Key OU Azure OpenAI configuré
- [ ] TypeScript configuré (strict mode)
- [ ] Tables existantes : `projects`, `risks`, `decisions`, `users`

### Dépendances

```bash
npm install openai zod
```

**Versions** :
- `openai`: ^4.20.0 (compatible OpenAI + Azure OpenAI)
- `zod`: ^3.22.0 (validation schemas)

### Variables d'environnement

Ajouter dans `.env.local` :

```env
# OpenAI (choisir l'une des deux options)

# Option 1 : OpenAI Standard
OPENAI_API_KEY=sk-proj-xxx

# Option 2 : Azure OpenAI
AZURE_OPENAI_API_KEY=xxx
AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

---

## STRUCTURE FICHIERS

```
lib/
├── ai-agents/
│   ├── openai-client.ts        # Client OpenAI configuré
│   ├── types.ts                # Types communs
│   ├── utils.ts                # Fonctions utilitaires
│   ├── orchestrator.ts         # Orchestrateur IA
│   ├── ane/                    # Agent Narratif Exécutif
│   │   ├── agent.ts
│   │   ├── system-prompt.ts
│   │   └── types.ts
│   ├── aar/                    # Agent Analyse & Risques
│   │   ├── agent.ts
│   │   ├── system-prompt.ts
│   │   └── types.ts
│   ├── ad/                     # Agent Décisionnel
│   │   ├── agent.ts
│   │   ├── system-prompt.ts
│   │   └── types.ts
│   ├── asr/                    # Agent Synthèse & Reporting
│   │   ├── agent.ts
│   │   ├── system-prompt.ts
│   │   └── types.ts
│   ├── aoc/                    # Agent Onboarding & Coaching
│   │   ├── agent.ts
│   │   ├── system-prompt.ts
│   │   └── types.ts
│   └── aga/                    # Agent Gouvernance & Audit
│       ├── agent.ts
│       ├── system-prompt.ts
│       ├── coherence-checks.ts
│       ├── permissions.ts
│       └── types.ts

app/api/ai/
├── executive-summary/
│   └── route.ts
├── analyze-risks/
│   └── route.ts
├── decision-arbitrage/
│   └── route.ts
├── weekly-report/
│   └── route.ts
├── onboarding/
│   └── route.ts
└── audit/
    └── route.ts

components/cockpit/
├── AIInsightsPanel.tsx         # Desktop
└── mobile/
    └── AIInsightCardMobile.tsx # Mobile

database/
├── create-ai-tables.sql        # Tables IA
└── seed-ai-settings.sql        # Settings par défaut
```

---

## PLAN D'IMPLÉMENTATION (8 PHASES)

### PHASE 1 : Setup & Infrastructure (1 jour)

**Objectif** : Créer l'infrastructure de base pour les agents IA.

#### 1.1 — Créer tables database

```sql
-- database/create-ai-tables.sql

-- Table organization_settings
CREATE TABLE IF NOT EXISTS public.organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Personnalisation IA
  ai_tone TEXT DEFAULT 'neutral' CHECK (ai_tone IN ('formal', 'neutral', 'direct')),
  ai_language TEXT DEFAULT 'FR' CHECK (ai_language IN ('FR', 'EN', 'DE', 'NO', 'ES', 'IT')),
  ai_detail_level INTEGER DEFAULT 2 CHECK (ai_detail_level BETWEEN 1 AND 3),
  executive_level TEXT DEFAULT 'manager' CHECK (executive_level IN ('c_level', 'vp', 'manager')),
  
  -- Modules activés
  modules_enabled JSONB DEFAULT '{"ane": true, "aar": true, "ad": true, "asr": true, "aoc": true, "aga": true}'::jsonb,
  
  -- Rapports automatiques
  report_frequency TEXT DEFAULT 'weekly' CHECK (report_frequency IN ('daily', 'weekly', 'monthly', 'disabled')),
  report_day INTEGER DEFAULT 1 CHECK (report_day BETWEEN 1 AND 7),
  report_hour INTEGER DEFAULT 8 CHECK (report_hour BETWEEN 0 AND 23),
  report_recipients JSONB DEFAULT '[]'::jsonb,
  
  -- Sécurité & gouvernance
  require_approval_for_ai_actions BOOLEAN DEFAULT false,
  ai_audit_retention_days INTEGER DEFAULT 90,
  sensitive_data_redaction BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table ai_audit_logs
CREATE TABLE IF NOT EXISTS public.ai_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Métadonnées action
  agent TEXT NOT NULL CHECK (agent IN ('ANE', 'AAR', 'AD', 'ASR', 'AOC', 'AGA', 'ORCHESTRATOR')),
  action TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Contexte
  context JSONB NOT NULL,
  input_data JSONB,
  output_data JSONB,
  
  -- Résultat
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'ERROR', 'BLOCKED')),
  error_message TEXT,
  execution_time_ms INTEGER,
  
  -- Gouvernance
  permission_check_passed BOOLEAN DEFAULT true,
  coherence_check_passed BOOLEAN DEFAULT true,
  anomaly_detected BOOLEAN DEFAULT false,
  anomaly_details JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_org_settings_org ON public.organization_settings(organization_id);
CREATE INDEX idx_ai_audit_org ON public.ai_audit_logs(organization_id);
CREATE INDEX idx_ai_audit_agent ON public.ai_audit_logs(agent);
CREATE INDEX idx_ai_audit_status ON public.ai_audit_logs(status);
CREATE INDEX idx_ai_audit_created ON public.ai_audit_logs(created_at DESC);

-- RLS
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies (admin uniquement pour settings)
CREATE POLICY "Allow organization admins to view settings"
  ON public.organization_settings
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles 
    WHERE organization_id = organization_settings.organization_id 
    AND role_global IN ('super_admin', 'admin')
  ));

CREATE POLICY "Allow organization admins to update settings"
  ON public.organization_settings
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles 
    WHERE organization_id = organization_settings.organization_id 
    AND role_global IN ('super_admin', 'admin')
  ));

-- Policies (audit logs : admin + AGA uniquement)
CREATE POLICY "Allow organization admins to view audit logs"
  ON public.ai_audit_logs
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles 
    WHERE organization_id = ai_audit_logs.organization_id 
    AND role_global IN ('super_admin', 'admin')
  ));
```

**Exécuter dans Supabase SQL Editor**.

#### 1.2 — Créer client OpenAI

```typescript
// lib/ai-agents/openai-client.ts

import { OpenAI } from "openai";

// Configuration client
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

// Fonction helper
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
    temperature: options.temperature ?? 0.3,
    max_tokens: options.maxTokens ?? 2000,
    ...(options.jsonMode && { response_format: { type: "json_object" } })
  });

  return response.choices[0].message.content || "";
}
```

#### 1.3 — Créer types communs

```typescript
// lib/ai-agents/types.ts

export type AIAgent = "ANE" | "AAR" | "AD" | "ASR" | "AOC" | "AGA" | "ORCHESTRATOR";

export interface OrganizationAISettings {
  id: string;
  organization_id: string;
  ai_tone: "formal" | "neutral" | "direct";
  ai_language: "FR" | "EN" | "DE" | "NO" | "ES" | "IT";
  ai_detail_level: 1 | 2 | 3;
  executive_level: "c_level" | "vp" | "manager";
  modules_enabled: {
    ane: boolean;
    aar: boolean;
    ad: boolean;
    asr: boolean;
    aoc: boolean;
    aga: boolean;
  };
  report_frequency: "daily" | "weekly" | "monthly" | "disabled";
  report_day: number;
  report_hour: number;
  report_recipients: string[];
  require_approval_for_ai_actions: boolean;
  ai_audit_retention_days: number;
  sensitive_data_redaction: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIRequestContext {
  organizationId: string;
  userId?: string;
  settings: OrganizationAISettings;
  timestamp: string;
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
```

#### 1.4 — Créer fonctions utilitaires

```typescript
// lib/ai-agents/utils.ts

import { supabase } from "@/lib/supabase";
import type { OrganizationAISettings, AIAuditLog, AIRequestContext, AIAgent } from "./types";

export async function getOrgSettings(organizationId: string): Promise<OrganizationAISettings> {
  const { data, error } = await supabase
    .from("organization_settings")
    .select("*")
    .eq("organization_id", organizationId)
    .single();

  if (error || !data) {
    // Retourner settings par défaut si non trouvé
    return {
      id: "",
      organization_id: organizationId,
      ai_tone: "neutral",
      ai_language: "FR",
      ai_detail_level: 2,
      executive_level: "manager",
      modules_enabled: {
        ane: true,
        aar: true,
        ad: true,
        asr: true,
        aoc: true,
        aga: true
      },
      report_frequency: "weekly",
      report_day: 1,
      report_hour: 8,
      report_recipients: [],
      require_approval_for_ai_actions: false,
      ai_audit_retention_days: 90,
      sensitive_data_redaction: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  return data;
}

export async function logAIAction(params: {
  agent: AIAgent;
  action: string;
  context: AIRequestContext;
  inputData?: any;
  outputData?: any;
  status: "SUCCESS" | "ERROR" | "BLOCKED";
  errorMessage?: string;
  executionTimeMs: number;
  permissionCheckPassed?: boolean;
  coherenceCheckPassed?: boolean;
  anomalyDetected?: boolean;
  anomalyDetails?: any;
}): Promise<void> {
  try {
    // Redact sensitive data si activé
    let inputDataToLog = params.inputData;
    let outputDataToLog = params.outputData;

    if (params.context.settings.sensitive_data_redaction) {
      inputDataToLog = redactSensitiveData(params.inputData);
      outputDataToLog = redactSensitiveData(params.outputData);
    }

    await supabase.from("ai_audit_logs").insert({
      organization_id: params.context.organizationId,
      agent: params.agent,
      action: params.action,
      user_id: params.context.userId,
      context: {
        organizationId: params.context.organizationId,
        userId: params.context.userId,
        timestamp: params.context.timestamp
      },
      input_data: inputDataToLog,
      output_data: outputDataToLog,
      status: params.status,
      error_message: params.errorMessage,
      execution_time_ms: params.executionTimeMs,
      permission_check_passed: params.permissionCheckPassed ?? true,
      coherence_check_passed: params.coherenceCheckPassed ?? true,
      anomaly_detected: params.anomalyDetected ?? false,
      anomaly_details: params.anomalyDetails
    });
  } catch (error) {
    console.error("Error logging AI action:", error);
  }
}

function redactSensitiveData(data: any): any {
  if (!data) return data;

  const sensitiveKeys = ["email", "password", "token", "api_key", "phone", "ssn"];
  const redacted = JSON.parse(JSON.stringify(data));

  function redactRecursive(obj: any) {
    if (typeof obj !== "object" || obj === null) return;

    for (const key in obj) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        obj[key] = "[REDACTED]";
      } else if (typeof obj[key] === "object") {
        redactRecursive(obj[key]);
      }
    }
  }

  redactRecursive(redacted);
  return redacted;
}
```

**CHECKPOINT PHASE 1** :
- [ ] Tables `organization_settings` + `ai_audit_logs` créées
- [ ] Client OpenAI configuré (`lib/ai-agents/openai-client.ts`)
- [ ] Types communs définis (`lib/ai-agents/types.ts`)
- [ ] Fonctions utilitaires créées (`lib/ai-agents/utils.ts`)
- [ ] Test : `console.log(await getOrgSettings("org-test"))` retourne settings

---

### PHASE 2 : Agent ANE (Agent Narratif Exécutif) (1.5 jours)

**Objectif** : Implémenter l'agent qui génère les résumés exécutifs.

#### 2.1 — Créer types ANE

```typescript
// lib/ai-agents/ane/types.ts

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

#### 2.2 — Créer prompt système ANE

```typescript
// lib/ai-agents/ane/system-prompt.ts

import type { OrganizationAISettings } from "../types";

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

#### 2.3 — Créer agent ANE

Copier le code de `PACK7-AI-AGENTS-SPECS.md` section ANE.

#### 2.4 — Créer API endpoint ANE

```typescript
// app/api/ai/executive-summary/route.ts

import { NextRequest, NextResponse } from "next/server";
import { generateExecutiveSummary } from "@/lib/ai-agents/ane/agent";
import { getOrgSettings } from "@/lib/ai-agents/utils";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, organizationId } = body;

    const userId = request.headers.get("x-user-id");

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
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    const { data: risks } = await supabase
      .from("risks")
      .select("*")
      .eq("project_id", projectId);

    const { data: decisions } = await supabase
      .from("decisions")
      .select("*")
      .eq("project_id", projectId);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Generate summary
    const output = await generateExecutiveSummary(
      {
        project: {
          id: project.id,
          name: project.name,
          status: project.status,
          rag_status: project.rag_status,
          budget: project.budget,
          start_date: project.start_date,
          end_date: project.end_date
        },
        risks: risks || [],
        decisions: decisions || []
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
    console.error("Error in /api/ai/executive-summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**CHECKPOINT PHASE 2** :
- [ ] ANE types créés (`lib/ai-agents/ane/types.ts`)
- [ ] ANE prompt système créé (`lib/ai-agents/ane/system-prompt.ts`)
- [ ] ANE agent implémenté (`lib/ai-agents/ane/agent.ts`)
- [ ] API endpoint créé (`/api/ai/executive-summary`)
- [ ] Test : Appeler endpoint avec `projectId` réel → Retourne résumé exécutif JSON

---

### PHASE 3 : Agents AAR, AD (2 jours)

**Objectif** : Implémenter Agent Analyse Risques + Agent Décisionnel.

**Pattern identique à ANE** :
1. Créer `lib/ai-agents/aar/types.ts` (voir PACK7-AI-AGENTS-SPECS.md)
2. Créer `lib/ai-agents/aar/system-prompt.ts`
3. Créer `lib/ai-agents/aar/agent.ts`
4. Créer `app/api/ai/analyze-risks/route.ts`

Répéter pour AD (`ad/`, `/api/ai/decision-arbitrage`).

**CHECKPOINT PHASE 3** :
- [ ] AAR complet (types, prompt, agent, API)
- [ ] AD complet (types, prompt, agent, API)
- [ ] Test AAR : Appeler `/api/ai/analyze-risks` → Retourne analyse risques
- [ ] Test AD : Appeler `/api/ai/decision-arbitrage` → Retourne arbitrage

---

### PHASE 4 : Agents ASR, AOC (2 jours)

**Objectif** : Implémenter Agent Reporting + Agent Onboarding.

**Pattern identique** :
- ASR : `asr/`, `/api/ai/weekly-report`
- AOC : `aoc/`, `/api/ai/onboarding`

**CHECKPOINT PHASE 4** :
- [ ] ASR complet
- [ ] AOC complet
- [ ] Test ASR : Générer rapport hebdo → Retourne rapport structuré
- [ ] Test AOC : Générer onboarding → Retourne tutoriel

---

### PHASE 5 : Agent AGA + Gouvernance (2 jours)

**Objectif** : Implémenter gouvernance, permissions, vérifications cohérence.

#### 5.1 — Créer vérifications permissions

```typescript
// lib/ai-agents/aga/permissions.ts

import { supabase } from "@/lib/supabase";

const PERMISSION_MATRIX: Record<string, string[]> = {
  super_admin: ["*"],
  admin: [
    "generate_executive_summary",
    "analyze_risks",
    "decision_arbitrage",
    "generate_report",
    "generate_onboarding"
  ],
  chef_projet: [
    "generate_executive_summary",
    "analyze_risks",
    "decision_arbitrage"
  ],
  contributeur: ["generate_executive_summary"],
  lecteur: []
};

export async function checkPermissions(
  userId: string,
  action: string,
  context: any
): Promise<boolean> {
  if (!userId) return false;

  // Récupérer rôle utilisateur
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role_global")
    .eq("user_id", userId)
    .eq("organization_id", context.organizationId)
    .single();

  if (!userRole) return false;

  const allowedActions = PERMISSION_MATRIX[userRole.role_global] || [];

  // Vérifier permission
  if (allowedActions.includes("*") || allowedActions.includes(action)) {
    return true;
  }

  return false;
}
```

#### 5.2 — Créer vérifications cohérence

```typescript
// lib/ai-agents/aga/coherence-checks.ts

import { supabase } from "@/lib/supabase";

export async function checkDataCoherence(
  projectId: string
): Promise<{ passed: boolean; anomalies: any[] }> {
  const anomalies = [];

  const { data: project } = await supabase
    .from("projects")
    .select("*, risks(*), decisions(*)")
    .eq("id", projectId)
    .single();

  if (!project) return { passed: true, anomalies: [] };

  const { rag_status, start_date, end_date, risks, decisions } = project;

  // Check 1: RAG status cohérent avec risques
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

  // Check 2: Dates cohérentes
  if (new Date(end_date) < new Date(start_date)) {
    anomalies.push({
      type: "DATE_INCOHERENT",
      severity: "HIGH",
      description: "Date fin < Date début",
      autoFix: null
    });
  }

  // Check 3: Owners existent
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

#### 5.3 — Créer agent AGA

```typescript
// lib/ai-agents/aga/agent.ts

import { supabase } from "@/lib/supabase";
import { checkDataCoherence } from "./coherence-checks";
import type { AIRequestContext } from "../types";

export async function runAudit(
  input: { organizationId: string; period: string },
  context: AIRequestContext
): Promise<any> {
  const startTime = Date.now();

  try {
    // Récupérer tous les logs IA des dernières 24h
    const { data: logs } = await supabase
      .from("ai_audit_logs")
      .select("*")
      .eq("organization_id", input.organizationId)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false });

    // Récupérer tous les projets
    const { data: projects } = await supabase
      .from("projects")
      .select("id, name")
      .eq("organization_id", input.organizationId);

    // Vérifier cohérence de chaque projet
    const allAnomalies = [];
    for (const project of projects || []) {
      const { anomalies } = await checkDataCoherence(project.id);
      allAnomalies.push(...anomalies);
    }

    // Générer rapport
    const output = {
      auditReport: {
        organization: input.organizationId,
        period: "Dernières 24h",
        generatedAt: new Date().toISOString()
      },
      summary: {
        totalAIActions: logs?.length || 0,
        actionsValidated: logs?.filter(l => l.status === "SUCCESS").length || 0,
        anomaliesDetected: allAnomalies.length,
        actionsBlocked: logs?.filter(l => l.status === "BLOCKED").length || 0
      },
      anomalies: allAnomalies,
      logs: (logs || []).slice(0, 50).map(log => ({
        timestamp: log.created_at,
        agent: log.agent,
        action: log.action,
        context: log.context,
        status: log.status,
        executionTime: `${log.execution_time_ms}ms`
      })),
      securityChecks: {
        permissionsViolations: logs?.filter(l => !l.permission_check_passed).length || 0,
        unauthorizedAccess: logs?.filter(l => l.status === "BLOCKED").length || 0,
        suspiciousActivity: 0
      }
    };

    const executionTime = Date.now() - startTime;

    // Log audit de l'audit
    await supabase.from("ai_audit_logs").insert({
      organization_id: input.organizationId,
      agent: "AGA",
      action: "run_audit",
      context: { period: input.period },
      output_data: { anomaliesCount: allAnomalies.length },
      status: "SUCCESS",
      execution_time_ms: executionTime
    });

    return output;

  } catch (error) {
    console.error("Error in AGA audit:", error);
    throw error;
  }
}
```

**CHECKPOINT PHASE 5** :
- [ ] Permissions implémentées (`aga/permissions.ts`)
- [ ] Vérifications cohérence implémentées (`aga/coherence-checks.ts`)
- [ ] Agent AGA complet (`aga/agent.ts`)
- [ ] API endpoint créé (`/api/ai/audit`)
- [ ] Test : Appeler `/api/ai/audit` → Retourne rapport audit

---

### PHASE 6 : Intégration Desktop (1 jour)

**Objectif** : Créer composant UI pour afficher insights IA dans cockpit.

#### 6.1 — Créer composant AIInsightsPanel

```typescript
// components/cockpit/AIInsightsPanel.tsx

"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIInsightsPanelProps {
  projectId: string;
  organizationId: string;
}

export function AIInsightsPanel({ projectId, organizationId }: AIInsightsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  async function generateInsights() {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/executive-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, organizationId })
      });
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error("Erreur génération insights:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-insights-panel" style={{
      width: "100%",
      padding: "24px",
      backgroundColor: "#111111",
      border: "1px solid #1E1E1E",
      borderRadius: "12px"
    }}>
      <div className="panel-header" style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px"
      }}>
        <Sparkles size={24} color="#3A82F7" />
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF", flex: 1 }}>
          IA Insights Exécutifs
        </h3>
        <Button
          onClick={generateInsights}
          disabled={loading}
          style={{
            backgroundColor: "#3A82F7",
            color: "#FFFFFF",
            padding: "8px 16px",
            borderRadius: "8px"
          }}
        >
          {loading ? "Génération..." : "Générer"}
        </Button>
      </div>

      {insights && (
        <div className="insights-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Résumé exécutif */}
          <section>
            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginBottom: "12px" }}>
              📊 Résumé Exécutif
            </h4>
            <p style={{ fontSize: "14px", color: "#9A9A9A", marginBottom: "8px" }}>
              {insights.executiveSummary.headline}
            </p>
            <ul style={{ listStyle: "disc", paddingLeft: "20px", fontSize: "14px", color: "#9A9A9A" }}>
              {insights.executiveSummary.keyPoints.map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </section>

          {/* Risques clés */}
          <section>
            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={16} color="#FFB800" /> Risques Clés
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {insights.keyRisks.map((risk: any) => (
                <div key={risk.id} style={{
                  padding: "12px",
                  backgroundColor: "#0A0A0A",
                  border: "1px solid #1E1E1E",
                  borderRadius: "8px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: risk.severity === "HIGH" ? "#FF4545" : risk.severity === "MEDIUM" ? "#FFB800" : "#00C853",
                      color: "#FFFFFF"
                    }}>
                      {risk.severity}
                    </span>
                    <h5 style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>{risk.title}</h5>
                  </div>
                  <p style={{ fontSize: "12px", color: "#9A9A9A", marginBottom: "4px" }}>{risk.impact}</p>
                  <p style={{ fontSize: "12px", color: "#3A82F7" }}>→ {risk.action}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Décisions clés */}
          <section>
            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckSquare size={16} color="#3A82F7" /> Décisions Clés
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {insights.keyDecisions.map((decision: any) => (
                <div key={decision.id} style={{
                  padding: "12px",
                  backgroundColor: "#0A0A0A",
                  border: "1px solid #1E1E1E",
                  borderRadius: "8px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    {decision.blocking && (
                      <span style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#FF4545",
                        color: "#FFFFFF"
                      }}>
                        BLOQUANTE
                      </span>
                    )}
                    <h5 style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>{decision.title}</h5>
                  </div>
                  {decision.deadline && (
                    <p style={{ fontSize: "12px", color: "#9A9A9A", marginBottom: "4px" }}>
                      Deadline : {new Date(decision.deadline).toLocaleDateString()}
                    </p>
                  )}
                  <p style={{ fontSize: "12px", color: "#3A82F7" }}>→ {decision.action}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Actions immédiates */}
          <section>
            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={16} color="#00C853" /> Actions Immédiates
            </h4>
            <ol style={{ paddingLeft: "20px", fontSize: "14px", color: "#9A9A9A" }}>
              {insights.immediateActions.map((action: any, i: number) => (
                <li key={i} style={{ marginBottom: "12px" }}>
                  <strong style={{ color: "#FFFFFF" }}>{action.action}</strong>
                  <div style={{ fontSize: "12px", color: "#6A6A6A", marginTop: "4px" }}>
                    <span>Responsable : {action.responsible}</span> • <span>Deadline : {action.deadline}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Insight stratégique */}
          {insights.strategicInsight && (
            <section style={{
              padding: "16px",
              backgroundColor: "#0A0A0A",
              border: "1px solid #3A82F7",
              borderRadius: "8px"
            }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#3A82F7", marginBottom: "8px" }}>
                🔍 Insight Stratégique
              </h4>
              <p style={{ fontSize: "14px", color: "#FFFFFF", marginBottom: "8px" }}>
                {insights.strategicInsight.message}
              </p>
              <p style={{ fontSize: "14px", color: "#3A82F7" }}>
                💡 {insights.strategicInsight.recommendation}
              </p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
```

#### 6.2 — Intégrer dans page projet

```typescript
// app/cockpit/projet/[id]/page.tsx

import { AIInsightsPanel } from "@/components/cockpit/AIInsightsPanel";

export default function ProjetDetailPage({ params }: { params: { id: string } }) {
  const organizationId = "..."; // Récupérer depuis context

  return (
    <div>
      {/* Header projet */}
      {/* ... */}

      {/* IA Insights Panel */}
      <AIInsightsPanel projectId={params.id} organizationId={organizationId} />

      {/* Tabs projet (risques, décisions, etc.) */}
      {/* ... */}
    </div>
  );
}
```

**CHECKPOINT PHASE 6** :
- [ ] Composant `AIInsightsPanel` créé
- [ ] Intégré dans page détail projet
- [ ] Test : Cliquer "Générer" → Affiche insights IA

---

### PHASE 7 : Intégration Mobile (1 jour)

**Objectif** : Créer composant mobile pour insights IA (PACK 6).

```typescript
// components/cockpit/mobile/AIInsightCardMobile.tsx

"use client";

import { Sparkles } from "lucide-react";

interface AIInsightCardMobileProps {
  insight: {
    type: "RISK" | "DECISION" | "ACTION" | "INSIGHT";
    title: string;
    description: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
  };
  onClick?: () => void;
}

export function AIInsightCardMobile({ insight, onClick }: AIInsightCardMobileProps) {
  return (
    <div
      className="ai-insight-card-mobile"
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: "72px",
        padding: "12px 16px",
        backgroundColor: "#111111",
        border: "1px solid #1E1E1E",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        transition: "opacity 120ms ease-out",
        WebkitTapHighlightColor: "transparent"
      }}
      onTouchStart={(e) => {
        (e.currentTarget as HTMLDivElement).style.opacity = "0.9";
      }}
      onTouchEnd={(e) => {
        (e.currentTarget as HTMLDivElement).style.opacity = "1";
      }}
    >
      <div className="icon" style={{ flexShrink: 0 }}>
        <Sparkles size={20} color="#3A82F7" />
      </div>

      <div className="content" style={{ flex: 1 }}>
        <h4 style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#FFFFFF",
          marginBottom: "4px"
        }}>
          {insight.title}
        </h4>
        <p style={{
          fontSize: "12px",
          color: "#9A9A9A",
          lineHeight: 1.4
        }}>
          {insight.description}
        </p>
      </div>

      <span
        className="priority-badge"
        style={{
          flexShrink: 0,
          fontSize: "11px",
          fontWeight: 600,
          padding: "4px 8px",
          borderRadius: "4px",
          backgroundColor: insight.priority === "HIGH" ? "#FF4545" : insight.priority === "MEDIUM" ? "#FFB800" : "#00C853",
          color: "#FFFFFF"
        }}
      >
        {insight.priority}
      </span>
    </div>
  );
}
```

**CHECKPOINT PHASE 7** :
- [ ] Composant `AIInsightCardMobile` créé
- [ ] Intégré dans cockpit mobile (PACK 6)
- [ ] Test : Affichage mobile correct, tap feedback visible

---

### PHASE 8 : Tests & Validation (1 jour)

**Objectif** : Tester tous les agents avec données réelles.

#### Tests à effectuer :

1. **ANE** :
   - Projet avec 0 risques → Résumé positif
   - Projet avec 5 risques HIGH → Résumé critique
   - Projet avec décisions bloquantes → Actions immédiates

2. **AAR** :
   - Projet avec 10 risques → Classification correcte
   - Vérifier score risque (0-100)
   - Vérifier mesures d'atténuation proposées

3. **AD** :
   - Décision sans options → Génère 2-3 options
   - Vérifier impacts court/moyen/long terme
   - Vérifier recommandation justifiée

4. **ASR** :
   - Générer rapport hebdo avec 10+ projets
   - Vérifier structure : Résumé → Risques → Décisions → Actions
   - Vérifier tendances vs semaine précédente

5. **AOC** :
   - User nouveau → Onboarding "cockpit vide"
   - User existant → Suggestions contextuelles

6. **AGA** :
   - Créer projet avec RAG GREEN + 5 risques HIGH → Détecte incohérence
   - Vérifier auto-fix RAG status → YELLOW
   - Vérifier logs IA journalisés

**CHECKPOINT PHASE 8** :
- [ ] Tous agents testés avec données réelles
- [ ] Performances acceptables (<5s par appel)
- [ ] Logs IA fonctionnels
- [ ] Aucune erreur bloquante

---

## CHECKLIST FINALE

- [ ] **Infrastructure** : Tables créées, client OpenAI configuré
- [ ] **6 Agents** : ANE, AAR, AD, ASR, AOC, AGA implémentés
- [ ] **6 API Endpoints** : Tous fonctionnels
- [ ] **Personnalisation** : Settings org appliqués dans prompts
- [ ] **Gouvernance** : Permissions + vérifications cohérence + logs
- [ ] **UI Desktop** : Composant `AIInsightsPanel` intégré
- [ ] **UI Mobile** : Composant `AIInsightCardMobile` intégré (PACK 6)
- [ ] **Tests** : Tous scénarios validés
- [ ] **Documentation** : README IA ajouté
- [ ] **Performance** : <5s par appel IA
- [ ] **Sécurité** : Permissions vérifiées, données sensibles redacted

---

## TROUBLESHOOTING

### Problème 1 : OpenAI timeout

**Symptôme** : Appels IA > 30s ou timeout.

**Solution** :
- Réduire `max_tokens` dans appels (2000 → 1500)
- Augmenter timeout Next.js : `export const maxDuration = 60;` dans API routes
- Vérifier quota OpenAI/Azure

### Problème 2 : Réponses non-JSON

**Symptôme** : Erreur parsing JSON dans agents.

**Solution** :
- Vérifier `response_format: { type: "json_object" }` activé
- Ajouter dans prompt système : "Réponds UNIQUEMENT en JSON valide"
- Ajouter validation Zod sur output

### Problème 3 : Permissions refusées

**Symptôme** : 403 Forbidden sur appels IA.

**Solution** :
- Vérifier `x-user-id` header présent (middleware)
- Vérifier rôle utilisateur dans `user_roles`
- Vérifier `PERMISSION_MATRIX` dans `aga/permissions.ts`

### Problème 4 : Logs IA non créés

**Symptôme** : Table `ai_audit_logs` vide.

**Solution** :
- Vérifier RLS policies créées
- Vérifier fonction `logAIAction` appelée dans agents
- Vérifier `supabaseAdmin` utilisé (bypass RLS)

---

## PROCHAINES ÉTAPES

1. **VB** : Implémenter PACK 7 (7-10 jours)
2. **QA** : Valider avec checklist PACK 7 (2-3 jours)
3. **Release Manager** : Déploiement production
4. **Post-Release** : Monitoring 48h (PACK 5)

**Estimation totale** : 10-13 jours (dev + tests + déploiement).

---

**FIN PACK 7 — GUIDE D'IMPLÉMENTATION IA**
