-- ================================================
-- PACK 10 - MODULE RISQUES EXÉCUTIFS
-- ================================================
-- Création des tables risks + risk_history
-- Scoring automatique: score = severity * probability
-- Triggers pour historique + timestamps
-- RLS policies par organization_id

-- ================================================
-- TABLE PRINCIPALE: risks
-- ================================================

CREATE TABLE IF NOT EXISTS public.risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  
  -- Informations de base
  title TEXT NOT NULL,
  description TEXT,
  
  -- Scoring (1-5)
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5),
  probability INTEGER NOT NULL CHECK (probability >= 1 AND probability <= 5),
  score INTEGER GENERATED ALWAYS AS (severity * probability) STORED,
  
  -- Statut
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'mitigated', 'closed')),
  
  -- Tendance (calculée par IA)
  trend TEXT DEFAULT 'stable' CHECK (trend IN ('rising', 'stable', 'falling')),
  
  -- Analyse IA (Agent AAR)
  ai_analysis JSONB,
  ai_analyzed_at TIMESTAMPTZ,
  
  -- Mitigation
  mitigation_actions TEXT,
  mitigation_date TIMESTAMPTZ,
  mitigated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Métadonnées
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- ================================================
-- TABLE HISTORIQUE: risk_history
-- ================================================

