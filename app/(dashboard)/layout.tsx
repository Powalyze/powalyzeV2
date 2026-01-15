"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  TrendingUp,
  Brain,
  BarChart3,
  Users,
  Zap,
  FileText,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  User,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Projets", href: "/projets", icon: <FolderKanban size={20} /> },
  { name: "Portfolio", href: "/portfolio", icon: <TrendingUp size={20} /> },
  { name: "Kanban", href: "/kanban", icon: <FolderKanban size={20} /> },
  { name: "Intelligence", href: "/intelligence", icon: <Brain size={20} /> },
  { name: "Rapports", href: "/rapports", icon: <BarChart3 size={20} /> },
  { name: "Équipe", href: "/equipe", icon: <Users size={20} /> },
  { name: "Intégrations", href: "/integrations", icon: <Zap size={20} /> },
  { name: "Documents", href: "/documents", icon: <FileText size={20} /> },
  { name: "Paramètres", href: "/parametres", icon: <Settings size={20} /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-slate-950 font-bold text-sm">P</span>
            </div>
            <span className="text-white font-bold text-lg">Powalyze</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-amber-400/10 text-amber-400 font-semibold shadow-lg shadow-amber-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-xs text-slate-400 truncate">admin@powalyze.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <Menu size={24} />
              </button>

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 min-w-[300px]">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-full"
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-lg transition-all font-semibold text-sm shadow-lg shadow-amber-500/20">
                Nouveau projet
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
