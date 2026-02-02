'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingDown, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Page Burndown Chart
 * Graphique de progression du sprint
 */
export default function BurndownPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BurndownContent />
    </Suspense>
  );
}

interface Sprint {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface BurndownData {
  total_points: number;
  completed_points: number;
  remaining_points: number;
}

function BurndownContent() {
  const [loading, setLoading] = useState(true);
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [burndownData, setBurndownData] = useState<BurndownData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadBurndown();
  }, []);

  const loadBurndown = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Non connecté');

      // Récupérer le profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Récupérer le sprint actif
      const { data: sprintData, error: sprintError } = await supabase
        .from('sprints')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .eq('status', 'active')
        .single();

      if (sprintError && sprintError.code !== 'PGRST116') throw sprintError;

      setSprint(sprintData);

      if (sprintData) {
        // Appel RPC get_burndown_data
        const { data: burndown, error: burndownError } = await supabase.rpc('get_burndown_data', {
          p_sprint_id: sprintData.id,
        });

        if (burndownError) throw burndownError;

        setBurndownData(burndown);

        // Générer les données du graphique
        const start = new Date(sprintData.start_date);
        const end = new Date(sprintData.end_date);
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        const data = [];
        for (let i = 0; i <= totalDays; i++) {
          const day = new Date(start);
          day.setDate(start.getDate() + i);
          const idealRemaining = burndown.total_points - (burndown.total_points / totalDays) * i;

          data.push({
            day: `J${i}`,
            date: day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
            ideal: Math.max(0, Math.round(idealRemaining)),
            actual: i === totalDays ? burndown.remaining_points : null, // Simulé pour demo
          });
        }

        // Ajouter la progression actuelle (simulée)
        const currentDay = Math.ceil((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (currentDay >= 0 && currentDay <= totalDays) {
          data[currentDay].actual = burndown.remaining_points;
        }

        setChartData(data);
      }
    } catch (err: any) {
      console.error('Erreur chargement:', err);
      alert(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;

  if (!sprint || !burndownData) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <TrendingDown className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Aucun sprint actif</h2>
            <p className="text-slate-400">Créez un sprint pour voir le burndown chart.</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = burndownData.total_points > 0
    ? Math.round((burndownData.completed_points / burndownData.total_points) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-[#D4AF37]" />
            Burndown Chart
          </h1>
          <p className="text-slate-400">{sprint.name}</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1C1F26] rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Total Points</div>
            <div className="text-2xl font-bold text-white">{burndownData.total_points}</div>
          </div>
          <div className="bg-[#1C1F26] rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Complétés</div>
            <div className="text-2xl font-bold text-green-500">{burndownData.completed_points}</div>
          </div>
          <div className="bg-[#1C1F26] rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Restants</div>
            <div className="text-2xl font-bold text-orange-500">{burndownData.remaining_points}</div>
          </div>
          <div className="bg-[#1C1F26] rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Progression</div>
            <div className="text-2xl font-bold text-[#D4AF37]">{progressPercent}%</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Graphique de progression</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(sprint.start_date).toLocaleDateString('fr-FR')} →{' '}
                {new Date(sprint.end_date).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="day"
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
                <Legend
                  wrapperStyle={{ color: '#94a3b8' }}
                />
                <Line
                  type="monotone"
                  dataKey="ideal"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Idéal"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  name="Réel"
                  dot={{ fill: '#D4AF37', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-[#0A0F1C] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Ligne idéale</h3>
              <p className="text-xs text-slate-400">
                Représente la progression théorique si les points sont répartis uniformément sur la durée du sprint.
              </p>
            </div>
            <div className="bg-[#0A0F1C] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Ligne réelle</h3>
              <p className="text-xs text-slate-400">
                Représente la progression effective de l'équipe. Si elle est au-dessus de l'idéal, l'équipe est en retard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
      <div className="text-white animate-pulse">Chargement du burndown...</div>
    </div>
  );
}
