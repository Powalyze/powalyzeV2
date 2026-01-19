-- ============================================================
-- POWALYZE - RECRÉATION COMPLÈTE DES TABLES
-- Exécuter ce script dans Supabase SQL Editor
-- ATTENTION : Supprime toutes les données existantes
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SUPPRESSION DES TABLES EXISTANTES
-- ============================================
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS governance_signals CASCADE;
DROP TABLE IF EXISTS scenarios CASCADE;
DROP TABLE IF EXISTS executive_stories CASCADE;
DROP TABLE IF EXISTS ai_narratives CASCADE;
DROP TABLE IF EXISTS committee_sessions CASCADE;
DROP TABLE IF EXISTS executive_decisions CASCADE;
DROP TABLE IF EXISTS kpis CASCADE;
DROP TABLE IF EXISTS cockpit_kpis CASCADE;
DROP TABLE IF EXISTS organization_memberships CASCADE;
DROP TABLE IF EXISTS integrations CASCADE;
DROP TABLE IF EXISTS decisions CASCADE;
DROP TABLE IF EXISTS risks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- ============================================
-- TABLE: organizations
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: projects
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_organization ON projects(organization_id);

-- ============================================
-- TABLE: risks
-- ============================================
CREATE TABLE risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  project_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  probability INT NOT NULL CHECK (probability >= 0 AND probability <= 100),
  impact INT NOT NULL CHECK (impact >= 0 AND impact <= 100),
  status VARCHAR(50) DEFAULT 'IDENTIFIED',
  owner VARCHAR(255) DEFAULT 'AI',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risks_organization ON risks(organization_id);
CREATE INDEX idx_risks_project ON risks(project_id);

-- ============================================
-- TABLE: decisions
-- ============================================
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  project_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  committee VARCHAR(255),
  date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  impacts TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_decisions_organization ON decisions(organization_id);

-- ============================================
-- TABLE: cockpit_kpis
-- ============================================
CREATE TABLE cockpit_kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  value DECIMAL(15, 2),
  unit VARCHAR(50),
  trend VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cockpit_kpis_organization ON cockpit_kpis(organization_id);

-- ============================================
-- TABLE: integrations
-- ============================================
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integrations_organization ON integrations(organization_id);

-- ============================================
-- TABLE: organization_memberships
-- ============================================
CREATE TABLE organization_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(100) DEFAULT 'member',
  status VARCHAR(50) DEFAULT 'invited',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memberships_organization ON organization_memberships(organization_id);

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  role VARCHAR(100) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_organization ON users(organization_id);

-- ============================================
-- TABLE: activity_log
-- ============================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_organization ON activity_log(organization_id);

-- ============================================
-- TABLE: governance_signals
-- ============================================
CREATE TABLE governance_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  signal_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_governance_organization ON governance_signals(organization_id);

-- ============================================
-- TABLE: scenarios
-- ============================================
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parameters JSONB DEFAULT '{}',
  results JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scenarios_organization ON scenarios(organization_id);

-- ============================================
-- TABLE: executive_stories
-- ============================================
CREATE TABLE executive_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stories_organization ON executive_stories(organization_id);

-- ============================================
-- TABLE: ai_narratives
-- ============================================
CREATE TABLE ai_narratives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  narrative_type VARCHAR(100) NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_narratives_organization ON ai_narratives(organization_id);

-- ============================================
-- TABLE: committee_sessions
-- ============================================
CREATE TABLE committee_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  date DATE,
  attendees JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_organization ON committee_sessions(organization_id);

-- ============================================
-- TABLE: executive_decisions
-- ============================================
CREATE TABLE executive_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exec_decisions_organization ON executive_decisions(organization_id);

-- ============================================
-- TABLE: kpis
-- ============================================
CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  value DECIMAL(15, 2),
  unit VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kpis_organization ON kpis(organization_id);

-- ============================================
-- DÉSACTIVER ROW LEVEL SECURITY (RLS)
-- Pour permettre l'accès avec anon key
-- ============================================
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE risks DISABLE ROW LEVEL SECURITY;
ALTER TABLE decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit_kpis DISABLE ROW LEVEL SECURITY;
ALTER TABLE integrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE governance_signals DISABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE executive_stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_narratives DISABLE ROW LEVEL SECURITY;
ALTER TABLE committee_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE executive_decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE kpis DISABLE ROW LEVEL SECURITY;

-- ============================================
-- CONFIRMATION
-- ============================================
SELECT 'TOUTES LES TABLES ONT ÉTÉ CRÉÉES AVEC SUCCÈS' as message;
