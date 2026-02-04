-- ============================================
-- MIGRATION STABILISATION COCKPIT
-- ============================================
-- Date: 2026-02-04
-- Objectif: Ajouter TOUTES les colonnes manquantes
--           pour stabiliser le cockpit executive
-- ============================================

-- ============================================
-- PARTIE 1: PROJECTS - Colonnes manquantes
-- ============================================

-- Colonne owner (déjà dans schema mais on s'assure)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner TEXT;

-- Colonne user_id (pour filtrage par utilisateur)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id UUID;

-- Colonnes métier
ALTER TABLE projects ADD COLUMN IF NOT EXISTS bu TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Colonnes capacité
ALTER TABLE projects ADD COLUMN IF NOT EXISTS capacity_needed NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS capacity_allocated NUMERIC;

-- Colonnes budget
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_planned NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_spent NUMERIC;

-- Colonne alignement stratégique
ALTER TABLE projects ADD COLUMN IF NOT EXISTS strategic_alignment_score NUMERIC(5,2);

-- Colonnes connecteurs externes
ALTER TABLE projects ADD COLUMN IF NOT EXISTS external_id TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS external_source TEXT;

-- ============================================
-- PARTIE 2: COCKPIT_DECISIONS - Colonnes manquantes
-- ============================================

-- Colonne project_id (déjà dans schema mais on s'assure)
ALTER TABLE cockpit_decisions ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- Colonnes impact et urgence
ALTER TABLE cockpit_decisions ADD COLUMN IF NOT EXISTS impact TEXT;
ALTER TABLE cockpit_decisions ADD COLUMN IF NOT EXISTS urgency TEXT;

-- Colonne responsible (alias de owner)
ALTER TABLE cockpit_decisions ADD COLUMN IF NOT EXISTS responsible TEXT;

-- Colonnes audit
ALTER TABLE cockpit_decisions ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE cockpit_decisions ADD COLUMN IF NOT EXISTS updated_by UUID;

-- ============================================
-- PARTIE 3: BUDGETS - Colonnes manquantes
-- ============================================

-- Table cockpit_budgets existe déjà avec variance
-- On s'assure que variance_reason existe
ALTER TABLE cockpit_budgets ADD COLUMN IF NOT EXISTS variance_reason TEXT;

-- ============================================
-- PARTIE 4: TIMELINE - Colonnes manquantes
-- ============================================

-- Table cockpit_timeline existe déjà
-- On s'assure que entity_type et entity_id existent
ALTER TABLE cockpit_timeline ADD COLUMN IF NOT EXISTS entity_type TEXT;
ALTER TABLE cockpit_timeline ADD COLUMN IF NOT EXISTS entity_id UUID;

-- ============================================
-- PARTIE 5: INDEX ADDITIONNELS
-- ============================================

-- Index sur user_id pour performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_bu ON projects(bu);
CREATE INDEX IF NOT EXISTS idx_projects_country ON projects(country);

-- Index sur cockpit_decisions
CREATE INDEX IF NOT EXISTS idx_cockpit_decisions_project_id ON cockpit_decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_decisions_impact ON cockpit_decisions(impact);
CREATE INDEX IF NOT EXISTS idx_cockpit_decisions_urgency ON cockpit_decisions(urgency);
CREATE INDEX IF NOT EXISTS idx_cockpit_decisions_created_by ON cockpit_decisions(created_by);

-- Index sur cockpit_timeline
CREATE INDEX IF NOT EXISTS idx_cockpit_timeline_entity ON cockpit_timeline(entity_type, entity_id);

-- ============================================
-- PARTIE 6: CONTRAINTES ET VALEURS PAR DÉFAUT
-- ============================================

-- Ajouter contraintes sur impact et urgency si besoin
ALTER TABLE cockpit_decisions 
  DROP CONSTRAINT IF EXISTS cockpit_decisions_impact_check;
  
ALTER TABLE cockpit_decisions 
  ADD CONSTRAINT cockpit_decisions_impact_check 
  CHECK (impact IS NULL OR impact IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE cockpit_decisions 
  DROP CONSTRAINT IF EXISTS cockpit_decisions_urgency_check;
  
ALTER TABLE cockpit_decisions 
  ADD CONSTRAINT cockpit_decisions_urgency_check 
  CHECK (urgency IS NULL OR urgency IN ('low', 'medium', 'high', 'critical'));

-- ============================================
-- PARTIE 7: DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- Mettre à jour les projets existants avec des valeurs par défaut
UPDATE projects 
SET 
  owner = COALESCE(owner, 'Admin'),
  bu = COALESCE(bu, 'IT'),
  country = COALESCE(country, 'France'),
  capacity_needed = COALESCE(capacity_needed, 10),
  capacity_allocated = COALESCE(capacity_allocated, 8),
  budget_planned = COALESCE(budget_planned, 100000),
  budget_spent = COALESCE(budget_spent, 75000),
  strategic_alignment_score = COALESCE(strategic_alignment_score, 75.0)
WHERE owner IS NULL OR bu IS NULL;

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================

-- Vérification rapide
SELECT 
  'projects' as table_name, 
  COUNT(*) as row_count,
  COUNT(owner) as with_owner,
  COUNT(user_id) as with_user_id,
  COUNT(bu) as with_bu
FROM projects
UNION ALL
SELECT 
  'cockpit_decisions' as table_name,
  COUNT(*) as row_count,
  COUNT(project_id) as with_project_id,
  COUNT(impact) as with_impact,
  COUNT(urgency) as with_urgency
FROM cockpit_decisions;

-- Afficher les colonnes ajoutées
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('projects', 'cockpit_decisions', 'cockpit_budgets', 'cockpit_timeline')
  AND column_name IN (
    'owner', 'user_id', 'bu', 'country', 'tags',
    'capacity_needed', 'capacity_allocated',
    'project_id', 'impact', 'urgency', 'responsible',
    'created_by', 'updated_by', 'variance_reason',
    'entity_type', 'entity_id'
  )
ORDER BY table_name, column_name;
