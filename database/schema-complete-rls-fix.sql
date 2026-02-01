-- ============================================
-- BLOC FIX COMPLET SUPABASE
-- SÉCURISATION ORGANISATIONS / MEMBRES / COCKPIT
-- Date: 30 Janvier 2026
-- ============================================

--------------------------------------------------
-- 1) TABLES STRUCTURANTES
--------------------------------------------------

-- ORGANISATIONS
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEMBRES
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- AUDIT LOGS (OPTIONNEL MAIS RECOMMANDÉ)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVITATIONS (pour inviter des membres)
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  invited_by UUID NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

--------------------------------------------------
-- 2) CRÉER TABLES MANQUANTES (SI NÉCESSAIRE)
--------------------------------------------------

-- Créer timeline_events si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  project_id UUID,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- Créer reports si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  title TEXT NOT NULL,
  content TEXT,
  period TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

--------------------------------------------------
-- 3) COLONNE ORGANIZATION_ID SUR LES TABLES COCKPIT
--------------------------------------------------

-- À adapter aux tables existantes
DO $$ 
BEGIN
  -- Projects
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
    ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS organization_id UUID;
    ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_by UUID;
  END IF;

  -- Risks
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'risks') THEN
    ALTER TABLE public.risks ADD COLUMN IF NOT EXISTS organization_id UUID;
    ALTER TABLE public.risks ADD COLUMN IF NOT EXISTS created_by UUID;
  END IF;

  -- Decisions
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'decisions') THEN
    ALTER TABLE public.decisions ADD COLUMN IF NOT EXISTS organization_id UUID;
    ALTER TABLE public.decisions ADD COLUMN IF NOT EXISTS created_by UUID;
  END IF;

  -- Timeline Events
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'timeline_events') THEN
    ALTER TABLE public.timeline_events ADD COLUMN IF NOT EXISTS organization_id UUID;
  END IF;

  -- Reports
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reports') THEN
    ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS organization_id UUID;
  END IF;
END $$;

--------------------------------------------------
-- 4) INDEX POUR PERFORMANCES
--------------------------------------------------

-- Index avec gestion d'erreur (si table n'existe pas)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
    CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'risks') THEN
    CREATE INDEX IF NOT EXISTS idx_risks_org ON public.risks(organization_id);
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'decisions') THEN
    CREATE INDEX IF NOT EXISTS idx_decisions_org ON public.decisions(organization_id);
  END IF;
  
  -- Timeline events (toujours créée maintenant)
  CREATE INDEX IF NOT EXISTS idx_timeline_org ON public.timeline_events(organization_id);
  
  -- Reports (toujours créée maintenant)
  CREATE INDEX IF NOT EXISTS idx_reports_org ON public.reports(organization_id);
END $$;
CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org ON public.memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_memberships_role ON public.memberships(role);
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);

--------------------------------------------------
-- 4) RLS GLOBALES (ACTIVATION)
--------------------------------------------------

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Activer RLS avec gestion d'erreur (si table n'existe pas)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
    ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'risks') THEN
    ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'decisions') THEN
    ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

--------------------------------------------------
-- 5) POLICIES ORGANISATIONS
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
-- 6) POLICIES MEMBERSHIPS
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
  AND user_id != auth.uid() -- Ne peut pas se supprimer soi-même
);

--------------------------------------------------
-- 7) POLICIES INVITATIONS
--------------------------------------------------

DROP POLICY IF EXISTS invitations_select ON public.invitations;
DROP POLICY IF EXISTS invitations_insert ON public.invitations;
DROP POLICY IF EXISTS invitations_update ON public.invitations;
DROP POLICY IF EXISTS invitations_delete ON public.invitations;

CREATE POLICY invitations_select ON public.invitations
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

CREATE POLICY invitations_insert ON public.invitations
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

CREATE POLICY invitations_update ON public.invitations
FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

CREATE POLICY invitations_delete ON public.invitations
FOR DELETE USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

