-- ============================================
-- PACK 15 - AUTH & RÔLES AVANCÉS
-- Schema SQL: Organizations, Memberships, Invitations, Audit Logs
-- Date: 30 Janvier 2026
-- ============================================

-- ============================================
-- TABLE: organizations
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_organizations_created_at ON organizations(created_at DESC);

-- ============================================
-- TABLE: memberships
-- ============================================
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Index pour performances RLS
CREATE INDEX IF NOT EXISTS idx_memberships_org_id ON memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_role ON memberships(role);

-- ============================================
-- TABLE: invitations
-- ============================================
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  invited_by UUID NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Index pour recherche par token et email
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_org_id ON invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);

-- ============================================
-- TABLE: audit_logs
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour audit logs (beaucoup de lectures par organisation)
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- ============================================
-- RLS POLICIES: organizations
-- ============================================

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Lecture (users membres de l'organisation)
CREATE POLICY "Users can read their organizations"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Création (authenticated users)
CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Mise à jour (owner/admin uniquement)
CREATE POLICY "Owners and admins can update organizations"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  );

-- Policy: Suppression (owner uniquement)
CREATE POLICY "Owners can delete organizations"
  ON organizations FOR DELETE
  USING (
    id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role = 'owner'
    )
  );

-- ============================================
-- RLS POLICIES: memberships
-- ============================================

-- Enable RLS
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Policy: Lecture (users de la même organisation)
CREATE POLICY "Users can read memberships in their organization"
  ON memberships FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Création (owner/admin uniquement)
CREATE POLICY "Owners and admins can create memberships"
  ON memberships FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  );

-- Policy: Mise à jour (owner/admin uniquement, pas changer son propre rôle)
CREATE POLICY "Owners and admins can update memberships"
  ON memberships FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
    AND user_id != auth.uid() -- Cannot change own role
  );

-- Policy: Suppression (owner/admin uniquement, pas se supprimer soi-même)
CREATE POLICY "Owners and admins can delete memberships"
  ON memberships FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
    AND user_id != auth.uid() -- Cannot delete own membership
  );

-- ============================================
-- RLS POLICIES: invitations
-- ============================================

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Policy: Lecture (membres de l'organisation)
CREATE POLICY "Users can read invitations in their organization"
  ON invitations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Création (owner/admin uniquement)
CREATE POLICY "Owners and admins can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  );

-- Policy: Mise à jour (owner/admin ou invité lui-même)
CREATE POLICY "Owners, admins, or invitee can update invitations"
  ON invitations FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
    OR (
      email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND status = 'pending'
    )
  );

-- Policy: Suppression (owner/admin uniquement)
CREATE POLICY "Owners and admins can delete invitations"
  ON invitations FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- RLS POLICIES: audit_logs
-- ============================================

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Lecture (owner/admin uniquement)
CREATE POLICY "Owners and admins can read audit logs"
  ON audit_logs FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  );

-- Policy: Création (tous les users authentifiés - via triggers)
CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Pas de UPDATE ni DELETE sur audit_logs (immutable)

-- ============================================
-- MISE À JOUR DES TABLES EXISTANTES
-- ============================================

