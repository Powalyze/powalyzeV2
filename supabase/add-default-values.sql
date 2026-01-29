-- ============================================================
-- AJOUTER DES VALEURS PAR DÉFAUT POUR LA TABLE PROFILES
-- Exécuter dans Supabase → SQL Editor
-- ============================================================

-- Ajouter valeur par défaut pour role (si nécessaire)
alter table public.profiles
alter column role set default 'member';

-- Ajouter valeur par défaut pour mode
alter table public.profiles
alter column mode set default 'demo';

-- Rendre organization_id nullable (optionnel)
alter table public.profiles
alter column organization_id drop not null;

-- ============================================================
-- VÉRIFICATION (optionnel)
-- ============================================================
-- SELECT column_name, column_default, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'profiles' AND table_schema = 'public';
