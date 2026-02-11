-- ============================================
-- VÉRIFICATION COMPLÈTE DES DONNÉES
-- ============================================
-- Date: 2026-02-04
-- Objectif: Vérifier l'état de la base de données
-- ============================================

-- 1. Vérifier les organizations
SELECT 
  '=== ORGANIZATIONS ===' as section,
  id,
  name,
  created_at
FROM organizations
ORDER BY created_at DESC;

-- 2. Vérifier les users Supabase Auth
SELECT 
  '=== AUTH USERS ===' as section,
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 3. Vérifier les projets
SELECT 
  '=== PROJECTS ===' as section,
  id,
  name,
  organization_id,
  user_id,
  status,
  health,
  progress,
  owner,
  created_at
FROM projects
ORDER BY created_at DESC
LIMIT 10;

-- 4. Vérifier le trigger
SELECT 
  '=== TRIGGER ===' as section,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'ensure_organization_id';

-- 5. Vérifier les contraintes
SELECT 
  '=== CONSTRAINTS ===' as section,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'projects'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name = 'organization_id';

-- 6. Statistiques globales
SELECT 
  (SELECT COUNT(*) FROM organizations) as total_organizations,
  (SELECT COUNT(*) FROM auth.users) as total_auth_users,
  (SELECT COUNT(*) FROM projects) as total_projects,
  (SELECT COUNT(*) FROM projects WHERE organization_id IS NOT NULL) as projects_with_org,
  (SELECT COUNT(*) FROM projects WHERE user_id IS NOT NULL) as projects_with_user;
