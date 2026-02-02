import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { validateApiKey, logApiCall, checkRateLimit } from '@/lib/apiAuth';

/**
 * GET /api/v1/projects
 * Retourne tous les projets de l'organisation (pour Power BI)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Valider le token API
    const { valid, organizationId, apiKeyId, error } = await validateApiKey(request);

    if (!valid || !organizationId || !apiKeyId) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    // Vérifier le rate limit
    const { allowed, remainingRequests } = checkRateLimit(apiKeyId);
    if (!allowed) {
      await logApiCall({
        organizationId,
        apiKeyId,
        endpoint: '/api/v1/projects',
        method: 'GET',
        statusCode: 429,
        responseTimeMs: Date.now() - startTime,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      });
      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 60 requests per minute.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
      );
    }

    // Récupérer les projets
    const { data: projects, error: queryError } = await supabaseAdmin
      .from('projects')
      .select(`
        id,
        name,
        description,
        status,
        priority,
        start_date,
        end_date,
        budget_allocated,
        budget_spent,
        rag_status,
        owner_id,
        tags,
        created_at,
        updated_at
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (queryError) {
      console.error('Erreur récupération projets:', queryError);
      await logApiCall({
        organizationId,
        apiKeyId,
        endpoint: '/api/v1/projects',
        method: 'GET',
        statusCode: 500,
        responseTimeMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Logger l'appel
    await logApiCall({
      organizationId,
      apiKeyId,
      endpoint: '/api/v1/projects',
      method: 'GET',
      statusCode: 200,
      responseTimeMs: Date.now() - startTime,
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json(
      {
        data: projects || [],
        count: projects?.length || 0,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': remainingRequests.toString(),
          'X-RateLimit-Limit': '60',
        },
      }
    );
  } catch (error: any) {
    console.error('Erreur API /v1/projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
