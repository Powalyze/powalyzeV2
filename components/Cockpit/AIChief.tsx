"use client";

import { useState } from "react";

export function AIChief() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      text: "Analyse en cours : 42 projets, 7.8M€ de budget, 287 équipes. Aucun blocage critique.",
    },
    {
      role: "assistant",
      text: "Recommandation : Optimiser portefeuille Q2 (+12% vélocité).",
    },
  ]);

  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", text: input }]);
    setInput("");

    // Simulation IA
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Analyse IA : Opportunité détectée — réduction de coûts possible de 8% sans impact sur délais.",
        },
      ]);
    }, 600);
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
      <h2 className="text-xl font-semibold">Chief of Staff IA</h2>

      <div className="h-64 overflow-y-auto space-y-3 pr-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg text-sm ${
              m.role === "assistant"
                ? "bg-slate-800 text-slate-200"
                : "bg-slate-700 text-slate-100"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm"
          placeholder="Pose une question stratégique..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
