export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured?: boolean;
  sections: BlogSection[];
};

export function slugifyCategory(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ia-transforme-gouvernance-2026",
    title: "Comment l'IA transforme la gouvernance de projets en 2026",
    excerpt:
      "L'intelligence artificielle n'est plus une option pour les PMO. Découvrez comment les équipes avant-gardistes utilisent l'IA pour prédire les risques, optimiser les ressources et générer des synthèses exécutives en quelques secondes.",
    author: "Équipe Powalyze",
    date: "28 janvier 2026",
    readTime: "8 min",
    category: "IA & Gouvernance",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
    featured: true,
    sections: [
      {
        heading: "1. L'IA devient un copilote de gouvernance",
        paragraphs: [
          "En 2026, les PMO les plus performants utilisent l'IA comme un copilote quotidien. Au lieu de produire des reportings manuels, l'IA agrège les données projets, détecte les anomalies et met en lumière les décisions critiques.",
          "Le résultat: des comités plus courts, des décisions mieux étayées et une vision stratégique en temps réel."
        ],
        bullets: [
          "Réduction de 60% du temps de préparation COMEX",
          "Détection automatique des risques émergents",
          "Recommandations priorisées avec impact quantifié"
        ]
      },
      {
        heading: "2. Les 6 actions prioritaires quotidiennes",
        paragraphs: [
          "Powalyze IA Chief of Staff génère chaque matin 6 actions stratégiques. Chaque action est accompagnée d'un impact quantifié, d'un niveau de confiance et d'un responsable proposé.",
          "C'est un changement de paradigme: on ne pilote plus un portefeuille par reporting mensuel, mais par action continue."
        ]
      },
      {
        heading: "3. Gouvernance augmentée = ROI immédiat",
        paragraphs: [
          "Les organisations qui ont adopté l'IA constatent un ROI moyen de 3.2x en 12 mois, principalement grâce à la réduction des dérives budgétaires et à l'accélération des décisions."
        ]
      }
    ]
  },
  {
    slug: "ia-narrative",
    title: "IA narrative : plus qu'un chatbot",
    excerpt:
      "Pourquoi les synthèses exécutives générées par l'IA changent la donne pour les comités de direction.",
    author: "Sophie Martin",
    date: "22 janvier 2026",
    readTime: "5 min",
    category: "IA & Gouvernance",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        heading: "1. Le besoin d'une narration exécutive",
        paragraphs: [
          "Les COMEX ne veulent pas des dashboards: ils veulent des décisions. L'IA narrative transforme des données brutes en histoires stratégiques compréhensibles et actionnables.",
          "Chaque synthèse s'adapte au contexte: priorités métiers, niveau de risque, budget global."
        ]
      },
      {
        heading: "2. Un format court mais impactant",
        paragraphs: [
          "Une synthèse IA efficace tient en 5 minutes de lecture. Elle met en avant les 3 décisions critiques, les risques majeurs et les actions recommandées.",
          "Cette approche réduit la fatigue décisionnelle et améliore la qualité des arbitrages."
        ]
      }
    ]
  },
  {
    slug: "hermes-agile",
    title: "Hermès + Agile : le duo gagnant",
    excerpt:
      "Retour d'expérience sur l'hybridation méthodologique dans une administration publique suisse.",
    author: "Pierre Dubois",
    date: "18 janvier 2026",
    readTime: "7 min",
    category: "Méthodologies",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        heading: "1. Pourquoi hybrider ?",
        paragraphs: [
          "Les organisations publiques doivent respecter des cadres de gouvernance stricts (Hermès), tout en gagnant en vitesse d'exécution (Agile).",
          "L'hybridation permet de garder un contrôle rigoureux tout en accélérant la delivery."
        ]
      },
      {
        heading: "2. Le modèle retenu",
        paragraphs: [
          "Cadre Hermès sur la gouvernance (jalons, livrables, comités), et Scrum sur la delivery (sprints, backlog, démo)."
        ],
        bullets: [
          "Phase de cadrage Hermès",
          "Sprints Agile pour le delivery",
          "Gate décisionnel tous les 2 mois"
        ]
      }
    ]
  },
  {
    slug: "roi-cockpit",
    title: "ROI d'un cockpit exécutif",
    excerpt:
      "Étude de cas : comment un groupe bancaire a réduit de 40% le temps passé en comités.",
    author: "Marc Schneider",
    date: "15 janvier 2026",
    readTime: "6 min",
    category: "Cas clients",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        heading: "Contexte",
        paragraphs: [
          "Groupe bancaire international, 120 projets en parallèle, reporting manuel et peu fiable.",
          "Le COMEX passait 3 heures par mois à consolider des slides PowerPoint."
        ]
      },
      {
        heading: "Résultats après 6 mois",
        paragraphs: [
          "Le cockpit Powalyze a réduit le temps de préparation COMEX de 40%, et amélioré la qualité des décisions grâce à des données temps réel."
        ],
        bullets: [
          "-40% temps de comités",
          "+25% décisions prises par séance",
          "ROI 3.1x la première année"
        ]
      }
    ]
  },
  {
    slug: "velocite-predictive",
    title: "Vélocité prédictive en Agile",
    excerpt:
      "Comment l'IA prédit avec précision vos dates de livraison à partir de votre historique de sprints.",
    author: "Laura Chen",
    date: "10 janvier 2026",
    readTime: "5 min",
    category: "Agile",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        heading: "1. Le problème des estimations",
        paragraphs: [
          "Les équipes agiles sous-estiment souvent la charge réelle. Les estimations deviennent vite obsolètes."
        ]
      },
      {
        heading: "2. L'IA pour prédire",
        paragraphs: [
          "En analysant 12 sprints historiques, l'IA calcule une vélocité probabiliste et prédit une date de livraison fiable à 90%."
        ]
      }
    ]
  },
  {
    slug: "risques-ia",
    title: "Gestion des risques augmentée par IA",
    excerpt:
      "Les 5 capacités d'IA qui révolutionnent l'identification et la mitigation des risques.",
    author: "Antoine Rousseau",
    date: "5 janvier 2026",
    readTime: "8 min",
    category: "Risques",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        heading: "1. Détection automatique",
        paragraphs: [
          "L'IA identifie des patterns invisibles dans les données projet pour anticiper les risques avant qu'ils ne se matérialisent."
        ]
      },
      {
        heading: "2. Scoring dynamique",
        paragraphs: [
          "Chaque risque est noté en temps réel selon son impact budget, planning et réputationnel."
        ]
      }
    ]
  },
  {
    slug: "kpis-essentiels",
    title: "Dashboard exécutif : les 10 KPIs essentiels",
    excerpt:
      "Quelles métriques afficher dans votre cockpit pour un pilotage stratégique efficace ?",
    author: "Équipe Powalyze",
    date: "2 janvier 2026",
    readTime: "6 min",
    category: "Best Practices",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        heading: "Les KPIs indispensables",
        paragraphs: [
          "Un cockpit exécutif doit rester simple: 10 KPIs maximum. Le reste est du bruit.",
          "Nous recommandons un mix d'indicateurs budget, planning, risque et valeur métier."
        ],
        bullets: [
          "% projets en retard",
          "Budget consommé vs budget prévu",
          "ROI prévisionnel",
          "Taux de décisions clôturées",
          "Capacité ressources disponible"
        ]
      }
    ]
  },
  {
    slug: "power-bi-pmo-guide",
    title: "Power BI pour les PMO : le guide complet",
    excerpt:
      "De la connexion de données au dashboard exécutif : étapes, bonnes pratiques et modèles recommandés.",
    author: "Sarah Dubois",
    date: "12 janvier 2026",
    readTime: "12 min",
    category: "Power BI",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        heading: "1. Structurer votre modèle de données",
        paragraphs: [
          "Un modèle étoile est la base d'un Power BI performant. Définissez vos dimensions (projets, ressources, risques) et votre table de faits (suivi)."
        ]
      },
      {
        heading: "2. Les dashboards à prioriser",
        paragraphs: [
          "Commencez par 3 dashboards: Portfolio overview, risques, finances. Puis itérez selon les besoins COMEX."
        ]
      }
    ]
  },
  {
    slug: "transformation-digitale-pmo",
    title: "ROI de la transformation digitale PMO",
    excerpt:
      "Étude de 25 PMO transformés : les KPIs qui comptent vraiment et comment mesurer le retour sur investissement.",
    author: "Philippe Moreau",
    date: "28 décembre 2025",
    readTime: "15 min",
    category: "Transformation",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        heading: "1. Les gains visibles",
        paragraphs: [
          "La digitalisation d'un PMO réduit en moyenne de 50% le temps de reporting et améliore la fiabilité des données."
        ]
      },
      {
        heading: "2. Les gains invisibles",
        paragraphs: [
          "Au-delà des KPIs, la transformation crée un alignement stratégique et une meilleure adoption par les équipes."
        ]
      }
    ]
  }
];

export const BLOG_CATEGORIES = [
  "IA & Gouvernance",
  "Méthodologies",
  "Cas clients",
  "Best Practices",
  "Power BI",
  "Transformation",
  "Agile",
  "Risques"
].map((name) => ({
  name,
  slug: slugifyCategory(name),
  count: BLOG_POSTS.filter((post) => post.category === name).length
}));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getPostsByCategorySlug(categorySlug: string): BlogPost[] {
  return BLOG_POSTS.filter(
    (post) => slugifyCategory(post.category) === categorySlug
  );
}

export function getFeaturedPost(): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.featured);
}
