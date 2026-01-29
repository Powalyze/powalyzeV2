import { NextRequest, NextResponse } from 'next/server';
import { listReports } from '@/actions/powerbi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * API Route: Liste des rapports Power BI d'un projet
 * GET /api/powerbi/list/[projectId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
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

    const { projectId } = await params;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'projectId manquant' },
        { status: 400 }
      );
    }

    // Lister les rapports
    const result = await listReports(projectId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reports: result.reports
    });
  } catch (error) {
    console.error('❌ Error in /api/powerbi/list:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur interne du serveur'
      },
      { status: 500 }
    );
  }
}
