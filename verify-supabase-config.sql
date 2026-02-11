-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 🔍 VÉRIFICATION CONFIGURATION SUPABASE INTERNE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 
-- À exécuter dans: Supabase Dashboard → SQL Editor
-- 
-- Ce script vérifie :
-- - JWT secret configuré
-- - Durée de vie des tokens
-- - URL externe (pour Auth redirections)
-- - Site URL (pour callbacks)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT
  current_setting('app.settings.jwt_secret', true) as jwt_secret,
  current_setting('app.settings.jwt_exp', true) as jwt_exp,
  current_setting('app.settings.external_url', true) as external_url,
  current_setting('app.settings.site_url', true) as site_url;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 📋 VÉRIFICATIONS À FAIRE :
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 
-- 1. jwt_secret doit être défini (non NULL)
-- 2. jwt_exp doit être raisonnable (ex: 3600 pour 1h)
-- 3. external_url doit être: https://phfeteiholkfiredgero.supabase.co
-- 4. site_url doit être: https://www.powalyze.com (votre domaine production)
--    ou https://powalyze-sigma.vercel.app (domaine Vercel)
-- 
-- ⚠️  Si site_url ne correspond pas à votre domaine,
--    les redirections Auth après login/signup seront cassées !
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Vérification supplémentaire : Liste des URL autorisées pour Auth
-- (à configurer dans: Authentication → URL Configuration)

SELECT 
  unnest(string_to_array(
    current_setting('app.settings.additional_redirect_urls', true),
    ','
  )) as allowed_redirect_urls;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 🔧 CONFIGURATION ATTENDUE :
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 
-- Site URL: https://www.powalyze.com
-- 
-- Redirect URLs autorisées :
-- - https://www.powalyze.com/auth/callback
-- - https://powalyze-sigma.vercel.app/auth/callback
-- - http://localhost:3000/auth/callback (pour dev)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
