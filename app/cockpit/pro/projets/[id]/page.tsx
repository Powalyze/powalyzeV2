// ============================================================
// POWALYZE V2 — PROJECT DETAILS PAGE
// ============================================================

import { ArrowLeft, Edit, Trash2, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';
import { getProjectById } from '@/lib/data-v2';
import { requirePro } from '@/lib/auth-v2';
import { notFound } from 'next/navigation';

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  await requirePro();
  
  const project = await getProjectById(params.id);
  
  if (!project) {
    notFound();
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/cockpit/pro/projets"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux projets
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            {project.description && (
              <p className="text-slate-400 mt-2">{project.description}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              href={`/cockpit/pro/projets/${project.id}/edit`}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
            >
              <Edit className="w-4 h-4" />
              Éditer
            </Link>
            <button className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg">
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <p className="text-slate-400 text-sm mb-2">Statut</p>
          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded ${
            project.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
            project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
            project.status === 'on-hold' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {project.status === 'active' ? 'Actif' :
             project.status === 'completed' ? 'Terminé' :
             project.status === 'on-hold' ? 'En pause' : 'Annulé'}
          </span>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <p className="text-slate-400 text-sm mb-2">Santé</p>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${
              project.health === 'green' ? 'bg-green-500' :
              project.health === 'yellow' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            <span className="text-white font-medium capitalize">{project.health}</span>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <p className="text-slate-400 text-sm mb-2">Progression</p>
          <p className="text-2xl font-bold text-white">{project.progress}%</p>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <p className="text-slate-400 text-sm mb-2">Budget</p>
          <p className="text-2xl font-bold text-white">
            {project.budget ? `${project.budget.toLocaleString('fr-FR')} €` : 'N/A'}
          </p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">Avancement</h3>
          <span className="text-slate-400 text-sm">{project.progress}% complété</span>
        </div>
        <div className="bg-slate-800 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        {project.deadline && (
          <p className="text-slate-400 text-sm mt-3">
            Échéance: {new Date(project.deadline).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>
      
      {/* Related Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href={`/cockpit/pro/risques?project=${project.id}`}
          className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-amber-500 transition-colors"
        >
          <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Risques</h3>
          <p className="text-slate-400 text-sm">
            Gérer les risques associés à ce projet
          </p>
        </Link>
        
        <Link
          href={`/cockpit/pro/decisions?project=${project.id}`}
          className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-amber-500 transition-colors"
        >
          <FileText className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Décisions</h3>
          <p className="text-slate-400 text-sm">
            Consulter les décisions liées au projet
          </p>
        </Link>
      </div>
      
      {/* Metadata */}
      <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">Informations</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400">ID</p>
            <p className="text-white font-mono">{project.id}</p>
          </div>
          <div>
            <p className="text-slate-400">Créé le</p>
            <p className="text-white">
              {project.created_at ? new Date(project.created_at).toLocaleDateString('fr-FR') : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Modifié le</p>
            <p className="text-white">
              {project.updated_at ? new Date(project.updated_at).toLocaleDateString('fr-FR') : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
