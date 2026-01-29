-- ================================================
-- TABLE: invitations (invitations en attente)
-- ================================================
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  organization_id UUID NOT NULL,
  role_global TEXT NOT NULL CHECK (role_global IN ('super_admin', 'admin', 'chef_projet', 'contributeur', 'lecteur')),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  role_project TEXT CHECK (role_project IN ('owner', 'editor', 'viewer')),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);

-- RLS Policies
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Policy: Les admins peuvent voir toutes les invitations de leur organisation
CREATE POLICY "Admins can view invitations"
  ON public.invitations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role_global IN ('super_admin', 'admin')
    )
  );

-- Policy: Les admins peuvent créer des invitations
CREATE POLICY "Admins can create invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role_global IN ('super_admin', 'admin')
    )
  );

-- Policy: Les admins peuvent mettre à jour les invitations
CREATE POLICY "Admins can update invitations"
  ON public.invitations FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role_global IN ('super_admin', 'admin')
    )
  );

-- Policy: Les admins peuvent supprimer les invitations
CREATE POLICY "Admins can delete invitations"
  ON public.invitations FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role_global IN ('super_admin', 'admin')
    )
  );

-- Vérifier la création
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'invitations'
ORDER BY ordinal_position;
