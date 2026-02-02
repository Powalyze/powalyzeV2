import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Route callback Supabase Auth - Email confirmation
 * Appelée après que l'utilisateur clique sur le lien dans l'email
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    // Exchange code for session (PKCE flow)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Success: Redirect to onboarding forfait
      return NextResponse.redirect(`${origin}/onboarding/forfait`);
    } else {
      console.error('Error exchanging code:', error);
      // Error: Redirect to login with error message
      return NextResponse.redirect(`${origin}/login?error=confirmation_failed&message=${encodeURIComponent(error.message)}`);
    }
  }

  // No code provided: Redirect to login
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
