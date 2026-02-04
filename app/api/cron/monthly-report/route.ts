import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * CRON Job mensuel - Génération automatique des rapports
 * 
 * Configuration Vercel Cron:
 * - Ajouter dans vercel.json:
 *   {
 *     "crons": [{
 *       "path": "/api/cron/monthly-report",
 *       "schedule": "0 9 1 * *"
 *     }]
 *   }
 * 
 * Cron schedule: "0 9 1 * *" = 1er de chaque mois à 9h00 UTC
 */
export async function GET(req: Request) {
  // Vérifier l'authentification Vercel Cron
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[Cron] Starting monthly report generation...');

    // Récupérer tous les tenants actifs
    const { data: organizations, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name');

    if (orgsError) {
      console.error('[Cron] Failed to fetch organizations:', orgsError);
      return NextResponse.json({ error: orgsError.message }, { status: 500 });
    }

    const results = [];

    // Générer un rapport pour chaque organisation
    for (const org of organizations || []) {
      try {
        const reportRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/reports/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': org.id,
          },
          body: JSON.stringify({
            reportType: 'monthly',
            recipients: [] // TODO: Récupérer depuis org settings
          })
        });

        if (reportRes.ok) {
          const reportData = await reportRes.json();
          results.push({
            org: org.name,
            status: 'success',
            report_id: reportData.report_id,
            report_url: reportData.report_url
          });

          console.log(`[Cron] Generated report for ${org.name}: ${reportData.report_id}`);

          // TODO: Envoyer par email
          // await sendReportEmail(org, reportData);
        } else {
          results.push({
            org: org.name,
            status: 'failed',
            error: await reportRes.text()
          });
        }
      } catch (error: any) {
        console.error(`[Cron] Failed to generate report for ${org.name}:`, error);
        results.push({
          org: org.name,
          status: 'error',
          error: error.message
        });
      }
    }

    console.log('[Cron] Monthly report generation completed:', results);

    return NextResponse.json({
      success: true,
      generated: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status !== 'success').length,
      results
    });
  } catch (error: any) {
    console.error('[Cron] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
