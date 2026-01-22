"use client";

import { motion } from "framer-motion";

export function Insights() {
  return (
    <div className="space-y-8">
      <KPIs />
      <InsightsChart />
      <InsightsTable />
    </div>
  );
}

/* ---------------- KPIs ---------------- */

function KPIs() {
  const items = [
    {
      label: "Projets actifs",
      value: "42",
      delta: "+8% vs mois dernier",
      color: "text-blue-400",
    },
    {
      label: "Budget total",
      value: "7.8M€",
      delta: "98% consommé",
      color: "text-red-400",
    },
    {
      label: "Taux de succès",
      value: "94%",
      delta: "+4 pts au-dessus objectif",
      color: "text-emerald-400",
    },
    {
      label: "Équipes actives",
      value: "287",
      delta: "92% charge moyenne",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {items.map((kpi, i) => (
        <div
          key={i}
          className="bg-slate-900/60 border border-slate-800 rounded-xl p-4"
        >
          <div className="text-slate-400 text-sm">{kpi.label}</div>
          <div className="text-xl font-semibold mt-1">{kpi.value}</div>
          <div className={`text-xs mt-1 ${kpi.color}`}>{kpi.delta}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- CHART ---------------- */

function InsightsChart() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200">
          Linear Insights — Cycle Time
        </h3>

        <div className="flex gap-2 text-[0.7rem] text-slate-400">
          <span className="px-2 py-[2px] rounded-full border border-slate-600">
            Mesure : Cycle time
          </span>
          <span className="px-2 py-[2px] rounded-full border border-slate-600">
            Slice : Date de création
          </span>
          <span className="px-2 py-[2px] rounded-full border border-slate-600">
            Segment : Équipe
          </span>
        </div>
      </div>

      <div className="h-64 rounded-xl bg-gradient-to-b from-sky-500/20 via-transparent to-transparent border border-slate-800 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_80%,rgba(59,130,246,0.7)_0,transparent_55%),radial-gradient(circle_at_70%_20%,rgba(244,114,182,0.7)_0,transparent_55%),radial-gradient(circle_at_40%_40%,rgba(52,211,153,0.7)_0,transparent_55%)] mix-blend-screen opacity-80"
          animate={{ x: [-10, 10], y: [0, -6] }}
          transition={{ duration: 16, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
    </div>
  );
}

/* ---------------- TABLE ---------------- */

function InsightsTable() {
  const rows = [
    { team: "Team Alpha", issues: "32%", time: "6.2 j", risk: "Oui" },
    { team: "Team Beta", issues: "21%", time: "3.8 j", risk: "Non" },
    { team: "Team Cloud", issues: "18%", time: "4.1 j", risk: "Non" },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3 text-slate-200">
        Performance par équipe
      </h3>

      <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] text-xs text-slate-400 border-b border-slate-800 pb-1 mb-1">
        <div>Équipe</div>
        <div>Issues</div>
        <div>Temps moyen</div>
        <div>À risque</div>
      </div>

      {rows.map((r, i) => (
        <div
          key={i}
          className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] py-[6px] text-sm"
        >
          <div>{r.team}</div>
          <div>{r.issues}</div>
          <div>{r.time}</div>
          <div className={r.risk === "Oui" ? "text-red-400" : ""}>{r.risk}</div>
        </div>
      ))}
    </div>
  );
}
