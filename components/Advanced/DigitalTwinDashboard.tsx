'use client';

import { useState, useEffect } from 'react';
import { Brain, Zap, Activity, Sparkles, TrendingUp, Shield, Target, Cpu } from 'lucide-react';

interface DigitalTwinData {
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
  autonomous_recommendations: Array<{
    action: string;
    priority: string;
    impact_score: number;
    confidence: number;
    auto_executable: boolean;
  }>;
  real_time_alerts: Array<{
    type: string;
    severity: string;
    message: string;
  }>;
}

export default function DigitalTwinDashboard({ projectId }: { projectId: string }) {
  const [twinData, setTwinData] = useState<DigitalTwinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoHealingActive, setAutoHealingActive] = useState(false);

  useEffect(() => {
    const fetchTwinData = () => {
      fetch(`/api/ai/digital-twin?project_id=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setTwinData(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchTwinData();
    const interval = setInterval(fetchTwinData, 30000); // Refresh toutes les 30s

    return () => clearInterval(interval);
  }, [projectId]);

  const triggerAutoHealing = async () => {
    setAutoHealingActive(true);
    try {
      const response = await fetch('/api/ai/auto-healing', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_id: projectId }),
      });
      const result = await response.json();
      alert(`Auto-Healing déclenché!\n${result.healing_actions.length} actions exécutées`);
    } catch (err) {
      console.error(err);
    } finally {
      setAutoHealingActive(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">Synchronisation Digital Twin...</div>
      </div>
    );
  }

  if (!twinData) {
    return <div className="text-status-red">Erreur de chargement du Digital Twin</div>;
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-status-green';
    if (score >= 60) return 'text-status-yellow';
    return 'text-status-red';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="text-brand-gold" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-white">Digital Twin - Temps Réel</h2>
            <p className="text-white/60 text-sm">Jumeau numérique synchronisé • Prédictions IA avancées</p>
          </div>
        </div>
        <button
          onClick={triggerAutoHealing}
          disabled={autoHealingActive}
          className="px-6 py-3 bg-brand-gold text-brand-blue-dark font-bold rounded-lg hover:bg-yellow-400 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Zap size={20} />
          {autoHealingActive ? 'Healing...' : 'Auto-Healing'}
        </button>
      </div>

      {/* Real-Time Alerts */}
      {twinData.real_time_alerts.length > 0 && (
        <div className="bg-status-red/10 border border-status-red rounded-lg p-4 space-y-2">
          <h3 className="text-status-red font-bold flex items-center gap-2">
            <Activity size={20} />
            Alertes Temps Réel
          </h3>
          {twinData.real_time_alerts.map((alert, i) => (
            <div key={i} className="text-white text-sm">{alert.message}</div>
          ))}
        </div>
      )}

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-brand-accent" size={20} />
            <span className="text-white/70 text-sm">Health Score</span>
          </div>
          <p className={`text-3xl font-bold ${getHealthColor(twinData.real_time_state.health_score)}`}>
            {twinData.real_time_state.health_score}%
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-status-green" size={20} />
            <span className="text-white/70 text-sm">Vélocité</span>
          </div>
          <p className="text-3xl font-bold text-white">{twinData.real_time_state.velocity}%</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-status-yellow" size={20} />
            <span className="text-white/70 text-sm">Burn Rate</span>
          </div>
          <p className="text-3xl font-bold text-white">{twinData.real_time_state.burn_rate}%</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-brand-gold" size={20} />
            <span className="text-white/70 text-sm">Sentiment Équipe</span>
          </div>
          <p className="text-3xl font-bold text-white">{twinData.real_time_state.team_sentiment}%</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-status-green" size={20} />
            <span className="text-white/70 text-sm">Qualité Code</span>
          </div>
          <p className="text-3xl font-bold text-white">{twinData.real_time_state.code_quality}%</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-brand-accent" size={20} />
            <span className="text-white/70 text-sm">Déploiements/mois</span>
          </div>
          <p className="text-3xl font-bold text-white">{twinData.real_time_state.deployment_frequency}</p>
        </div>
      </div>

      {/* Predictive Model */}
      <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="text-brand-gold" size={24} />
          <h3 className="text-xl font-bold text-white">Modèle Prédictif IA</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-white/60 text-sm mb-1">Date livraison prévue</p>
            <p className="text-white font-bold">{new Date(twinData.predictive_model.completion_date_forecast).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Budget final estimé</p>
            <p className="text-white font-bold">{(twinData.predictive_model.budget_at_completion / 1000).toFixed(0)}K€</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Qualité finale prévue</p>
            <p className="text-white font-bold">{twinData.predictive_model.quality_score_forecast}%</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Risque turnover</p>
            <p className={`font-bold ${twinData.predictive_model.team_attrition_risk > 50 ? 'text-status-red' : 'text-status-green'}`}>
              {twinData.predictive_model.team_attrition_risk}%
            </p>
          </div>
        </div>
      </div>

      {/* Autonomous Recommendations */}
      <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-brand-accent" size={24} />
          <h3 className="text-xl font-bold text-white">Recommandations Autonomes</h3>
        </div>
        <div className="space-y-3">
          {twinData.autonomous_recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                rec.priority === 'CRITICAL' ? 'bg-status-red text-white' :
                rec.priority === 'HIGH' ? 'bg-status-yellow text-brand-blue-dark' :
                'bg-status-green text-white'
              }`}>
                {rec.priority}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{rec.action}</p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="text-white/60">Impact: {rec.impact_score}%</span>
                  <span className="text-white/60">Confiance: {rec.confidence}%</span>
                  {rec.auto_executable && (
                    <span className="text-brand-gold">✓ Auto-exécutable</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
