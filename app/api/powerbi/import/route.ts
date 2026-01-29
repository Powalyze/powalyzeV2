import { NextRequest, NextResponse } from 'next/server';
import { importReport } from '@/actions/powerbi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * API Route: Import d'un fichier .pbix dans Power BI
 * POST /api/powerbi/import
 */
export async function POST(request: NextRequest) {
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

    // Parser le FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const reportName = formData.get('reportName') as string;
    const projectId = formData.get('projectId') as string;

    if (!file || !reportName || !projectId) {
      return NextResponse.json(
        { success: false, error: 'Paramètres manquants (file, reportName, projectId)' },
        { status: 400 }
      );
    }

    // Vérifier que c'est bien un fichier .pbix
    if (!file.name.endsWith('.pbix')) {
      return NextResponse.json(
        { success: false, error: 'Le fichier doit être au format .pbix' },
        { status: 400 }
      );
    }

    // Convertir le fichier en Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Importer le rapport
    const result = await importReport(buffer, reportName, projectId, tenantId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reportId: result.reportId,
      message: `Rapport "${reportName}" importé avec succès`
    });
  } catch (error) {
    console.error('❌ Error in /api/powerbi/import:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur interne du serveur'
      },
      { status: 500 }
    );
  }
}
