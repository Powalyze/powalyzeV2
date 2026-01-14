'use client';

import { useState, useEffect } from 'react';
import KpiCard from '@/components/Cockpit/KpiCard';
import HeatmapRisks from '@/components/Cockpit/HeatmapRisks';
import TimelineProjects from '@/components/Cockpit/TimelineProjects';
import AIInsights from '@/components/Cockpit/AIInsights';
import { BarChart3, AlertTriangle, DollarSign, TrendingUp, Layers } from 'lucide-react';

interface CockpitData {
  activeProjects: number;
  delayPercentage: number;
  budgetConsumed: number;
  criticalRisks: number;
  totalBudget: number;
}

export default function CockpitPage() {
  const [data, setData] = useState<CockpitData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cockpit', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load cockpit data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Chargement du cockpit...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Layers className="text-brand-gold" size={40} />
            Powalyze - Cockpit 360°
          </h1>
          <p className="text-brand-accent mt-2">Vue stratégique unifiée du portefeuille</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-sm">Dernière mise à jour</p>
          <p className="text-white font-semibold">{new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Projets Actifs"
          value={data?.activeProjects || 0}
          icon={<BarChart3 size={24} />}
          trend="+3"
          color="blue"
        />
        <KpiCard
          title="% Projets en Retard"
          value={`${data?.delayPercentage || 0}%`}
          icon={<AlertTriangle size={24} />}
          trend="-2%"
          color="yellow"
        />
        <KpiCard
          title="Budget Consommé"
          value={`${((data?.budgetConsumed || 0) / 1000000).toFixed(1)}M€`}
          icon={<DollarSign size={24} />}
          trend="+5%"
          color="green"
        />
        <KpiCard
          title="Risques Critiques"
          value={data?.criticalRisks || 0}
          icon={<TrendingUp size={24} />}
          trend="-1"
          color="red"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Risques */}
        <div className="lg:col-span-2">
          <HeatmapRisks />
        </div>

        {/* IA Insights */}
        <div>
          <AIInsights />
        </div>
      </div>

      {/* Timeline */}
      <div>
        <TimelineProjects />
      </div>
    </div>
  );
}
