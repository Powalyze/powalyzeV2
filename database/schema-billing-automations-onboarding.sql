-- ============================================
-- PACK 18 + 23 + 27 - BILLING, AUTOMATIONS, ONBOARDING
-- Schema SQL complet pour monétisation et workflows
-- Date: 30 Janvier 2026
-- ============================================

-- ============================================
-- PACK 18: BILLING & MONÉTISATION
-- ============================================

-- Table: billing_customers
CREATE TABLE IF NOT EXISTS billing_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_customers_org_id ON billing_customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_billing_customers_stripe_id ON billing_customers(stripe_customer_id);

-- Table: billing_subscriptions
CREATE TABLE IF NOT EXISTS billing_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_org_id ON billing_subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_stripe_sub_id ON billing_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_status ON billing_subscriptions(status);

-- Table: billing_usage
CREATE TABLE IF NOT EXISTS billing_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  limit_value INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_usage_org_id ON billing_usage(organization_id);
CREATE INDEX IF NOT EXISTS idx_billing_usage_metric ON billing_usage(metric);

-- RLS: billing_customers
ALTER TABLE billing_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can read billing_customers"
  ON billing_customers FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- RLS: billing_subscriptions
ALTER TABLE billing_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can read billing_subscriptions"
  ON billing_subscriptions FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- RLS: billing_usage
ALTER TABLE billing_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read billing_usage"
  ON billing_usage FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- PACK 23: AUTOMATIONS & WORKFLOWS
-- ============================================

-- Table: automations
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'risk_created', 'risk_updated', 'decision_created', 
    'decision_deadline_near', 'project_score_critical',
    'timeline_high_activity', 'timeline_no_activity_7d', 'ai_event'
  )),
  action_type TEXT NOT NULL CHECK (action_type IN (
    'send_email', 'create_decision', 'create_risk', 
    'generate_report', 'ai_alert', 'ai_suggestion', 'update_status'
  )),
  conditions JSONB DEFAULT '{}',
  action_config JSONB DEFAULT '{}',
  enabled BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automations_org_id ON automations(organization_id);
CREATE INDEX IF NOT EXISTS idx_automations_trigger ON automations(trigger_type);
CREATE INDEX IF NOT EXISTS idx_automations_enabled ON automations(enabled);

