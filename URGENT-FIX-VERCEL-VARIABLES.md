# 🚨 CORRECTION URGENTE - VARIABLES VERCEL PRODUCTION

**PROBLÈME**: La production utilise encore l'ancienne URL Supabase invalide.

---

## ⚡ CORRECTION RAPIDE (5 minutes)

### Étape 1: Ouvrir les variables d'environnement Vercel
🔗 **Lien direct**: https://vercel.com/powalyzes-projects/powalyze-v2/settings/environment-variables

### Étape 2: Supprimer les anciennes variables

Chercher et **SUPPRIMER** ces variables pour l'environnement **Production**:
- ❌ `NEXT_PUBLIC_SUPABASE_URL` (ancien: pqsgdwfsdnmozzoynefw)
- ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ancien)

**Comment supprimer:**
1. Cliquer sur les 3 points `...` à droite de la variable
2. Cliquer sur "Delete"
3. Confirmer

### Étape 3: Ajouter les nouvelles variables

Cliquer sur "Add New" et ajouter **pour Production**:

#### Variable 1:
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://phfeteiholkfiredgero.supabase.co
Environment: Production
```

#### Variable 2:
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZmV0ZWlob2xrZmlyZWRnZXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NjkwMzgsImV4cCI6MjA4MDU0NTAzOH0.ktSkQoksSUkWx_TmAJLa299Cg1lPyLwJvgh4EbV4qXM
Environment: Production
```

### Étape 4: Redéployer

**Option A - Redéploiement automatique:**
1. Aller sur: https://vercel.com/powalyzes-projects/powalyze-v2
2. Cliquer sur le dernier déploiement
3. Cliquer sur les 3 points `...`
4. Cliquer sur "Redeploy"
5. Confirmer

**Option B - Via CLI (si ça refonctionne):**
```powershell
npx vercel --prod --yes
```

---

##  VÉRIFICATION POST-DÉPLOIEMENT

Après le redéploiement (attendez 2-3 minutes), testez:

```powershell
# Test 1: Configuration Supabase
Invoke-WebRequest "https://www.powalyze.com/api/debug/check-keys" | ConvertFrom-Json

# Doit afficher:
# supabase_url.value = "https://phfeteiholkfiredgero.s..."
# supabase_url.valid = true
```

```powershell
# Test 2: Page Login
Invoke-WebRequest "https://www.powalyze.com/login"
# Doit retourner HTTP 200
```

---

## 📊 ÉTAT ACTUEL

| Environnement | URL Supabase | Statut |
|---------------|--------------|--------|
| **Local (.env.local)** | ✅ phfeteiholkfiredgero | ✅ OK |
| **GitHub (code)** | ✅ phfeteiholkfiredgero | ✅ OK |
| **Vercel (variables)** | ❌ pqsgdwfsdnmozzoynefw | ❌ **À CORRIGER** |
| **Production (runtime)** | ❌ pqsgdwfsdnmozzoynefw | ❌ Broken |

---

## ⚠️ IMPACT

**Tant que les variables Vercel ne sont pas corrigées:**
- ❌ Login en production ne fonctionne pas (Failed to fetch)
- ❌ Signup ne fonctionne pas
- ❌ Toutes les requêtes Supabase échouent
- ✅ Le site reste accessible (mode démo possible)

---

## 📞 SUPPORT

Si problème persistant:
1. Vérifier que les variables sont bien dans l'environnement **Production** (pas Preview/Development)
2. S'assurer que le redéploiement est terminé
3. Vider le cache du navigateur (Ctrl+Shift+Delete)

---

**✅ Une fois les variables corrigées sur Vercel, tout fonctionnera!**
