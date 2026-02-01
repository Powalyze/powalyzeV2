'use client';

/**
 * MODULE RAPPORTS - Carte de rapport individuel
 */

import { Report } from '@/types/reports';
import { FileText, Calendar, User, Download, Eye, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface ReportCardProps {
  report: Report;
  onDownload?: (reportId: string) => void;
  onView?: (reportId: string) => void;
}

export default function ReportCard({ report, onDownload, onView }: ReportCardProps) {
  const statusColors = {
    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    ready: 'bg-green-500/10 text-green-400 border-green-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const fileTypeIcons: Record<string, string> = {
    pdf: '📄',
    excel: '📊',
    csv: '📈',
    word: '📝',
    powerpoint: '📽️',
    json: '🔧',
    image: '🖼️',
    text: '📃',
  };

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-3xl">{fileTypeIcons[report.file_type] || '📄'}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-200 truncate mb-1">
              {report.file_name}
            </h3>
            <p className="text-xs text-slate-500">
              {(report.file_size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>

        <div
          className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[report.status]}`}
        >
          {report.status === 'processing' && 'En cours'}
          {report.status === 'ready' && 'Prêt'}
          {report.status === 'error' && 'Erreur'}
        </div>
      </div>

      {/* Résumé */}
      {report.summary && (
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{report.summary}</p>
      )}

      {/* Insights count */}
      <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
        {report.insights && report.insights.length > 0 && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{report.insights.length} insights</span>
          </div>
        )}
        {report.recommendations && report.recommendations.length > 0 && (
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{report.recommendations.length} recommandations</span>
          </div>
        )}
        {report.risks && report.risks.length > 0 && (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>{report.risks.length} risques</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(report.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
          {report.version > 1 && (
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded">
                v{report.version}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {report.status === 'ready' && (
            <>
              {onView && (
                <button
                  onClick={() => onView(report.id)}
                  className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                  title="Voir le rapport"
                >
                  <Eye className="w-4 h-4 text-slate-400" />
                </button>
              )}
              {onDownload && (
                <button
                  onClick={() => onDownload(report.id)}
                  className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
