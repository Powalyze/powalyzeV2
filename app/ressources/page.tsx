import Link from "next/link";
import { ArrowRight, FileText, Users, HelpCircle, BookOpen } from "lucide-react";

export default function RessourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Ressources</h1>
          <p className="text-xl text-slate-300">
            Tout pour réussir votre transformation
          </p>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <ResourceCard
            icon={<FileText size={40} />}
            title="Blog / Insights"
            description="Articles, analyses et retours d'expérience sur la gouvernance de portefeuilles complexes."
            href="/ressources/blog"
          />
          <ResourceCard
            icon={<Users size={40} />}
            title="Cas clients"
            description="Découvrez comment nos clients utilisent Powalyze pour transformer leur gouvernance."
            href="/ressources/cas-clients"
          />
          <ResourceCard
            icon={<HelpCircle size={40} />}
            title="FAQ"
            description="Réponses aux questions fréquentes sur le cockpit, les méthodologies et l'accompagnement."
            href="/ressources/faq"
          />
          <ResourceCard
            icon={<BookOpen size={40} />}
            title="Documentation"
            description="Guides utilisateurs, API, intégrations et bonnes pratiques."
            href="/ressources/documentation"
          />
        </div>
      </section>
    </div>
  );
}

function ResourceCard({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <Link href={href} className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group">
      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 mb-4">{description}</p>
      <div className="inline-flex items-center gap-2 text-amber-400 font-semibold group-hover:gap-3 transition-all">
        Découvrir
        <ArrowRight size={18} />
      </div>
    </Link>
  );
}
