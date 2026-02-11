"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, Clock, Star } from "lucide-react";

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  keywords: string[];
  action: () => void;
  icon?: React.ReactNode;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: "create-project",
      title: "Créer un nouveau projet",
      subtitle: "Démarrer un nouveau projet dans le portfolio",
      category: "Actions",
      keywords: ["new", "create", "project", "nouveau", "créer", "projet"],
      action: () => console.log("Create project"),
    },
    {
      id: "create-risk",
      title: "Ajouter un risque",
      subtitle: "Créer un nouveau risque",
      category: "Actions",
      keywords: ["risk", "risque", "add", "ajouter"],
      action: () => console.log("Create risk"),
    },
    {
      id: "goto-kanban",
      title: "Aller au Kanban",
      subtitle: "Ouvrir le tableau Kanban",
      category: "Navigation",
      keywords: ["kanban", "board", "tableau"],
      action: () => (window.location.href = "/cockpit/kanban"),
    },
    {
      id: "goto-gantt",
      title: "Voir le Gantt",
      subtitle: "Ouvrir le diagramme de Gantt",
      category: "Navigation",
      keywords: ["gantt", "timeline", "planning"],
      action: () => (window.location.href = "/cockpit/gantt"),
    },
    {
      id: "goto-kpi",
      title: "Dashboard KPI",
      subtitle: "Voir les indicateurs de performance",
      category: "Navigation",
      keywords: ["kpi", "dashboard", "metrics", "indicateurs"],
      action: () => (window.location.href = "/cockpit/kpi"),
    },
    {
      id: "export-excel",
      title: "Exporter en Excel",
      subtitle: "Télécharger les données du portfolio",
      category: "Export",
      keywords: ["export", "excel", "download", "télécharger"],
      action: () => console.log("Export Excel"),
    },
    {
      id: "settings",
      title: "Paramètres",
      subtitle: "Configurer l'application",
      category: "Système",
      keywords: ["settings", "config", "paramètres"],
      action: () => (window.location.href = "/cockpit/settings"),
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    const searchLower = search.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(searchLower) ||
      cmd.subtitle?.toLowerCase().includes(searchLower) ||
      cmd.keywords.some((k) => k.includes(searchLower))
    );
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (!isOpen) return;

      // Escape
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearch("");
      }

      // Arrow navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      }

      // Enter to execute
      if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
        setSearch("");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm">
      {/* Modal */}
      <div className="w-full max-w-2xl mx-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800">
          <Search size={20} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Que voulez-vous faire ? (Ctrl+K pour ouvrir/fermer)"
            className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none"
          />
          <kbd className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Aucune commande trouvée pour "{search}"
            </div>
          ) : (
            <>
              {Object.entries(
                filteredCommands.reduce((acc, cmd) => {
                  if (!acc[cmd.category]) acc[cmd.category] = [];
                  acc[cmd.category].push(cmd);
                  return acc;
                }, {} as Record<string, Command[]>)
              ).map(([category, cmds]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                    {category}
                  </div>
                  {cmds.map((cmd, index) => {
                    const globalIndex = filteredCommands.indexOf(cmd);
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          isSelected
                            ? "bg-amber-500/20 border-l-2 border-amber-500"
                            : "hover:bg-slate-800/50 border-l-2 border-transparent"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-white">{cmd.title}</div>
                          {cmd.subtitle && (
                            <div className="text-sm text-slate-400 mt-0.5">
                              {cmd.subtitle}
                            </div>
                          )}
                        </div>
                        <ArrowRight
                          size={16}
                          className={`text-slate-500 ${
                            isSelected ? "text-amber-400" : ""
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">↓</kbd>
              pour naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">Enter</kbd>
              pour sélectionner
            </span>
          </div>
          <span>
            {filteredCommands.length} résultat(s)
          </span>
        </div>
      </div>
    </div>
  );
}
