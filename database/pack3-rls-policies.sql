-- ================================================
-- POWALYZE - RLS POLICIES FINALES (PACK 3)
-- ================================================
-- Règles de sécurité Row Level Security pour isolation multi-tenant
-- IMPORTANT: Exécuter APRÈS pack3-schema-final.sql

-- ================================================
-- 1. ORGANIZATIONS
-- ================================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs voient uniquement leurs organisations
CREATE POLICY "Users can view their organizations"
  ON public.organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id 
      FROM public.memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Les admins peuvent mettre à jour leur organisation
CREATE POLICY "Admins can update their organization"
  ON public.organizations FOR UPDATE
  USING (
    id IN (
      SELECT organization_id 
      FROM public.memberships 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================
-- 2. USER_PROFILES
-- ================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (id = auth.uid());

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (id = auth.uid());

-- Les utilisateurs peuvent créer leur profil
CREATE POLICY "Users can create own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- ================================================
-- 3. MEMBERSHIPS
-- ================================================
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs voient leurs propres memberships
CREATE POLICY "Users can view own memberships"
  ON public.memberships FOR SELECT
  USING (user_id = auth.uid());

-- Les admins voient tous les memberships de leur org
CREATE POLICY "Admins can view org memberships"
  ON public.memberships FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.memberships 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Les admins peuvent créer des memberships dans leur org
CREATE POLICY "Admins can create memberships"
  ON public.memberships FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM public.memberships 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Les admins peuvent supprimer des memberships dans leur org
CREATE POLICY "Admins can delete memberships"
  ON public.memberships FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.memberships 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================
-- 4. PROJECTS
-- ================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Les membres voient les projets de leur organisation
CREATE POLICY "Members can view organization projects"
  ON public.projects FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Les membres et admins peuvent créer des projets
CREATE POLICY "Members can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM public.memberships 
      WHERE user_id = auth.uid() AND role IN ('admin', 'member')
    )
  );

-- Les membres et admins peuvent modifier les projets
CREATE POLICY "Members can update projects"
  ON public.projects FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.memberships 
      WHERE user_id = auth.uid() AND role IN ('admin', 'member')
    )
  );

-- Les admins peuvent supprimer les projets
CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.memberships 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================
-- 5. RISKS
-- ================================================
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;

-- Les membres voient les risques des projets de leur org
CREATE POLICY "Members can view organization risks"
  ON public.risks FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM public.memberships 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Les membres peuvent créer des risques
CREATE POLICY "Members can create risks"
  ON public.risks FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM public.memberships 
        WHERE user_id = auth.uid() AND role IN ('admin', 'member')
      )
    )
  );

-- Les membres peuvent modifier les risques
CREATE POLICY "Members can update risks"
  ON public.risks FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM public.memberships 
        WHERE user_id = auth.uid() AND role IN ('admin', 'member')
      )
    )
  );

-- Les membres peuvent supprimer les risques
CREATE POLICY "Members can delete risks"
  ON public.risks FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM public.memberships 
        WHERE user_id = auth.uid() AND role IN ('admin', 'member')
      )
    )
  );

-- ================================================
-- 6. DECISIONS
-- ================================================
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;

-- Les membres voient les décisions des projets de leur org
CREATE POLICY "Members can view organization decisions"
  ON public.decisions FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM public.memberships 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Les membres peuvent créer des décisions
CREATE POLICY "Members can create decisions"
  ON public.decisions FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM public.memberships 
        WHERE user_id = auth.uid() AND role IN ('admin', 'member')
      )
    )
  );

-- Les membres peuvent modifier les décisions
CREATE POLICY "Members can update decisions"
  ON public.decisions FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM public.memberships 
        WHERE user_id = auth.uid() AND role IN ('admin', 'member')
      )
    )
  );

-- Les membres peuvent supprimer les décisions
CREATE POLICY "Members can delete decisions"
  ON public.decisions FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM public.memberships 
        WHERE user_id = auth.uid() AND role IN ('admin', 'member')
      )
    )
  );

-- ================================================
-- VÉRIFICATION
-- ================================================
-- Vérifier que RLS est actif sur toutes les tables
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('organizations', 'user_profiles', 'memberships', 'projects', 'risks', 'decisions');

-- Lister toutes les policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ================================================
-- FIN RLS POLICIES
-- ================================================
-- Sécurité multi-tenant complète activée
-- Les utilisateurs voient uniquement les données de leur(s) organisation(s)
