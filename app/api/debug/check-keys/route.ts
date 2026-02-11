import { NextResponse } from 'next/server';

/**
 * Endpoint de diagnostic pour vérifier la configuration des API keys
 * GET /api/debug/check-keys
 */
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      supabase_url: {
        configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL 
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...` 
          : 'NOT SET',
        valid: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || false
      },
      supabase_anon_key: {
        configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        valid: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0) > 100
      },
      supabase_service_role_key: {
        configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        valid: (process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0) > 100
      },
      openai_key: {
        configured: !!(process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY),
        type: process.env.AZURE_OPENAI_ENDPOINT ? 'azure' : 'openai',
        valid: !!(process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY)
      }
    },
    recommendations: [] as string[]
  };

  // Générer des recommandations
  if (!diagnostics.checks.supabase_url.configured) {
    diagnostics.recommendations.push('⚠️ NEXT_PUBLIC_SUPABASE_URL non configurée');
  }
  if (!diagnostics.checks.supabase_anon_key.valid) {
    diagnostics.recommendations.push('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY invalide ou manquante');
  }
  if (!diagnostics.checks.supabase_service_role_key.valid) {
    diagnostics.recommendations.push('⚠️ SUPABASE_SERVICE_ROLE_KEY invalide ou manquante');
  }
  if (!diagnostics.checks.openai_key.configured) {
    diagnostics.recommendations.push('ℹ️ Clés OpenAI/Azure non configurées (IA désactivée)');
  }

  if (diagnostics.recommendations.length === 0) {
    diagnostics.recommendations.push('✅ Toutes les clés sont correctement configurées');
  }

  return NextResponse.json(diagnostics, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  });
}