--------------------------------------------------
-- 8) POLICIES TABLES COCKPIT (PROJECTS / RISKS / DECISIONS / TIMELINE / REPORTS)
--------------------------------------------------

-- PROJECTS
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

-- RISKS
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

-- DECISIONS
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

-- TIMELINE
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

-- REPORTS
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

--------------------------------------------------
-- 9) POLICIES AUDIT_LOGS (LECTURE RESTREINTE)
--------------------------------------------------

DROP POLICY IF EXISTS audit_select ON public.audit_logs;
DROP POLICY IF EXISTS audit_insert ON public.audit_logs;

CREATE POLICY audit_select ON public.audit_logs
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
  )
);

CREATE POLICY audit_insert ON public.audit_logs
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM public.memberships
    WHERE user_id = auth.uid()
  )
);

--------------------------------------------------
-- 10) FONCTIONS UTILITAIRES
--------------------------------------------------

-- Fonction: Obtenir le rôle d'un utilisateur dans une organisation
CREATE OR REPLACE FUNCTION get_user_role(org_id UUID)
RETURNS TEXT AS $$
  SELECT role 
  FROM public.memberships 
  WHERE organization_id = org_id 
    AND user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Fonction: Vérifier si un utilisateur est admin ou owner
CREATE OR REPLACE FUNCTION is_admin_or_owner(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.memberships 
    WHERE organization_id = org_id 
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Fonction: Logger une action dans audit_logs
CREATE OR REPLACE FUNCTION log_action(
  org_id UUID,
  action_name TEXT,
  action_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_logs (organization_id, user_id, action, metadata)
  VALUES (org_id, auth.uid(), action_name, action_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Obtenir la liste des organizations d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_organizations()
RETURNS TABLE(
  organization_id UUID,
  organization_name TEXT,
  user_role TEXT,
  member_since TIMESTAMPTZ
) AS $$
  SELECT 
    o.id,
    o.name,
    m.role,
    m.created_at
  FROM public.organizations o
  INNER JOIN public.memberships m ON m.organization_id = o.id
  WHERE m.user_id = auth.uid()
  ORDER BY m.created_at DESC;
$$ LANGUAGE SQL SECURITY DEFINER;

--------------------------------------------------
-- 11) TRIGGERS AUDIT (OPTIONNEL)
--------------------------------------------------

-- Trigger pour logger les changements sur projects
CREATE OR REPLACE FUNCTION audit_project_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_action(
      NEW.organization_id,
      'project_created',
      jsonb_build_object('project_id', NEW.id, 'project_name', NEW.name)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_action(
      NEW.organization_id,
      'project_updated',
      jsonb_build_object('project_id', NEW.id, 'project_name', NEW.name)
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_action(
      OLD.organization_id,
      'project_deleted',
      jsonb_build_object('project_id', OLD.id, 'project_name', OLD.name)
    );
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_audit_project_changes ON public.projects;
CREATE TRIGGER trigger_audit_project_changes
AFTER INSERT OR UPDATE OR DELETE ON public.projects
FOR EACH ROW EXECUTE FUNCTION audit_project_changes();

-- Trigger pour logger les changements sur risks
CREATE OR REPLACE FUNCTION audit_risk_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_action(
      NEW.organization_id,
      'risk_created',
      jsonb_build_object('risk_id', NEW.id, 'risk_level', NEW.level)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_action(
      NEW.organization_id,
      'risk_updated',
      jsonb_build_object('risk_id', NEW.id, 'risk_level', NEW.level)
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_action(
      OLD.organization_id,
      'risk_deleted',
      jsonb_build_object('risk_id', OLD.id)
    );
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_audit_risk_changes ON public.risks;
CREATE TRIGGER trigger_audit_risk_changes
AFTER INSERT OR UPDATE OR DELETE ON public.risks
FOR EACH ROW EXECUTE FUNCTION audit_risk_changes();

-- Trigger pour logger les changements sur decisions
CREATE OR REPLACE FUNCTION audit_decision_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_action(
      NEW.organization_id,
      'decision_created',
      jsonb_build_object('decision_id', NEW.id, 'decision_impact', NEW.impact)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_action(
      NEW.organization_id,
      'decision_updated',
      jsonb_build_object('decision_id', NEW.id, 'decision_impact', NEW.impact)
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_action(
      OLD.organization_id,
      'decision_deleted',
      jsonb_build_object('decision_id', OLD.id)
    );
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_audit_decision_changes ON public.decisions;
CREATE TRIGGER trigger_audit_decision_changes
AFTER INSERT OR UPDATE OR DELETE ON public.decisions
FOR EACH ROW EXECUTE FUNCTION audit_decision_changes();

--------------------------------------------------
-- 12) TRIGGER: AUTO-UPDATE updated_at
--------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_memberships_updated_at ON public.memberships;
CREATE TRIGGER update_memberships_updated_at
BEFORE UPDATE ON public.memberships
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

--------------------------------------------------
-- 13) CHECKLIST POST-APPLY
--------------------------------------------------

-- VÉRIFICATIONS À EFFECTUER APRÈS L'APPLICATION DE CE SCRIPT:
-- 
-- 1) Vérifier qu'un user nouvellement inscrit a :
--    - une ligne dans organizations
--    - une ligne dans memberships (role = 'owner')
--
--    SELECT * FROM organizations WHERE owner_id = auth.uid();
--    SELECT * FROM memberships WHERE user_id = auth.uid();
--
-- 2) Vérifier que projects.organization_id est bien renseigné à la création
--
--    SELECT id, name, organization_id, created_by FROM projects LIMIT 10;
--
-- 3) Vérifier qu'un user ne voit que les données de son organisation
--
--    SELECT id, name, organization_id FROM projects; -- Doit retourner uniquement vos projets
--
-- 4) Vérifier que la création de projet ne renvoie plus :
--    "Organization ID manquant – Veuillez vous reconnecter"
--
--    -- Tester via l'interface cockpit
--
-- 5) Vérifier que le cockpit LIVE charge bien :
--    - projets
--    - risques
--    - décisions
--    - timeline
--    - rapports
--    sans erreur RLS.
--
--    -- Tester via l'interface cockpit et surveiller les logs
--
-- 6) Vérifier que auth.uid() fonctionne
--
--    SELECT auth.uid() as current_user_id;
--    -- Doit retourner votre user_id (non NULL)
--
-- 7) Vérifier les memberships
--
--    SELECT * FROM get_user_organizations();
--    -- Doit retourner la liste de vos organizations avec votre rôle
--
-- 8) Tester l'insertion d'un projet
--
--    INSERT INTO projects (name, organization_id, created_by)
--    VALUES (
--      'Test RLS',
--      (SELECT organization_id FROM memberships WHERE user_id = auth.uid() LIMIT 1),
--      auth.uid()
--    )
--    RETURNING *;
--
-- 9) Tester la lecture des projets
--
--    SELECT * FROM projects;
--    -- Doit retourner uniquement vos projets (RLS actif)
--
-- 10) Vérifier les audit logs
--
--     SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20;
--     -- Doit afficher les actions récentes

--------------------------------------------------
-- FIN DU SCRIPT
--------------------------------------------------

-- NOTES:
-- - Ce script est IDEMPOTENT: il peut être exécuté plusieurs fois sans erreur
-- - Les DROP POLICY IF EXISTS garantissent qu'on peut réappliquer le script
-- - Les CREATE TABLE IF NOT EXISTS permettent de ne pas écraser les données existantes
-- - Les ALTER TABLE ADD COLUMN IF NOT EXISTS ajoutent les colonnes seulement si elles n'existent pas
-- - Les INDEX IF NOT EXISTS évitent les doublons d'index
-- 
-- APRÈS APPLICATION:
-- - Tester l'inscription d'un nouveau user
-- - Tester la création d'un projet
-- - Vérifier les logs Vercel/Supabase pour erreurs RLS
-- - Monitorer les performances des requêtes avec les nouveaux index
