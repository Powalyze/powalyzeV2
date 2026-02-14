-- Migration SIMPLIFIÉE: Table integrations pour Supabase Auth par défaut
-- Date: 2026-02-13
-- Cette version fonctionne avec auth.users() sans table organizations

-- IMPORTANT: Supprimer la table si elle existe avec une mauvaise structure
DROP TABLE IF EXISTS integrations CASCADE;

-- Create integrations table (simple version)
CREATE TABLE integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id TEXT NOT NULL,
  integration_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}'::jsonb,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, integration_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_integrations_user ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_enabled ON integrations(enabled) WHERE enabled = true;

-- Add RLS policies
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own integrations
CREATE POLICY "Users can view their own integrations"
  ON integrations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own integrations
CREATE POLICY "Users can insert their own integrations"
  ON integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own integrations
CREATE POLICY "Users can update their own integrations"
  ON integrations FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own integrations
CREATE POLICY "Users can delete their own integrations"
  ON integrations FOR DELETE
  USING (auth.uid() = user_id);

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
COMMENT ON TABLE integrations IS 'Stores integration configurations for external services (Jira, Slack, GitHub, etc.) - Simple version with user_id';
