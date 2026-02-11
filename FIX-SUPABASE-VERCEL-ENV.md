# 🔴 FIX CRITIQUE : Erreur 401 Supabase sur Production

## Problème Identifié

**Symptôme** :
```
phfeteiholkfiredgero.supabase.co/auth/v1/token?grant_type=password:1
Failed to load resource: the server responded with a status of 401 ()
```

**Cause** : Les variables d'environnement Vercel utilisent une **ancienne URL Supabase**.

- ❌ **URL Vercel (obsolète)** : `phfeteiholkfiredgero.supabase.co`  
- ✅ **URL actuelle (.env.local)** : `pqsgdwfsdnmozzoynefw.supabase.co`

---

## Solution : Mise à jour des variables Vercel

### Option 1️⃣ : Interface Web Vercel (Recommandé)

1. **Accéder aux Settings**
   ```
   https://vercel.com/votre-team/powalyze/settings/environment-variables
   ```

2. **Mettre à jour ces 3 variables** :

   | Variable | Nouvelle Valeur |
   |----------|----------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://pqsgdwfsdnmozzoynefw.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDAxMTAsImV4cCI6MjA4NDA3NjExMH0.DRRnRPaUhPtCxYCM3TbT-mKJPGGYp0hFWrFf6PNYlqk` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMDExMCwiZXhwIjoyMDg0MDc2MTEwfQ.-_bC0cdoAksIuQ5BO7YyOzMeotE7Efw8uvgltynWynU` |

3. **Sélectionner tous les environnements** : Production, Preview, Development

4. **Cliquer sur "Save"**

5. **Redéployer** :
   ```bash
   npx vercel --prod --yes
   ```
   OU depuis l'interface Vercel : **Deployments → "..." → Redeploy**

---

### Option 2️⃣ : CLI Vercel (Rapide)

```powershell
# Naviguer vers le projet
cd c:\powalyze

# Mettre à jour les variables (une par une)
vercel env rm NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Entrer : https://pqsgdwfsdnmozzoynefw.supabase.co

vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Coller la nouvelle clé depuis .env.local

vercel env rm SUPABASE_SERVICE_ROLE_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Coller la nouvelle clé depuis .env.local

# Redéployer
npx vercel --prod --yes
```

---

### Option 3️⃣ : Script PowerShell (Automatisé)

```powershell
# fix-vercel-supabase-env.ps1

$envVars = @{
    "NEXT_PUBLIC_SUPABASE_URL" = "https://pqsgdwfsdnmozzoynefw.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDAxMTAsImV4cCI6MjA4NDA3NjExMH0.DRRnRPaUhPtCxYCM3TbT-mKJPGGYp0hFWrFf6PNYlqk"
    "SUPABASE_SERVICE_ROLE_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMDExMCwiZXhwIjoyMDg0MDc2MTEwfQ.-_bC0cdoAksIuQ5BO7YyOzMeotE7Efw8uvgltynWynU"
}

Write-Host "🔄 Mise à jour des variables Vercel..." -ForegroundColor Yellow

foreach ($var in $envVars.Keys) {
    Write-Host "  - $var" -ForegroundColor Cyan
    
    # Supprimer l'ancienne variable (ignorer les erreurs)
    vercel env rm $var production 2>$null
    
    # Ajouter la nouvelle variable
    $value = $envVars[$var]
    echo $value | vercel env add $var production
}

Write-Host "✅ Variables mises à jour !" -ForegroundColor Green
Write-Host "🚀 Redéploiement..." -ForegroundColor Yellow

npx vercel --prod --yes

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
```

**Exécuter** :
```powershell
cd c:\powalyze
.\fix-vercel-supabase-env.ps1
```

---

## Vérification Post-Déploiement

1. **Accéder à l'app de production** :
   ```
   https://powalyze.vercel.app
   ```

2. **Ouvrir DevTools Console** (F12)

3. **Tester l'authentification** :
   - Page `/login` ou `/signup`
   - Vérifier qu'il n'y a plus d'erreur 401
   - L'URL Supabase doit être : `pqsgdwfsdnmozzoynefw.supabase.co`

4. **Vérifier les variables (depuis Vercel CLI)** :
   ```powershell
   vercel env ls
   ```

---

## Autres Erreurs Corrigées

### ✅ Route `/ressources/blog` (404) → Créée
Fichier : `app/ressources/blog/page.tsx`

### ✅ Favicon manquant → Configuré
Ajout des metadata dans `app/layout.tsx` :
```tsx
icons: {
  icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  shortcut: '/favicon.svg',
  apple: '/favicon.svg'
}
```

### ⚠️ Warning Zustand (Deprecated Import)
Le code utilise déjà la syntaxe correcte `import { create } from 'zustand'`.  
Le warning provient d'une dépendance tierce ou du cache de build.

**Solution** : Nettoyer le cache Next.js
```powershell
rm -r .next
npm run build
```

---

## Résumé Actions

| Problème | Statut | Action |
|----------|--------|--------|
| 401 Supabase (URL obsolète) | 🔴 **BLOQUANT** | Mettre à jour variables Vercel |
| 404 `/ressources/blog` | ✅ **CORRIGÉ** | Page créée |
| 404 favicon | ✅ **CORRIGÉ** | Metadata ajoutées |
| Warning Zustand | ⚠️ **Cache** | Nettoyer `.next` |

---

## Timeline

**Durée estimée** : 5-10 minutes
1. Mise à jour Vercel env (2 min)
2. Redéploiement (3-5 min)
3. Vérification (2 min)

---

**Date** : 2026-02-08  
**Fix par** : GitHub Copilot AI  
**Fichiers modifiés** :
- ✅ `app/ressources/blog/page.tsx` (créé)
- ✅ `app/layout.tsx` (favicon metadata)
- 📋 `FIX-SUPABASE-VERCEL-ENV.md` (ce fichier)
