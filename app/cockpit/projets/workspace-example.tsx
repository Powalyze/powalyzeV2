"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCurrentWorkspace } from "@/lib/useCurrentWorkspace";
import ExecutiveBlock from "@/components/ExecutiveBlock";
import { CockpitShell } from "@/components/cockpit/CockpitShell";
import Link from "next/link";
import { Plus } from "lucide-react";

type Project = {
  id: string;
  name: string;
  status: string;
  rag_status?: string;
  progress?: number;
  created_at: string;
};

export default function ProjetsPage() {
  const { workspaceId, loading: wsLoading } = useCurrentWorkspace();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId || wsLoading) return;

    async function loadProjects() {
      setLoading(true);

      const { data = [] } = await supabase
        .from("projects")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      setProjects(data as Project[]);
      setLoading(false);
    }

    loadProjects();
  }, [workspaceId, wsLoading]);

  return (
    <CockpitShell>
      <div className="p-6 space-y-6">
        {/* Executive Block */}
        <ExecutiveBlock />

        {/* Header avec bouton Créer */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Mes Projets</h1>
          <Link
            href="/cockpit/projets/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Créer un projet
          </Link>
        </div>

        {/* Liste des projets */}
        {wsLoading || loading ? (
          <div className="text-center py-12 text-slate-400">
            Chargement des projets...
          </div>
        ) : !workspaceId ? (
          <div className="text-center py-12 text-slate-400">
            Vous devez être connecté pour voir vos projets.
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">
              Aucun projet dans ce workspace.
            </p>
            <Link
              href="/cockpit/projets/nouveau"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              <Plus size={20} />
              Créer votre premier projet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/cockpit/projets/${project.id}`}
                className="block p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-amber-500 hover:bg-slate-800 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white text-lg">
                    {project.name}
                  </h3>
                  {project.rag_status && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        project.rag_status === "GREEN"
                          ? "bg-green-500/20 text-green-400"
                          : project.rag_status === "YELLOW"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {project.rag_status}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span
                    className={`px-2 py-1 rounded ${
                      project.status === "active"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-slate-600 text-slate-300"
                    }`}
                  >
                    {project.status}
                  </span>
                  {project.progress !== undefined && (
                    <span>{project.progress}%</span>
                  )}
                </div>

                {project.progress !== undefined && (
                  <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      data-progress={project.progress}
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </CockpitShell>
  );
}
