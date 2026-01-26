"use client";

import React from "react";
import { TrendingUp, DollarSign, Users, Target, PieChart, BarChart3, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function PortfolioPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-slate-400">Vue consolidée et optimisation de votre portefeuille projets</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <DollarSign className="text-emerald-400" size={24} />
              </div>
              <Badge variant="success">+12%</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">7.8M€</div>
            <div className="text-sm text-slate-400">Valeur totale portfolio</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Target className="text-amber-400" size={24} />
              </div>
              <Badge variant="warning">94%</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">42</div>
            <div className="text-sm text-slate-400">Projets actifs</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-sky-500/10 rounded-lg">
                <Users className="text-sky-400" size={24} />
              </div>
              <Badge variant="info">85%</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">156</div>
            <div className="text-sm text-slate-400">Ressources allouées</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-violet-500/10 rounded-lg">
                <TrendingUp className="text-violet-400" size={24} />
              </div>
              <Badge variant="success">+8%</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">ROI 247%</div>
            <div className="text-sm text-slate-400">Retour sur investissement</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Portfolio Distribution */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Distribution du Portfolio</h2>
              <PieChart className="text-slate-400" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <PortfolioCategory
                name="Transformation Digitale"
                projects={15}
                budget={3200000}
                color="emerald"
                percentage={41}
              />
              <PortfolioCategory
                name="Infrastructure & Cloud"
                projects={12}
                budget={2100000}
                color="sky"
                percentage={27}
              />
              <PortfolioCategory
                name="Data & Analytics"
                projects={8}
                budget={1500000}
                color="violet"
                percentage={19}
              />
              <PortfolioCategory
                name="Cybersécurité"
                projects={7}
                budget={1000000}
                color="amber"
                percentage={13}
              />
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Health */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Santé du Portfolio</h2>
              <BarChart3 className="text-slate-400" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <HealthMetric
                label="Sur la bonne voie"
                value={35}
                total={42}
                color="emerald"
              />
              <HealthMetric
                label="Attention requise"
                value={5}
                total={42}
                color="amber"
              />
              <HealthMetric
                label="À risque"
                value={2}
                total={42}
                color="red"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Allocation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Allocation des Ressources</h2>
            <Users className="text-slate-400" size={20} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <ResourceCard
              role="Chefs de projet"
              allocated={18}
              capacity={20}
              utilization={90}
            />
            <ResourceCard
              role="Développeurs"
              allocated={85}
              capacity={100}
              utilization={85}
            />
            <ResourceCard
              role="Architectes"
              allocated={12}
              capacity={15}
              utilization={80}
            />
            <ResourceCard
              role="Consultants"
              allocated={41}
              capacity={45}
              utilization={91}
            />
          </div>
        </CardContent>
      </Card>

      {/* Strategic Initiatives */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Initiatives Stratégiques</h2>
            <Target className="text-slate-400" size={20} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Initiative
              name="Excellence Opérationnelle"
              projects={15}
              progress={72}
              impact="high"
            />
            <Initiative
              name="Croissance & Innovation"
              projects={12}
              progress={58}
              impact="high"
            />
            <Initiative
              name="Transformation Client"
              projects={9}
              progress={84}
              impact="medium"
            />
            <Initiative
              name="Efficacité Énergétique"
              projects={6}
              progress={45}
              impact="medium"
            />
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recommandations IA</h2>
            <AlertCircle className="text-amber-400" size={20} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Recommendation
              title="Réallocation de ressources suggérée"
              description="Transférer 3 développeurs du projet Cloud vers le projet Data Lake pour optimiser les délais"
              impact="high"
              savings="120K€"
            />
            <Recommendation
              title="Opportunité de consolidation"
              description="Les projets SharePoint et Teams peuvent être fusionnés pour réduire les coûts de 15%"
              impact="medium"
              savings="85K€"
            />
            <Recommendation
              title="Budget sous-utilisé détecté"
              description="Le projet Analytics a un budget disponible de 200K€ qui pourrait être réalloué"
              impact="low"
              savings="200K€"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PortfolioCategory({
  name,
  projects,
  budget,
  color,
  percentage,
}: {
  name: string;
  projects: number;
  budget: number;
  color: string;
  percentage: number;
}) {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    violet: "bg-violet-500",
    amber: "bg-amber-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${colorClasses[color]}`} />
          <span className="text-white font-medium">{name}</span>
        </div>
        <div className="text-right">
          <div className="text-white font-semibold">{(budget / 1000000).toFixed(1)}M€</div>
          <div className="text-xs text-slate-400">{projects} projets</div>
        </div>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${colorClasses[color]} transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function HealthMetric({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = (value / total) * 100;
  const colorClasses: Record<string, { bg: string; text: string }> = {
    emerald: { bg: "bg-emerald-500", text: "text-emerald-400" },
    amber: { bg: "bg-amber-500", text: "text-amber-400" },
    red: { bg: "bg-red-500", text: "text-red-400" },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-300 text-sm">{label}</span>
        <span className={`font-semibold ${colorClasses[color].text}`}>
          {value}/{total}
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${colorClasses[color].bg} transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function ResourceCard({
  role,
  allocated,
  capacity,
  utilization,
}: {
  role: string;
  allocated: number;
  capacity: number;
  utilization: number;
}) {
  return (
    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-800">
      <div className="text-sm text-slate-400 mb-2">{role}</div>
      <div className="text-2xl font-bold text-white mb-3">
        {allocated}/{capacity}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Utilisation</span>
          <span className={utilization > 85 ? "text-amber-400" : "text-emerald-400"}>
            {utilization}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              utilization > 85 ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${utilization}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Initiative({
  name,
  projects,
  progress,
  impact,
}: {
  name: string;
  projects: number;
  progress: number;
  impact: string;
}) {
  return (
    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-white font-semibold mb-1">{name}</div>
          <div className="text-sm text-slate-400">{projects} projets</div>
        </div>
        <Badge variant={impact === "high" ? "danger" : "warning"}>
          {impact === "high" ? "Impact Fort" : "Impact Moyen"}
        </Badge>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Avancement</span>
          <span className="text-white font-semibold">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Recommendation({
  title,
  description,
  impact,
  savings,
}: {
  title: string;
  description: string;
  impact: string;
  savings: string;
}) {
  const impactColors: Record<string, string> = {
    high: "text-red-400 bg-red-500/10 border-red-500/30",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  };

  return (
    <div className={`p-4 rounded-lg border ${impactColors[impact]}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white">{title}</h3>
        <div className="text-sm font-bold">{savings}</div>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
    </div>
  );
}

