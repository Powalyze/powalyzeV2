-- ============================================
-- SEED DEMO PROJECTS
-- ============================================
-- Date: 2026-02-04
-- Objectif: Créer des projets de démonstration
-- ============================================

-- Récupérer l'ID de l'organisation par défaut
DO $$
DECLARE
  v_org_id UUID;
  v_user_id UUID;
BEGIN
  -- Récupérer l'organisation par défaut
  SELECT id INTO v_org_id 
  FROM organizations 
  WHERE id = '00000000-0000-0000-0000-000000000001'::uuid 
  LIMIT 1;
  
  -- Si pas d'organisation, en créer une
  IF v_org_id IS NULL THEN
    INSERT INTO organizations (id, name)
    VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'Organisation Démo')
    RETURNING id INTO v_org_id;
  END IF;
  
  -- Récupérer un utilisateur existant (le premier)
  SELECT id INTO v_user_id
  FROM auth.users
  LIMIT 1;
  
  -- Insérer des projets de démonstration
  INSERT INTO projects (
    organization_id,
    user_id,
    name,
    description,
    owner,
    deadline,
    status,
    health,
    progress,
    starred,
    bu,
    country,
    budget_planned,
    budget_spent,
    capacity_needed,
    capacity_allocated,
    strategic_alignment_score
  ) VALUES
  (
    v_org_id,
    v_user_id,
    'Migration Cloud Azure',
    'Migration de l''infrastructure vers Azure Cloud',
    'Jean Dupont',
    CURRENT_DATE + INTERVAL '6 months',
    'active',
    'green',
    65,
    true,
    'IT',
    'France',
    500000,
    325000,
    15,
    12,
    85.5
  ),
  (
    v_org_id,
    v_user_id,
    'Refonte Application Mobile',
    'Refonte complète de l''application mobile client',
    'Marie Martin',
    CURRENT_DATE + INTERVAL '4 months',
    'active',
    'yellow',
    40,
    true,
    'Digital',
    'France',
    350000,
    140000,
    10,
    8,
    75.0
  ),
  (
    v_org_id,
    v_user_id,
    'Programme IA Générative',
    'Déploiement de solutions IA pour améliorer la productivité',
    'Pierre Dubois',
    CURRENT_DATE + INTERVAL '8 months',
    'active',
    'green',
    25,
    false,
    'Innovation',
    'France',
    800000,
    200000,
    20,
    15,
    90.0
  ),
  (
    v_org_id,
    v_user_id,
    'Modernisation ERP',
    'Mise à jour du système ERP SAP vers S/4HANA',
    'Sophie Bernard',
    CURRENT_DATE + INTERVAL '12 months',
    'active',
    'red',
    15,
    true,
    'Finance',
    'France',
    1200000,
    180000,
    25,
    10,
    95.0
  ),
  (
    v_org_id,
    v_user_id,
    'Sécurité Zero Trust',
    'Implémentation d''une architecture Zero Trust',
    'Thomas Petit',
    CURRENT_DATE + INTERVAL '5 months',
    'active',
    'yellow',
    55,
    false,
    'IT Security',
    'France',
    450000,
    247500,
    12,
    10,
    88.0
  ),
  (
    v_org_id,
    v_user_id,
    'Plateforme Data & Analytics',
    'Construction d''une plateforme centralisée de données',
    'Laura Leroy',
    CURRENT_DATE + INTERVAL '10 months',
    'active',
    'green',
    30,
    false,
    'Data',
    'France',
    650000,
    195000,
    18,
    14,
    82.0
  )
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE '✅ 6 projets de démonstration créés avec succès!';
END $$;

-- Vérifier les projets créés
SELECT 
  id,
  name,
  owner,
  status,
  health,
  progress,
  budget_planned,
  starred
FROM projects
ORDER BY created_at DESC
LIMIT 10;
