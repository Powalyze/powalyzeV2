-- ============================================
-- PHASE 3 : CRÉER LES POLICIES RLS
-- À exécuter APRÈS la phase 2
-- ============================================

--------------------------------------------------
-- POLICIES ORGANIZATIONS
--------------------------------------------------

DROP POLICY IF EXISTS org_select ON public.organizations;
DROP POLICY IF EXISTS org_insert ON public.organizations;
DROP POLICY IF EXISTS org_update ON public.organizations;
DROP POLICY IF EXISTS org_delete ON public.organizations;

CREATE POLICY org_select ON public.organizations
FOR SELECT USING (
  id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY org_insert ON public.organizations
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

CREATE POLICY org_update ON public.organizations
FOR UPDATE USING (
  id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

CREATE POLICY org_delete ON public.organizations
FOR DELETE USING (
  owner_id = auth.uid()
);

--------------------------------------------------
-- POLICIES MEMBERSHIPS
--------------------------------------------------

DROP POLICY IF EXISTS memberships_select ON public.memberships;
DROP POLICY IF EXISTS memberships_insert ON public.memberships;
DROP POLICY IF EXISTS memberships_update ON public.memberships;
DROP POLICY IF EXISTS memberships_delete ON public.memberships;

CREATE POLICY memberships_select ON public.memberships
FOR SELECT USING (
  user_id = auth.uid()
  OR organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

CREATE POLICY memberships_insert ON public.memberships
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

CREATE POLICY memberships_update ON public.memberships
FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

CREATE POLICY memberships_delete ON public.memberships
FOR DELETE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role = 'owner'
  )
  AND user_id != auth.uid()
);

--------------------------------------------------
-- POLICIES PROJECTS
--------------------------------------------------

DROP POLICY IF EXISTS projects_select ON public.projects;
DROP POLICY IF EXISTS projects_insert ON public.projects;
DROP POLICY IF EXISTS projects_update ON public.projects;
DROP POLICY IF EXISTS projects_delete ON public.projects;

CREATE POLICY projects_select ON public.projects
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY projects_insert ON public.projects
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY projects_update ON public.projects
FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY projects_delete ON public.projects
FOR DELETE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

--------------------------------------------------
-- POLICIES RISKS
--------------------------------------------------

DROP POLICY IF EXISTS risks_select ON public.risks;
DROP POLICY IF EXISTS risks_insert ON public.risks;
DROP POLICY IF EXISTS risks_update ON public.risks;
DROP POLICY IF EXISTS risks_delete ON public.risks;

CREATE POLICY risks_select ON public.risks
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY risks_insert ON public.risks
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY risks_update ON public.risks
FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY risks_delete ON public.risks
FOR DELETE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

--------------------------------------------------
-- POLICIES DECISIONS
--------------------------------------------------

DROP POLICY IF EXISTS decisions_select ON public.decisions;
DROP POLICY IF EXISTS decisions_insert ON public.decisions;
DROP POLICY IF EXISTS decisions_update ON public.decisions;
DROP POLICY IF EXISTS decisions_delete ON public.decisions;

CREATE POLICY decisions_select ON public.decisions
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY decisions_insert ON public.decisions
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY decisions_update ON public.decisions
FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY decisions_delete ON public.decisions
FOR DELETE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

--------------------------------------------------
-- POLICIES TIMELINE_EVENTS
--------------------------------------------------

DROP POLICY IF EXISTS timeline_select ON public.timeline_events;
DROP POLICY IF EXISTS timeline_insert ON public.timeline_events;
DROP POLICY IF EXISTS timeline_update ON public.timeline_events;
DROP POLICY IF EXISTS timeline_delete ON public.timeline_events;

CREATE POLICY timeline_select ON public.timeline_events
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY timeline_insert ON public.timeline_events
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY timeline_update ON public.timeline_events
FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY timeline_delete ON public.timeline_events
FOR DELETE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

--------------------------------------------------
-- POLICIES REPORTS
--------------------------------------------------

DROP POLICY IF EXISTS reports_select ON public.reports;
DROP POLICY IF EXISTS reports_insert ON public.reports;
DROP POLICY IF EXISTS reports_update ON public.reports;
DROP POLICY IF EXISTS reports_delete ON public.reports;

CREATE POLICY reports_select ON public.reports
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY reports_insert ON public.reports
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY reports_update ON public.reports
FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY reports_delete ON public.reports
FOR DELETE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Compter les policies créées
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('organizations', 'memberships', 'projects', 'risks', 'decisions', 'timeline_events', 'reports')
ORDER BY tablename, policyname;

-- RÉSULTAT ATTENDU: 28 policies au total
-- - 4 policies par table (select, insert, update, delete)
-- - 7 tables = 28 policies
