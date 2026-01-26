-- ============================================
-- DUAL-MODE ARCHITECTURE (DEMO + PRO)
-- ============================================
-- Cette migration crée toutes les tables pour supporter
-- les modes DEMO et PRO avec isolation complète des données

-- ============================================
-- 1. AJOUTER COLONNE MODE DANS USERS
-- ============================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS mode VARCHAR(20) DEFAULT 'demo' CHECK (mode IN ('demo', 'pro', 'admin'));

CREATE INDEX IF NOT EXISTS idx_users_mode ON users(mode);

-- ============================================
-- 2. TABLES DEMO (DONNÉES FICTIVES)
-- ============================================

-- Demo Risks
CREATE TABLE IF NOT EXISTS demo_risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  impact INTEGER CHECK (impact BETWEEN 1 AND 5),
  probability INTEGER CHECK (probability BETWEEN 1 AND 5),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'mitigated', 'resolved', 'closed')),
  mitigation TEXT,
  owner VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Demo Decisions
CREATE TABLE IF NOT EXISTS demo_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'late')),
  decision_maker VARCHAR(255),
  decided_at TIMESTAMP,
  deadline TIMESTAMP,
  impact VARCHAR(20) DEFAULT 'medium' CHECK (impact IN ('low', 'medium', 'high')),
  committee VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Demo Anomalies
CREATE TABLE IF NOT EXISTS demo_anomalies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  resolved_at TIMESTAMP,
  assignee VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Demo Reports
CREATE TABLE IF NOT EXISTS demo_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  report_type VARCHAR(50) DEFAULT 'general' CHECK (report_type IN ('general', 'performance', 'budget', 'risks', 'executive', 'monthly', 'quarterly')),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Demo Connectors
CREATE TABLE IF NOT EXISTS demo_connectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  connector_type VARCHAR(50) NOT NULL CHECK (connector_type IN ('jira', 'azure_devops', 'github', 'slack', 'openai', 'notion', 'asana', 'salesforce', 'zendesk', 'servicenow', 'teams', 'other')),
  api_key TEXT,
  secret TEXT,
  api_url TEXT,
  metadata JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'testing')),
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. TABLES PRO (DONNÉES RÉELLES) - DÉJÀ EXISTANTES
-- ============================================
-- Les tables risks, decisions, anomalies, reports, connectors
-- ont déjà été créées dans la migration 001_create_cockpit_tables.sql
-- Elles servent pour le mode PRO

-- ============================================
-- 4. INDEXES DEMO
-- ============================================
CREATE INDEX IF NOT EXISTS idx_demo_risks_user ON demo_risks(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_risks_project ON demo_risks(project_id);
CREATE INDEX IF NOT EXISTS idx_demo_risks_status ON demo_risks(status);

CREATE INDEX IF NOT EXISTS idx_demo_decisions_user ON demo_decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_decisions_project ON demo_decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_demo_decisions_status ON demo_decisions(status);

CREATE INDEX IF NOT EXISTS idx_demo_anomalies_user ON demo_anomalies(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_anomalies_project ON demo_anomalies(project_id);
CREATE INDEX IF NOT EXISTS idx_demo_anomalies_severity ON demo_anomalies(severity);

CREATE INDEX IF NOT EXISTS idx_demo_reports_user ON demo_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_reports_project ON demo_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_demo_reports_type ON demo_reports(report_type);

CREATE INDEX IF NOT EXISTS idx_demo_connectors_user ON demo_connectors(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_connectors_type ON demo_connectors(connector_type);
CREATE INDEX IF NOT EXISTS idx_demo_connectors_status ON demo_connectors(status);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) DEMO
-- ============================================

-- Enable RLS on demo tables
ALTER TABLE demo_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_connectors ENABLE ROW LEVEL SECURITY;

-- Policies for demo_risks
CREATE POLICY demo_risks_select ON demo_risks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY demo_risks_insert ON demo_risks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY demo_risks_update ON demo_risks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY demo_risks_delete ON demo_risks FOR DELETE USING (auth.uid() = user_id);

-- Policies for demo_decisions
CREATE POLICY demo_decisions_select ON demo_decisions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY demo_decisions_insert ON demo_decisions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY demo_decisions_update ON demo_decisions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY demo_decisions_delete ON demo_decisions FOR DELETE USING (auth.uid() = user_id);

-- Policies for demo_anomalies
CREATE POLICY demo_anomalies_select ON demo_anomalies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY demo_anomalies_insert ON demo_anomalies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY demo_anomalies_update ON demo_anomalies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY demo_anomalies_delete ON demo_anomalies FOR DELETE USING (auth.uid() = user_id);

-- Policies for demo_reports
CREATE POLICY demo_reports_select ON demo_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY demo_reports_insert ON demo_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY demo_reports_update ON demo_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY demo_reports_delete ON demo_reports FOR DELETE USING (auth.uid() = user_id);

-- Policies for demo_connectors
CREATE POLICY demo_connectors_select ON demo_connectors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY demo_connectors_insert ON demo_connectors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY demo_connectors_update ON demo_connectors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY demo_connectors_delete ON demo_connectors FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 6. FONCTIONS HELPER
-- ============================================

-- Fonction pour obtenir le mode utilisateur
CREATE OR REPLACE FUNCTION get_user_mode(user_uuid UUID)
RETURNS VARCHAR AS $$
DECLARE
  user_mode VARCHAR;
BEGIN
  SELECT mode INTO user_mode FROM users WHERE id = user_uuid;
  RETURN COALESCE(user_mode, 'demo');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour basculer un utilisateur en mode PRO
CREATE OR REPLACE FUNCTION upgrade_to_pro(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE users SET mode = 'pro' WHERE id = user_uuid;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. DONNÉES DEMO INITIALES
-- ============================================

-- Insérer des risques démo (pour utilisateurs demo)
-- Ces données seront disponibles automatiquement pour les utilisateurs en mode demo
-- via les server actions qui détectent le mode

COMMENT ON TABLE demo_risks IS 'Risks for DEMO mode - isolated from production data';
COMMENT ON TABLE demo_decisions IS 'Decisions for DEMO mode - isolated from production data';
COMMENT ON TABLE demo_anomalies IS 'Anomalies for DEMO mode - isolated from production data';
COMMENT ON TABLE demo_reports IS 'Reports for DEMO mode - isolated from production data';
COMMENT ON TABLE demo_connectors IS 'Connectors for DEMO mode - isolated from production data';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Les tables DEMO et PRO sont maintenant créées
-- Les server actions peuvent utiliser:
-- - demo_* pour mode demo
-- - tables normales pour mode pro
