'use client';

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

interface CockpitDashboardProps {
  mode: 'demo' | 'live';
  projects: Project[];
  isMobile: boolean;
  onCreateProject: () => void;
}

export function CockpitDashboard({ mode, projects, isMobile, onCreateProject }: CockpitDashboardProps) {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'demo' ? 'Cockpit Démo' : 'Votre Cockpit'}
          </h1>
          <p className="text-gray-600">
            {projects.length} projet{projects.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onCreateProject}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Nouveau projet
        </button>
      </div>

      {/* Grid de projets */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    blocked: 'bg-red-100 text-red-800',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        {project.status && (
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[project.status]}`}>
            {project.status}
          </span>
        )}
      </div>
      
      {project.description && (
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{project.description}</p>
      )}
      
      {project.progress !== undefined && (
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-gray-600">Progression</span>
            <span className="font-medium text-gray-900">{project.progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200">
            <div 
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {project.tasks && <span>{project.tasks} tâches</span>}
        {project.risks && <span>{project.risks} risques</span>}
        {project.team && <span>{project.team.length} membres</span>}
      </div>
    </div>
  );
}
