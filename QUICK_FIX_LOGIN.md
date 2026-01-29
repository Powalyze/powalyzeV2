# 🚨 FIX RAPIDE : Erreur "Invalid login credentials"

## Problème
Vous voyez cette erreur : `AuthApiError: Invalid login credentials`

**Cause** : Aucun utilisateur n'existe dans Supabase Auth.

## Solution Rapide (2 minutes)

### Option 1 : Via Supabase Dashboard (RECOMMANDÉ) ✅

1. **Ouvrez votre dashboard Supabase** :
   ```
   https://supabase.com/dashboard/project/pqsgdwfsdnmozzoynefw
   ```

2. **Créez un utilisateur** :
   - Cliquez sur **"Authentication"** dans le menu latéral
   - Cliquez sur **"Users"**
   - Cliquez sur **"Add User"** → **"Create new user"**
   
3. **Remplissez le formulaire** :
   - **Email** : `demo@powalyze.com`
   - **Password** : `Demo2026!`
   - **✅ IMPORTANT** : Cochez **"Auto Confirm User"**
   - Cliquez sur **"Create User"**

4. **Testez la connexion** :
   - Allez sur http://localhost:3000/login
   - Email : `demo@powalyze.com`
   - Password : `Demo2026!`
   - Cliquez sur "Se connecter"

### Option 2 : Via SQL Editor (Pour développeurs)

1. **Ouvrez SQL Editor dans Supabase** :
   - Dashboard → **SQL Editor** → **New Query**

2. **Copiez et exécutez ce SQL** :
   ```sql
   -- Créer un utilisateur de test
   INSERT INTO auth.users (
     instance_id,
     id,
     aud,
     role,
     email,
     encrypted_password,
     email_confirmed_at,
     raw_app_meta_data,
     raw_user_meta_data,
     created_at,
     updated_at
   ) VALUES (
     '00000000-0000-0000-0000-000000000000',
     gen_random_uuid(),
     'authenticated',
     'authenticated',
     'demo@powalyze.com',
     '$2a$10$8K1p/a0dL3LKzxfsY6rKDeLxNvPLsqHPqXA8Q3TyWJ5qPvqVZIQ/K',
     NOW(),
     '{"provider":"email","providers":["email"]}',
     '{"name":"Demo User"}',
     NOW(),
     NOW()
   )
   ON CONFLICT (email) DO NOTHING;
   ```

3. **Cliquez sur "Run"**

4. **Connectez-vous** avec :
   - Email : `demo@powalyze.com`
   - Password : `Demo2026!`

### Option 3 : Inscription via l'interface

1. Allez sur http://localhost:3000/register
2. Créez votre compte
3. **IMPORTANT** : Confirmez l'email dans Supabase Dashboard
   - Dashboard → Authentication → Users
   - Trouvez votre utilisateur
   - Cliquez sur les **trois points** (⋮)
   - Sélectionnez **"Confirm email"**
4. Retournez sur /login et connectez-vous

## Alternative : Accès direct sans compte

Si vous voulez juste **tester l'interface** sans créer de compte :

1. Cliquez sur le bouton **"👑 Pro"** sur la page de login
2. Vous serez redirigé vers le cockpit avec des données de démonstration

## Vérification

Pour vérifier qu'un utilisateur existe :

```sql
-- Dans SQL Editor de Supabase
SELECT email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'demo@powalyze.com';
```

## Support

Le fichier `database/create-test-user.sql` contient le script complet pour créer un utilisateur de test.

Pour plus d'aide : consultez `GUIDE_CREATION_UTILISATEUR.md`
