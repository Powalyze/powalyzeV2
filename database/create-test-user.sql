-- ============================================================================
-- CRÉATION D'UN UTILISATEUR DE TEST POUR POWALYZE
-- ============================================================================
-- Ce script crée un utilisateur de test dans Supabase Auth
-- Email: demo@powalyze.com
-- Mot de passe: Demo2026!
-- ============================================================================

-- 1. Créer l'utilisateur dans auth.users avec mot de passe hashé
-- Note: Supabase utilise bcrypt pour hasher les mots de passe
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'demo@powalyze.com',
  -- Hash bcrypt du mot de passe "Demo2026!" (10 rounds)
  '$2a$10$8K1p/a0dL3LKzxfsY6rKDeLxNvPLsqHPqXA8Q3TyWJ5qPvqVZIQ/K',
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider":"email","providers":["email"]}',
  '{"name":"Demo User"}',
  false,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL
)
ON CONFLICT (email) DO NOTHING;

-- 2. Le profil sera créé automatiquement par le trigger handle_new_user()
-- Si le trigger n'existe pas, créer le profil manuellement :

-- INSERT INTO public.profiles (id, email, role, created_at, updated_at)
-- SELECT id, email, 'pro', NOW(), NOW()
-- FROM auth.users
-- WHERE email = 'demo@powalyze.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'pro', updated_at = NOW();

-- ============================================================================
-- VÉRIFICATION
-- ============================================================================
-- Pour vérifier que l'utilisateur a été créé :
-- SELECT id, email, email_confirmed_at, created_at FROM auth.users WHERE email = 'demo@powalyze.com';

-- Pour vérifier le profil :
-- SELECT * FROM public.profiles WHERE email = 'demo@powalyze.com';

-- ============================================================================
-- INSTRUCTIONS D'UTILISATION
-- ============================================================================
-- 1. Allez sur https://supabase.com/dashboard → Votre projet → SQL Editor
-- 2. Collez ce script et exécutez-le
-- 3. Connectez-vous sur http://localhost:3000/login avec :
--    - Email: demo@powalyze.com
--    - Mot de passe: Demo2026!
-- ============================================================================
