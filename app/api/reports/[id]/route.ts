/**
 * MODULE RAPPORTS - API Gestion individuelle d'un rapport
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

    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', params.id)
      .eq('organization_id', tenantId)
      .single();

    if (error || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ report }, { status: 200 });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const params = await context.params;
    const supabase = createSupabaseBrowserClient();

    // Vérifier que le rapport existe et appartient à l'organisation
    const { data: existingReport, error: fetchError } = await supabase
      .from('reports')
      .select('id')
      .eq('id', params.id)
      .eq('organization_id', tenantId)
      .single();

    if (fetchError || !existingReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Mise à jour
    const { data: report, error: updateError } = await supabase
      .from('reports')
      .update({
        summary: body.summary,
        insights: body.insights,
        recommendations: body.recommendations,
        risks: body.risks,
        decisions: body.decisions,
        metadata: body.metadata,
        status: body.status,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
    }

    return NextResponse.json({ report }, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Récupérer le rapport pour obtenir l'URL du fichier
    const { data: report, error: fetchError } = await supabase
      .from('reports')
      .select('file_url')
      .eq('id', params.id)
      .eq('organization_id', tenantId)
      .single();

    if (fetchError || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Extraire le path du storage depuis l'URL
    const url = new URL(report.file_url);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('reports') + 1).join('/');

    // Supprimer le fichier du storage
    const { error: storageError } = await supabase.storage
      .from('reports')
      .remove([filePath]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      // Continue quand même pour supprimer l'enregistrement
    }

    // Supprimer l'enregistrement de la DB
    const { error: deleteError } = await supabase
      .from('reports')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Database deletion error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Report deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
