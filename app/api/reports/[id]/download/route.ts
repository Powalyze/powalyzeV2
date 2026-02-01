/**
 * MODULE RAPPORTS - API Téléchargement de fichier
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const supabase = createSupabaseBrowserClient();

    // Récupérer le rapport
    const { data: report, error } = await supabase
      .from('reports')
      .select('file_url, file_name')
      .eq('id', params.id)
      .eq('organization_id', tenantId)
      .single();

    if (error || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Rediriger vers l'URL publique du fichier
    return NextResponse.redirect(report.file_url);
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
