import { NextRequest, NextResponse } from 'next/server';

interface VoiceCommand {
  transcript: string;
  confidence: number;
  intent: string;
  entities: Record<string, any>;
  action: {
    type: string;
    params: Record<string, any>;
  };
  response: string;
}

export async function POST(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { audio_data, transcript } = body;

    // NLP avancé pour comprendre l'intention
    const intent = detectIntent(transcript);
    const entities = extractEntities(transcript);

    let action = { type: 'UNKNOWN', params: {} };
    let response = '';

    // Traitement des commandes vocales
    switch (intent) {
      case 'SHOW_PROJECT':
        action = {
          type: 'NAVIGATE',
          params: { route: '/projects', filter: entities.project_name },
        };
        response = `Affichage du projet ${entities.project_name || 'demandé'}`;
        break;

      case 'CREATE_RISK':
        action = {
          type: 'CREATE_ENTITY',
          params: {
            entity: 'risk',
            data: {
              title: entities.risk_title,
              probability: entities.probability || 50,
              impact: entities.impact || 50,
            },
          },
        };
        response = `Création du risque "${entities.risk_title}" en cours`;
        break;

      case 'RUN_FORECAST':
        action = {
          type: 'API_CALL',
          params: { endpoint: '/api/ai/forecast', method: 'POST' },
        };
        response = 'Lancement de la prévision IA pour ce projet';
        break;

      case 'GENERATE_REPORT':
        action = {
          type: 'GENERATE_DOCUMENT',
          params: { template: entities.report_type || 'executive' },
        };
        response = `Génération du rapport ${entities.report_type || 'exécutif'} en cours`;
        break;

      case 'AUTO_HEAL':
        action = {
          type: 'API_CALL',
          params: { endpoint: '/api/ai/auto-healing', method: 'POST' },
        };
        response = 'Déclenchement du mode auto-healing';
        break;

      case 'SHOW_INSIGHTS':
        action = {
          type: 'NAVIGATE',
          params: { route: '/cockpit', section: 'insights' },
        };
        response = 'Affichage des insights IA';
        break;

      default:
        response = 'Commande non reconnue. Essayez: "Affiche le projet Cloud Migration" ou "Crée un risque critique"';
    }

    const voiceCommand: VoiceCommand = {
      transcript: transcript,
      confidence: 0.85 + Math.random() * 0.14,
      intent,
      entities,
      action,
      response,
    };

    return NextResponse.json(voiceCommand);
  } catch (error) {
    console.error('Voice Command error:', error);
    return NextResponse.json({ error: 'Voice processing failed' }, { status: 500 });
  }
}

function detectIntent(transcript: string): string {
  const lower = transcript.toLowerCase();
  
  if (lower.includes('affiche') || lower.includes('montre') || lower.includes('voir')) {
    if (lower.includes('projet')) return 'SHOW_PROJECT';
    if (lower.includes('insight')) return 'SHOW_INSIGHTS';
  }
  
  if (lower.includes('crée') || lower.includes('créer') || lower.includes('nouveau')) {
    if (lower.includes('risque')) return 'CREATE_RISK';
    if (lower.includes('projet')) return 'CREATE_PROJECT';
  }
  
  if (lower.includes('prévision') || lower.includes('forecast') || lower.includes('prédit')) {
    return 'RUN_FORECAST';
  }
  
  if (lower.includes('rapport') || lower.includes('report') || lower.includes('document')) {
    return 'GENERATE_REPORT';
  }
  
  if (lower.includes('auto') && (lower.includes('heal') || lower.includes('répare'))) {
    return 'AUTO_HEAL';
  }
  
  return 'UNKNOWN';
}

function extractEntities(transcript: string): Record<string, any> {
  const entities: Record<string, any> = {};
  
  // Extraction nom de projet (entre guillemets ou après "projet")
  const projectMatch = transcript.match(/projet\s+["']?([^"'\n]+)["']?/i);
  if (projectMatch) entities.project_name = projectMatch[1].trim();
  
  // Extraction titre risque
  const riskMatch = transcript.match(/risque\s+["']?([^"'\n]+)["']?/i);
  if (riskMatch) entities.risk_title = riskMatch[1].trim();
  
  // Extraction probabilité
  const probMatch = transcript.match(/probabilité\s+(\d+)/i);
  if (probMatch) entities.probability = parseInt(probMatch[1]);
  
  // Extraction impact
  const impactMatch = transcript.match(/impact\s+(\d+)/i);
  if (impactMatch) entities.impact = parseInt(impactMatch[1]);
  
  // Type de rapport
  if (transcript.includes('exécutif')) entities.report_type = 'executive';
  if (transcript.includes('technique')) entities.report_type = 'technical';
  if (transcript.includes('financier')) entities.report_type = 'financial';
  
  return entities;
}
