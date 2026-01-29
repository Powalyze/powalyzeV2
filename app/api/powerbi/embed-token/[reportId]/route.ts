import { NextRequest, NextResponse } from 'next/server';
import { getEmbedToken } from '@/actions/powerbi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * API Route: Génération d'un embed token Power BI
 * GET /api/powerbi/embed-token/[reportId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    // Récupérer les headers d'authentification
    const tenantId = request.headers.get('x-tenant-id');
    const userId = request.headers.get('x-user-id');

    if (!tenantId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { reportId } = await params;

    if (!reportId) {
      return NextResponse.json(
        { success: false, error: 'reportId manquant' },
        { status: 400 }
      );
    }

    // Générer le token d'embed
    const result = await getEmbedToken(reportId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      embedUrl: result.embedUrl,
      embedToken: result.embedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // +1h
    });
  } catch (error) {
    console.error('❌ Error in /api/powerbi/embed-token:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur interne du serveur'
      },
      { status: 500 }
    );
  }
}
