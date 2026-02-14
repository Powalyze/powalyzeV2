import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }
    
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.user_id;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        // Get subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        // Create or update subscription in database
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan: 'pro',
            status: 'active',
            billing_interval: session.metadata.billing_interval || 'monthly',
            price_monthly: 29.00,
            price_yearly: 24.00,
            currency: 'EUR',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: subscription.items.data[0].price.id,
            is_enterprise: false
          });

        if (error) {
          console.error('Error creating subscription:', error);
        } else {
          // Send activation email
          await fetch(`${request.nextUrl.origin}/api/emails/pro-activated`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.customer_details.email })
          });
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata.user_id;

        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        // Mark subscription as canceled
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        // Update subscription to past_due
        await supabase
          .from('subscriptions')
          .update({
            status: 'past_due'
          })
          .eq('stripe_subscription_id', subscriptionId);

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        // Ensure subscription is active
        await supabase
          .from('subscriptions')
          .update({
            status: 'active'
          })
          .eq('stripe_subscription_id', subscriptionId);

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}
