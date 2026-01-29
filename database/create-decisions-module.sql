-- ================================================
-- MODULE DÉCISIONS EXÉCUTIVES (PACK 9)
-- ================================================
-- Exécutez ce SQL dans Supabase SQL Editor

-- ================================================
-- TABLE 1: DECISIONS
-- ================================================
CREATE TABLE IF NOT EXISTS public.decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  
  -- Informations de base
  title TEXT NOT NULL,
  description TEXT,
  owner TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  
  -- Scoring & Priorisation
  impact_score INTEGER NOT NULL DEFAULT 3 CHECK (impact_score BETWEEN 1 AND 5),
  urgency_score INTEGER NOT NULL DEFAULT 3 CHECK (urgency_score BETWEEN 1 AND 5),
  complexity_score INTEGER NOT NULL DEFAULT 3 CHECK (complexity_score BETWEEN 1 AND 5),
  priority_score DECIMAL(3,2) GENERATED ALWAYS AS (
    (impact_score * 0.5) + (urgency_score * 0.3) + (complexity_score * 0.2)
  ) STORED,
  
  -- Timeline
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  
  -- Analyse IA
  ai_analysis JSONB, -- { summary, options, impacts, recommendation, actions }
  ai_analyzed_at TIMESTAMPTZ,
  selected_option TEXT, -- 'A', 'B', 'C' ou null
  
  -- Audit
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ================================================
-- TABLE 2: DECISION_HISTORY
-- ================================================
CREATE TABLE IF NOT EXISTS public.decision_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
  
  -- Changement
  action TEXT NOT NULL, -- 'created', 'updated', 'analyzed', 'option_selected', 'closed'
  field TEXT, -- Champ modifié (null si action globale)
  old_value TEXT,
  new_value TEXT,
  
  -- Context
  comment TEXT,
  ai_metadata JSONB, -- Metadata IA si action = 'analyzed'
  
  -- Audit
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT
);

