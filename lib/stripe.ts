// ====================================================================
// STRIPE CLIENT - GESTION DES PAIEMENTS
// ====================================================================

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[STRIPE] STRIPE_SECRET_KEY non definie - Mode DEMO uniquement');
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : null;

export const STRIPE_PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRICE_PRO || 'price_xxx', // À remplacer
    name: 'Powalyze PRO',
    price: 49,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Accès complet au cockpit',
      'Projets illimités',
      'Risques & Décisions',
      'Anomalies & Rapports',
      'IA prédictive',
      'IA générative',
      'Connecteurs API',
      'Multi-utilisateurs (5 max)',
      'Support prioritaire',
    ],
  },
  enterprise: {
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || 'price_yyy', // À remplacer
    name: 'Powalyze ENTERPRISE',
    price: 199,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Tout PRO +',
      'Utilisateurs illimités',
      'API dédiée',
      'Onboarding personnalisé',
      'Support 24/7',
      'SLA garanti',
      'Formations équipe',
      'Conseiller dédié',
    ],
  },
};

/**
 * Créer un Stripe Customer pour une organisation
 */
export async function createStripeCustomer(params: {
  email: string;
  name: string;
  organizationId: string;
}): Promise<string | null> {
  if (!stripe) {
    console.warn('Stripe non initialisé - Retour null');
    return null;
  }

  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: {
        organization_id: params.organizationId,
      },
    });

    return customer.id;
  } catch (error) {
    console.error('Erreur création Stripe customer:', error);
    return null;
  }
}

/**
 * Créer une session Checkout Stripe
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  organizationId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string | null> {
  if (!stripe) {
    console.warn('Stripe non initialisé - Retour null');
    return null;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: params.customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        organization_id: params.organizationId,
        user_id: params.userId,
      },
      subscription_data: {
        trial_period_days: 14, // 14 jours d'essai gratuit
        metadata: {
          organization_id: params.organizationId,
        },
      },
    });

    return session.url;
  } catch (error) {
    console.error('Erreur création Checkout session:', error);
    return null;
  }
}

/**
 * Créer un portal Stripe pour gérer abonnement
 */
export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<string | null> {
  if (!stripe) {
    console.warn('Stripe non initialisé - Retour null');
    return null;
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });

    return session.url;
  } catch (error) {
    console.error('Erreur création Billing Portal:', error);
    return null;
  }
}

/**
 * Récupérer informations d'un abonnement
 */
export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    console.warn('Stripe non initialisé - Retour null');
    return null;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Erreur récupération subscription:', error);
    return null;
  }
}

/**
 * Annuler un abonnement
 */
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    console.warn('Stripe non initialisé - Retour null');
    return null;
  }

  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return subscription;
  } catch (error) {
    console.error('Erreur annulation subscription:', error);
    return null;
  }
}
