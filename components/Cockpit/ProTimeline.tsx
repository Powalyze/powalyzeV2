type TimelineItem = {
  id: string;
  label: string;
  type: "decision" | "risk" | "report" | "project";
  date: string;
};

const defaultTimeline: TimelineItem[] = [
  {
    id: "1",
    label: "Validation du budget Q2 – Comité exécutif",
    type: "decision",
    date: "Aujourd'hui, 09:30"
  },
  {
    id: "2",
    label: "Mise à jour du risque – Dépendance fournisseur clé",
    type: "risk",
    date: "Hier, 16:10"
  },
  {
    id: "3",
    label: "Publication du rapport – Lancement Europe",
    type: "report",
    date: "Lundi, 11:00"
  },
  {
    id: "4",
    label: "Création du projet – Transformation digitale BU Industrie",
    type: "project",
    date: "Vendredi, 14:20"
  }
];

function badge(type: TimelineItem["type"]) {
  const base = "rounded-full px-2 py-[2px] text-[10px] border ";
  switch (type) {
    case "decision":
      return base + "border-emerald-500/40 text-emerald-300 bg-emerald-500/5";
    case "risk":
      return base + "border-red-500/40 text-red-300 bg-red-500/5";
    case "report":
      return base + "border-blue-500/40 text-blue-300 bg-blue-500/5";
    case "project":
    default:
      return base + "border-gold-500/40 text-gold-300 bg-gold-500/5";
  }
}

export function ProTimeline({ items = defaultTimeline }: { items?: TimelineItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 rounded-xl border border-neutral-900 bg-neutral-950/80 px-3 py-2"
        >
          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold-400" />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-neutral-100">{item.label}</p>
              <span className={badge(item.type)}>
                {item.type === "decision"
                  ? "Décision"
                  : item.type === "risk"
                  ? "Risque"
                  : item.type === "report"
                  ? "Rapport"
                  : "Projet"}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
