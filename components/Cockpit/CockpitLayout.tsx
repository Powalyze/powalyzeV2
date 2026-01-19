"use client";
import { useEffect, useState } from "react";
import { Project, Risk, Decision, Action } from "@/types/cockpit";
import { getProjects, getRisks, getDecisions, getActions } from "@/lib/dataProvider";


const ORG_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID || "demo-org";

export default function CockpitLayout() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [projectsData, risksData, decisionsData, actionsData] = await Promise.all([
        getProjects(ORG_ID),
        getRisks(ORG_ID),
        getDecisions(ORG_ID),
        getActions(ORG_ID),
      ]);
      setProjects(projectsData);
      setRisks(risksData);
      setDecisions(decisionsData);
      setActions(actionsData);
      if (projectsData.length > 0) {
        setSelectedProject(projectsData[0]);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-sm">Chargement du cockpit...</div>
        </div>
      </div>
    );
  }

  const projectRisks = risks.filter((r) => r.project_id === selectedProject?.id);
  const projectDecisions = decisions.filter((d) => d.project_id === selectedProject?.id);
  const projectActions = actions.filter((a) => a.project_id === selectedProject?.id);
  const activeProjects = projects.filter((p) => p.status === "ACTIVE" || p.status === "ON_HOLD");
  const criticalRisks = risks.filter((r) => (r.score || 0) >= 40);
  const pendingDecisions = decisions.filter((d) => d.status === "PENDING");
  const priorityActions = actions.filter(
    (a) =>
      a.status !== "DONE" &&
      (a.priority === "CRITICAL" || a.priority === "HIGH" || new Date(a.due_date) < new Date())
  );

  const dashboard = {
    projects: {
      total: projects.length,
      active: activeProjects.length,
      critical: projects.filter((p) => p.criticality === "CRITICAL").length,
      by_rag: {
        red: projects.filter((p) => p.rag_status === "RED").length,
        yellow: projects.filter((p) => p.rag_status === "YELLOW").length,
        green: projects.filter((p) => p.rag_status === "GREEN").length,
      },
    },
    risks: {
      total: risks.length,
      critical: criticalRisks.length,
    },
    decisions: {
      total: decisions.length,
      pending: pendingDecisions.length,
    },
    actions: {
      total: actions.length,
      overdue: actions.filter((a) => new Date(a.due_date) < new Date() && a.status !== "DONE").length,
      critical: priorityActions.length,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* DemoBadge removed */}
      <header className="border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" stroke="#C9A227" strokeWidth="4" />
            <path d="M30 55 L50 25 L70 55 L50 75 Z" fill="#C9A227" />
          </svg>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Powalyze</div>
            <div className="text-sm text-slate-300">Cockpit Exécutif & Gouvernance IA</div>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          Vue 360° · <span className="text-slate-100">Temps réel</span>
        </div>
      </header>
      <div className="border-b border-slate-800 px-8 py-4 bg-slate-900/30">
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Projets</div>
            <div className="text-xl font-semibold text-slate-100">{dashboard.projects.total}</div>
            <div className="text-xs text-slate-400 mt-1">
              {dashboard.projects.by_rag.red} rouge · {dashboard.projects.by_rag.yellow} jaune · {dashboard.projects.by_rag.green} vert
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Risques</div>
            <div className="text-xl font-semibold text-red-400">{dashboard.risks.critical}</div>
            <div className="text-xs text-slate-400 mt-1">critiques sur {dashboard.risks.total}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Décisions</div>
            <div className="text-xl font-semibold text-amber-400">{dashboard.decisions.pending}</div>
            <div className="text-xs text-slate-400 mt-1">en attente sur {dashboard.decisions.total}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Actions</div>
            <div className="text-xl font-semibold text-blue-400">{dashboard.actions.overdue}</div>
            <div className="text-xs text-slate-400 mt-1">en retard sur {dashboard.actions.total}</div>
          </div>
        </div>
      </div>
      <main className="flex-1 grid grid-cols-[320px_minmax(0,1.4fr)_minmax(0,1fr)] gap-4 px-4 py-4">
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400">
              Portfolio Actif
            </h2>
            <span className="text-[10px] text-slate-500">{projects.length} projets</span>
          </div>
          <div className="flex-1 flex flex-col gap-2 overflow-auto">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className={`text-left p-3 rounded-xl border transition ${
                  selectedProject?.id === p.id
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-slate-800 bg-slate-900 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-slate-100">{p.name}</div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      p.rag_status === "GREEN"
                        ? "bg-emerald-400"
                        : p.rag_status === "YELLOW"
                        ? "bg-amber-400"
                        : p.rag_status === "RED"
                        ? "bg-red-400"
                        : "bg-slate-400"
                    }`}
                  />
                </div>
                <div className="text-[10px] text-slate-400">{p.sponsor}</div>
              </button>
            ))}
          </div>
        </section>
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400">
              Cockpit Projet
            </h2>
            <span className="text-[10px] text-slate-500">
              {selectedProject ? selectedProject.name : "Sélectionnez un projet"}
            </span>
          </div>
          {selectedProject ? (
            <div className="flex flex-col gap-4 overflow-auto">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-slate-100">
                    {selectedProject.name}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedProject.rag_status === "GREEN"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : selectedProject.rag_status === "YELLOW"
                        ? "bg-amber-400/20 text-amber-300"
                        : selectedProject.rag_status === "RED"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {selectedProject.rag_status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-500">Sponsor</div>
                    <div className="text-slate-200">{selectedProject.sponsor}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">PM</div>
                    <div className="text-slate-200">{selectedProject.pm || "Non assigné"}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Budget</div>
                    <div className="text-slate-200">{selectedProject.budget.toLocaleString()}€</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Avancement</div>
                    <div className="text-slate-200">{selectedProject.completion_percentage}%</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                  <h3 className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                    Risques ({projectRisks.length})
                  </h3>
                  <div className="flex flex-col gap-2 max-h-48 overflow-auto">
                    {projectRisks.map((r) => (
                      <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-lg p-2">
                        <div className="text-xs font-medium text-slate-200">{r.title}</div>
                        <div className="text-[10px] text-slate-400 mt-1">Score: {r.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                  <h3 className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                    Décisions ({projectDecisions.length})
                  </h3>
                  <div className="flex flex-col gap-2 max-h-48 overflow-auto">
                    {projectDecisions.map((d) => (
                      <div key={d.id} className="bg-slate-950 border border-slate-800 rounded-lg p-2">
                        <div className="text-xs font-medium text-slate-200">{d.title}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{d.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                  Actions liées ({projectActions.length})
                </h3>
                <div className="flex flex-col gap-2 max-h-40 overflow-auto">
                  {projectActions.map((a) => (
                    <div key={a.id} className="bg-slate-950 border border-slate-800 rounded-lg p-2">
                      <div className="text-xs font-medium text-slate-200">{a.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {a.priority} • {a.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
              Sélectionnez un projet dans le portfolio
            </div>
          )}
        </section>
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400">
                Actions Prioritaires
              </h2>
              <span className="text-[10px] text-red-400">Zone rouge</span>
            </div>
            <div className="flex flex-col gap-2 max-h-56 overflow-auto">
              {actions.filter((a) => a.status !== "DONE").slice(0, 10).map((a) => (
                <div key={a.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-medium text-slate-200">{a.title}</div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        a.priority === "CRITICAL"
                          ? "bg-red-500/20 text-red-300"
                          : a.priority === "HIGH"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-slate-500/20 text-slate-300"
                      }`}
                    >
                      {a.priority}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {a.owner} • {a.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-3 mt-2">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-slate-100 mb-2">IA Narrative</h3>
              <div className="text-[11px] text-slate-400">
                Dashboard Stats:
                <ul className="mt-2 space-y-1 text-slate-500">
                  <li>• {dashboard.projects.total} projets ({dashboard.projects.active} actifs)</li>
                  <li>• {dashboard.risks.critical} risques critiques</li>
                  <li>• {dashboard.decisions.pending} décisions en attente</li>
                  <li>• {dashboard.actions.overdue} actions en retard</li>
                </ul>
              </div>
              <div className="mt-3 flex gap-2">
                <a
                  href="/ai-test"
                  className="text-[10px] px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded-lg transition"
                >
                  Tester IA →
                </a>
                <a
                  href="/committee-prep"
                  className="text-[10px] px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition"
                >
                  Brief Comité →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
