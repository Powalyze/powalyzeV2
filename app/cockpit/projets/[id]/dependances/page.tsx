'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Link2, Plus, Trash2, AlertTriangle, ArrowRight } from 'lucide-react';

interface Dependency {
  id: string;
  project_id: string;
  depends_on_project_id: string;
  depends_on_name: string;
  type: 'FS' | 'SS' | 'FF' | 'SF';
  description: string;
}

interface Project {
  id: string;
  name: string;
}

const DEPENDENCY_TYPES = {
  FS: 'Finish-to-Start',
  SS: 'Start-to-Start',
  FF: 'Finish-to-Finish',
  SF: 'Start-to-Finish'
};

export default function DependancesPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const supabase = createClient();

  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadDependencies();
    }
  }, [projectId]);

  const loadDependencies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, plan')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      const demo = profile.plan === 'demo';
      setIsDemo(demo);

      // Récupérer le projet courant
      const { data: currentProject } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single();

      if (currentProject) {
        setProjectName(currentProject.name);
      }

      // Récupérer dépendances
      const { data: depsData } = await supabase
        .from('project_dependencies')
        .select(`
          id,
          project_id,
          depends_on_project_id,
          type,
          description,
          projects!project_dependencies_depends_on_project_id_fkey(name)
        `)
        .eq('project_id', projectId)
        .eq('organization_id', profile.organization_id);

      if (depsData) {
        const enriched = depsData.map((d: any) => ({
          id: d.id,
          project_id: d.project_id,
          depends_on_project_id: d.depends_on_project_id,
          depends_on_name: (d.projects as any)?.name || 'Unknown',
          type: d.type as 'FS' | 'SS' | 'FF' | 'SF',
          description: d.description || ''
        }));
        setDependencies(enriched);
      }

      // Récupérer projets disponibles
      const { data: projectsData } = await supabase
        .from('projects')
        .select('id, name')
        .eq('organization_id', profile.organization_id)
        .neq('id', projectId);

      if (projectsData) {
        setAvailableProjects(projectsData);
      }
    } catch (error) {
      console.error('Error loading dependencies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0F1C]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#1a1f35] to-[#0A0F1C] text-white p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Dépendances Inter-Projets
            </h1>
            <p className="text-gray-400">
              {projectName}
            </p>
          </div>
          {isDemo && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Link2 className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Mode Démo</span>
            </div>
          )}
        </div>

        {/* Bouton Ajouter */}
        <button
          onClick={() => setShowAddModal(true)}
          disabled={isDemo}
          className={`
            px-6 py-3 rounded-xl font-medium flex items-center gap-2
            ${isDemo 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0A0F1C] hover:shadow-lg hover:shadow-[#D4AF37]/50'
            }
            transition-all duration-300
          `}
        >
          <Plus className="w-5 h-5" />
          {isDemo ? 'Ajouter une dépendance (Pro)' : 'Ajouter une dépendance'}
        </button>
      </div>

      {/* Liste des dépendances */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl overflow-hidden">
          {dependencies.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <Link2 className="w-16 h-16 mx-auto mb-4 text-gray-700" />
              <p className="text-lg font-medium mb-2">Aucune dépendance</p>
              <p className="text-sm">
                {isDemo 
                  ? "Mode Démo : Les dépendances sont des exemples"
                  : "Ce projet n'a pas encore de dépendances"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {dependencies.map((dep) => (
                <div key={dep.id} className="p-6 hover:bg-[#1a1f35]/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg">
                          <span className="text-[#D4AF37] text-sm font-medium">
                            {DEPENDENCY_TYPES[dep.type]}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-500" />
                        <span className="text-white font-semibold">
                          {dep.depends_on_name}
                        </span>
                      </div>
                      {dep.description && (
                        <p className="text-gray-400 text-sm ml-2">
                          {dep.description}
                        </p>
                      )}
                    </div>
                    {!isDemo && (
                      <button
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Légende types */}
        <div className="mt-6 p-6 bg-[#1a1f35]/50 border border-gray-800 rounded-xl">
          <h3 className="text-white font-semibold mb-4">Types de Dépendances</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#D4AF37] font-medium">FS (Finish-to-Start)</span>
              <p className="text-gray-400">Le projet dépend doit finir avant que celui-ci commence</p>
            </div>
            <div>
              <span className="text-[#D4AF37] font-medium">SS (Start-to-Start)</span>
              <p className="text-gray-400">Les deux projets doivent commencer en même temps</p>
            </div>
            <div>
              <span className="text-[#D4AF37] font-medium">FF (Finish-to-Finish)</span>
              <p className="text-gray-400">Les deux projets doivent finir en même temps</p>
            </div>
            <div>
              <span className="text-[#D4AF37] font-medium">SF (Start-to-Finish)</span>
              <p className="text-gray-400">Le projet dépend doit commencer avant que celui-ci finisse</p>
            </div>
          </div>
        </div>

        {/* Mode Demo info */}
        {isDemo && (
          <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-blue-400 font-semibold mb-2">Mode Démo — Dépendances en lecture seule</p>
                <ul className="text-blue-300/80 text-sm space-y-1">
                  <li>• Dépendances fictives pour démonstration</li>
                  <li>• Ajout/modification/suppression désactivés</li>
                  <li>• Alertes automatiques désactivées</li>
                  <li>• Passez en Pro pour gérer vos vraies dépendances</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
