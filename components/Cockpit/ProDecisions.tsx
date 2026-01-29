type Decision = {
  id: string;
  title: string;
  status: "À valider" | "Validée" | "En revue";
  owner: string;
};

const defaultDecisions: Decision[] = [
  {
    id: "d1",
    title: "Arbitrage budget marketing vs R&D",
    status: "À valider",
    owner: "Comité exécutif"
  },
  {
    id: "d2",
    title: "Choix du partenaire Cloud principal",
    status: "En revue",
    owner: "CTO + DSI"
  },
  {
    id: "d3",
    title: "Priorisation des pays pour le lancement Europe",
    status: "Validée",
    owner: "Direction Générale"
  }
];

function decisionColor(status: Decision["status"]) {
  switch (status) {
    case "À valider":
      return "text-amber-300 border-amber-500/40 bg-amber-500/5";
    case "Validée":
      return "text-emerald-300 border-emerald-500/40 bg-emerald-500/5";
    case "En revue":
    default:
      return "text-blue-300 border-blue-500/40 bg-blue-500/5";
  }
}

export function ProDecisions({ decisions = defaultDecisions }: { decisions?: Decision[] }) {
  return (
    <div className="space-y-2">
      {decisions.map((decision) => (
        <div
          key={decision.id}
          className="flex items-start justify-between gap-3 rounded-xl border border-neutral-900 bg-neutral-950/80 px-3 py-2"
        >
          <div>
            <p className="text-xs text-neutral-100">{decision.title}</p>
            <p className="mt-1 text-[11px] text-neutral-500">
              Porteur : {decision.owner}
            </p>
          </div>
          <span
            className={
              "rounded-full border px-2 py-[2px] text-[10px] " +
              decisionColor(decision.status)
            }
          >
            {decision.status}
          </span>
        </div>
      ))}
    </div>
  );
}
