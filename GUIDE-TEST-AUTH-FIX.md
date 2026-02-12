# ✅ Guide de test - Fix auth redirect

## 🧪 Tests à effectuer

### Test 1: Login avec compte existant

1. Supprimer les cookies Supabase (DevTools > Application > Cookies)
2. Aller sur `/login`
3. Se connecter avec vos identifiants
4. **Résultat attendu:** 
   - ✅ Redirection immédiate vers `/cockpit/projets`
   - ✅ AUCUNE redirection vers `/signup`
   - ✅ Header affiche "Mon Cockpit" + email

### Test 2: Accès direct à une page protégée (non connecté)

1. Supprimer les cookies Supabase
2. Taper directement: `http://localhost:3000/cockpit/projets`
3. **Résultat attendu:**
   - ✅ Redirection vers `/login?redirect=%2Fcockpit%2Fprojets`
   - ✅ PAS vers `/signup`

### Test 3: Session persistante

1. Se connecter normalement
2. Recharger la page (F5)
3. **Résultat attendu:**
   - ✅ Reste sur `/cockpit/projets`
   - ✅ AUCUNE redirection
   - ✅ Session toujours active

### Test 4: Plusieurs onglets

1. Se connecter dans l'onglet 1
2. Ouvrir `/cockpit/projets` dans l'onglet 2
3. **Résultat attendu:**
   - ✅ Accès direct dans l'onglet 2
   - ✅ Session synchronisée

### Test 5: Logout

1. Cliquer sur "Se déconnecter"
2. **Résultat attendu:**
   - ✅ Redirection vers `/`
   - ✅ Cookies Supabase supprimés

---

## 🔍 Vérifications DevTools

### 1. Console (logs middleware)

Ouvrir la console navigateur, chercher :

```
✅ [LOGIN] Session créée: { userId: 'xxx' }
✅ [LOGIN] Session confirmée persistée
✅ [LOGIN] Cookies détectés
🔍 [MIDDLEWARE] { hasUser: true, userId: 'xxx' }
🔍 [AuthGuard] Checking auth: { hasUser: true }
```

### 2. Network (requête /cockpit/projets)

- Onglet Network
- Recharger `/cockpit/projets`
- Vérifier Request Headers:
  - ✅ `Cookie: sb-xxx-auth-token=...`

### 3. Application > Cookies

Chercher les cookies :
- ✅ `sb-xxx-auth-token` (domaine: localhost)
- ✅ `sb-xxx-auth-token-code-verifier` (PKCE)

### 4. Application > Local Storage

Chercher la clé :
- ✅ `sb-auth-token` → Contient la session complète

---

## 🚨 Problèmes possibles

### Problème 1: "Session non trouvée après login"

**Logs:**
```
❌ [LOGIN] Session non trouvée après login!
```

**Cause:** localStorage désactivé ou cookies bloqués

**Solution:**
- Vérifier les paramètres cookies du navigateur
- Désactiver les bloqueurs de cookies (uBlock, Privacy Badger, etc.)
- Vérifier en mode navigation privée

### Problème 2: "Cookies non détectés"

**Logs:**
```
⚠️ [LOGIN] Cookies Supabase non détectés dans le navigateur
```

**Cause:** Cookies pas encore écrits

**Solution:** Le code attend automatiquement 1s supplémentaire

### Problème 3: "Redirection vers /signup persiste"

**Logs:**
```
⚠️ [MIDDLEWARE] Pas d'utilisateur authentifié
```

**Causes possibles:**
1. Variables d'environnement incorrectes
2. Supabase URL/Key invalides
3. JWT expiré sans refresh

**Solution:**
1. Vérifier `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
2. Redémarrer le serveur: `npm run dev`
3. Supprimer tous les cookies et se reconnecter

---

## 🛠️ Debug avancé

### Toggle logs détaillés

Dans le navigateur (console):

```javascript
// Activer logs détaillés Supabase
localStorage.setItem('supabase.auth.debug', 'true');

// Tester la session manuellement
const { data: { user } } = await window.supabase.auth.getUser();
console.log('User:', user);

// Vérifier cookies
console.log('Cookies:', document.cookie);
```

### Tester l'API auth directement

```javascript
// Test login
const { data, error } = await window.supabase.auth.signInWithPassword({
  email: 'votre@email.com',
  password: 'votre-password'
});
console.log('Login:', { data, error });

// Vérifier session
const { data: session } = await window.supabase.auth.getSession();
console.log('Session:', session);
```

---

## ✅ Checklist finale

Avant de valider le fix:

- [ ] Test 1: Login → accès direct ✅
- [ ] Test 2: Page protégée → redirect /login ✅
- [ ] Test 3: Session persiste après F5 ✅
- [ ] Test 4: Multi-tabs synchronisés ✅
- [ ] Test 5: Logout clean ✅
- [ ] Logs middleware corrects dans console ✅
- [ ] Cookies Supabase présents dans DevTools ✅
- [ ] Aucune erreur 401/403 dans Network ✅

---

## 🚀 Si tout fonctionne localement

```bash
# Build production
npm run build

# Test le build localement
npm start

# Deploy
npx vercel --prod --yes
```

Après déploiement, refaire TOUS les tests en production !

---

**Auteur:** Claude  
**Date:** 12 février 2026
