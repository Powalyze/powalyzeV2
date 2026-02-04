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
    // Récupérer capacités et projets
    const [capacities, projects] = await Promise.all([
      supabase.from('capacities').select('*').eq('tenant_id', tenantId),
      supabase.from('projects').select('*').eq('tenant_id', tenantId).eq('status', 'in_progress'),
    ]);

    const capacitiesData = capacities.data || [];
    const projectsData = projects.data || [];

    // Identifier les capacités saturées
    const saturated = capacitiesData.filter((c: any) => c.saturation_risk > 80);
    const available = capacitiesData.filter((c: any) => c.saturation_risk < 50);

    // Générer des propositions de rééquilibrage
    const proposals: any[] = [];

    saturated.forEach((satCap: any) => {
      // Trouver projets utilisant cette capacité saturée
      const relatedProjects = projectsData.filter((p: any) => 
        p.capacities_needed?.includes(satCap.name)
      );

      if (relatedProjects.length > 0 && available.length > 0) {
        // Proposer un transfert vers capacité disponible
        const targetCapacity = available[0];
        const projectToMove = relatedProjects[0];

        proposals.push({
          type: 'capacity_reallocation',
          from: {
            capacity: satCap.name,
            saturation: satCap.saturation_risk,
            fte_available: satCap.fte_available,
          },
          to: {
            capacity: targetCapacity.name,
            saturation: targetCapacity.saturation_risk,
            fte_available: targetCapacity.fte_available,
          },
          project: {
            id: projectToMove.id,
            name: projectToMove.name,
          },
          expected_impact: {
            from_saturation: satCap.saturation_risk - 15,
            to_saturation: targetCapacity.saturation_risk + 10,
          },
          recommendation: 'high',
          rationale: `Transférer le projet "${projectToMove.name}" de "${satCap.name}" (${satCap.saturation_risk}% saturé) vers "${targetCapacity.name}" (${targetCapacity.saturation_risk}% saturé) pour équilibrer la charge.`
        });
      }
    });

    // Proposer des ajustements de priorités
    const highAlignmentProjects = projectsData
      .filter((p: any) => p.strategic_alignment_score > 80)
      .sort((a: any, b: any) => b.strategic_alignment_score - a.strategic_alignment_score);

    const lowAlignmentProjects = projectsData
      .filter((p: any) => p.strategic_alignment_score < 50)
      .sort((a: any, b: any) => a.strategic_alignment_score - b.strategic_alignment_score);

    if (lowAlignmentProjects.length > 0) {
      proposals.push({
        type: 'priority_adjustment',
        action: 'pause_low_alignment',
        projects: lowAlignmentProjects.slice(0, 2).map((p: any) => ({
          id: p.id,
          name: p.name,
          alignment: p.strategic_alignment_score,
        })),
        recommendation: 'medium',
        rationale: `Mettre en pause ${lowAlignmentProjects.slice(0, 2).length} projet(s) à faible alignement stratégique pour libérer des capacités pour les projets prioritaires.`
      });
    }

    if (highAlignmentProjects.length > 0 && saturated.length > 0) {
      proposals.push({
        type: 'priority_adjustment',
        action: 'accelerate_high_alignment',
        projects: highAlignmentProjects.slice(0, 2).map((p: any) => ({
          id: p.id,
          name: p.name,
          alignment: p.strategic_alignment_score,
        })),
        recommendation: 'high',
        rationale: `Accélérer ${highAlignmentProjects.slice(0, 2).length} projet(s) à fort alignement stratégique en réaffectant les capacités libérées.`
      });
    }

    return NextResponse.json({
      analysis: {
        total_capacities: capacitiesData.length,
        saturated_capacities: saturated.length,
        available_capacities: available.length,
        active_projects: projectsData.length,
      },
      proposals,
      summary: proposals.length > 0 
        ? `${proposals.length} proposition(s) de rééquilibrage identifiées`
        : 'Aucun rééquilibrage nécessaire'
    });
  } catch (error: any) {
    console.error('[AI Rebalance] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
