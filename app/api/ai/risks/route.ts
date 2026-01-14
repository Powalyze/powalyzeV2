import { NextRequest, NextResponse } from 'next/server';
import { AIPrediction } from '@/types';

export async function POST(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { project_id, context } = body;

    const suggestions: AIPrediction[] = [
      {
        type: 'RISK',
        probability: 75,
        confidence: 82,
        explanation: 'Risque de dérive budgétaire identifié suite à l\'analyse des tendances de coûts',
        recommendations: [
          'Mettre en place un contrôle budgétaire hebdomadaire',
          'Geler les dépenses non essentielles',
          'Revoir les contrats fournisseurs'
        ],
        factors: [
          { name: 'Tendance coûts', impact: 9.0, description: 'Augmentation de 12% par rapport au plan' },
          { name: 'Burn rate', impact: 7.5, description: 'Burn rate supérieur à 110% du prévu' }
        ]
      },
      {
        type: 'RISK',
        probability: 60,
        confidence: 78,
        explanation: 'Risque de turnover dans l\'équipe détecté',
        recommendations: [
          'Organiser des entretiens individuels',
          'Revoir la charge de travail',
          'Mettre en place un plan de rétention'
        ],
        factors: [
          { name: 'Absentéisme', impact: 6.5, description: 'Augmentation de 8% ce trimestre' },
          { name: 'Satisfaction équipe', impact: 5.8, description: 'Score en baisse selon dernière enquête' }
        ]
      }
    ];

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('AI Risks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
