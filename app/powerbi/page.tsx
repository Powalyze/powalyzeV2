"use client";

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { 
  Download, Share2, FileText, BarChart3, TrendingUp, 
  Calendar, Users, DollarSign, AlertTriangle, CheckCircle,
  Eye, RefreshCw, Maximize2, Filter
} from 'lucide-react';

export default function PowerBIPage() {
  const [selectedReport, setSelectedReport] = useState<'executive' | 'portfolio' | 'risks' | 'budget'>('executive');
  const [dateRange, setDateRange] = useState('Q1 2026');
  const [toast, setToast] = useState<{message: string; type: 'success' | 'info' | 'warning' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 4000);
  };

  const reports = {
    executive: {
      title: 'Tableau de Bord Exécutif',
      description: 'Vue d\'ensemble stratégique du portfolio',
      embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYzBmZjdhYjYtMzNjNS00YzA3LWE5ZTUtZTRlZjg5MzY0YWQ2IiwidCI6IjQ4ZWQ2MjE5LWY0NjAtNGU0My05YjA5LWY3NDU3NGU5YTBhMyJ9',
      icon: BarChart3,
      color: 'from-blue-600 to-indigo-600'
    },
    portfolio: {
      title: 'Analyse Portfolio',
      description: 'Performance détaillée des projets',
      embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiNzFiZmM3YjgtOGI3MC00OWY4LTkyMGMtMTU5ZGQzNzEyYmE4IiwidCI6IjQ4ZWQ2MjE5LWY0NjAtNGU0My05YjA5LWY3NDU3NGU5YTBhMyJ9',
      icon: TrendingUp,
      color: 'from-green-600 to-emerald-600'
    },
    risks: {
      title: 'Cartographie Risques',
      description: 'Analyse prédictive des risques',
      embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiOGQ4YjU3MDAtZmI3MS00NTQ5LWEzMDctMzQ1ZGQ0YTViMmNkIiwidCI6IjQ4ZWQ2MjE5LWY0NjAtNGU0My05YjA5LWY3NDU3NGU5YTBhMyJ9',
      icon: AlertTriangle,
      color: 'from-orange-600 to-red-600'
    },
    budget: {
      title: 'Suivi Budgétaire',
      description: 'Analyse financière et prévisions',
      embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiMWE4YzU0MGYtNGI2Ny00ZjQyLWI3YjctZTI5YzQ5ZjEyMzRhIiwidCI6IjQ4ZWQ2MjE5LWY0NjAtNGU0My05YjA5LWY3NDU3NGU5YTBhMyJ9',
      icon: DollarSign,
      color: 'from-yellow-600 to-amber-600'
    }
  };

  const currentReport = reports[selectedReport];
  const Icon = currentReport.icon;

  const downloadReport = (format: 'pdf' | 'pptx' | 'xlsx') => {
    showToast(`📥 Téléchargement du rapport ${currentReport.title} en cours...`, 'info');
    
    setTimeout(() => {
      // Simulation de téléchargement
      const date = new Date().toISOString().split('T')[0];
      const filename = `Powalyze_${selectedReport}_${dateRange.replace(' ', '_')}_${date}.${format}`;
      
      // En production, appeler l'API Power BI Export
      // fetch(`/api/powerbi/export`, { method: 'POST', body: JSON.stringify({ reportId: selectedReport, format }) })
      
      showToast(`✅ ${filename} téléchargé avec succès !`, 'success');
    }, 2000);
  };

  const shareReport = () => {
    const shareUrl = `https://www.powalyze.com/powerbi?report=${selectedReport}&range=${dateRange}`;
    navigator.clipboard.writeText(shareUrl);
    showToast('🔗 Lien de partage copié dans le presse-papier !', 'success');
  };

  const refreshData = () => {
    showToast('🔄 Actualisation des données en cours...', 'info');
    setTimeout(() => {
      showToast('✅ Données actualisées avec succès !', 'success');
    }, 1500);
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-slate-950 p-6">
        {/* Header */}
        <div className="max-w-[1800px] mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Rapports Power BI</h1>
              <p className="text-slate-400">Tableaux de bord interactifs et analyses prédictives</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Q4 2025">Q4 2025</option>
                <option value="Q1 2026">Q1 2026</option>
                <option value="Q2 2026">Q2 2026</option>
                <option value="2025">Année 2025</option>
                <option value="2026">Année 2026</option>
              </select>

              <button
                onClick={refreshData}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </button>
            </div>
          </div>

          {/* Report Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(reports).map(([key, report]) => {
              const ReportIcon = report.icon;
              const isActive = selectedReport === key;
              
              return (
                <button
                  key={key}
                  onClick={() => setSelectedReport(key as any)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    isActive
                      ? `bg-gradient-to-br ${report.color} border-white/20 shadow-lg scale-105`
                      : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <ReportIcon className={`w-8 h-8 mb-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <h3 className={`text-lg font-semibold mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {report.title}
                  </h3>
                  <p className={`text-sm ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                    {report.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">{currentReport.title}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{dateRange}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={shareReport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Partager
              </button>

              <div className="relative group">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={() => downloadReport('pdf')}
                    className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 flex items-center gap-3 rounded-t-lg"
                  >
                    <FileText className="w-4 h-4 text-red-400" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => downloadReport('pptx')}
                    className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 flex items-center gap-3"
                  >
                    <FileText className="w-4 h-4 text-orange-400" />
                    <span>PowerPoint</span>
                  </button>
                  <button
                    onClick={() => downloadReport('xlsx')}
                    className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 flex items-center gap-3 rounded-b-lg"
                  >
                    <FileText className="w-4 h-4 text-green-400" />
                    <span>Excel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Power BI Embed Container */}
        <div className="max-w-[1800px] mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Demo Data Visualization - En production, utiliser Power BI Embed */}
            <div className="relative" style={{ height: 'calc(100vh - 400px)', minHeight: '600px' }}>
              {/* Header Badge */}
              <div className="absolute top-4 left-4 z-10 bg-blue-600/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <Eye className="w-4 h-4 text-white" />
                <span className="text-white font-semibold">Vue en direct</span>
              </div>

              {/* Iframe Power BI */}
              <iframe
                title={currentReport.title}
                width="100%"
                height="100%"
                src={currentReport.embedUrl}
                frameBorder="0"
                allowFullScreen={true}
                className="w-full h-full"
              />

              {/* Fallback si pas de compte Power BI */}
              {/* <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-900 to-slate-800">
                <BarChart3 className="w-24 h-24 text-blue-500 mb-6 animate-pulse" />
                <h2 className="text-2xl font-bold text-white mb-3">Rapport {currentReport.title}</h2>
                <p className="text-slate-400 mb-8 text-center max-w-md">
                  Visualisation interactive Power BI en cours de chargement...
                </p>
                <div className="grid grid-cols-3 gap-8 w-full max-w-4xl px-12">
                  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">94%</div>
                    <div className="text-sm text-slate-400">Taux de succès</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">42</div>
                    <div className="text-sm text-slate-400">Projets actifs</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">12.1M€</div>
                    <div className="text-sm text-slate-400">Budget total</div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Données actualisées</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Dernière synchronisation : Il y a 5 minutes
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Accès partagé</h3>
              </div>
              <p className="text-slate-400 text-sm">
                15 membres de l'équipe peuvent accéder à ce rapport
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Rafraîchissement auto</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Les données sont actualisées toutes les heures
              </p>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
            <div className={`px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-sm ${
              toast.type === 'success' ? 'bg-green-900/90 border-green-500 text-green-100' :
              toast.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-100' :
              toast.type === 'warning' ? 'bg-orange-900/90 border-orange-500 text-orange-100' :
              'bg-blue-900/90 border-blue-500 text-blue-100'
            }`}>
              <div className="flex items-start gap-3 max-w-md">
                <div className="flex-1 whitespace-pre-line text-sm">{toast.message}</div>
                <button onClick={() => setToast(null)} className="text-white/70 hover:text-white">✕</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

