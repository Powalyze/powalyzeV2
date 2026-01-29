// ====================================================================
// API STRIPE: WEBHOOK EVENTS
// ====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe non configure' },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Signature manquante' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET non defini');
    return NextResponse.json(
      { error: 'Configuration webhook manquante' },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Erreur verification webhook:', error.message);
    return NextResponse.json(
      { error: 'Signature invalide' },
      { status: 400 }
    );
  }

  console.log('[WEBHOOK] Webhook recu:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const organizationId = session.metadata?.organization_id;
        const userId = session.metadata?.user_id;

        if (!organizationId) {
          console.error('organization_id manquant dans metadata');
          break;
        }

        // Récupérer subscription Stripe
        const subscriptionId = session.subscription;
        const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId as string) as any;

        // Mettre à jour subscription dans DB
        await supabaseAdmin
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscriptionId,
            stripe_price_id: subscriptionData.items.data[0].price.id,
            plan: 'pro',
            status: subscriptionData.status,
            current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString(),
            trial_end: subscriptionData.trial_end 
              ? new Date(subscriptionData.trial_end * 1000).toISOString() 
              : null,
          })
          .eq('organization_id', organizationId);

        // Promouvoir user en pro-owner s'il est encore demo
        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({ role: 'pro-owner' })
            .eq('id', userId)
            .eq('role', 'demo');
        }

        console.log('[OK] Checkout complete pour organization:', organizationId);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        // Récupérer organization_id depuis customer_id
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('organization_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!sub) {
          console.error('Subscription non trouvee pour customer:', customerId);
          break;
        }

        // Mettre à jour subscription
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('organization_id', sub.organization_id);

        console.log('[OK] Subscription mise a jour:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        // Récupérer organization_id
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('organization_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!sub) {
          console.error('Subscription non trouvee pour customer:', customerId);
          break;
        }

        // Rétrograder status en inactive
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            plan: 'free',
          })
          .eq('organization_id', sub.organization_id);

        // Rétrograder tous les members en demo
        const { data: members } = await supabaseAdmin
          .from('organizations_members')
          .select('user_id')
          .eq('organization_id', sub.organization_id);

        if (members) {
          const userIds = members.map(m => m.user_id);
          await supabaseAdmin
            .from('profiles')
            .update({ role: 'demo' })
            .in('id', userIds);
        }

        console.log('[OK] Subscription annulee:', subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer;

        // Récupérer organization_id
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('organization_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!sub) {
          console.error('Subscription non trouvee pour customer:', customerId);
          break;
        }

        // Mettre status en past_due
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('organization_id', sub.organization_id);

        console.log('[WARNING] Paiement echoue pour:', customerId);
        // TODO: Envoyer email d'alerte
        break;
      }

      default:
        console.log('[INFO] Event non gere:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur traitement webhook:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
