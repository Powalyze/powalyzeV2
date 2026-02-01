-- ========================================
-- RÉPARATION ORGANISATION - POWALYZE
-- ========================================
-- À exécuter dans Supabase → SQL Editor

-- ========================================
-- ÉTAPE 1 : CRÉER ORGANISATION PAR DÉFAUT
-- ========================================
INSERT INTO organizations (name, created_at)
SELECT 
  'Organisation par défaut', 
  now()
WHERE NOT EXISTS (SELECT 1 FROM organizations);

-- ========================================
-- ÉTAPE 2 : ASSIGNER ORGANISATION AUX USERS
-- ========================================
-- Trouver tous les users sans organization et leur assigner la première org disponible
DO $$
DECLARE
  v_default_org_id UUID;
BEGIN
  -- Récupérer une organisation existante ou créer une par défaut
  SELECT id INTO v_default_org_id FROM organizations LIMIT 1;
  
  IF v_default_org_id IS NULL THEN
    -- Créer une organisation si aucune n'existe
    INSERT INTO organizations (name) 
    VALUES ('Organisation par défaut')
    RETURNING id INTO v_default_org_id;
  END IF;
  
  -- Assigner l'organisation à tous les users qui n'en ont pas
  UPDATE users
  SET tenant_id = v_default_org_id
  WHERE tenant_id IS NULL;
  
  RAISE NOTICE 'Organisation assignée: %', v_default_org_id;
END $$;

-- ========================================
-- ÉTAPE 3 : VÉRIFIER LA CONFIGURATION
-- ========================================
-- Afficher tous les users et leur organisation
SELECT 
  u.id as user_id,
  u.email,
  u.role,
  u.tenant_id as organization_id,
  o.name as organization_name
FROM users u
LEFT JOIN organizations o ON o.id = u.tenant_id
ORDER BY u.created_at DESC;

-- ========================================
-- ÉTAPE 4 : RÉPARER LES POLICIES RLS
-- ========================================

-- 4A. Organizations - Permettre lecture de son organisation
DROP POLICY IF EXISTS "org_select" ON organizations;
CREATE POLICY "org_select"
ON organizations
FOR SELECT
USING (
  id IN (
    SELECT tenant_id 
    FROM users 
    WHERE id = auth.uid()
  )
);

-- 4B. Users - Permettre lecture de son profil
DROP POLICY IF EXISTS "users_select" ON users;
CREATE POLICY "users_select"
ON users
FOR SELECT
USING (id = auth.uid());

-- 4C. Projects - Permettre accès aux projets de son organisation
DROP POLICY IF EXISTS "projects_select" ON projects;
CREATE POLICY "projects_select"
ON projects
FOR SELECT
USING (
  organization_id IN (
    SELECT tenant_id 
    FROM users 
    WHERE id = auth.uid()
  )
);

-- 4D. Projects - Permettre création de projets
DROP POLICY IF EXISTS "projects_insert" ON projects;
CREATE POLICY "projects_insert"
ON projects
FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT tenant_id 
    FROM users 
    WHERE id = auth.uid()
  )
  AND user_id = auth.uid()
);

-- 4E. Projects - Permettre modification de ses projets
DROP POLICY IF EXISTS "projects_update" ON projects;
CREATE POLICY "projects_update"
ON projects
FOR UPDATE
USING (
  user_id = auth.uid()
  AND organization_id IN (
    SELECT tenant_id 
    FROM users 
    WHERE id = auth.uid()
  )
);

-- 4F. Projects - Permettre suppression de ses projets
DROP POLICY IF EXISTS "projects_delete" ON projects;
CREATE POLICY "projects_delete"
ON projects
FOR DELETE
USING (
  user_id = auth.uid()
  AND organization_id IN (
    SELECT tenant_id 
    FROM users 
    WHERE id = auth.uid()
  )
);

-- 4G. Risks - Permettre accès aux risques de son organisation
DROP POLICY IF EXISTS "risks_select" ON risks;
CREATE POLICY "risks_select"
ON risks
FOR SELECT
USING (
  organization_id IN (
    SELECT tenant_id 
    FROM users 
    WHERE id = auth.uid()
  )
);

-- ========================================
-- ÉTAPE 5 : ACTIVER RLS SUR TOUTES LES TABLES
-- ========================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;

-- ========================================
-- ÉTAPE 6 : VÉRIFICATION FINALE
-- ========================================
DO $$
BEGIN
  RAISE NOTICE '✅ RÉPARATION TERMINÉE !';
  RAISE NOTICE '1. Organisation par défaut créée/vérifiée';
  RAISE NOTICE '2. Tous les users ont une organisation';
  RAISE NOTICE '3. Policies RLS configurées';
  RAISE NOTICE '4. RLS activé sur toutes les tables';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Vérifiez les résultats ci-dessus';
END $$;

-- ========================================
-- REQUÊTE DE DIAGNOSTIC
-- ========================================
-- Exécuter ceci pour vérifier que tout est OK
SELECT 
  'Total users' as metric,
  COUNT(*) as count
FROM users
UNION ALL
SELECT 
  'Users sans organisation' as metric,
  COUNT(*) as count
FROM users
WHERE tenant_id IS NULL
UNION ALL
SELECT 
  'Total organisations' as metric,
  COUNT(*) as count
FROM organizations
UNION ALL
SELECT 
  'Total projets' as metric,
  COUNT(*) as count
FROM projects;
