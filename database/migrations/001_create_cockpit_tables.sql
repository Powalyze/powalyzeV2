-- ============================================
-- POWALYZE — MIGRATION COCKPIT
-- Tables: risks, decisions, anomalies, reports, connectors
-- ============================================

-- Table RISKS
CREATE TABLE IF NOT EXISTS public.risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  impact INTEGER CHECK (impact >= 1 AND impact <= 5),
  probability INTEGER CHECK (probability >= 1 AND probability <= 5),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table DECISIONS
CREATE TABLE IF NOT EXISTS public.decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  decision_maker TEXT,
  decided_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table ANOMALIES
CREATE TABLE IF NOT EXISTS public.anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID,
  title TEXT NOT NULL,
  content TEXT,
  report_type TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table CONNECTORS
CREATE TABLE IF NOT EXISTS public.connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  connector_type TEXT NOT NULL,
  api_key TEXT,
  secret TEXT,
  api_url TEXT,
  metadata JSONB,
  status TEXT DEFAULT 'active',
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_risks_user_id ON public.risks(user_id);
CREATE INDEX IF NOT EXISTS idx_risks_project_id ON public.risks(project_id);
CREATE INDEX IF NOT EXISTS idx_decisions_user_id ON public.decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_decisions_project_id ON public.decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_user_id ON public.anomalies(user_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_project_id ON public.anomalies(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_connectors_user_id ON public.connectors(user_id);

-- RLS Policies
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connectors ENABLE ROW LEVEL SECURITY;

-- Policies: Utilisateurs voient uniquement leurs propres données
CREATE POLICY "Users can view own risks" ON public.risks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own risks" ON public.risks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own risks" ON public.risks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own risks" ON public.risks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own decisions" ON public.decisions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own decisions" ON public.decisions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own decisions" ON public.decisions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own decisions" ON public.decisions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own anomalies" ON public.anomalies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own anomalies" ON public.anomalies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own anomalies" ON public.anomalies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own anomalies" ON public.anomalies FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reports" ON public.reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reports" ON public.reports FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own connectors" ON public.connectors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own connectors" ON public.connectors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own connectors" ON public.connectors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own connectors" ON public.connectors FOR DELETE USING (auth.uid() = user_id);
