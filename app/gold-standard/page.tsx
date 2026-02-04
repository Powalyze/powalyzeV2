import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function GoldStandardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero */}
      <section className="relative min-h-[60vh] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Gold Standard</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Un <span className="text-amber-400">cadre exigeant</span> pour une gouvernance crédible.
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Le Gold Standard Powalyze définit un minimum vital pour une gouvernance stratégique cohérente. Ni usine à gaz, ni bricolage : un socle solide, assumé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/produit/modules"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center gap-2 justify-center"
            >
              Voir les modules
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

      {/* Piliers */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Piliers</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Les piliers du Gold Standard.</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle className="text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-xl font-bold mb-2">Portefeuille unique</h3>
                <p className="text-slate-400">Un référentiel unique des initiatives, partagé, versionné.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle className="text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-xl font-bold mb-2">Scénarios explicites</h3>
                <p className="text-slate-400">Des trajectoires formalisées, comparables, discutables.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle className="text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-xl font-bold mb-2">Capacités réalistes</h3>
                <p className="text-slate-400">Un regard honnête sur les ressources, charges et contraintes.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle className="text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-xl font-bold mb-2">Donnée maîtrisée</h3>
                <p className="text-slate-400">Modèles propres, articulation avec Power BI, gouvernance data.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle className="text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-xl font-bold mb-2">Comités préparés</h3>
                <p className="text-slate-400">Des décisions anticipées, tracées, assumées.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gradient-to-r from-amber-500/10 to-sky-500/10 border-t border-amber-500/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Application</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Appliquer le Gold Standard chez vous.</h2>
          <p className="text-lg text-slate-300 mb-8">
            Nous appliquons ce cadre à vos portefeuilles, vos données, vos comités, en travaillant avec vos équipes sur site.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg transition-all"
            >
              Planifier une session
            </Link>
            <Link
              href="/produit"
              className="px-8 py-4 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-semibold text-lg transition-all"
            >
              Voir le produit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
