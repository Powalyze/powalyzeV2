'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Check } from 'lucide-react';

/**
 * Page Choix du Forfait
 * Options : Demo (gratuit) | Pro (paiement) | Enterprise (contact)
 */
export default function ForfaitPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ForfaitContent />
    </Suspense>
  );
}

function ForfaitContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'demo' | 'pro' | 'enterprise' | null>(null);

  const handleSelectPlan = async (plan: 'demo' | 'pro' | 'enterprise') => {
    setLoading(true);
    setSelectedPlan(plan);

    try {
      // Récupérer l'utilisateur connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Utilisateur non connecté');
      }

      // MODE PRO PERMANENT: Tous les comptes sont Pro par défaut
      // Mise à jour du plan dans la table profiles (pas users)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          plan: 'pro',
          pro_active: true,
          mode: 'admin'
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Redirection vers cockpit Pro (mode permanent)
      router.push('/cockpit/projets');
    } catch (err: any) {
      console.error('Erreur:', err);
      alert(err.message || 'Erreur lors de la sélection du forfait');
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'demo',
      name: 'Demo',
      price: 'Gratuit',
      description: 'Découvrez Powalyze avec des données fictives',
      badge: 'Gratuit',
      badgeColor: 'bg-blue-500/20 text-blue-400',
      features: [
        '3 projets fictifs',
        '2 risques, 2 décisions',
        '1 rapport exécutif IA',
        'Navigation complète du cockpit',
        'IA narrative découverte',
      ],
      cta: 'Commencer gratuitement',
      highlighted: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '49€',
      priceDetail: '/mois',
      description: 'Gouvernance complète pour votre organisation',
      badge: 'Recommandé',
      badgeColor: 'bg-[#D4AF37]/20 text-[#D4AF37]',
      features: [
        'Gouvernance complète (projets, risques, décisions)',
        'Multi‑projets & backlog structuré',
        'Matrice de risques dynamique',
        'Rapports exécutifs IA illimités',
        'Intégrations (Power BI, Jira, DevOps…)',
        'Admin, workflows, templates, sécurité',
        'Support prioritaire',
      ],
      cta: 'Passer en Pro',
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Sur mesure',
      description: 'Solution personnalisée avec accompagnement expert',
      badge: 'Premium',
      badgeColor: 'bg-purple-500/20 text-purple-400',
      features: [
        'Tout du plan Pro',
        'Accompagnement sur site',
        'Audit de gouvernance',
        'Configuration personnalisée',
        'Formation & coaching équipes',
        'Intégrations avancées sur mesure',
        'SLA garanti',
      ],
      cta: 'Contacter un expert',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1C] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#D4AF37] mb-4">
            Choisissez votre forfait
          </h1>
          <p className="text-xl text-slate-300">
            Commencez avec Demo ou passez directement en Pro
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#1C1F26] rounded-2xl p-8 transition-all ${
                plan.highlighted
                  ? 'border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20'
                  : 'border border-slate-700'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#D4AF37] text-[#0A0F1C] px-4 py-1 rounded-full text-sm font-semibold">
                    Recommandé
                  </span>
                </div>
              )}

              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${plan.badgeColor} mb-3`}>
                  {plan.badge}
                </span>
                <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.priceDetail && (
                    <span className="text-slate-400">{plan.priceDetail}</span>
                  )}
                </div>
                <p className="text-sm text-slate-400">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id as any)}
                disabled={loading && selectedPlan !== plan.id}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition disabled:opacity-50 ${
                  plan.highlighted
                    ? 'bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C]'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {loading && selectedPlan === plan.id ? 'Chargement...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-[#D4AF37] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
      <div className="text-white animate-pulse">Chargement des forfaits...</div>
    </div>
  );
}
