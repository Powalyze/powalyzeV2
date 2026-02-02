'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Zap, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Page Vélocité
 * Historique des sprints + prédictions IA
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

function VelocityContent() {
  const [loading, setLoading] = useState(true);
  const [velocityHistory, setVelocityHistory] = useState<VelocityRecord[]>([]);
  const [averageVelocity, setAverageVelocity] = useState<number>(0);
  const [aiNarrative, setAiNarrative] = useState<string>('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    loadVelocity();
  }, []);

  const loadVelocity = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Non connecté');

      // Récupérer le profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, plan, pro_active')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setIsDemo(profile.plan === 'demo' || !profile.pro_active);

      // Récupérer l'historique de vélocité (derniers 3 sprints)
      const { data: velocityData, error: velocityError } = await supabase
        .from('velocity')
        .select(`
          planned_points,
          completed_points,
          sprints!inner(name)
        `)
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (velocityError) throw velocityError;

      const history = (velocityData || []).map((v: any) => ({
        sprint_name: v.sprints.name,
        planned_points: v.planned_points,
        completed_points: v.completed_points,
      }));

      setVelocityHistory(history);

      // Appel RPC get_average_velocity
      if (history.length > 0) {
        const { data: avgData, error: avgError } = await supabase.rpc('get_average_velocity', {
          p_organization_id: profile.organization_id,
          p_project_id: null, // Tous les projets
          p_limit: 3,
        });

        if (avgError) throw avgError;

        setAverageVelocity(avgData || 0);

        // Générer la narrative IA
        generateAINarrative(history, avgData || 0);
      }
    } catch (err: any) {
      console.error('Erreur chargement:', err);
      alert(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const generateAINarrative = (history: VelocityRecord[], avg: number) => {
    // Analyse simple (peut être remplacée par un appel OpenAI en production)
    const lastSprint = history[0];
    const completionRate = lastSprint
      ? Math.round((lastSprint.completed_points / lastSprint.planned_points) * 100)
      : 0;

    let narrative = `Votre vélocité moyenne sur les 3 derniers sprints est de **${Math.round(avg)} points**. `;

    if (completionRate >= 90) {
      narrative += `L'équipe est performante et complète ${completionRate}% des points planifiés. `;
      narrative += `Vous pouvez envisager d'augmenter légèrement la charge pour le prochain sprint.`;
    } else if (completionRate >= 70) {
      narrative += `L'équipe est stable avec ${completionRate}% de complétion. `;
      narrative += `Continuez sur cette lancée en maintenant une charge similaire.`;
    } else {
      narrative += `⚠️ L'équipe complète seulement ${completionRate}% des points planifiés. `;
      narrative += `Il peut y avoir une surcharge ou des blocages. Envisagez de réduire la charge ou d'identifier les obstacles.`;
    }

    setAiNarrative(narrative);
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
