"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDemoData } from "@/lib/cockpitData";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  FileText,
  MessageSquare,
} from "lucide-react";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load demo data
    setTimeout(() => {
      const demoData = getDemoData();
      const foundProject = demoData.projects.find((p) => p.id === projectId);
      
      if (foundProject) {
        // Enrich project data
        setProject({
          ...foundProject,
          description: `${foundProject.name} est un projet stratégique visant à moderniser notre infrastructure technologique et améliorer notre compétitivité sur le marché.`,
          startDate: "1 janvier 2026",
          phase: "Conception",
          teamMembers: [
            { name: "Marie Dupont", role: "Chef de projet", avatar: "MD" },
            { name: "Jean Martin", role: "Tech Lead", avatar: "JM" },
            { name: "Sophie Laurent", role: "UX Designer", avatar: "SL" },
            { name: "Pierre Dubois", role: "Développeur Senior", avatar: "PD" },
          ],
          milestones: [
            { name: "Kick-off", date: "5 janvier 2026", status: "completed" },
            { name: "Analyse complète", date: "20 janvier 2026", status: "completed" },
            { name: "Design validé", date: "10 février 2026", status: "current" },
            { name: "Développement", date: "1 mars 2026", status: "pending" },
            { name: "Tests & QA", date: "15 avril 2026", status: "pending" },
            { name: "Déploiement", date: foundProject.deadline, status: "pending" },
          ],
          kpis: [
            { label: "Budget consommé", value: "65%", status: "good" },
            { label: "Temps écoulé", value: "42%", status: "good" },
            { label: "Tâches complétées", value: `${foundProject.progress}%`, status: foundProject.progress >= 70 ? "good" : foundProject.progress >= 40 ? "warning" : "danger" },
            { label: "Satisfaction client", value: "92%", status: "good" },
          ],
          risks: [
            { title: "Retard fournisseur API", level: "medium", impact: "Planning" },
            { title: "Disponibilité équipe", level: "low", impact: "Ressources" },
          ],
          recentActivity: [
            { type: "update", text: "Validation du design par le COMEX", date: "Il y a 2h" },
            { type: "milestone", text: "Milestone 'Analyse complète' terminée", date: "Il y a 1 jour" },
            { type: "comment", text: "Nouveau commentaire de Marie Dupont", date: "Il y a 3 jours" },
          ],
        });
      }
      setLoading(false);
    }, 500);
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/60">Chargement du projet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Projet non trouvé</h2>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === "green") return "bg-green-400";
    if (status === "orange") return "bg-orange-400";
    return "bg-red-400";
  };

  const getStatusLabel = (status: string) => {
    if (status === "green") return "Nominal";
    if (status === "orange") return "Vigilance";
    return "Critique";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                <span className="text-slate-300">{getStatusLabel(project.status)}</span>
              </div>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">{project.phase}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">ID: {project.id}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
              Exporter
            </button>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              Modifier
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {project.kpis.map((kpi: any, i: number) => (
            <div key={i} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-2">{kpi.label}</p>
              <p className={`text-3xl font-bold ${
                kpi.status === "good" ? "text-green-400" :
                kpi.status === "warning" ? "text-orange-400" : "text-red-400"
              }`}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Description
              </h2>
              <p className="text-slate-300 leading-relaxed">{project.description}</p>
            </div>

            {/* Project Info */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Informations du Projet</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Date de début</span>
                  </div>
                  <p className="text-white font-semibold">{project.startDate}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Échéance</span>
                  </div>
                  <p className="text-white font-semibold">{project.deadline}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Budget</span>
                  </div>
                  <p className="text-white font-semibold">{project.budget}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Équipe</span>
                  </div>
                  <p className="text-white font-semibold">{project.team}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Sponsor</span>
                  </div>
                  <p className="text-white font-semibold">{project.sponsor}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm">Avancement</span>
                  </div>
                  <p className="text-white font-semibold">{project.progress}%</p>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Jalons</h2>
              <div className="space-y-4">
                {project.milestones.map((milestone: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      milestone.status === "completed" ? "bg-green-500/20 text-green-400" :
                      milestone.status === "current" ? "bg-blue-500/20 text-blue-400" :
                      "bg-slate-700 text-slate-500"
                    }`}>
                      {milestone.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{milestone.name}</p>
                      <p className="text-slate-400 text-sm">{milestone.date}</p>
                    </div>
                    {milestone.status === "current" && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        En cours
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Équipe
              </h2>
              <div className="space-y-3">
                {project.teamMembers.map((member: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-slate-400 text-sm">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Risques
              </h2>
              <div className="space-y-3">
                {project.risks.map((risk: any, i: number) => (
                  <div key={i} className="p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        risk.level === "high" ? "bg-red-400" :
                        risk.level === "medium" ? "bg-orange-400" : "bg-yellow-400"
                      }`} />
                      <p className="text-white font-medium text-sm">{risk.title}</p>
                    </div>
                    <p className="text-slate-400 text-xs">Impact: {risk.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Activité Récente
              </h2>
              <div className="space-y-3">
                {project.recentActivity.map((activity: any, i: number) => (
                  <div key={i} className="border-l-2 border-blue-500 pl-3">
                    <p className="text-white text-sm">{activity.text}</p>
                    <p className="text-slate-500 text-xs mt-1">{activity.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
