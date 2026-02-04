"use client";

import { useState, useRef } from "react";
import { Upload, Database, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";

export default function ConnecteursPage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ imported: number; projects: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/connectors/file', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors de l\'import');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-white">
            Connecteurs de données
          </h1>
          <p className="text-slate-400 mt-1">Importez vos données depuis Excel, CSV ou connecteurs SaaS</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Upload Zone */}
        <div className="mb-8 p-8 rounded-xl bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-amber-500/50 transition-all">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
              <Upload className="text-amber-400" size={32} />
            </div>
            <h2 className="text-xl font-bold text-zinc-50 mb-2">Import fichier CSV/Excel</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              Glissez-déposez votre fichier ou cliquez pour sélectionner.<br/>
              Format accepté : CSV avec colonnes Nom projet, Responsable, Statut, Budget, etc.
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload CSV or Excel file"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Import en cours...' : 'Sélectionner un fichier'}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="mb-8 p-6 rounded-xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-start gap-4">
              <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-bold text-green-400 mb-2">Import réussi</h3>
                <p className="text-slate-300 mb-4">{result.imported} projet(s) importé(s) avec succès</p>
                <div className="space-y-2">
                  {result.projects.slice(0, 3).map((p: any) => (
                    <div key={p.id} className="text-sm text-slate-400">
                      • {p.name} ({p.status})
                    </div>
                  ))}
                  {result.projects.length > 3 && (
                    <div className="text-sm text-slate-500">
                      ... et {result.projects.length - 3} autres projets
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-8 p-6 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-bold text-red-400 mb-2">Erreur d'import</h3>
                <p className="text-slate-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Connectors Status */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h2 className="text-xl font-bold text-zinc-50 mb-6">Connecteurs actifs</h2>
          
          <div className="space-y-4">
            {/* Mock connectors */}
            <ConnectorCard 
              name="Import fichier"
              type="file"
              status="active"
              lastSync={result ? new Date().toISOString() : null}
            />
            <ConnectorCard 
              name="Microsoft Project (à venir)"
              type="saas"
              status="coming_soon"
              lastSync={null}
            />
            <ConnectorCard 
              name="Jira (à venir)"
              type="saas"
              status="coming_soon"
              lastSync={null}
            />
            <ConnectorCard 
              name="Azure DevOps (à venir)"
              type="saas"
              status="coming_soon"
              lastSync={null}
            />
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-8 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-start gap-4">
            <FileText className="text-amber-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-bold text-zinc-50 mb-2">Format CSV attendu</h3>
              <p className="text-sm text-slate-400 mb-4">Colonnes reconnues automatiquement :</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-slate-300">Nom projet / Project Name</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-slate-300">Responsable / Owner</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-slate-300">Statut / Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-slate-300">Budget prévu / Planned Budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-slate-300">Budget consommé / Spent Budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-slate-300">Alignement / Alignment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectorCard({ name, type, status, lastSync }: { 
  name: string; 
  type: string; 
  status: string; 
  lastSync: string | null 
}) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', label: 'Actif' };
      case 'error':
        return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Erreur' };
      case 'coming_soon':
        return { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', label: 'Bientôt' };
      default:
        return { icon: Database, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', label: 'Inactif' };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg ${config.bg} border ${config.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className={config.color} size={20} />
          <div>
            <div className="font-medium text-zinc-50">{name}</div>
            <div className="text-xs text-slate-500">Type: {type}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastSync && (
            <div className="text-xs text-slate-400">
              Dernière synchro: {new Date(lastSync).toLocaleString()}
            </div>
          )}
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${config.bg} ${config.color} text-xs`}>
            <Icon size={12} />
            {config.label}
          </div>
        </div>
      </div>
    </div>
  );
}
