"use client";

import React, { useState } from "react";
import { Plus, MoreVertical, Calendar, User, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  tags: string[];
  dueDate: string;
}

const tasks: Record<string, Task[]> = {
  todo: [
    {
      id: "1",
      title: "Spécifications techniques Azure Migration",
      description: "Rédiger les specs détaillées pour la migration cloud",
      assignee: "Sophie Martin",
      priority: "high",
      tags: ["Architecture", "Cloud"],
      dueDate: "2026-02-20"
    },
    {
      id: "2",
      title: "Audit sécurité infrastructure",
      description: "Audit complet de la sécurité réseau et firewall",
      assignee: "Pierre Bernard",
      priority: "medium",
      tags: ["Sécurité"],
      dueDate: "2026-02-25"
    },
  ],
  "in-progress": [
    {
      id: "3",
      title: "Développement API Gateway",
      description: "Implémentation de l'API Gateway Azure",
      assignee: "Thomas Dubois",
      priority: "high",
      tags: ["Développement", "Azure"],
      dueDate: "2026-02-15"
    },
    {
      id: "4",
      title: "Tests d'intégration SAP",
      description: "Tests de connexion SAP S/4HANA",
      assignee: "Marie Laurent",
      priority: "high",
      tags: ["Tests", "SAP"],
      dueDate: "2026-02-18"
    },
    {
      id: "5",
      title: "Configuration Power BI Workspace",
      description: "Setup workspace et permissions Power BI",
      assignee: "Claire Moreau",
      priority: "medium",
      tags: ["BI", "Analytics"],
      dueDate: "2026-02-22"
    },
  ],
  review: [
    {
      id: "6",
      title: "Documentation architecture microservices",
      description: "Révision de la doc architecture",
      assignee: "Julien Petit",
      priority: "medium",
      tags: ["Documentation"],
      dueDate: "2026-02-16"
    },
  ],
  done: [
    {
      id: "7",
      title: "Setup environnement dev",
      description: "Configuration des environnements dev et staging",
      assignee: "Sophie Martin",
      priority: "high",
      tags: ["DevOps"],
      dueDate: "2026-02-10"
    },
    {
      id: "8",
      title: "Formation équipe Azure",
      description: "Session de formation Azure pour l'équipe",
      assignee: "Thomas Dubois",
      priority: "medium",
      tags: ["Formation"],
      dueDate: "2026-02-12"
    },
  ]
};

export default function KanbanPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Kanban</h1>
          <p className="text-slate-400">Gestion visuelle des tâches et du flux de travail</p>
        </div>
        <Button variant="primary" size="lg">
          <Plus size={20} />
          Nouvelle tâche
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <KanbanColumn
          title="À faire"
          tasks={tasks.todo}
          count={tasks.todo.length}
          color="slate"
        />
        <KanbanColumn
          title="En cours"
          tasks={tasks["in-progress"]}
          count={tasks["in-progress"].length}
          color="amber"
        />
        <KanbanColumn
          title="En révision"
          tasks={tasks.review}
          count={tasks.review.length}
          color="sky"
        />
        <KanbanColumn
          title="Terminé"
          tasks={tasks.done}
          count={tasks.done.length}
          color="emerald"
        />
      </div>
    </div>
  );
}

function KanbanColumn({
  title,
  tasks,
  count,
  color,
}: {
  title: string;
  tasks: Task[];
  count: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    slate: "bg-slate-700",
    amber: "bg-amber-500",
    sky: "bg-sky-500",
    emerald: "bg-emerald-500",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <span className="px-2 py-1 bg-slate-800 rounded-full text-sm text-slate-400">
            {count}
          </span>
        </div>
        <div className={`h-1 rounded-full ${colorClasses[color]}`} />
      </div>

      {/* Tasks */}
      <div className="space-y-3 flex-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {/* Add Task Button */}
        <button className="w-full p-4 border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-lg transition-colors text-slate-500 hover:text-slate-400 flex items-center justify-center gap-2">
          <Plus size={18} />
          Ajouter une tâche
        </button>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="cursor-move hover:shadow-xl transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-white leading-tight flex-1 pr-2">
            {task.title}
          </h4>
          <button className="p-1 hover:bg-slate-800 rounded transition-colors">
            <MoreVertical size={16} className="text-slate-400" />
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-3 leading-relaxed">
          {task.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-800/50 rounded text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-xs font-bold text-slate-950">
              {task.assignee.split(" ").map(n => n[0]).join("")}
            </div>
            <span className="text-xs text-slate-400">{task.assignee}</span>
          </div>
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
          <Calendar size={12} />
          {new Date(task.dueDate).toLocaleDateString('fr-FR')}
        </div>
      </CardContent>
    </Card>
  );
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const config = {
    high: { label: "Haute", variant: "danger" as const },
    medium: { label: "Moyenne", variant: "warning" as const },
    low: { label: "Basse", variant: "neutral" as const },
  };

  const { label, variant } = config[priority];
  return <Badge variant={variant}>{label}</Badge>;
}

