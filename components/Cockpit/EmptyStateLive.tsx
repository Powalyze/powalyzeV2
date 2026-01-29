'use client';

import { Button } from '@/components/ui/Button';
import { Plus, Rocket, FileText, Users, BarChart } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateLiveProps {
  onCreateProject?: () => void;
}

export function EmptyStateLive({ onCreateProject }: EmptyStateLiveProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
        <Rocket className="h-16 w-16 text-white" />
      </div>

      <h1 className="mb-4 text-center text-4xl font-bold text-gray-900">
        Bienvenue dans votre <span className="text-blue-600">Cockpit Powalyze</span>
      </h1>

      <p className="mb-8 max-w-2xl text-center text-lg text-gray-600">
        Commencez votre voyage vers une gouvernance de portefeuille optimale. 
        Créez votre premier projet et bénéficiez d'une vision stratégique complète.
      </p>

      {/* CTA Principal */}
      <Button
        onClick={onCreateProject}
        size="lg"
        className="mb-12 gap-2 bg-blue-600 px-8 py-6 text-lg hover:bg-blue-700"
      >
        <Plus className="h-5 w-5" />
        Créer mon premier projet
      </Button>

      {/* Features Cards */}
      <div className="grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        <FeatureCard
          icon={<BarChart className="h-8 w-8 text-blue-600" />}
          title="Analytics en temps réel"
          description="Visualisez instantanément vos KPIs et prenez les bonnes décisions"
        />
        <FeatureCard
          icon={<Users className="h-8 w-8 text-blue-600" />}
          title="Collaboration d'équipe"
          description="Invitez votre équipe et travaillez ensemble efficacement"
        />
        <FeatureCard
          icon={<FileText className="h-8 w-8 text-blue-600" />}
          title="Rapports automatisés"
          description="Générez des rapports COMEX en un clic avec l'IA"
        />
      </div>

      {/* Navigation secondaire */}
      <div className="mt-16 flex gap-4 text-sm text-gray-600">
        <Link href="/cockpit/demo" className="hover:text-blue-600">
          Voir la démo
        </Link>
        <span>•</span>
        <Link href="/documentation" className="hover:text-blue-600">
          Documentation
        </Link>
        <span>•</span>
        <Link href="/support" className="hover:text-blue-600">
          Support
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
