type Kpi = {
  label: string;
  value: string;
  trend?: "up" | "down" | "flat";
  detail?: string;
};

const defaultKpis: Kpi[] = [
  {
    label: "Projets actifs",
    value: "7",
    trend: "up",
    detail: "+2 vs mois dernier"
  },
  {
    label: "Décisions en attente",
    value: "4",
    trend: "down",
    detail: "-3 vs semaine dernière"
  },
  {
    label: "Risques critiques",
    value: "2",
    trend: "flat",
    detail: "Stables"
  },
  {
    label: "Rapports publiés ce mois",
    value: "5",
    trend: "up",
    detail: "+2 vs moyenne"
  }
];

export function ProKpiGrid({ kpis = defaultKpis }: { kpis?: Kpi[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900 px-3 py-3"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            {kpi.label}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gold-300">
              {kpi.value}
            </span>
            {kpi.trend && (
              <span
                className={
                  "text-[11px] " +
                  (kpi.trend === "up"
                    ? "text-emerald-400"
                    : kpi.trend === "down"
                    ? "text-red-400"
                    : "text-neutral-400")
                }
              >
                {kpi.detail}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
