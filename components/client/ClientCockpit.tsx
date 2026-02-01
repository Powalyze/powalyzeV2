'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Project } from '@/lib/projects/getUserProjects'

interface ClientCockpitProps {
  projects: Project[]
  userId: string
  organizationId: string
}

interface ModuleCardProps {
  title: string
  count: number
  cta: string
  link: string
  icon: React.ReactNode
}

function ModuleCard({ title, count, cta, link, icon }: ModuleCardProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 hover:bg-white/10 transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-slate-400 text-sm">{count} élément(s)</p>
        </div>
      </div>
      
      <Link href={link}>
        <Button className="w-full" variant="outline">
          {cta}
        </Button>
      </Link>
    </Card>
  )
}

export default function ClientCockpit({ projects, userId, organizationId }: ClientCockpitProps) {
  const project = projects[0]

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Aucun projet</h2>
          <p className="text-slate-300 mb-6">Créez votre premier projet pour commencer</p>
          <Link href="/onboarding/client">
            <Button className="w-full">Créer un projet</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
          <p className="text-slate-400">Votre cockpit de pilotage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModuleCard
            title="Risques"
            count={0}
            cta="Créer votre premier risque"
            link={`/cockpit/projects/${project.id}/risks`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />

          <ModuleCard
            title="Décisions"
            count={0}
            cta="Créer votre première décision"
            link={`/cockpit/projects/${project.id}/decisions`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />

          <ModuleCard
            title="Actions"
            count={0}
            cta="Créer votre première action"
            link={`/cockpit/projects/${project.id}/actions`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />

          <ModuleCard
            title="Rapports"
            count={0}
            cta="Importer votre premier rapport"
            link={`/cockpit/projects/${project.id}/reports`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  )
}
