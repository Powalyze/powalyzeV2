"use client";

import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  TrendingUp,
  Brain,
  BarChart3,
  AlertCircle,
  Users,
  Zap,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  HardDrive,
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Powalyze Dashboard</h1>
              <p className="text-sm text-slate-400 mt-1">
                Cockpit de gouvernance augmenté • Vue 360°
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors text-sm flex items-center gap-2">
                <Bell size={16} />
                <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-xs font-semibold">
                  3
                </span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-lg transition-all font-semibold text-sm shadow-lg shadow-amber-500/20">
                Nouveau projet
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Projets actifs"
            value="42"
            icon={<LayoutDashboard size={24} />}
            trend="+12%"
            trendUp={true}
            color="blue"
          />
          <StatCard
            title="Taux de réussite"
            value="94%"
            icon={<CheckCircle2 size={24} />}
            trend="+5%"
            trendUp={true}
            color="green"
          />
          <StatCard
            title="Budget consommé"
            value="7.8M€"
            icon={<TrendingUp size={24} />}
            trend="65%"
            trendUp={false}
            color="amber"
          />
          <StatCard
            title="Alertes critiques"
            value="3"
            icon={<AlertCircle size={24} />}
            trend="-2"
            trendUp={true}
            color="red"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Projets */}
            <DashboardCard title="Projets" icon={<FolderKanban size={20} />}>
              <div className="space-y-3">
                <ProjectItem
                  name="Transformation Digitale"
                  progress={78}
                  status="on-track"
                  deadline="15 mars"
                />
                <ProjectItem
                  name="Migration Cloud"
                  progress={92}
                  status="ahead"
                  deadline="10 fév"
                />
                <ProjectItem
                  name="IA Décisionnelle"
                  progress={45}
                  status="at-risk"
                  deadline="30 avril"
                />
              </div>
              <button className="mt-4 w-full py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
                Voir tous les projets
                <ArrowRight size={16} />
              </button>
            </DashboardCard>

            {/* Kanban */}
            <DashboardCard title="Kanban" icon={<Activity size={20} />}>
              <div className="grid grid-cols-4 gap-3">
                <KanbanColumn label="À faire" count={12} color="slate" />
                <KanbanColumn label="En cours" count={8} color="blue" />
                <KanbanColumn label="Révision" count={5} color="amber" />
                <KanbanColumn label="Terminé" count={24} color="green" />
              </div>
              <button className="mt-4 w-full py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
                Ouvrir le tableau
                <ArrowRight size={16} />
              </button>
            </DashboardCard>

            {/* Intelligence Prédictive */}
            <DashboardCard
              title="Intelligence prédictive"
              icon={<Brain size={20} />}
            >
              <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-400">
                    Analyse de risques
                  </span>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold">
                    Confiance: 94%
                  </span>
                </div>
                <div className="h-32 flex items-end justify-between gap-2">
                  <div className="flex-1 bg-gradient-to-t from-blue-500/50 to-blue-500/20 rounded-t h-20"></div>
                  <div className="flex-1 bg-gradient-to-t from-blue-500/50 to-blue-500/20 rounded-t h-24"></div>
                  <div className="flex-1 bg-gradient-to-t from-blue-500/50 to-blue-500/20 rounded-t h-28"></div>
                  <div className="flex-1 bg-gradient-to-t from-blue-500/50 to-blue-500/20 rounded-t h-32"></div>
                  <div className="flex-1 bg-gradient-to-t from-amber-500/50 to-amber-500/20 rounded-t h-24"></div>
                  <div className="flex-1 bg-gradient-to-t from-emerald-500/50 to-emerald-500/20 rounded-t h-20"></div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <InsightMetric label="Opportunités" value="5" color="green" />
                <InsightMetric label="Risques" value="3" color="red" />
                <InsightMetric label="Optimisations" value="8" color="blue" />
              </div>
            </DashboardCard>

            {/* Power BI Reports */}
            <DashboardCard
              title="Rapports Power BI"
              icon={<BarChart3 size={20} />}
            >
              <div className="space-y-3">
                <ReportItem
                  name="Vue Exécutive"
                  lastUpdated="Il y a 2h"
                  viewers={24}
                />
                <ReportItem
                  name="Analyse Budgétaire"
                  lastUpdated="Il y a 5h"
                  viewers={18}
                />
                <ReportItem
                  name="KPIs Stratégiques"
                  lastUpdated="Aujourd'hui"
                  viewers={42}
                />
              </div>
              <button className="mt-4 w-full py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
                Voir tous les rapports
                <ArrowRight size={16} />
              </button>
            </DashboardCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Portfolio */}
            <DashboardCard title="Portfolio" icon={<TrendingUp size={20} />}>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">
                      Alignement stratégique
                    </span>
                    <span className="text-lg font-bold text-emerald-400">
                      94%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full w-[94%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">
                      Santé globale
                    </span>
                    <span className="text-lg font-bold text-sky-400">88%</span>
                  </div>
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full w-[88%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">
                      Vélocité équipe
                    </span>
                    <span className="text-lg font-bold text-amber-400">
                      76%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full w-[76%]"></div>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Alertes */}
            <DashboardCard title="Alertes" icon={<AlertCircle size={20} />}>
              <div className="space-y-2">
                <AlertItem
                  message="Budget Programme Cloud dépassé"
                  severity="critical"
                  time="Il y a 1h"
                />
                <AlertItem
                  message="Retard potentiel Projet IA"
                  severity="warning"
                  time="Il y a 3h"
                />
                <AlertItem
                  message="Nouvelle opportunité détectée"
                  severity="info"
                  time="Il y a 5h"
                />
              </div>
            </DashboardCard>

            {/* Équipe */}
            <DashboardCard title="Équipe" icon={<Users size={20} />}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-2">
                  <Avatar color="blue" initials="JD" />
                  <Avatar color="green" initials="MK" />
                  <Avatar color="amber" initials="LR" />
                  <Avatar color="purple" initials="AS" />
                  <div className="w-10 h-10 rounded-full bg-slate-800/50 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-400 font-semibold">
                    +12
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">En ligne</span>
                  <span className="text-emerald-400 font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">En réunion</span>
                  <span className="text-amber-400 font-semibold">4</span>
                </div>
              </div>
            </DashboardCard>

            {/* Intégrations */}
            <DashboardCard title="Intégrations" icon={<Zap size={20} />}>
              <div className="space-y-3">
                <IntegrationItem name="Supabase" status="connected" />
                <IntegrationItem name="Power BI" status="connected" />
                <IntegrationItem name="GitHub" status="connected" />
                <IntegrationItem name="Slack" status="inactive" />
              </div>
            </DashboardCard>

            {/* Storage */}
            <DashboardCard title="Stockage" icon={<HardDrive size={20} />}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Utilisé</span>
                  <span className="text-sm font-semibold text-white">
                    45.2 GB / 100 GB
                  </span>
                </div>
                <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-[45%]"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/30 rounded p-2">
                    <div className="text-slate-400">Documents</div>
                    <div className="text-white font-semibold">28.4 GB</div>
                  </div>
                  <div className="bg-slate-800/30 rounded p-2">
                    <div className="text-slate-400">Médias</div>
                    <div className="text-white font-semibold">16.8 GB</div>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Quick Actions */}
            <DashboardCard title="Actions rapides" icon={<Settings size={20} />}>
              <div className="grid grid-cols-2 gap-2">
                <QuickActionButton icon={<FileText size={16} />} label="Documents" count={234} />
                <QuickActionButton icon={<MessageSquare size={16} />} label="Messages" count={12} />
                <QuickActionButton icon={<Bell size={16} />} label="Notifs" count={8} />
                <QuickActionButton icon={<Settings size={16} />} label="Paramètres" />
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
}

