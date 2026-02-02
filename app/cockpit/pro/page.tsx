// ============================================================
// POWALYZE V2 — PRO HOME PAGE
// ============================================================

import { FolderKanban, AlertTriangle, FileText, TrendingUp, Plus, Zap } from 'lucide-react';
import Link from 'next/link';
import { getAllProjects } from '@/lib/data-v2';
import { requirePro } from '@/lib/auth-v2';

export default async function ProHomePage() {
  await requirePro();
  
  // Charger les vraies données
  const projects = await getAllProjects();
  const activeProjects = projects.filter(p => p.status === 'active');
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Votre Cockpit Exécutif Pro
        </h1>
        <p className="text-lg opacity-90">
          Pilotez votre portfolio en temps réel
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link
          href="/cockpit/pro/projets/nouveau"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium"
        >
          <Plus className="w-5 h-5" />
          Nouveau projet
        </Link>
        <Link
          href="/cockpit/pro/rapports"
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <Zap className="w-5 h-5" />
          Générer un rapport IA
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Projets actifs</p>
              <p className="text-3xl font-bold text-white mt-1">{activeProjects.length}</p>
            </div>
            <FolderKanban className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total projets</p>
              <p className="text-3xl font-bold text-white mt-1">{projects.length}</p>
            </div>
            <FolderKanban className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Risques critiques</p>
              <p className="text-3xl font-bold text-white mt-1">-</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Décisions en attente</p>
              <p className="text-3xl font-bold text-white mt-1">-</p>
            </div>
            <FileText className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>
      
      {/* Recent Projects or Empty State */}
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
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4">Projets récents</h2>
          <div className="space-y-3">
            {projects.slice(0, 5).map(project => (
              <Link
                key={project.id}
                href={`/cockpit/pro/projets/${project.id}`}
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    project.health === 'green' ? 'bg-green-500' :
                    project.health === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-white font-medium">{project.name}</p>
                    <p className="text-slate-400 text-sm">{project.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Progression</p>
                  <p className="text-white font-medium">{project.progress}%</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
