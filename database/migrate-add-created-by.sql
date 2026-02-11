-- ============================================================================
-- MIGRATION : AJOUTER created_by AUX TABLES EXISTANTES + TRIGGER AUTOMATIONS
-- ============================================================================

-- Ajouter created_by à la table automations si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'automations'
      AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.automations
      ADD COLUMN created_by UUID REFERENCES public.profiles(id);
  END IF;
END $$;

-- Ajouter created_by à la table documents si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'documents'
      AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.documents
      ADD COLUMN created_by UUID REFERENCES public.profiles(id);
  END IF;
END $$;

-- Renommer mime_type en type si nécessaire
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'documents'
      AND column_name = 'mime_type'
  ) THEN
    ALTER TABLE public.documents
      RENAME COLUMN mime_type TO type;
  END IF;
END $$;

-- Activer RLS
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Supprimer anciennes policies
DROP POLICY IF EXISTS "automations_select_own" ON public.automations;
DROP POLICY IF EXISTS "automations_insert_own" ON public.automations;
DROP POLICY IF EXISTS "automations_update_own" ON public.automations;
DROP POLICY IF EXISTS "automations_delete_own" ON public.automations;

DROP POLICY IF EXISTS "documents_select_own" ON public.documents;
DROP POLICY IF EXISTS "documents_insert_own" ON public.documents;
DROP POLICY IF EXISTS "documents_delete_own" ON public.documents;

-- POLICIES AUTOMATIONS
CREATE POLICY "automations_select_own"
ON public.automations
FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "automations_insert_own"
ON public.automations
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "automations_update_own"
ON public.automations
FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "automations_delete_own"
ON public.automations
FOR DELETE
USING (auth.uid() = created_by);

-- POLICIES DOCUMENTS
CREATE POLICY "documents_select_own"
ON public.documents
FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "documents_insert_own"
ON public.documents
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "documents_delete_own"
ON public.documents
FOR DELETE
USING (auth.uid() = created_by);

-- TABLE project_assignments (si pas déjà là)
CREATE TABLE IF NOT EXISTS public.project_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_automations_created_by
  ON public.automations(created_by);

CREATE INDEX IF NOT EXISTS idx_documents_created_by
  ON public.documents(created_by);

CREATE INDEX IF NOT EXISTS idx_project_assignments_project
  ON public.project_assignments(project_id);

CREATE INDEX IF NOT EXISTS idx_project_assignments_user
  ON public.project_assignments(user_id);

-- ============================================================================
-- FONCTION D'AUTOMATION SUR CHANGEMENT DE STATUT PROJET
-- ============================================================================

CREATE OR REPLACE FUNCTION public.apply_project_status_automations()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  a RECORD;
  action_type TEXT;
  action_user UUID;
  action_role TEXT;
BEGIN
  IF old.status IS NULL OR new.status IS NULL OR old.status = new.status THEN
    RETURN new;
  END IF;

  FOR a IN
    SELECT *
    FROM public.automations
    WHERE status = 'active'
      AND trigger->>'type' = 'project_status_changed'
      AND trigger->>'from' = old.status
      AND trigger->>'to' = new.status
  LOOP
    action_type := a.action->>'type';

    IF action_type = 'assign_user' THEN
      action_user := (a.action->>'user_id')::uuid;
      action_role := a.action->>'role';

      IF NOT EXISTS (
        SELECT 1
        FROM public.project_assignments pa
        WHERE pa.project_id = new.id
          AND pa.user_id = action_user
      ) THEN
        INSERT INTO public.project_assignments (project_id, user_id, role)
        VALUES (new.id, action_user, action_role);
      END IF;
    END IF;
  END LOOP;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_apply_project_status_automations ON public.projects;

CREATE TRIGGER trg_apply_project_status_automations
AFTER UPDATE OF status ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.apply_project_status_automations();
