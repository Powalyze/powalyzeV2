# 🔧 FIX CRITIQUE : "Invalid API key"

> ⚠️ **MISE À JOUR 9 FÉVRIER 2026** :  
> Si vous rencontrez "Invalid API key" **au chargement de /login** (avant même la saisie des identifiants),  
> ce problème a été **RÉSOLU** → Voir [FIX-INVALID-API-KEY-RESOLVED.md](FIX-INVALID-API-KEY-RESOLVED.md)  
>   
> Ce fichier traite uniquement des erreurs de **clé OpenAI** (fonctions IA).

---

## 🎯 Problème Identifié

**Symptômes** :
- ✅ Authentification Supabase : OK (401 corrigé via FIX-SUPABASE-VERCEL-ENV.md)
- ❌ Fonctions IA désactivées (narratives, Chief of Staff, Committee Prep)
- 🔴 Clé OpenAI = placeholder : `sk-proj-VOTRE_VRAIE_CLE_ICI`

## 🔍 Vérification Rapide

**Test automatique** :
```bash
# Local
http://localhost:3000/api/debug/check-keys

# Production
https://www.powalyze.com/api/debug/check-keys
```

**Attendu** : `openai_key: { configured: true, valid: true }`

---

## 🚀 SOLUTION EXPRESS

### Pour Développement LOCAL

1. **Obtenir une clé OpenAI** : https://platform.openai.com/api-keys
   - Se connecter/créer un compte
   - "Create new secret key" → Copier (commence par `sk-proj-` ou `sk-`)

2. **Modifier `.env.local`** :
   ```bash
   OPENAI_API_KEY=sk-proj-VOTRE_CLE_REELLE_ICI
   ```

3. **Redémarrer le serveur** :
   ```powershell
   # Ctrl+C pour arrêter
   npm run dev
   ```

4. **Tester** : http://localhost:3000/committee-prep (devrait générer des documents)

---

### Pour Production VERCEL

**Option A : Via Vercel Dashboard (Recommandé)**

1. Aller sur https://vercel.com → Projet → Settings → Environment Variables
2. Ajouter `OPENAI_API_KEY` :
   - Name: `OPENAI_API_KEY`
   - Value: `sk-proj-xxxxx` (votre vraie clé)
   - Environments: ✅ Production, ✅ Preview, ✅ Development
3. **Redéployer** : Deployments → ... → Redeploy

**Option B : Via CLI Vercel**

```powershell
cd c:\powalyze

# Ajouter la clé (pour tous les environnements)
npx vercel env add OPENAI_API_KEY production
# Coller la clé : sk-proj-xxxxx

npx vercel env add OPENAI_API_KEY preview
npx vercel env add OPENAI_API_KEY development

# Redéployer
npx vercel --prod --yes
```

**Option C : Script PowerShell (automatisé)**

```powershell
.\fix-openai-api-key.ps1
# Suivre les instructions interactives
```

---

## 📋 Causes Possibles (Diagnostics Complétés)

### ✅ 1. Supabase Authentication (401) - CORRIGÉ
**Symptôme** : Erreur 401 sur `phfeteiholkfiredgero.supabase.co/auth/v1/token`  
**Solution** : Voir [FIX-SUPABASE-VERCEL-ENV.md](FIX-SUPABASE-VERCEL-ENV.md)

### 🔴 2. OpenAI API Key - ACTUEL
**Symptôme** : Fonctions IA désactivées, placeholder dans `.env.local`  
**Solution** : Configurer une vraie clé OpenAI (voir ci-dessus)

### ⚠️ 3. API Keys Custom (Endpoints `/api/v1/*`)
**Symptôme** : Erreur sur `/api/v1/projects`, `/api/v1/risks`  
**Cause** : Pas de Bearer token dans Authorization header

#### Solution pour API v1 :
1. Se connecter : https://www.powalyze.com/login
2. Paramètres → API → Créer une clé
3. Utiliser dans les requêtes :
   ```bash
   curl -H "Authorization: Bearer pow_xxxxx" \
        https://www.powalyze.com/api/v1/projects
   ```

---

## 🧪 Tests de Validation

### Test 1 : Vérifier toutes les clés
```bash
# Local
curl http://localhost:3000/api/debug/check-keys

# Production
curl https://www.powalyze.com/api/debug/check-keys
```

**Résultat attendu** :
```json
{
  "checks": {
    "supabase_url": { "configured": true, "valid": true },
    "supabase_anon_key": { "configured": true, "valid": true },
    "supabase_service_role_key": { "configured": true, "valid": true },
    "openai_key": { "configured": true, "valid": true, "type": "openai" }
  },
  "recommendations": []
}
```

### Test 2 : Fonctions IA disponibles
```bash
# Committee Prep (génération documents COMEX)
http://localhost:3000/committee-prep

# Chief of Staff (actions stratégiques)
http://localhost:3000/cockpit-live
# Cliquer sur "Chief of Staff Actions"

# Narratives exécutives
# Visible dans les dashboards cockpit
```

### Test 3 : Authentification Supabase
```bash
# Page de login
http://localhost:3000/login

# Créer un compte
http://localhost:3000/signup

# Vérifier la console : aucune erreur 401 Supabase
```

---

## 📊 Résumé des Erreurs et Statuts

| Erreur | Composant | Statut | Documentation |
|--------|-----------|--------|---------------|
| 401 Supabase | Auth | ✅ **CORRIGÉ** | [FIX-SUPABASE-VERCEL-ENV.md](FIX-SUPABASE-VERCEL-ENV.md) |
| Invalid OpenAI Key | IA | 🔴 **À CORRIGER** | Ce fichier |
| Missing Bearer Token | API v1 | ⚠️ **Normal** | Générer une API key |
| 404 `/ressources/blog` | Routing | ✅ **CORRIGÉ** | [app/ressources/blog/page.tsx](app/ressources/blog/page.tsx) |
| 404 favicon | Assets | ✅ **CORRIGÉ** | [app/layout.tsx](app/layout.tsx) |

---

## 🚀 Action Immédiate Recommandée

```powershell
# Option rapide : Script automatisé
cd c:\powalyze
.\fix-openai-api-key.ps1

# Ou manuel : Éditer .env.local
# Remplacer : OPENAI_API_KEY=sk-proj-VOTRE_VRAIE_CLE_ICI
# Par :       OPENAI_API_KEY=sk-proj-<VOTRE_VRAIE_CLE>

# Puis redémarrer
npm run dev
```

---

## 📚 Ressources

- **Obtenir une clé OpenAI** : https://platform.openai.com/api-keys
- **Vercel Environment Variables** : https://vercel.com/docs/environment-variables
- **Supabase API Keys** : https://supabase.com/dashboard → Project Settings → API
- **Documentation complète** : [DEVOPS_GUIDE_PRODUCTION.md](DEVOPS_GUIDE_PRODUCTION.md)

---

**Date** : 2026-02-08  
**Dernière mise à jour** : Diagnostic complet avec priorités  
**Fichiers modifiés** :
- ✅ `FIX-INVALID-API-KEY.md` (ce fichier - guide complet)
- ✅ `fix-openai-api-key.ps1` (script automatisé)
- ✅ `FIX-SUPABASE-VERCEL-ENV.md` (fix 401 Supabase)

