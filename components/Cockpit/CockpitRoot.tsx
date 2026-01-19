"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, MessageSquare, Target, Rocket, Sparkles, X, CheckCircle, Clock, Calendar, Zap, Brain, Search
} from "lucide-react";
import "../../styles/cockpit-grid.css";
import styles from "../../app/cockpit/chief.module.css";
import { AppShell } from "../layout/AppShell";
import { getDemoData, getEmptyData, type CockpitData } from "@/lib/cockpitData";
import { formatProjectForAI } from "@/lib/ai-project-predictor";
import type { ProjectPrediction } from "@/types/project-prediction";
import { saveProjectPrediction, loadAllProjectPredictions } from "@/lib/supabase-cockpit";
import ProjectPredictionPanel from "./ProjectPredictionPanel";

/**
 * CockpitRoot - Composant racine unique pour les modes DEMO et PRO
 * 
 * @param mode - "demo" pour vitrine commerciale, "pro" pour clients réels
 */

type ViewType = 'cockpit' | 'mission' | 'sphere';

interface CockpitProject {
  id: string;
  name: string;
  status: 'green' | 'orange' | 'red';
  progress: number;
  budget: string;
  team: string;
  risk: string;
  deadline: string;
}

interface CockpitRootProps {
  mode: "demo" | "pro";
}

