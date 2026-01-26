"use client";

import { useState } from "react";
import { User, Settings, LogOut, Crown, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50">
            <div className="p-4 border-b border-slate-800">
              <div className="text-sm font-medium text-white">Mon Compte</div>
              <div className="text-xs text-slate-400 mt-1">user@powalyze.com</div>
            </div>
            <div className="p-2">
              <Link
                href="/cockpit/pro"
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors group"
              >
                <Crown className="w-5 h-5 text-amber-500" />
                <span className="text-slate-300 group-hover:text-white">Mode PRO</span>
              </Link>
              <Link
                href="/parametres"
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors group"
              >
                <Settings className="w-5 h-5 text-slate-400 group-hover:text-white" />
                <span className="text-slate-300 group-hover:text-white">Paramètres</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-lg transition-colors group disabled:opacity-50"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-red-500">{loading ? "Déconnexion..." : "Déconnexion"}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
