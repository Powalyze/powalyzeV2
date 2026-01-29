'use client';

import { useState, useEffect } from 'react';
import { supabaseDemo } from '@/lib/supabase/demoClient';
import { supabaseProd } from '@/lib/supabase/prodClient';

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
  organization_id?: string;
}

interface UseProjectsOptions {
  mode: 'demo' | 'live';
}

/**
 * Hook pour gérer les projets via Supabase
 * Utilise le client demo ou prod selon le mode
 */
export function useProjects({ mode }: UseProjectsOptions) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const client = mode === 'demo' ? supabaseDemo : supabaseProd;

  // Charger les projets
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // En mode DEMO: Utiliser localStorage comme fallback si Supabase vide
      if (mode === 'demo') {
        const { data, error: supabaseError } = await client
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.warn('[DEMO] Supabase error, using localStorage:', supabaseError);
          
          // Fallback: Projets démo en localStorage
          const storedProjects = localStorage.getItem('cockpit_projects');
          if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
          } else {
            // Créer des projets démo par défaut
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
            localStorage.setItem('cockpit_projects', JSON.stringify(demoProjects));
            setProjects(demoProjects);
          }
        } else {
          setProjects(data || []);
        }
      } else {
        // Mode LIVE: Supabase uniquement
        const { data, error: supabaseError } = await client
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          setError(supabaseError.message);
          console.error('[LIVE] Supabase error:', supabaseError);
          setProjects([]);
        } else {
          setProjects(data || []);
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching projects:', err);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Créer un projet
  const createProject = async (projectData: Partial<Project>) => {
    try {
      const newProject = {
        ...projectData,
        created_at: new Date().toISOString(),
        id: crypto.randomUUID(),
      };

      // Mode DEMO: localStorage
      if (mode === 'demo') {
        const updated = [...projects, newProject as Project];
        setProjects(updated);
        localStorage.setItem('cockpit_projects', JSON.stringify(updated));
        return { data: newProject, error: null };
      }

      // Mode LIVE: Supabase
      const { data, error } = await client
        .from('projects')
        .insert(newProject)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return { data: null, error };
      }

      setProjects([data, ...projects]);
      return { data, error: null };
    } catch (err: any) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  // Charger au montage
  useEffect(() => {
    fetchProjects();
  }, [mode]);

  return {
    projects,
    isLoading,
    error,
    createProject,
    refetch: fetchProjects
  };
}
