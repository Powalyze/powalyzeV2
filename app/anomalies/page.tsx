"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, Activity, Zap, Loader2, CheckCircle, Brain } from 'lucide-react';

export default function AnomaliesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnomaly, setSelectedAnomaly] = useState<number | null>(null);
  const [autoHealingRunning, setAutoHealingRunning] = useState(false);
  const [healingSolution, setHealingSolution] = useState<string>('');
  const [healingSteps, setHealingSteps] = useState<string[]>([]);

  const anomalyDetails = [
    {
      id: 1,
      title: 'Dépassement budgétaire détecté',
      project: 'ERP Cloud Migration',
      description: 'Le projet a dépassé son budget initial de 8%. Analyse détaillée des causes.',
      impact: 'Élevé',
      causes: ['Coûts de consultation externe non prévus (+120K€)', 'Licences supplémentaires nécessaires (+85K€)', 'Retards entraînant des pénalités (+50K€)'],
      recommendations: ['Renégocier le contrat avec les consultants', 'Optimiser l\'utilisation des licences', 'Accélérer la livraison pour éviter nouvelles pénalités'],
      timeline: 'Détecté il y a 1h - Action requise sous 48h',
      affectedTeams: ['Finance', 'IT', 'PMO'],
      budgetImpact: '+255K€ (+8% du budget initial)',
      status: 'En cours d\'analyse'
    },
    {
      id: 2,
      title: 'Surcharge équipe Alpha',
      project: 'Digital Workplace',
      description: 'L\'équipe fonctionne à 120% de sa capacité depuis 3 semaines.',
      impact: 'Élevé',
      causes: ['3 membres en congé maladie simultanément', 'Nouveau projet urgent ajouté au sprint', 'Sous-estimation de la complexité technique'],
      recommendations: ['Réaffecter 2 ressources de l\'équipe Beta temporairement', 'Reporter les tâches non-critiques au sprint suivant', 'Recruter un contractor senior pour 2 mois'],
      timeline: 'Détecté il y a 2h - Risque de burnout imminent',
      affectedTeams: ['Équipe Alpha', 'RH', 'Management'],
      budgetImpact: 'Risque de retard = 180K€ de pénalités',
      status: 'Action urgente requise'
    },
    {
      id: 3,
      title: 'Dépendance bloquante identifiée',
      project: 'Interconnexion B-C',
      description: 'Le Projet C ne peut démarrer sa phase 2 sans la livraison du module API du Projet B.',
      impact: 'Élevé',
      causes: ['Retard de 3 semaines sur le développement API (Projet B)', 'Documentation technique incomplète', 'Tests d\'intégration non planifiés initialement'],
      recommendations: ['Paralléliser le développement avec des mocks API', 'Sprint dédié pour finaliser la documentation', 'Allouer une équipe dédiée aux tests d\'intégration'],
      timeline: 'Détecté il y a 3h - Impact sur planning Q2',
      affectedTeams: ['Dev Projet B', 'Dev Projet C', 'QA'],
      budgetImpact: 'Retard potentiel = perte d\'opportunité 500K€',
      status: 'Plan de mitigation en cours'
    }
  ];
  
  useEffect(() => {
    const auth = localStorage.getItem('powalyze_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/login?redirect=/anomalies&message=Veuillez vous connecter pour accéder aux anomalies');
    }
    setIsLoading(false);
  }, [router]);
  
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Chargement...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/cockpit" className="text-amber-400 hover:text-amber-300 mb-4 inline-block">
            ← Retour au Cockpit
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Anomalies Détectées</h1>
          <p className="text-slate-400">3 anomalies nécessitent une action immédiate</p>
        </div>

        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-red-500/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">Anomalie #{i + 1}</h3>
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                      Critique
                    </span>
                  </div>
                  <p className="text-slate-300 mb-4">
                    {i === 0 ? 'Dépassement budgétaire détecté sur le projet ERP Cloud (+8%)' :
                     i === 1 ? 'Surcharge de l\'équipe Alpha détectée (120% de capacité)' :
                     'Dépendance bloquante identifiée entre Projet B et Projet C'}
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-slate-500">Projet: <span className="text-white">Projet {String.fromCharCode(65 + i)}</span></span>
                    <span className="text-slate-500">Détecté: <span className="text-white">Il y a {i + 1}h</span></span>
                    <span className="text-slate-500">Impact: <span className="text-red-400 font-semibold">Élevé</span></span>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button 
                      onClick={() => {
                        setSelectedAnomaly(i);
                        setAutoHealingRunning(true);
                        setHealingSolution('');
                        setHealingSteps([]);
                        // Simuler l'analyse IA
                        setTimeout(() => {
                          setHealingSteps(['🔍 Analyse du contexte projet...']);
                        }, 500);
                        setTimeout(() => {
                          setHealingSteps(prev => [...prev, '🧠 Consultation base de connaissances IA...']);
                        }, 1500);
                        setTimeout(() => {
                          setHealingSteps(prev => [...prev, '⚙️ Génération des scénarios de correction...']);
                        }, 2500);
                        setTimeout(() => {
                          setHealingSteps(prev => [...prev, '✨ Optimisation de la solution...']);
                        }, 3500);
                        setTimeout(() => {
                          const solutions = [
                            `**Solution Auto-Healing Générée:**

**Problème:** Dépassement budgétaire de 8% (255K€)

**Actions Immédiates:**
1. **Renégociation Contrats:** Réduire le tarif des consultants externes de 15% → Économie: 18K€/mois
2. **Optimisation Licences:** Migrer 30% des licences vers un tier inférieur → Économie: 8K€/mois  
3. **Accélération Livraison:** Sprint dédié pour éviter les pénalités de retard → Économie: 50K€

**Impact Total:** Réduction de 180K€ sur 3 mois → Ramène le dépassement de 8% à 2.5%

**Probabilité de Succès:** 87% (basé sur 142 cas similaires dans l'historique)

**Plan d'Action:**
- Semaine 1: Appel d'offres consultants + audit licences
- Semaine 2-3: Sprint accéléré avec équipe renforcée
- Semaine 4: Validation économies + ajustement budget prévisionnel`,
                            
                            `**Solution Auto-Healing Générée:**

**Problème:** Surcharge équipe Alpha (120% capacité)

**Actions Immédiates:**
1. **Réaffectation Ressources:** 2 devs seniors de l'équipe Beta (charge 75%) → Team Alpha
2. **Priorisation:** Reporter 8 tâches non-critiques au sprint suivant (-40h de charge)
3. **Support Temporaire:** Embaucher 1 contractor senior pour 2 mois (expertise React/Node)

**Impact Total:** Ramène la charge de 120% à 85% → Zone saine

**Coût:** 25K€ (contractor 2 mois) vs 180K€ de pénalités si retard

**Probabilité de Succès:** 92% (basé sur 89 cas similaires)

**Plan d'Action:**
- Jour 1-2: Onboarding des 2 devs réaffectés
- Jour 3: Lancement recherche contractor (délai 1 semaine)
- Jour 4-5: Repriorisation backlog avec PO
- Semaine 2: Contractor opérationnel + sprint normalisé`,
                            
                            `**Solution Auto-Healing Générée:**

**Problème:** Dépendance bloquante Projet B → Projet C

**Actions Immédiates:**
1. **Parallélisation:** Créer des mocks API pour débloquer le dev Projet C immédiatement
2. **Sprint Dédié:** Équipe de 3 devs sur finalisation API Projet B (durée: 1 semaine)
3. **Tests Intégration:** Allouer équipe QA dédiée dès semaine 2

**Impact Total:** Réduction retard de 3 semaines à 4 jours → Sauve 500K€ d'opportunité

**Coût:** 15K€ (heures sup + QA) vs 500K€ de perte d'opportunité

**Probabilité de Succès:** 85% (basé sur 67 cas similaires)

**Plan d'Action:**
- Jour 1: Génération mocks API + doc technique
- Jour 2-7: Sprint API Projet B + dev parallèle Projet C
- Jour 8-10: Tests d'intégration intensifs
- Jour 11: Mise en production + validation E2E`
                          ];
                          setHealingSolution(solutions[i]);
                          setAutoHealingRunning(false);
                        }, 5000);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg transition-all flex items-center gap-2 font-semibold hover:scale-105 hover:shadow-xl"
                    >
                      <Zap className="w-4 h-4" />
                      Action Auto-Healing IA
                    </button>
                    <button 
                      onClick={() => setSelectedAnomaly(i)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
                    >
                      Voir Détails
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Détails Anomalie */}
        {selectedAnomaly !== null && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Anomalie #{selectedAnomaly + 1} - Analyse Détaillée</h2>
                  <p className="text-slate-400 mt-1">{anomalyDetails[selectedAnomaly].project}</p>
                </div>
                <button 
                  onClick={() => setSelectedAnomaly(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">📋 Description</h3>
                  <p className="text-slate-300 bg-slate-800/50 p-4 rounded-lg">{anomalyDetails[selectedAnomaly].description}</p>
                </div>

                {/* Causes */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">🔍 Causes Identifiées</h3>
                  <ul className="space-y-2">
                    {anomalyDetails[selectedAnomaly].causes.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                        <span className="text-red-400 font-bold">{idx + 1}.</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommandations */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">💡 Recommandations IA</h3>
                  <ul className="space-y-2">
                    {anomalyDetails[selectedAnomaly].recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300 bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
                        <span className="text-green-400">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Métriques */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">⏱️ Timeline</p>
                    <p className="text-white font-semibold">{anomalyDetails[selectedAnomaly].timeline}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">💰 Impact Budget</p>
                    <p className="text-red-400 font-bold">{anomalyDetails[selectedAnomaly].budgetImpact}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">👥 Équipes Affectées</p>
                    <p className="text-white font-semibold">{anomalyDetails[selectedAnomaly].affectedTeams.join(', ')}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">📊 Statut</p>
                    <p className="text-amber-400 font-semibold">{anomalyDetails[selectedAnomaly].status}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <button 
                    onClick={() => {
                      setAutoHealingRunning(true);
                      setHealingSolution('');
                      setHealingSteps([]);
                      setTimeout(() => {
                        setHealingSteps(['🔍 Analyse du contexte projet...']);
                      }, 500);
                      setTimeout(() => {
                        setHealingSteps(prev => [...prev, '🧠 Consultation base de connaissances IA...']);
                      }, 1500);
                      setTimeout(() => {
                        setHealingSteps(prev => [...prev, '⚙️ Génération des scénarios de correction...']);
                      }, 2500);
                      setTimeout(() => {
                        setHealingSteps(prev => [...prev, '✨ Optimisation de la solution...']);
                      }, 3500);
                      setTimeout(() => {
                        const solutions = [
                          `**Solution Auto-Healing Générée:**

**Problème:** Dépassement budgétaire de 8% (255K€)

**Actions Immédiates:**
1. **Renégociation Contrats:** Réduire le tarif des consultants externes de 15% → Économie: 18K€/mois
2. **Optimisation Licences:** Migrer 30% des licences vers un tier inférieur → Économie: 8K€/mois  
3. **Accélération Livraison:** Sprint dédié pour éviter les pénalités de retard → Économie: 50K€

**Impact Total:** Réduction de 180K€ sur 3 mois → Ramène le dépassement de 8% à 2.5%`,
                          
                          `**Solution Auto-Healing Générée:**

**Problème:** Surcharge équipe Alpha (120% capacité)

**Actions Immédiates:**
1. **Réaffectation Ressources:** 2 devs seniors de l'équipe Beta (charge 75%) → Team Alpha
2. **Priorisation:** Reporter 8 tâches non-critiques au sprint suivant (-40h de charge)
3. **Support Temporaire:** Embaucher 1 contractor senior pour 2 mois (expertise React/Node)

**Impact Total:** Ramène la charge de 120% à 85% → Zone saine`,
                          
                          `**Solution Auto-Healing Générée:**

**Problème:** Dépendance bloquante Projet B → Projet C

**Actions Immédiates:**
1. **Parallélisation:** Créer des mocks API pour débloquer le dev Projet C immédiatement
2. **Sprint Dédié:** Équipe de 3 devs sur finalisation API Projet B (durée: 1 semaine)
3. **Tests Intégration:** Allouer équipe QA dédiée dès semaine 2

**Impact Total:** Réduction retard de 3 semaines à 4 jours → Sauve 500K€ d'opportunité`
                        ];
                        setHealingSolution(solutions[selectedAnomaly]);
                        setAutoHealingRunning(false);
                      }, 5000);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Lancer Auto-Healing IA
                  </button>
                  <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all">
                    Assigner à une équipe
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedAnomaly(null);
                      setHealingSolution('');
                      setHealingSteps([]);
                      setAutoHealingRunning(false);
                    }}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Auto-Healing */}
        {(autoHealingRunning || healingSolution) && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-amber-500/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <Brain className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Auto-Healing IA en cours</h3>
                  <p className="text-slate-400 text-sm">Analyse et génération de solution...</p>
                </div>
              </div>

              {autoHealingRunning && (
                <div className="space-y-4 mb-6">
                  {healingSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700 animate-slideIn">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{step}</span>
                    </div>
                  ))}
                  {healingSteps.length > 0 && healingSteps.length < 4 && (
                    <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-lg border border-amber-500/30">
                      <Loader2 className="w-5 h-5 text-amber-400 animate-spin flex-shrink-0" />
                      <span className="text-amber-400">Traitement en cours...</span>
                    </div>
                  )}
                </div>
              )}

              {healingSolution && !autoHealingRunning && (
                <div className="space-y-4">
                  <div className="bg-green-500/10 border-l-4 border-green-500 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h4 className="text-lg font-bold text-green-400">Solution Générée avec Succès</h4>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                      {healingSolution.split('\n').map((line, idx) => (
                        <p key={idx} className="text-slate-300 mb-2 whitespace-pre-wrap">{line}</p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-400 mb-3">📊 Métriques de Confiance</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Probabilité de Succès</span>
                          <span className="text-green-400 font-bold">87-92%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full w-[90%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Basé sur Historique</span>
                          <span className="text-blue-400 font-bold">142 cas similaires</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full w-[95%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        alert('Solution appliquée ! Les équipes concernées ont été notifiées.');
                        setHealingSolution('');
                        setHealingSteps([]);
                        setSelectedAnomaly(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:scale-105 transition-all"
                    >
                      ✓ Appliquer la Solution
                    </button>
                    <button 
                      onClick={() => {
                        setHealingSolution('');
                        setHealingSteps([]);
                        setAutoHealingRunning(false);
                      }}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {autoHealingRunning && (
                <p className="text-center text-slate-400 text-sm">
                  L'IA analyse l'anomalie et génère une solution optimisée...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
