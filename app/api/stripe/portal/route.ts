// ====================================================================
// API STRIPE: BILLING PORTAL
// ====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createBillingPortalSession } from '@/lib/stripe';

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

    // Récupérer organization
    const { data: orgMember } = await supabase
      .from('organizations_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .single();

    if (!orgMember || orgMember.role !== 'pro-owner') {
      return NextResponse.json(
        { error: 'Acces refuse - Seul le pro-owner peut gerer la facturation' },
        { status: 403 }
      );
    }

    // Récupérer subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('organization_id', orgMember.organization_id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Aucun abonnement Stripe trouve' },
        { status: 404 }
      );
    }

    // Créer Billing Portal session
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const portalUrl = await createBillingPortalSession({
      customerId: subscription.stripe_customer_id,
      returnUrl: `${origin}/cockpit/abonnement`,
    });

    if (!portalUrl) {
      return NextResponse.json(
        { error: 'Erreur creation portal session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error('Erreur API portal:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
