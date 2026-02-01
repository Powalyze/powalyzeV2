-- ============================================
-- POWALYZE - SCHEMA EXECUTIVE SUMMARY CACHE
-- PACK 13 + 14 - Synthèse Exécutive + IA Chief of Staff
-- ============================================

-- Table cache synthèse exécutive
CREATE TABLE IF NOT EXISTS executive_summary_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    summary JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT executive_summary_cache_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_executive_summary_organization_id ON executive_summary_cache(organization_id);
CREATE INDEX IF NOT EXISTS idx_executive_summary_generated_at ON executive_summary_cache(generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_executive_summary_expires_at ON executive_summary_cache(expires_at);

-- RLS: Activer
ALTER TABLE executive_summary_cache ENABLE ROW LEVEL SECURITY;

-- RLS: Les utilisateurs ne voient que le cache de leur organisation
CREATE POLICY executive_summary_select_policy ON executive_summary_cache
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- RLS: Les utilisateurs peuvent créer cache pour leur organisation
CREATE POLICY executive_summary_insert_policy ON executive_summary_cache
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- RLS: Les utilisateurs peuvent modifier cache de leur organisation
CREATE POLICY executive_summary_update_policy ON executive_summary_cache
    FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- RLS: Les utilisateurs peuvent supprimer cache de leur organisation
CREATE POLICY executive_summary_delete_policy ON executive_summary_cache
    FOR DELETE
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- Fonction pour nettoyer les caches expirés
CREATE OR REPLACE FUNCTION cleanup_expired_executive_summaries()
RETURNS void AS $$
BEGIN
    DELETE FROM executive_summary_cache
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaires
COMMENT ON TABLE executive_summary_cache IS 'Cache synthèse exécutive générée par IA (PACK 13+14)';
COMMENT ON COLUMN executive_summary_cache.summary IS 'JSON: executive_summary, key_indicators, critical_risks, urgent_decisions, trends, weak_signals, recommendations, actions';
COMMENT ON COLUMN executive_summary_cache.expires_at IS 'Expiration cache (24h par défaut)';
