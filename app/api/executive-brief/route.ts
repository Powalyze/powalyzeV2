import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Récupération des projets
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, status, progress, start_date, end_date, owner_id, updated_at")
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 2. Construction du contexte pour l'IA
  const projectCount = projects?.length ?? 0;
  const avgProgress = projectCount > 0
    ? Math.round(
        (projects?.reduce((acc, p) => acc + (p.progress ?? 0), 0) ?? 0) / projectCount
      )
    : 0;

  const atRisk = projects?.filter(
    (p) => (p.progress ?? 0) < 50 && p.status === "in_progress"
  ) ?? [];

  const completed = projects?.filter((p) => p.status === "completed") ?? [];
  const active = projects?.filter((p) => p.status === "active" || p.status === "in_progress") ?? [];

  // 3. Génération du brief (à remplacer par un vrai appel OpenAI/Azure OpenAI)
  const brief = `
# Brief Exécutif — Portfolio Projets

## Vue d'ensemble
- **Total projets** : ${projectCount}
- **Projets actifs** : ${active.length}
- **Projets terminés** : ${completed.length}
- **Progression moyenne** : ${avgProgress}%

## Projets à risque (${atRisk.length})
${atRisk.length > 0
  ? atRisk
      .slice(0, 3)
      .map((p) => `- **${p.name}** : ${p.progress}% de progression (statut : ${p.status})`)
      .join("\n")
  : "Aucun projet à risque détecté."}

## Actions recommandées
${atRisk.length > 0
  ? `1. Renforcer les équipes sur les projets à moins de 50% de progression
2. Organiser un point de revue cette semaine sur les projets en retard
3. Réévaluer les scopes et deadlines des projets critiques`
  : `1. Maintenir le rythme actuel
2. Anticiper les prochains projets en pipeline
3. Capitaliser sur les succès récents`}

## Tendance générale
${avgProgress > 70
  ? "✅ Le portefeuille progresse bien. La majorité des projets sont sur les rails."
  : avgProgress > 40
  ? "⚠️ Le portefeuille nécessite une attention particulière sur certains projets."
  : "🚨 Plusieurs projets sont en difficulté. Une intervention rapide est recommandée."}
`;

  return NextResponse.json({ brief });
}
