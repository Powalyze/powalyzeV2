"use client";

import React, { useState } from "react";
import { Search, Filter, Plus, MoreVertical, Calendar, Users, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Project {
  id: string;
  name: string;
  status: "active" | "planning" | "completed" | "at-risk";
  progress: number;
  budget: number;
  spent: number;
  team: number;
  deadline: string;
  priority: "high" | "medium" | "low";
  manager: string;
}

const projects: Project[] = [
  {
    id: "1",
    name: "Transformation Cloud Azure",
    status: "active",
    progress: 67,
    budget: 1200000,
    spent: 804000,
    team: 12,
    deadline: "2026-06-15",
    priority: "high",
    manager: "Sophie Martin"
  },
  {
    id: "2",
    name: "Refonte ERP SAP S/4HANA",
    status: "at-risk",
    progress: 42,
    budget: 2500000,
    spent: 1575000,
    team: 18,
    deadline: "2026-09-30",
    priority: "high",
    manager: "Thomas Dubois"
  },
  {
    id: "3",
    name: "Digital Workplace Microsoft 365",
    status: "active",
    progress: 85,
    budget: 450000,
    spent: 382500,
    team: 8,
    deadline: "2026-04-20",
    priority: "medium",
    manager: "Marie Laurent"
  },
  {
    id: "4",
    name: "Data Lake & Analytics",
    status: "planning",
    progress: 15,
    budget: 800000,
    spent: 120000,
    team: 6,
    deadline: "2026-12-15",
    priority: "medium",
    manager: "Pierre Bernard"
  },
  {
    id: "5",
    name: "Cybersecurity Reinforcement",
    status: "active",
    progress: 55,
    budget: 650000,
    spent: 357500,
    team: 10,
    deadline: "2026-07-31",
    priority: "high",
    manager: "Claire Moreau"
  },
  {
    id: "6",
    name: "IoT Smart Factory",
    status: "completed",
    progress: 100,
    budget: 1800000,
    spent: 1764000,
    team: 14,
    deadline: "2026-02-28",
    priority: "low",
    manager: "Julien Petit"
  }
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "active").length,
    atRisk: projects.filter(p => p.status === "at-risk").length,
    completed: projects.filter(p => p.status === "completed").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projets</h1>
          <p className="text-slate-400">Gérez et suivez l'ensemble de votre portefeuille projet</p>
        </div>
        <Button variant="primary" size="lg">
          <Plus size={20} />
          Nouveau projet
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-slate-400">Total projets</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <TrendingUp className="text-sky-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{stats.active}</div>
                <div className="text-sm text-slate-400">En cours</div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <CheckCircle className="text-emerald-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-400">{stats.atRisk}</div>
                <div className="text-sm text-slate-400">À risque</div>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="text-amber-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-400">{stats.completed}</div>
                <div className="text-sm text-slate-400">Terminés</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <CheckCircle className="text-slate-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === "active"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                En cours
              </button>
              <button
                onClick={() => setStatusFilter("at-risk")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === "at-risk"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                À risque
              </button>
            </div>

            <Button variant="outline">
              <Filter size={18} />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {project.manager}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(project.deadline).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {project.team} membres
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <MoreVertical size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Progression</span>
                    <span className="text-white font-semibold">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Budget</span>
                    <span className="text-white font-semibold">
                      {((project.spent / project.budget) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (project.spent / project.budget) > 0.9
                          ? "bg-gradient-to-r from-red-500 to-red-400"
                          : "bg-gradient-to-r from-amber-500 to-amber-400"
                      }`}
                      style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Budget Numbers */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Dépensé</div>
                    <div className="text-sm font-semibold text-white">
                      {(project.spent / 1000).toFixed(0)}K€
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 text-right">Budget total</div>
                    <div className="text-sm font-semibold text-slate-300">
                      {(project.budget / 1000).toFixed(0)}K€
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
                <Button variant="ghost" size="sm">
                  Équipe
                </Button>
                <Button variant="ghost" size="sm">
                  Risques
                </Button>
                <Button variant="ghost" size="sm">
                  Rapports
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const config = {
    active: { label: "En cours", variant: "success" as const },
    planning: { label: "Planification", variant: "info" as const },
    completed: { label: "Terminé", variant: "neutral" as const },
    "at-risk": { label: "À risque", variant: "warning" as const },
  };

  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

function PriorityBadge({ priority }: { priority: Project["priority"] }) {
  const config = {
    high: { label: "Haute", variant: "danger" as const },
    medium: { label: "Moyenne", variant: "warning" as const },
    low: { label: "Basse", variant: "neutral" as const },
  };

  const { label, variant } = config[priority];
  return <Badge variant={variant}>{label}</Badge>;
}
