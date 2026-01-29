-- ================================================
-- POWALYZE - SCHÉMA SUPABASE FINAL (PACK 3)
-- ================================================
-- Ce schéma définit la structure complète pour le mode LIVE
-- Exécutez ce SQL dans Supabase SQL Editor

-- ================================================
-- 1. ORGANIZATIONS
-- ================================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_organizations_is_demo ON public.organizations(is_demo);

-- ================================================
-- 2. USERS (Extension de auth.users)
-- ================================================
-- Note: Les users sont gérés par Supabase Auth (auth.users)
-- On crée une table de métadonnées supplémentaires
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 3. MEMBERSHIPS (Lien users ↔ organizations)
-- ================================================
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org ON public.memberships(organization_id);

-- ================================================
-- 4. PROJECTS
-- ================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'completed', 'blocked')),
  budget INTEGER,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);

-- ================================================
-- 5. RISKS
-- ================================================
CREATE TABLE IF NOT EXISTS public.risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity INTEGER DEFAULT 1 CHECK (severity >= 1 AND severity <= 5),
  probability INTEGER DEFAULT 1 CHECK (probability >= 1 AND probability <= 5),
  impact INTEGER DEFAULT 1 CHECK (impact >= 1 AND impact <= 5),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'mitigated', 'closed', 'accepted')),
  owner TEXT,
  mitigation_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_risks_project ON public.risks(project_id);
CREATE INDEX IF NOT EXISTS idx_risks_status ON public.risks(status);
CREATE INDEX IF NOT EXISTS idx_risks_severity ON public.risks(severity);

-- ================================================
-- 6. DECISIONS
-- ================================================
CREATE TABLE IF NOT EXISTS public.decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  rationale TEXT,
  owner TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')),
  decision_date DATE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_decisions_project ON public.decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON public.decisions(status);
CREATE INDEX IF NOT EXISTS idx_decisions_created_by ON public.decisions(created_by);

-- ================================================
-- 7. INVITATIONS (réutilisation du schéma existant)
-- ================================================
-- Voir create-invitations-simple.sql
-- Déjà créé dans le PACK précédent

-- ================================================
-- 8. TRIGGERS - Updated_at automatique
-- ================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables
DROP TRIGGER IF EXISTS set_updated_at ON public.organizations;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.user_profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.memberships;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.projects;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.risks;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.risks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.decisions;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.decisions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ================================================
-- FIN SCHEMA
-- ================================================
-- Tables créées:
-- - organizations
-- - user_profiles
-- - memberships
-- - projects
-- - risks
-- - decisions
--
-- Prochaine étape: Appliquer les règles RLS
-- Voir: database/pack3-rls-policies.sql
