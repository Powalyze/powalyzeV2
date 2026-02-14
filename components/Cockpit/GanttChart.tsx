"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Expand, Download, X, Save } from "lucide-react";

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies: string[];
  color: string;
}

interface EditModalProps {
  task: Task;
  onSave: (task: Task) => void;
  onClose: () => void;
}

function EditTaskModal({ task, onSave, onClose }: EditModalProps) {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Éditer la Tâche</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nom de la tâche
            </label>
            <input
              type="text"
              value={editedTask.name}
              onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date de début
            </label>
            <input
              type="date"
              value={formatDateForInput(editedTask.start)}
              onChange={(e) => setEditedTask({ ...editedTask, start: new Date(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date de fin
            </label>
            <input
              type="date"
              value={formatDateForInput(editedTask.end)}
              onChange={(e) => setEditedTask({ ...editedTask, end: new Date(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Progression: {editedTask.progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={editedTask.progress}
              onChange={(e) => setEditedTask({ ...editedTask, progress: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
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

  type ViewMode = "day" | "month" | "year";
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [viewStart, setViewStart] = useState(new Date(2026, 0, 1));
  const [viewEnd, setViewEnd] = useState(new Date(2026, 6, 1));
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Generate time periods based on view mode
  function getTimePeriods(): Date[] {
    const periods: Date[] = [];
    const current = new Date(viewStart);
    
    while (current <= viewEnd) {
      periods.push(new Date(current));
      
      if (viewMode === "day") {
        current.setDate(current.getDate() + 1);
      } else if (viewMode === "month") {
        current.setMonth(current.getMonth() + 1);
      } else {
        current.setFullYear(current.getFullYear() + 1);
      }
    }
    
    return periods;
  }

  const timePeriods = getTimePeriods();

  function navigateTime(direction: "prev" | "next") {
    const newStart = new Date(viewStart);
    const newEnd = new Date(viewEnd);
    
    if (viewMode === "day") {
      const days = 30;
      newStart.setDate(newStart.getDate() + (direction === "next" ? days : -days));
      newEnd.setDate(newEnd.getDate() + (direction === "next" ? days : -days));
    } else if (viewMode === "month") {
      const months = 3;
      newStart.setMonth(newStart.getMonth() + (direction === "next" ? months : -months));
      newEnd.setMonth(newEnd.getMonth() + (direction === "next" ? months : -months));
    } else {
      newStart.setFullYear(newStart.getFullYear() + (direction === "next" ? 1 : -1));
      newEnd.setFullYear(newEnd.getFullYear() + (direction === "next" ? 1 : -1));
    }
    
    setViewStart(newStart);
    setViewEnd(newEnd);
  }

  function goToToday() {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    
    if (viewMode === "day") {
      start.setDate(start.getDate() - 15);
      end.setDate(end.getDate() + 15);
    } else if (viewMode === "month") {
      start.setMonth(start.getMonth() - 3);
      end.setMonth(end.getMonth() + 3);
    } else {
      start.setFullYear(start.getFullYear() - 1);
      end.setFullYear(end.getFullYear() + 1);
    }
    
    setViewStart(start);
    setViewEnd(end);
  }

  function formatPeriodLabel(date: Date): string {
    if (viewMode === "day") {
      return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    } else if (viewMode === "month") {
      return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    } else {
      return date.getFullYear().toString();
    }
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

  function handleTaskClick(task: Task) {
    setEditingTask(task);
  }

  function handleSaveTask(updatedTask: Task) {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  }

  function handleCreateNewTask() {
    const newTask: Task = {
      id: Date.now().toString(),
      name: "Nouvelle Phase",
      start: new Date(),
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      progress: 0,
      dependencies: [],
      color: "#3b82f6",
    };
    
    setTasks([...tasks, newTask]);
    setEditingTask(newTask);
    setShowNewTaskModal(false);
  }

  return (
    <>
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Créer une nouvelle phase</h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-slate-400 mb-6">
              Une nouvelle phase sera créée avec des valeurs par défaut. Vous pourrez la modifier ensuite.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateNewTask}
                className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-medium transition-colors"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-white">Diagramme de Gantt</h3>
          
          {/* View Mode Selector */}
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === "day" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === "month" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setViewMode("year")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === "year" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Année
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => navigateTime("prev")}
              title="Période précédente"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => navigateTime("next")}
              title="Période suivante"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={goToToday}
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
            onClick={() => setShowNewTaskModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Nouvelle Phase
          </button>
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
              {timePeriods.map((period, i) => (
                <div
                  key={i}
                  className="flex-1 p-2 text-center border-r border-slate-800 text-sm min-w-[80px]"
                >
                  <div className="font-semibold text-white">
                    {formatPeriodLabel(period)}
                  </div>
                  {viewMode === "month" && (
                    <div className="text-xs text-slate-500 mt-1">
                      {getDaysInMonth(period)} jours
                    </div>
                  )}
                </div>
              ))}
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
                    {timePeriods.map((_, i) => (
                      <div key={i} className="flex-1 border-r border-slate-800/50" />
                    ))}
                  </div>

                  {/* Task Bar */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-8 rounded-lg cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                    style={{
                      left: position.left,
                      width: position.width,
                      backgroundColor: task.color,
                    }}
                    onClick={() => handleTaskClick(task)}
                    title="Cliquez pour éditer les dates"
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
    </>
  );
}
