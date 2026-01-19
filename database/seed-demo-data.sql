-- ============================================================
-- POWALYZE - SEED DONNÉES DÉMO
-- Exécuter APRÈS create-tables.sql dans Supabase SQL Editor
-- Organization ID: 00000000-0000-0000-0000-000000000000
-- ============================================================


-- INSERT INTO organizations (id, name, domain, created_at)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Organisation Démo Powalyze', 'demo.powalyze.com', CURRENT_TIMESTAMP)
-- ON CONFLICT (id) DO NOTHING;


-- INSERT INTO cockpit_kpis (organization_id, name, value, unit, trend, created_at) VALUES
-- ('00000000-0000-0000-0000-000000000000', 'Budget Total 2026', 2500000, '€', 'up', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'Projets Actifs', 12, '', 'stable', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'Risques Critiques', 3, '', 'down', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'Taux de Réussite', 87, '%', 'up', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'Budget Consommé', 75, '%', 'up', CURRENT_TIMESTAMP)
-- ON CONFLICT DO NOTHING;


-- INSERT INTO projects (organization_id, name, description, status, created_at) VALUES
-- ('00000000-0000-0000-0000-000000000000', 'Migration Cloud Azure', 'Migration infrastructure vers Azure', 'active', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'Refonte SI', 'Modernisation système information', 'active', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'IA Prédictive', 'Implémentation IA forecasting', 'active', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'Formation Équipe', 'Montée en compétences DevOps', 'active', CURRENT_TIMESTAMP)
-- ON CONFLICT DO NOTHING;


-- INSERT INTO risks (organization_id, title, description, category, probability, impact, status, owner, created_at) VALUES
-- ('00000000-0000-0000-0000-000000000000', 'Dépassement Budget Cloud', 'Risque de dépassement coûts cloud +20%', 'STRATEGIC', 65, 75, 'IDENTIFIED', 'AI', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'Compétences Techniques', 'Manque compétences Azure équipe', 'TECHNICAL', 70, 60, 'IDENTIFIED', 'AI', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'Délais Migration', 'Retard potentiel planning', 'ORGANIZATIONAL', 55, 50, 'IDENTIFIED', 'AI', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'Sécurité Données', 'Vulnérabilités migration', 'STRATEGIC', 80, 85, 'IDENTIFIED', 'AI', CURRENT_TIMESTAMP)
-- ON CONFLICT DO NOTHING;


-- INSERT INTO decisions (organization_id, title, description, committee, date, status, impacts, created_at) VALUES
-- ('00000000-0000-0000-0000-000000000000', 'Choix Azure', 'Migration vers Azure plutôt AWS', 'CODIR', CURRENT_DATE - 30, 'approved', 'Impact architecture et formation', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'Budget 2026', 'Validation budget transformation', 'COMEX', CURRENT_DATE - 15, 'approved', 'Augmentation 30% budget IT', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'Recrutement DevOps', 'Embauche 3 profils DevOps', 'CODIR', CURRENT_DATE - 5, 'pending', 'Renforcement équipe technique', CURRENT_TIMESTAMP)
-- ON CONFLICT DO NOTHING;


-- INSERT INTO governance_signals (organization_id, signal_type, severity, message, created_at) VALUES
-- ('00000000-0000-0000-0000-000000000000', 'budget_alert', 'medium', 'Budget à 75% sur projet Migration Cloud', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'risk_alert', 'high', '4 risques critiques nécessitent action', CURRENT_TIMESTAMP),
-- ('00000000-0000-0000-0000-000000000000', 'decision_pending', 'low', '1 décision en attente validation CODIR', CURRENT_TIMESTAMP)
-- ON CONFLICT DO NOTHING;


-- SELECT 
--   'DONNÉES DÉMO INSÉRÉES AVEC SUCCÈS' as message,
--   (SELECT COUNT(*) FROM cockpit_kpis WHERE organization_id = '00000000-0000-0000-0000-000000000000') as kpis,
--   (SELECT COUNT(*) FROM projects WHERE organization_id = '00000000-0000-0000-0000-000000000000') as projects,
--   (SELECT COUNT(*) FROM risks WHERE organization_id = '00000000-0000-0000-0000-000000000000') as risks,
--   (SELECT COUNT(*) FROM decisions WHERE organization_id = '00000000-0000-0000-0000-000000000000') as decisions,
--   (SELECT COUNT(*) FROM governance_signals WHERE organization_id = '00000000-0000-0000-0000-000000000000') as signals;

