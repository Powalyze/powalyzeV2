-- ============================================
-- POWALYZE - SCHEMA TIMELINE EVENTS
-- PACK 12 - Timeline Exécutive
-- ============================================

-- Table des événements timeline
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'project_created',
        'project_updated',
        'risk_created',
        'risk_updated',
        'decision_created',
        'decision_updated',
        'report_generated',
        'ia_action',
        'milestone_reached',
        'alert_triggered'
    )),
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Index pour performance
    CONSTRAINT timeline_events_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_timeline_events_organization_id ON timeline_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_project_id ON timeline_events(project_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_type ON timeline_events(type);
CREATE INDEX IF NOT EXISTS idx_timeline_events_created_at ON timeline_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_events_metadata ON timeline_events USING GIN (metadata);

-- RLS: Activer
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- RLS: Les utilisateurs ne voient que les événements de leur organisation
CREATE POLICY timeline_events_select_policy ON timeline_events
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- RLS: Les utilisateurs peuvent créer des événements pour leur organisation
CREATE POLICY timeline_events_insert_policy ON timeline_events
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- RLS: Les utilisateurs peuvent modifier les événements de leur organisation
CREATE POLICY timeline_events_update_policy ON timeline_events
    FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- RLS: Les utilisateurs peuvent supprimer les événements de leur organisation
CREATE POLICY timeline_events_delete_policy ON timeline_events
    FOR DELETE
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- Fonction trigger pour créer automatiquement des événements timeline
CREATE OR REPLACE FUNCTION create_timeline_event_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Événement création projet
    IF TG_TABLE_NAME = 'projects' AND TG_OP = 'INSERT' THEN
        INSERT INTO timeline_events (organization_id, project_id, type, title, description, metadata, created_by)
        VALUES (
            NEW.organization_id,
            NEW.id,
            'project_created',
            'Nouveau projet créé',
            'Le projet "' || NEW.name || '" a été créé',
            jsonb_build_object('project_name', NEW.name, 'status', NEW.status),
            auth.uid()
        );
    END IF;

    -- Événement mise à jour projet (status)
    IF TG_TABLE_NAME = 'projects' AND TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO timeline_events (organization_id, project_id, type, title, description, metadata, created_by)
        VALUES (
            NEW.organization_id,
            NEW.id,
            'project_updated',
            'Statut projet modifié',
            'Le projet "' || NEW.name || '" a changé de statut',
            jsonb_build_object('project_name', NEW.name, 'old_status', OLD.status, 'new_status', NEW.status),
            auth.uid()
        );
    END IF;

    -- Événement création risque
    IF TG_TABLE_NAME = 'risks' AND TG_OP = 'INSERT' THEN
        INSERT INTO timeline_events (organization_id, project_id, type, title, description, metadata, created_by)
        VALUES (
            NEW.organization_id,
            NEW.project_id,
            'risk_created',
            'Nouveau risque identifié',
            'Risque: ' || NEW.title,
            jsonb_build_object('risk_title', NEW.title, 'level', NEW.level, 'probability', NEW.probability, 'impact', NEW.impact),
            auth.uid()
        );
    END IF;

    -- Événement mise à jour risque
    IF TG_TABLE_NAME = 'risks' AND TG_OP = 'UPDATE' AND OLD.level IS DISTINCT FROM NEW.level THEN
        INSERT INTO timeline_events (organization_id, project_id, type, title, description, metadata, created_by)
        VALUES (
            NEW.organization_id,
            NEW.project_id,
            'risk_updated',
            'Risque mis à jour',
            'Le risque "' || NEW.title || '" a été modifié',
            jsonb_build_object('risk_title', NEW.title, 'old_level', OLD.level, 'new_level', NEW.level),
            auth.uid()
        );
    END IF;

    -- Événement création décision
    IF TG_TABLE_NAME = 'decisions' AND TG_OP = 'INSERT' THEN
        INSERT INTO timeline_events (organization_id, project_id, type, title, description, metadata, created_by)
        VALUES (
            NEW.organization_id,
            NEW.project_id,
            'decision_created',
            'Nouvelle décision',
            'Décision: ' || NEW.title,
            jsonb_build_object('decision_title', NEW.title, 'impact', NEW.impact, 'status', NEW.status),
            auth.uid()
        );
    END IF;

    -- Événement mise à jour décision
    IF TG_TABLE_NAME = 'decisions' AND TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO timeline_events (organization_id, project_id, type, title, description, metadata, created_by)
        VALUES (
            NEW.organization_id,
            NEW.project_id,
            'decision_updated',
            'Décision mise à jour',
            'La décision "' || NEW.title || '" a été ' || NEW.status,
            jsonb_build_object('decision_title', NEW.title, 'old_status', OLD.status, 'new_status', NEW.status),
            auth.uid()
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers pour génération automatique d'événements
DROP TRIGGER IF EXISTS timeline_project_created ON projects;
CREATE TRIGGER timeline_project_created
    AFTER INSERT ON projects
    FOR EACH ROW EXECUTE FUNCTION create_timeline_event_trigger();

DROP TRIGGER IF EXISTS timeline_project_updated ON projects;
CREATE TRIGGER timeline_project_updated
    AFTER UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION create_timeline_event_trigger();

DROP TRIGGER IF EXISTS timeline_risk_created ON risks;
CREATE TRIGGER timeline_risk_created
    AFTER INSERT ON risks
    FOR EACH ROW EXECUTE FUNCTION create_timeline_event_trigger();

DROP TRIGGER IF EXISTS timeline_risk_updated ON risks;
CREATE TRIGGER timeline_risk_updated
    AFTER UPDATE ON risks
    FOR EACH ROW EXECUTE FUNCTION create_timeline_event_trigger();

DROP TRIGGER IF EXISTS timeline_decision_created ON decisions;
CREATE TRIGGER timeline_decision_created
    AFTER INSERT ON decisions
    FOR EACH ROW EXECUTE FUNCTION create_timeline_event_trigger();

DROP TRIGGER IF EXISTS timeline_decision_updated ON decisions;
CREATE TRIGGER timeline_decision_updated
    AFTER UPDATE ON decisions
    FOR EACH ROW EXECUTE FUNCTION create_timeline_event_trigger();

-- Commentaires
COMMENT ON TABLE timeline_events IS 'Événements de la timeline exécutive (PACK 12)';
COMMENT ON COLUMN timeline_events.type IS 'Type événement: project_created, risk_created, decision_created, etc.';
COMMENT ON COLUMN timeline_events.metadata IS 'Données contextuelles JSON pour chaque événement';
