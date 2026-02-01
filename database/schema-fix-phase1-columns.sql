-- ============================================
-- PHASE 1 : AJOUTER LES COLONNES MANQUANTES
-- À exécuter EN PREMIER
-- ============================================

-- 1) CRÉER LES TABLES STRUCTURANTES
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 2) CRÉER LES TABLES MANQUANTES
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  project_id UUID,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  title TEXT NOT NULL,
  content TEXT,
  period TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) AJOUTER organization_id AUX TABLES EXISTANTES
-- Projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_by UUID;

-- Risks
ALTER TABLE public.risks ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE public.risks ADD COLUMN IF NOT EXISTS created_by UUID;

-- Decisions
ALTER TABLE public.decisions ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE public.decisions ADD COLUMN IF NOT EXISTS created_by UUID;

-- 4) CRÉER LES INDEX
CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_risks_org ON public.risks(organization_id);
CREATE INDEX IF NOT EXISTS idx_decisions_org ON public.decisions(organization_id);
CREATE INDEX IF NOT EXISTS idx_timeline_org ON public.timeline_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_reports_org ON public.reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org ON public.memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_id);

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier que les colonnes existent maintenant
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('projects', 'risks', 'decisions', 'timeline_events', 'reports')
  AND column_name = 'organization_id'
ORDER BY table_name;

-- RÉSULTAT ATTENDU:
-- table_name       | column_name     | data_type
-- -----------------+-----------------+-----------
-- decisions        | organization_id | uuid
-- projects         | organization_id | uuid
-- reports          | organization_id | uuid
-- risks            | organization_id | uuid
-- timeline_events  | organization_id | uuid
