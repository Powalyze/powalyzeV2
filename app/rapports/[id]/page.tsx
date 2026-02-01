'use client';

/**
 * MODULE RAPPORTS - Page détails d'un rapport
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Report } from '@/types/reports';
import ReportViewer from '@/components/reports/ReportViewer';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/reports/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }

        const data = await response.json();
        setReport(data.report);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Impossible de charger le rapport');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [params.id, router]);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/reports/${params.id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download');
      }

      // Redirection automatique gérée par l'API
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error || 'Rapport introuvable'}</p>
            <Link
              href="/rapports"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Retour aux rapports
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/rapports"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux rapports
          </Link>
        </div>

        {/* Content */}
        <ReportViewer report={report} onDownload={handleDownload} />
      </div>
    </div>
  );
}
