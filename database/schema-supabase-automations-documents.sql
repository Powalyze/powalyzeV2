/*  
===============================================================================
1) SUPABASE — AUTOMATIONS BRANCHÉES SUR LES EVENTS PROJETS
===============================================================================
*/

-- TABLE AUTOMATIONS
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  trigger JSONB NOT NULL,
  action JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

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


-- TABLE PROJECT_ASSIGNMENTS (si pas déjà créée)
CREATE TABLE IF NOT EXISTS public.project_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  size BIGINT,
  type TEXT,
  storage_path TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

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
-- 1.1) FONCTION : appliquer les automations sur changement de statut projet
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
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  FOR a IN
    SELECT *
    FROM public.automations
    WHERE status = 'active'
      AND trigger->>'type' = 'project_status_changed'
      AND trigger->>'from' = OLD.status
      AND trigger->>'to' = NEW.status
  LOOP
    action_type := a.action->>'type';

    IF action_type = 'assign_user' THEN
      action_user := (a.action->>'user_id')::UUID;
      action_role := a.action->>'role';

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
-- 1.2) TRIGGER SUR PROJECTS
-- ============================================================================

DROP TRIGGER IF EXISTS trg_apply_project_status_automations ON public.projects;

CREATE TRIGGER trg_apply_project_status_automations
AFTER UPDATE OF status ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.apply_project_status_automations();
