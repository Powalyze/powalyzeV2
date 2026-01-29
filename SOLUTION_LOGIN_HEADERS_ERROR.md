# Solution : Erreur Headers ISO-8859-1 sur Page Login

## Diagnostic

L'erreur `Failed to execute 'fetch' on 'Window': Failed to read the 'headers' property from 'RequestInit': String contains non ISO-8859-1 code point` survient lors de l'appel `supabase.auth.signInWithPassword()` dans la page de login.

## Causes Possibles

1. **Email avec caractères spéciaux** : Email contenant des accents (ex: françois@...)
2. **Métadonnées utilisateur corrompues** : `raw_user_meta_data` ou `raw_app_meta_data` avec caractères non-ASCII
3. **Cache navigateur** : Anciennes données de session corrompues
4. **Configuration Supabase** : Headers personnalisés avec caractères invalides

## Solutions (Dans l'ordre de priorité)

### 1. Vider le cache et localStorage
```javascript
// Dans la console du navigateur (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2. Créer un utilisateur test avec email ASCII pur
```
Email: demo@powalyze.com
Mot de passe: Demo2026!
```

**Comment créer dans Supabase Dashboard :**
1. Aller sur https://supabase.com/dashboard/project/pqsgdwfsdnmozzoynefw
2. Authentication > Users
3. Add User > Create new user
4. Email: `demo@powalyze.com`
5. Password: `Demo2026!`
6. Confirm email automatically: ✓ (coché)
7. Create user

### 3. Exécuter le script SQL de création
```bash
# Dans Supabase Dashboard > SQL Editor
psql $DATABASE_URL -f database/create-test-user.sql
```

### 4. Tester avec mode DEMO (bypass Supabase)
Si le problème persiste, tester avec le mode DEMO qui n'utilise pas Supabase :
- URL: https://www.powalyze.com/cockpit-demo
- Pas d'authentification requise

### 5. Vérifier les métadonnées utilisateur
Si un utilisateur existe déjà, vérifier qu'il n'a pas de caractères spéciaux :

```sql
-- Dans Supabase SQL Editor
SELECT 
  id, 
  email, 
  raw_user_meta_data,
  raw_app_meta_data
FROM auth.users
WHERE email = 'votre@email.com';
```

Si `raw_user_meta_data` ou `raw_app_meta_data` contient des caractères spéciaux, nettoyer :

```sql
UPDATE auth.users
SET 
  raw_user_meta_data = '{"name":"User"}',
  raw_app_meta_data = '{"provider":"email","providers":["email"]}'
WHERE email = 'votre@email.com';
```

### 6. Créer un wrapper de connexion sécurisé
Si le problème persiste, modifier le code de connexion pour sanitizer les données :

```typescript
// Dans app/login/page.tsx
const sanitizeEmail = (email: string) => {
  // Garder uniquement caractères ASCII
  return email.normalize('NFKD').replace(/[^\x00-\x7F]/g, '');
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const sanitizedEmail = sanitizeEmail(email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: sanitizedEmail,
    password,
  });
  // ...
};
```

## Vérification

Après avoir appliqué une solution, tester :

1. Aller sur https://www.powalyze.com/login
2. Se connecter avec `demo@powalyze.com` / `Demo2026!`
3. Vérifier qu'aucune erreur n'apparaît dans la console (F12)
4. Vérifier la redirection vers le cockpit

## Notes Techniques

- Le fix du middleware (encodage base64 de x-user-email) résout les erreurs **côté serveur**
- Cette erreur est **côté client** et vient de Supabase JS SDK
- Les headers HTTP ne peuvent contenir que des caractères ASCII (0-127)
- Supabase utilise fetch() natif qui valide strictement les headers

## Support

Si le problème persiste après toutes ces étapes :
1. Vérifier la console navigateur (F12) pour le message d'erreur complet
2. Vérifier les variables d'environnement dans Vercel
3. Contacter le support Supabase si le problème vient du SDK
