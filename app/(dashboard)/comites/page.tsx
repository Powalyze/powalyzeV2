'use client';

import React, { useState } from 'react';
import { Users, Calendar, Clock, Plus, Filter as FilterIcon, Download } from 'lucide-react';
import ModuleCard from '@/components/cockpit/ModuleCard';
import KPICard from '@/components/cockpit/KPICard';
import AINarrativeBlock from '@/components/cockpit/AINarrativeBlock';
import DetailSheet, { DetailSection, DetailField } from '@/components/cockpit/DetailSheet';
import { useTranslation } from '@/lib/i18n';

interface Committee {
  id: string;
  name: string;
  frequency: string;
  nextMeeting: string;
  owner: string;
  topics: number;
  members: number;
  description?: string;
}

export default function ComitesPage() {
  const { t } = useTranslation();
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);

  // PRODUCTION CLIENT PRO: État vierge par défaut
  const committees: Committee[] = [];

  const totalCommittees = committees.length;
  const upcomingMeetings = committees.filter(c => {
    const nextDate = new Date(c.nextMeeting);
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);
    return nextDate <= in7Days;
  }).length;
  const totalTopics = committees.reduce((acc, c) => acc + c.topics, 0);
  const resolutionRate = 85;

  return (
    <div className="min-h-screen bg-neutral-100">
      <ModuleCard
        title={t('modules.committees.title')}
        subtitle={t('modules.committees.subtitle')}
        narration={t('modules.committees.narration')}
        icon={<Users className="w-6 h-6" />}
        actions={
          <>
            <button className="ds-btn ds-btn-primary">
              <Plus className="w-4 h-4" />
              {t('committees.createNew')}
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
          <KPICard
            label={t('committees.total')}
            value={totalCommittees}
            icon={<Users className="w-5 h-5" />}
          />
          <KPICard
            label={t('committees.upcoming')}
            value={upcomingMeetings}
            variant="warning"
            icon={<Calendar className="w-5 h-5" />}
          />
          <KPICard
            label={t('committees.topics')}
            value={totalTopics}
            icon={<Clock className="w-5 h-5" />}
          />
          <KPICard
            label={t('committees.resolutionRate')}
            value={`${resolutionRate}%`}
            variant="success"
            icon={<Users className="w-5 h-5" />}
          />
        </div>

        {/* Liste des comités */}
        <div className="ds-card overflow-hidden">
          <table className="ds-table">
            <thead>
              <tr>
                <th>{t('committees.name')}</th>
                <th>{t('committees.frequency')}</th>
                <th>{t('committees.nextMeeting')}</th>
                <th>{t('committees.owner')}</th>
                <th>{t('committees.topics')}</th>
                <th>Membres</th>
              </tr>
            </thead>
            <tbody>
              {committees.map((committee) => (
                <tr
                  key={committee.id}
                  onClick={() => setSelectedCommittee(committee)}
                  className="cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <td className="font-medium text-navy">{committee.name}</td>
                  <td className="text-neutral-700">{committee.frequency}</td>
                  <td className="text-neutral-600 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(committee.nextMeeting).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="text-neutral-700">{committee.owner}</td>
                  <td className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold text-white text-sm font-semibold">
                      {committee.topics}
                    </span>
                  </td>
                  <td className="text-neutral-700">{committee.members}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* IA Narrative */}
        <AINarrativeBlock
          summary="3 comités actifs avec 16 points à traiter. 2 séances dans les 7 prochains jours."
          analysis="Comité Tech surchargé avec 8 sujets dont arbitrage Data Lake critique. Comité Stratégique avec 5 décisions majeures."
          recommendations="Dédoubler Comité Tech en 2 séances pour traiter tous les points. Préparer dossiers détaillés pour Comité Stratégique."
          scenarios="Si dédoublement Comité Tech: tous les sujets traités en janvier. Sinon: report de 4 sujets en février."
          alerts="Comité Tech: 22 janvier (8 sujets). Comité Stratégique: 25 janvier (5 décisions critiques dont validation budget)."
        />
      </ModuleCard>

      {/* Detail Sheet */}
      {selectedCommittee && (
        <DetailSheet
          isOpen={!!selectedCommittee}
          onClose={() => setSelectedCommittee(null)}
          title={selectedCommittee.name}
        >
          <DetailSection title={t('detail.information')} icon={<Users />}>
            <DetailField label={t('committees.frequency')} value={selectedCommittee.frequency} />
            <DetailField label={t('committees.nextMeeting')} value={new Date(selectedCommittee.nextMeeting).toLocaleDateString('fr-FR')} />
            <DetailField label={t('committees.owner')} value={selectedCommittee.owner} />
            <DetailField label={t('committees.topics')} value={selectedCommittee.topics.toString()} />
            <DetailField label="Membres" value={selectedCommittee.members.toString()} />
          </DetailSection>

          {selectedCommittee.description && (
            <DetailSection title={t('detail.context')}>
              <p className="text-sm text-neutral-700 leading-relaxed">{selectedCommittee.description}</p>
            </DetailSection>
          )}

          <DetailSection title="Points à traiter">
            <div className="space-y-2 text-sm text-neutral-700">
              <p>• Validation budget migration cloud</p>
              <p>• Arbitrage fournisseur Data Lake</p>
              <p>• Approbation plan formation IA</p>
            </div>
          </DetailSection>

          <DetailSection title={t('detail.linkedDecisions')}>
            <div className="text-sm text-neutral-600">
              <p>Dernières décisions: Validation budget Q2, Choix fournisseur ERP</p>
            </div>
          </DetailSection>

          <DetailSection title={t('ai.narrative')} icon={<Users />}>
            <AINarrativeBlock
              summary="Comité clé pour la gouvernance avec forte activité ce mois."
              analysis="8 points à traiter dont 3 critiques nécessitant arbitrage exécutif."
              recommendations="Prioriser les 3 sujets critiques et reporter les 5 autres si nécessaire."
            />
          </DetailSection>
        </DetailSheet>
      )}
    </div>
  );
}
