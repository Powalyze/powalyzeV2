type Risk = {
  id: string;
  title: string;
  level: "Critique" | "Élevé" | "Modéré";
  owner: string;
};

const defaultRisks: Risk[] = [
  {
    id: "r1",
    title: "Dépendance fournisseur unique – Composant clé",
    level: "Critique",
    owner: "Direction Achats"
  },
  {
    id: "r2",
    title: "Retard potentiel – Migration Cloud",
    level: "Élevé",
    owner: "CTO"
  },
  {
    id: "r3",
    title: "Surcharge équipes – Lancement Europe",
    level: "Modéré",
    owner: "COO"
  }
];

function riskColor(level: Risk["level"]) {
  switch (level) {
    case "Critique":
      return "text-red-300 border-red-500/40 bg-red-500/5";
    case "Élevé":
      return "text-amber-300 border-amber-500/40 bg-amber-500/5";
    case "Modéré":
    default:
      return "text-neutral-300 border-neutral-500/40 bg-neutral-500/5";
  }
}

export function ProRisks({ risks = defaultRisks }: { risks?: Risk[] }) {
  return (
    <div className="space-y-2">
      {risks.map((risk) => (
        <div
          key={risk.id}
          className="flex items-start justify-between gap-3 rounded-xl border border-neutral-900 bg-neutral-950/80 px-3 py-2"
        >
          <div>
            <p className="text-xs text-neutral-100">{risk.title}</p>
            <p className="mt-1 text-[11px] text-neutral-500">
              Responsable : {risk.owner}
            </p>
          </div>
          <span
            className={
              "rounded-full border px-2 py-[2px] text-[10px] " +
              riskColor(risk.level)
            }
          >
            {risk.level}
          </span>
        </div>
      ))}
    </div>
  );
}
