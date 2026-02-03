// ============================================================
// POWALYZE — MOCK AI RESPONSES FOR TESTING
// ============================================================
// Utilisé quand OPENAI_API_KEY commence par "sk-fake"
// Permet de tester le wizard sans coût API

export const MOCK_RISKS = [
  {
    title: "Dépassement budgétaire lié aux changements de scope",
    description: "Le risque de dépassement budgétaire est élevé en raison de la nature évolutive du projet et des demandes de fonctionnalités supplémentaires. Les changements fréquents peuvent entraîner des coûts imprévus et des retards dans la livraison.",
    level: "high",
    probability: 65,
    impact: 70,
    mitigation_plan: "Mettre en place un processus de change request formel avec validation budgétaire. Définir un périmètre projet strict avec clause de gel à 80% d'avancement. Prévoir une réserve de contingence de 15% du budget total.",
    category: "FINANCIAL"
  },
  {
    title: "Disponibilité limitée des ressources techniques clés",
    description: "Les experts techniques nécessaires au projet sont partagés entre plusieurs initiatives. Leur disponibilité partielle peut ralentir les phases critiques du développement et impacter les délais de livraison.",
    level: "critical",
    probability: 55,
    impact: 80,
    mitigation_plan: "Négocier l'allocation dédiée à temps plein des ressources critiques. Identifier des profils de backup en interne ou externe. Mettre en place une documentation technique rigoureuse pour faciliter la passation.",
    category: "ORGANIZATIONAL"
  },
  {
    title: "Intégration complexe avec les systèmes legacy",
    description: "L'intégration avec les systèmes existants présente des défis techniques majeurs. Les architectures hétérogènes et la documentation limitée des anciennes applications augmentent les risques de compatibilité.",
    level: "high",
    probability: 70,
    impact: 65,
    mitigation_plan: "Réaliser un audit technique approfondi des systèmes legacy avant démarrage. Développer une couche d'abstraction pour isoler les dépendances. Prévoir des sprints dédiés aux tests d'intégration.",
    category: "TECHNICAL"
  },
  {
    title: "Résistance au changement des utilisateurs finaux",
    description: "L'adoption du nouveau système par les utilisateurs peut rencontrer des résistances culturelles et organisationnelles. Le manque de formation et de communication peut compromettre le succès post-livraison.",
    level: "medium",
    probability: 50,
    impact: 55,
    mitigation_plan: "Lancer une campagne de communication proactive dès le début du projet. Impliquer les utilisateurs clés dans les phases de conception. Prévoir un programme de formation complet et un support dédié post-déploiement.",
    category: "ORGANIZATIONAL"
  }
];

export const MOCK_DECISIONS = [
  {
    title: "Choix du fournisseur cloud principal",
    description: "Le projet nécessite une décision stratégique sur le choix du fournisseur cloud (AWS, Azure, GCP). Cette décision impactera l'architecture technique, les coûts d'exploitation et la scalabilité future de la solution. Les critères à considérer incluent les performances, la conformité RGPD, les compétences internes et les engagements contractuels.",
    type: "technical",
    urgency: "URGENT",
    committee: "CODIR",
    options: [
      "AWS avec migration progressive sur 6 mois",
      "Azure pour intégration Microsoft existante",
      "Multi-cloud hybride (AWS + Azure)"
    ],
    impacts: [
      "Réduction des coûts d'infrastructure de 15-20% sur 3 ans",
      "Amélioration de la scalabilité et disponibilité (SLA 99.95%)",
      "Formation équipes techniques requise (20 jours/personne)",
      "Dépendance accrue vis-à-vis d'un fournisseur unique"
    ],
    estimated_cost: 450000
  },
  {
    title: "Validation du périmètre fonctionnel Phase 1",
    description: "Arbitrage nécessaire entre le périmètre initial (100% des fonctionnalités) et une approche MVP (Minimum Viable Product) permettant une livraison plus rapide. La décision impacte directement les délais de mise en production et la satisfaction des parties prenantes.",
    type: "strategic",
    urgency: "URGENT",
    committee: "COMEX",
    options: [
      "Périmètre complet : livraison dans 12 mois",
      "Approche MVP : livraison Phase 1 dans 6 mois + Phase 2 dans 6 mois",
      "Démarche agile incrémentale : releases mensuelles"
    ],
    impacts: [
      "Time-to-market réduit de 40% avec approche MVP",
      "ROI plus rapide grâce aux premières fonctionnalités",
      "Risque de frustration utilisateurs si MVP trop minimal",
      "Possibilité d'ajuster selon feedback utilisateurs"
    ],
    estimated_cost: null
  },
  {
    title: "Allocation budget de contingence",
    description: "Le comité financier doit valider l'allocation d'un budget de contingence pour couvrir les risques identifiés et les imprévus. Sans cette réserve, tout dépassement nécessitera une nouvelle demande budgétaire avec délais administratifs.",
    type: "financial",
    urgency: "HIGH",
    committee: "COMEX",
    options: [
      "15% du budget total (recommandé)",
      "10% du budget total (minimum)",
      "Pas de contingence (max risque)"
    ],
    impacts: [
      "Flexibilité financière pour absorber les imprévus",
      "Évite les blocages administratifs en cas de dépassement",
      "Impact sur le budget global de l'année",
      "Nécessite justification trimestrielle si non utilisé"
    ],
    estimated_cost: 300000
  }
];

