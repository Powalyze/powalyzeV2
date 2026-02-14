import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
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

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError && subError.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Subscription fetch error:', subError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Get user's features if subscription exists
    let features = [];
    if (subscription) {
      const { data: featuresList } = await supabase
        .from('subscription_features')
        .select('*')
        .eq('plan', subscription.plan)
        .eq('is_included', true);
      
      features = featuresList || [];
    }

    // Check if trial is expired
    let isTrialExpired = false;
    if (subscription?.status === 'trialing' && subscription?.trial_end) {
      isTrialExpired = new Date(subscription.trial_end) < new Date();
    }

    // Return subscription status
    return NextResponse.json({
      hasSubscription: !!subscription,
      subscription: subscription || null,
      features,
      isTrialExpired,
      plan: subscription?.plan || 'none',
      status: subscription?.status || 'none',
      needsUpgrade: !subscription || isTrialExpired
    });

  } catch (error: any) {
    console.error('Subscription check error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
