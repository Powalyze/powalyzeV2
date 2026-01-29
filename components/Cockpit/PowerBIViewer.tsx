'use client';

import { useState } from 'react';
import { ExternalLink, Download, Play, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface PowerBIViewerProps {
  reportUrl?: string;
  embedUrl?: string;
}

export function PowerBIViewer({ reportUrl, embedUrl }: PowerBIViewerProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const handleDownloadDesktop = () => {
    window.open('https://www.microsoft.com/fr-fr/download/details.aspx?id=58494', '_blank');
    showToast('info', '📥 Téléchargement Power BI Desktop', 'Page de téléchargement ouverte');
  };

  const handleOpenInDesktop = () => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
      showToast('info', '🚀 Ouverture Power BI', 'Rapport ouvert dans une nouvelle fenêtre');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header avec liens */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 2h4v20H2V2zm6 8h4v12H8V10zm6-6h4v18h-4V4zm6 4h4v14h-4V8z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Power BI Dashboard</h3>
            <p className="text-sm text-slate-400">Visualisation en temps réel</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadDesktop}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg flex items-center gap-2 font-semibold transition-colors"
          >
            <Download size={16} />
            Télécharger Power BI Desktop
          </button>
          {reportUrl && (
            <button
              onClick={handleOpenInDesktop}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ExternalLink size={16} />
              Ouvrir
            </button>
          )}
        </div>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-blue-400 mb-1">Installation requise</p>
          <p className="text-slate-300">
            Pour visualiser et éditer vos rapports Power BI, vous devez installer{' '}
            <button onClick={handleDownloadDesktop} className="text-amber-400 hover:text-amber-300 underline">
              Power BI Desktop
            </button>
            {' '}(gratuit). Une fois installé, vous pourrez ouvrir vos fichiers .pbix directement.
          </p>
        </div>
      </div>

      {/* Viewer Frame */}
      {embedUrl ? (
        <div className="relative bg-slate-900 border border-slate-800 rounded-lg overflow-hidden" style={{ minHeight: '600px' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Chargement du rapport Power BI...</p>
              </div>
            </div>
          )}
          <iframe
            src={embedUrl}
            className="w-full h-full"
            style={{ minHeight: '600px' }}
            onLoad={() => setIsLoading(false)}
            allowFullScreen
            title="Power BI Report"
          />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center" style={{ minHeight: '600px' }}>
          <div className="max-w-md mx-auto">
            <Play size={64} className="mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold mb-2">Aucun rapport configuré</h3>
            <p className="text-slate-400 mb-6">
              Uploadez un fichier .pbix ou configurez une URL d'embed pour visualiser vos rapports Power BI ici.
            </p>
            <div className="space-y-3 text-sm text-slate-500 text-left">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">1.</span>
                <span>Créez votre rapport dans Power BI Desktop</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">2.</span>
                <span>Publiez-le sur Power BI Service (app.powerbi.com)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">3.</span>
                <span>Récupérez l'URL d'embed et configurez-la dans Powalyze</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4">
        <a
          href="https://app.powerbi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-lg text-center transition-colors group"
        >
          <ExternalLink size={24} className="mx-auto mb-2 text-slate-400 group-hover:text-amber-400" />
          <h4 className="text-sm font-semibold mb-1">Power BI Service</h4>
          <p className="text-xs text-slate-500">Gérer vos rapports en ligne</p>
        </a>

        <a
          href="https://learn.microsoft.com/fr-fr/power-bi/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-lg text-center transition-colors group"
        >
          <svg className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.86 0-7-3.14-7-7V8.5l7-3.5 7 3.5V13c0 3.86-3.14 7-7 7z"/>
          </svg>
          <h4 className="text-sm font-semibold mb-1">Documentation</h4>
          <p className="text-xs text-slate-500">Guides et tutoriels Microsoft</p>
        </a>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <Download size={24} className="mx-auto mb-2 text-slate-400" />
          <h4 className="text-sm font-semibold mb-1">Fichiers .pbix</h4>
          <p className="text-xs text-slate-500">Uploadez vos rapports ci-dessus</p>
        </div>
      </div>
    </div>
  );
}
