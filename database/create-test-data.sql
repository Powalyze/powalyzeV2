-- ============================================
-- CRÉER DONNÉES DE TEST
-- ============================================

-- Créer 1 projet de test
INSERT INTO public.projects (
  id,
  organization_id,
  name,
  description,
  status,
  rag_status,
  budget_total,
  budget_spent,
  start_date,
  end_date,
  progress,
  created_by,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'eca7351b-b4a5-400b-bd19-6d53c8ed52b5'::uuid,
  'Projet Test Cockpit',
  'Projet créé pour vérifier que tout fonctionne',
  'in_progress',
  'GREEN',
  100000,
  25000,
  '2026-01-01',
  '2026-06-30',
  35,
  'c7679d53-7d45-48c0-a901-b36aa1a27ccb'::uuid,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Créer 1 risque de test
INSERT INTO public.risks (
  id,
  organization_id,
  project_id,
  title,
  description,
  severity,
  probability,
  status,
  mitigation_plan,
  created_by,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  'eca7351b-b4a5-400b-bd19-6d53c8ed52b5'::uuid,
  p.id,
  'Risque de délai',
  'Le projet pourrait prendre du retard',
  'HIGH',
  'MEDIUM',
  'OPEN',
  'Surveillance hebdomadaire de l''avancement',
  'c7679d53-7d45-48c0-a901-b36aa1a27ccb'::uuid,
  NOW(),
  NOW()
FROM public.projects p
WHERE p.name = 'Projet Test Cockpit'
LIMIT 1;

-- Créer 1 décision de test
INSERT INTO public.decisions (
  id,
  organization_id,
  project_id,
  title,
  description,
  decision_type,
  status,
  impact,
  decided_by,
  decided_at,
  created_by,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  'eca7351b-b4a5-400b-bd19-6d53c8ed52b5'::uuid,
  p.id,
  'Validation du budget',
  'Budget approuvé pour Q1 2026',
  'BUDGET',
  'APPROVED',
  'HIGH',
  'c7679d53-7d45-48c0-a901-b36aa1a27ccb'::uuid,
  NOW(),
  'c7679d53-7d45-48c0-a901-b36aa1a27ccb'::uuid,
  NOW(),
  NOW()
FROM public.projects p
WHERE p.name = 'Projet Test Cockpit'
LIMIT 1;

-- VÉRIFICATION
SELECT 
  'projects' as table_name,
  COUNT(*) as count
FROM public.projects
WHERE organization_id = 'eca7351b-b4a5-400b-bd19-6d53c8ed52b5'
UNION ALL
SELECT 
  'risks' as table_name,
  COUNT(*) as count
FROM public.risks
WHERE organization_id = 'eca7351b-b4a5-400b-bd19-6d53c8ed52b5'
UNION ALL
SELECT 
  'decisions' as table_name,
  COUNT(*) as count
FROM public.decisions
WHERE organization_id = 'eca7351b-b4a5-400b-bd19-6d53c8ed52b5';

-- RÉSULTAT ATTENDU:
-- projects: 1
-- risks: 1
-- decisions: 1
