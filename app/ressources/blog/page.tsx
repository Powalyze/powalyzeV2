import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

// Articles de blog (données statiques pour le moment)
const blogArticles = [
  {
    id: 1,
    title: "Les 5 piliers d'un Portfolio Governance efficace",
    excerpt: "Découvrez les fondamentaux pour structurer votre gouvernance de portefeuille et maximiser la valeur business.",
    date: "2026-02-01",
    author: "Équipe Powalyze",
    category: "Gouvernance",
    slug: "5-piliers-portfolio-governance",
    readTime: "8 min"
  },
  {
    id: 2,
    title: "IA et Reporting Exécutif : Automatiser sans perdre en pertinence",
    excerpt: "Comment l'intelligence artificielle transforme la création de rapports exécutifs tout en maintenant la qualité stratégique.",
    date: "2026-01-28",
    author: "Équipe Powalyze",
    category: "Intelligence Artificielle",
    slug: "ia-reporting-executif",
    readTime: "6 min"
  },
  {
    id: 3,
    title: "Migration de portfolio : De l'Excel au Cloud en 10 étapes",
    excerpt: "Guide pratique pour digitaliser votre gouvernance de portefeuille sans disruption opérationnelle.",
    date: "2026-01-20",
    author: "Équipe Powalyze",
    category: "Transformation Digitale",
    slug: "migration-portfolio-cloud",
    readTime: "10 min"
  },
  {
    id: 4,
    title: "KPIs : Quels indicateurs pour piloter vos projets stratégiques ?",
    excerpt: "Les métriques essentielles pour mesurer la performance de votre portefeuille projets.",
    date: "2026-01-15",
    author: "Équipe Powalyze",
    category: "Performance",
    slug: "kpis-projets-strategiques",
    readTime: "7 min"
  },
  {
    id: 5,
    title: "COMEX & PMO : Comment aligner les priorités ?",
    excerpt: "Stratégies pour créer un dialogue efficace entre direction exécutive et équipes projet.",
    date: "2026-01-10",
    author: "Équipe Powalyze",
    category: "Management",
    slug: "comex-pmo-alignement",
    readTime: "9 min"
  },
  {
    id: 6,
    title: "Power BI & Powalyze : Le duo gagnant pour vos dashboards",
    excerpt: "Intégrer Power BI avec Powalyze pour créer des tableaux de bord exécutifs percutants.",
    date: "2026-01-05",
    author: "Équipe Powalyze",
    category: "Intégration",
    slug: "powerbi-powalyze-integration",
    readTime: "5 min"
  }
];

const categories = ["Tous", "Gouvernance", "Intelligence Artificielle", "Transformation Digitale", "Performance", "Management", "Intégration"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/ressources" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux ressources
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Blog Powalyze</h1>
          <p className="text-slate-400 text-lg">
            Insights, bonnes pratiques et actualités sur la gouvernance de portefeuille
          </p>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cat === "Tous"
                  ? "bg-amber-500 text-slate-900"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grille d'articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogArticles.map((article) => (
            <article
              key={article.id}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all group"
            >
              {/* Catégorie & Temps de lecture */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                  <Tag className="w-3 h-3" />
                  {article.category}
                </span>
                <span className="text-xs text-slate-500">{article.readTime}</span>
              </div>

              {/* Titre */}
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              {/* Métadonnées */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <Link
                  href={`/ressources/blog/${article.slug}`}
                  className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Lire →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Message "Bientôt disponible" */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl px-8 py-6">
            <p className="text-slate-400">
              <span className="text-amber-400 font-semibold">📚 Plus d'articles à venir</span>
              <br />
              <span className="text-sm">Notre équipe travaille sur de nouveaux contenus pour enrichir votre expérience.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
