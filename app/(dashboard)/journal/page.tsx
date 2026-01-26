'use client';

import React, { useState } from 'react';
import { BookOpen, Calendar, Tag, Plus, Filter as FilterIcon, Download } from 'lucide-react';
import ModuleCard from '@/components/cockpit/ModuleCard';
import KpiCard from '@/components/cockpit/KpiCard';
import AINarrativeBlock from '@/components/cockpit/AINarrativeBlock';
import DetailSheet, { DetailSection, DetailField } from '@/components/cockpit/DetailSheet';
import { useTranslation } from '@/lib/i18n';

interface JournalEntry {
  id: string;
  date: string;
  type: 'risk' | 'project' | 'decision' | 'weakSignal' | 'strategicInfo';
  title: string;
  impact: 'high' | 'medium' | 'low';
  content?: string;
}

export default function JournalPage() {
  const { t } = useTranslation();
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Mock data
  // PRODUCTION CLIENT PRO: État vierge par défaut
  const entries: JournalEntry[] = [];

  const entries30d = entries.length;
  const weakSignals = entries.filter(e => e.type === 'weakSignal').length;
  const trackedDecisions = entries.filter(e => e.type === 'decision').length;
  const emergingRisks = entries.filter(e => e.type === 'risk').length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'risk': return 'text-red-600 bg-red-50';
      case 'project': return 'text-blue-600 bg-blue-50';
      case 'decision': return 'text-purple-600 bg-purple-50';
      case 'weakSignal': return 'text-yellow-600 bg-yellow-50';
      case 'strategicInfo': return 'text-green-600 bg-green-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'risk': return t('journal.typeRisk');
      case 'project': return t('journal.typeProject');
      case 'decision': return t('journal.typeDecision');
      case 'weakSignal': return t('journal.typeWeakSignal');
      case 'strategicInfo': return t('journal.typeStrategicInfo');
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <ModuleCard
        title={t('modules.journal.title')}
        subtitle={t('modules.journal.subtitle')}
        narration={t('modules.journal.narration')}
        icon={<BookOpen className="w-6 h-6" />}
        actions={
          <>
            <button className="ds-btn ds-btn-primary">
              <Plus className="w-4 h-4" />
              {t('journal.createNew')}
            </button>
            <button className="ds-btn ds-btn-ghost">
              <FilterIcon className="w-4 h-4" />
              {t('common.filter')}
            </button>
            <button className="ds-btn ds-btn-ghost">
              <Download className="w-4 h-4" />
              {t('common.export')}
            </button>
          </>
        }
      >
        {/* Synthèse haute - 4 KPI */}
        <div className="ds-grid ds-grid-4 mb-8">
          <KpiCard
            label={t('journal.entries30d')}
            value={entries30d}
            icon={<BookOpen className="w-5 h-5" />}
          />
          <KpiCard
            label={t('journal.weakSignals')}
            value={weakSignals}
            variant="warning"
            icon={<Tag className="w-5 h-5" />}
          />
          <KpiCard
            label={t('journal.trackedDecisions')}
            value={trackedDecisions}
            icon={<BookOpen className="w-5 h-5" />}
          />
          <KpiCard
            label={t('journal.emergingRisks')}
            value={emergingRisks}
            variant="danger"
            icon={<BookOpen className="w-5 h-5" />}
          />
        </div>

        {/* Timeline */}
        <div className="ds-card p-6">
          <h3 className="ds-subtitle-navy text-lg mb-6">Timeline</h3>
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="flex gap-4 group cursor-pointer" onClick={() => setSelectedEntry(entry)}>
                <div className="flex flex-col items-center pt-1">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(entry.type)} border-2 border-current`} />
                  <div className="w-px h-full bg-neutral-200 mt-2" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(entry.type)}`}>
                        {getTypeLabel(entry.type)}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {new Date(entry.date).toLocaleDateString('fr-FR', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-navy mb-1 group-hover:text-gold transition-colors">
                    {entry.title}
                  </h4>
                  {entry.content && (
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {entry.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IA Narrative */}
        <AINarrativeBlock
          summary="4 événements majeurs ce mois dont 1 risque critique et 1 signal faible important."
          analysis="Le retard fournisseur ERP crée un effet domino sur 3 projets. Signal faible équipe Data à surveiller (turnover 3 personnes)."
          recommendations="Traiter le risque ERP en priorité via comité extraordinaire. Lancer analyse RH sur équipe Data."
          scenarios="Si action immédiate sur ERP: impact limité à 2 semaines. Si inaction: retard cumulé 2 mois + surcoût 150K€."
          alerts="Signal faible équipe Data peut évoluer en risque critique sous 4 semaines si aucune action RH."
        />
      </ModuleCard>

      {/* Detail Sheet */}
      {selectedEntry && (
        <DetailSheet
          isOpen={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
          title={selectedEntry.title}
        >
          <DetailSection title={t('detail.information')} icon={<BookOpen />}>
            <DetailField label={t('journal.date')} value={new Date(selectedEntry.date).toLocaleDateString('fr-FR')} />
            <DetailField label={t('journal.type')} value={getTypeLabel(selectedEntry.type)} />
            <DetailField label={t('journal.impact')} value={selectedEntry.impact} />
          </DetailSection>

          {selectedEntry.content && (
            <DetailSection title={t('detail.context')}>
              <p className="text-sm text-neutral-700 leading-relaxed">{selectedEntry.content}</p>
            </DetailSection>
          )}

          <DetailSection title={t('detail.links')}>
            <div className="text-sm text-neutral-600">
              {selectedEntry.type === 'risk' && (
                <p>{t('detail.linkedProjects')}: Migration Cloud, ERP V2</p>
              )}
              {selectedEntry.type === 'decision' && (
                <p>{t('detail.linkedCommittees')}: Comité Stratégique</p>
              )}
            </div>
          </DetailSection>

          <DetailSection title={t('ai.narrative')} icon={<BookOpen />}>
            <AINarrativeBlock
              summary="Événement stratégique avec impact sur la roadmap globale."
              analysis="Nécessite arbitrage exécutif dans les prochains jours."
              recommendations="Convoquer comité extraordinaire pour traiter ce point."
            />
          </DetailSection>
        </DetailSheet>
      )}
    </div>
  );
}

