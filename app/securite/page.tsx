import Link from "next/link";
import { ArrowRight, Shield, Lock, Users } from "lucide-react";

export default function SecuritePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero */}
      <section className="relative min-h-[60vh] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Sécurité</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Une plateforme de gouvernance <span className="text-amber-400">ne peut pas</span> être légère sur la sécurité.
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Powalyze est conçu pour des organisations exigeantes. La sécurité, la confidentialité et la gouvernance des accès sont au cœur de l'architecture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center gap-2 justify-center"
            >
              Parler sécurité
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

      {/* Principes de sécurité */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Principes</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Nos principes de sécurité.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <Shield className="text-amber-400 mb-4" size={40} />
              <h3 className="text-xl font-bold mb-3">Hébergement exigeant</h3>
              <p className="text-slate-400">Environnement cloud conforme aux standards modernes.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <Lock className="text-amber-400 mb-4" size={40} />
              <h3 className="text-xl font-bold mb-3">Chiffrement</h3>
              <p className="text-slate-400">Chiffrement en transit et au repos pour les données sensibles.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <Users className="text-amber-400 mb-4" size={40} />
              <h3 className="text-xl font-bold mb-3">Gouvernance des accès</h3>
              <p className="text-slate-400">Rôles, permissions, traçabilité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gradient-to-r from-amber-500/10 to-sky-500/10 border-t border-amber-500/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4">Transparence</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Discuter de vos exigences.</h2>
          <p className="text-lg text-slate-300 mb-8">
            Nous adaptons le dispositif à vos contraintes réglementaires et internes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg transition-all"
            >
              Planifier une session
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
    </div>
  );
}
