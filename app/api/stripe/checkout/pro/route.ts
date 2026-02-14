import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe non configuré' }, 
        { status: 503 }
      );
    }
    
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Header d\'authorisation manquant' }, 
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Créer le client Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Vérifier l'utilisateur depuis le token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token invalide' }, 
        { status: 401 }
      );
    }

    const { billingInterval = 'monthly' } = await request.json();

    // Déterminer le price_id selon l'intervalle
    const priceId = billingInterval === 'monthly'
      ? process.env.STRIPE_PRICE_PRO_MONTHLY
      : process.env.STRIPE_PRICE_PRO_YEARLY;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID non configuré pour cet intervalle' }, 
        { status: 500 }
      );
    }

    // Vérifier si un customer Stripe existe déjà
    let customerId: string;
    
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .not('stripe_customer_id', 'is', null)
      .limit(1)
      .single();

    if (existingSub?.stripe_customer_id) {
      customerId = existingSub.stripe_customer_id;
    } else {
      // Créer un nouveau customer Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id
        }
      });
      customerId = customer.id;
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${request.nextUrl.origin}/cockpit?success=true`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        user_id: user.id,
        billing_interval: billingInterval
      },
      subscription_data: {
        metadata: {
          user_id: user.id
        }
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required'
    });

    return NextResponse.json({
      url: session.url
    });

  } catch (error: any) {
    console.error('Erreur création session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne', details: error.message },
      { status: 500 }
    );
  }
}
