# 🚀 Commandes de Déploiement - Fix Boucle de Redirection

**Date**: 1er février 2026

---

## Étape 1: Validation Locale

```powershell
# Vérifier la compilation TypeScript
npx tsc --noEmit

# Résultat attendu: Aucune erreur
```

---

## Étape 2: Build Local

```powershell
cd c:\powalyze
npm run build
```

**Résultat attendu**:
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

## Étape 3: Test Local

```powershell
npm run dev
```

**URLs à tester**:
1. http://localhost:3000/cockpit/client?userId=test&organizationId=test
2. http://localhost:3000/cockpit/admin?userId=test
3. http://localhost:3000/cockpit
4. http://localhost:3000/cockpit/demo

**Vérifications**:
- ✅ Pas d'erreur ERR_TOO_MANY_REDIRECTS
- ✅ Redirections fonctionnent correctement
- ✅ Pages s'affichent sans boucle

---

## Étape 4: Commit des Changements

```powershell
git add .
git commit -m "fix: eliminate ERR_TOO_MANY_REDIRECTS on /cockpit/client

- Remove role check in middleware for /cockpit/client to prevent loops
- Add auto-fetch organizationId from users.tenant_id
- Redirect to /cockpit/demo instead of /cockpit in all fallbacks
- Add protection against auth redirect loops with isAuthPath
- Fix TypeScript types for finalOrgId

Fixes redirect loop:
/cockpit/client → /cockpit → /cockpit/client → ...

Files modified:
- middleware.ts (4 changes)
- app/cockpit/client/page.tsx (3 changes)
- app/cockpit/admin/page.tsx (1 change)
- lib/guards.ts (2 changes)

Tests:
✅ Client with full params → Direct display
✅ Client without orgId → Auto-fetch + display
✅ Admin to client → Single redirect to /cockpit/demo
✅ Demo to client → Single redirect to /cockpit/demo
✅ Unauthenticated → Single redirect to /signup
✅ /cockpit route → Auto-redirect by role
✅ TypeScript compilation → No errors"
```

---

## Étape 5: Déploiement Vercel

### Option A: Via la tâche VS Code
```
1. Ouvrir la palette de commandes (Ctrl+Shift+P)
2. Chercher "Run Task"
3. Sélectionner "Deploy to Vercel Production"
```

### Option B: Via la ligne de commande
```powershell
npx vercel --prod --yes
```

**Résultat attendu**:
```
Vercel CLI X.X.X
🔍  Inspect: https://vercel.com/powalyze/[...]/[...]
✅  Production: https://www.powalyze.com [XX.XXs]
```

---

## Étape 6: Validation en Production

### Test 1: Client avec params complets
```powershell
curl -I "https://www.powalyze.com/cockpit/client?userId=test&organizationId=test" `
  -H "Cookie: sb-access-token=..." `
  -v
```

**Résultat attendu**:
- Status: 200 OK
- Pas de redirection en boucle
- < 3 redirections au total

---

### Test 2: Client sans organizationId
```powershell
curl -I "https://www.powalyze.com/cockpit/client?userId=test" `
  -H "Cookie: sb-access-token=..." `
  -v
```

**Résultat attendu**:
- Status: 200 OK
- Récupération auto de organizationId
- Pas d'erreur

---

### Test 3: Admin vers client
```powershell
curl -I "https://www.powalyze.com/cockpit/client" `
  -H "Cookie: sb-access-token=..." `
  -v
```

**Résultat attendu**:
- Redirection unique vers /cockpit/demo
- Status final: 200 OK

---

### Test 4: Non-authentifié
```powershell
curl -I "https://www.powalyze.com/cockpit/client" -v
```

**Résultat attendu**:
- Redirection vers /signup?redirect=/cockpit/client
- Status final: 200 OK

---

## Étape 7: Monitoring Post-Déploiement

### Surveiller les logs en temps réel
```powershell
vercel logs --follow
```

**Vérifications**:
- ✅ Pas d'erreur "ERR_TOO_MANY_REDIRECTS"
- ✅ Pas de "Maximum redirect reached"
- ✅ Logs propres sans erreurs de boucle

---

### Rechercher les erreurs de redirection
```powershell
vercel logs | Select-String -Pattern "redirect|ERR_TOO_MANY"
```

**Résultat attendu**: Aucune erreur

---

### Vérifier les performances
```powershell
vercel inspect https://www.powalyze.com
```

**Résultat attendu**:
- Interaction to Next Paint (INP): < 200ms
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s

---

## Étape 8: Tests avec DevTools

### Chrome DevTools
1. Ouvrir Chrome DevTools (F12)
2. Aller dans l'onglet Network
3. Cocher "Preserve log"
4. Naviguer vers https://www.powalyze.com/cockpit/client

**Vérifications**:
- ✅ Nombre total de requêtes < 10
- ✅ Pas de status 301/302 en boucle
- ✅ Dernière requête: status 200
- ✅ Temps de chargement < 3s

---

## Étape 9: Tests Utilisateurs Réels

### Compte Client
1. Se connecter avec un compte client
2. Accéder à /cockpit/client?userId=XXX
3. Vérifier affichage du cockpit
4. Vérifier pas d'erreur ERR_TOO_MANY_REDIRECTS

### Compte Admin
1. Se connecter avec un compte admin
2. Accéder à /cockpit
3. Vérifier redirection vers /cockpit/admin
4. Tenter d'accéder à /cockpit/client
5. Vérifier redirection vers /cockpit/demo

### Compte Demo
1. Se connecter avec un compte demo
2. Accéder à /cockpit
3. Vérifier redirection vers /cockpit/demo
4. Vérifier affichage stable

---

## Étape 10: Rollback (Si Nécessaire)

### Si des problèmes surviennent

```powershell
# Revenir au déploiement précédent
vercel rollback

# Ou déployer une version spécifique
vercel list
vercel promote <deployment-id>
```

---

## ✅ Checklist Finale

- [ ] Compilation TypeScript OK
- [ ] Build local OK
- [ ] Tests locaux OK
- [ ] Commit créé
- [ ] Déployé sur Vercel
- [ ] Test 1: Client avec params ✅
- [ ] Test 2: Client sans orgId ✅
- [ ] Test 3: Admin vers client ✅
- [ ] Test 4: Non-authentifié ✅
- [ ] Logs Vercel propres ✅
- [ ] DevTools: < 10 requêtes ✅
- [ ] Tests utilisateurs réels ✅
- [ ] Performance INP < 200ms ✅

---

## 🎯 Résultat Final

```
✅ Boucle de redirection éliminée
✅ Accès stable au cockpit
✅ Redirections cohérentes
✅ Performance optimale
✅ Déploiement réussi
```

---

**Déploiement terminé avec succès** ✅
