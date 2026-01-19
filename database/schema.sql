-- Powalyze Database Schema
-- Multi-tenant PostgreSQL Database pour Cockpit Exécutif

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE: Organizations (Multi-tenant)
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  context TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CORE: Users
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('COMEX', 'PMO', 'PM', 'ANALYSTE', 'ADMIN')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- COCKPIT: Projects
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sponsor VARCHAR(255) NOT NULL,
  pm VARCHAR(255),
  business_unit VARCHAR(255),
  budget DECIMAL(15, 2) NOT NULL,
  actual_cost DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(20) NOT NULL CHECK (status IN ('DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED')),
  rag_status VARCHAR(10) NOT NULL CHECK (rag_status IN ('GREEN', 'YELLOW', 'RED', 'GRAY')),
  criticality VARCHAR(10) CHECK (criticality IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  completion_percentage INT DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  delay_probability INT DEFAULT 0 CHECK (delay_probability >= 0 AND delay_probability <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_organization ON projects(organization_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_criticality ON projects(criticality);

-- ============================================
-- COCKPIT: Risks
-- ============================================
CREATE TABLE risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('TECHNICAL', 'FINANCIAL', 'ORGANIZATIONAL', 'EXTERNAL', 'STRATEGIC')),
  probability INT NOT NULL CHECK (probability >= 0 AND probability <= 100),
  impact INT NOT NULL CHECK (impact >= 0 AND impact <= 100),
  score DECIMAL(5, 2) GENERATED ALWAYS AS ((probability * impact) / 100.0) STORED,
  status VARCHAR(20) NOT NULL CHECK (status IN ('IDENTIFIED', 'ASSESSED', 'MITIGATING', 'MITIGATED', 'CLOSED')),
  mitigation_plan TEXT,
  owner VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risks_organization ON risks(organization_id);
CREATE INDEX idx_risks_project ON risks(project_id);
CREATE INDEX idx_risks_status ON risks(status);

-- ============================================
-- COCKPIT: Decisions
-- ============================================
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('GO_NOGO', 'BUDGET', 'SCOPE', 'RESOURCE', 'STRATEGIC', 'OPERATIONAL', 'OTHER')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'DEFERRED')),
  committee_id UUID,
  decision_date DATE,
  owner VARCHAR(255) NOT NULL,
  justification TEXT,
  impact_assessment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_decisions_organization ON decisions(organization_id);
CREATE INDEX idx_decisions_project ON decisions(project_id);
CREATE INDEX idx_decisions_status ON decisions(status);
CREATE INDEX idx_decisions_committee ON decisions(committee_id);

-- ============================================
-- COCKPIT: Committees
-- ============================================
CREATE TABLE committees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('COMEX', 'CODIR', 'COPIL', 'STEERING', 'OTHER')),
  description TEXT,
  frequency VARCHAR(20) CHECK (frequency IN ('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'AD_HOC')),
  members JSONB DEFAULT '[]',
  next_meeting_date DATE,
  last_meeting_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_committees_organization ON committees(organization_id);
CREATE INDEX idx_committees_type ON committees(type);

-- ============================================
-- COCKPIT: Actions
-- ============================================
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  decision_id UUID REFERENCES decisions(id) ON DELETE SET NULL,
  risk_id UUID REFERENCES risks(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  owner VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'CANCELLED')),
  priority VARCHAR(10) CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  due_date DATE NOT NULL,
  completed_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_actions_organization ON actions(organization_id);
CREATE INDEX idx_actions_project ON actions(project_id);
CREATE INDEX idx_actions_status ON actions(status);
CREATE INDEX idx_actions_due_date ON actions(due_date);
CREATE INDEX idx_actions_owner ON actions(owner);

-- ============================================
-- COCKPIT: Events / Logs (pour narration IA)
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('PROJECT', 'RISK', 'DECISION', 'ACTION', 'COMMITTEE')),
  entity_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_organization ON events(organization_id);
CREATE INDEX idx_events_entity ON events(entity_type, entity_id);
CREATE INDEX idx_events_created ON events(created_at DESC);

-- ============================================
-- SUPPORT: Resources (optional pour phase 2)
-- ============================================
CREATE TABLE resources (
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resources_organization ON resources(organization_id);
CREATE INDEX idx_resources_department ON resources(department);
CREATE INDEX idx_finances_project ON finances(project_id);
CREATE INDEX idx_finances_period ON finances(period);

-- Row Level Security (RLS) Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Projects
CREATE POLICY projects_tenant_isolation ON projects
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- RLS Policies for Risks
CREATE POLICY risks_tenant_isolation ON risks
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- RLS Policies for Resources
CREATE POLICY resources_tenant_isolation ON resources
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- RLS Policies for Finances
CREATE POLICY finances_tenant_isolation ON finances
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  changes JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON risks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finances_updated_at BEFORE UPDATE ON finances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
