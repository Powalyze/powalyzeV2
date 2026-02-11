-- ============================================================================
-- FIX SCHEMA – AUTOMATIONS & DOCUMENTS
-- Drop et recréation complète pour corriger les colonnes manquantes
-- ============================================================================

-- Désactiver temporairement RLS pour éviter les erreurs
ALTER TABLE IF EXISTS public.automations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.documents DISABLE ROW LEVEL SECURITY;

-- Supprimer les policies existantes
DROP POLICY IF EXISTS "automations_select_own" ON public.automations;
DROP POLICY IF EXISTS "automations_insert_own" ON public.automations;
DROP POLICY IF EXISTS "automations_update_own" ON public.automations;
DROP POLICY IF EXISTS "automations_delete_own" ON public.automations;

DROP POLICY IF EXISTS "documents_select_own" ON public.documents;
DROP POLICY IF EXISTS "documents_insert_own" ON public.documents;
DROP POLICY IF EXISTS "documents_delete_own" ON public.documents;

-- Supprimer les triggers existants
DROP TRIGGER IF EXISTS trg_apply_project_status_automations ON public.projects;
DROP FUNCTION IF EXISTS public.apply_project_status_automations();

-- Supprimer les tables (CASCADE pour supprimer les dépendances)
DROP TABLE IF EXISTS public.automations CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.project_assignments CASCADE;

-- ============================================================================
-- RECRÉATION DES TABLES
-- ============================================================================

-- TABLE PROFILES (si pas déjà présente)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE PROJECTS (si pas déjà présente)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  owner_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE PROJECT_ASSIGNMENTS
CREATE TABLE public.project_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE AUTOMATIONS
CREATE TABLE public.automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  trigger JSONB NOT NULL,
  action JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE DOCUMENTS
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  size BIGINT,
  type TEXT,
  storage_path TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Activer RLS
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- POLICIES AUTOMATIONS
CREATE POLICY "automations_select_own"
ON public.automations FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "automations_insert_own"
ON public.automations FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "automations_update_own"
ON public.automations FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "automations_delete_own"
ON public.automations FOR DELETE
USING (auth.uid() = created_by);

-- POLICIES DOCUMENTS
CREATE POLICY "documents_select_own"
ON public.documents FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "documents_insert_own"
ON public.documents FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "documents_delete_own"
ON public.documents FOR DELETE
USING (auth.uid() = created_by);

-- ============================================================================
-- FONCTION : APPLIQUER LES AUTOMATIONS SUR CHANGEMENT DE STATUT PROJET
-- ============================================================================

CREATE OR REPLACE FUNCTION public.apply_project_status_automations()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  a RECORD;
  action_type TEXT;
  action_user UUID;
  action_role TEXT;
BEGIN
  -- Ne rien faire si le statut n'a pas changé
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Parcourir toutes les automations actives qui correspondent
  FOR a IN
    SELECT *
    FROM public.automations
    WHERE status = 'active'
      AND trigger->>'type' = 'project_status_changed'
      AND trigger->>'from' = OLD.status
      AND trigger->>'to' = NEW.status
  LOOP
    action_type := a.action->>'type';

    -- Action : assigner un utilisateur au projet
    IF action_type = 'assign_user' THEN
      action_user := (a.action->>'user_id')::UUID;
      action_role := a.action->>'role';

      -- Vérifier que l'utilisateur n'est pas déjà assigné
      IF NOT EXISTS (
        SELECT 1 FROM public.project_assignments
        WHERE project_id = NEW.id
          AND user_id = action_user
      ) THEN
        INSERT INTO public.project_assignments (project_id, user_id, role)
        VALUES (NEW.id, action_user, action_role);
      END IF;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

-- ============================================================================
-- TRIGGER SUR PROJECTS
-- ============================================================================

CREATE TRIGGER trg_apply_project_status_automations
AFTER UPDATE OF status ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.apply_project_status_automations();

-- ============================================================================
-- INDEX POUR PERFORMANCES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_automations_created_by ON public.automations(created_by);
CREATE INDEX IF NOT EXISTS idx_automations_status ON public.automations(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON public.documents(created_by);
CREATE INDEX IF NOT EXISTS idx_project_assignments_project ON public.project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_user ON public.project_assignments(user_id);
