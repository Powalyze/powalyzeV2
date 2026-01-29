// app/cockpit/rapports/page.tsx
import { listReports, getReportEmbedConfig, importReport } from './actions';
import { PowerBIViewer } from '@/components/PowerBIViewer';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function RapportsPage({
  searchParams,
}: {
  searchParams: { projectId?: string; reportId?: string };
}) {
  const projectId = searchParams.projectId;
  const activeReportId = searchParams.reportId;

  const { reports } = await listReports(projectId);

  let embedConfig: {
    embedUrl: string;
    embedToken: string;
    reportId: string;
  } | null = null;

  if (activeReportId) {
    const cfg = await getReportEmbedConfig(activeReportId);
    if (!cfg.error && cfg.embedUrl && cfg.embedToken && cfg.reportId) {
      embedConfig = {
        embedUrl: cfg.embedUrl,
        embedToken: cfg.embedToken,
        reportId: cfg.reportId,
      };
    }
  }

  async function handleImport(formData: FormData) {
    'use server';
    const res = await importReport(formData);
    if (!res.error) {
      revalidatePath('/cockpit/rapports');
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Bouton retour */}
      <Link 
        href="/cockpit" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft size={18} />
        <span>Retour au cockpit</span>
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Rapports Power BI
          </h1>
          <p className="text-sm text-slate-400">
            Importez vos rapports .pbix et visualisez-les directement dans le
            cockpit.
          </p>
        </div>

        <form action={handleImport} className="flex items-center gap-2">
          <input type="hidden" name="projectId" value={projectId ?? ''} />
          <input
            type="text"
            name="reportName"
            placeholder="Nom du rapport"
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100"
            required
          />
          <input
            type="file"
            name="file"
            accept=".pbix"
            className="text-xs text-slate-300"
            required
          />
          <button
            type="submit"
            className="bg-amber-500 text-slate-950 text-sm font-medium px-3 py-1.5 rounded"
          >
            Importer .pbix
          </button>
        </form>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 space-y-2">
          <h2 className="text-sm font-medium text-slate-200">
            Rapports disponibles
          </h2>
          <div className="space-y-1">
            {reports.length === 0 && (
              <p className="text-xs text-slate-500">
                Aucun rapport importé pour le moment.
              </p>
            )}
            {reports.map((r: any) => (
              <a
                key={r.id}
                href={`/cockpit/rapports?projectId=${projectId ?? ''}&reportId=${
                  r.powerbi_report_id
                }`}
                className={`block px-3 py-2 rounded text-sm border ${
                  activeReportId === r.powerbi_report_id
                    ? 'bg-slate-800 border-amber-500 text-amber-200'
                    : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <div className="font-medium truncate">{r.report_name}</div>
                <div className="text-[11px] text-slate-500">
                  {r.created_at}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-3">
          {embedConfig ? (
            <PowerBIViewer
              embedUrl={embedConfig.embedUrl}
              embedToken={embedConfig.embedToken}
              reportId={embedConfig.reportId}
            />
          ) : (
            <div className="h-[70vh] rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-sm text-slate-500">
              Sélectionnez un rapport dans la liste ou importez un .pbix pour
              commencer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
