-- ============================================================================
-- MIGRATION 004: SYSTÈME MULTI-USER PRO (PRO-OWNER + PRO-MEMBER)
-- ============================================================================
-- Description: Ajout rôles pro-owner/pro-member + table organizations_members
-- Date: 2026-01-27
-- Author: Powalyze DevOps
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ÉTENDRE ENUM ROLES
-- ============================================================================

-- Modifier constraint role pour inclure pro-owner et pro-member
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('demo', 'pro', 'pro-owner', 'pro-member', 'admin'));

-- ============================================================================
-- 2. CRÉER TABLE ORGANIZATIONS_MEMBERS
-- ============================================================================

-- Table pour lier employés (pro-member) à une organisation (pro-owner)
CREATE TABLE IF NOT EXISTS organizations_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'pro-member' CHECK (role IN ('pro-owner', 'pro-member')),
  permissions JSONB DEFAULT '{"read": true, "write": false, "delete": false}'::jsonb,
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

CREATE INDEX idx_organizations_members_org ON organizations_members(organization_id);
CREATE INDEX idx_organizations_members_user ON organizations_members(user_id);
CREATE INDEX idx_organizations_members_status ON organizations_members(status);

-- ============================================================================
-- 3. CRÉER TABLE SUBSCRIPTIONS (STRIPE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'inactive')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================================================
-- 4. ROW LEVEL SECURITY - ORGANIZATIONS_MEMBERS
-- ============================================================================

ALTER TABLE organizations_members ENABLE ROW LEVEL SECURITY;

-- Pro-owner peut voir tous les membres de son organisation
DROP POLICY IF EXISTS "Pro owners can view own org members" ON organizations_members;
CREATE POLICY "Pro owners can view own org members"
  ON organizations_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN organizations o ON o.id = organizations_members.organization_id
      WHERE p.id = auth.uid() 
        AND p.role IN ('pro-owner', 'admin')
        AND (o.owner_id = auth.uid() OR p.role = 'admin')
    )
  );

-- Pro-owner peut inviter/gérer membres
DROP POLICY IF EXISTS "Pro owners can manage org members" ON organizations_members;
CREATE POLICY "Pro owners can manage org members"
  ON organizations_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN organizations o ON o.id = organizations_members.organization_id
      WHERE p.id = auth.uid() 
        AND p.role IN ('pro-owner', 'admin')
        AND (o.owner_id = auth.uid() OR p.role = 'admin')
    )
  );

-- Pro-member peut voir son propre record
DROP POLICY IF EXISTS "Pro members can view own membership" ON organizations_members;
CREATE POLICY "Pro members can view own membership"
  ON organizations_members FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- 5. ROW LEVEL SECURITY - SUBSCRIPTIONS
-- ============================================================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Pro-owner et members peuvent voir subscription de leur org
DROP POLICY IF EXISTS "Org members can view subscription" ON subscriptions;
CREATE POLICY "Org members can view subscription"
  ON subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organizations_members om
      WHERE om.organization_id = subscriptions.organization_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Seul pro-owner peut modifier subscription
DROP POLICY IF EXISTS "Pro owners can manage subscription" ON subscriptions;
CREATE POLICY "Pro owners can manage subscription"
  ON subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN organizations o ON o.id = subscriptions.organization_id
      WHERE p.id = auth.uid() 
        AND p.role IN ('pro-owner', 'admin')
        AND (o.owner_id = auth.uid() OR p.role = 'admin')
    )
  );

-- ============================================================================
-- 6. FONCTIONS HELPER
-- ============================================================================

-- Fonction: Récupérer l'organization_id d'un user
CREATE OR REPLACE FUNCTION get_user_organization(user_uuid UUID)
RETURNS UUID AS $$
  SELECT organization_id 
  FROM organizations_members 
  WHERE user_id = user_uuid 
    AND status = 'active'
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Fonction: Vérifier si user est pro-owner
CREATE OR REPLACE FUNCTION is_pro_owner(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_uuid AND role = 'pro-owner'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Fonction: Vérifier si user a permission
CREATE OR REPLACE FUNCTION has_permission(
  user_uuid UUID, 
  permission_name TEXT
)
RETURNS BOOLEAN AS $$
  SELECT 
    CASE 
      WHEN role = 'pro-owner' THEN true
      WHEN role = 'pro-member' THEN 
        (permissions->permission_name)::boolean = true
      ELSE false
    END
  FROM organizations_members
  WHERE user_id = user_uuid AND status = 'active'
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- 7. TRIGGER: AUTO-UPDATE updated_at
-- ============================================================================

DROP TRIGGER IF EXISTS update_organizations_members_updated_at ON organizations_members;
CREATE TRIGGER update_organizations_members_updated_at
  BEFORE UPDATE ON organizations_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. MIGRATION DES DONNÉES EXISTANTES
-- ============================================================================

-- Migrer les users 'pro' existants vers 'pro-owner'
UPDATE profiles 
SET role = 'pro-owner' 
WHERE role = 'pro';

-- Créer organizations_members pour les pro-owner existants
INSERT INTO organizations_members (organization_id, user_id, role, permissions, status)
SELECT 
  o.id,
  o.owner_id,
  'pro-owner',
  '{"read": true, "write": true, "delete": true}'::jsonb,
  'active'
FROM organizations o
WHERE o.owner_id IS NOT NULL
ON CONFLICT (organization_id, user_id) DO NOTHING;

-- Créer subscriptions vides pour organisations existantes
INSERT INTO subscriptions (organization_id, plan, status)
SELECT 
  id,
  'free',
  'inactive'
FROM organizations
ON CONFLICT (organization_id) DO NOTHING;

COMMIT;

-- ============================================================================
-- MIGRATION TERMINÉE
-- ============================================================================
-- Résumé:
-- ✅ Rôles étendus (demo, pro-owner, pro-member, admin)
-- ✅ Table organizations_members créée
-- ✅ Table subscriptions (Stripe) créée
-- ✅ RLS activé sur organizations_members et subscriptions
-- ✅ Fonctions helper (get_user_organization, is_pro_owner, has_permission)
-- ✅ Triggers updated_at automatiques
-- ✅ Migration données existantes (pro → pro-owner)
-- ============================================================================
