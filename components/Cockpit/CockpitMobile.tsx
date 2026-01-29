'use client';

import { useState } from 'react';
import { FolderKanban, Shield, CheckSquare, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCockpitCopy } from '@/lib/i18n/cockpit';
import { CreateProjectModal, ProjectFormData } from './CreateProjectModal';

interface Project {
  id: string;
  name: string;
  description?: string;
  status?: 'active' | 'pending' | 'completed' | 'blocked';
  progress?: number;
  risks?: number;
  tasks?: number;
}

interface CockpitMobileProps {
  mode: 'demo' | 'live';
  projects: Project[];
  onCreateProject?: (data: ProjectFormData) => Promise<void>;
  language?: 'fr' | 'en';
}

export function CockpitMobile({ mode, projects, onCreateProject, language = 'fr' }: CockpitMobileProps) {
  const pathname = usePathname();
  const copy = useCockpitCopy(language);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = async (data: ProjectFormData) => {
    if (onCreateProject) {
      await onCreateProject(data);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      {/* Header compact */}
      <header className="border-b border-slate-800 px-4 py-3">
        <h1 className="text-lg font-semibold">{copy.header.title}</h1>
        <p className="text-xs text-slate-400">
          {copy.header.subtitle}
        </p>
      </header>

      {/* Contenu principal scrollable */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{copy.mobileNav.projects}</h2>
          {onCreateProject && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all"
            >
              {copy.common.new}
            </button>
          )}
        </div>

        {/* Liste de projets en cartes */}
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectCardMobile key={project.id} project={project} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="mt-8 text-center text-slate-400">
            <p className="text-sm">{copy.emptyState.subtitle}</p>
          </div>
        )}
      </main>

      {/* Navigation en bas (Bottom Nav) */}
      <BottomNav currentPath={pathname} language={language} />

      {/* Modal création projet */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        language={language}
      />
    </div>
  );
}

function ProjectCardMobile({ project }: { project: Project }) {
  const copy = useCockpitCopy('fr');
  const statusColors = {
    active: 'bg-green-500/20 text-green-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-blue-500/20 text-blue-400',
    blocked: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 active:scale-98 transition-transform duration-150 cursor-pointer">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-semibold text-white">{project.name}</h3>
        {project.status && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>
            {project.status}
          </span>
        )}
      </div>
      
      {project.description && (
        <p className="mb-3 text-sm text-slate-400 line-clamp-2">{project.description}</p>
      )}
      
      {project.progress !== undefined && (
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-slate-400">{copy.projectCard.progress}</span>
            <span className="font-medium text-white">{project.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800">
            <div 
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-4 text-xs text-slate-500">
        {project.tasks && <span>{project.tasks} {copy.projectCard.tasks}</span>}
        {project.risks && <span>{project.risks} {copy.projectCard.risks}</span>}
      </div>
    </div>
  );
}

function BottomNav({ currentPath, language = 'fr' }: { currentPath: string; language?: 'fr' | 'en' }) {
  const copy = useCockpitCopy(language);
  const navItems = [
    { name: copy.mobileNav.projects, href: '/cockpit', icon: FolderKanban },
    { name: copy.mobileNav.risks, href: '/cockpit/risques', icon: Shield },
    { name: copy.mobileNav.decisions, href: '/cockpit/decisions', icon: CheckSquare },
    { name: copy.mobileNav.profile, href: '/cockpit/profil', icon: User },
  ];

  return (
    <nav className="border-t border-slate-800 px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-all duration-150 active:scale-95 ${
                isActive 
                  ? 'text-blue-400' 
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon size={20} className="transition-transform duration-150" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