-- Table: automation_logs
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  trigger_data JSONB,
  result TEXT NOT NULL CHECK (result IN ('success', 'failed', 'skipped')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_logs_automation_id ON automation_logs(automation_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_org_id ON automation_logs(organization_id, executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_automation_logs_result ON automation_logs(result);

-- RLS: automations
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read automations"
  ON automations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and owners can manage automations"
  ON automations FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- RLS: automation_logs
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read automation_logs"
  ON automation_logs FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- PACK 27: ONBOARDING
-- ============================================

-- Table: onboarding_progress
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 1,
  completed_steps JSONB DEFAULT '[]',
  checklist JSONB DEFAULT '{}',
  skipped BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_org_id ON onboarding_progress(organization_id);

-- Table: project_templates
CREATE TABLE IF NOT EXISTS project_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('it', 'data', 'transformation', 'product', 'pmo')),
  template_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_templates_category ON project_templates(category);
CREATE INDEX IF NOT EXISTS idx_project_templates_active ON project_templates(is_active);

-- RLS: onboarding_progress
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own onboarding"
  ON onboarding_progress FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS: project_templates (public read)
ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read project_templates"
  ON project_templates FOR SELECT
  USING (is_active = true);

-- ============================================
-- FONCTIONS UTILITAIRES
-- ============================================

-- Fonction: Obtenir le plan de l'organisation
CREATE OR REPLACE FUNCTION get_organization_plan(org_id UUID)
RETURNS TEXT AS $$
  SELECT plan 
  FROM billing_subscriptions 
  WHERE organization_id = org_id 
    AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Fonction: Vérifier limite d'usage
CREATE OR REPLACE FUNCTION check_usage_limit(org_id UUID, metric_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_value INTEGER;
  limit_value INTEGER;
BEGIN
  SELECT value, limit_value 
  INTO current_value, limit_value
  FROM billing_usage 
  WHERE organization_id = org_id AND metric = metric_name;
  
  IF limit_value IS NULL THEN
    RETURN true; -- Pas de limite
  END IF;
  
  RETURN current_value < limit_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Incrémenter usage
CREATE OR REPLACE FUNCTION increment_usage(org_id UUID, metric_name TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO billing_usage (organization_id, metric, value)
  VALUES (org_id, metric_name, 1)
  ON CONFLICT (organization_id, metric) 
  DO UPDATE SET 
    value = billing_usage.value + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Exécuter automations
CREATE OR REPLACE FUNCTION execute_automations(trigger_type_param TEXT, trigger_data_param JSONB)
RETURNS TABLE(automation_id UUID, result TEXT, error_message TEXT) AS $$
DECLARE
  automation_record RECORD;
  execution_result TEXT;
  execution_error TEXT;
BEGIN
  FOR automation_record IN 
    SELECT * FROM automations 
    WHERE trigger_type = trigger_type_param 
      AND enabled = true
  LOOP
    BEGIN
      -- Simuler l'exécution de l'automation
      -- Dans la vraie implémentation, appeler la fonction appropriée selon action_type
      execution_result := 'success';
      execution_error := NULL;
      
      -- Logger le résultat
      INSERT INTO automation_logs (
        automation_id,
        organization_id,
        trigger_data,
        result,
        error_message,
        metadata
      ) VALUES (
        automation_record.id,
        automation_record.organization_id,
        trigger_data_param,
        execution_result,
        execution_error,
        automation_record.action_config
      );
      
      RETURN QUERY SELECT 
        automation_record.id,
        execution_result,
        execution_error;
        
    EXCEPTION WHEN OTHERS THEN
      execution_result := 'failed';
      execution_error := SQLERRM;
      
      INSERT INTO automation_logs (
        automation_id,
        organization_id,
        trigger_data,
        result,
        error_message
      ) VALUES (
        automation_record.id,
        automation_record.organization_id,
        trigger_data_param,
        execution_result,
        execution_error
      );
      
      RETURN QUERY SELECT 
        automation_record.id,
        execution_result,
        execution_error;
    END;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Incrémenter usage lors de création projet
CREATE OR REPLACE FUNCTION increment_project_usage()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM increment_usage(NEW.organization_id, 'projects');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_project_usage
AFTER INSERT ON projects
FOR EACH ROW EXECUTE FUNCTION increment_project_usage();

-- Trigger: Exécuter automations lors de création risque
CREATE OR REPLACE FUNCTION trigger_risk_automations()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM execute_automations(
    'risk_created',
    jsonb_build_object(
      'risk_id', NEW.id,
      'organization_id', NEW.organization_id,
      'severity', NEW.level
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_risk_created_automations
AFTER INSERT ON risks
FOR EACH ROW EXECUTE FUNCTION trigger_risk_automations();

-- ============================================
-- SEED DATA: Project Templates
-- ============================================

INSERT INTO project_templates (name, description, category, template_data) VALUES
('Projet IT Standard', 'Template pour projet informatique classique', 'it', '{
  "risks": [
    {"title": "Risque technique", "level": "medium", "description": "Complexité technique élevée"},
    {"title": "Risque planning", "level": "low", "description": "Délais serrés"}
  ],
  "decisions": [
    {"title": "Choix architecture", "impact": "high", "description": "Sélectionner stack technique"}
  ]
}'),
('Projet Data & Analytics', 'Template pour projet data', 'data', '{
  "risks": [
    {"title": "Qualité des données", "level": "high", "description": "Sources de données multiples"},
    {"title": "Conformité RGPD", "level": "medium", "description": "Données personnelles"}
  ],
  "decisions": [
    {"title": "Outil BI", "impact": "high", "description": "Power BI vs Tableau"}
  ]
}'),
('Transformation Digitale', 'Template pour projet de transformation', 'transformation', '{
  "risks": [
    {"title": "Résistance au changement", "level": "high", "description": "Culture organisationnelle"},
    {"title": "Budget", "level": "medium", "description": "Investissement important"}
  ],
  "decisions": [
    {"title": "Périmètre phase 1", "impact": "high", "description": "Priorisation modules"}
  ]
}'),
('Nouveau Produit', 'Template pour lancement produit', 'product', '{
  "risks": [
    {"title": "Market fit", "level": "high", "description": "Validation marché"},
    {"title": "Concurrence", "level": "medium", "description": "Positionnement"}
  ],
  "decisions": [
    {"title": "MVP scope", "impact": "high", "description": "Fonctionnalités minimum"}
  ]
}'),
('PMO Setup', 'Template pour mise en place PMO', 'pmo', '{
  "risks": [
    {"title": "Adoption méthodologie", "level": "medium", "description": "Formation équipes"},
    {"title": "Outils", "level": "low", "description": "Choix plateforme"}
  ],
  "decisions": [
    {"title": "Méthode", "impact": "high", "description": "Agile vs Waterfall"}
  ]
}')
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA: Billing Usage Limits
-- ============================================

-- Fonction pour initialiser les limites d'usage
CREATE OR REPLACE FUNCTION init_billing_limits(org_id UUID, plan_type TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM billing_usage WHERE organization_id = org_id;
  
  IF plan_type = 'starter' THEN
    INSERT INTO billing_usage (organization_id, metric, value, limit_value) VALUES
      (org_id, 'projects', 0, 1),
      (org_id, 'risks', 0, 10),
      (org_id, 'decisions', 0, 10),
      (org_id, 'ai_calls', 0, 50);
  ELSIF plan_type = 'pro' THEN
    INSERT INTO billing_usage (organization_id, metric, value, limit_value) VALUES
      (org_id, 'projects', 0, NULL),
      (org_id, 'risks', 0, NULL),
      (org_id, 'decisions', 0, NULL),
      (org_id, 'ai_calls', 0, NULL);
  ELSIF plan_type = 'enterprise' THEN
    INSERT INTO billing_usage (organization_id, metric, value, limit_value) VALUES
      (org_id, 'projects', 0, NULL),
      (org_id, 'risks', 0, NULL),
      (org_id, 'decisions', 0, NULL),
      (org_id, 'ai_calls', 0, NULL);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FIN SCHEMA PACK 18 + 23 + 27
-- ============================================
