"use client";

type ProHeaderProps = {
  userName?: string;
  orgName?: string;
};

export function ProHeader({ userName = "Direction", orgName = "Powalyze" }: ProHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
          Cockpit exécutif
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gold-400">
          Vue d'ensemble – {orgName}
        </h1>
        <p className="mt-2 text-sm text-neutral-300 max-w-xl">
          Synthèse en temps réel des projets, risques, décisions et rapports pour {userName}.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          Mode Pro actif
        </span>
        <button className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300 hover:border-neutral-500 hover:text-white">
          Exporter la vue
        </button>
      </div>
    </header>
  );
}
