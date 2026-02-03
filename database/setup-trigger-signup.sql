-- ============================================
-- TRIGGER AUTO-SIGNUP
-- ============================================
-- À exécuter APRÈS avoir appliqué schema-v2-clean.sql
-- Ce trigger crée automatiquement organization + profile lors du signup

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Créer une organisation pour le nouvel utilisateur
  INSERT INTO public.organizations (name, slug)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Mon') || ' Organisation',
    'org-' || NEW.id
  )
  RETURNING id INTO new_org_id;
  
  -- Créer le profil lié
  INSERT INTO public.profiles (
    id, 
    organization_id, 
    email, 
    first_name, 
    last_name, 
    plan, 
    role
  )
  VALUES (
    NEW.id,
    new_org_id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    'demo',
    'owner'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Après avoir exécuté ce script, vérifiez avec :
-- SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Pour les utilisateurs EXISTANTS (créés avant le trigger),
-- exécutez le script ci-dessous pour créer manuellement leur org + profile:

/*
DO $$
DECLARE
  user_record RECORD;
  new_org_id UUID;
BEGIN
  -- Pour chaque utilisateur sans profile
  FOR user_record IN 
    SELECT u.id, u.email, u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL
  LOOP
    -- Créer organization
    INSERT INTO public.organizations (name, slug)
    VALUES (
      COALESCE(user_record.raw_user_meta_data->>'first_name', 'Mon') || ' Organisation',
      'org-' || user_record.id
    )
    RETURNING id INTO new_org_id;
    
    -- Créer profile
    INSERT INTO public.profiles (
      id, 
      organization_id, 
      email, 
      first_name, 
      last_name, 
      plan, 
      role
    )
    VALUES (
      user_record.id,
      new_org_id,
      user_record.email,
      user_record.raw_user_meta_data->>'first_name',
      user_record.raw_user_meta_data->>'last_name',
      'demo',
      'owner'
    );
    
    RAISE NOTICE 'Created org and profile for user: %', user_record.email;
  END LOOP;
END $$;
*/
