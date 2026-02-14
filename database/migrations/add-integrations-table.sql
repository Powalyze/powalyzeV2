-- Migration: Add integrations table for storing integration configurations
-- Date: 2026-02-13

-- Note: Cette migration suppose que vous avez déjà une table organizations
-- Si ce n'est pas le cas, elle créera la référence sans contrainte FK stricte

-- IMPORTANT: Supprimer la table si elle existe déjà avec une mauvaise structure
DROP TABLE IF EXISTS integrations CASCADE;

-- Vérifier si la table organizations existe, sinon la créer
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'organizations') THEN
    CREATE TABLE organizations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      domain VARCHAR(255) UNIQUE,
      settings JSONB DEFAULT '{}',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- Create integrations table
CREATE TABLE integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  integration_id TEXT NOT NULL,
  integration_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}'::jsonb,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, integration_id)
);

-- Add foreign key constraint if organizations table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'organizations') THEN
    ALTER TABLE integrations 
    ADD CONSTRAINT fk_integrations_organization 
    FOREIGN KEY (organization_id) 
    REFERENCES organizations(id) 
    ON DELETE CASCADE;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- La contrainte existe déjà, on ignore
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_integrations_org ON integrations(organization_id);
CREATE INDEX IF NOT EXISTS idx_integrations_enabled ON integrations(enabled) WHERE enabled = true;

-- Add RLS policies
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view integrations for their organization
CREATE POLICY "Users can view their organization integrations"
  ON integrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.organization_id = integrations.organization_id
    )
  );

-- Policy: Users can insert integrations for their organization
CREATE POLICY "Users can insert integrations for their organization"
  ON integrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.organization_id = integrations.organization_id
    )
  );

-- Policy: Users can update integrations for their organization
CREATE POLICY "Users can update their organization integrations"
  ON integrations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.organization_id = integrations.organization_id
    )
  );

-- Policy: Users can delete integrations for their organization
CREATE POLICY "Users can delete their organization integrations"
  ON integrations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.organization_id = integrations.organization_id
    )
  );

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_integrations_updated_at();

-- Add comment
COMMENT ON TABLE integrations IS 'Stores integration configurations for external services (Jira, Slack, GitHub, etc.)';
