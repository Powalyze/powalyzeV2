# 🔍 Scripts de Vérification Supabase

Ce dossier contient 3 scripts de diagnostic complet de votre configuration Supabase.

## 📁 Fichiers

### 1. `verify-supabase.ps1`
**Script PowerShell** - Tests réseau et endpoints

**Ce qu'il vérifie :**
- ✅ Résolution DNS du domaine Supabase
- ✅ Connectivité HTTPS
- ✅ Endpoint Auth Health
- ✅ Endpoint Auth signInWithPassword
- ✅ Endpoint REST API
- ✅ Endpoint Realtime
- ✅ Latence réseau

**Utilisation :**
```powershell
.\verify-supabase.ps1
```

---

### 2. `verify-supabase.mjs`
**Script Node.js** - Tests programmatiques avec le client officiel

**Ce qu'il vérifie :**
- ✅ Création du client Supabase
- ✅ Fonction signInWithPassword
- ✅ Fonction getSession
- ✅ Endpoint Health via fetch

**Utilisation :**
```bash
node verify-supabase.mjs
```

---

### 3. `verify-supabase-config.sql`
**Script SQL** - Configuration interne Supabase

**Ce qu'il vérifie :**
- ✅ JWT secret configuré
- ✅ Durée de vie des tokens (jwt_exp)
- ✅ URL externe (external_url)
- ✅ Site URL (site_url) pour redirections Auth
- ✅ URLs de redirection autorisées

**Utilisation :**
1. Allez sur le [Supabase SQL Editor](https://supabase.com/dashboard/project/phfeteiholkfiredgero/sql/new)
2. Copiez-collez le contenu de `verify-supabase-config.sql`
3. Cliquez sur "Run"
4. Vérifiez les résultats

**Valeurs attendues :**
```
external_url: https://phfeteiholkfiredgero.supabase.co
site_url: https://powalyze-sigma.vercel.app (ou https://www.powalyze.com)
```

---

## 🎯 Quand utiliser ces scripts ?

### Utilisez ces scripts si :
- ❌ Login échoue avec "Failed to fetch"
- ❌ Erreur "ERR_NAME_NOT_RESOLVED"
- ❌ Redirections Auth cassées
- ❌ Sessions non créées
- ⚠️ Après un changement de projet Supabase
- ⚠️ Après un changement de domaine
- ⚠️ Avant un déploiement majeur

---

## 📊 Résultats du dernier diagnostic

**Date :** 11 février 2026

### ✅ Tests réussis (critiques)
- DNS résolution → OK (104.18.38.10)
- Auth signInWithPassword → OK
- Session getSession → OK
- REST API → OK (200)
- Endpoint Auth token → OK

### ⚠️ Tests partiels (non-critiques)
- Auth Health endpoint → 401 (nécessite apikey dans headers, normal)
- URL racine → 404 (normal, Supabase n'a pas de page d'accueil)
- Realtime → 401 (nécessite authentification, normal)

### 🎯 Conclusion
**Supabase Auth est pleinement fonctionnel** ✅
- URL correcte : `phfeteiholkfiredgero.supabase.co`
- Clés API valides
- Authentification opérationnelle

---

## 🔧 Dépannage

### Problème : "Failed to fetch"
**Causes possibles :**
1. URL Supabase incorrecte dans `.env.local`
2. Projet Supabase supprimé ou suspendu
3. Clés API expirées

**Solution :**
```powershell
# Vérifier les variables
Get-Content .env.local

# Relancer les tests
.\verify-supabase.ps1
node verify-supabase.mjs
```

### Problème : Redirections cassées après login
**Causes possibles :**
1. `site_url` mal configuré dans Supabase
2. URL de redirection non autorisée

**Solution :**
1. Exécutez `verify-supabase-config.sql` dans Supabase Dashboard
2. Allez dans **Authentication → URL Configuration**
3. Ajoutez vos URLs de redirection :
   - `https://powalyze-sigma.vercel.app/auth/callback`
   - `https://www.powalyze.com/auth/callback`
   - `http://localhost:3000/auth/callback` (dev)

### Problème : Tests échouent tous
**Solution :**
1. Vérifiez votre connexion Internet
2. Vérifiez que le projet Supabase existe toujours
3. Allez sur https://supabase.com/dashboard
4. Confirmez que le projet `phfeteiholkfiredgero` est actif

---

## 📝 Notes techniques

### Variables d'environnement utilisées
Les scripts lisent automatiquement ces variables depuis `.env.local` :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Dépendances
- **PowerShell** : Intégré Windows (pas de dépendance)
- **Node.js** : Nécessite `@supabase/supabase-js` (déjà installé dans le projet)
- **SQL** : À exécuter dans Supabase Dashboard (pas d'installation locale)

---

## 🚀 Automation

Pour automatiser ces vérifications dans votre CI/CD :

```yaml
# .github/workflows/test-supabase.yml
name: Verify Supabase
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: node verify-supabase.mjs
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

---

## 📞 Support

Si tous les tests échouent et que vous ne trouvez pas la solution :
1. Vérifiez le [Supabase Status](https://status.supabase.com/)
2. Consultez les logs dans [Supabase Dashboard](https://supabase.com/dashboard/project/phfeteiholkfiredgero/logs/edge-logs)
3. Relisez la documentation [Supabase Auth](https://supabase.com/docs/guides/auth)

---

**Dernière mise à jour :** 11 février 2026  
**Projet :** Powalyze V2  
**Supabase Project ID :** phfeteiholkfiredgero
