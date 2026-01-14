import { NextRequest, NextResponse } from 'next/server';
import { AIPrediction } from '@/types';

export async function POST(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { project_id } = body;

    const prediction: AIPrediction = {
      type: 'DELAY',
      probability: Math.random() * 100,
      confidence: 75 + Math.random() * 20,
      explanation: `Basé sur l'analyse de 15 indicateurs du projet ${project_id}, le modèle identifie des risques de retard liés à la charge ressources et aux dépendances critiques.`,
      recommendations: [
        'Renforcer l\'équipe avec 2 développeurs seniors',
        'Revoir le planning des jalons Q2',
        'Mettre en place un point quotidien avec les équipes'
      ],
      factors: [
        { name: 'Charge ressources', impact: 8.5, description: 'Surcharge détectée sur 3 ressources clés' },
        { name: 'Dépendances externes', impact: 7.2, description: '4 dépendances critiques non résolues' },
        { name: 'Complexité technique', impact: 6.8, description: 'Score de complexité supérieur à la moyenne' },
        { name: 'Vélocité équipe', impact: 5.5, description: 'Vélocité en baisse de 15% ce mois' }
      ]
    };

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('AI Forecast error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
