// ============================================================
// API ROUTE — AI INSIGHT GENERATION
// /app/api/ai/insight/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import type {
  AiInsightRequest,
  AiInsightResponse,
  ExecutiveStory,
  GovernanceSignal,
  Scenario,
  GovernancePillar,
} from '@/lib/cockpit-types';
import { insertExecutiveStory } from '@/lib/supabase-cockpit';

const AI_ENDPOINT = process.env.AI_ENDPOINT!;
const AI_API_KEY = process.env.AI_API_KEY!;

async function callAiModel(payload: AiInsightRequest): Promise<AiInsightResponse> {
  const prompt = `
Tu es le cockpit exécutif Powalyze, gouvernance 2026.

Contexte:
${payload.context}

Piliers à couvrir: ${payload.focusPillars.join(', ')}
Horizon: ${payload.horizon}

Génère:
1) Une histoire exécutive structurée (titre, narration, 3–5 étapes concrètes).
2) Une liste de signaux de gouvernance (pillar, titre, description, risque, horizon, confiance, action).
3) 2–3 scénarios (label, description, horizon, impact_score, upside, downside).

Langue: ${payload.language === 'fr' ? 'Français' : 'English'}.
Réponds en JSON strict, clé racine "powalyze".
`;

  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!res.ok) throw new Error(`AI error: ${res.status} ${res.statusText}`);

  const data = await res.json();
  let parsed: any;
  try {
    parsed = JSON.parse(data.choices[0].message.content);
  } catch {
    throw new Error('AI JSON parsing failed');
  }

  const root = parsed.powalyze ?? parsed;

  const story: ExecutiveStory = {
    id: root.story?.id ?? `story_${Date.now()}`,
    title: root.story?.title ?? 'Histoire exécutive',
    narrative: root.story?.narrative ?? '',
    horizon: root.story?.horizon ?? payload.horizon,
    focusPillars: root.story?.focusPillars ?? payload.focusPillars,
    recommendedNextSteps: root.story?.recommendedNextSteps ?? [],
  };

  const signals: GovernanceSignal[] = (root.signals ?? []).map((s: any, idx: number) => ({
    id: s.id ?? `signal_${idx}_${Date.now()}`,
    pillar: s.pillar as GovernancePillar,
    title: s.title,
    description: s.description,
    risk: s.risk,
    horizon: s.horizon ?? payload.horizon,
    confidence: s.confidence ?? 0.7,
    suggestedAction: s.suggestedAction ?? s.suggested_action ?? '',
  }));

  const scenarios: Scenario[] = (root.scenarios ?? []).map((sc: any, idx: number) => ({
    id: sc.id ?? `scenario_${idx}_${Date.now()}`,
    label: sc.label,
    description: sc.description,
    horizon: sc.horizon ?? payload.horizon,
    impactScore: sc.impactScore ?? sc.impact_score ?? 50,
    upside: sc.upside,
    downside: sc.downside,
  }));

  return {
    story,
    signals,
    scenarios,
    meta: {
      generatedAt: new Date().toISOString(),
      model: data.model ?? 'gpt-4.1-mini',
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AiInsightRequest & { organizationId?: string };
    const { context, focusPillars, horizon, language, organizationId } = body;

    const aiResponse = await callAiModel({ context, focusPillars, horizon, language });

    if (organizationId) {
      await insertExecutiveStory(organizationId, aiResponse.story);
    }

    return NextResponse.json(aiResponse, { status: 200 });
  } catch (error: any) {
    console.error('AI API error', error);
    return NextResponse.json(
      { error: 'AI_INSIGHT_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