CREATE TABLE IF NOT EXISTS public.risk_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id UUID NOT NULL REFERENCES public.risks(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL,
  
  -- Action effectuée
  action TEXT NOT NULL CHECK (action IN (
    'created',
    'updated',
    'severity_changed',
    'probability_changed',
    'status_changed',
    'trend_changed',
    'ai_analyzed',
    'mitigation_added',
    'mitigated',
    'closed'
  )),
  
  -- Données de l'action
  old_value TEXT,
  new_value TEXT,
  details JSONB,
  
  -- Qui et quand
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- INDEX POUR PERFORMANCE
-- ================================================

-- Index sur organization_id (RLS filtering)
CREATE INDEX IF NOT EXISTS idx_risks_organization ON public.risks(organization_id);
CREATE INDEX IF NOT EXISTS idx_risk_history_organization ON public.risk_history(organization_id);

-- Index sur project_id (filtering par projet)
CREATE INDEX IF NOT EXISTS idx_risks_project ON public.risks(project_id);

-- Index sur status (filtering par statut)
CREATE INDEX IF NOT EXISTS idx_risks_status ON public.risks(status);

-- Index sur score (tri par criticité)
CREATE INDEX IF NOT EXISTS idx_risks_score ON public.risks(score DESC);

-- Index sur severity + probability (heatmap)
CREATE INDEX IF NOT EXISTS idx_risks_severity_probability ON public.risks(severity, probability);

-- Index sur trend (filtering par tendance)
CREATE INDEX IF NOT EXISTS idx_risks_trend ON public.risks(trend);

-- Index sur created_at (tri chronologique)
CREATE INDEX IF NOT EXISTS idx_risks_created_at ON public.risks(created_at DESC);

-- Index historique
CREATE INDEX IF NOT EXISTS idx_risk_history_risk_id ON public.risk_history(risk_id);
CREATE INDEX IF NOT EXISTS idx_risk_history_performed_at ON public.risk_history(performed_at DESC);

-- ================================================
-- TRIGGER: Auto-historique sur création
-- ================================================

CREATE OR REPLACE FUNCTION log_risk_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.risk_history (
    risk_id,
    organization_id,
    action,
    new_value,
    details,
    performed_by
  ) VALUES (
    NEW.id,
    NEW.organization_id,
    'created',
    NEW.title,
    jsonb_build_object(
      'severity', NEW.severity,
      'probability', NEW.probability,
      'score', NEW.score,
      'status', NEW.status
    ),
    NEW.created_by
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_risk_creation ON public.risks;
CREATE TRIGGER trigger_log_risk_creation
  AFTER INSERT ON public.risks
  FOR EACH ROW
  EXECUTE FUNCTION log_risk_creation();

-- ================================================
-- TRIGGER: Auto-historique sur mise à jour
-- ================================================

CREATE OR REPLACE FUNCTION log_risk_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Changement de sévérité
  IF OLD.severity != NEW.severity THEN
    INSERT INTO public.risk_history (risk_id, organization_id, action, old_value, new_value, performed_by)
    VALUES (NEW.id, NEW.organization_id, 'severity_changed', OLD.severity::TEXT, NEW.severity::TEXT, NEW.created_by);
  END IF;
  
  -- Changement de probabilité
  IF OLD.probability != NEW.probability THEN
    INSERT INTO public.risk_history (risk_id, organization_id, action, old_value, new_value, performed_by)
    VALUES (NEW.id, NEW.organization_id, 'probability_changed', OLD.probability::TEXT, NEW.probability::TEXT, NEW.created_by);
  END IF;
  
  -- Changement de statut
  IF OLD.status != NEW.status THEN
    INSERT INTO public.risk_history (risk_id, organization_id, action, old_value, new_value, performed_by)
    VALUES (NEW.id, NEW.organization_id, 'status_changed', OLD.status, NEW.status, NEW.created_by);
  END IF;
  
  -- Changement de tendance
  IF OLD.trend IS DISTINCT FROM NEW.trend THEN
    INSERT INTO public.risk_history (risk_id, organization_id, action, old_value, new_value, performed_by)
    VALUES (NEW.id, NEW.organization_id, 'trend_changed', OLD.trend, NEW.trend, NEW.created_by);
  END IF;
  
  -- Analyse IA effectuée
  IF OLD.ai_analysis IS NULL AND NEW.ai_analysis IS NOT NULL THEN
    INSERT INTO public.risk_history (risk_id, organization_id, action, details, performed_by)
    VALUES (NEW.id, NEW.organization_id, 'ai_analyzed', NEW.ai_analysis, NEW.created_by);
  END IF;
  
  -- Mitigation ajoutée
  IF OLD.mitigation_actions IS NULL AND NEW.mitigation_actions IS NOT NULL THEN
    INSERT INTO public.risk_history (risk_id, organization_id, action, new_value, performed_by)
    VALUES (NEW.id, NEW.organization_id, 'mitigation_added', NEW.mitigation_actions, NEW.mitigated_by);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_risk_update ON public.risks;
CREATE TRIGGER trigger_log_risk_update
  AFTER UPDATE ON public.risks
  FOR EACH ROW
  EXECUTE FUNCTION log_risk_update();

-- ================================================
-- TRIGGER: Auto-update updated_at
-- ================================================

CREATE OR REPLACE FUNCTION update_risks_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_risks_timestamp ON public.risks;
CREATE TRIGGER trigger_update_risks_timestamp
  BEFORE UPDATE ON public.risks
  FOR EACH ROW
  EXECUTE FUNCTION update_risks_timestamp();

-- ================================================
-- TRIGGER: Auto-set closed_at quand status=closed
-- ================================================

CREATE OR REPLACE FUNCTION set_risk_closed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
    NEW.closed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_risk_closed_at ON public.risks;
CREATE TRIGGER trigger_set_risk_closed_at
  BEFORE UPDATE ON public.risks
  FOR EACH ROW
  EXECUTE FUNCTION set_risk_closed_at();

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_history ENABLE ROW LEVEL SECURITY;

-- Policy: Utilisateurs voient uniquement les risques de leur organisation
CREATE POLICY "Users see own organization risks"
  ON public.risks
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.user_roles 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Utilisateurs créent des risques pour leur organisation
CREATE POLICY "Users create risks in own organization"
  ON public.risks
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM public.user_roles 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Utilisateurs modifient les risques de leur organisation
CREATE POLICY "Users update own organization risks"
  ON public.risks
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.user_roles 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Utilisateurs suppriment les risques de leur organisation (admins uniquement)
CREATE POLICY "Admins delete own organization risks"
  ON public.risks
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role_global IN ('super_admin', 'admin')
    )
  );

-- Policy: Historique visible pour l'organisation
CREATE POLICY "Users see own organization risk history"
  ON public.risk_history
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.user_roles 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Insertion historique (trigger)
CREATE POLICY "Allow insert risk history"
  ON public.risk_history
  FOR INSERT
  WITH CHECK (true);

-- ================================================
-- VÉRIFICATION DE LA CRÉATION
-- ================================================

-- Afficher les colonnes de risks
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'risks'
ORDER BY ordinal_position;

-- Afficher les colonnes de risk_history
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'risk_history'
ORDER BY ordinal_position;

-- ================================================
-- FIN PACK 10 - SQL SCHEMA
-- ================================================