export const MOCK_SCENARIOS = [
  {
    type: "optimistic",
    probability: 20,
    delivery_date: "2026-08-01T00:00:00Z",
    final_budget: 1700000,
    business_impacts: [
      "Livraison 6 mois avant la deadline initiale grâce à l'efficacité des équipes et l'absence de blocages majeurs",
      "Économies de 15% sur le budget initial dues à l'optimisation des ressources et l'absence de dépassements",
      "ROI atteint en 8 mois post-livraison grâce à l'adoption rapide et aux gains de productivité immédiats",
      "Satisfaction utilisateurs élevée (>90%) favorisant l'adoption et minimisant le support post-déploiement"
    ],
    actions: [
      "Maintenir le momentum avec des célébrations d'étapes pour garder la motivation des équipes",
      "Capitaliser sur l'avance pour enrichir les fonctionnalités et améliorer l'expérience utilisateur",
      "Documenter les bonnes pratiques pour réplication sur autres projets",
      "Communiquer largement sur le succès pour valoriser les équipes et rassurer les sponsors"
    ]
  },
  {
    type: "central",
    probability: 60,
    delivery_date: "2027-02-03T00:00:00Z",
    final_budget: 2100000,
    business_impacts: [
      "Livraison conforme à la deadline initiale avec respect du planning global",
      "Léger dépassement budgétaire (+5%) lié aux imprévus gérés dans la contingence",
      "ROI atteint en 14 mois post-livraison, dans la norme pour ce type de projet",
      "Satisfaction utilisateurs correcte (75-80%) nécessitant des ajustements post-livraison mineurs"
    ],
    actions: [
      "Maintenir le suivi rigoureux des jalons et des indicateurs clés pour éviter les dérives",
      "Gérer proactivement les risques identifiés avec plans de mitigation actifs",
      "Préparer le support post-livraison et la formation utilisateurs dès maintenant",
      "Anticiper les demandes d'évolution pour prioriser la roadmap Phase 2"
    ]
  },
  {
    type: "pessimistic",
    probability: 20,
    delivery_date: "2027-06-01T00:00:00Z",
    final_budget: 2600000,
    business_impacts: [
      "Retard de 4 mois causé par des blocages techniques et des indisponibilités de ressources clés",
      "Dépassement budgétaire significatif (+30%) nécessitant arbitrages et ralentissements",
      "ROI atteint en 20 mois seulement, impactant la rentabilité globale du projet",
      "Risque de démotivation des équipes et de perte de confiance des sponsors"
    ],
    actions: [
      "Escalader immédiatement vers le COMEX pour déblocage ressources et arbitrages budgétaires",
      "Réaliser un audit complet du projet pour identifier les causes racines et corriger la trajectoire",
      "Renégocier les délais avec les parties prenantes en communiquant de façon transparente",
      "Mettre en place un comité de crise hebdomadaire pour pilotage rapproché et décisions rapides"
    ]
  }
];

export const MOCK_OBJECTIVES = [
  {
    title: "Réduire les coûts opérationnels de 15%",
    description: "Optimiser les processus métier et automatiser les tâches manuelles pour réduire significativement les coûts opérationnels récurrents. Cet objectif est aligné avec la stratégie d'efficacité opérationnelle du groupe et permettra de libérer des ressources pour d'autres initiatives stratégiques.",
    measurable: "Atteindre 15% de réduction des coûts mensuels d'exploitation d'ici Q3 2026 (baseline actuelle : 500K€/mois, cible : 425K€/mois)",
    deadline: "2026-09-30T23:59:59Z",
    priority: "HIGH",
    category: "BUSINESS"
  },
  {
    title: "Améliorer la satisfaction utilisateurs à 95%",
    description: "Mettre en place un programme d'amélioration continue basé sur les retours utilisateurs pour atteindre un niveau de satisfaction exceptionnel. L'objectif est de créer une expérience utilisateur fluide et intuitive qui favorise l'adoption et minimise le besoin de support.",
    measurable: "Score CSAT (Customer Satisfaction Score) ≥ 95% sur 3 mois consécutifs, mesuré via enquêtes post-utilisation (baseline actuelle : 72%)",
    deadline: "2026-12-31T23:59:59Z",
    priority: "HIGH",
    category: "SATISFACTION"
  },
  {
    title: "Atteindre 99.9% de disponibilité système",
    description: "Garantir une haute disponibilité de la plateforme pour assurer la continuité de service et la confiance des utilisateurs. Cet objectif technique est critique pour le succès business et nécessite une architecture robuste avec monitoring proactif.",
    measurable: "Uptime system ≥ 99.9% (soit maximum 43 minutes d'indisponibilité par mois), avec SLA contractuel documenté",
    deadline: "2026-06-30T23:59:59Z",
    priority: "MEDIUM",
    category: "TECHNICAL"
  },
  {
    title: "Former 100% des utilisateurs avant go-live",
    description: "Assurer que tous les utilisateurs finaux sont formés et autonomes avant le déploiement en production. Une formation complète et de qualité est le facteur clé de succès pour l'adoption et la minimisation du support post-livraison.",
    measurable: "100% des utilisateurs finaux (estimé 350 personnes) ayant complété le parcours de formation certifiant avec test de validation ≥ 80%",
    deadline: "2027-01-15T23:59:59Z",
    priority: "HIGH",
    category: "PERFORMANCE"
  }
];

