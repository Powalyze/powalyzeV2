// ============================================================
// API ROUTE — REPORTS & EXPORTS
// /app/api/reports/export/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-cockpit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');
    const type = searchParams.get('type'); // 'projects' | 'decisions' | 'risks'
    const format = searchParams.get('format') ?? 'csv';

    if (!organizationId || !type) {
      return NextResponse.json(
        { error: 'MISSING_PARAMS', message: 'organizationId et type requis' },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient(true);

    let rows: any[] = [];
    if (type === 'projects') {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', organizationId);
      if (error) throw error;
      rows = data ?? [];
    } else if (type === 'decisions') {
      const { data, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('organization_id', organizationId);
      if (error) throw error;
      rows = data ?? [];
    } else if (type === 'risks') {
      const { data, error } = await supabase
        .from('risks')
        .select('*')
        .eq('organization_id', organizationId);
      if (error) throw error;
      rows = data ?? [];
    }

    if (format === 'csv') {
      const csv = toCsv(rows);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${type}.csv"`,
        },
      });
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error: any) {
    console.error('Report export error', error);
    return NextResponse.json(
      { error: 'REPORT_EXPORT_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}

function toCsv(rows: any[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(';')];
  for (const row of rows) {
    lines.push(
      headers
        .map((h) => {
          const v = row[h];
          if (v == null) return '';
          const s = String(v).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(';'),
    );
  }
  return lines.join('\n');
}
