-- ============================================
-- HOTFIX GLOBAL: STOP TOUTE RÉCURSION IMMÉDIATEMENT
-- Exécuter dans Supabase SQL Editor MAINTENANT
-- ============================================

-- 🔴 SUPPRIME TOUTES LES POLICIES SUR TOUTES LES TABLES
-- 🟢 CRÉE DES POLICIES SIMPLES SANS RÉCURSION

-- ============================================
-- ÉTAPE 1: SUPPRIMER TOUTES LES POLICIES
-- ============================================

DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  -- Parcourir TOUTES les policies sur TOUTES les tables
  FOR pol IN 
    SELECT schemaname, tablename, policyname
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename IN ('memberships', 'projects', 'risks', 'decisions', 'timeline_events', 'reports')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
    RAISE NOTICE 'Dropped policy: %.%', pol.tablename, pol.policyname;
  END LOOP;
END $$;

-- ============================================
-- ÉTAPE 2: ACTIVER RLS SUR TOUTES LES TABLES
-- ============================================

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ÉTAPE 3: POLICIES MEMBERSHIPS (SIMPLES)
-- ============================================

CREATE POLICY memberships_select ON public.memberships
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY memberships_insert ON public.memberships
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY memberships_update ON public.memberships
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY memberships_delete ON public.memberships
FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- ÉTAPE 4: POLICIES PROJECTS (AVEC MEMBERSHIP CHECK SAFE)
-- ============================================

-- SELECT: Voir les projets de son organisation
CREATE POLICY projects_select ON public.projects
FOR SELECT 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

-- INSERT: Créer des projets dans son organisation
CREATE POLICY projects_insert ON public.projects
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

-- UPDATE: Modifier les projets de son organisation
CREATE POLICY projects_update ON public.projects
FOR UPDATE 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

-- DELETE: Supprimer les projets de son organisation
CREATE POLICY projects_delete ON public.projects
FOR DELETE 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

-- ============================================
-- ÉTAPE 5: POLICIES RISKS
-- ============================================

CREATE POLICY risks_select ON public.risks
FOR SELECT 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY risks_insert ON public.risks
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY risks_update ON public.risks
FOR UPDATE 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY risks_delete ON public.risks
FOR DELETE 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

-- ============================================
-- ÉTAPE 6: POLICIES DECISIONS
-- ============================================

CREATE POLICY decisions_select ON public.decisions
FOR SELECT 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY decisions_insert ON public.decisions
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY decisions_update ON public.decisions
FOR UPDATE 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY decisions_delete ON public.decisions
FOR DELETE 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

-- ============================================
-- ÉTAPE 7: POLICIES TIMELINE_EVENTS
-- ============================================

CREATE POLICY timeline_events_select ON public.timeline_events
FOR SELECT 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY timeline_events_insert ON public.timeline_events
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY timeline_events_update ON public.timeline_events
FOR UPDATE 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY timeline_events_delete ON public.timeline_events
FOR DELETE 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

-- ============================================
-- ÉTAPE 8: POLICIES REPORTS
-- ============================================

CREATE POLICY reports_select ON public.reports
FOR SELECT 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY reports_insert ON public.reports
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY reports_update ON public.reports
FOR UPDATE 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY reports_delete ON public.reports
FOR DELETE 
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.memberships m
    WHERE m.user_id = auth.uid()
  )
);

-- ============================================
-- ÉTAPE 9: VÉRIFICATION FINALE
-- ============================================

-- Compter les policies par table (devrait être 4 par table = 24 total)
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('memberships', 'projects', 'risks', 'decisions', 'timeline_events', 'reports')
GROUP BY tablename
ORDER BY tablename;

-- Vérifier RLS activé
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('memberships', 'projects', 'risks', 'decisions', 'timeline_events', 'reports')
ORDER BY tablename;

-- ============================================
-- RÉSULTAT ATTENDU:
-- ============================================
-- Chaque table devrait avoir policy_count = 4
-- Chaque table devrait avoir rls_enabled = true
--
-- ✅ Après exécution, faire Ctrl+Shift+R sur le cockpit
-- ✅ La récursion devrait être COMPLÈTEMENT éliminée
-- ✅ Toutes les données devraient charger normalement
