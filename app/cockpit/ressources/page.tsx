'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Users, AlertTriangle, TrendingUp, Plus, Trash2 } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  role: string;
  fte_available: number;
  team: string;
  is_demo: boolean;
}

interface Allocation {
  id: string;
  resource_id: string;
  project_id: string;
  project_name: string;
  fte: number;
}

interface ResourceWithLoad extends Resource {
  allocated_fte: number;
  load: number;
  projects: Allocation[];
}

export default function RessourcesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [resources, setResources] = useState<ResourceWithLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Récupérer profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, plan')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      const demo = profile.plan === 'demo';
      setIsDemo(demo);

      // Récupérer ressources
      const { data: resourcesData } = await supabase
        .from('resources')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('name');

      if (!resourcesData || resourcesData.length === 0) {
        setResources([]);
        setLoading(false);
        return;
      }

      // Récupérer allocations
      const { data: allocations } = await supabase
        .from('resource_allocations')
        .select(`
          id,
          resource_id,
          project_id,
          fte,
          projects(name)
        `)
        .eq('organization_id', profile.organization_id);

      // Calculer charge pour chaque ressource
      const enriched = resourcesData.map((resource: any) => {
        const resourceAllocations = allocations?.filter((a: any) => a.resource_id === resource.id) || [];
        const allocated_fte = resourceAllocations.reduce((sum: number, a: any) => sum + a.fte, 0);
        const load = (allocated_fte / resource.fte_available) * 100;

        const projects = resourceAllocations.map((a: any) => ({
          id: a.id,
          resource_id: a.resource_id,
          project_id: a.project_id,
          project_name: (a.projects as any)?.name || 'Unknown',
          fte: a.fte
        }));

        return {
          ...resource,
          allocated_fte,
          load,
          projects
        };
      });

      setResources(enriched);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLoadColor = (load: number) => {
    if (load > 100) return 'text-red-500';
    if (load > 80) return 'text-amber-500';
    return 'text-green-500';
  };

  const getLoadBgColor = (load: number) => {
    if (load > 100) return 'bg-red-500/10';
    if (load > 80) return 'bg-amber-500/10';
    return 'bg-green-500/10';
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
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Gestion des Ressources
            </h1>
            <p className="text-gray-400">
              Allocation FTE et charge des équipes
            </p>
          </div>
          {isDemo && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Mode Démo</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Ressources</p>
              <p className="text-3xl font-bold text-white">{resources.length}</p>
            </div>
            <Users className="w-10 h-10 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">FTE Total</p>
              <p className="text-3xl font-bold text-white">
                {resources.reduce((sum, r) => sum + r.fte_available, 0).toFixed(1)}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-[#3DD68C]" />
          </div>
        </div>

        <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Sur-allocations</p>
              <p className="text-3xl font-bold text-red-500">
                {resources.filter(r => r.load > 100).length}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tableau des ressources */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0A0F1C]/50">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Nom</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Rôle</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Équipe</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-medium">FTE Dispo</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-medium">FTE Alloué</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-medium">Charge</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Projets</th>
                </tr>
              </thead>
              <tbody>
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                      <p className="text-lg font-medium mb-2">Aucune ressource</p>
                      <p className="text-sm">
                        {isDemo 
                          ? "Mode Démo : Les ressources sont des exemples"
                          : "Commencez par ajouter vos premières ressources"
                        }
                      </p>
                    </td>
                  </tr>
                ) : (
                  resources.map((resource) => (
                    <tr key={resource.id} className="border-t border-gray-800 hover:bg-[#1a1f35]/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                            <span className="text-[#D4AF37] text-sm font-medium">
                              {resource.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-white">{resource.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{resource.role}</td>
                      <td className="px-6 py-4 text-gray-300">{resource.team}</td>
                      <td className="px-6 py-4 text-right text-white font-medium">
                        {resource.fte_available.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 text-right text-white font-medium">
                        {resource.allocated_fte.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getLoadBgColor(resource.load)}`}>
                          <span className={`font-bold ${getLoadColor(resource.load)}`}>
                            {resource.load.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {resource.projects.map((project, idx) => (
                            <div
                              key={idx}
                              className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-xs text-[#D4AF37]"
                            >
                              {project.project_name} ({(project.fte * 100).toFixed(0)}%)
                            </div>
                          ))}
                          {resource.projects.length === 0 && (
                            <span className="text-gray-500 text-sm">Non alloué</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mode Demo info */}
        {isDemo && (
          <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-blue-400 font-semibold mb-2">Mode Démo — Fonctionnalités limitées</p>
                <ul className="text-blue-300/80 text-sm space-y-1">
                  <li>• Ressources fictives pour démonstration</li>
                  <li>• Drag & drop désactivé (disponible en Pro)</li>
                  <li>• Ajout/modification/suppression désactivés</li>
                  <li>• Passez en Pro pour gérer vos vraies équipes</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
