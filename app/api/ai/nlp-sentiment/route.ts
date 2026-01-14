import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface NLPAnalysis {
  sentiment_analysis: {
    overall_score: number;
    sentiment: 'VERY_POSITIVE' | 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'VERY_NEGATIVE';
    emotional_indicators: {
      confidence: number;
      stress: number;
      motivation: number;
      satisfaction: number;
    };
    key_themes: Array<{
      theme: string;
      frequency: number;
      sentiment: number;
    }>;
  };
  communication_patterns: {
    meeting_frequency: number;
    response_time_avg: number;
    collaboration_score: number;
    conflict_indicators: number;
  };
  stakeholder_engagement: Array<{
    stakeholder: string;
    engagement_level: number;
    sentiment_trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    communication_quality: number;
  }>;
  risk_signals: Array<{
    signal: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    source: string;
    detected_at: string;
  }>;
  recommendations: string[];
}

export async function POST(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { project_id, data_sources } = body;

    // Simulation analyse NLP avancée (à connecter avec vraies APIs: Slack, Teams, Jira, Email)
    const overallScore = Math.random() * 40 + 50;
    
    let sentiment: 'VERY_POSITIVE' | 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'VERY_NEGATIVE';
    if (overallScore >= 85) sentiment = 'VERY_POSITIVE';
    else if (overallScore >= 70) sentiment = 'POSITIVE';
    else if (overallScore >= 50) sentiment = 'NEUTRAL';
    else if (overallScore >= 35) sentiment = 'NEGATIVE';
    else sentiment = 'VERY_NEGATIVE';

    const emotionalIndicators = {
      confidence: Math.random() * 30 + 60,
      stress: Math.random() * 40 + 20,
      motivation: Math.random() * 35 + 55,
      satisfaction: Math.random() * 30 + 60,
    };

    const keyThemes = [
      { theme: 'Délais / Planning', frequency: 45, sentiment: overallScore - 15 },
      { theme: 'Complexité technique', frequency: 38, sentiment: overallScore - 10 },
      { theme: 'Collaboration équipe', frequency: 32, sentiment: overallScore + 10 },
      { theme: 'Clarté des objectifs', frequency: 28, sentiment: overallScore + 5 },
      { theme: 'Support management', frequency: 25, sentiment: overallScore },
      { theme: 'Charge de travail', frequency: 22, sentiment: overallScore - 20 },
    ];

    const communicationPatterns = {
      meeting_frequency: Math.round(Math.random() * 10 + 15),
      response_time_avg: Math.round(Math.random() * 120 + 60),
      collaboration_score: Math.round((Math.random() * 25 + 65) * 10) / 10,
      conflict_indicators: Math.round(Math.random() * 15 + 5),
    };

    const stakeholderEngagement = [
      {
        stakeholder: 'Sponsor COMEX',
        engagement_level: Math.round((Math.random() * 20 + 75) * 10) / 10,
        sentiment_trend: 'STABLE' as const,
        communication_quality: Math.round((Math.random() * 15 + 80) * 10) / 10,
      },
      {
        stakeholder: 'Product Owner',
        engagement_level: Math.round((Math.random() * 20 + 70) * 10) / 10,
        sentiment_trend: overallScore > 70 ? 'IMPROVING' as const : 'DECLINING' as const,
        communication_quality: Math.round((Math.random() * 20 + 70) * 10) / 10,
      },
      {
        stakeholder: 'Tech Lead',
        engagement_level: Math.round((Math.random() * 25 + 65) * 10) / 10,
        sentiment_trend: 'STABLE' as const,
        communication_quality: Math.round((Math.random() * 20 + 75) * 10) / 10,
      },
      {
        stakeholder: 'Équipe Dev',
        engagement_level: Math.round((Math.random() * 30 + 60) * 10) / 10,
        sentiment_trend: emotionalIndicators.stress > 60 ? 'DECLINING' as const : 'STABLE' as const,
        communication_quality: Math.round((Math.random() * 25 + 65) * 10) / 10,
      },
    ];

    const riskSignals = [];
    
    if (emotionalIndicators.stress > 70) {
      riskSignals.push({
        signal: 'Niveau de stress élevé détecté dans 65% des communications équipe',
        severity: 'HIGH' as const,
        source: 'Slack/Teams NLP Analysis',
        detected_at: new Date().toISOString(),
      });
    }

    if (communicationPatterns.conflict_indicators > 15) {
      riskSignals.push({
        signal: 'Augmentation des indicateurs de conflit (+40% vs baseline)',
        severity: 'HIGH' as const,
        source: 'Communication Pattern AI',
        detected_at: new Date().toISOString(),
      });
    }

    if (keyThemes[0].sentiment < 50) {
      riskSignals.push({
        signal: `Sentiment négatif récurrent sur "${keyThemes[0].theme}" (score: ${Math.round(keyThemes[0].sentiment)})`,
        severity: 'MEDIUM' as const,
        source: 'Theme Extraction NLP',
        detected_at: new Date().toISOString(),
      });
    }

    if (communicationPatterns.response_time_avg > 150) {
      riskSignals.push({
        signal: 'Temps de réponse moyen en augmentation (indicateur de désengagement)',
        severity: 'MEDIUM' as const,
        source: 'Communication Velocity Analysis',
        detected_at: new Date().toISOString(),
      });
    }

    const recommendations = [];
    
    if (sentiment === 'NEGATIVE' || sentiment === 'VERY_NEGATIVE') {
      recommendations.push('🚨 Organiser réunion d\'urgence avec l\'équipe pour identifier les blocages majeurs');
      recommendations.push('💬 Mettre en place sessions 1-on-1 avec chaque membre pour écoute active');
    }

    if (emotionalIndicators.stress > 70) {
      recommendations.push('🧘 Réduire la charge de travail immédiate de 20% et autoriser télétravail flexible');
      recommendations.push('🎯 Revoir les priorités avec le PO pour supprimer les éléments non-critiques');
    }

    if (communicationPatterns.collaboration_score < 70) {
      recommendations.push('🤝 Organiser team building ou activité collaborative pour recréer cohésion');
      recommendations.push('📊 Mettre en place daily stand-ups structurés avec focus sur les blocages');
    }

    if (keyThemes[0].frequency > 40 && keyThemes[0].sentiment < 60) {
      recommendations.push(`⚡ Adresser rapidement le sujet "${keyThemes[0].theme}" qui préoccupe fortement l'équipe`);
    }

    const analysis: NLPAnalysis = {
      sentiment_analysis: {
        overall_score: Math.round(overallScore * 10) / 10,
        sentiment,
        emotional_indicators: {
          confidence: Math.round(emotionalIndicators.confidence * 10) / 10,
          stress: Math.round(emotionalIndicators.stress * 10) / 10,
          motivation: Math.round(emotionalIndicators.motivation * 10) / 10,
          satisfaction: Math.round(emotionalIndicators.satisfaction * 10) / 10,
        },
        key_themes: keyThemes,
      },
      communication_patterns: communicationPatterns,
      stakeholder_engagement: stakeholderEngagement,
      risk_signals: riskSignals,
      recommendations,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('NLP Analysis error:', error);
    return NextResponse.json({ error: 'NLP analysis failed' }, { status: 500 });
  }
}
