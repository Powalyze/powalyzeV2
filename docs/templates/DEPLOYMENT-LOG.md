# Deployment Log - Version [X.Y.Z]

**Date** : [JJ/MM/AAAA HH:MM]  
**DevOps Engineer** : [Nom]  
**Branch déployée** : `feature/pack-[X]-[description]`  
**Commit** : `[hash]`

---

## 📋 Pre-Deployment Checklist

### Environnement vérifié
- [ ] Variables d'environnement Vercel configurées
- [ ] `NEXT_PUBLIC_SUPABASE_URL` : ✅
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` : ✅
- [ ] `SUPABASE_SERVICE_ROLE_KEY` : ✅
- [ ] `OPENAI_API_KEY` ou Azure OpenAI : ✅
- [ ] `JWT_SECRET` : ✅

### Code vérifié
- [ ] Build local réussi
- [ ] TypeScript : 0 erreurs
- [ ] Tests unitaires : [X/Y] passent
- [ ] QA Report : ✅ PASS

---

## 🗄️ Migrations Supabase

### Backup pré-migration
```bash
# Timestamp : [AAAA-MM-JJ HH:MM:SS]
# Method : Supabase Dashboard > Database > Backup
# Status : ✅ Backup créé
```

### Migrations à appliquer
#### Migration 1 : [Titre]
```sql
-- Fichier : database/[nom-fichier].sql
-- Description : [Description migration]
-- Tables affectées : [liste tables]

[SQL code ici]
```
**Status** : ✅ Appliquée / ❌ Échec  
**Durée** : [X]s  
**Rows affectées** : [nombre]

#### Migration 2 : [Titre]
```sql
[SQL code]
```
**Status** : ✅ Appliquée / ❌ Échec

### Vérification post-migration
- [ ] Tables créées : [liste]
- [ ] Colonnes ajoutées : [liste]
- [ ] Indexes créés : [liste]
- [ ] Triggers actifs : [liste]
- [ ] RLS activé sur toutes les tables : ✅

### Tests isolation RLS
```sql
-- Test 1 : User A voit uniquement ses données
-- [Résultat]

-- Test 2 : User B voit uniquement ses données
-- [Résultat]

