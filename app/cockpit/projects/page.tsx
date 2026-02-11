"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Toast premium
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-xl text-sm border ${
        type === "success"
          ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40"
          : "bg-red-600/20 text-red-300 border-red-500/40"
      }`}
    >
      {message}
    </div>
  );
}

type Project = {
  id: string;
  name: string;
  status: "draft" | "active" | "in_progress" | "completed" | "archived";
  owner_id: string;
  start_date: string | null;
  end_date: string | null;
  progress: number | null;
  updated_at: string | null;
};

type FilterTab = "all" | "active" | "in_progress" | "completed" | "archived";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("all");

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // IA Executive
  const [executiveOpen, setExecutiveOpen] = useState(false);
  const [executiveLoading, setExecutiveLoading] = useState(false);
  const [executiveText, setExecutiveText] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.status === filter);
  }, [projects, filter]);

  // -----------------------------
  // MÉTRIQUES POUR LES GRAPHIQUES
  // -----------------------------
  const avgProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.progress ?? 0), 0) / projects.length
        )
      : 0;

  const statusCounts = {
    draft: projects.filter((p) => p.status === "draft").length,
    active: projects.filter((p) => p.status === "active").length,
    in_progress: projects.filter((p) => p.status === "in_progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
    archived: projects.filter((p) => p.status === "archived").length,
  };

  const doughnutData = {
    labels: ["Actifs", "En cours", "Terminés", "Brouillons", "Archivés"],
    datasets: [
      {
        data: [
          statusCounts.active,
          statusCounts.in_progress,
          statusCounts.completed,
          statusCounts.draft,
          statusCounts.archived,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.6)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(168, 85, 247, 0.6)",
          "rgba(148, 163, 184, 0.6)",
          "rgba(71, 85, 105, 0.6)",
        ],
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: projects.map((p) => p.name),
    datasets: [
      {
        label: "Progression (%)",
        data: projects.map((p) => p.progress ?? 0),
        backgroundColor: "rgba(37, 99, 235, 0.6)",
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
      },
    ],
  };

  const statusLabel = (s: Project["status"]) => {
    switch (s) {
      case "draft":
        return "Brouillon";
      case "active":
        return "Actif";
      case "in_progress":
        return "En cours";
      case "completed":
        return "Terminé";
      case "archived":
        return "Archivé";
      default:
        return s;
    }
  };

  const statusColor = (s: Project["status"]) => {
    switch (s) {
      case "active":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
      case "in_progress":
        return "bg-blue-500/10 text-blue-300 border-blue-500/40";
      case "completed":
        return "bg-purple-500/10 text-purple-300 border-purple-500/40";
      case "archived":
        return "bg-slate-700/40 text-slate-300 border-slate-600";
      default:
        return "bg-slate-700/40 text-slate-300 border-slate-600";
    }
  };

  // -----------------------------
  // ACTION : OUVRIR LE DRAWER
  // -----------------------------
  const openDrawer = (project: Project) => {
    setEditing(project);
    setDrawerOpen(true);
  };

  // -----------------------------
  // ACTION : SAUVEGARDER
  // -----------------------------
  const saveProject = async () => {
    if (!editing) return;

    try {
      const res = await fetch(`/api/projects/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify(editing),
      });

      if (!res.ok) throw new Error();

      showToast("Projet mis à jour", "success");
      setDrawerOpen(false);
      fetchProjects();
    } catch {
      showToast("Erreur lors de la mise à jour", "error");
    }
  };

  // -----------------------------
  // IA EXECUTIVE : BRIEF
  // -----------------------------
  const generateExecutiveBrief = async () => {
    setExecutiveLoading(true);
    setExecutiveOpen(true);
    setExecutiveText(null);

    try {
      const res = await fetch("/api/executive-brief", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setExecutiveText(data.brief);
    } catch {
      setExecutiveText("Erreur lors de la génération du brief exécutif.");
    } finally {
      setExecutiveLoading(false);
    }
  };

  return (
    <div className="px-8 py-6 space-y-10">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* HEADER + BOUTON IA EXECUTIVE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#D4AF37]">Projets</h1>
          <p className="text-sm text-slate-400">
            Vue exécutive de tous vos projets.
          </p>
        </div>
        <button
          onClick={generateExecutiveBrief}
          className="px-4 py-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-sm hover:bg-[#D4AF37]/30 transition"
        >
          Brief exécutif IA
        </button>
      </div>

      {/* HEADER EXECUTIF GRAPHIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-center">
          <p className="text-sm text-slate-400">Progression moyenne</p>
          <p className="text-4xl font-bold text-[#D4AF37] mt-2">{avgProgress}%</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm text-slate-400 mb-2">Répartition des statuts</p>
          <Doughnut data={doughnutData} />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm text-slate-400 mb-2">Progression par projet</p>
          <Bar data={barData} />
        </div>
      </div>

      {/* Filtres */}
      <div className="inline-flex rounded-full border border-slate-800 bg-slate-950/60 p-1 text-xs">
        {[
          { id: "all", label: "Tous" },
          { id: "active", label: "Actifs" },
          { id: "in_progress", label: "En cours" },
          { id: "completed", label: "Terminés" },
          { id: "archived", label: "Archivés" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as FilterTab)}
            className={`px-3 py-1 rounded-full transition ${
              filter === tab.id
                ? "bg-slate-800 text-slate-50"
                : "text-slate-400 hover:text-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABLE PREMIUM */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400 bg-slate-950/60">
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-left">Owner</th>
              <th className="px-4 py-2 text-left">Début</th>
              <th className="px-4 py-2 text-left">Fin</th>
              <th className="px-4 py-2 text-left">Progression</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-slate-900/60 last:border-0 hover:bg-slate-900/40 transition"
              >
                <td className="px-4 py-2 text-slate-100">{p.name}</td>

                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border ${statusColor(
                      p.status
                    )}`}
                  >
                    {statusLabel(p.status)}
                  </span>
                </td>

                <td className="px-4 py-2 text-slate-300">{p.owner_id}</td>

                <td className="px-4 py-2 text-slate-300">
                  {p.start_date ? new Date(p.start_date).toLocaleDateString() : "-"}
                </td>

                <td className="px-4 py-2 text-slate-300">
                  {p.end_date ? new Date(p.end_date).toLocaleDateString() : "-"}
                </td>

                <td className="px-4 py-2 text-slate-300">
                  {p.progress !== null ? `${p.progress}%` : "-"}
                </td>

                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => openDrawer(p)}
                    className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:bg-slate-800 transition"
                  >
                    Éditer
                  </button>

                  <button
                    onClick={() =>
                      openDrawer({ ...p, status: p.status === "active" ? "completed" : "active" })
                    }
                    className="rounded-full border border-blue-700 px-3 py-1 text-[11px] text-blue-300 hover:bg-blue-800/40 transition"
                  >
                    Changer statut
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DRAWER */}
      {drawerOpen && editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
          <div className="w-[380px] h-full bg-slate-950 border-l border-slate-800 p-6 space-y-6 overflow-y-auto">
            <h2 className="text-xl font-semibold text-[#D4AF37]">Modifier le projet</h2>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Nom</label>
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Statut</label>
              <select
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as Project["status"] })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              >
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Progression (%)</label>
              <input
                type="number"
                value={editing.progress ?? 0}
                onChange={(e) =>
                  setEditing({ ...editing, progress: Number(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
              >
                Annuler
              </button>

              <button
                onClick={saveProject}
                className="px-4 py-2 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/30 transition"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANEL BRIEF EXÉCUTIF IA */}
      {executiveOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-40">
          <div className="w-full max-w-2xl max-h-[80vh] bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#D4AF37]">
                Brief exécutif IA
              </h2>
              <button
                onClick={() => setExecutiveOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                Fermer
              </button>
            </div>

            <div className="flex-1 overflow-y-auto text-sm text-slate-200 whitespace-pre-line">
              {executiveLoading && (
                <p className="text-slate-400 text-sm">
                  Génération du brief exécutif en cours…
                </p>
              )}
              {!executiveLoading && executiveText && <p>{executiveText}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
