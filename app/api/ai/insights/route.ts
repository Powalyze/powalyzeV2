import { NextRequest, NextResponse } from 'next/server';

interface AIInsight {
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
}

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const insights: AIInsight[] = [
      {
        type: 'delay_prediction',
        message: 'Le projet "Cloud Migration" présente un risque élevé de retard (probabilité: 78%). Recommandation: renforcer l\'équipe infrastructure.',
        severity: 'critical',
        confidence: 82
      },
      {
        type: 'budget_alert',
        message: 'Dérive budgétaire détectée sur 3 projets. Coût total cumulé: +450K€ par rapport au plan.',
        severity: 'warning',
        confidence: 88
      },
      {
        type: 'resource_optimization',
        message: 'Opportunité d\'optimisation: 2 ressources seniors sous-utilisées (capacité: 45%). Proposition de réaffectation disponible.',
        severity: 'info',
        confidence: 75
      },
      {
        type: 'risk_emerging',
        message: 'Nouveau risque émergent identifié: dépendance critique vers API tierce (SLA non garanti). Score: 16/25.',
        severity: 'warning',
        confidence: 79
      }
    ];

    return NextResponse.json(insights);
  } catch (error) {
    console.error('AI Insights error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