export const MOCK_REPORT = {
  summary: `Le projet représente une initiative stratégique majeure visant à transformer les processus opérationnels de l'organisation. Avec un budget de 2M€ et une échéance fixée à février 2027, le projet présente des enjeux significatifs tant sur le plan technique qu'organisationnel.

L'analyse approfondie des risques révèle quatre risques critiques ou élevés nécessitant une attention particulière. Le risque de disponibilité limitée des ressources techniques (probabilité 55%, impact 80%) représente la menace la plus sérieuse et nécessite une action immédiate pour sécuriser l'allocation des experts clés. Le dépassement budgétaire potentiel (probabilité 65%, impact 70%) et les défis d'intégration avec les systèmes legacy (probabilité 70%, impact 65%) complètent le tableau des risques majeurs. Des plans de mitigation détaillés ont été définis pour chaque risque, incluant notamment la mise en place d'un processus de change request formel et l'allocation dédiée des ressources critiques.

Trois décisions stratégiques urgentes requièrent des arbitrages au niveau COMEX et CODIR. Le choix du fournisseur cloud (budget estimé 450K€) est particulièrement critique car il conditionne l'ensemble de l'architecture technique future. La validation du périmètre fonctionnel Phase 1 nécessite également un arbitrage entre livraison complète (12 mois) et approche MVP (6 mois), avec des impacts significatifs sur le time-to-market. L'allocation d'un budget de contingence de 15% (300K€) est fortement recommandée pour absorber les imprévus sans blocage administratif.

L'analyse des scénarios prévisionnels indique une probabilité de 60% pour le scénario central (livraison février 2027, budget 2.1M€), soit un léger dépassement maîtrisé de 5%. Le scénario optimiste (20% de probabilité) permettrait une livraison 6 mois avant deadline avec 15% d'économies, tandis que le scénario pessimiste (20% de probabilité) présente un retard de 4 mois et un dépassement de 30%, nécessitant des mesures correctives immédiates.

Les objectifs SMART définis permettent un suivi précis de la performance avec des KPIs mesurables : réduction de 15% des coûts opérationnels (Q3 2026), satisfaction utilisateurs ≥95% (fin 2026), disponibilité système 99.9% (mi-2026) et formation de 100% des utilisateurs avant go-live. Ces objectifs sont ambitieux mais atteignables avec les moyens alloués.

En conclusion, le projet présente un profil risque-bénéfice favorable sous réserve de décisions rapides sur les arbitrages stratégiques et d'un pilotage rigoureux. Les risques identifiés sont maîtrisables avec les plans de mitigation proposés. La réussite dépendra principalement de la disponibilité des ressources techniques clés et de la gestion proactive des changements de périmètre. Un suivi hebdomadaire au niveau comité de pilotage est recommandé pour maintenir la trajectoire vers le succès.`,
  
  recommendations: [
    "Mettre en place immédiatement un comité de pilotage hebdomadaire avec décisionnaires COMEX/CODIR pour garantir des arbitrages rapides et éviter les blocages. Le comité doit avoir mandat pour débloquer budgets et ressources.",
    "Valider dans les 2 semaines le choix du fournisseur cloud (décision bloquante pour l'architecture). Privilégier AWS ou Azure selon compétences internes. Budget : 450K€ sur 3 ans.",
    "Allouer impérativement un budget de contingence de 15% (300K€) pour absorber les dépassements liés aux risques identifiés sans nécessiter de nouvelle demande budgétaire avec délais administratifs.",
    "Recruter ou affecter à temps plein un PMO senior avec expertise en gestion de risques complexes. Le profil doit avoir expérience réussie sur projets similaires >2M€.",
    "Implémenter un tableau de bord temps réel avec KPIs critiques (budget, délais, qualité, risques) accessible au COMEX 24/7. Alertes automatiques si déviations >10%.",
    "Planifier des points de synchronisation bi-hebdomadaires avec les parties prenantes clés (sponsor, métier, IT) pour maintenir l'alignement et gérer proactivement les attentes."
  ]
};

// Helper pour ajouter des délais simulés (comme une vraie API)
export function simulateAPIDelay(minMs: number = 3000, maxMs: number = 8000): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs) + minMs);
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Helper pour calculer les tokens mockés (approximation)
export function calculateMockTokens(inputLength: number, outputLength: number): number {
  // Approximation : 1 token ≈ 4 caractères
  return Math.floor((inputLength + outputLength) / 4);
}