// Components
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  color: "blue" | "green" | "amber" | "red";
}

function StatCard({ title, value, icon, trend, trendUp, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    red: "bg-red-500/10 text-red-400",
  };

  const trendColorClasses = trendUp
    ? "text-emerald-400"
    : "text-red-400";

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800/50 hover:border-slate-700/50 transition-all shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <span className={`text-sm font-semibold ${trendColorClasses}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function DashboardCard({ title, icon, children }: DashboardCardProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800/50 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-amber-400">{icon}</div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

interface ProjectItemProps {
  name: string;
  progress: number;
  status: "on-track" | "ahead" | "at-risk";
  deadline: string;
}

function ProjectItem({ name, progress, status, deadline }: ProjectItemProps) {
  const statusConfig = {
    "on-track": { color: "bg-blue-500", label: "Dans les temps" },
    ahead: { color: "bg-emerald-500", label: "En avance" },
    "at-risk": { color: "bg-red-500", label: "À risque" },
  };

  return (
    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-medium text-sm">{name}</h3>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock size={12} />
          {deadline}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full ${statusConfig[status].color} rounded-full transition-all`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <span className="text-xs font-semibold text-white">{progress}%</span>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  label: string;
  count: number;
  color: "slate" | "blue" | "amber" | "green";
}

function KanbanColumn({ label, count, color }: KanbanColumnProps) {
  const colorClasses = {
    slate: "bg-slate-700/30 border-slate-600",
    blue: "bg-blue-500/20 border-blue-500",
    amber: "bg-amber-500/20 border-amber-500",
    green: "bg-emerald-500/20 border-emerald-500",
  };

  return (
    <div
      className={`${colorClasses[color]} border-l-4 rounded-lg p-3 text-center`}
    >
      <div className="text-2xl font-bold text-white mb-1">{count}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

interface InsightMetricProps {
  label: string;
  value: string;
  color: "green" | "red" | "blue";
}

function InsightMetric({ label, value, color }: InsightMetricProps) {
  const colorClasses = {
    green: "text-emerald-400",
    red: "text-red-400",
    blue: "text-blue-400",
  };

  return (
    <div className="bg-slate-800/30 rounded-lg p-3 text-center">
      <div className={`text-2xl font-bold ${colorClasses[color]} mb-1`}>
        {value}
      </div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

interface ReportItemProps {
  name: string;
  lastUpdated: string;
  viewers: number;
}

function ReportItem({ name, lastUpdated, viewers }: ReportItemProps) {
  return (
    <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-white font-medium text-sm">{name}</h3>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Users size={12} />
          {viewers}
        </span>
      </div>
      <p className="text-xs text-slate-500">{lastUpdated}</p>
    </div>
  );
}

interface AlertItemProps {
  message: string;
  severity: "critical" | "warning" | "info";
  time: string;
}

function AlertItem({ message, severity, time }: AlertItemProps) {
  const severityConfig = {
    critical: { bg: "bg-red-500/10", border: "border-red-500/30", dot: "bg-red-500" },
    warning: { bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-500" },
    info: { bg: "bg-blue-500/10", border: "border-blue-500/30", dot: "bg-blue-500" },
  };

  return (
    <div
      className={`${severityConfig[severity].bg} ${severityConfig[severity].border} border rounded-lg p-3`}
    >
      <div className="flex items-start gap-2">
        <div
          className={`${severityConfig[severity].dot} w-2 h-2 rounded-full mt-1.5`}
        ></div>
        <div className="flex-1">
          <p className="text-white text-sm">{message}</p>
          <p className="text-slate-500 text-xs mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}

interface AvatarProps {
  color: "blue" | "green" | "amber" | "purple";
  initials: string;
}

function Avatar({ color, initials }: AvatarProps) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
  };

  return (
    <div
      className={`w-10 h-10 rounded-full ${colorClasses[color]} border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white`}
    >
      {initials}
    </div>
  );
}

interface IntegrationItemProps {
  name: string;
  status: "connected" | "inactive";
}

function IntegrationItem({ name, status }: IntegrationItemProps) {
  return (
    <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3">
      <span className="text-white text-sm font-medium">{name}</span>
      <span
        className={`px-2 py-1 rounded text-xs font-semibold ${
          status === "connected"
            ? "bg-emerald-500/20 text-emerald-400"
            : "bg-slate-700/50 text-slate-400"
        }`}
      >
        {status === "connected" ? "Connecté" : "Inactif"}
      </span>
    </div>
  );
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function QuickActionButton({ icon, label, count }: QuickActionButtonProps) {
  return (
    <button className="bg-slate-800/30 hover:bg-slate-800/50 rounded-lg p-3 transition-colors text-left relative">
      <div className="text-amber-400 mb-2">{icon}</div>
      <div className="text-white text-xs font-medium">{label}</div>
      {count !== undefined && (
        <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full text-xs font-bold">
          {count}
        </div>
      )}
    </button>
  );
}
