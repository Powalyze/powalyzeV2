import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }
    
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { priceId, billingInterval } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Get or create Stripe customer
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
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id
        }
      });
      customerId = customer.id;
    }

    // Create Stripe Checkout Session
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
      success_url: `${request.nextUrl.origin}/cockpit?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        user_id: user.id,
        billing_interval: billingInterval || 'monthly'
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
      sessionId: session.id,
      url: session.url
    });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
