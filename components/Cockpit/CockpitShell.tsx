"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Shield, 
  FileText, 
  GitBranch, 
  Brain, 
  Database, 
  Settings, 
  User,
  Menu,
  X,
  ChevronLeft,
  Globe
} from "lucide-react";

interface CockpitShellProps {
  children: ReactNode;
}

export function CockpitShell({ children }: CockpitShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/cockpit", icon: LayoutDashboard },
    { name: "Projets", href: "/cockpit/projets", icon: FolderKanban },
    { name: "Décisions", href: "/cockpit/decisions", icon: CheckSquare },
    { name: "Risques", href: "/cockpit/risques", icon: Shield },
    { name: "Rapports", href: "/cockpit/rapports", icon: FileText },
    { name: "Méthodologie", href: "/cockpit/methodologie", icon: GitBranch },
    { name: "IA Copilote", href: "/cockpit/ia", icon: Brain },
    { name: "Données & Intégrations", href: "/cockpit/donnees", icon: Database },
  ];

  const bottomNav = [
    { name: "Modules", href: "/cockpit/modules", icon: Settings },
    { name: "Profil", href: "/cockpit/profil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-slate-950 font-bold">P</span>
            </div>
            <span className="font-bold">Powalyze</span>
          </Link>
        </div>
        <button title="Changer de langue" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Globe size={20} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {sidebarOpen ? (
            <>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-slate-950 font-bold">P</span>
                </div>
                <span className="font-bold">Powalyze</span>
              </Link>
              <button
                title="Réduire le menu"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            </>
          ) : (
            <button
              title="Développer le menu"
              onClick={() => setSidebarOpen(true)}
              className="w-full flex justify-center"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-slate-950 font-bold">P</span>
              </div>
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                } ${!sidebarOpen && "justify-center"}`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 py-4 border-t border-slate-800 space-y-1">
          {bottomNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                } ${!sidebarOpen && "justify-center"}`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm">
          <aside className="fixed left-0 top-16 bottom-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-amber-500/10 text-amber-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-slate-800 space-y-1">
              {bottomNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-amber-500/10 text-amber-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`lg:transition-all lg:duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } pt-16 lg:pt-0`}
      >
        {children}
      </main>
    </div>
  );
}
