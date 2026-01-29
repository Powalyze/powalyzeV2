import { NextRequest, NextResponse } from 'next/server';
import { deleteReport } from '@/actions/powerbi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * API Route: Suppression d'un rapport Power BI
 * DELETE /api/powerbi/[reportId]
 */
export async function DELETE(
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

    // Supprimer le rapport
    const result = await deleteReport(reportId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Rapport supprimé avec succès'
    });
  } catch (error) {
    console.error('❌ Error in /api/powerbi/delete:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur interne du serveur'
      },
      { status: 500 }
    );
  }
}
