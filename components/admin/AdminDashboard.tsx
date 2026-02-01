'use client'

import { Card } from '@/components/ui/Card'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Vue complète - Tous les projets et organisations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Organisations</h3>
            <p className="text-3xl font-bold text-blue-400">-</p>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Projets</h3>
            <p className="text-3xl font-bold text-green-400">-</p>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Utilisateurs</h3>
            <p className="text-3xl font-bold text-purple-400">-</p>
          </Card>
        </div>

        <Card className="mt-8 bg-white/5 backdrop-blur-xl border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Mode Admin</h2>
          <p className="text-slate-300">
            Tableau de bord administrateur avec accès complet à toutes les données.
          </p>
        </Card>
      </div>
    </div>
  )
}
