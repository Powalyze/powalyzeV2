# 🎯 GUIDE RAPIDE : Résolution Erreur Login

## ✅ Ce qui a été corrigé

### 1. Middleware (déjà déployé)
- ✅ Encodage base64 de l'email dans le header `x-user-email`
- ✅ Prévention des erreurs côté serveur

### 2. Page Login (vient d'être déployé)
- ✅ Sanitization automatique des emails avec caractères spéciaux
- ✅ Avertissement utilisateur si email modifié
- ✅ Normalisation Unicode + suppression caractères non-ASCII

## 🚀 Actions Immédiates

### Étape 1 : Créer l'utilisateur test
1. Aller sur https://supabase.com/dashboard/project/pqsgdwfsdnmozzoynefw/auth/users
2. Cliquer "Add User" > "Create new user"
3. **Email** : `demo@powalyze.com`
4. **Mot de passe** : `Demo2026!`
5. ✓ Cocher "Confirm email automatically"
6. Cliquer "Create user"

### Étape 2 : Tester la connexion
1. Aller sur https://www.powalyze.com/login
2. Se connecter avec :
   - Email : `demo@powalyze.com`
   - Mot de passe : `Demo2026!`
3. ✅ Devrait rediriger vers `/cockpit-demo`

### Étape 3 : Vider le cache (si erreur persiste)
```javascript
// Console navigateur (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## 🔍 Diagnostic

Si l'erreur persiste, vérifier dans Console (F12) :

### Messages attendus
```
[LOGIN] Tentative de connexion... { email: "demo@powalyze.com" }
[LOGIN] Connexion reussie ! User ID: xxx-xxx-xxx
[LOGIN] Role utilisateur: demo
[LOGIN] Redirection vers /cockpit-demo
```

### Erreurs possibles

#### ❌ "Invalid login credentials"
**Cause** : Utilisateur n'existe pas  
**Solution** : Retourner à Étape 1

#### ❌ "Failed to read headers"
**Cause** : Cache corrompu ou caractères spéciaux résiduels  
**Solution** : Vider cache (Étape 3)

#### ❌ "Email non confirme"
**Cause** : Email pas confirmé dans Supabase  
**Solution** : Dashboard Supabase > Users > demo@powalyze.com > Confirm email

## 📋 Vérification Technique

### Variables d'environnement Vercel
Vérifier que ces variables sont définies :
```
NEXT_PUBLIC_SUPABASE_URL=https://pqsgdwfsdnmozzoynefw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### Déploiement actuel
- ✅ **URL** : https://www.powalyze.com
- ✅ **Inspect** : https://vercel.com/powalyzes-projects/powalyze-v2/2C37a4jUro773FpQiNrDzuSVzn4u
- ✅ **Statut** : Production déployée

## 🎯 Alternative : Mode DEMO

Si tu veux tester immédiatement sans Supabase :
- URL : https://www.powalyze.com/cockpit-demo
- Pas de connexion requise
- Données fixes (mode démo)

## 📞 Support

Si problème persiste après ces étapes :
1. Copier le message d'erreur complet de la console
2. Copier l'email utilisé
3. Vérifier l'existence de l'utilisateur dans Supabase Dashboard
