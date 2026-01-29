-- Migration: Fix invitations table - Add invited_by column with nullable constraint
-- Execute this in Supabase SQL Editor

-- Add invited_by column if it doesn't exist (nullable for existing rows)
ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_invitations_invited_by ON public.invitations(invited_by);

-- Verify the column was added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'invitations'
ORDER BY ordinal_position;

