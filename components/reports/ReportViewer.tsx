'use client';

/**
 * MODULE RAPPORTS - Visionneuse de rapport complète
 */

import { Report, Priority, Severity } from '@/types/reports';
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Target,
  Download,
  Share2,
  BarChart3,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';

interface ReportViewerProps {
  report: Report;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function ReportViewer({ report, onDownload, onShare }: ReportViewerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'recommendations' | 'risks'>(
    'overview'
  );

  const priorityColors: Record<Priority, string> = {
    critical: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const severityColors: Record<Severity, string> = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200 mb-2">{report.file_name}</h1>
          <p className="text-sm text-slate-400">
            Créé le {new Date(report.created_at).toLocaleDateString('fr-FR')} · Version{' '}
            {report.version}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onShare && (
            <button
              onClick={onShare}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-300 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Partager
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </button>
          )}
        </div>
      </div>

      {/* Summary Card */}
      {report.summary && (
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-slate-200 mb-2">Résumé Exécutif</h2>
              <p className="text-slate-300 leading-relaxed">{report.summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Vue d'ensemble
          </button>
          {report.insights && report.insights.length > 0 && (
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'insights'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Insights ({report.insights.length})
              </span>
            </button>
          )}
          {report.recommendations && report.recommendations.length > 0 && (
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'recommendations'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Recommandations ({report.recommendations.length})
              </span>
            </button>
          )}
          {report.risks && report.risks.length > 0 && (
            <button
              onClick={() => setActiveTab('risks')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'risks'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Risques ({report.risks.length})
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stats */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Statistiques</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Insights</span>
                  <span className="font-medium text-slate-200">{report.insights?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Recommandations</span>
                  <span className="font-medium text-slate-200">
                    {report.recommendations?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Risques</span>
                  <span className="font-medium text-slate-200">{report.risks?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Décisions</span>
                  <span className="font-medium text-slate-200">{report.decisions?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Charts preview */}
            {report.charts && report.charts.length > 0 && (
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Graphiques</h3>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span>{report.charts.length} graphique(s) disponible(s)</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && report.insights && (
          <div className="space-y-3">
            {report.insights.map((insight, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-semibold text-slate-200">{insight.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium border ${
                      priorityColors[insight.priority]
                    }`}
                  >
                    {insight.priority === 'high' && 'Haute'}
                    {insight.priority === 'medium' && 'Moyenne'}
                    {insight.priority === 'low' && 'Basse'}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{insight.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && report.recommendations && (
          <div className="space-y-3">
            {report.recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {rec.actionable && <CheckCircle className="w-5 h-5 text-green-400" />}
                    <h3 className="text-base font-semibold text-slate-200">{rec.title}</h3>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium border ${
                      priorityColors[rec.priority]
                    }`}
                  >
                    {rec.priority === 'high' && 'Haute'}
                    {rec.priority === 'medium' && 'Moyenne'}
                    {rec.priority === 'low' && 'Basse'}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{rec.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'risks' && report.risks && (
          <div className="space-y-3">
            {report.risks.map((risk, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-semibold text-slate-200">{risk.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium border ${
                      severityColors[risk.severity]
                    }`}
                  >
                    {risk.severity === 'critical' && 'Critique'}
                    {risk.severity === 'high' && 'Élevée'}
                    {risk.severity === 'medium' && 'Moyenne'}
                    {risk.severity === 'low' && 'Basse'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{risk.description}</p>
                {risk.mitigation && (
                  <div className="mt-3 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                    <p className="text-xs font-medium text-blue-400 mb-1">Mitigation</p>
                    <p className="text-sm text-slate-300">{risk.mitigation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
