import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero */}
      <section className="relative min-h-[60vh] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Vision</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Une gouvernance qui pense en <span className="text-amber-400">portefeuilles, scénarios et capacités</span>.
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Notre vision : donner aux organisations un cockpit de gouvernance capable de relier leurs ambitions, leurs contraintes et leurs données, sans les noyer dans la complexité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gold-standard"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center gap-2 justify-center"
            >
              Voir le Gold Standard
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
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

      {/* Cap */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Cap</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Relier ambitions, contraintes et données.</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Nous voulons que chaque organisation puisse piloter ses transformations comme un portefeuille cohérent de paris, de risques et de trajectoires, soutenu par une donnée propre et une gouvernance explicite.
          </p>
        </div>
      </section>

      {/* Trois axes */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Axes</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Trois axes de la vision Powalyze.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-bold mb-3">Portefeuilles lisibles</h3>
              <p className="text-slate-400">Une vue claire de ce qui est en cours, envisagé, abandonné.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-bold mb-3">Scénarios assumés</h3>
              <p className="text-slate-400">Des trajectoires explicites, comparées, discutées.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-bold mb-3">Capacités maîtrisées</h3>
              <p className="text-slate-400">Un réalisme lucide sur ce que l'on peut réellement absorber.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gradient-to-r from-amber-500/10 to-sky-500/10 border-t border-amber-500/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Cadre</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Découvrir le Gold Standard Powalyze.</h2>
          <p className="text-lg text-slate-300 mb-8">
            La vision prend corps dans un cadre concret : notre Gold Standard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gold-standard"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg transition-all"
            >
              Voir le Gold Standard
            </Link>
            <Link
              href="/manifeste"
              className="px-8 py-4 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-semibold text-lg transition-all"
            >
              Retour au manifeste
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
