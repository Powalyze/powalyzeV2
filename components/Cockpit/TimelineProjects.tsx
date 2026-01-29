'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProjectTimeline {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  completion_percentage: number;
  rag_status: 'GREEN' | 'YELLOW' | 'RED';
}

export default function TimelineProjects() {
  const [projects, setProjects] = useState<ProjectTimeline[]>([]);

  useEffect(() => {
    // Temporairement désactivé pour éviter l'erreur de fetch
    // Les données seront chargées après l'authentification complète
    setProjects([]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GREEN': return 'bg-status-green';
      case 'YELLOW': return 'bg-status-yellow';
      case 'RED': return 'bg-status-red';
      default: return 'bg-status-gray';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4">Timeline Projets</h2>
      
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(project.rag_status)}`} />
                <span className="text-white font-medium">{project.name}</span>
              </div>
              <span className="text-white/60 text-sm">
                {project.completion_percentage}%
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span>{format(new Date(project.start_date), 'dd MMM yyyy', { locale: fr })}</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStatusColor(project.rag_status)} transition-all`}
                  style={{ width: `${project.completion_percentage}%` }}
                />
              </div>
              <span>{format(new Date(project.end_date), 'dd MMM yyyy', { locale: fr })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
