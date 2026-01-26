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
  Bell,
  Search,
  User,
  Gauge,
  LogOut,
  Sparkles
} from "lucide-react";

const navigation = [
  { name: "Cockpit", href: "/cockpit", icon: Gauge },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projets", href: "/projets", icon: FolderKanban },
  { name: "Portfolio", href: "/portfolio", icon: TrendingUp },
  { name: "Intelligence", href: "/intelligence", icon: Brain },
  { name: "Équipe", href: "/equipe", icon: Users },
  { name: "Rapports", href: "/rapports", icon: FileText },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/cockpit" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Powalyze
              </span>
            </Link>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                aria-label="Search"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button
                className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all relative"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  aria-label="User menu"
                  title="User menu"
                >
                  <User className="w-5 h-5" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <div className="font-semibold text-white">John Doe</div>
                      <div className="text-sm text-white/60">john@example.com</div>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/parametres"
                        className="flex items-center gap-3 p-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Paramètres
                      </Link>
                      <button
                        className="w-full flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-32"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-black border border-white/10 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Search className="w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Rechercher projets, équipes, documents..."
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                autoFocus
              />
            </div>
            <div className="p-4 text-sm text-white/60">
              Appuyez sur <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-300">ESC</kbd> pour fermer
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}

