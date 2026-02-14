"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle, Sparkles, Users, FileText, ShieldAlert, ArrowRight } from "lucide-react";

const STORAGE_KEY = "powalyze-onboarding-state";

const STEPS = [
  {
    title: "Créer votre premier projet",
    description: "Ajoutez un projet pilote pour démarrer votre cockpit.",
    actionLabel: "Créer un projet",
    actionHref: "#new-project",
    icon: <CheckCircle size={18} className="text-emerald-400" />
  },
  {
    title: "Inviter votre équipe",
    description: "Ajoutez les membres clés pour collaborer.",
    actionLabel: "Gérer l’équipe",
    actionHref: "/cockpit/equipe",
    icon: <Users size={18} className="text-sky-400" />
  },
  {
    title: "Déclarer un risque",
    description: "Commencez par vos 2-3 risques majeurs.",
    actionLabel: "Voir les risques",
    actionHref: "/cockpit/risques",
    icon: <ShieldAlert size={18} className="text-amber-400" />
  },
  {
    title: "Générer un rapport IA",
    description: "Produisez votre première synthèse exécutive.",
    actionLabel: "Rapports IA",
    actionHref: "/cockpit/rapports",
    icon: <FileText size={18} className="text-purple-400" />
  }
];

export default function OnboardingGuide() {
  const [hidden, setHidden] = useState(true);
  const [completed, setCompleted] = useState<boolean[]>(Array(STEPS.length).fill(false));
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setCompleted(Array.isArray(parsed?.completed) ? parsed.completed : completed);
        setHidden(!!parsed?.dismissed);
      } catch {
        setHidden(false);
      }
    } else {
      setHidden(false);
    }
  }, []);

  const progress = useMemo(() => {
    const done = completed.filter(Boolean).length;
    return Math.round((done / STEPS.length) * 100);
  }, [completed]);

  // Defer localStorage writes to avoid blocking main thread
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ completed, dismissed: hidden })
        );
      } catch (err) {
        console.warn('Failed to save onboarding state:', err);
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [completed, hidden]);

  if (hidden) return null;

  return (
    <div className="mb-8 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
            <Sparkles size={14} />
            Onboarding guidé
          </div>
          <h2 className="mt-3 text-2xl font-bold">Bienvenue dans votre cockpit</h2>
          <p className="text-slate-300">
            Suivez ces 4 étapes pour une prise en main rapide (5 minutes).
          </p>
          <div className="mt-4 max-w-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <progress
              value={progress}
              max={100}
              className="w-full h-2 rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-slate-800 [&::-webkit-progress-value]:bg-amber-500 [&::-moz-progress-bar]:bg-amber-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-sm text-slate-400 hover:text-amber-300"
          >
            {expanded ? "Réduire" : "Afficher"}
          </button>
          <button
            onClick={() => {
              setHidden(true);
            }}
            className="text-sm text-slate-400 hover:text-amber-300"
          >
            Terminer l’onboarding
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {STEPS.map((step, index) => (
            <Step
              key={step.title}
              {...step}
              done={completed[index]}
              onToggle={() => {
                setCompleted((prev) => {
                  const copy = [...prev];
                  copy[index] = !copy[index];
                  return copy;
                });
              }}
            />
          ))}
        </div>
      )}

      {progress === 100 && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="text-emerald-200 font-semibold">🎉 Onboarding terminé</div>
          <Link
            href="/cockpit/projets"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
          >
            Continuer vers vos projets
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}

function Step({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
  done,
  onToggle,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  icon: React.ReactNode;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`rounded-xl border p-4 ${done ? "border-emerald-500/40 bg-emerald-500/10" : "border-slate-800 bg-slate-900/60"}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
          <div className="mt-3 flex items-center gap-3">
            <Link
              href={actionHref}
              className="inline-flex text-sm font-semibold text-amber-400 hover:text-amber-300"
            >
              {actionLabel}
            </Link>
            <button
              onClick={onToggle}
              className={`text-xs font-semibold ${done ? "text-emerald-300" : "text-slate-400 hover:text-emerald-300"}`}
            >
              {done ? "✔ Étape complétée" : "Marquer comme fait"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
