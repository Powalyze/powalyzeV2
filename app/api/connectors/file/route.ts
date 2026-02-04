import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const tenantId = req.headers.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const records = parse(text, { 
      columns: true, 
      skip_empty_lines: true,
      delimiter: ','
    });

    // Mapping des colonnes CSV vers le schéma Powalyze
    const mapped = records.map((r: any) => ({
      name: r['Nom projet'] || r['Project Name'] || r['name'],
      owner: r['Responsable'] || r['Owner'] || r['owner'],
      status: mapStatus(r['Statut'] || r['Status'] || r['status']),
      start_date: r['Début'] || r['Start Date'] || r['start_date'],
      end_date: r['Fin'] || r['End Date'] || r['end_date'],
      strategic_alignment_score: parseFloat(r['Alignement'] || r['Alignment'] || r['alignment'] || '0'),
      budget_planned: parseFloat(r['Budget prévu'] || r['Planned Budget'] || r['budget_planned'] || '0'),
      budget_spent: parseFloat(r['Budget consommé'] || r['Spent Budget'] || r['budget_spent'] || '0'),
      bu: r['BU'] || r['Business Unit'] || r['bu'],
      country: r['Pays'] || r['Country'] || r['country'],
      tenant_id: tenantId
    }));

    // Insertion dans Supabase
    const { data, error } = await supabase
      .from('projects')
      .insert(mapped)
      .select();

    if (error) {
      console.error('[File Connector] Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enregistrer le connecteur
    await supabase.from('connectors').insert({
      name: file.name,
      type: 'file',
      status: 'active',
      last_sync: new Date().toISOString(),
      config: {
        filename: file.name,
        rows_imported: mapped.length
      },
      tenant_id: tenantId
    });

    return NextResponse.json({ 
      imported: mapped.length,
      projects: data
    });
  } catch (error: any) {
    console.error('[File Connector] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function mapStatus(status: string): string {
  const normalized = status?.toLowerCase().trim();
  const statusMap: Record<string, string> = {
    'planifié': 'planned',
    'planned': 'planned',
    'en cours': 'in_progress',
    'in progress': 'in_progress',
    'actif': 'in_progress',
    'active': 'in_progress',
    'en attente': 'on_hold',
    'on hold': 'on_hold',
    'pause': 'on_hold',
    'terminé': 'done',
    'done': 'done',
    'completed': 'done',
    'annulé': 'cancelled',
    'cancelled': 'cancelled',
    'canceled': 'cancelled'
  };
  return statusMap[normalized] || 'planned';
}
