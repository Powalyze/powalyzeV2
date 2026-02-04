import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function ManifestePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero */}
      <section className="relative min-h-[60vh] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Manifeste</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Moins de bruit, plus de <span className="text-amber-400">décisions assumées</span>.
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Powalyze est né d'une lassitude : celle des organisations noyées dans les fichiers, les dashboards décoratifs et les comités sans décisions claires. Nous voulons remettre la gouvernance au centre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/produit"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center gap-2 justify-center"
            >
              Découvrir le produit
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link
              href="/cas-d-usage"
              className="px-8 py-4 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-semibold text-lg transition-all"
            >
              Voir les cas d'usage
            </Link>
          </div>
        </div>
      </section>

      {/* Constat */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Constat</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Trop d'outils, pas assez de gouvernance.</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed">
              Les organisations sont saturées d'outils, de fichiers et de reportings qui ne produisent pas de meilleures décisions. Les PMO bricolent, les data analysts nettoient des données qu'ils n'ont pas cadrées, les COMEX lisent des slides qu'ils n'ont pas le temps de challenger.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed mt-4">
              Powalyze part d'un principe simple : la gouvernance n'est pas un déluge d'informations, c'est un art de choisir.
            </p>
          </div>
        </div>
      </section>

      {/* Ce que Powalyze refuse */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Principes</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Ce que Powalyze refuse.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-bold mb-3">Le reporting décoratif</h3>
              <p className="text-slate-400">Des dashboards impressionnants mais inutilisables en comité.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-bold mb-3">Les fichiers éparpillés</h3>
              <p className="text-slate-400">Des portefeuilles éclatés entre Excel, PowerPoint et outils divers.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-bold mb-3">Les décisions fantômes</h3>
              <p className="text-slate-400">Des arbitrages implicites, jamais tracés, jamais assumés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ce que Powalyze promet */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Engagement</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Ce que Powalyze promet.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle className="text-amber-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">Un cockpit lisible</h3>
              <p className="text-slate-400">Un lieu unique pour vos portefeuilles, scénarios et arbitrages.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle className="text-amber-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">Une donnée utile</h3>
              <p className="text-slate-400">Des modèles propres, articulés avec Power BI, au service des décisions.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle className="text-amber-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">Un partenaire présent</h3>
              <p className="text-slate-400">Un SaaS soutenu par un accompagnement sur site en Suisse.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gradient-to-r from-amber-500/10 to-sky-500/10 border-t border-amber-500/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Prochaine étape</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Projeter ce manifeste dans vos murs.</h2>
          <p className="text-lg text-slate-300 mb-8">
            Le manifeste prend sens lorsqu'il rencontre vos portefeuilles, vos données et vos comités. C'est là que Powalyze devient concret.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg transition-all"
            >
              Planifier une session
            </Link>
            <Link
              href="/vision"
              className="px-8 py-4 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-semibold text-lg transition-all"
            >
              Voir la vision
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
