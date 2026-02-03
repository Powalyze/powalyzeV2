// ============================================================
// POWALYZE COCKPIT V3 — PROJECT WIZARD (5 STEPS)
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  Target, 
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  budget?: number;
  deadline?: string;
}

interface WizardProps {
  params: {
    id: string;
  };
}

const STEPS = [
  {
    id: 1,
    name: 'Risques',
    icon: AlertTriangle,
    description: 'Identification des risques potentiels',
    color: 'red'
  },
  {
    id: 2,
    name: 'Décisions',
    icon: FileText,
    description: 'Décisions stratégiques à prendre',
    color: 'indigo'
  },
  {
    id: 3,
    name: 'Scénarios',
    icon: TrendingUp,
    description: 'Scénarios prévisionnels',
    color: 'purple'
  },
  {
    id: 4,
    name: 'Objectifs',
    icon: Target,
    description: 'Objectifs SMART',
    color: 'blue'
  },
  {
    id: 5,
    name: 'Rapport',
    icon: CheckCircle2,
    description: 'Synthèse finale',
    color: 'green'
  }
];

export default function ProjectWizardPage({ params }: WizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>({});

  // Charger le projet
  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [params.id]);

  // Fonction pour générer avec l'IA
  async function generateWithAI(step: number) {
    setGenerating(true);
    try {
      let endpoint = '';
      let payload: any = {
        projectId: params.id,
        projectName: project?.name,
        projectDescription: project?.description,
        budget: project?.budget,
        deadline: project?.deadline,
      };

      switch (step) {
        case 1: // Risques
          endpoint = '/api/ai/risks/generate';
          break;
        case 2: // Décisions
          endpoint = '/api/ai/decisions/generate';
          payload = { ...payload, risks: generatedData.risks };
          break;
        case 3: // Scénarios
          endpoint = '/api/ai/scenarios/generate';
          payload = { ...payload, risks: generatedData.risks, decisions: generatedData.decisions };
          break;
        case 4: // Objectifs
          endpoint = '/api/ai/objectives/generate';
          break;
        case 5: // Rapport
          endpoint = '/api/ai/report/generate';
          payload = { 
            ...payload, 
            risks: generatedData.risks,
            decisions: generatedData.decisions,
            scenarios: generatedData.scenarios,
            objectives: generatedData.objectives
          };
          break;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedData((prev: any) => ({
          ...prev,
          [getStepKey(step)]: data,
        }));
      }
    } catch (error) {
      console.error('Error generating with AI:', error);
    } finally {
      setGenerating(false);
    }
  }

  function getStepKey(step: number): string {
    const keys = ['', 'risks', 'decisions', 'scenarios', 'objectives', 'report'];
    return keys[step];
  }

  function goToStep(step: number) {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  }

  function skipWizard() {
    router.push(`/cockpit/pro/projets/${params.id}`);
  }

  function finishWizard() {
    router.push('/cockpit/pro');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Projet introuvable</h1>
          <Link
            href="/cockpit/pro"
            className="text-indigo-400 hover:text-indigo-300"
          >
            ← Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentStepData = STEPS[currentStep - 1];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href={`/cockpit/pro/projets/${params.id}`}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au projet
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">
              Assistant Wizard IA
            </h1>
            <p className="text-slate-400">
              Enrichissement du projet: <span className="text-white font-semibold">{project.name}</span>
            </p>
          </div>
          <button
            onClick={skipWizard}
            className="text-slate-400 hover:text-white text-sm"
          >
            Ignorer le wizard →
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`flex items-center gap-3 transition-all ${
                      isActive
                        ? 'text-white'
                        : isCompleted
                        ? 'text-green-400'
                        : 'text-slate-500'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? `bg-${step.color}-500/20 border-2 border-${step.color}-500`
                          : isCompleted
                          ? 'bg-green-500/20 border-2 border-green-500'
                          : 'bg-slate-800 border-2 border-slate-700'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="font-semibold">{step.name}</div>
                      <div className="text-xs text-slate-400">{step.description}</div>
                    </div>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-slate-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`bg-${currentStepData.color}-500/20 p-4 rounded-xl`}>
              <StepIcon className={`w-8 h-8 text-${currentStepData.color}-400`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Étape {currentStep}: {currentStepData.name}
              </h2>
              <p className="text-slate-400">{currentStepData.description}</p>
            </div>
          </div>

          {/* Step-specific content */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <RisksStep
                generating={generating}
                data={generatedData.risks}
                onGenerate={() => generateWithAI(1)}
              />
            )}
            {currentStep === 2 && (
              <DecisionsStep
                generating={generating}
                data={generatedData.decisions}
                onGenerate={() => generateWithAI(2)}
              />
            )}
            {currentStep === 3 && (
              <ScenariosStep
                generating={generating}
                data={generatedData.scenarios}
                onGenerate={() => generateWithAI(3)}
              />
            )}
            {currentStep === 4 && (
              <ObjectivesStep
                generating={generating}
                data={generatedData.objectives}
                onGenerate={() => generateWithAI(4)}
              />
            )}
            {currentStep === 5 && (
              <ReportStep
                generating={generating}
                data={generatedData.report}
                onGenerate={() => generateWithAI(5)}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
            <button
              onClick={() => goToStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Précédent
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={skipWizard}
                className="text-slate-400 hover:text-white text-sm"
              >
                Terminer plus tard
              </button>
              
              {currentStep < 5 ? (
                <button
                  onClick={() => goToStep(currentStep + 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Suivant
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={finishWizard}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Terminer le Wizard
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================
// STEP COMPONENTS
// ============================================================

function RisksStep({ generating, data, onGenerate }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-red-600/10 via-orange-600/10 to-amber-600/10 border border-red-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2">🤖 Génération IA des Risques</h3>
        <p className="text-slate-300 text-sm mb-4">
          L'IA va analyser votre projet et identifier automatiquement les risques potentiels 
          avec leur probabilité, impact et plan de mitigation.
        </p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Génération en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Générer les Risques</span>
            </>
          )}
        </button>
      </div>

      {data && data.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-white font-semibold">Risques Identifiés ({data.length})</h4>
          {data.map((risk: any, index: number) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <h5 className="text-white font-semibold">{risk.title}</h5>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  risk.level === 'critical' ? 'bg-red-500/20 text-red-400' :
                  risk.level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  risk.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {risk.level.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-3">{risk.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-slate-500">Probabilité: </span>
                  <span className="text-white font-semibold">{risk.probability}%</span>
                </div>
                <div>
                  <span className="text-slate-500">Impact: </span>
                  <span className="text-white font-semibold">{risk.impact}%</span>
                </div>
              </div>
              {risk.mitigation_plan && (
                <div className="bg-slate-800/50 rounded p-3 border border-white/5">
                  <p className="text-green-400 text-xs font-semibold mb-1">Plan de Mitigation</p>
                  <p className="text-slate-300 text-sm">{risk.mitigation_plan}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DecisionsStep({ generating, data, onGenerate }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-blue-600/10 border border-indigo-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2">🤖 Génération IA des Décisions</h3>
        <p className="text-slate-300 text-sm mb-4">
          L'IA va proposer des décisions stratégiques à prendre pour le projet, 
          avec des options et leurs impacts respectifs.
        </p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Génération en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Générer les Décisions</span>
            </>
          )}
        </button>
      </div>

      {data && data.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-white font-semibold">Décisions Suggérées ({data.length})</h4>
          {data.map((decision: any, index: number) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h5 className="text-white font-semibold mb-2">{decision.title}</h5>
              <p className="text-slate-400 text-sm mb-3">{decision.description}</p>
              {decision.impacts && decision.impacts.length > 0 && (
                <div className="bg-slate-800/50 rounded p-3 border border-white/5">
                  <p className="text-indigo-400 text-xs font-semibold mb-2">Impacts Estimés</p>
                  <ul className="space-y-1">
                    {decision.impacts.map((impact: string, i: number) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">•</span>
                        <span>{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScenariosStep({ generating, data, onGenerate }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-indigo-600/10 border border-purple-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2">🤖 Génération IA des Scénarios</h3>
        <p className="text-slate-300 text-sm mb-4">
          L'IA va créer 3 scénarios prévisionnels (optimiste, central, pessimiste) 
          avec dates de livraison et budgets estimés.
        </p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Génération en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Générer les Scénarios</span>
            </>
          )}
        </button>
      </div>

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((scenario: any, index: number) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-semibold capitalize">{scenario.type}</h5>
                <span className="text-slate-400 text-sm">{scenario.probability}%</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-500">Livraison: </span>
                  <span className="text-white">{new Date(scenario.delivery_date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div>
                  <span className="text-slate-500">Budget: </span>
                  <span className="text-white">{(scenario.final_budget / 1000000).toFixed(1)}M €</span>
                </div>
              </div>
              {scenario.business_impacts && scenario.business_impacts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-purple-400 text-xs font-semibold mb-2">Impacts Business</p>
                  <ul className="space-y-1">
                    {scenario.business_impacts.slice(0, 2).map((impact: string, i: number) => (
                      <li key={i} className="text-slate-300 text-xs">• {impact}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ObjectivesStep({ generating, data, onGenerate }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600/10 via-cyan-600/10 to-teal-600/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2">🤖 Génération IA des Objectifs</h3>
        <p className="text-slate-300 text-sm mb-4">
          L'IA va définir des objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporels) 
          avec des KPIs pour suivre l'avancement.
        </p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Génération en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Générer les Objectifs</span>
            </>
          )}
        </button>
      </div>

      {data && data.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-white font-semibold">Objectifs SMART ({data.length})</h4>
          {data.map((objective: any, index: number) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h5 className="text-white font-semibold mb-2">{objective.title}</h5>
              <p className="text-slate-400 text-sm mb-3">{objective.description}</p>
              {objective.measurable && (
                <div className="bg-slate-800/50 rounded p-3 border border-white/5">
                  <p className="text-blue-400 text-xs font-semibold mb-1">KPI Mesurable</p>
                  <p className="text-slate-300 text-sm">{objective.measurable}</p>
                </div>
              )}
              {objective.deadline && (
                <div className="mt-2 text-sm">
                  <span className="text-slate-500">Échéance: </span>
                  <span className="text-white">{new Date(objective.deadline).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReportStep({ generating, data, onGenerate }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-600/10 via-emerald-600/10 to-teal-600/10 border border-green-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2">🤖 Génération Rapport IA Final</h3>
        <p className="text-slate-300 text-sm mb-4">
          L'IA va créer une synthèse complète du projet incluant tous les éléments générés 
          (risques, décisions, scénarios, objectifs) dans un format exécutif.
        </p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Génération en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Générer le Rapport</span>
            </>
          )}
        </button>
      </div>

      {data && data.summary && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h4 className="text-2xl font-bold text-white mb-4">📊 Rapport Exécutif</h4>
            <div className="prose prose-invert max-w-none">
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {data.summary}
              </div>
            </div>
          </div>

          {data.recommendations && data.recommendations.length > 0 && (
            <div className="bg-gradient-to-br from-purple-600/10 via-indigo-600/10 to-blue-600/10 border border-purple-500/30 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-4">🎯 Recommandations Clés</h4>
              <ul className="space-y-3">
                {data.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
