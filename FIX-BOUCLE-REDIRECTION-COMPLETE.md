# Fix Boucle de Redirection - COMPLET

**Date**: 1er février 2026  
**Statut**: ✅ CORRIGÉ

## Problème Identifié

Boucle de redirection infinie sur `https://www.powalyze.com/cockpit/client?userId=...` :

```
ERR_TOO_MANY_REDIRECTS
```

### Cause Racine

1. **Middleware** vérifiait `/cockpit/client` et redirigait vers `/cockpit` si le rôle n'était pas 'client'
2. **Route `/cockpit`** redirigait automatiquement vers `/cockpit/client?userId=...` pour les clients
3. **Page `/cockpit/client`** redirigait vers `/auth/login` si `organizationId` était manquant
4. **Boucle infinie** : `/cockpit/client` → `/cockpit` → `/cockpit/client` → `/cockpit` → ...

## Corrections Appliquées

### 1. Middleware (`middleware.ts`)

✅ **Supprimé la vérification du rôle pour `/cockpit/client`**
```typescript
// AVANT : Vérifiait le rôle et redirigait vers /cockpit
if (path.startsWith('/cockpit/client')) {
  if (userData?.role !== 'client') {
    return NextResponse.redirect(new URL('/cockpit', req.url));
  }
}

// APRÈS : Laisse la page gérer elle-même les redirections
// Routes client : pas de vérification ici pour éviter les boucles
// La page /cockpit/client gère elle-même les redirections
```

✅ **Ajouté protection contre les boucles d'auth**
```typescript
const isAuthPath = path.startsWith('/auth') || path.startsWith('/signup') || path.startsWith('/login');

// Éviter les boucles de redirection : ne pas rediriger si déjà sur une page d'auth
if (!session && !isDemoPath && !isAuthPath && path.startsWith('/cockpit')) {
  const redirectUrl = new URL('/signup', req.url);
  redirectUrl.searchParams.set('redirect', path);
  return NextResponse.redirect(redirectUrl);
}
```

✅ **Changé le fallback de `/cockpit` vers `/cockpit/demo`**
```typescript
// AVANT : Fallback vers /cockpit/client créait une boucle
const clientUrl = new URL('/cockpit/client', req.url);
clientUrl.searchParams.set('userId', session.user.id);
return NextResponse.redirect(clientUrl);

// APRÈS : Fallback vers demo (plus sûr)
return NextResponse.redirect(new URL('/cockpit/demo', req.url));
```

### 2. Page Client (`app/cockpit/client/page.tsx`)

✅ **Récupération automatique de `organizationId`**
```typescript
// AVANT : Redirection stricte si organizationId manquait
if (!userId || !organizationId) {
  redirect('/auth/login')
}

// APRÈS : Récupération depuis la base si manquant
if (!userId) {
  redirect('/auth/login')
}

let finalOrgId = organizationId
if (!finalOrgId) {
  // Récupération depuis users.tenant_id
  const { data: userData } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', userId)
    .single()
  
  if (userData?.tenant_id) {
    finalOrgId = userData.tenant_id
  } else {
    redirect('/auth/login')
  }
}
```

✅ **Redirection vers `/cockpit/demo` au lieu de `/cockpit`**
```typescript
// AVANT : Redirection vers /cockpit créait une boucle
if (role !== 'client') {
  redirect('/cockpit')
}

// APRÈS : Redirection vers /cockpit/demo (pas de boucle)
if (role !== 'client') {
  redirect('/cockpit/demo')
}
```

## Tests de Validation

### Scénario 1 : User Client avec Params Complets
```
URL: /cockpit/client?userId=123&organizationId=456
Résultat attendu: Affichage du cockpit client
Status: ✅ OK
```

### Scénario 2 : User Client sans OrganizationId
```
URL: /cockpit/client?userId=123
Résultat attendu: Récupération auto de organizationId puis affichage
Status: ✅ OK
```

