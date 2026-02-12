'use client';

import { Suspense, useEffect, useState } from 'react';
import { Zap, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Page Vélocité
 * Historique des sprints + prédictions IA avec données démo
 */
export default function VelocityPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VelocityContent />
    </Suspense>
  );
}

interface VelocityRecord {
  sprint_name: string;
  planned_points: number;
  completed_points: number;
}

// Demo data for velocity tracking
const DEMO_VELOCITY_DATA: VelocityRecord[] = [
  { sprint_name: 'Sprint 12', planned_points: 45, completed_points: 42 },
  { sprint_name: 'Sprint 13', planned_points: 50, completed_points: 48 },
  { sprint_name: 'Sprint 14', planned_points: 48, completed_points: 51 },
  { sprint_name: 'Sprint 15', planned_points: 52, completed_points: 49 },
  { sprint_name: 'Sprint 16', planned_points: 50, completed_points: 53 },
];

const DEMO_NARRATIVE = `📊 **Analyse de Vélocité** - Basé sur les 5 derniers sprints

**Points clés:**
- Vélocité moyenne: **48.6 points/sprint** (+8% vs période précédente)
- Tendance: **Croissance stable** avec dépassement régulier des objectifs
- Prédiction Sprint 17: **51 points** (intervalle de confiance 85%)

**Recommandations IA:**
1. 🎯 **Maintenir la cadence actuelle** - Performance exceptionnelle de l'équipe
2. 📈 **Augmenter progressivement** - Prêt pour +5% de charge au Sprint 18
3. ⚠️ **Surveiller burn-down** - Quelques variations en fin de sprint

L'équipe démontre une maturité agile solide avec une capacité de prédiction fiable.`;

function VelocityContent() {
  const [loading, setLoading] = useState(true);
  const [velocityHistory, setVelocityHistory] = useState<VelocityRecord[]>([]);
  const [averageVelocity, setAverageVelocity] = useState<number>(0);
  const [aiNarrative, setAiNarrative] = useState<string>('');
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    loadVelocity();
  }, []);

  const loadVelocity = async () => {
    setLoading(true);
    try {
      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Load demo data
      setVelocityHistory(DEMO_VELOCITY_DATA);
      
      // Calculate average
      const avg = DEMO_VELOCITY_DATA.reduce((sum, v) => sum + v.completed_points, 0) / DEMO_VELOCITY_DATA.length;
      setAverageVelocity(Math.round(avg * 10) / 10);
      
      // Load AI narrative
      setAiNarrative(DEMO_NARRATIVE);
      setIsDemo(true);
    } catch (err: any) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;

  const getTrend = () => {
    if (velocityHistory.length < 2) return 'stable';
    const last = velocityHistory[0].completed_points;
    const previous = velocityHistory[1].completed_points;
    if (last > previous * 1.1) return 'up';
    if (last < previous * 0.9) return 'down';
    return 'stable';
  };

  const trend = getTrend();

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Zap className="w-8 h-8 text-[#D4AF37]" />
            Vélocité de l'équipe
          </h1>
          <p className="text-slate-400">Analyse des performances sur les derniers sprints</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1C1F26] rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">Vélocité moyenne</div>
              <Activity className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="text-3xl font-bold text-white">{Math.round(averageVelocity)}</div>
            <div className="text-xs text-slate-500 mt-1">points / sprint</div>
          </div>

          <div className="bg-[#1C1F26] rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">Tendance</div>
              {trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
              {trend === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
              {trend === 'stable' && <Activity className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="text-lg font-bold text-white capitalize">{trend === 'up' ? 'Hausse' : trend === 'down' ? 'Baisse' : 'Stable'}</div>
            <div className="text-xs text-slate-500 mt-1">par rapport au sprint précédent</div>
          </div>

          <div className="bg-[#1C1F26] rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">Sprints analysés</div>
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-white">{velocityHistory.length}</div>
            <div className="text-xs text-slate-500 mt-1">derniers sprints</div>
          </div>
        </div>

        {/* Chart */}
        {velocityHistory.length > 0 && (
          <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">Historique des sprints</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...velocityHistory].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="sprint_name"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8' }}
                    label={{ value: 'Points', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1F26',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Bar dataKey="planned_points" fill="#64748b" name="Planifiés" />
                  <Bar dataKey="completed_points" fill="#D4AF37" name="Complétés" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* AI Narrative */}
        {aiNarrative && (
          <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#C4A037]/10 rounded-2xl p-6 border border-[#D4AF37]/30">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#0A0F1C]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-3">Analyse IA</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{aiNarrative}</p>
              </div>
            </div>
          </div>
        )}

        {velocityHistory.length === 0 && (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Aucune donnée de vélocité</h2>
            <p className="text-slate-400">
              {isDemo
                ? 'Les données de vélocité seront générées automatiquement en mode Demo.'
                : 'Terminez des sprints pour voir l\'historique de vélocité.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
      <div className="text-white animate-pulse">Chargement de la vélocité...</div>
    </div>
  );
}
