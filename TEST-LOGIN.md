# 🔧 Test de connexion - Checklist

## ✅ Clés configurées (confirmé)
- NEXT_PUBLIC_SUPABASE_URL: https://phfeteiholkfiredgero.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY: Configurée ✅
- SUPABASE_SERVICE_ROLE_KEY: Configurée ✅

## 🚀 Déploiement terminé
- URL: https://www.powalyze.com
- Timestamp: 2026-02-08 18:05

## 📋 Procédure de test

### Étape 1: Vider le cache du navigateur
**IMPORTANT**: Les anciennes clés peuvent être en cache

**Chrome/Edge:**
1. F12 → Onglet "Application" ou "Stockage"
2. Cliquer sur "Clear storage" / "Effacer le stockage"
3. Cocher "Local storage", "Session storage", "Cookies"
4. Cliquer "Clear site data"
5. **OU** mode navigation privée: Ctrl+Shift+N

**Firefox:**
1. F12 → Onglet "Stockage"
2. Clic droit sur le site → Tout supprimer
3. **OU** mode navigation privée: Ctrl+Shift+P

### Étape 2: Créer un compte de test
1. Aller sur: https://www.powalyze.com/signup
2. Remplir:
   - Prénom: Test
   - Nom: User
   - Email: votre.email@test.com
   - Mot de passe: (minimum 6 caractères)
   - Société: Test Corp
3. Cliquer "Créer mon compte"
4. Vérifier votre email pour le lien de confirmation
5. Cliquer sur le lien de confirmation

### Étape 3: Se connecter
1. Aller sur: https://www.powalyze.com/login
2. Entrer email et mot de passe
3. Cliquer "Se connecter"

### Étape 4: Vérification Console (si erreur)
Si l'erreur persiste:
1. F12 → Onglet "Console"
2. Copier le message d'erreur complet
3. F12 → Onglet "Network" / "Réseau"
4. Filtrer par "supabase" ou "auth"
5. Regarder les requêtes HTTP en erreur
6. Cliquer sur la requête → Onglet "Preview" / "Aperçu"
7. Copier la réponse JSON

## 🔍 Diagnostic en ligne
Tester: https://www.powalyze.com/api/debug/check-keys

Résultat attendu:
```json
{
  "supabase_url": { "valid": true },
  "supabase_anon_key": { "valid": true },
  "supabase_service_role_key": { "valid": true }
}
```

## 🆘 Si toujours "Invalid API key"

### Cause possible #1: Pas de compte créé
Solution: Aller sur /signup pour créer un compte

### Cause possible #2: Email non confirmé
Solution: Vérifier l'email de confirmation Supabase

### Cause possible #3: URL Supabase incorrecte
Vérifier que l'URL est bien: `https://phfeteiholkfiredgero.supabase.co`

**SANS double 'o' à la fin!**

### Cause possible #4: Clés expirées
Les clés ont une date d'expiration (exp: 2080545038 = 2036)
C'est OK, elles sont valides jusqu'en 2036.

## 📞 Debug avancé
Si rien ne fonctionne, vérifier dans Supabase Dashboard:
1. https://supabase.com/dashboard
2. Projet: phfeteiholkfiredgero
3. Authentication → Users → Vérifier que l'utilisateur existe
4. Authentication → Policies → Vérifier que RLS n'est pas trop restrictif
5. Logs → Voir les erreurs d'authentification
