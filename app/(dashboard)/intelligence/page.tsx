"use client";

import React from "react";
import { Brain, TrendingUp, AlertTriangle, Zap, Target, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function IntelligencePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Intelligence Artificielle</h1>
        <p className="text-slate-400">Insights et recommandations augmentées par IA</p>
      </div>

      {/* AI Modules Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Brain className="text-emerald-400" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-sm text-slate-400">Modules IA actifs</div>
              </div>
            </div>
            <Badge variant="success">Opérationnels</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-sky-500/10 rounded-lg">
                <Zap className="text-sky-400" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">247</div>
                <div className="text-sm text-slate-400">Insights générés</div>
              </div>
            </div>
            <Badge variant="info">Cette semaine</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Target className="text-amber-400" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">94%</div>
                <div className="text-sm text-slate-400">Précision prédictive</div>
              </div>
            </div>
            <Badge variant="warning">+3% ce mois</Badge>
          </CardContent>
        </Card>
      </div>

      {/* AI Modules */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AIModule
          icon={<Brain size={32} />}
          title="Digital Twin"
          description="Clone numérique temps réel de vos projets"
          status="active"
          insights={42}
          accuracy={96}
          color="emerald"
        />

        <AIModule
          icon={<TrendingUp size={32} />}
          title="Analyse Quantique"
          description="Simulations Monte Carlo multi-scénarios"
          status="active"
          insights={38}
          accuracy={93}
          color="violet"
        />

        <AIModule
          icon={<Zap size={32} />}
          title="Auto-Healing"
          description="Détection et correction automatique d'anomalies"
          status="active"
          insights={28}
          accuracy={98}
          color="amber"
        />

        <AIModule
          icon={<Lightbulb size={32} />}
          title="NLP Sentiment Analysis"
          description="Analyse du sentiment dans les communications"
          status="active"
          insights={64}
          accuracy={91}
          color="sky"
        />

        <AIModule
          icon={<Target size={32} />}
          title="Portfolio Optimization"
          description="Optimisation allocation ressources et budget"
          status="active"
          insights={31}
          accuracy={95}
          color="pink"
        />

        <AIModule
          icon={<AlertTriangle size={32} />}
          title="Risk Prediction"
          description="Prédiction et quantification des risques"
          status="active"
          insights={47}
          accuracy={89}
          color="red"
        />
      </div>

      {/* Latest Insights */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Derniers Insights</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <InsightCard
              title="Risque de dépassement budgétaire détecté"
              description="Le projet 'Refonte ERP SAP' présente une probabilité de 78% de dépasser son budget de 15% d'ici fin Q2. Recommandation: révision du planning et réallocation de ressources."
              priority="high"
              project="Refonte ERP SAP"
              confidence={78}
              impact="Budget +300K€"
            />

            <InsightCard
              title="Opportunité d'accélération identifiée"
              description="En réaffectant 2 développeurs seniors du projet Cloud au projet Analytics, le délai de livraison pourrait être réduit de 3 semaines."
              priority="medium"
              project="Data Lake & Analytics"
              confidence={85}
              impact="Délai -3 semaines"
            />

            <InsightCard
              title="Anomalie de vélocité détectée"
              description="L'équipe Digital Workplace affiche une baisse de vélocité de 22% depuis 2 semaines. Analyse suggère un goulot d'étranglement dans les revues de code."
              priority="medium"
              project="Digital Workplace"
              confidence={91}
              impact="Vélocité -22%"
            />

            <InsightCard
              title="Pattern de succès identifié"
              description="Les projets avec daily stand-ups de moins de 15min ont un taux de succès 34% supérieur. Application recommandée aux autres projets."
              priority="low"
              project="Tous projets"
              confidence={96}
              impact="Succès +34%"
            />
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-white">Prévisions Q2 2026</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ForecastItem
                metric="Budget total consommé"
                current="67%"
                forecast="89%"
                trend="up"
              />
              <ForecastItem
                metric="Projets livrés à temps"
                current="85%"
                forecast="91%"
                trend="up"
              />
              <ForecastItem
                metric="Risques critiques"
                current="3"
                forecast="1"
                trend="down"
              />
              <ForecastItem
                metric="Satisfaction équipes"
                current="8.2/10"
                forecast="8.7/10"
                trend="up"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-white">Recommandations Prioritaires</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <RecommendationItem
                title="Renforcer l'équipe ERP"
                description="Ajouter 2 consultants SAP pour sécuriser la deadline"
                impact="high"
              />
              <RecommendationItem
                title="Consolider projets Cloud"
                description="Fusionner Azure Migration et Azure Backup"
                impact="medium"
              />
              <RecommendationItem
                title="Former équipe à Power Platform"
                description="Session de 2 jours pour toute l'équipe"
                impact="medium"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AIModule({
  icon,
  title,
  description,
  status,
  insights,
  accuracy,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  insights: number;
  accuracy: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10",
    violet: "text-violet-400 bg-violet-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    sky: "text-sky-400 bg-sky-500/10",
    pink: "text-pink-400 bg-pink-500/10",
    red: "text-red-400 bg-red-500/10",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
          <Badge variant="success">Actif</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div>
            <div className="text-2xl font-bold text-white">{insights}</div>
            <div className="text-xs text-slate-400">Insights générés</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{accuracy}%</div>
            <div className="text-xs text-slate-400">Précision</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({
  title,
  description,
  priority,
  project,
  confidence,
  impact,
}: {
  title: string;
  description: string;
  priority: string;
  project: string;
  confidence: number;
  impact: string;
}) {
  return (
    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-800">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-2">{title}</h4>
          <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </div>
        <Badge variant={priority === "high" ? "danger" : priority === "medium" ? "warning" : "info"}>
          {priority === "high" ? "Urgent" : priority === "medium" ? "Important" : "Info"}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="text-slate-500">
          <span className="text-slate-400">Projet:</span> {project}
        </div>
        <div className="text-slate-500">
          <span className="text-slate-400">Confiance:</span> {confidence}%
        </div>
        <div className="text-amber-400 font-semibold">{impact}</div>
      </div>
    </div>
  );
}

function ForecastItem({
  metric,
  current,
  forecast,
  trend,
}: {
  metric: string;
  current: string;
  forecast: string;
  trend: "up" | "down";
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
      <div>
        <div className="text-sm text-slate-400 mb-1">{metric}</div>
        <div className="text-lg font-semibold text-white">{current} → {forecast}</div>
      </div>
      <div className={`px-3 py-1 rounded-full ${trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
        {trend === "up" ? "↗" : "↘"}
      </div>
    </div>
  );
}

function RecommendationItem({
  title,
  description,
  impact,
}: {
  title: string;
  description: string;
  impact: string;
}) {
  return (
    <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-800">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-white">{title}</h4>
        <Badge variant={impact === "high" ? "danger" : "warning"}>
          {impact === "high" ? "Fort" : "Moyen"}
        </Badge>
      </div>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
