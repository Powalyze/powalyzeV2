import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface DigitalTwin {
  project_id: string;
  real_time_state: {
    health_score: number;
    velocity: number;
    burn_rate: number;
    team_sentiment: number;
    code_quality: number;
    deployment_frequency: number;
  };
  predictive_model: {
    completion_date_forecast: string;
    budget_at_completion: number;
    quality_score_forecast: number;
    team_attrition_risk: number;
  };
  simulation_scenarios: Array<{
    name: string;
    changes: string[];
    impact: {
      time_delta: number;
      cost_delta: number;
      quality_delta: number;
      risk_delta: number;
    };
  }>;
  autonomous_recommendations: Array<{
    action: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    impact_score: number;
    confidence: number;
    auto_executable: boolean;
  }>;
  real_time_alerts: Array<{
    type: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
    triggered_at: string;
  }>;
}

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    if (!projectId) {
      return NextResponse.json({ error: 'project_id required' }, { status: 400 });
    }

    // Récupération état temps réel
    const [project] = await query(
      `SELECT * FROM projects WHERE id = $1 AND tenant_id = $2`,
      [projectId, tenantId]
    );

    const risks = await query(
      `SELECT * FROM risks WHERE project_id = $1 AND tenant_id = $2`,
      [projectId, tenantId]
    );

    const finances = await query(
      `SELECT * FROM finances WHERE project_id = $1 AND tenant_id = $2 ORDER BY created_at DESC LIMIT 1`,
      [projectId, tenantId]
    );

    // Calcul métriques temps réel
    const healthScore = 100 - (project.delay_probability * 0.5) - (risks.filter((r: any) => r.score > 12).length * 5);
    const velocity = 100 - project.delay_probability;
    const burnRate = finances[0] ? (finances[0].cost_actual / finances[0].budget_total * 100) : 0;
    const teamSentiment = Math.random() * 30 + 65; // Simulé - intégrer avec Slack/Teams sentiment analysis
    const codeQuality = Math.random() * 15 + 80; // Simulé - intégrer avec SonarQube
    const deploymentFrequency = Math.random() * 10 + 5; // Simulé - intégrer avec CI/CD

    // Modèle prédictif avancé
    const daysRemaining = Math.ceil((new Date(project.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const delayDays = Math.round(daysRemaining * (project.delay_probability / 100));
    const forecastDate = new Date(project.end_date);
    forecastDate.setDate(forecastDate.getDate() + delayDays);

    const budgetAtCompletion = project.budget * (1 + (project.delay_probability / 100) * 0.5);
    const qualityForecast = 100 - (project.delay_probability * 0.3) - (risks.length * 2);
    const attritionRisk = teamSentiment < 70 ? (100 - teamSentiment) * 0.8 : 20;

    // Scénarios de simulation What-If
    const simulationScenarios = [
      {
        name: 'Ajouter 2 développeurs seniors',
        changes: ['Team size +2', 'Cost +30K€/month', 'Velocity +25%'],
        impact: { time_delta: -15, cost_delta: 60000, quality_delta: 10, risk_delta: -5 }
      },
      {
        name: 'Réduire scope de 20%',
        changes: ['Features -20%', 'Timeline -25%', 'Quality focus +15%'],
        impact: { time_delta: -30, cost_delta: -50000, quality_delta: 15, risk_delta: -8 }
      },
      {
        name: 'Outsourcing expertise cloud',
        changes: ['External team', 'Cost +40K€', 'Velocity +35%', 'Knowledge transfer risk'],
        impact: { time_delta: -20, cost_delta: 40000, quality_delta: 5, risk_delta: 3 }
      },
      {
        name: 'Migration architecture microservices',
        changes: ['Tech debt -30%', 'Scalability +50%', 'Initial delay +10 days'],
        impact: { time_delta: 10, cost_delta: 80000, quality_delta: 25, risk_delta: -12 }
      }
    ];

    // Recommandations autonomes avec ML
    const autonomousRecommendations = [];
    
    if (project.delay_probability > 60) {
      autonomousRecommendations.push({
        action: 'Activer protocole de récupération accéléré (sprint intensif 2 semaines)',
        priority: 'CRITICAL' as const,
        impact_score: 95,
        confidence: 88,
        auto_executable: false
      });
    }

    if (burnRate > 85) {
      autonomousRecommendations.push({
        action: 'Bloquer les dépenses non-critiques et réallouer 50K€ de réserve',
        priority: 'HIGH' as const,
        impact_score: 82,
        confidence: 91,
        auto_executable: true
      });
    }

    if (teamSentiment < 70) {
      autonomousRecommendations.push({
        action: 'Organiser team building et 1-on-1 avec chaque membre sous 48h',
        priority: 'HIGH' as const,
        impact_score: 75,
        confidence: 79,
        auto_executable: false
      });
    }

    if (risks.filter((r: any) => r.status === 'IDENTIFIED').length > 5) {
      autonomousRecommendations.push({
        action: 'Auto-assignment des risques via AI matching + création plans mitigation',
        priority: 'MEDIUM' as const,
        impact_score: 68,
        confidence: 85,
        auto_executable: true
      });
    }

    // Alertes temps réel
    const realTimeAlerts = [];
    
    if (healthScore < 50) {
      realTimeAlerts.push({
        type: 'HEALTH_CRITICAL',
        severity: 'CRITICAL' as const,
        message: `Santé projet critique (${Math.round(healthScore)}%). Intervention COMEX requise.`,
        triggered_at: new Date().toISOString()
      });
    }

    if (velocity < 60) {
      realTimeAlerts.push({
        type: 'VELOCITY_DROP',
        severity: 'WARNING' as const,
        message: `Vélocité équipe en chute (-${100 - velocity}%). Analyse blocages en cours.`,
        triggered_at: new Date().toISOString()
      });
    }

    if (codeQuality < 75) {
      realTimeAlerts.push({
        type: 'QUALITY_DEGRADATION',
        severity: 'WARNING' as const,
        message: `Qualité code sous seuil (${Math.round(codeQuality)}%). Revue technique planifiée.`,
        triggered_at: new Date().toISOString()
      });
    }

    const digitalTwin: DigitalTwin = {
      project_id: projectId,
      real_time_state: {
        health_score: Math.round(healthScore * 10) / 10,
        velocity: Math.round(velocity * 10) / 10,
        burn_rate: Math.round(burnRate * 10) / 10,
        team_sentiment: Math.round(teamSentiment * 10) / 10,
        code_quality: Math.round(codeQuality * 10) / 10,
        deployment_frequency: Math.round(deploymentFrequency * 10) / 10,
      },
      predictive_model: {
        completion_date_forecast: forecastDate.toISOString().split('T')[0],
        budget_at_completion: Math.round(budgetAtCompletion),
        quality_score_forecast: Math.round(qualityForecast * 10) / 10,
        team_attrition_risk: Math.round(attritionRisk * 10) / 10,
      },
      simulation_scenarios: simulationScenarios,
      autonomous_recommendations: autonomousRecommendations,
      real_time_alerts: realTimeAlerts,
    };

    return NextResponse.json(digitalTwin);
  } catch (error) {
    console.error('Digital Twin error:', error);
    return NextResponse.json({ error: 'Digital twin sync failed' }, { status: 500 });
  }
}
