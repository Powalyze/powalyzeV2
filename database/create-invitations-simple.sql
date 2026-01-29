-- ================================================
-- CRÉATION TABLE INVITATIONS (SANS DÉPENDANCES)
-- ================================================
-- Exécutez ce SQL dans Supabase SQL Editor

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

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_org ON public.invitations(organization_id);

-- RLS désactivé pour l'instant (activez après avoir créé user_roles)
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Policy temporaire: Permettre tout pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users"
  ON public.invitations
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Vérifier la création
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'invitations'
ORDER BY ordinal_position;
