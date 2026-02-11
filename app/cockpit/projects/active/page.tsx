"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./styles.css";

type Project = {
  id: string;
  name: string;
  status: string;
  owner_id: string;
  start_date: string | null;
  end_date: string | null;
  progress: number | null;
  updated_at: string | null;
  description?: string;
  budget?: number;
};

export default function ActiveProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveProjects();
  }, []);

  const fetchActiveProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects");
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Filtrer uniquement les projets actifs
      const activeProjects = data.filter((p: Project) => 
        p.status === "active" || p.status === "ACTIVE"
      );
      
      setProjects(activeProjects);
    } catch (err) {
      console.error("Error fetching active projects:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  const getProgressColor = (progress: number | null) => {
    if (!progress) return "bg-gray-500";
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white/60">Chargement des projets actifs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">
              ⚠️ Erreur de chargement
            </h2>
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => fetchActiveProjects()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              📊 Projets Actifs
            </h1>
            <p className="text-white/60">
              {projects.length} projet{projects.length !== 1 ? "s" : ""} en cours
            </p>
          </div>
          <button
            onClick={() => router.push("/cockpit/projects")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
          >
            ← Tous les projets
          </button>
        </div>

        {/* Liste vide */}
        {projects.length === 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Aucun projet actif
            </h2>
            <p className="text-white/60 mb-6">
              Vous n'avez pas encore de projet en cours.
            </p>
            <button
              onClick={() => router.push("/cockpit/projects")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Créer un projet
            </button>
          </div>
        )}

        {/* Grille de projets */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/cockpit/projects/${project.id}`)}
              >
                {/* Titre */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-white/60 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Début</span>
                    <span className="text-white font-medium">
                      {formatDate(project.start_date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Fin prévue</span>
                    <span className="text-white font-medium">
                      {formatDate(project.end_date)}
                    </span>
                  </div>
                </div>

                {/* Progression */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/60">Progression</span>
                    <span className="text-white font-bold">
                      {project.progress ?? 0}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden relative">
                    <div
                      className={`absolute top-0 left-0 h-full ${getProgressColor(project.progress)} transition-all`}
                      data-progress={project.progress ?? 0}
                    />
                  </div>
                </div>

                {/* Budget (si disponible) */}
                {project.budget && (
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
                    <span className="text-white/60">Budget</span>
                    <span className="text-white font-medium">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(project.budget)}
                    </span>
                  </div>
                )}

                {/* Badge actif */}
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/40 rounded-full text-xs font-medium">
                    ✓ Actif
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton refresh */}
        <div className="mt-8 text-center">
          <button
            onClick={() => fetchActiveProjects()}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>
    </div>
  );
}
