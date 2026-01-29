'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models, Report, Embed, service } from 'powerbi-client';
import { 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Filter, 
  Layers, 
  Download,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface PowerBIViewerProps {
  reportId: string;
  embedUrl: string;
  embedToken: string;
  reportName?: string;
  onError?: (error: Error) => void;
  onLoad?: (report: Report) => void;
}

export default function PowerBIViewer({
  reportId,
  embedUrl,
  embedToken,
  reportName = 'Power BI Report',
  onError,
  onLoad
}: PowerBIViewerProps) {
  const [report, setReport] = useState<Report | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showPageNav, setShowPageNav] = useState(true);
  const [currentPage, setCurrentPage] = useState<string>('');
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configuration de l'embed Power BI
  const embedConfig: models.IReportEmbedConfiguration = {
    type: 'report',
    id: reportId,
    embedUrl: embedUrl,
    accessToken: embedToken,
    tokenType: models.TokenType.Embed,
    permissions: models.Permissions.All,
    viewMode: models.ViewMode.View,
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: showFilters
        },
        pageNavigation: {
          visible: showPageNav,
          position: models.PageNavigationPosition.Left
        }
      },
      background: models.BackgroundType.Transparent,
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToWidth
      },
      bars: {
        actionBar: {
          visible: true
        },
        statusBar: {
          visible: true
        }
      },
      navContentPaneEnabled: showPageNav,
      filterPaneEnabled: showFilters
    }
  };

  // Callback quand le rapport est chargé
  const handleReportLoad = useCallback(async (event: any) => {
    setIsLoading(false);
    const embedReport = event?.detail?.report || event?.report;
    if (!embedReport) return;
    
    const loadedReport = embedReport as Report;
    setReport(loadedReport);

    try {
      // Récupérer les pages du rapport
      const reportPages = await loadedReport.getPages();
      setPages(reportPages);

      // Récupérer la page active
      const activePage = reportPages.find((page: any) => page.isActive);
      if (activePage) {
        setCurrentPage(activePage.displayName);
      }

      if (onLoad) {
        onLoad(loadedReport);
      }

      console.log('✅ Power BI Report loaded:', reportName);
    } catch (err) {
      console.error('Error loading report pages:', err);
      setError('Erreur lors du chargement des pages du rapport');
      if (onError) {
        onError(err as Error);
      }
    }
  }, [reportName, onLoad, onError]);

  // Callback en cas d'erreur
  const handleReportError = useCallback((event?: any) => {
    setIsLoading(false);
    const errorMessage = event?.message || 'Erreur inconnue lors du chargement du rapport';
    setError(errorMessage);
    console.error('❌ Power BI Error:', event);
    if (onError && event) {
      onError(new Error(errorMessage));
    }
  }, [onError]);

  // Rafraîchir le rapport
  const handleRefresh = async () => {
    if (!report) return;

    setIsRefreshing(true);
    try {
      await report.refresh();
      console.log('✅ Report refreshed');
    } catch (err) {
      console.error('Error refreshing report:', err);
      setError('Erreur lors du rafraîchissement');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Basculer plein écran
  const toggleFullscreen = () => {
    if (!report) return;

    if (!isFullscreen) {
      report.fullscreen();
    } else {
      report.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Basculer filtres
  const toggleFilters = async () => {
    if (!report) return;

    try {
      const newState = !showFilters;
      await report.updateSettings({
        panes: {
          filters: {
            visible: newState
          }
        }
      });
      setShowFilters(newState);
    } catch (err) {
      console.error('Error toggling filters:', err);
    }
  };

  // Basculer navigation des pages
  const togglePageNav = async () => {
    if (!report) return;

    try {
      const newState = !showPageNav;
      await report.updateSettings({
        panes: {
          pageNavigation: {
            visible: newState
          }
        }
      });
      setShowPageNav(newState);
    } catch (err) {
      console.error('Error toggling page navigation:', err);
    }
  };

  // Exporter le rapport en PDF
  const handleExport = async () => {
    if (!report) return;

    try {
      await report.print();
      console.log('✅ Report exported');
    } catch (err) {
      console.error('Error exporting report:', err);
      setError('Erreur lors de l\'export');
    }
  };

  // Écouter les événements de changement de page
  useEffect(() => {
    if (!report) return;

    const handlePageChange = async (event: any) => {
      try {
        const newPage = event.detail.newPage;
        setCurrentPage(newPage.displayName);
        console.log('📄 Page changed to:', newPage.displayName);
      } catch (err) {
        console.error('Error handling page change:', err);
      }
    };

    report.on('pageChanged', handlePageChange);

    return () => {
      report.off('pageChanged', handlePageChange);
    };
  }, [report]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900">{reportName}</h3>
          {currentPage && (
            <span className="text-sm text-gray-500">
              • {currentPage}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Bouton Rafraîchir */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="p-2 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-5 h-5 text-gray-700 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Bouton Filtres */}
          <button
            onClick={toggleFilters}
            disabled={isLoading}
            className={`p-2 hover:bg-gray-200 rounded-lg transition ${showFilters ? 'bg-blue-100' : ''}`}
            title="Afficher/Masquer les filtres"
          >
            <Filter className="w-5 h-5 text-gray-700" />
          </button>

          {/* Bouton Navigation des pages */}
          <button
            onClick={togglePageNav}
            disabled={isLoading}
            className={`p-2 hover:bg-gray-200 rounded-lg transition ${showPageNav ? 'bg-blue-100' : ''}`}
            title="Afficher/Masquer la navigation"
          >
            <Layers className="w-5 h-5 text-gray-700" />
          </button>

          {/* Bouton Exporter */}
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
            title="Exporter en PDF"
          >
            <Download className="w-5 h-5 text-gray-700" />
          </button>

          {/* Bouton Plein écran */}
          <button
            onClick={toggleFullscreen}
            disabled={isLoading}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-gray-700" />
            ) : (
              <Maximize2 className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Chargement du rapport...</p>
          </div>
        </div>
      )}

      {/* Power BI Embed */}
      <div className="flex-1 relative">
        <PowerBIEmbed
          embedConfig={embedConfig}
          eventHandlers={
            new Map([
              ['loaded', handleReportLoad],
              ['error', handleReportError],
              ['rendered', () => {
                console.log('✅ Report rendered');
                setIsLoading(false);
              }]
            ])
          }
          cssClassName="w-full h-full"
          getEmbeddedComponent={(embedObject: Embed) => {
            console.log('📊 Power BI component embedded');
          }}
        />
      </div>

      {/* Info badge - nombre de pages */}
      {pages.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
          {pages.length} {pages.length === 1 ? 'page' : 'pages'}
        </div>
      )}
    </div>
  );
}
