// ====================================================================
// API STRIPE: CREATE CHECKOUT SESSION
// ====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createCheckoutSession, createStripeCustomer, STRIPE_PLANS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Vérifier authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifie' },
        { status: 401 }
      );
    }

    // Récupérer profil et organisation
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: 'Profil non trouve' },
        { status: 404 }
      );
    }

    // Récupérer organization
    const { data: orgMember } = await supabase
      .from('organizations_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .single();

    if (!orgMember) {
      return NextResponse.json(
        { error: 'Organisation non trouvee' },
        { status: 404 }
      );
    }

    const organizationId = orgMember.organization_id;

    // Récupérer ou créer subscription
    let { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    // Créer Stripe Customer si nécessaire
    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      const { data: org } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', organizationId)
        .single();

      customerId = await createStripeCustomer({
        email: profile.email || user.email || '',
        name: org?.name || 'Powalyze Organization',
        organizationId,
      });

      if (!customerId) {
        return NextResponse.json(
          { error: 'Erreur creation Stripe customer' },
          { status: 500 }
        );
      }

      // Sauvegarder customer_id
      await supabase
        .from('subscriptions')
        .upsert({
          organization_id: organizationId,
          stripe_customer_id: customerId,
          plan: 'free',
          status: 'inactive',
        });
    }

    // Récupérer plan depuis body
    const body = await request.json();
    const plan = body.plan || 'pro';

    if (!STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]) {
      return NextResponse.json(
        { error: 'Plan invalide' },
        { status: 400 }
      );
    }

    const priceId = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS].priceId;

    // Créer Checkout Session
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const checkoutUrl = await createCheckoutSession({
      customerId,
      priceId,
      organizationId,
      userId: user.id,
      successUrl: `${origin}/cockpit?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancelUrl: `${origin}/tarifs?canceled=true`,
    });

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Erreur creation checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Erreur API create-checkout:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
