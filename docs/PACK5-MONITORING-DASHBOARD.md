# PACK 5 — Monitoring Dashboard Guide

**Powalyze - Post-Release Monitoring**  
**Version** : 1.0.0  
**Date** : 29 janvier 2026

---

## 📊 VUE D'ENSEMBLE

Dashboard de monitoring **48h post-release** pour surveiller métriques critiques et détecter incidents.

### Objectifs
- ✅ Détecter incidents rapidement (< 5 min)
- ✅ Surveiller métriques clés (uptime, latence, erreurs)
- ✅ Alerter équipe automatiquement
- ✅ Garantir stabilité release

---

## 🎯 MÉTRIQUES CRITIQUES

### 1. Uptime (Disponibilité)
**Seuil** : > 99.9%  
**Alerte si** : < 99.9%  
**Source** : Vercel Analytics

**Comment suivre** :
```
Vercel Dashboard > Analytics > Overview > Uptime
```

**Actions si alerte** :
1. Vérifier Vercel status : https://vercel.com/status
2. Vérifier logs : `vercel logs [project] --since 1h`
3. Si downtime > 5 min : Déclencher rollback

---

### 2. Latence (Performance)
**Seuil P95** : < 300ms  
**Alerte si** : > 500ms  
**Source** : Vercel Analytics

**Comment suivre** :
```
Vercel Dashboard > Analytics > Performance > Latency (P95)
```

**Actions si alerte** :
1. Identifier pages lentes
2. Vérifier requêtes Supabase (slow queries)
3. Vérifier build size (bundle trop gros ?)
4. Si latence > 3s : Rollback

---

### 3. Taux d'Erreur
**Seuil** : < 1%  
**Alerte si** : > 5%  
**Source** : Vercel Analytics + Logs

**Comment suivre** :
```
Vercel Dashboard > Analytics > Overview > Error Rate
```

**Actions si alerte** :
1. Consulter logs : `vercel logs [project] --since 1h`
2. Identifier type d'erreurs (500, 401, 404, etc.)
3. Vérifier Supabase (RLS, SQL errors)
4. Si taux d'erreur > 10% : Rollback immédiat

---

### 4. INP (Interaction to Next Paint)
**Seuil** : < 200ms  
**Alerte si** : > 300ms  
**Source** : Vercel Speed Insights

**Comment suivre** :
```
Vercel Dashboard > Speed Insights > INP
```

**Actions si alerte** :
1. Identifier pages avec INP élevé
2. Vérifier JavaScript (bundle size, interactions)
3. Optimiser si nécessaire (suivre release)

---

### 5. Requêtes Supabase
**Seuil erreurs** : 0  
**Alerte si** : > 10 erreurs/heure  
**Source** : Supabase Dashboard

**Comment suivre** :
```
Supabase Dashboard > Logs > SQL Logs > Filter: level=error
```

**Actions si alerte** :
1. Identifier requêtes échouées
2. Vérifier RLS policies (violations ?)
3. Vérifier structure données (foreign keys, constraints)
4. Fix urgent si bloquant users

---

## 🚨 ALERTES AUTOMATIQUES

### Configuration Vercel
1. Aller dans **Vercel Dashboard > Settings > Notifications**
2. Activer alertes :
   - ✅ Deployment failures
   - ✅ Build errors
   - ✅ High error rate (> 5%)
   - ✅ Downtime (> 1 min)

3. Configurer channels :
   - Email : release-manager@powalyze.com
   - Slack : #incidents
   - SMS (optionnel) : Pour P1 uniquement

### Configuration Supabase
1. Aller dans **Supabase Dashboard > Project Settings > Alerts**
2. Activer alertes :
   - ✅ SQL errors (> 10/hour)
   - ✅ Slow queries (> 1s)
   - ✅ RLS violations (> 5)
   - ✅ Connection pool exhausted

3. Configurer notifications :
   - Email : devops@powalyze.com
   - Slack webhook : #incidents

---

## 📈 DASHBOARD TEMPS RÉEL

### Vercel Analytics (Real-time)

**URL** : https://vercel.com/powalyzes-projects/powalyze-v2/analytics

