'use client';

import { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { EmptyStateLive } from './EmptyStateLive';
import { CockpitShell } from './CockpitShell';
import { CockpitDashboard } from './CockpitDashboard';
import { CockpitMobile } from './CockpitMobile';
import { useToast } from '@/components/ui/ToastProvider';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface Project {
  id: string;
  name: string;
  description?: string;
  status?: 'active' | 'pending' | 'completed' | 'blocked';
  budget?: number;
  progress?: number;
  startDate?: string;
  endDate?: string;
  team?: string[];
  risks?: number;
  tasks?: number;
  created_at?: string;
}

interface CockpitProps {
  mode: 'demo' | 'live';
}

export function Cockpit({ mode }: CockpitProps) {
  const { projects, isLoading, error, createProject, refetch } = useProjects({ mode });
  const { showToast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleCreateProject = async (data: import('./CreateProjectModal').ProjectFormData) => {
    try {
      await createProject(data);
      showToast('success', '✅ Projet créé', 'Votre projet est prêt');
      refetch();
    } catch (err) {
      showToast('error', 'Erreur', 'Impossible de créer le projet');
    }
  };

  // Show error if any
  useEffect(() => {
    if (error) {
      showToast('error', 'Erreur', error);
    }
  }, [error, showToast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Chargement du cockpit...</p>
        </div>
      </div>
    );
  }

  // MODE LIVE + MOBILE: Layout mobile dédié
  if (mode === 'live' && isMobile) {
    return (
      <CockpitMobile 
        mode={mode}
        projects={projects}
        onCreateProject={handleCreateProject}
      />
    );
  }

  // MODE LIVE: Empty state si aucun projet
  if (mode === 'live' && projects.length === 0) {
    return <EmptyStateLive onCreateProject={handleCreateProject} />;
  }

  // Afficher le cockpit complet (desktop)
  return (
    <CockpitShell>
      <CockpitDashboard 
        mode={mode}
        projects={projects}
        isMobile={isMobile}
        onCreateProject={handleCreateProject}
      />
      
      {/* Badge de mode en bas à droite (développement uniquement) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 rounded-full bg-gray-900 px-3 py-1 text-xs text-white shadow-lg">
          Mode: {mode.toUpperCase()} {isMobile && mode === 'live' && '📱'}
        </div>
      )}
    </CockpitShell>
  );
}