-- Ajouter organization_id aux tables existantes si nécessaire
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE projects ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX idx_projects_org_id ON projects(organization_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'risks' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE risks ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX idx_risks_org_id ON risks(organization_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'decisions' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE decisions ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX idx_decisions_org_id ON decisions(organization_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'timeline' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE timeline ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX idx_timeline_org_id ON timeline(organization_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reports' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE reports ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX idx_reports_org_id ON reports(organization_id);
  END IF;
END $$;

-- ============================================
-- RLS POLICIES POUR TABLES EXISTANTES
-- ============================================

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read projects in their organization"
  ON projects FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects in their organization"
  ON projects FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update projects in their organization"
  ON projects FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

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

-- Risks (mêmes policies)
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;

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

-- Decisions (mêmes policies)
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

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

-- Timeline (lecture seule pour members)
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read timeline in their organization"
  ON timeline FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can create timeline events"
  ON timeline FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

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
-- FONCTIONS UTILITAIRES
-- ============================================

-- Fonction: Obtenir le rôle d'un user dans une organisation
CREATE OR REPLACE FUNCTION get_user_role(org_id UUID, uid UUID)
RETURNS TEXT AS $$
  SELECT role FROM memberships 
  WHERE organization_id = org_id AND user_id = uid
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Fonction: Vérifier si user est owner/admin
CREATE OR REPLACE FUNCTION is_admin_or_owner(org_id UUID, uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM memberships 
    WHERE organization_id = org_id 
      AND user_id = uid 
      AND role IN ('owner', 'admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Fonction: Logger une action
CREATE OR REPLACE FUNCTION log_action(
  p_organization_id UUID,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    organization_id,
    user_id,
    action,
    resource_type,
    resource_id,
    metadata
  ) VALUES (
    p_organization_id,
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS AUDIT LOGS
-- ============================================

-- Trigger: Log project creation
CREATE OR REPLACE FUNCTION audit_project_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    PERFORM log_action(
      NEW.organization_id,
      'project_created',
      'project',
      NEW.id,
      jsonb_build_object('name', NEW.name)
    );
  ELSIF (TG_OP = 'UPDATE') THEN
    PERFORM log_action(
      NEW.organization_id,
      'project_updated',
      'project',
      NEW.id,
      jsonb_build_object('name', NEW.name)
    );
  ELSIF (TG_OP = 'DELETE') THEN
    PERFORM log_action(
      OLD.organization_id,
      'project_deleted',
      'project',
      OLD.id,
      jsonb_build_object('name', OLD.name)
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_projects
AFTER INSERT OR UPDATE OR DELETE ON projects
FOR EACH ROW EXECUTE FUNCTION audit_project_changes();

-- Trigger: Log risk changes
CREATE OR REPLACE FUNCTION audit_risk_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    PERFORM log_action(
      NEW.organization_id,
      'risk_created',
      'risk',
      NEW.id,
      jsonb_build_object('title', NEW.title, 'severity', NEW.severity)
    );
  ELSIF (TG_OP = 'UPDATE') THEN
    PERFORM log_action(
      NEW.organization_id,
      'risk_updated',
      'risk',
      NEW.id,
      jsonb_build_object('title', NEW.title, 'severity', NEW.severity)
    );
  ELSIF (TG_OP = 'DELETE') THEN
    PERFORM log_action(
      OLD.organization_id,
      'risk_deleted',
      'risk',
      OLD.id,
      jsonb_build_object('title', OLD.title)
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_risks
AFTER INSERT OR UPDATE OR DELETE ON risks
FOR EACH ROW EXECUTE FUNCTION audit_risk_changes();

-- Trigger: Log decision changes
CREATE OR REPLACE FUNCTION audit_decision_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    PERFORM log_action(
      NEW.organization_id,
      'decision_created',
      'decision',
      NEW.id,
      jsonb_build_object('title', NEW.title, 'status', NEW.status)
    );
  ELSIF (TG_OP = 'UPDATE') THEN
    PERFORM log_action(
      NEW.organization_id,
      'decision_updated',
      'decision',
      NEW.id,
      jsonb_build_object('title', NEW.title, 'status', NEW.status)
    );
  ELSIF (TG_OP = 'DELETE') THEN
    PERFORM log_action(
      OLD.organization_id,
      'decision_deleted',
      'decision',
      OLD.id,
      jsonb_build_object('title', OLD.title)
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_decisions
AFTER INSERT OR UPDATE OR DELETE ON decisions
FOR EACH ROW EXECUTE FUNCTION audit_decision_changes();

-- ============================================
-- SEED DATA (OPTIONAL - Pour développement)
-- ============================================

-- Créer une organisation de test
-- INSERT INTO organizations (id, name) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'Demo Organization');

-- Créer un membership owner de test
-- INSERT INTO memberships (organization_id, user_id, role) VALUES
--   ('00000000-0000-0000-0000-000000000001', auth.uid(), 'owner');

-- ============================================
-- FIN SCHEMA PACK 15
-- ============================================
