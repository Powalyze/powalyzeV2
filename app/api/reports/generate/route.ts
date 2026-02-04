import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const { reportType = 'monthly', recipients = [] } = await req.json();

    // Récupérer toutes les données du cockpit
    const [overview, projects, decisions, anomalies, risks] = await Promise.all([
      supabase.from('executive_overview').select('*').eq('tenant_id', tenantId).single(),
      supabase.from('projects').select('*').eq('tenant_id', tenantId),
      supabase.from('decisions').select('*').eq('tenant_id', tenantId).eq('status', 'pending'),
      supabase.from('anomalies').select('*').eq('tenant_id', tenantId).eq('resolved', false),
      supabase.from('risks').select('*').eq('tenant_id', tenantId).order('severity', { ascending: false }),
    ]);

    // Générer le résumé IA
    const summaryResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/summary`, {
      method: 'POST',
      headers: { 'x-tenant-id': tenantId }
    });

    let aiSummary = null;
    if (summaryResponse.ok) {
      aiSummary = await summaryResponse.json();
    }

    // Construire le contenu du rapport
    const reportData = {
      generated_at: new Date().toISOString(),
      report_type: reportType,
      period: getCurrentPeriod(reportType),
      overview: overview.data,
      highlights: {
        active_projects: overview.data?.projects_active || 0,
        strategic_alignment: overview.data?.strategic_alignment?.toFixed(1) || '0',
        budget_variance: overview.data?.budget_variance?.toFixed(1) || '0',
        critical_risks: risks.data?.filter((r: any) => r.severity > 70).length || 0,
        pending_decisions: decisions.data?.length || 0,
        unresolved_anomalies: anomalies.data?.length || 0,
      },
      ai_summary: aiSummary,
      top_projects: projects.data
        ?.sort((a: any, b: any) => (b.strategic_alignment_score || 0) - (a.strategic_alignment_score || 0))
        .slice(0, 5)
        .map((p: any) => ({
          name: p.name,
          status: p.status,
          alignment: p.strategic_alignment_score,
          budget_variance: ((p.budget_spent - p.budget_planned) / p.budget_planned * 100).toFixed(1)
        })),
      top_risks: risks.data?.slice(0, 5).map((r: any) => ({
        title: r.title,
        severity: r.severity,
        mitigation: r.mitigation
      })),
      urgent_decisions: decisions.data?.filter((d: any) => d.priority === 'critical' || d.priority === 'high'),
    };

    // Enregistrer le rapport dans la base
    const { data: report, error: insertError } = await supabase
      .from('reports')
      .insert({
        title: `Rapport ${reportType} - ${reportData.period}`,
        type: reportType,
        status: 'generated',
        content: reportData,
        recipients,
        tenant_id: tenantId
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Generate Report] Insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // TODO: Envoyer par email (Resend, SendGrid, etc.)
    // Pour l'instant, retourner le rapport
    return NextResponse.json({
      report_id: report.id,
      report_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reports/${report.id}`,
      data: reportData
    });
  } catch (error: any) {
    console.error('[Generate Report] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getCurrentPeriod(reportType: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.toLocaleString('fr-FR', { month: 'long' });
  const quarter = `Q${Math.floor(now.getMonth() / 3) + 1}`;

  switch (reportType) {
    case 'weekly':
      const weekNum = Math.ceil(now.getDate() / 7);
      return `Semaine ${weekNum} - ${month} ${year}`;
    case 'monthly':
      return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    case 'quarterly':
      return `${quarter} ${year}`;
    case 'annual':
      return `${year}`;
    default:
      return `${month} ${year}`;
  }
}