**Métriques à surveiller** :
| Métrique | Intervalle | Action |
|----------|------------|--------|
| Uptime | Temps réel | Alerte si < 100% |
| Requests/min | Temps réel | Spike = problème potentiel |
| Error rate | Temps réel | Alerte si > 1% |
| P95 latency | Temps réel | Alerte si > 500ms |

**Check points obligatoires** :
- [ ] +15 min post-release
- [ ] +1h post-release
- [ ] +6h post-release
- [ ] +24h post-release
- [ ] +48h post-release

---

### Supabase Dashboard (Real-time)

**URL** : https://supabase.com/dashboard/project/[project-id]

**Métriques à surveiller** :
| Métrique | Intervalle | Action |
|----------|------------|--------|
| SQL errors | 15 min | Alerte si > 5 |
| Slow queries | 15 min | Investigate si > 3 |
| RLS violations | 15 min | Check policies |
| Active connections | 15 min | Max 50 (pool limit) |

**Logs importants** :
```sql
-- Erreurs récentes (dernière heure)
SELECT * FROM logs 
WHERE level = 'error' 
AND created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Slow queries (> 1s)
SELECT query, execution_time
FROM pg_stat_statements
WHERE execution_time > 1000
ORDER BY execution_time DESC;
```

---

## 📞 ESCALATION MATRIX

### P1 : Incident Critique (Downtime > 5 min ou Taux erreur > 10%)
**Délai** : Immédiat

1. **Alerter équipe** : Slack #incidents + SMS
2. **Déclencher rollback** : `.\scripts\rollback.ps1`
3. **Notify Release Manager** : Immédiat
4. **Communication users** : Email si downtime > 5 min
5. **Post-mortem** : Créer dans les 24h

**Channel Slack** : #incidents  
**Template message** :
```
🚨 INCIDENT P1 🚨

Severity: CRITICAL
Start time: [HH:MM]
Impact: [Downtime / Error rate]

Symptoms:
[Description]

Actions:
- [ ] Rollback initiated
- [ ] Release Manager notified
- [ ] Users communication sent

Monitoring: [Vercel/Supabase link]
```

---

### P2 : Incident Majeur (Latence > 3s ou Erreurs > 5%)
**Délai** : < 1h

1. **Alerter DevOps + VB** : Slack #releases
2. **Investigate** : Logs Vercel + Supabase
3. **Fix or Rollback** : Décision avec Release Manager
4. **Monitor closely** : Check toutes les 15 min

---

### P3 : Incident Mineur (Warnings, optimizations)
**Délai** : < 4h

1. **Log issue** : Créer ticket
2. **Plan fix** : Prochain sprint
3. **Monitor** : Check daily

---

## 🛠️ OUTILS DE MONITORING

### 1. Vercel CLI
```bash
# Logs temps réel
vercel logs [project] --follow

# Logs dernière heure
vercel logs [project] --since 1h

# Logs avec filtre erreurs
vercel logs [project] --since 1h | Select-String -Pattern "error|Error|ERROR"
```

### 2. Supabase CLI (optionnel)
```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Voir logs
supabase logs --project-id [project-id]
```

### 3. Browser DevTools
- **Network tab** : Latence requêtes API
- **Console** : Erreurs JavaScript
- **Performance** : INP, LCP, CLS

### 4. Lighthouse CI (optionnel)
```bash
# Audit performance post-release
npm install -g @lhci/cli

lhci autorun --url="https://www.powalyze.com"
```

---

## 📊 CHECKLIST MONITORING 48H

### Heure +15 min
- [ ] Vercel Analytics : Uptime 100% ?
- [ ] Vercel Analytics : Error rate < 1% ?
- [ ] Vercel Analytics : Latency P95 < 300ms ?
- [ ] Supabase Logs : Aucune erreur SQL ?
- [ ] Smoke tests : 3 routes critiques OK ?

### Heure +1h
- [ ] Même checklist que +15 min
- [ ] Tickets support : Volume normal ?
- [ ] Users feedback : Pas de plaintes ?

### Heure +6h
- [ ] Métriques stables depuis 6h ?
- [ ] Aucun incident P1/P2 ?
- [ ] Équipe peut se reposer (standby réduit)

