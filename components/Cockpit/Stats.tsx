interface Props {
  dashboard: any;
}

export default function Stats({ dashboard }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-slate-800">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
          Projets Actifs
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-slate-100">{dashboard.projects.active}</div>
          <div className="text-[10px] text-slate-500">/ {dashboard.projects.total}</div>
        </div>
        <div className="flex gap-1 mt-2">
          <div className="h-1.5 flex-1 bg-emerald-500/30 rounded" style={{width: `${(dashboard.projects.by_rag.GREEN / dashboard.projects.total) * 100}%`}} />
          <div className="h-1.5 flex-1 bg-amber-400/30 rounded" style={{width: `${(dashboard.projects.by_rag.YELLOW / dashboard.projects.total) * 100}%`}} />
          <div className="h-1.5 flex-1 bg-red-500/30 rounded" style={{width: `${(dashboard.projects.by_rag.RED / dashboard.projects.total) * 100}%`}} />
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
          Risques Critiques
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-red-400">{dashboard.risks.critical}</div>
          <div className="text-[10px] text-slate-500">/ {dashboard.risks.total}</div>
        </div>
        <div className="text-[10px] text-slate-400 mt-2">
          {dashboard.risks.high_probability} haute probabilité
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
          Décisions en Attente
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-amber-400">{dashboard.decisions.pending}</div>
          <div className="text-[10px] text-slate-500">/ {dashboard.decisions.total}</div>
        </div>
        <div className="text-[10px] text-slate-400 mt-2">
          Comités à préparer
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
          Actions en Retard
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-red-500">{dashboard.actions.overdue}</div>
          <div className="text-[10px] text-slate-500">/ {dashboard.actions.total}</div>
        </div>
        <div className="text-[10px] text-slate-400 mt-2">
          {dashboard.actions.critical} critiques
        </div>
      </div>
    </div>
  );
}