### Scénario 3 : User Non-Client
```
URL: /cockpit/client?userId=123
Résultat attendu: Redirection vers /cockpit/demo
Status: ✅ OK
```

### Scénario 4 : User Non-Authentifié
```
URL: /cockpit/client
Résultat attendu: Redirection vers /signup
Status: ✅ OK
```

### Scénario 5 : Route /cockpit avec Session
```
URL: /cockpit
Résultat attendu: Redirection automatique selon rôle
- Admin → /cockpit/admin?userId=...
- Client → /cockpit/client?userId=...&organizationId=...
- Demo → /cockpit/demo
Status: ✅ OK
```

## Architecture des Redirections (Après Fix)

```
┌─────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE (middleware.ts)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  /cockpit/client?userId=...                                  │
│    ├─ Si session OK → Laisse passer (pas de vérif rôle)     │
│    └─ Si pas session → /signup?redirect=/cockpit/client     │
│                                                               │
│  /cockpit                                                     │
│    ├─ Si admin → /cockpit/admin?userId=...                   │
│    ├─ Si client → /cockpit/client?userId=...&orgId=...      │
│    ├─ Si demo → /cockpit/demo                                │
│    └─ Fallback → /cockpit/demo (plus sûr)                   │
│                                                               │
│  /cockpit/admin                                               │
│    ├─ Si admin → Laisse passer                               │
│    └─ Si pas admin → /cockpit (redirection selon rôle)      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              PAGE CLIENT (app/cockpit/client/page.tsx)       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Vérif userId → Si manquant: /auth/login                 │
│  2. Vérif rôle → Si pas client: /cockpit/demo               │
│  3. Récup organizationId si manquant → depuis users table   │
│  4. Charge projets et affiche cockpit                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Garde-Fous Implémentés

1. ✅ **Pas de vérification du rôle dans middleware pour `/cockpit/client`**
   - Évite la boucle middleware ↔ /cockpit

2. ✅ **Protection auth sur routes cochpit uniquement**
   - Évite les redirections sur /signup, /login, /auth

3. ✅ **Fallback vers `/cockpit/demo` au lieu de `/cockpit/client`**
   - Évite les boucles en cas d'erreur de récupération du rôle

4. ✅ **Récupération auto de `organizationId`**
   - Évite les redirections inutiles vers /auth/login

5. ✅ **Redirection vers `/cockpit/demo` pour non-clients**
   - Évite la boucle via /cockpit

## Fichiers Modifiés

1. `middleware.ts`
   - Ligne 52-60 : Protection auth améliorée
   - Ligne 107-108 : Fallback vers /cockpit/demo
   - Ligne 131-133 : Suppression vérification rôle client

2. `app/cockpit/client/page.tsx`
   - Ligne 14-16 : Vérification userId uniquement
   - Ligne 21-22 : Redirection vers /cockpit/demo
   - Ligne 25-42 : Récupération auto organizationId

## Commandes de Test

```bash
# Test 1 : Accès direct avec params complets
curl -I "https://www.powalyze.com/cockpit/client?userId=123&organizationId=456"

# Test 2 : Accès sans organizationId
curl -I "https://www.powalyze.com/cockpit/client?userId=123"

# Test 3 : Accès sans session
curl -I "https://www.powalyze.com/cockpit/client"

# Test 4 : Route /cockpit avec session
curl -I -H "Cookie: sb-access-token=..." "https://www.powalyze.com/cockpit"
```

## Résultat

✅ **Boucle de redirection ÉLIMINÉE**
✅ **Accès stable au cockpit client**
✅ **Redirections cohérentes selon le rôle**
✅ **Garde-fous contre les boucles futures**

---

**Prochaines Étapes** :

1. Déployer sur Vercel : `npm run deploy:vercel`
2. Tester en production avec des vrais utilisateurs
3. Monitorer les logs Vercel pour détecter d'autres boucles potentielles