-- Test 3 : Pas de leakage entre organizations
-- [Résultat]
```
**Status** : ✅ OK / ❌ Problème détecté

---

## 🛠️ Build Production

### Build local (pre-flight check)
```bash
npm run build
```
**Durée** : [X.X]s  
**Status** : ✅ Success / ❌ Failed  
**TypeScript errors** : [0]  
**Routes generated** : [nombre]

### Output
```
[Copier output build ici]
```

---

## 🚀 Déploiement Staging

### Merge vers staging
```bash
git checkout staging
git merge feature/pack-[X]-[description]
git push origin staging
```
**Commit** : `[hash]`  
**Status** : ✅ Success

### Déploiement Vercel (staging)
```bash
vercel --prod --yes
```
**URL staging** : [https://staging.powalyze.com]  
**Deployment ID** : [ID Vercel]  
**Durée** : [X]s  
**Status** : ✅ Success / ❌ Failed

### Output Vercel
```
[Copier output deployment ici]
```

---

## 🧪 Tests Smoke (Staging)

### Routes critiques
| Route | Status | Response Time | Notes |
|-------|--------|---------------|-------|
| `/` (homepage) | ✅/❌ | [X]ms | |
| `/login` | ✅/❌ | [X]ms | |
| `/cockpit` | ✅/❌ | [X]ms | |
| `/api/auth/login` | ✅/❌ | [X]ms | |
| `/api/cockpit/projects` | ✅/❌ | [X]ms | |

### Tests fonctionnels
- [ ] Login fonctionne : ✅/❌
- [ ] Cockpit DEMO accessible : ✅/❌
- [ ] Cockpit LIVE accessible (si configuré) : ✅/❌
- [ ] API répond correctement : ✅/❌
- [ ] Données Supabase accessibles : ✅/❌

### Logs Vercel (staging)
```
[Copier logs pertinents ici]
```

### Logs Supabase (staging)
```
[Copier logs SQL pertinents ici]
```

---

## ✅ Release Manager Approval

### Validation staging
- **Date validation** : [JJ/MM/AAAA HH:MM]
- **Validé par** : [Nom Release Manager]
- **Approval** : ✅ GO PRODUCTION / ❌ NO-GO

### Commentaires Release Manager
```
[Commentaires ici]
```

---

## 🚀 Déploiement Production

### Pre-production checklist
- [ ] Approval Release Manager reçu
- [ ] Staging validé (smoke tests OK)
- [ ] Documentation prête
- [ ] Support team briefée
- [ ] Monitoring configuré

### Merge vers main
```bash
git checkout main
git merge staging
git push origin main
```
**Commit** : `[hash]`  
**Status** : ✅ Success

### Déploiement Vercel (production)
```bash
vercel --prod --yes
```
**URL production** : [https://www.powalyze.com]  
**Deployment ID** : [ID Vercel]  
**Durée** : [X]s  
**Status** : ✅ Success / ❌ Failed

### Output Vercel
```
[Copier output deployment ici]
```

---

## 🧪 Tests Smoke (Production)

### Routes critiques
| Route | Status | Response Time | Notes |
|-------|--------|---------------|-------|
| `/` (homepage) | ✅/❌ | [X]ms | |
| `/login` | ✅/❌ | [X]ms | |
| `/cockpit` | ✅/❌ | [X]ms | |
| `/api/auth/login` | ✅/❌ | [X]ms | |
| `/api/cockpit/projects` | ✅/❌ | [X]ms | |

### Tests fonctionnels
- [ ] Login fonctionne : ✅/❌
- [ ] Cockpit DEMO accessible : ✅/❌
- [ ] Cockpit LIVE accessible : ✅/❌
- [ ] API répond correctement : ✅/❌
- [ ] Données Supabase accessibles : ✅/❌

---

## 📊 Monitoring Initial

### Métriques Vercel (premières 15 minutes)
| Métrique | Valeur | Seuil | Status |
|----------|--------|-------|--------|
| Uptime | [%] | > 99% | ✅/❌ |
| Latence moyenne | [X]ms | < 300ms | ✅/❌ |
| Taux d'erreur | [%] | < 1% | ✅/❌ |
| Requêtes/min | [X] | - | ✅ |

### Logs Production (premières 15 minutes)
```
[Copier logs pertinents ici]
```

### Alertes
- [ ] Aucune alerte déclenchée : ✅
- [ ] Alertes déclenchées : ❌ [Détails]

---

## 🔄 Rollback Plan

### Trigger rollback si :
- ❌ Downtime > 5 min
- ❌ Taux d'erreur > 10%
- ❌ Latence moyenne > 3s
- ❌ Incident critique détecté

### Procédure rollback
```bash
# 1. Revert deployment Vercel
vercel rollback [deployment-id]

# 2. Revert migrations Supabase (si applicable)
# Exécuter SQL rollback script

# 3. Clear cache
# [Commands]

# 4. Notify team
# Slack #incidents
```

---

## 📝 Post-Deployment Notes

### Problèmes rencontrés
- [Problème 1] : [Solution]
- [Problème 2] : [Solution]

### Optimisations futures
- 💡 [Optimisation 1]
- 💡 [Optimisation 2]

### Points d'attention
- ⚠️ [Point 1]
- ⚠️ [Point 2]

---

## ✅ Checklist Finale

- [ ] Build production : ✅ Success
- [ ] Migrations Supabase : ✅ Appliquées
- [ ] Staging déployé : ✅ Fonctionnel
- [ ] Approval Release Manager : ✅ Reçu
- [ ] Production déployée : ✅ Fonctionnel
- [ ] Tests smoke production : ✅ OK
- [ ] Monitoring actif : ✅ Configuré
- [ ] Rollback plan : ✅ Prêt

---

## ✍️ Signature

**DevOps Engineer** : [Nom]  
**Date déploiement** : [JJ/MM/AAAA HH:MM]  
**Status final** : ✅ SUCCESS / ⚠️ SUCCESS WITH WARNINGS / ❌ FAILED

---

## 🔗 Liens Utiles

- **Vercel Dashboard** : [URL]
- **Supabase Dashboard** : [URL]
- **Monitoring Dashboard** : [URL]
- **Deployment URL** : https://www.powalyze.com
- **Staging URL** : [URL]

---

**Dernière mise à jour** : [JJ/MM/AAAA HH:MM]