export default function CockpitRoot({ mode }: CockpitRootProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('cockpit');
  const [selectedProject, setSelectedProject] = useState<CockpitProject | null>(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [projectDetailOpen, setProjectDetailOpen] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [autoHealingRunning, setAutoHealingRunning] = useState(false);
  const [healingSolution, setHealingSolution] = useState<string>('');
  const [toast, setToast] = useState<{message: string; type: 'success' | 'info' | 'warning' | 'error'} | null>(null);
  const [projects, setProjects] = useState<CockpitProject[]>([]);
  const [predictiveAI, setPredictiveAI] = useState<{ risk: number; budget: number; duration: number } | null>(null);
  const [projectPredictions, setProjectPredictions] = useState<Map<string, ProjectPrediction>>(new Map());
  const [analyzingProject, setAnalyzingProject] = useState<string | null>(null);

  // Load data based on mode
  const cockpitData: CockpitData = mode === "demo" ? getDemoData() : getEmptyData();

  useEffect(() => {
    setIsAuthenticated(true);
    setIsLoading(false);
    const modeLabel = mode === "demo" ? "DÉMO" : "PRO";
    showToast(`🚀 Mode ${modeLabel} activé - Cockpit Exécutif Powalyze`, 'info');
  }, [mode]);

  useEffect(() => {
    setProjects([]);
    // Load cached predictions from Supabase
    loadPredictionsFromCache();
  }, []);

  const loadPredictionsFromCache = async () => {
    if (projects.length === 0) return;
    
    try {
      const projectIds = projects.map(p => p.id);
      const cachedPredictions = await loadAllProjectPredictions(projectIds);
      setProjectPredictions(cachedPredictions);
      
      if (cachedPredictions.size > 0) {
        showToast(`📦 ${cachedPredictions.size} prédictions chargées depuis le cache`, 'info');
      }
    } catch (error) {
      console.error('[loadPredictionsFromCache] Error:', error);
      // Silent fail - cache is optional
    }
  };

  useEffect(() => {
    if (projects.length === 0) {
      setPredictiveAI(null);
    } else {
      setPredictiveAI({ risk: 0, budget: 0, duration: 0 });
    }
  }, [projects]);

  /**
   * Analyze a project with ProjectPredictor AI
   * Implements intelligent cache: checks cache first, saves after analysis
   */
  const analyzeProject = async (project: CockpitProject, forceRefresh = false) => {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedPrediction = projectPredictions.get(project.id);
      if (cachedPrediction) {
        showToast(`📦 Utilisation du cache pour ${project.name}`, 'info');
        return;
      }
    }

    setAnalyzingProject(project.id);
    try {
      const projectInput = formatProjectForAI(project);
      
      const response = await fetch("/api/ai/project-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectInput),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze project");
      }

      const prediction: ProjectPrediction = await response.json();
      
      // Update local state
      setProjectPredictions((prev) => new Map(prev).set(project.id, prediction));
      
      // Save to Supabase cache
      try {
        await saveProjectPrediction(project.id, prediction, project);
        showToast(`✅ Analyse IA terminée et sauvegardée pour ${project.name}`, "success");
      } catch (cacheError) {
        console.error('[analyzeProject] Failed to save to cache:', cacheError);
        showToast(`✅ Analyse IA terminée pour ${project.name} (cache non sauvegardé)`, "success");
      }
    } catch (error) {
      console.error("Error analyzing project:", error);
      showToast(`❌ Erreur lors de l'analyse de ${project.name}`, "error");
    } finally {
      setAnalyzingProject(null);
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 4000);
  };

  const exportToCSV = (data: any[], filename: string) => {
    requestIdleCallback(() => {
      try {
        const date = new Date().toISOString().split('T')[0];
        const csvContent = [
          Object.keys(data[0] || {}).join(','),
          ...data.map(row => 
            Object.values(row)
              .map(val => typeof val === 'string' && val.includes(',') ? `"${val}"` : val)
              .join(',')
          )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${date}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('CSV téléchargé avec succès!', 'success');
      } catch (error) {
        console.error('Erreur export CSV:', error);
        showToast('Erreur lors du téléchargement CSV', 'error');
      }
    }, { timeout: 1000 });
  };

  const exportToJSON = (data: any, filename: string) => {
    requestIdleCallback(() => {
      try {
        const date = new Date().toISOString().split('T')[0];
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${date}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('JSON téléchargé avec succès!', 'success');
      } catch (error) {
        console.error('Erreur export JSON:', error);
        showToast('Erreur lors du téléchargement JSON', 'error');
      }
    }, { timeout: 1000 });
  };

  const messages: any[] = [];
  const documents: any[] = [];
  const quickActions: any[] = [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Chargement du Cockpit...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <div className="relative w-full h-48 overflow-hidden border-b-4 border-gradient-to-r from-amber-500 via-orange-600 to-amber-500 shadow-2xl">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950">
            <div className="absolute inset-0 opacity-5 grid-bg"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Cockpit Exécutif {mode === "demo" ? "(DÉMO)" : "(PRO)"}
              </h1>
              <p className="text-xl text-blue-400 mt-2">Visualisation temps réel de votre portefeuille</p>
            </div>
          </div>
        </div>

        {/* Chief of Staff IA Panel */}
        <section className={styles['section-chief']}>
          <div className={`section-inner ${styles['chief-layout']}`}>
            <div className={styles['chief-header']}>
              <h2 className={`section-title ${styles['section-title']}`}>Chief of Staff IA</h2>
              <p className={styles['chief-subtitle']}>Analyse continue • Prédiction active</p>
            </div>
            <div className={styles['chief-panel']}>
              <div className={styles['chief-status']}>
                <p className={styles['chief-status-label']}>Analyse en cours...</p>
                <div className={styles['chief-status-metrics']}>
                  <div className="metric">
                    <span className={styles['metric-label']}>Projets analysés</span>
                    <span className={styles['metric-value']}>{cockpitData.metrics.projectsAnalyzed}</span>
                  </div>
                  <div className="metric">
                    <span className={styles['metric-label']}>Risques détectés</span>
                    <span className={styles['metric-value']}>{cockpitData.metrics.risksDetected}</span>
                  </div>
                  <div className="metric">
                    <span className={styles['metric-label']}>Opportunités identifiées</span>
                    <span className={styles['metric-value']}>{cockpitData.metrics.opportunitiesIdentified}</span>
                  </div>
                </div>
                <div className={styles['chief-portfolio-tag']}>✨ Portfolio sain</div>
              </div>
              <div className={styles['chief-actions']}>
                <h3 className={styles['chief-actions-title']}>Actions recommandées</h3>
                <div className={styles['chief-actions-grid']}>
                  {cockpitData.actions.length === 0 ? (
                    <div className={`${styles['chief-action-card']} ${styles['chief-action-card-disabled']}`}>
                      <p className={styles['chief-action-main']}>Aucune action recommandée</p>
                      <p className={styles['chief-action-impact']}>Ajoutez un projet pour activer l'IA</p>
                    </div>
                  ) : (
                    cockpitData.actions.map((action, i) => (
                      <div key={i} className={styles['chief-action-card']}>
                        <p className={styles['chief-action-main']}>{action.title}</p>
                        <p className={styles['chief-action-impact']}>{action.impact}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className={styles['chief-input']}>
                <label htmlFor="chief-question" className={styles['chief-input-label']}>Posez une question stratégique...</label>
                <div className={styles['chief-input-row']}>
                  <input id="chief-question" type="text" className={styles['chief-input-field']} placeholder="Ex. : Comment sécuriser notre roadmap Q3 sans dépasser le budget ?" />
                  <button className={`btn-primary ${styles['chief-input-button']}`} title="Envoyer">Envoyer</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Predictive AI Panel */}
        {selectedProject && (
          <div className="my-8 px-6">
            <ProjectPredictionPanel
              prediction={projectPredictions.get(selectedProject.id) || null}
              isAnalyzing={analyzingProject === selectedProject.id}
              onAnalyze={() => analyzeProject(selectedProject, true)}
            />
          </div>
        )}

        {/* Global AI Metrics (when no project selected) */}
        {!selectedProject && (
          <div className="my-8 px-6">
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-500/30 rounded-xl shadow-xl p-6 flex flex-col items-start min-h-[120px]">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-6 h-6 text-blue-400 animate-pulse" />
                <h2 className="text-lg font-bold text-blue-300">IA Prédictive (projets)</h2>
              </div>
              {projects.length === 0 || !predictiveAI ? (
                <div className="text-slate-400 text-sm mt-2">Aucune donnée à analyser. Ajoutez un projet pour activer l'IA prédictive.</div>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400">Risque global</span>
                      <span className="text-2xl font-bold text-blue-400">{predictiveAI.risk}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400">Dépassement budget</span>
                      <span className="text-2xl font-bold text-blue-400">{predictiveAI.budget}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400">Retard estimé</span>
                      <span className="text-2xl font-bold text-blue-400">{predictiveAI.duration}j</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Sélectionnez un projet pour voir l'analyse IA détaillée.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toast notifications */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md">
            <div className={`px-6 py-4 rounded-lg shadow-2xl border ${
              toast.type === 'success' ? 'bg-green-900 border-green-500' :
              toast.type === 'error' ? 'bg-red-900 border-red-500' :
              toast.type === 'warning' ? 'bg-orange-900 border-orange-500' :
              'bg-blue-900 border-blue-500'
            } flex items-start gap-3`}>
              <div className="text-white whitespace-pre-line text-sm flex-1">{toast.message}</div>
              <button onClick={() => setToast(null)} className="text-white/70 hover:text-white" title="Fermer">✕</button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
