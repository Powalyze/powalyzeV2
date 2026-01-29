import { Download, AlertTriangle } from 'lucide-react';

export default function MatriceRisquesPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">Matrice de risques : guide complet</h1>
        <p className="text-slate-400 mt-2">Probabilité × Impact = Criticité</p>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h2 className="text-xl font-bold mb-4">Matrice 5×5</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-2 text-left">Probabilité \ Impact</th>
                <th className="p-2">Négligeable</th>
                <th className="p-2">Faible</th>
                <th className="p-2">Moyen</th>
                <th className="p-2">Élevé</th>
                <th className="p-2">Critique</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-semibold">Quasi certain (90%)</td>
                <td className="p-2 text-center bg-yellow-500/20">🟡 M</td>
                <td className="p-2 text-center bg-orange-500/20">🟠 H</td>
                <td className="p-2 text-center bg-red-500/20">🔴 VH</td>
                <td className="p-2 text-center bg-red-600/30">🔴 VH</td>
                <td className="p-2 text-center bg-red-700/40">🔴 VH</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-semibold">Probable (70%)</td>
                <td className="p-2 text-center bg-green-500/20">🟢 L</td>
                <td className="p-2 text-center bg-yellow-500/20">🟡 M</td>
                <td className="p-2 text-center bg-orange-500/20">🟠 H</td>
                <td className="p-2 text-center bg-red-500/20">🔴 VH</td>
                <td className="p-2 text-center bg-red-600/30">🔴 VH</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-semibold">Possible (50%)</td>
                <td className="p-2 text-center bg-green-500/20">🟢 L</td>
                <td className="p-2 text-center bg-yellow-500/20">🟡 M</td>
                <td className="p-2 text-center bg-orange-500/20">🟠 H</td>
                <td className="p-2 text-center bg-orange-500/20">🟠 H</td>
                <td className="p-2 text-center bg-red-500/20">🔴 VH</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-semibold">Improbable (30%)</td>
                <td className="p-2 text-center bg-green-400/20">🟢 L</td>
                <td className="p-2 text-center bg-green-500/20">🟢 L</td>
                <td className="p-2 text-center bg-yellow-500/20">🟡 M</td>
                <td className="p-2 text-center bg-orange-500/20">🟠 H</td>
                <td className="p-2 text-center bg-red-500/20">🔴 VH</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Rare (10%)</td>
                <td className="p-2 text-center bg-green-400/20">🟢 L</td>
                <td className="p-2 text-center bg-green-500/20">🟢 L</td>
                <td className="p-2 text-center bg-yellow-500/20">🟡 M</td>
                <td className="p-2 text-center bg-yellow-500/20">🟡 M</td>
                <td className="p-2 text-center bg-orange-500/20">🟠 H</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30">
          <h3 className="text-xl font-bold mb-3 text-red-400">Risques VH (Very High)</h3>
          <p className="text-slate-300">Action immédiate. Escalade au COMEX. Plan de mitigation sous 24h.</p>
        </div>

        <div className="p-6 rounded-xl bg-orange-500/10 border border-orange-500/30">
          <h3 className="text-xl font-bold mb-3 text-orange-400">Risques H (High)</h3>
          <p className="text-slate-300">Surveillance renforcée. Plan d'action dans la semaine.</p>
        </div>

        <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <h3 className="text-xl font-bold mb-3 text-yellow-400">Risques M (Medium)</h3>
          <p className="text-slate-300">Suivi régulier. Mitigation si évolution négative.</p>
        </div>

        <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30">
          <h3 className="text-xl font-bold mb-3 text-green-400">Risques L (Low)</h3>
          <p className="text-slate-300">Acceptés. Revue trimestrielle.</p>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/matrice-risques.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
          <Download size={20} />
          Télécharger le PDF
        </a>
      </div>
    </div>
  );
}
