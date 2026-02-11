"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2, X, MessageSquare, AlertTriangle, Calendar, TrendingUp } from "lucide-react";

interface Notification {
  id: string;
  type: "mention" | "status_change" | "deadline" | "comment" | "risk";
  title: string;
  message: string;
  entity_type: string;
  entity_id: string;
  read: boolean;
  created_at: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Charger les notifications
    setNotifications([
      {
        id: "1",
        type: "mention",
        title: "Vous avez été mentionné",
        message: "Pierre Dubois vous a mentionné dans 'Migration Cloud Azure'",
        entity_type: "project",
        entity_id: "proj-1",
        read: false,
        created_at: new Date(Date.now() - 600000).toISOString(),
      },
      {
        id: "2",
        type: "deadline",
        title: "Échéance proche",
        message: "Le projet 'Refonte Mobile' doit être livré dans 2 jours",
        entity_type: "project",
        entity_id: "proj-2",
        read: false,
        created_at: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: "3",
        type: "risk",
        title: "Nouveau risque critique",
        message: "Risque de dépassement budgétaire sur 'Programme IA'",
        entity_type: "risk",
        entity_id: "risk-1",
        read: true,
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ]);
  }, []);

  function markAsRead(id: string) {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  function markAllAsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function deleteNotification(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  function getIcon(type: Notification["type"]) {
    switch (type) {
      case "mention": return <MessageSquare size={16} className="text-blue-400" />;
      case "status_change": return <TrendingUp size={16} className="text-green-400" />;
      case "deadline": return <Calendar size={16} className="text-amber-400" />;
      case "comment": return <MessageSquare size={16} className="text-purple-400" />;
      case "risk": return <AlertTriangle size={16} className="text-red-400" />;
    }
  }

  function formatRelativeTime(date: string): string {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
    return `Il y a ${Math.floor(diff / 86400)} j`;
  }

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 max-h-[600px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Notifications ({unreadCount})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Check size={14} />
                  Tout lire
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  Aucune notification
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer ${
                      !notif.read ? "bg-slate-800/30" : ""
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="mt-1">{getIcon(notif.type)}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-white text-sm">
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-500">
                            {formatRelativeTime(notif.created_at)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 text-center">
              <button className="text-sm text-amber-400 hover:text-amber-300 font-medium">
                Voir toutes les notifications →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
