import Link from "next/link";

export default function CockpitDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/30">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/cockpit-demo" className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" stroke="#C9A227" strokeWidth="4" />
                <path d="M30 55 L50 25 L70 55 L50 75 Z" fill="#C9A227" />
              </svg>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Powalyze</div>
                <div className="text-sm text-slate-300">Cockpit Exécutif DEMO</div>
              </div>
            </Link>
            <nav className="flex items-center gap-1 ml-6">
              <Link
                href="/cockpit-demo/portefeuille"
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
              >
                Portefeuille
              </Link>
              <Link
                href="/cockpit-demo/risques"
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
              >
                Risques
              </Link>
              <Link
                href="/cockpit-demo/decisions"
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
              >
                Décisions
              </Link>
              <Link
                href="/cockpit-demo/anomalies"
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
              >
                Anomalies
              </Link>
              <Link
                href="/cockpit-demo/rapports"
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
              >
                Rapports
              </Link>
              <Link
                href="/cockpit-demo/connecteurs"
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
              >
                Connecteurs
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs font-semibold uppercase">MODE DÉMO</span>
            </div>
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-slate-400 hover:text-red-400 transition"
            >
              Déconnexion
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-8 py-6">{children}</main>
    </div>
  );
}
