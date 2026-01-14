-- Powalyze Database Schema
-- Multi-tenant PostgreSQL Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('COMEX', 'PMO', 'ANALYSTE')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sponsor VARCHAR(255) NOT NULL,
  business_unit VARCHAR(255) NOT NULL,
  budget DECIMAL(15, 2) NOT NULL,
  actual_cost DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(20) NOT NULL CHECK (status IN ('DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED')),
  rag_status VARCHAR(10) NOT NULL CHECK (rag_status IN ('GREEN', 'YELLOW', 'RED', 'GRAY')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  completion_percentage INT DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  delay_probability INT DEFAULT 0 CHECK (delay_probability >= 0 AND delay_probability <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_tenant ON projects(tenant_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_rag ON projects(rag_status);

-- Risks table
CREATE TABLE risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('TECHNICAL', 'FINANCIAL', 'ORGANIZATIONAL', 'EXTERNAL')),
  probability INT NOT NULL CHECK (probability >= 0 AND probability <= 100),
  impact INT NOT NULL CHECK (impact >= 0 AND impact <= 100),
  score DECIMAL(5, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('IDENTIFIED', 'ASSESSED', 'MITIGATED', 'CLOSED')),
  mitigation_plan TEXT,
  owner VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risks_tenant ON risks(tenant_id);
CREATE INDEX idx_risks_project ON risks(project_id);
CREATE INDEX idx_risks_score ON risks(score DESC);

-- Resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  capacity_hours INT NOT NULL,
  allocated_hours INT DEFAULT 0,
  availability_percentage INT DEFAULT 100 CHECK (availability_percentage >= 0 AND availability_percentage <= 100),
  cost_per_hour DECIMAL(10, 2) NOT NULL,
  skills JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resources_tenant ON resources(tenant_id);
CREATE INDEX idx_resources_department ON resources(department);

-- Finances table
CREATE TABLE finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  budget_total DECIMAL(15, 2) NOT NULL,
  cost_actual DECIMAL(15, 2) NOT NULL,
  cost_forecast DECIMAL(15, 2) NOT NULL,
  variance DECIMAL(15, 2) NOT NULL,
  variance_percentage DECIMAL(5, 2) NOT NULL,
  roi_expected DECIMAL(10, 2) DEFAULT 0,
  roi_actual DECIMAL(10, 2) DEFAULT 0,
  period VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_finances_tenant ON finances(tenant_id);
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
