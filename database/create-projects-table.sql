-- ============================================
-- TABLE: projects (version simplifiée PROD)
-- À exécuter dans Supabase Dashboard → SQL Editor
-- ============================================

-- Assurer que l'extension pgcrypto est activée (pour gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Supprimer la table si elle existe déjà (nettoie les tentatives précédentes)
DROP TABLE IF EXISTS public.projects CASCADE;

-- Table projects simplifiée pour MVP
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  health VARCHAR(20) NOT NULL DEFAULT 'green',
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  owner VARCHAR(255) NOT NULL,
  deadline VARCHAR(50),
  starred BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON public.projects(status);
CREATE INDEX IF NOT EXISTS projects_created_idx ON public.projects(created_at DESC);

-- RLS: DÉSACTIVÉ pour simplifier (réactiver plus tard)
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.handle_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_projects_updated_at();

-- Vérifier
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects';
