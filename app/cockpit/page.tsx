"use client";

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ExecutiveHero } from '@/components/cockpit/ExecutiveHero';
import { KpiCard } from '@/components/cockpit/KpiCard';
import { Timeline } from '@/components/cockpit/Timeline';
import { RiskMatrix } from '@/components/cockpit/RiskMatrix';
import { PortfolioList } from '@/components/cockpit/PortfolioList';
import { DecisionPanel } from '@/components/cockpit/DecisionPanel';
import { AnomalyList } from '@/components/cockpit/AnomalyList';
import { AiAssistantPanel } from '@/components/cockpit/AiAssistantPanel';
import { Target, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function CockpitPage() {
  return (
    <AppShell rightPanel={<AiAssistantPanel />}>
      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <ExecutiveHero />
        
        {/* KPIs Grid */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            title="Projets actifs"
            value="42"
            change={8}
            trend="up"
            icon={<Target className="w-4 h-4" />}
            subtitle="vs mois dernier"
          />
          <KpiCard
            title="Budget total"
            value="7.8M€"
            change={-2}
            trend="down"
            icon={<DollarSign className="w-4 h-4" />}
            subtitle="98% consommé"
          />
          <KpiCard
            title="Taux de succès"
            value="94%"
            change={3}
            trend="up"
            icon={<TrendingUp className="w-4 h-4" />}
            subtitle="Objectif: 90%"
          />
          <KpiCard
            title="Équipes actives"
            value="287"
            change={12}
            trend="up"
            icon={<Users className="w-4 h-4" />}
            subtitle="FTE engagés"
          />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Timeline />
            <RiskMatrix />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <DecisionPanel />
            <AnomalyList />
          </div>
        </div>
        
        {/* Portfolio Section */}
        <PortfolioList />
      </div>
    </AppShell>
  );
}
