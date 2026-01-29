'use client';

import { useState } from 'react';
import { Rocket, FileText, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useCockpitCopy } from '@/lib/i18n/cockpit';
import { CreateProjectModal, ProjectFormData } from './CreateProjectModal';

interface EmptyStateLiveProps {
  onCreateProject?: (data: ProjectFormData) => Promise<void>;
  language?: 'fr' | 'en';
}

export function EmptyStateLive({ onCreateProject, language = 'fr' }: EmptyStateLiveProps) {
  const copy = useCockpitCopy(language);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = async (data: ProjectFormData) => {
    if (onCreateProject) {
      await onCreateProject(data);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-in fade-in duration-500">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 animate-pulse" />
              <div className="relative rounded-full bg-gradient-to-br from-blue-600 to-blue-800 p-6">
                <Rocket size={48} className="text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            {copy.emptyState.title}
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-8">
            {copy.emptyState.subtitle}
          </p>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-lg shadow-blue-600/20"
          >
            <Rocket size={20} />
            {copy.emptyState.cta}
          </button>
        </div>

        {/* Features Cards */}
        <div className="grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mb-12">
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8 text-blue-500" />}
            title={copy.emptyState.features.analytics}
            description={copy.emptyState.features.analyticsDesc}
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-green-500" />}
            title={copy.emptyState.features.collaboration}
            description={copy.emptyState.features.collaborationDesc}
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-purple-500" />}
            title={copy.emptyState.features.reports}
            description={copy.emptyState.features.reportsDesc}
          />
        </div>

        {/* Navigation secondaire */}
        <div className="flex justify-center gap-6 text-sm">
          <Link href="/cockpit/demo" className="text-slate-400 hover:text-white transition-colors">
            {copy.emptyState.links.demo}
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/ressources/documentation" className="text-slate-400 hover:text-white transition-colors">
            {copy.emptyState.links.documentation}
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
            {copy.emptyState.links.support}
          </Link>
        </div>
      </div>

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

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-slate-700 transition-colors">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
