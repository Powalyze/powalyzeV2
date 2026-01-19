'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Clock, Plus, Filter, Download } from 'lucide-react';
import BaseHeader from '@/components/cockpit/BaseHeader';
import KPICard from '@/components/cockpit/KPICard';
import TopNav from '@/components/cockpit/TopNav';
import AINarrative from '@/components/cockpit/AINarrative';
import { useTranslation } from '@/lib/i18n';
import { getCockpitData, type Risk } from '@/lib/cockpitData';
import { useMode } from '@/lib/ModeContext';

export default function RisquesPage() {
  const { t } = useTranslation();
  const { mode, isDemoMode: isDemo } = useMode();
  const [risks, setRisks] = useState<Risk[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  useEffect(() => {
    const cockpitData = getCockpitData();
    const filteredRisks = mode === 'demo'
      ? cockpitData.risks
      : cockpitData.risks.filter(r => r.source !== 'demo');
    setRisks(filteredRisks);
  }, [mode]);

  const totalRisks = risks.length;
  const criticalRisks = risks.filter(r => r.level === 'high').length;
  const risingRisks = risks.filter(r => r.probability > 0.6).length;
  const resolvedRisks = risks.filter(r => r.status === 'resolved').length;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-white">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <BaseHeader
          titleKey="cockpit.modules.risks.title"
          subtitleKey="cockpit.modules.risks.subtitle"
          actions={
            <>
              <button className="btn-secondary">
                <Filter className="w-4 h-4" />
                {t('common.actions.filter')}
              </button>
              <button className="btn-secondary">
                <Download className="w-4 h-4" />
                {t('common.actions.export')}
              </button>
              <button className="btn-primary">
                <Plus className="w-4 h-4" />
                {t('cockpit.modules.risks.newRisk')}
              </button>
            </>
          }
        />

        {/* KPI Synthèse (4 max) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KPICard
            label="Risques totaux"
            value={totalRisks}
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <KPICard
            label="Critiques"
            value={criticalRisks}
            variant="danger"
            icon={<AlertTriangle className="w-5 h-5" />}
            trend="up"
            trendValue="+2"
          />
          <KPICard
            label="En hausse"
            value={risingRisks}
            variant="warning"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KPICard
            label="Résolus"
            value={resolvedRisks}
            variant="success"
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        {/* Tableau Premium */}
        <section className="mb-12">
          <h3 className="header-subtitle text-xl mb-6">Tableau des risques</h3>
          
          <div className="card-premium overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-light border-b border-neutral-light">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold opacity-70">Risque</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold opacity-70">Niveau</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold opacity-70">Probabilité</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold opacity-70">Impact</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold opacity-70">Propriétaire</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold opacity-70">Statut</th>
                </tr>
              </thead>
              <tbody>
                {risks.map(risk => (
                  <tr 
                    key={risk.id}
                    className="border-b border-neutral-light hover:bg-neutral-white cursor-pointer transition-colors"
                    onClick={() => setSelectedRisk(risk)}
                  >
                    <td className="py-4 px-6">
                      <p className="font-medium text-sm">{risk.title}</p>
                      <p className="text-xs opacity-60 mt-1">{risk.lastUpdate}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs px-3 py-1.5 rounded border font-medium ${getLevelColor(risk.level)}`}>
                        {risk.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-neutral-light rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${risk.probability * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.round(risk.probability * 100)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-neutral-light rounded-full h-2">
                          <div 
                            className="bg-gold h-2 rounded-full"
                            style={{ width: `${risk.impact * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.round(risk.impact * 100)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">{risk.owner}</td>
                    <td className="py-4 px-6">
                      <span className={`text-xs px-3 py-1.5 rounded ${
                        risk.status === 'active' ? 'bg-red-50 text-red-700' :
                        risk.status === 'mitigated' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {risk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* IA Narrative */}
        <AINarrative
          summary="2 risques critiques nécessitent une action immédiate. La surface globale de risque augmente de 15% ce mois."
          analysis="Le retard de l'API externe menace directement 3 projets (impact: 1.2M€). Le turnover Team Delta est en cours de stabilisation."
          recommendations={[
            "Activer fournisseur alternatif pour API externe (délai: 3 semaines)",
            "Négocier pénalités contractuelles avec fournisseur actuel",
            "Renforcer Team Delta avec 2 seniors (contrats 6 mois)"
          ]}
          scenarios={[
            { title: "Scénario optimiste", impact: "API livrée d'ici 10j, aucun impact projet" },
            { title: "Scénario réaliste", impact: "Retard 3 semaines, décalage Mobile Dashboard" },
            { title: "Scénario pessimiste", impact: "Échec API, refonte complète, +6 mois" }
          ]}
          alerts={[
            "Probabilité échec API: 80% si pas d'action avant 48h",
            "Budget contingence insuffisant: -450K€"
          ]}
        />
      </main>
    </div>
  );
}
