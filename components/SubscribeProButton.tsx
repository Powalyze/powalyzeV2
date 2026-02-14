'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface SubscribeProButtonProps {
  billingInterval: 'monthly' | 'yearly';
  className?: string;
  children?: React.ReactNode;
}

export default function SubscribeProButton({ 
  billingInterval = 'monthly', 
  className = '',
  children 
}: SubscribeProButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);

    try {
      // 1. Vérifier si l'utilisateur est connecté
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        // Rediriger vers signup avec plan PRO prérempli
        window.location.href = `/signup?plan=pro&interval=${billingInterval}`;
        return;
      }

      // 2. Récupérer le token d'authentification
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        window.location.href = `/login?redirect=/pricing&plan=pro`;
        return;
      }

      // 3. Déterminer le price_id selon l'intervalle
      const priceId = billingInterval === 'monthly' 
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY 
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY;

      if (!priceId) {
        throw new Error('Price ID non configuré');
      }

      // 4. Appeler l'API pour créer une session Stripe Checkout
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          priceId,
          billingInterval 
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la session');
      }

      const { url } = await res.json();

      if (!url) {
        throw new Error('URL de paiement non reçue');
      }

      // 5. Rediriger vers Stripe Checkout
      window.location.href = url;

    } catch (err: any) {
      console.error('Erreur subscription:', err);
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Redirection…
          </span>
        ) : (
          children || "S'abonner au plan Pro"
        )}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
