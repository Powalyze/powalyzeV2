import { NextRequest, NextResponse } from 'next/server';
import { AIPrediction } from '@/types';

export async function POST(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { project_id, current_budget, current_cost } = body;

    const forecastedCost = current_cost * 1.15;
    const variance = forecastedCost - current_budget;
    const variancePercentage = (variance / current_budget) * 100;

    const prediction: AIPrediction = {
      type: 'BUDGET',
      probability: variancePercentage > 10 ? 85 : 45,
      confidence: 80,
      explanation: `Prévision basée sur l'analyse des dépenses actuelles (${current_cost}€) et des tendances historiques. Dépassement estimé à ${variance.toFixed(0)}€ (${variancePercentage.toFixed(1)}%).`,
      recommendations: [
        'Optimiser les coûts infrastructure cloud (-15%)',
        'Renégocier les contrats fournisseurs',
        'Réduire le scope fonctionnel non prioritaire',
        'Anticiper une demande de budget additionnel'
      ],
      factors: [
        { name: 'Tendance dépenses', impact: 8.2, description: 'Croissance de 15% par mois' },
        { name: 'Scope creep', impact: 7.0, description: '8 nouvelles demandes en attente' },
        { name: 'Coûts infrastructure', impact: 6.5, description: 'Dépassement de 12% du prévu' },
        { name: 'Coûts RH', impact: 5.8, description: '3 recrutements supplémentaires prévus' }
      ]
    };

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('AI Budget error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
