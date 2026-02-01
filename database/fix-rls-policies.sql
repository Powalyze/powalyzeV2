-- ============================================
-- SCRIPT DE VÉRIFICATION & CORRECTION RLS
-- FIX COCKPIT LIVE - Projects invisibles
-- ============================================

-- PROBLÈME IDENTIFIÉ:
-- Les projets sont créés mais invisibles car les RLS policies
-- vérifient organization_id = auth.uid() au lieu de memberships

-- ============================================
-- ÉTAPE 1: VÉRIFIER LES POLICIES ACTUELLES
-- ============================================

-- Voir toutes les policies sur projects
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'projects';

-- ============================================
-- ÉTAPE 2: SUPPRIMER LES MAUVAISES POLICIES
-- ============================================

-- Supprimer toutes les policies existantes sur projects
DROP POLICY IF EXISTS "Users can read their own projects" ON projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
DROP POLICY IF EXISTS "Enable read access for organization members" ON projects;
DROP POLICY IF EXISTS "Enable insert access for organization members" ON projects;
DROP POLICY IF EXISTS "Enable update access for organization members" ON projects;
DROP POLICY IF EXISTS "Enable delete access for organization members" ON projects;

-- ============================================
-- ÉTAPE 3: CRÉER LES BONNES POLICIES (AVEC MEMBERSHIPS)
-- ============================================

-- Policy: Lecture (via memberships)
CREATE POLICY "Users can read projects in their organization"
  ON projects FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Création (via memberships)
CREATE POLICY "Users can create projects in their organization"
  ON projects FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Mise à jour (via memberships)
CREATE POLICY "Users can update projects in their organization"
  ON projects FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Suppression (owner/admin uniquement)
CREATE POLICY "Owners and admins can delete projects"
  ON projects FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- ÉTAPE 4: FAIRE PAREIL POUR RISKS
-- ============================================

DROP POLICY IF EXISTS "Users can read their own risks" ON risks;
DROP POLICY IF EXISTS "Users can create their own risks" ON risks;
DROP POLICY IF EXISTS "Users can update their own risks" ON risks;
DROP POLICY IF EXISTS "Users can delete their own risks" ON risks;
DROP POLICY IF EXISTS "Enable read access for organization members" ON risks;
DROP POLICY IF EXISTS "Enable insert access for organization members" ON risks;
DROP POLICY IF EXISTS "Enable update access for organization members" ON risks;
DROP POLICY IF EXISTS "Enable delete access for organization members" ON risks;

CREATE POLICY "Users can read risks in their organization"
  ON risks FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create risks in their organization"
  ON risks FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update risks in their organization"
  ON risks FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners and admins can delete risks"
  ON risks FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- ÉTAPE 5: FAIRE PAREIL POUR DECISIONS
-- ============================================

DROP POLICY IF EXISTS "Users can read their own decisions" ON decisions;
DROP POLICY IF EXISTS "Users can create their own decisions" ON decisions;
DROP POLICY IF EXISTS "Users can update their own decisions" ON decisions;
DROP POLICY IF EXISTS "Users can delete their own decisions" ON decisions;
DROP POLICY IF EXISTS "Enable read access for organization members" ON decisions;
DROP POLICY IF EXISTS "Enable insert access for organization members" ON decisions;
DROP POLICY IF EXISTS "Enable update access for organization members" ON decisions;
DROP POLICY IF EXISTS "Enable delete access for organization members" ON decisions;

CREATE POLICY "Users can read decisions in their organization"
  ON decisions FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create decisions in their organization"
  ON decisions FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update decisions in their organization"
  ON decisions FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners and admins can delete decisions"
  ON decisions FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- ÉTAPE 6: TIMELINE (lecture seule pour members)
-- ============================================

DROP POLICY IF EXISTS "Users can read their own timeline" ON timeline_events;
DROP POLICY IF EXISTS "Users can create their own timeline" ON timeline_events;
DROP POLICY IF EXISTS "Enable read access for organization members" ON timeline_events;
DROP POLICY IF EXISTS "Enable insert access for organization members" ON timeline_events;

CREATE POLICY "Users can read timeline in their organization"
  ON timeline_events FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can create timeline events"
  ON timeline_events FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- ÉTAPE 7: REPORTS
-- ============================================

DROP POLICY IF EXISTS "Users can read their own reports" ON reports;
DROP POLICY IF EXISTS "Users can create their own reports" ON reports;
DROP POLICY IF EXISTS "Users can delete their own reports" ON reports;
DROP POLICY IF EXISTS "Enable read access for organization members" ON reports;
DROP POLICY IF EXISTS "Enable insert access for organization members" ON reports;
DROP POLICY IF EXISTS "Enable delete access for organization members" ON reports;

CREATE POLICY "Users can read reports in their organization"
  ON reports FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reports in their organization"
  ON reports FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners and admins can delete reports"
  ON reports FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- ÉTAPE 8: VÉRIFICATION FINALE
-- ============================================

-- Compter les policies par table
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename IN ('projects', 'risks', 'decisions', 'timeline_events', 'reports')
GROUP BY tablename;

-- Voir toutes les policies projects (doit en avoir 4)
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'projects';

-- ============================================
-- ÉTAPE 9: TEST RAPIDE
-- ============================================

-- Vérifier qu'un user peut voir ses projets
-- (Remplacer 'USER_ORG_ID' par l'organization_id du user test)
/*
SELECT * FROM projects 
WHERE organization_id IN (
  SELECT organization_id 
  FROM memberships 
  WHERE user_id = auth.uid()
);
*/

-- ============================================
-- NOTES IMPORTANTES
-- ============================================

-- 1. Les policies utilisent memberships, pas auth.uid() direct
-- 2. Chaque user DOIT avoir un membership dans une organization
-- 3. organization_id DOIT être fourni lors de la création
-- 4. RLS doit être activé: ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DÉPANNAGE
-- ============================================

-- Si projects toujours invisibles:
-- 1. Vérifier que l'user a un membership:
SELECT * FROM memberships WHERE user_id = auth.uid();

-- 2. Vérifier que le projet a bien organization_id:
SELECT id, name, organization_id FROM projects LIMIT 10;

-- 3. Vérifier que RLS est activé:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('projects', 'risks', 'decisions');

-- 4. Désactiver temporairement RLS pour debug (DANGER - prod):
-- ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
