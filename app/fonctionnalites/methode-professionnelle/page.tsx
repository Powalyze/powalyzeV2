"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, CheckCircle, Users, Award, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function MethodeProfessionnellePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={20} />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Méthode Professionnelle
              </h1>
              <p className="text-xl text-slate-300">
                SaaS hybride : technologie + expertise conseil. Accompagnement sur mesure.
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              La Méthode Professionnelle de Powalyze combine <strong className="text-amber-400">technologie de pointe</strong> 
              et <strong className="text-orange-400">expertise conseil</strong> pour garantir votre succès. 
              Notre approche SaaS hybride vous offre la puissance d'un outil autonome avec le soutien d'experts 
              qui comprennent vos enjeux métier. Nous ne vendons pas juste un logiciel, nous devenons votre partenaire stratégique.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Target className="text-amber-400" size={24} />
                  Modèle SaaS Hybride
                </h3>
                <p className="text-slate-300">
                  Plateforme autonome avec onboarding assisté. Commencez en autonomie, évoluez avec notre 
                  accompagnement quand vous en avez besoin.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Users className="text-orange-400" size={24} />
                  Expertise Conseil
                </h3>
                <p className="text-slate-300">
                  Consultants certifiés PMI, Scrum et Prince2. Nous vous aidons à structurer vos processus, 
                  former vos équipes et optimiser vos workflows.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="text-emerald-400" size={24} />
                  Accompagnement Sur Mesure
                </h3>
                <p className="text-slate-300">
                  Configuration personnalisée selon votre secteur et taille. Workshops, formations et 
                  sessions de coaching adaptées à vos besoins spécifiques.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Award className="text-purple-400" size={24} />
                  Méthodologie Éprouvée
                </h3>
                <p className="text-slate-300">
                  Framework basé sur les meilleures pratiques PMI, Agile et ITIL. Processus de transformation 
                  digitale qui a fait ses preuves chez +100 clients.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Bénéfices clés</h2>
            <div className="space-y-4">
              {[
                "Onboarding guidé avec chargé de compte dédié",
                "Formation continue de vos équipes aux meilleures pratiques",
                "Support réactif avec SLA garantis (réponse < 4h)",
                "Accompagnement à la conduite du changement",
                "Revues trimestrielles de performance et optimisation",
                "Communauté d'experts et partage de bonnes pratiques"
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/inscription">
            <Button variant="primary" size="lg">
              Demander une démo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
