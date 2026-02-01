-- ============================================
-- FIX URGENT: Créer le membership manquant
-- ============================================

-- ÉTAPE 1: Vérifier si le membership existe
SELECT 
  id,
  user_id,
  organization_id,
  role
FROM public.memberships
WHERE user_id = 'c7679d53-7d45-48c0-a901-b36aa1a27ccb';

-- Si résultat VIDE, exécuter l'INSERT ci-dessous:

-- ÉTAPE 2: Créer le membership (OWNER)
INSERT INTO public.memberships (
  id,
  user_id,
  organization_id,
  role,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'c7679d53-7d45-48c0-a901-b36aa1a27ccb'::uuid,
  'eca7351b-b4a5-400b-bd19-6d53c8ed52b5'::uuid,
  'owner',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- ÉTAPE 3: Vérifier que ça a fonctionné
SELECT 
  id,
  user_id,
  organization_id,
  role,
  created_at
FROM public.memberships
WHERE user_id = 'c7679d53-7d45-48c0-a901-b36aa1a27ccb';

-- RÉSULTAT ATTENDU:
-- 1 ligne avec role = 'owner'
-- organization_id = eca7351b-b4a5-400b-bd19-6d53c8ed52b5
