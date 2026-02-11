-- ============================================================================
-- CRÉATION DES TABLES AUTOMATIONS ET DOCUMENTS (si elles n'existent pas)
-- À exécuter AVANT migrate-add-created-by.sql
-- ============================================================================

-- Extension UUID (si pas déjà activée)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table automations
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  trigger JSONB NOT NULL DEFAULT '{}',
  action JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table documents
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type TEXT,  -- sera renommé en 'type' par la migration
  version INTEGER DEFAULT 1,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index basiques
CREATE INDEX IF NOT EXISTS idx_automations_status ON public.automations(status);
CREATE INDEX IF NOT EXISTS idx_documents_name ON public.documents(name);

-- Fonction de mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_automations_updated_at ON public.automations;
CREATE TRIGGER update_automations_updated_at
  BEFORE UPDATE ON public.automations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Commentaires
COMMENT ON TABLE public.automations IS 'Règles d''automatisation déclenchées par changements de statut projet';
COMMENT ON TABLE public.documents IS 'Documents uploadés et stockés dans Supabase Storage';
