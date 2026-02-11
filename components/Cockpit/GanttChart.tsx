"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Expand, Download } from "lucide-react";

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies: string[];
  color: string;
}

export function GanttChart() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Phase 1 : Analyse",
      start: new Date(2026, 0, 1),
      end: new Date(2026, 0, 15),
      progress: 100,
      dependencies: [],
      color: "#10b981",
    },
    {
      id: "2",
      name: "Phase 2 : Conception",
      start: new Date(2026, 0, 16),
      end: new Date(2026, 1, 15),
      progress: 75,
      dependencies: ["1"],
      color: "#3b82f6",
    },
    {
      id: "3",
      name: "Phase 3 : Développement",
      start: new Date(2026, 1, 16),
      end: new Date(2026, 3, 30),
      progress: 40,
      dependencies: ["2"],
      color: "#f59e0b",
    },
    {
      id: "4",
      name: "Phase 4 : Tests",
      start: new Date(2026, 4, 1),
      end: new Date(2026, 4, 30),
      progress: 0,
      dependencies: ["3"],
      color: "#8b5cf6",
    },
    {
      id: "5",
      name: "Phase 5 : Déploiement",
      start: new Date(2026, 5, 1),
      end: new Date(2026, 5, 15),
      progress: 0,
      dependencies: ["4"],
      color: "#ef4444",
    },
  ]);

  const [viewStart, setViewStart] = useState(new Date(2026, 0, 1));
  const [viewEnd, setViewEnd] = useState(new Date(2026, 6, 1));
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const months: Date[] = [];
  const current = new Date(viewStart);
  while (current <= viewEnd) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  function getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getTaskPosition(task: Task) {
    const totalDays = Math.floor((viewEnd.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24));
    const startOffset = Math.floor((task.start.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.floor((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24));

    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;

    return { left: `${left}%`, width: `${width}%` };
  }

  function handleTaskDrag(taskId: string, e: React.MouseEvent) {
    setDraggedTask(taskId);
    // TODO: Implémenter le drag & drop pour modifier les dates
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-white">Diagramme de Gantt</h3>
          <div className="flex gap-2">
            <button
              title="Mois précédent"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              title="Mois suivant"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronRight size={18} />
            </button>
            <button
              title="Aujourd'hui"
              className="px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <Calendar size={16} />
              Aujourd'hui
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            title="Plein écran"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Expand size={18} />
          </button>
          <button
            title="Exporter"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Gantt Chart */}
      <div ref={chartRef} className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Timeline Header */}
          <div className="flex border-b border-slate-800">
            <div className="w-64 flex-shrink-0 p-4 bg-slate-900 border-r border-slate-800 font-semibold text-white">
              Tâche
            </div>
            <div className="flex-1 flex">
              {months.map((month, i) => {
                const daysInMonth = getDaysInMonth(month);
                return (
                  <div
                    key={i}
                    className="flex-1 p-2 text-center border-r border-slate-800 text-sm"
                  >
                    <div className="font-semibold text-white">
                      {month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{daysInMonth} jours</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tasks */}
          {tasks.map((task) => {
            const position = getTaskPosition(task);
            return (
              <div key={task.id} className="flex border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                {/* Task Name */}
                <div className="w-64 flex-shrink-0 p-4 bg-slate-900 border-r border-slate-800">
                  <div className="font-medium text-white">{task.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {task.progress}% complété
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 relative h-16 p-2">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex">
                    {months.map((_, i) => (
                      <div key={i} className="flex-1 border-r border-slate-800/50" />
                    ))}
                  </div>

                  {/* Task Bar */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-8 rounded-lg cursor-move hover:shadow-lg transition-shadow"
                    style={{
                      ...position,
                      backgroundColor: task.color,
                    }}
                    onMouseDown={(e) => handleTaskDrag(task.id, e)}
                  >
                    {/* Progress */}
                    <div
                      className="h-full rounded-lg bg-white/20"
                      style={{ width: `${task.progress}%` }}
                    />

                    {/* Label */}
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2 truncate">
                      {task.name}
                    </div>

                    {/* Resize Handles */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize" />
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize" />
                  </div>

                  {/* Dependencies */}
                  {task.dependencies.map((depId) => {
                    const depTask = tasks.find((t) => t.id === depId);
                    if (!depTask) return null;
                    // TODO: Dessiner les flèches de dépendance avec SVG
                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-slate-800 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-slate-400">Terminé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span className="text-slate-400">En cours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span className="text-slate-400">À venir</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span className="text-slate-400">En retard</span>
        </div>
      </div>
    </div>
  );
}
