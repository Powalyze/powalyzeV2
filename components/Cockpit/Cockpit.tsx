'use client';

import { useState, useEffect } from 'react';
import { useCockpit } from '@/components/providers/CockpitProvider';
import { EmptyStateLive } from './EmptyStateLive';
import { CockpitShell } from './CockpitShell';
import { CockpitDashboard } from './CockpitDashboard';
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
  const { getItems, addItem, refreshCount } = useCockpit();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Charger les projets au montage
  useEffect(() => {
    if (!isInitialized) {
      const storedProjects = getItems('projects');
      
      // MODE DEMO: Créer des projets démo si vide
      if (mode === 'demo' && storedProjects.length === 0) {
        const demoProjects: Project[] = [
          {
            id: 'demo-1',
            name: 'Transformation Digitale',
            description: 'Migration vers le cloud et modernisation des applications',
            status: 'active',
            budget: 500000,
            progress: 65,
            startDate: '2024-01-15',
            endDate: '2024-12-31',
            team: ['Alice Martin', 'Bob Durant', 'Claire Dubois'],
            risks: 3,
            tasks: 45,
            created_at: new Date().toISOString()
          },
          {
            id: 'demo-2',
            name: 'Refonte Site Web',
            description: 'Nouvelle plateforme e-commerce et expérience utilisateur',
            status: 'active',
            budget: 150000,
            progress: 40,
            startDate: '2024-02-01',
            endDate: '2024-06-30',
            team: ['David Leroy', 'Emma Rousseau'],
            risks: 2,
            tasks: 28,
            created_at: new Date().toISOString()
          },
          {
            id: 'demo-3',
            name: 'CRM Implementation',
            description: 'Déploiement Salesforce et formation des équipes',
            status: 'pending',
            budget: 200000,
            progress: 15,
            startDate: '2024-03-01',
            endDate: '2024-09-30',
            team: ['François Bernard'],
            risks: 5,
            tasks: 32,
            created_at: new Date().toISOString()
          }
        ];

        demoProjects.forEach(project => addItem('projects', project));
        setProjects(demoProjects);
      } else {
        // MODE LIVE ou projets existants
        setProjects(storedProjects);
      }

      setIsInitialized(true);
      setIsLoading(false);
    }
  }, [mode, isInitialized, getItems, addItem]);

  // Re-charger les projets quand refreshCount change
  useEffect(() => {
    if (isInitialized) {
      setProjects(getItems('projects'));
    }
  }, [refreshCount, isInitialized, getItems]);

  const handleCreateProject = () => {
    setShowNewProjectModal(true);
  };

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

  // MODE LIVE: Empty state si aucun projet
  if (mode === 'live' && projects.length === 0) {
    return <EmptyStateLive onCreateProject={handleCreateProject} />;
  }

  // Afficher le cockpit complet
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
