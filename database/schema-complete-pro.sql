-- ============================================
-- SCHEMA COMPLET PRO - POWALYZE
-- ============================================
-- Date: 2026-02-04
-- Objectif: Base de données complète pour surpasser Monday.com
-- Compatible avec le schéma existant de Powalyze
-- ============================================

-- Note: Ce schéma s'ajoute aux tables existantes:
-- - organizations, users, projects, risks, decisions déjà créés
-- ============================================

-- ============================================
-- SECTION 1: Commentaires & Activités
-- ============================================

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('project', 'task', 'risk', 'decision')),
  entity_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mentions JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  entity_name VARCHAR(255),
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);

-- ============================================
-- SECTION 2: Notifications
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('mention', 'comment', 'assignment', 'deadline', 'status_change', 'approval', 'alert')),
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link VARCHAR(500),
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- SECTION 3: Tâches & Kanban
-- ============================================

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'done', 'blocked')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  due_date DATE,
  estimated_hours DECIMAL(10,2),
  actual_hours DECIMAL(10,2),
  tags TEXT[],
  position INTEGER DEFAULT 0,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- ============================================
-- SECTION 4: Documents & Fichiers
-- ============================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('project', 'task', 'organization')),
  entity_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  version INTEGER DEFAULT 1,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  change_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);

-- ============================================
-- SECTION 5: Gantt & Dépendances
-- ============================================

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
  color VARCHAR(7) DEFAULT '#3b82f6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type VARCHAR(20) DEFAULT 'finish_to_start' CHECK (dependency_type IN ('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish')),
  lag_days INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(task_id, depends_on_task_id)
);

CREATE INDEX idx_milestones_project ON milestones(project_id);
CREATE INDEX idx_task_dependencies_task ON task_dependencies(task_id);

-- ============================================
-- SECTION 6: Automatisations & Workflows
-- ============================================

CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('status_change', 'field_update', 'date_reached', 'creation', 'assignment')),
  trigger_config JSONB NOT NULL,
  actions JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS automation_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  status VARCHAR(20) CHECK (status IN ('success', 'failed', 'skipped')),
  result JSONB,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_automations_org ON automations(organization_id);
CREATE INDEX idx_automation_executions_auto ON automation_executions(automation_id);

-- ============================================
-- SECTION 7: Templates de Projets
-- ============================================

CREATE TABLE IF NOT EXISTS project_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  is_public BOOLEAN DEFAULT false,
  config JSONB NOT NULL,
  tasks_template JSONB DEFAULT '[]',
  milestones_template JSONB DEFAULT '[]',
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_project_templates_org ON project_templates(organization_id);
CREATE INDEX idx_project_templates_public ON project_templates(is_public);

-- ============================================
-- SECTION 8: Ressources & Capacité
-- ============================================

CREATE TABLE IF NOT EXISTS resource_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  allocation_percent DECIMAL(5,2) NOT NULL CHECK (allocation_percent >= 0 AND allocation_percent <= 100),
  start_date DATE NOT NULL,
  end_date DATE,
  role VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS time_off (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type VARCHAR(50) CHECK (type IN ('vacation', 'sick', 'training', 'other')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resource_allocations_user ON resource_allocations(user_id);
CREATE INDEX idx_resource_allocations_project ON resource_allocations(project_id);
CREATE INDEX idx_time_off_user ON time_off(user_id);

-- ============================================
-- SECTION 9: Dashboards Personnalisables
-- ============================================

CREATE TABLE IF NOT EXISTS custom_dashboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  layout JSONB NOT NULL,
  widgets JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_custom_dashboards_user ON custom_dashboards(user_id);

-- ============================================
-- SECTION 10: Intégrations
-- ============================================

CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('jira', 'azure_devops', 'github', 'slack', 'teams', 'drive', 'onedrive')),
  name VARCHAR(255) NOT NULL,
  config JSONB NOT NULL,
  credentials JSONB,
  enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  events TEXT[] NOT NULL,
  secret VARCHAR(255),
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integrations_org ON integrations(organization_id);
CREATE INDEX idx_webhooks_org ON webhooks(organization_id);

-- ============================================
-- FIN DU SCHEMA
-- ============================================

SELECT '✅ Schema complet créé avec succès!' as status;
