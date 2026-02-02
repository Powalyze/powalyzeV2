import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { validateApiKey, logApiCall, checkRateLimit } from '@/lib/apiAuth';

/**
 * GET /api/v1/reports
 * Retourne tous les rapports de l'organisation (pour Power BI)
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
        endpoint: '/api/v1/reports',
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

    // Récupérer les rapports
    const { data: reports, error: queryError } = await supabaseAdmin
      .from('reports')
      .select(`
        id,
        project_id,
        title,
        type,
        content,
        status,
        author_id,
        created_at,
        updated_at
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (queryError) {
      console.error('Erreur récupération rapports:', queryError);
      await logApiCall({
        organizationId,
        apiKeyId,
        endpoint: '/api/v1/reports',
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
      endpoint: '/api/v1/reports',
      method: 'GET',
      statusCode: 200,
      responseTimeMs: Date.now() - startTime,
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json(
      {
        data: reports || [],
        count: reports?.length || 0,
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
    console.error('Erreur API /v1/reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
