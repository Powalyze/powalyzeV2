# Guide de Création d'Utilisateurs de Test - Powalyze

## Connexion impossible au SaaS ?

Si vous ne pouvez pas vous connecter à Powalyze, c'est probablement parce qu'**aucun utilisateur n'existe encore dans Supabase**.

## Solution Rapide : Créer un Utilisateur de Test

### Méthode 1 : Via le Dashboard Supabase (Recommandé)

1. **Accédez à votre projet Supabase** :
   - URL : https://pqsgdwfsdnmozzoynefw.supabase.co
   - Ou via : https://supabase.com/dashboard

2. **Créez un utilisateur** :
   - Allez dans **Authentication** → **Users**
   - Cliquez sur **Add User** → **Create new user**
   - Entrez les informations :
     - **Email** : `demo@powalyze.com`
     - **Password** : `Demo2026!`
     - **Auto Confirm User** : ✅ Cochez cette case
   - Cliquez sur **Create User**

3. **Connectez-vous** :
   - Allez sur http://localhost:3000/login
   - Email : `demo@powalyze.com`
   - Mot de passe : `Demo2026!`

### Méthode 2 : Via SQL (Pour les développeurs)

Exécutez ce SQL dans **SQL Editor** de Supabase :

```sql
-- Insérer un utilisateur de test
-- Note: Le mot de passe sera "Demo2026!" après hashage par Supabase
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'demo@powalyze.com',
  crypt('Demo2026!', gen_salt('bf')), -- Hash bcrypt du mot de passe
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Le profil sera créé automatiquement par le trigger handle_new_user()
```

### Méthode 3 : Inscription via l'interface

1. Allez sur http://localhost:3000/register
2. Créez un compte avec vos informations
3. **Important** : Vous devrez confirmer votre email
   - Allez dans **Authentication** → **Users** dans Supabase
   - Trouvez votre utilisateur
   - Cliquez sur les **trois points** → **Confirm email**

## Essayer la Démo (Sans Inscription)

Si vous voulez juste **tester l'interface sans vous connecter** :

1. Allez sur http://localhost:3000/login
2. Cliquez sur le bouton **"✨ Essayer la démo"**
3. Vous serez redirigé vers `/cockpit-real` avec des données de démonstration

## Troubleshooting

### "Invalid login credentials"
→ L'email ou le mot de passe est incorrect. Vérifiez vos identifiants.

### "Email not confirmed"
→ Allez dans Supabase Dashboard → Authentication → Users → Confirmez l'email de l'utilisateur.

### "Erreur de connexion: User not found"
→ L'utilisateur n'existe pas. Créez-en un avec la Méthode 1 ci-dessus.

### Le bouton "Essayer la démo" ne fonctionne pas
→ Vérifiez que le serveur Next.js est démarré (`npm run dev`)

## Variables d'Environnement

Assurez-vous que votre fichier `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL="https://pqsgdwfsdnmozzoynefw.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Ces clés sont déjà configurées dans votre projet.

## Support

Pour plus d'aide, consultez :
- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Guide complet Powalyze](./GUIDE-NOUVEAU-CLIENT.md)
