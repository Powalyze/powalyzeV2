"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, MoreVertical, User, Calendar, Tag } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type KanbanColumn = "backlog" | "todo" | "in_progress" | "review" | "done" | "blocked";

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  priority?: "low" | "medium" | "high" | "critical";
  column: KanbanColumn;
}

const COLUMNS: { id: KanbanColumn; title: string; color: string }[] = [
  { id: "backlog", title: "Backlog", color: "bg-slate-700" },
  { id: "todo", title: "À faire", color: "bg-blue-600" },
  { id: "in_progress", title: "En cours", color: "bg-amber-600" },
  { id: "review", title: "En revue", color: "bg-purple-600" },
  { id: "done", title: "Terminé", color: "bg-emerald-600" },
  { id: "blocked", title: "Bloqué", color: "bg-red-600" },
];

export default function KanbanPage() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadKanbanData();
  }, []);

  async function loadKanbanData() {
    setLoading(true);
    // TODO: Charger depuis l'API
    // Données demo pour l'instant
    setCards([
      {
        id: "1",
        title: "Migration Cloud Azure",
        description: "Finaliser la migration des services",
        projectName: "Infrastructure",
        assignee: "Jean Dupont",
        dueDate: "2026-02-15",
        tags: ["Infrastructure", "Cloud"],
        priority: "high",
        column: "in_progress",
      },
      {
        id: "2",
        title: "Refonte UI Dashboard",
        projectName: "Frontend",
        assignee: "Marie Martin",
        dueDate: "2026-02-20",
        tags: ["Design", "UX"],
        priority: "medium",
        column: "in_progress",
      },
      {
        id: "3",
        title: "API v2 Documentation",
        projectName: "Backend",
        assignee: "Pierre Dubois",
        tags: ["Documentation"],
        priority: "low",
        column: "todo",
      },
      {
        id: "4",
        title: "Tests d'intégration",
        projectName: "QA",
        assignee: "Sophie Bernard",
        dueDate: "2026-02-10",
        tags: ["Testing"],
        priority: "high",
        column: "review",
      },
      {
        id: "5",
        title: "Optimisation base de données",
        projectName: "Backend",
        tags: ["Performance"],
        priority: "medium",
        column: "backlog",
      },
    ]);
    setLoading(false);
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newColumn = destination.droppableId as KanbanColumn;
    
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === draggableId
          ? { ...card, column: newColumn }
          : card
      )
    );

    showToast("success", "Carte déplacée", `Déplacée vers ${COLUMNS.find(c => c.id === newColumn)?.title}`);
  }

  function getCardsByColumn(columnId: KanbanColumn): KanbanCard[] {
    return cards.filter(card => card.column === columnId);
  }

  function getPriorityColor(priority?: string): string {
    switch (priority) {
      case "critical": return "border-l-4 border-red-500";
      case "high": return "border-l-4 border-orange-500";
      case "medium": return "border-l-4 border-yellow-500";
      case "low": return "border-l-4 border-blue-500";
      default: return "border-l-4 border-slate-500";
    }
  }

  if (loading) {
    return (
      <CockpitShell>
        <div className="p-8 flex items-center justify-center">
          <div className="text-slate-400">Chargement du Kanban...</div>
        </div>
      </CockpitShell>
    );
  }

  return (
    <CockpitShell>
      <div className="h-screen flex flex-col bg-slate-950">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Vue Kanban</h1>
              <p className="text-slate-400 mt-1">Gérez vos tâches par glisser-déposer</p>
            </div>
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Plus size={20} />
              Nouvelle carte
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full min-w-max">
              {COLUMNS.map((column) => (
                <div key={column.id} className="flex flex-col w-80">
                  {/* Column Header */}
                  <div className={`${column.color} text-white px-4 py-3 rounded-t-lg flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{column.title}</h3>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                        {getCardsByColumn(column.id).length}
                      </span>
                    </div>
                    <button className="p-1 hover:bg-white/10 rounded">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  {/* Droppable Column */}
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 bg-slate-900/50 p-3 rounded-b-lg space-y-3 min-h-[200px] ${
                          snapshot.isDraggingOver ? "bg-slate-800/50" : ""
                        }`}
                      >
                        {getCardsByColumn(column.id).map((card, index) => (
                          <Draggable key={card.id} draggableId={card.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-slate-800 rounded-lg p-4 ${getPriorityColor(card.priority)} ${
                                  snapshot.isDragging ? "shadow-2xl ring-2 ring-amber-500" : ""
                                }`}
                              >
                                {/* Card Content */}
                                <h4 className="text-white font-medium mb-2">{card.title}</h4>
                                
                                {card.description && (
                                  <p className="text-slate-400 text-sm mb-3">{card.description}</p>
                                )}

                                {card.projectName && (
                                  <div className="text-xs text-amber-400 mb-3">
                                    📁 {card.projectName}
                                  </div>
                                )}

                                {/* Tags */}
                                {card.tags && card.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {card.tags.map((tag, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Meta Info */}
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                  {card.assignee && (
                                    <div className="flex items-center gap-1">
                                      <User size={12} />
                                      {card.assignee}
                                    </div>
                                  )}
                                  {card.dueDate && (
                                    <div className="flex items-center gap-1">
                                      <Calendar size={12} />
                                      {new Date(card.dueDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </CockpitShell>
  );
}
