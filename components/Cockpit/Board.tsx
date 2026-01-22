"use client";

import { useState } from "react";

export function Board() {
  const [rows, setRows] = useState([
    {
      id: 1,
      projet: "Migration Cloud",
      owner: "Alice",
      statut: "En cours",
      budget: "1.2M€",
      risque: "Moyen",
      deadline: "2025-03-12",
    },
    {
      id: 2,
      projet: "ERP Finance",
      owner: "Marc",
      statut: "À risque",
      budget: "3.4M€",
      risque: "Élevé",
      deadline: "2025-06-01",
    },
    {
      id: 3,
      projet: "Refonte Mobile",
      owner: "Sarah",
      statut: "OK",
      budget: "650K€",
      risque: "Faible",
      deadline: "2025-02-20",
    },
  ]);

  const statuses = {
    "En cours": "bg-blue-500",
    "À risque": "bg-red-500",
    OK: "bg-emerald-500",
  };

  const risks = {
    Faible: "text-emerald-400",
    Moyen: "text-yellow-400",
    Élevé: "text-red-400",
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Tableau des projets</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b border-slate-700">
            <tr>
              <th className="text-left py-2">Projet</th>
              <th className="text-left py-2">Owner</th>
              <th className="text-left py-2">Statut</th>
              <th className="text-left py-2">Budget</th>
              <th className="text-left py-2">Risque</th>
              <th className="text-left py-2">Deadline</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-800 hover:bg-slate-800/40 transition"
              >
                <td className="py-3">{row.projet}</td>
                <td>{row.owner}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs text-white ${statuses[row.statut]}`}
                  >
                    {row.statut}
                  </span>
                </td>

                <td>{row.budget}</td>

                <td className={risks[row.risque]}>{row.risque}</td>

                <td>{row.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
