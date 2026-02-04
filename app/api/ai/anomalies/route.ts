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
    // Récupérer les données pour analyse
    const [projects, capacities, budgets] = await Promise.all([
      supabase.from('projects').select('*').eq('tenant_id', tenantId),
      supabase.from('capacities').select('*').eq('tenant_id', tenantId),
      supabase.from('budgets').select('*').eq('tenant_id', tenantId),
    ]);

    const anomalies: any[] = [];

    // 1. Détection de dépassements budgétaires
    (projects.data || []).forEach((project: any) => {
      const variance = project.budget_spent - project.budget_planned;
      const variancePercent = (variance / project.budget_planned) * 100;

      if (variancePercent > 15) {
        anomalies.push({
          source: 'ai_detector',
          entity_type: 'project',
          entity_id: project.id,
          description: `Dépassement budgétaire de ${variancePercent.toFixed(1)}% sur le projet "${project.name}" (${variance.toLocaleString()} CHF)`,
          severity: variancePercent > 30 ? 'critical' : variancePercent > 20 ? 'high' : 'medium',
          detected_at: new Date().toISOString(),
          resolved: false,
          tenant_id: tenantId
        });
      }
    });

    // 2. Détection de saturation de capacités
    (capacities.data || []).forEach((capacity: any) => {
      if (capacity.saturation_risk > 80) {
        anomalies.push({
          source: 'ai_detector',
          entity_type: 'capacity',
          entity_id: capacity.id,
          description: `Capacité "${capacity.name}" proche de la saturation (${capacity.saturation_risk}%)`,
          severity: capacity.saturation_risk > 95 ? 'critical' : 'high',
          detected_at: new Date().toISOString(),
          resolved: false,
          tenant_id: tenantId
        });
      }
    });

    // 3. Détection de retards critiques
    (projects.data || []).forEach((project: any) => {
      if (project.end_date && project.status === 'in_progress') {
        const endDate = new Date(project.end_date);
        const today = new Date();
        const daysLate = Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysLate > 0) {
          anomalies.push({
            source: 'ai_detector',
            entity_type: 'project',
            entity_id: project.id,
            description: `Projet "${project.name}" en retard de ${daysLate} jour(s)`,
            severity: daysLate > 60 ? 'critical' : daysLate > 30 ? 'high' : 'medium',
            detected_at: new Date().toISOString(),
            resolved: false,
            tenant_id: tenantId
          });
        }
      }
    });

    // 4. Détection de projets sans activité
    (projects.data || []).forEach((project: any) => {
      if (project.status === 'in_progress' && project.updated_at) {
        const lastUpdate = new Date(project.updated_at);
        const daysSinceUpdate = Math.floor((new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceUpdate > 30) {
          anomalies.push({
            source: 'ai_detector',
            entity_type: 'project',
            entity_id: project.id,
            description: `Projet "${project.name}" sans mise à jour depuis ${daysSinceUpdate} jours`,
            severity: daysSinceUpdate > 90 ? 'high' : 'medium',
            detected_at: new Date().toISOString(),
            resolved: false,
            tenant_id: tenantId
          });
        }
      }
    });

    // Insertion des anomalies détectées
    if (anomalies.length > 0) {
      const { error: insertError } = await supabase
        .from('anomalies')
        .insert(anomalies);

      if (insertError) {
        console.error('[AI Anomalies] Insert error:', insertError);
      }
    }

    return NextResponse.json({
      detected: anomalies.length,
      anomalies: anomalies.map(a => ({
        entity_type: a.entity_type,
        description: a.description,
        severity: a.severity
      }))
    });
  } catch (error: any) {
    console.error('[AI Anomalies] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
