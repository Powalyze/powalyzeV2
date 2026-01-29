type Report = {
  id: string;
  title: string;
  scope: string;
  date: string;
};

const defaultReports: Report[] = [
  {
    id: "rep1",
    title: "Synthèse exécutive – Lancement Europe",
    scope: "Projets + Risques + Décisions",
    date: "Publié le 05.02"
  },
  {
    id: "rep2",
    title: "Rapport trimestriel – Transformation digitale",
    scope: "Portefeuille projets",
    date: "Publié le 28.01"
  }
];

export function ProReports({ reports = defaultReports }: { reports?: Report[] }) {
  return (
    <div className="space-y-2">
      {reports.map((report) => (
        <div
          key={report.id}
          className="flex items-start justify-between gap-3 rounded-xl border border-neutral-900 bg-neutral-950/80 px-3 py-2"
        >
          <div>
            <p className="text-xs text-neutral-100">{report.title}</p>
            <p className="mt-1 text-[11px] text-neutral-500">
              {report.scope}
            </p>
            <p className="mt-1 text-[11px] text-neutral-600">
              {report.date}
            </p>
          </div>
          <button className="mt-1 rounded-full border border-neutral-700 px-2 py-[2px] text-[10px] text-neutral-300 hover:border-neutral-500 hover:text-white">
            Ouvrir
          </button>
        </div>
      ))}
    </div>
  );
}
