'use client';

/**
 * MODULE RAPPORTS - Page liste de tous les rapports
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Report } from '@/types/reports';
import FileUploadZone from '@/components/reports/FileUploadZone';
import ReportCard from '@/components/reports/ReportCard';
import { Loader2, FileText, Upload, Filter } from 'lucide-react';

export default function RapportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ready' | 'processing' | 'error'>('all');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  async function fetchReports() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const url =
        filter === 'all'
          ? '/api/reports'
          : `/api/reports?status=${filter}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFilesSelected(files: File[]) {
    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Upload chaque fichier
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/reports', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          console.error(`Failed to upload ${file.name}`);
        }
      }

      // Rafraîchir la liste
      await fetchReports();
      setShowUpload(false);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }

  function handleView(reportId: string) {
    router.push(`/rapports/${reportId}`);
  }

  async function handleDownload(reportId: string) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/reports/${reportId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download');
      }

      // Redirection automatique
    } catch (err) {
      console.error('Download error:', err);
    }
  }

  const filteredReports =
    filter === 'all' ? reports : reports.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">Rapports</h1>
              <p className="text-slate-400">
                Importez et analysez vos documents avec l'IA
              </p>
            </div>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Nouveau rapport
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('ready')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === 'ready'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Prêts
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === 'processing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === 'error'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Erreurs
            </button>
          </div>
        </div>

        {/* Upload Zone */}
        {showUpload && (
          <div className="mb-8">
            <FileUploadZone
              onFilesSelected={handleFilesSelected}
              maxFiles={5}
              maxSizeMB={10}
            />
            {uploading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-blue-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Upload en cours...</span>
              </div>
            )}
          </div>
        )}

        {/* Reports Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 mb-4">Aucun rapport pour le moment</p>
            <button
              onClick={() => setShowUpload(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Importer votre premier document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onView={handleView}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
