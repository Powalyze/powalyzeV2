'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, FileText, Folder, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

/**
 * Cockpit Dashboard - Vue d'ensemble des modules
 * Structure: Header + KPI (3-4 max) + Modules
 */
export default function CockpitDashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Cockpit Exécutif</h1>
        <p className="text-slate-400">Vue d'ensemble de votre portfolio de gouvernance</p>
      </div>

      {/* KPI Synthèse (MAX 4 cartes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Projets Actifs</span>
            <Folder className="text-blue-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">12</div>
          <div className="text-sm text-emerald-400 mt-1">+2 ce mois</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Risques Critiques</span>
            <AlertTriangle className="text-red-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">7</div>
          <div className="text-sm text-emerald-400 mt-1">-1 résolu</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Décisions en Attente</span>
            <FileText className="text-amber-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">5</div>
          <div className="text-sm text-slate-400 mt-1">À traiter</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Budget Total</span>
            <TrendingUp className="text-purple-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">1.5M€</div>
          <div className="text-sm text-slate-400 mt-1">Consommé</div>
        </div>
      </div>

      {/* Navigation Modules */}
      <section>
        <h3 className="text-xl font-semibold text-white mb-6">Accès rapide aux modules</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module Portefeuille */}
          <Link href="/cockpit/portefeuille" className="group">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Folder className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-white">
                  Portefeuille
                </h4>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Gérez l'ensemble de vos projets actifs
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">42 projets</span>
                <ArrowRight className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          {/* Module Risques */}
          <Link href="/cockpit/risques" className="group">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-white">
                  Risques
                </h4>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Suivez et mitigez les risques critiques
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">12 risques</span>
                <ArrowRight className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          {/* Module Décisions */}
          <Link href="/cockpit/decisions" className="group">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-white">
                  Décisions
                </h4>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Registre des décisions stratégiques
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">7 en attente</span>
                <ArrowRight className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          {/* Module Anomalies */}
          <Link href="/cockpit/anomalies" className="group">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-white">
                  Anomalies
                </h4>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Incidents et anomalies à traiter
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">3 ouvertes</span>
                <ArrowRight className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          {/* Module Rapports */}
          <Link href="/cockpit/rapports" className="group">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-white">
                  Rapports
                </h4>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Génération et export de rapports
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">12 rapports</span>
                <ArrowRight className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

