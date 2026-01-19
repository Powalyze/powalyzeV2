'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, FileText, Folder, TrendingUp, Target, ArrowRight } from 'lucide-react';
import BaseHeader from '@/components/cockpit/BaseHeader';
import KPICard from '@/components/cockpit/KPICard';
import TopNav from '@/components/cockpit/TopNav';
import { useTranslation } from '@/lib/i18n';

/**
 * Cockpit Dashboard - Vue d'ensemble des modules
 * Structure: TopNav + BaseHeader + KPI (3-4 max) + Modules
 */
export default function CockpitDashboard() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-neutral-white">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <BaseHeader
          titleKey="common.appName"
          subtitleKey="common.tagline"
        />

        {/* KPI Synthèse (MAX 4 cartes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KPICard
            label={t('cockpit.kpi.activeProjects')}
            value="12"
            icon={<Folder className="w-5 h-5" />}
            trend="up"
            trendValue="+2"
          />
          <KPICard
            label={t('cockpit.kpi.criticalRisks')}
            value="7"
            variant="danger"
            icon={<AlertTriangle className="w-5 h-5" />}
            trend="down"
            trendValue="-1"
          />
          <KPICard
            label={t('cockpit.kpi.pendingDecisions')}
            value="5"
            variant="warning"
            icon={<FileText className="w-5 h-5" />}
          />
          <KPICard
            label={t('cockpit.kpi.totalProjects')}
            value="1.5M€"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Navigation Modules */}
        <section>
          <h3 className="header-subtitle text-xl mb-6">Accès rapide aux modules</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Module Projets */}
            <Link href="/projets" className="group">
              <div className="card-premium group-hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-gold group-hover:text-white transition-all">
                    <Folder className="w-6 h-6" />
                  </div>
                  <h4 className="header-subtitle text-lg font-semibold group-hover:text-gold transition-colors">
                    {t('cockpit.modules.projects.title')}
                  </h4>
                </div>
                <p className="text-sm opacity-70 mb-4">
                  {t('cockpit.modules.projects.subtitle')}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-60">12 projets actifs</span>
                  <ArrowRight className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>

            {/* Module Risques */}
            <Link href="/risques" className="group">
              <div className="card-premium group-hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-gold group-hover:text-white transition-all">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="header-subtitle text-lg font-semibold group-hover:text-gold transition-colors">
                    {t('cockpit.modules.risks.title')}
                  </h4>
                </div>
                <p className="text-sm opacity-70 mb-4">
                  {t('cockpit.modules.risks.subtitle')}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-60">7 risques critiques</span>
                  <ArrowRight className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>

            {/* Module Décisions */}
            <Link href="/decisions" className="group">
              <div className="card-premium group-hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-gold group-hover:text-white transition-all">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="header-subtitle text-lg font-semibold group-hover:text-gold transition-colors">
                    {t('cockpit.modules.decisions.title')}
                  </h4>
                </div>
                <p className="text-sm opacity-70 mb-4">
                  {t('cockpit.modules.decisions.subtitle')}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-60">5 décisions en attente</span>
                  <ArrowRight className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
