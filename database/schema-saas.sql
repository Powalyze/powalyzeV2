-- ============================================================================
-- POWALYZE - Nouveau Schéma SaaS
-- ============================================================================
-- Structure pour mode Pro avec organisations, domaines et cockpits
-- ============================================================================

-- Supprimer les tables existantes si nécessaire (commenté par sécurité)
-- DROP TABLE IF EXISTS items CASCADE;
-- DROP TABLE IF EXISTS cockpits CASCADE;
-- DROP TABLE IF EXISTS domains CASCADE;
-- DROP TABLE IF EXISTS user_profiles CASCADE;
-- DROP TABLE IF EXISTS organisations CASCADE;

-- ============================================================================
-- ORGANISATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DOMAINS (domaines stratégiques)
-- ============================================================================
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_domains_organisation ON domains(organisation_id);

-- ============================================================================
-- COCKPITS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cockpits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_cockpits_domain ON cockpits(domain_id);

-- ============================================================================
-- ITEMS (risques / décisions / indicateurs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cockpit_id UUID NOT NULL REFERENCES cockpits(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('risk', 'decision', 'kpi')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ok' CHECK (status IN ('ok', 'warning', 'critical')),
  owner TEXT,
  due_date DATE,
  score INT,
  ai_comment TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_items_cockpit ON items(cockpit_id);
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);

-- ============================================================================
-- USER_PROFILES (lien auth.users -> organisation)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_organisation ON user_profiles(organisation_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE cockpits ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Les utilisateurs peuvent voir leur organisation
CREATE POLICY "Users can view own organisation" ON organisations
  FOR SELECT
  USING (
    id IN (
      SELECT organisation_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent voir les domains de leur organisation
CREATE POLICY "Users can view organisation domains" ON domains
  FOR SELECT
  USING (
    organisation_id IN (
      SELECT organisation_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent voir les cockpits de leur organisation
CREATE POLICY "Users can view organisation cockpits" ON cockpits
  FOR SELECT
  USING (
    domain_id IN (
      SELECT d.id FROM domains d
      INNER JOIN user_profiles up ON d.organisation_id = up.organisation_id
      WHERE up.id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent voir les items de leur organisation
CREATE POLICY "Users can view organisation items" ON items
  FOR SELECT
  USING (
    cockpit_id IN (
      SELECT c.id FROM cockpits c
      INNER JOIN domains d ON c.domain_id = d.id
      INNER JOIN user_profiles up ON d.organisation_id = up.organisation_id
      WHERE up.id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent modifier les items de leur organisation
CREATE POLICY "Users can modify organisation items" ON items
  FOR ALL
  USING (
    cockpit_id IN (
      SELECT c.id FROM cockpits c
      INNER JOIN domains d ON c.domain_id = d.id
      INNER JOIN user_profiles up ON d.organisation_id = up.organisation_id
      WHERE up.id = auth.uid()
    )
  );

-- ============================================================================
-- FONCTIONS UTILITAIRES
-- ============================================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_organisations_updated_at
  BEFORE UPDATE ON organisations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domains_updated_at
  BEFORE UPDATE ON domains
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cockpits_updated_at
  BEFORE UPDATE ON cockpits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DONNÉES DE TEST (optionnel)
-- ============================================================================

-- Organisation de test
INSERT INTO organisations (name) VALUES ('Organisation Demo')
ON CONFLICT DO NOTHING;

-- Domain de test
INSERT INTO domains (organisation_id, name, description)
SELECT id, 'Gouvernance & Risques', 'Domaine principal de gouvernance'
FROM organisations WHERE name = 'Organisation Demo'
ON CONFLICT DO NOTHING;

-- Cockpit de test
INSERT INTO cockpits (domain_id, name, description)
SELECT d.id, 'Cockpit Exécutif', 'Vue d''ensemble pour le COMEX'
FROM domains d
INNER JOIN organisations o ON d.organisation_id = o.id
WHERE o.name = 'Organisation Demo'
ON CONFLICT DO NOTHING;
