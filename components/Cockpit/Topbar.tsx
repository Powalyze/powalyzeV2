"use client";

import { Bell, Search, User } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher un projet, risque, décision..."
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          className="relative p-2 hover:bg-slate-800 rounded-lg transition"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button 
          className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg transition"
          aria-label="User menu"
          title="User menu"
        >
          <User className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-300">Admin</span>
        </button>
      </div>
    </header>
  );
}
