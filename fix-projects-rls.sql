-- =====================================
-- FIX COMPLET RLS PROJECTS
-- Corrige le problème des projets qui n'apparaissent pas
-- Date: 6 février 2026
-- =====================================

-- 1. S'assurer que la colonne owner_id existe
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS owner_id UUID;

-- 2. Désactiver temporairement RLS
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- 3. Supprimer toutes les policies existantes
DROP POLICY IF EXISTS "projects_select" ON projects;
DROP POLICY IF EXISTS "projects_select_own" ON projects;
DROP POLICY IF EXISTS "projects_insert" ON projects;
DROP POLICY IF EXISTS "projects_insert_own" ON projects;
DROP POLICY IF EXISTS "projects_update" ON projects;
DROP POLICY IF EXISTS "projects_update_own" ON projects;
DROP POLICY IF EXISTS "projects_delete" ON projects;
DROP POLICY IF EXISTS "projects_delete_own" ON projects;

-- 4. Réactiver RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 5. Créer les nouvelles policies (basées sur owner_id UNIQUEMENT)
CREATE POLICY "projects_select_own"
ON projects FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "projects_insert_own"
ON projects FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "projects_update_own"
ON projects FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "projects_delete_own"
ON projects FOR DELETE
USING (owner_id = auth.uid());

-- 6. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);

-- 7. Vérification
SELECT 
  'Total projects' as metric,
  COUNT(*) as count
FROM projects
UNION ALL
SELECT 
  'Projects with owner_id' as metric,
  COUNT(*) as count
FROM projects
WHERE owner_id IS NOT NULL
UNION ALL
SELECT 
  'Projects without owner_id' as metric,
  COUNT(*) as count
FROM projects
WHERE owner_id IS NULL;

-- 8. Afficher les policies actuelles
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  SUBSTRING(qual::text, 1, 100) as condition
FROM pg_policies
WHERE tablename = 'projects';

-- =====================================
-- NOTES IMPORTANTES
-- =====================================
-- 
-- Après avoir exécuté ce script, vous devez :
-- 
-- 1. Mettre à jour les projets existants sans owner_id :
--    UPDATE projects SET owner_id = auth.uid() WHERE owner_id IS NULL;
-- 
-- 2. Ou si vous connaissez votre UUID :
--    UPDATE projects SET owner_id = 'VOTRE-UUID-ICI' WHERE owner_id IS NULL;
-- 
-- 3. Tester l'accès depuis l'application :
--    GET /api/projects
-- 
-- 4. Vérifier que les projets apparaissent dans le cockpit
-- 
-- =====================================
