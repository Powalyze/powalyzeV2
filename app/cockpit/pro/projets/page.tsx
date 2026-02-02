// ============================================================
// POWALYZE V2 — PRO PROJETS PAGE
// ============================================================

import { FolderKanban, Plus } from 'lucide-react';
import Link from 'next/link';
import { getAllProjects } from '@/lib/data-v2';
import { requirePro } from '@/lib/auth-v2';

export default async function ProProjetsPage() {
  await requirePro();
  
  const projects = await getAllProjects();
  const activeProjects = projects.filter(p => p.status === 'active');
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mes Projets</h1>
          <p className="text-slate-400 mt-1">{projects.length} projet{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/cockpit/pro/projets/nouveau"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium"
        >
          <Plus className="w-5 h-5" />
          Nouveau projet
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{projects.length}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Actifs</p>
          <p className="text-2xl font-bold text-green-500">{activeProjects.length}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Santé Verte</p>
          <p className="text-2xl font-bold text-green-500">
            {projects.filter(p => p.health === 'green').length}
          </p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Attention</p>
          <p className="text-2xl font-bold text-red-500">
            {projects.filter(p => p.health === 'red').length}
          </p>
        </div>
      </div>
      
      {/* Projects List or Empty State */}
      {projects.length === 0 ? (
        <div className="bg-slate-900 rounded-lg p-12 border border-slate-800 text-center">
          <FolderKanban className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Aucun projet pour le moment
          </h3>
          <p className="text-slate-400 mb-6">
            Créez votre premier projet pour commencer à piloter votre portfolio
          </p>
          <Link
            href="/cockpit/pro/projets/nouveau"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-3 rounded-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            Créer mon premier projet
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Projet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Santé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Progression</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Échéance</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map(project => (
                <tr key={project.id} className="hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FolderKanban className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">{project.name}</p>
                        <p className="text-slate-400 text-sm">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      project.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                      project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      project.status === 'on-hold' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {project.status === 'active' ? 'Actif' :
                       project.status === 'completed' ? 'Terminé' :
                       project.status === 'on-hold' ? 'En pause' : 'Annulé'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        project.health === 'green' ? 'bg-green-500' :
                        project.health === 'yellow' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-slate-300 text-sm capitalize">{project.health}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden max-w-[100px]">
                        <div
                          className="bg-amber-500 h-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-white text-sm font-medium w-12 text-right">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{project.budget?.toLocaleString('fr-FR')} €</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300">{project.deadline}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/cockpit/pro/projets/${project.id}`}
                      className="text-amber-500 hover:text-amber-400 text-sm font-medium"
                    >
                      Voir détails →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
