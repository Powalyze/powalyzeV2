"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FolderKanban, TrendingUp, AlertTriangle, DollarSign, Calendar, Users, X, Clock, CheckCircle2, Target } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  letter: string;
  status: 'En cours' | 'Attention' | 'Bloqué';
  description: string;
  budget: string;
  progress: number;
  team: number;
  startDate: string;
  endDate: string;
  manager: string;
  risks: string[];
  milestones: { name: string; date: string; completed: boolean }[];
}

export default function PortfoliePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const projects: Project[] = Array.from({ length: 6 }).map((_, i) => ({
    id: `project-${i}`,
    name: `Projet ${String.fromCharCode(65 + i)}`,
    letter: String.fromCharCode(65 + i),
    status: i % 3 === 0 ? 'En cours' : i % 3 === 1 ? 'Attention' : 'Bloqué',
    description: 'Description détaillée du projet et objectifs principaux à atteindre pour ce trimestre',
    budget: `${(Math.random() * 2 + 0.5).toFixed(1)}M€`,
    progress: Math.floor(Math.random() * 60 + 20),
    team: Math.floor(Math.random() * 10 + 3),
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    manager: ['Sophie Martin', 'Thomas Dubois', 'Marie Laurent', 'Jean Dupont', 'Claire Bernard', 'Luc Moreau'][i],
    risks: [
      'Risque de dépassement budgétaire de 8%',
      'Dépendance externe sur fournisseur X',
      'Ressources limitées en période de pointe'
    ],
    milestones: [
      { name: 'Phase de conception', date: '2024-03-01', completed: true },
      { name: 'Développement MVP', date: '2024-06-15', completed: true },
      { name: 'Tests utilisateurs', date: '2024-09-30', completed: false },
      { name: 'Déploiement production', date: '2024-12-15', completed: false }
    ]
  }));
  
  useEffect(() => {
    // Vérifier l'authentification
    const auth = localStorage.getItem('powalyze_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/login?redirect=/portefeuille&message=Veuillez vous connecter pour accéder au portefeuille');
    }
    setIsLoading(false);
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/cockpit" className="text-amber-400 hover:text-amber-300 mb-4 inline-block">
            ← Retour au Cockpit
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Portefeuille de Projets</h1>
          <p className="text-slate-400">Vue d&apos;ensemble de vos 42 projets actifs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div 
              key={project.id} 
              onClick={() => setSelectedProject(project)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <FolderKanban className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'En cours' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'Attention' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {project.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{project.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{project.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Budget</span>
                  <span className="text-white font-semibold">{project.budget}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Avancement</span>
                  <span className="text-white font-semibold">{project.progress}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Équipe</span>
                  <span className="text-white font-semibold">{project.team} membres</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <button className="w-full text-center text-sm text-amber-400 hover:text-amber-300 transition-colors">
                  Voir les détails →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de détail du projet */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-amber-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h2>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedProject.status === 'En cours' ? 'bg-green-500/20 text-green-400' :
                    selectedProject.status === 'Attention' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedProject.status}
                  </span>
                  <span className="text-slate-400 text-sm">Manager: {selectedProject.manager}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-6">
              {/* Informations générales */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Informations Générales
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Budget Total</span>
                      <span className="text-white font-semibold">{selectedProject.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avancement</span>
                      <span className="text-white font-semibold">{selectedProject.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Équipe</span>
                      <span className="text-white font-semibold">{selectedProject.team} membres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Début</span>
                      <span className="text-white font-semibold">{new Date(selectedProject.startDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fin prévue</span>
                      <span className="text-white font-semibold">{new Date(selectedProject.endDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                {/* Progression */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Progression
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Avancement global</span>
                        <span className="text-white font-semibold">{selectedProject.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-600 to-emerald-500 h-full transition-all duration-500"
                          style={{ width: `${selectedProject.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4">{selectedProject.description}</p>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Jalons du Projet
                </h3>
                <div className="space-y-3">
                  {selectedProject.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.completed ? 'bg-green-500/20' : 'bg-slate-700'
                      }`}>
                        {milestone.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <Clock className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${milestone.completed ? 'text-green-400' : 'text-white'}`}>
                          {milestone.name}
                        </p>
                        <p className="text-xs text-slate-400">{new Date(milestone.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risques */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-red-500/30">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Risques Identifiés
                </h3>
                <div className="space-y-2">
                  {selectedProject.risks.map((risk, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-300">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:shadow-xl hover:scale-105 transition-all">
                  Éditer le projet
                </button>
                <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:shadow-xl hover:scale-105 transition-all">
                  Exporter le rapport
                </button>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="px-6 bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-600 transition-all">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
