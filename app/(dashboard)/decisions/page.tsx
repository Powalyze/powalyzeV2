'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Calendar, TrendingUp, Plus, Filter, Download } from 'lucide-react';
import BaseHeader from '@/components/cockpit/BaseHeader';
import KpiCard from '@/components/cockpit/KpiCard';
import TopNav from '@/components/cockpit/TopNav';
import AINarrative from '@/components/cockpit/AINarrative';
import { useTranslation } from '@/lib/i18n';
import { getCockpitData, type Decision } from '@/lib/cockpitData';
import { useMode } from '@/lib/ModeContext';

export default function DecisionsPage() {
  const { t } = useTranslation();
  const { mode, isDemoMode: isDemo } = useMode();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  useEffect(() => {
    const cockpitData = getCockpitData();
    const filteredDecisions = mode === 'demo'
      ? cockpitData.decisions
      : cockpitData.decisions.filter(d => d.source !== 'demo');
    setDecisions(filteredDecisions);
  }, [mode]);

  const pendingDecisions = decisions.filter(d => d.status === 'pending').length;
  const validatedDecisions = decisions.filter(d => d.status === 'validated').length;
  const criticalDecisions = decisions.filter(d => d.impact === 'high').length;
  const lateDecisions = decisions.filter(d => d.status === 'late').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'late': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-white">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <BaseHeader
          titleKey="cockpit.modules.decisions.title"
          subtitleKey="cockpit.modules.decisions.subtitle"
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
                {t('cockpit.modules.decisions.newDecision')}
              </button>
            </>
          }
        />

        {/* KPI Synthèse (4 max) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KpiCard
            label="En attente"
            value={pendingDecisions}
            variant="warning"
            icon={<FileText className="w-5 h-5" />}
          />
          <KpiCard
            label="Validées"
            value={validatedDecisions}
            variant="success"
            icon={<FileText className="w-5 h-5" />}
          />
          <KpiCard
            label="Critiques"
            value={criticalDecisions}
            variant="danger"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KpiCard
            label="En retard"
            value={lateDecisions}
            variant="danger"
            icon={<Calendar className="w-5 h-5" />}
          />
        </div>

        {/* Timeline + Tableau */}
        <section className="mb-12">
          <h3 className="header-subtitle text-xl mb-6">Timeline des décisions</h3>
          
          <div className="space-y-4">
            {decisions.map((decision, idx) => (
              <div key={decision.id} className="card-premium">
                <div className="flex items-start gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      decision.status === 'validated' ? 'bg-green-500' :
                      decision.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    {idx < decisions.length - 1 && (
                      <div className="w-0.5 h-full bg-neutral-light mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{decision.title}</h4>
                        <div className="flex items-center gap-4 text-sm opacity-70">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {decision.date}
                          </span>
                          <span>{decision.committee}</span>
                          <span>{decision.owner}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1.5 rounded border font-medium ${
                          decision.impact === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                          decision.impact === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          'bg-green-100 text-green-700 border-green-200'
                        }`}>
                          {decision.impact.toUpperCase()}
                        </span>
                        <span className={`text-xs px-3 py-1.5 rounded border font-medium ${getStatusColor(decision.status)}`}>
                          {decision.status}
                        </span>
                      </div>
                    </div>
                    {decision.deadline && (
                      <p className="text-sm opacity-60">
                        Échéance: {decision.deadline}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* IA Narrative */}
        <AINarrative
          summary="2 décisions stratégiques en attente nécessitent un arbitrage COMEX immédiat. Vélocité de décision: 3.2 jours (cible: 2j)."
          analysis="La décision sur l'API alternative bloque 3 projets. Le budget additionnel Mobile nécessite validation CFO avant vendredi."
          recommendations={[
            "Convoquer COMEX extraordinaire jeudi 9h pour arbitrage API",
            "Préparer 3 scénarios budgétaires Mobile (best/nominal/worst)",
            "Documenter impact cascade si décision API retardée"
          ]}
          scenarios={[
            { title: "API alternative validée", impact: "Déblocage projets sous 48h, surcoût +80K€" },
            { title: "API actuelle maintenue", impact: "Retard 3 semaines, pénalités -150K€" }
          ]}
          alerts={[
            "Décision API doit être prise avant 20/01 (J+2)",
            "Budget Mobile sans validation = blocage livraison"
          ]}
        />
      </main>
    </div>
  );
}

