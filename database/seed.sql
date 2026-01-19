-- Seed data for Powalyze demo/dev

-- Demo Tenant
INSERT INTO tenants (id, name, domain, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'Acme Corporation', 'acme.com', true);

-- Demo Users
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role, is_active) VALUES
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'ceo@acme.com', '$2a$12$example_hash_comex', 'Jean', 'Dupont', 'COMEX', true),
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'pmo@acme.com', '$2a$12$example_hash_pmo', 'Marie', 'Martin', 'PMO', true),
('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'analyst@acme.com', '$2a$12$example_hash_analyst', 'Pierre', 'Bernard', 'ANALYSTE', true);

-- INSERT INTO projects (id, tenant_id, name, description, sponsor, business_unit, budget, actual_cost, status, rag_status, start_date, end_date, completion_percentage, delay_probability) VALUES
-- ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'Cloud Migration', 'Migration infrastructure vers Azure', 'Jean Dupont', 'IT', 1500000, 950000, 'ACTIVE', 'YELLOW', '2025-01-01', '2025-12-31', 65, 45),
-- ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', 'CRM Implementation', 'Déploiement Salesforce global', 'Marie Martin', 'Sales', 800000, 350000, 'ACTIVE', 'GREEN', '2025-02-01', '2025-10-31', 40, 20),
-- ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', 'Digital Transformation', 'Transformation digitale des processus', 'Jean Dupont', 'Operations', 2500000, 1800000, 'ACTIVE', 'RED', '2024-06-01', '2025-06-30', 75, 85);

-- INSERT INTO risks (tenant_id, project_id, title, description, category, probability, impact, score, status, owner, mitigation_plan) VALUES
-- ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000201', 'Compétences Azure limitées', 'Manque de ressources certifiées Azure', 'TECHNICAL', 75, 75, 18.75, 'IDENTIFIED', 'CTO', 'Formation Azure + recrutement'),
-- ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Résistance au changement', 'Opposition des équipes métier', 'ORGANIZATIONAL', 80, 60, 16.00, 'ASSESSED', 'Change Manager', 'Plan conduite du changement renforcé'),
-- ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Intégration API legacy', 'Complexité intégration SI existant', 'TECHNICAL', 50, 50, 10.00, 'MITIGATED', 'Lead Dev', 'PoC validé, développement en cours');

-- INSERT INTO resources (tenant_id, name, role, department, capacity_hours, allocated_hours, availability_percentage, cost_per_hour, skills) VALUES
-- ('00000000-0000-0000-0000-000000000001', 'Sophie Leroy', 'Architecte Cloud', 'IT', 160, 140, 87, 120.00, '["Azure", "DevOps", "Kubernetes"]'),
-- ('00000000-0000-0000-0000-000000000001', 'Thomas Petit', 'PMO Senior', 'PMO', 160, 120, 75, 95.00, '["Project Management", "Agile", "Risk Management"]'),
-- ('00000000-0000-0000-0000-000000000001', 'Laura Dubois', 'Data Analyst', 'IT', 160, 80, 50, 85.00, '["Power BI", "SQL", "Python"]');

-- INSERT INTO finances (tenant_id, project_id, budget_total, cost_actual, cost_forecast, variance, variance_percentage, roi_expected, roi_actual, period) VALUES
-- ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000201', 1500000, 950000, 1600000, 100000, 6.67, 25.0, 15.0, '2025-Q1'),
-- ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 800000, 350000, 780000, -20000, -2.50, 35.0, 0.0, '2025-Q1'),
-- ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 2500000, 1800000, 2800000, 300000, 12.00, 20.0, 10.0, '2025-Q1');