-- ================================================
-- INDEXES POUR PERFORMANCE
-- ================================================
CREATE INDEX IF NOT EXISTS idx_decisions_org ON public.decisions(organization_id);
CREATE INDEX IF NOT EXISTS idx_decisions_project ON public.decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON public.decisions(status);
CREATE INDEX IF NOT EXISTS idx_decisions_priority ON public.decisions(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_decisions_deadline ON public.decisions(deadline);
CREATE INDEX IF NOT EXISTS idx_decisions_created ON public.decisions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_decision_history_decision ON public.decision_history(decision_id);
CREATE INDEX IF NOT EXISTS idx_decision_history_timestamp ON public.decision_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_decision_history_action ON public.decision_history(action);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_history ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir les décisions de leur organisation
CREATE POLICY "Users can view decisions from their organization"
  ON public.decisions
  FOR SELECT
  USING (
    organization_id IN (
      SELECT user_metadata->>'organization_id'::uuid
      FROM auth.users
      WHERE id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent créer des décisions pour leur organisation
CREATE POLICY "Users can create decisions for their organization"
  ON public.decisions
  FOR INSERT
  WITH CHECK (
    organization_id = (
      SELECT user_metadata->>'organization_id'::uuid
      FROM auth.users
      WHERE id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent modifier les décisions de leur organisation
CREATE POLICY "Users can update decisions from their organization"
  ON public.decisions
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT user_metadata->>'organization_id'::uuid
      FROM auth.users
      WHERE id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent supprimer les décisions de leur organisation
CREATE POLICY "Users can delete decisions from their organization"
  ON public.decisions
  FOR DELETE
  USING (
    organization_id IN (
      SELECT user_metadata->>'organization_id'::uuid
      FROM auth.users
      WHERE id = auth.uid()
    )
  );

-- Policy: History visible par l'organisation
CREATE POLICY "Users can view history from their organization"
  ON public.decision_history
  FOR SELECT
  USING (
    decision_id IN (
      SELECT id FROM public.decisions
      WHERE organization_id IN (
        SELECT user_metadata->>'organization_id'::uuid
        FROM auth.users
        WHERE id = auth.uid()
      )
    )
  );

-- Policy: History créé automatiquement
CREATE POLICY "Users can create history for their decisions"
  ON public.decision_history
  FOR INSERT
  WITH CHECK (
    decision_id IN (
      SELECT id FROM public.decisions
      WHERE organization_id IN (
        SELECT user_metadata->>'organization_id'::uuid
        FROM auth.users
        WHERE id = auth.uid()
      )
    )
  );

-- ================================================
-- TRIGGER: AUTO UPDATE updated_at
-- ================================================
CREATE OR REPLACE FUNCTION update_decisions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decisions_updated_at
  BEFORE UPDATE ON public.decisions
  FOR EACH ROW
  EXECUTE FUNCTION update_decisions_updated_at();

-- ================================================
-- TRIGGER: AUTO HISTORY ON CHANGES
-- ================================================
CREATE OR REPLACE FUNCTION log_decision_change()
RETURNS TRIGGER AS $$
DECLARE
  user_email_val TEXT;
BEGIN
  -- Récupérer l'email de l'utilisateur
  SELECT email INTO user_email_val
  FROM auth.users
  WHERE id = auth.uid();

  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.decision_history (
      decision_id,
      action,
      comment,
      user_id,
      user_email
    ) VALUES (
      NEW.id,
      'created',
      'Décision créée',
      auth.uid(),
      user_email_val
    );
    RETURN NEW;
  
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Log statut change
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
      INSERT INTO public.decision_history (
        decision_id,
        action,
        field,
        old_value,
        new_value,
        user_id,
        user_email
      ) VALUES (
        NEW.id,
        'updated',
        'status',
        OLD.status,
        NEW.status,
        auth.uid(),
        user_email_val
      );
    END IF;
    
    -- Log option selection
    IF (OLD.selected_option IS DISTINCT FROM NEW.selected_option AND NEW.selected_option IS NOT NULL) THEN
      INSERT INTO public.decision_history (
        decision_id,
        action,
        field,
        old_value,
        new_value,
        comment,
        user_id,
        user_email
      ) VALUES (
        NEW.id,
        'option_selected',
        'selected_option',
        OLD.selected_option,
        NEW.selected_option,
        'Option d''arbitrage sélectionnée',
        auth.uid(),
        user_email_val
      );
    END IF;
    
    -- Log AI analysis
    IF (OLD.ai_analysis IS DISTINCT FROM NEW.ai_analysis AND NEW.ai_analysis IS NOT NULL) THEN
      INSERT INTO public.decision_history (
        decision_id,
        action,
        comment,
        ai_metadata,
        user_id,
        user_email
      ) VALUES (
        NEW.id,
        'analyzed',
        'Analyse IA effectuée',
        NEW.ai_analysis,
        auth.uid(),
        user_email_val
      );
    END IF;
    
    -- Log closure
    IF (OLD.status != 'closed' AND NEW.status = 'closed') THEN
      UPDATE public.decisions
      SET closed_at = NOW()
      WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER decisions_auto_history
  AFTER INSERT OR UPDATE ON public.decisions
  FOR EACH ROW
  EXECUTE FUNCTION log_decision_change();

-- ================================================
-- VÉRIFICATION
-- ================================================
SELECT 
  'decisions' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'decisions'
ORDER BY ordinal_position;

SELECT 
  'decision_history' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'decision_history'
ORDER BY ordinal_position;

-- ================================================
-- SUCCESS MESSAGE
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Module Décisions Exécutives créé avec succès';
  RAISE NOTICE '   - Table decisions avec scoring automatique';
  RAISE NOTICE '   - Table decision_history avec triggers';
  RAISE NOTICE '   - RLS activé pour multi-tenant';
  RAISE NOTICE '   - Indexes pour performance';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Scoring automatique:';
  RAISE NOTICE '   priority_score = (impact * 0.5) + (urgency * 0.3) + (complexity * 0.2)';
END $$;
