import { NextRequest, NextResponse } from 'next/server';

const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }
    
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // Create Stripe portal session
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = subscription.customer;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.nextUrl.origin}/cockpit/profil`
    });

    return NextResponse.json({
      url: session.url
    });

  } catch (error: any) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
