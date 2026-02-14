import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
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

    // Check if user already has a subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (existingSub) {
      return NextResponse.json({ error: 'User already has a subscription' }, { status: 400 });
    }

    // Create trial subscription
    const trialDays = 14;
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + trialDays);

    const { data: subscription, error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan: 'trial',
        status: 'trialing',
        billing_interval: 'monthly',
        price_monthly: 29.00,
        price_yearly: 24.00,
        currency: 'EUR',
        trial_start: trialStart.toISOString(),
        trial_end: trialEnd.toISOString(),
        trial_days: trialDays,
        current_period_start: trialStart.toISOString(),
        current_period_end: trialEnd.toISOString(),
        is_enterprise: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('Trial creation error:', insertError);
      return NextResponse.json({ error: 'Failed to create trial' }, { status: 500 });
    }

    // Send welcome email (async, don't wait)
    fetch(`${request.nextUrl.origin}/api/emails/trial-started`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        trialEnd: trialEnd.toISOString()
      })
    }).catch(err => console.error('Email send error:', err));

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Trial started successfully'
    });

  } catch (error: any) {
    console.error('Start trial error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
