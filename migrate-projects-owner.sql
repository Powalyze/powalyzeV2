-- =====================================
-- MIGRATION: Assigner owner_id aux projets existants
-- À exécuter APRÈS fix-projects-rls.sql
-- =====================================

-- OPTION 1: Assigner tous les projets à l'utilisateur connecté
-- (Exécutez ceci en étant connecté à Supabase SQL Editor)
UPDATE projects 
SET owner_id = auth.uid() 
WHERE owner_id IS NULL;

-- Vérification
SELECT 
  'Projets mis à jour' as status,
  COUNT(*) as count
FROM projects
WHERE owner_id IS NOT NULL;

-- =====================================
-- OPTION 2: Assigner à un utilisateur spécifique
-- =====================================

-- 1. Trouver l'UUID de l'utilisateur
-- SELECT id, email FROM auth.users;

-- 2. Remplacer VOTRE-UUID-ICI par l'UUID réel
-- UPDATE projects 
-- SET owner_id = 'VOTRE-UUID-ICI' 
-- WHERE owner_id IS NULL;

-- =====================================
-- OPTION 3: Migration intelligente basée sur organization_id
-- (Si vous utilisez le système multi-tenant)
-- =====================================

-- Assigner les projets au propriétaire de l'organisation
-- UPDATE projects p
-- SET owner_id = o.owner_id
-- FROM organizations o
-- WHERE p.organization_id = o.id
--   AND p.owner_id IS NULL;

-- =====================================
-- VÉRIFICATION FINALE
-- =====================================

-- Afficher les projets après migration
SELECT 
  id,
  name,
  owner_id,
  organization_id,
  status,
  created_at
FROM projects
ORDER BY created_at DESC;

-- Statistiques
SELECT 
  status,
  COUNT(*) as count,
  COUNT(CASE WHEN owner_id IS NOT NULL THEN 1 END) as with_owner
FROM projects
GROUP BY status;
