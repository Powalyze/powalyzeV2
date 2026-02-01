"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export function Navbar() {
  const supabase = createSupabaseBrowserClient();
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800/50 hover:text-white";

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="w-full border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-slate-950 font-black text-xl">P</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Powalyze</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/cockpit/demo"
            className={`px-3 py-1 rounded-md text-sm ${isActive("/cockpit/demo")}`}
          >
            DEMO
          </Link>
          <Link
            href="/cockpit/pro"
            className={`px-3 py-1 rounded-md text-sm ${isActive("/cockpit/pro")}`}
          >
            PRO
          </Link>
        </div>

        <button
          onClick={logout}
          className="px-3 py-1 rounded-md text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
