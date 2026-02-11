"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export default function PourquoiPowalyzePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <div className="px-8 py-20 text-center border-b border-slate-800">
        <h1 className="text-5xl font-bold text-[#D4AF37] mb-4">
          Pourquoi Powalyze ?
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Les autres outils montrent ce qui s&apos;est passé.
          <br />
          <span className="text-[#D4AF37] font-semibold">
            Powalyze montre ce qui va se passer.
          </span>
        </p>
      </div>

      {/* 3 Messages clés */}
      <div className="px-8 py-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Les autres affichent des données
            </h3>
            <p className="text-sm text-slate-400">
              Powalyze raconte une histoire
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-8 text-center">
            <div className="text-4xl mb-4">🔮</div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Les autres montrent le passé
            </h3>
            <p className="text-sm text-slate-400">
              Powalyze prédit l&apos;avenir
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Les autres attendent vos décisions
            </h3>
            <p className="text-sm text-slate-400">
              Powalyze propose les décisions
            </p>
          </div>
        </div>
      </div>

      {/* Tableau comparatif */}
      <div className="px-8 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#D4AF37] text-center mb-12">
          Powalyze vs Concurrents
        </h2>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Domaine
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Concurrents
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4AF37]">
                  Powalyze
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  domain: "Projets",
                  competitors: "Basique",
                  powalyze: "Premium narratif",
                  status: "done",
                },
                {
                  domain: "Portfolio 360°",
                  competitors: "Avancé",
                  powalyze: "En construction",
                  status: "progress",
                },
                {
                  domain: "Automations",
                  competitors: "Visuelles",
                  powalyze: "SQL + UI à venir",
                  status: "progress",
                },
                {
                  domain: "IA Exécutive",
                  competitors: "Prévision / priorisation",
                  powalyze: "Narration intelligente",
                  status: "done",
                },
                {
                  domain: "Collaboration",
                  competitors: "Temps réel",
                  powalyze: "À venir",
                  status: "planned",
                },
                {
                  domain: "Documents",
                  competitors: "OCR / versioning",
                  powalyze: "Upload / storage",
                  status: "done",
                },
                {
                  domain: "Intégrations",
                  competitors: "Slack / Jira / Drive",
                  powalyze: "Roadmap Q4",
                  status: "planned",
                },
                {
                  domain: "Mobile",
                  competitors: "App native",
                  powalyze: "PWA à venir",
                  status: "planned",
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-900/60 last:border-0 hover:bg-slate-900/40 transition"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-100">
                    {row.domain}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {row.competitors}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-100">
                    <div className="flex items-center gap-2">
                      {row.status === "done" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : row.status === "progress" ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-500" />
                      )}
                      <span>{row.powalyze}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Les 6 Piliers */}
      <div className="px-8 py-16 bg-slate-950/60 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#D4AF37] text-center mb-12">
            Les 6 Piliers de Powalyze
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📁",
                title: "Projets vivants",
                desc: "Statuts, progression, risques, décisions, documents, automations.",
              },
              {
                icon: "🎯",
                title: "Portfolio 360°",
                desc: "Capacité, finances, risques, roadmap, dépendances.",
              },
              {
                icon: "⚡",
                title: "Automations exécutives",
                desc: "Le système agit dès qu'un signal apparaît.",
              },
              {
                icon: "🤖",
                title: "IA Exécutive",
                desc: "Synthèse, prévision, priorisation, plan d'action.",
              },
              {
                icon: "📄",
                title: "Documents intelligents",
                desc: "OCR, extraction, versioning, signatures.",
              },
              {
                icon: "🔗",
                title: "Intégrations",
                desc: "Slack, Teams, Drive, GitHub, Jira.",
              },
            ].map((pilier, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-950/40 p-6"
              >
                <div className="text-4xl mb-3">{pilier.icon}</div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {pilier.title}
                </h3>
                <p className="text-sm text-slate-400">{pilier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-100 mb-4">
          Prêt à transformer votre gouvernance ?
        </h2>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
          Rejoignez les dirigeants qui utilisent Powalyze pour piloter leur
          portefeuille de projets avec intelligence.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-[#C5A028] transition shadow-lg shadow-[#D4AF37]/20"
          >
            Essayer gratuitement
          </Link>

          <Link
            href="/demo"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
          >
            Voir la démo
          </Link>
        </div>
      </div>
    </div>
  );
}
