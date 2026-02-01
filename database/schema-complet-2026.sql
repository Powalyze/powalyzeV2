-- ============================================
-- POWALYZE DATABASE SCHEMA COMPLET
-- Version: 1er février 2026
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE: Organizations (Multi-tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  context TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CORE: Users (avec tenant_id)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client', 'demo')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- COCKPIT: Projects
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner VARCHAR(255) NOT NULL,
  deadline DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'on_hold', 'completed', 'cancelled')),
  health VARCHAR(10) NOT NULL DEFAULT 'green' CHECK (health IN ('green', 'yellow', 'red', 'gray')),
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  starred BOOLEAN DEFAULT false,
  budget DECIMAL(15, 2),
  actual_cost DECIMAL(15, 2) DEFAULT 0,
  criticality VARCHAR(10) CHECK (criticality IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_organization ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_starred ON projects(starred);

-- ============================================
-- COCKPIT: Risks
-- ============================================
CREATE TABLE IF NOT EXISTS risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('technical', 'financial', 'organizational', 'external', 'strategic')),
  probability INT NOT NULL CHECK (probability >= 0 AND probability <= 100),
  impact INT NOT NULL CHECK (impact >= 0 AND impact <= 100),
  score DECIMAL(5, 2) GENERATED ALWAYS AS ((probability * impact) / 100.0) STORED,
  status VARCHAR(20) NOT NULL DEFAULT 'identified' CHECK (status IN ('identified', 'assessed', 'mitigating', 'mitigated', 'closed')),
  mitigation_plan TEXT,
  owner VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risks_organization ON risks(organization_id);
CREATE INDEX IF NOT EXISTS idx_risks_project ON risks(project_id);
CREATE INDEX IF NOT EXISTS idx_risks_user ON risks(user_id);
CREATE INDEX IF NOT EXISTS idx_risks_status ON risks(status);

-- ============================================
-- COCKPIT: Decisions
-- ============================================
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('go_nogo', 'budget', 'scope', 'resource', 'strategic', 'operational', 'other')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'deferred')),
  decision_date DATE,
  owner VARCHAR(255) NOT NULL,
  justification TEXT,
  impact_assessment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decisions_organization ON decisions(organization_id);
CREATE INDEX IF NOT EXISTS idx_decisions_project ON decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_decisions_user ON decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON decisions(status);

-- ============================================
-- COCKPIT: Actions
-- ============================================
CREATE TABLE IF NOT EXISTS actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  decision_id UUID REFERENCES decisions(id) ON DELETE SET NULL,
  risk_id UUID REFERENCES risks(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  owner VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'blocked', 'done', 'cancelled')),
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  due_date DATE NOT NULL,
  completed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_actions_organization ON actions(organization_id);
CREATE INDEX IF NOT EXISTS idx_actions_project ON actions(project_id);
CREATE INDEX IF NOT EXISTS idx_actions_user ON actions(user_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);
CREATE INDEX IF NOT EXISTS idx_actions_due_date ON actions(due_date);

-- ============================================
-- COCKPIT: Timeline Events
-- ============================================
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('project', 'risk', 'decision', 'action')),
  entity_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timeline_organization ON timeline_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_timeline_entity ON timeline_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_timeline_created ON timeline_events(created_at DESC);

-- ============================================
-- SUPPORT: Resources
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  capacity_hours INT DEFAULT 160,
  allocated_hours INT DEFAULT 0,
  availability_percentage INT DEFAULT 100 CHECK (availability_percentage >= 0 AND availability_percentage <= 100),
  cost_per_hour DECIMAL(10, 2),
  skills JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_organization ON resources(organization_id);
CREATE INDEX IF NOT EXISTS idx_resources_department ON resources(department);

-- ============================================
-- SUPPORT: Finances
-- ============================================
CREATE TABLE IF NOT EXISTS finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  period VARCHAR(20) NOT NULL,
  budget DECIMAL(15, 2) NOT NULL,
  actual DECIMAL(15, 2) DEFAULT 0,
  forecast DECIMAL(15, 2),
  variance DECIMAL(15, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finances_organization ON finances(organization_id);
CREATE INDEX IF NOT EXISTS idx_finances_project ON finances(project_id);
CREATE INDEX IF NOT EXISTS idx_finances_period ON finances(period);

-- ============================================
-- AUDIT: Audit Logs
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  changes JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_organization ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Organizations
CREATE POLICY organizations_isolation ON organizations
  FOR ALL
  USING (id = auth.jwt() ->> 'organization_id'::text::uuid);

-- RLS Policy: Users
CREATE POLICY users_isolation ON users
  FOR ALL
  USING (tenant_id = auth.jwt() ->> 'organization_id'::text::uuid);

-- RLS Policy: Projects
CREATE POLICY projects_isolation ON projects
  FOR ALL
  USING (organization_id = auth.jwt() ->> 'organization_id'::text::uuid);

-- RLS Policy: Risks
CREATE POLICY risks_isolation ON risks
  FOR ALL
  USING (organization_id = auth.jwt() ->> 'organization_id'::text::uuid);

-- RLS Policy: Decisions
CREATE POLICY decisions_isolation ON decisions
  FOR ALL
  USING (organization_id = auth.jwt() ->> 'organization_id'::text::uuid);

-- RLS Policy: Actions
CREATE POLICY actions_isolation ON actions
  FOR ALL
  USING (organization_id = auth.jwt() ->> 'organization_id'::text::uuid);

-- RLS Policy: Timeline Events
CREATE POLICY timeline_events_isolation ON timeline_events
  FOR ALL
  USING (organization_id = auth.jwt() ->> 'organization_id'::text::uuid);

-- RLS Policy: Resources
CREATE POLICY resources_isolation ON resources
  FOR ALL
  USING (organization_id = auth.jwt() ->> 'organization_id'::text::uuid);

-- RLS Policy: Finances
CREATE POLICY finances_isolation ON finances
  FOR ALL
  USING (organization_id = auth.jwt() ->> 'organization_id'::text::uuid);

-- RLS Policy: Audit Logs
CREATE POLICY audit_logs_isolation ON audit_logs
  FOR ALL
  USING (organization_id = auth.jwt() ->> 'organization_id'::text::uuid);

-- ============================================
-- TRIGGERS: Auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON risks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_decisions_updated_at BEFORE UPDATE ON decisions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON actions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finances_updated_at BEFORE UPDATE ON finances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA: Création organisation par défaut
-- ============================================

-- Créer une organisation par défaut si elle n'existe pas
INSERT INTO organizations (id, name, domain, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Organisation par défaut',
  'default.powalyze.com',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- NOTES IMPORTANTES
-- ============================================

/*
1. STRUCTURE ACTUELLE:
   - users.tenant_id → Référence organizations.id
   - Tous les projets/risques/décisions ont organization_id
   - RLS activé sur toutes les tables sensibles

2. AUTHENTIFICATION:
   - Service role key bypasse RLS (utilisé dans actions.ts)
   - Client standard respecte RLS
   - JWT contient organization_id pour isolation

3. ROLES UTILISATEURS:
   - 'admin': Accès total, gestion système
   - 'client': Projets réels, données propres
   - 'demo': Données fictives, exploration

4. CONTRAINTES:
   - projects.id: UUID avec PRIMARY KEY (auto-increment)
   - users.id: UUID PRIMARY KEY (de Supabase Auth)
   - Pas de contrainte UNIQUE sur projects.id (déjà PRIMARY KEY)

5. POUR CRÉER UN PROJET:
   - Utiliser .insert() simple (pas .upsert())
   - Service role client pour bypasser RLS
   - organization_id + user_id requis
*/