### Heure +24h
- [ ] Uptime 24h : > 99.9% ?
- [ ] Métriques moyennes : Conformes ?
- [ ] Tickets support : Volume acceptable ?
- [ ] Rapport 24h : Créé et partagé

### Heure +48h
- [ ] Uptime 48h : > 99.9% ?
- [ ] Aucun incident majeur ?
- [ ] Monitoring report final : Créé
- [ ] Post-mortem (si incident) : Créé
- [ ] Release stable : ✅ Confirmé

---

## 📝 RAPPORT DE MONITORING

### Template quotidien (24h + 48h)

```markdown
# Monitoring Report - [Date]

**Release** : Version [X.Y.Z]  
**Période** : [HH:MM] - [HH:MM] (24h)

## Métriques
- Uptime : [%]
- Latence P95 : [ms]
- Error rate : [%]
- INP médian : [ms]

## Incidents
- P1 : [0] ou [Liste]
- P2 : [0] ou [Liste]
- P3 : [0] ou [Liste]

## Tickets support
- Volume : [nombre] ([normal/élevé])
- Nature : [questions/bugs]

## Actions prises
- [Action 1]
- [Action 2]

## Status : ✅ STABLE / ⚠️ ATTENTION / ❌ UNSTABLE
```

**Envoyer à** :
- Release Manager
- DevOps team
- VB team
- Support team

**Channels** :
- Email : team@powalyze.com
- Slack : #releases

---

## 🎯 CRITÈRES DE SUCCÈS

### Release stable si :
- ✅ Uptime 48h > 99.9%
- ✅ Taux d'erreur 48h < 1%
- ✅ Latence P95 stable (< 300ms)
- ✅ INP < 200ms
- ✅ Aucun incident P1
- ✅ Tickets support : Volume normal
- ✅ Users feedback : Positif

### Release à surveiller si :
- ⚠️ Incidents P2 résolus mais récurrents
- ⚠️ Métriques dégradées mais acceptables
- ⚠️ Volume tickets support élevé

### Release instable si :
- ❌ Incidents P1 multiples
- ❌ Downtime cumulé > 10 min
- ❌ Taux d'erreur > 5%
- ❌ Rollback requis

---

## 🔗 LIENS UTILES

### Dashboards
- **Vercel Analytics** : https://vercel.com/powalyzes-projects/powalyze-v2/analytics
- **Supabase Dashboard** : https://supabase.com/dashboard
- **Vercel Logs** : https://vercel.com/powalyzes-projects/powalyze-v2/logs
- **Status Page** (si configuré) : https://status.powalyze.com

### Documentation
- **Vercel Monitoring** : https://vercel.com/docs/analytics
- **Supabase Monitoring** : https://supabase.com/docs/guides/platform/logs
- **Web Vitals** : https://web.dev/vitals/

### Communication
- **Slack #incidents** : Incidents P1/P2
- **Slack #releases** : Updates réguliers
- **Email** : team@powalyze.com

---

## ✅ FORMATION MONITORING

### Pré-requis
1. [ ] Accès Vercel Dashboard
2. [ ] Accès Supabase Dashboard
3. [ ] Accès Slack #incidents + #releases
4. [ ] Vercel CLI installé
5. [ ] Scripts monitoring téléchargés

### Formation (1h)
1. **Tour des dashboards** (15 min)
   - Vercel Analytics
   - Supabase Logs
   - Slack channels

2. **Identifier incidents** (15 min)
   - Reconnaître patterns
   - Interpréter métriques
   - Utiliser filters/search

3. **Réagir aux incidents** (15 min)
   - Escalation matrix
   - Rollback procedure
   - Communication templates

4. **Practice** (15 min)
   - Simuler incident
   - Exercice rollback (staging)
   - Rédiger rapport

---

## 🚀 PRÊT POUR MONITORING

**Checklist finale** :
- [ ] Dashboards accessibles
- [ ] Alertes configurées
- [ ] Équipe briefée
- [ ] Escalation matrix imprimée
- [ ] Scripts testés
- [ ] Communication templates prêts

**Go/No-Go** : ✅ / ❌

---

**Version** : 1.0.0  
**Dernière mise à jour** : 29/01/2026  
**Monitoring Manager** : [Nom]

---

_Powalyze Monitoring - Stay alert, stay stable_ 🚨
