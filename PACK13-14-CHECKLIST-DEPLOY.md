# PACK 13 + 14 - CHECKLIST DÉPLOIEMENT
## Synthèse Exécutive + IA Chief of Staff

Date: 11 Janvier 2026
Responsable: DevOps Team
Status: ✅ PRÊT POUR PRODUCTION

---

## ✅ PRÉ-DÉPLOIEMENT

### Code Quality
- [x] Build TypeScript réussi (0 erreurs)
- [x] 163 pages générées
- [x] Aucun warning console
- [x] ESLint validé
- [x] Tests locaux passés
- [x] Git commit clean
- [x] Branch: main (ou production)

### Fichiers Vérifiés
- [x] `database/schema-executive-summary.sql` → SQL valide
- [x] `lib/ai-executive.ts` → Interface complète
- [x] `hooks/useExecutiveSummary.ts` → Hook fonctionnel
- [x] `components/cockpit/ExecutiveSummaryDesktop.tsx` → Component valide
- [x] `components/cockpit/ExecutiveSummaryMobile.tsx` → Component valide
- [x] `components/cockpit/CockpitLive.tsx` → Intégration OK
- [x] `app/api/ai/executive-summary/route.ts` → API endpoint OK

---

## 📦 DÉPLOIEMENT

### 1. Database Migration

**Étape 1.1: Backup Base de Données**
```bash
# Backup avant migration
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql
```
- [ ] Backup créé et vérifié
- [ ] Backup stocké en lieu sûr

**Étape 1.2: Appliquer Schema SQL**
```bash
psql $DATABASE_URL -f database/schema-executive-summary.sql
```
- [ ] Schema appliqué sans erreur
- [ ] Table `executive_summary_cache` créée
- [ ] 3 indexes créés
- [ ] 4 RLS policies activées
- [ ] Fonction `cleanup_expired_executive_summaries()` créée

**Étape 1.3: Vérifications Database**
```sql
-- Vérifier table
SELECT COUNT(*) FROM executive_summary_cache;
-- Attendu: 0 (table vide au départ)

-- Vérifier RLS policies
SELECT * FROM pg_policies WHERE tablename = 'executive_summary_cache';
-- Attendu: 4 policies (SELECT, INSERT, UPDATE, DELETE)

-- Vérifier indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'executive_summary_cache';
-- Attendu: 3 indexes (org, expires, generated)

-- Vérifier fonction cleanup
SELECT routine_name FROM information_schema.routines WHERE routine_name = 'cleanup_expired_executive_summaries';
-- Attendu: 1 ligne
```
- [ ] Table existe et vide
- [ ] 4 RLS policies actives
- [ ] 3 indexes créés
- [ ] Fonction cleanup existe

---

### 2. Environment Variables

**Étape 2.1: Vérifier Variables Locales**
```bash
# .env.local
cat .env.local | grep OPENAI
cat .env.local | grep AZURE_OPENAI
```
- [ ] OpenAI API key présente OU Azure OpenAI configuré

**Étape 2.2: Configurer Vercel Production**

Aller sur https://vercel.com/powalyzes-projects/powalyze-v2/settings/environment-variables

**Option A: OpenAI**
```
OPENAI_API_KEY=sk-proj-xxxxx (Production)
```

**Option B: Azure OpenAI**
```
AZURE_OPENAI_API_KEY=xxxxx (Production)
AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com (Production)
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4 (Production)
```

- [ ] Variables environnement configurées en PROD
- [ ] Redéployé après ajout variables (si nécessaire)

---

### 3. Build & Deploy

**Étape 3.1: Build Local**
```bash
npm run build
```
- [ ] Build réussi
- [ ] 163 pages générées
- [ ] Durée: < 30s
- [ ] Aucune erreur TypeScript

**Étape 3.2: Deploy Vercel**
```bash
npx vercel --prod --yes
```
- [ ] Deploy lancé
- [ ] URL inspect récupérée
- [ ] URL production: https://www.powalyze.com
- [ ] Durée deploy: < 2min

**Étape 3.3: Vérifier Deployment**
```bash
curl -I https://www.powalyze.com
# Attendu: 200 OK

curl -I https://www.powalyze.com/cockpit
# Attendu: 200 OK
```
- [ ] Homepage répond (200 OK)
- [ ] Cockpit répond (200 OK)
- [ ] Pas d'erreur 500

---

## 🧪 TESTS POST-DÉPLOIEMENT

### 4. Tests Fonctionnels

**Test 4.1: Homepage Cockpit**
- [ ] Ouvrir https://www.powalyze.com/cockpit
- [ ] Login avec compte test
- [ ] Synthèse Exécutive affichée (première vue)
- [ ] Icône ✨ "Synthèse Exécutive" visible dans menu
- [ ] Temps chargement < 3s

**Test 4.2: Empty State**
- [ ] Créer nouveau compte organisation
- [ ] Ouvrir cockpit (0 projets)
- [ ] Synthèse onboarding affichée
- [ ] Message: "Votre cockpit est prêt..."
- [ ] 1 recommandation: "Démarrer votre premier projet"
- [ ] 3 quick actions: Créer projet, Ajouter risque, Créer décision

**Test 4.3: Nominal Case**
- [ ] Compte avec 5 projets, 3 risques, 2 décisions
- [ ] Synthèse exécutive générée (3-5 lignes)
- [ ] 4 KPIs affichés correctement
  - [ ] Projets actifs
  - [ ] Risques ouverts
  - [ ] Décisions en attente
  - [ ] Actions IA récentes
- [ ] 3 risques critiques identifiés
- [ ] 3 recommandations actionnables
- [ ] Panel IA avec weak signals (desktop)
- [ ] Temps génération IA: < 10s

**Test 4.4: Desktop Experience**
- [ ] Ouvrir sur écran > 1024px
- [ ] Layout dual-pane (main + IA panel 400px)
- [ ] Panel IA visible à droite
- [ ] 4 sections IA:
  - [ ] Weak signals
  - [ ] Corrélations
  - [ ] Alertes proactives
  - [ ] Suggestions
- [ ] Quick actions grid 3 colonnes
- [ ] Hover effects fonctionnels

**Test 4.5: Mobile Experience**
- [ ] Ouvrir sur smartphone (< 768px)
- [ ] Layout compact
- [ ] KPIs en grid 2x2
- [ ] Button "IA Chief of Staff Insights" visible
- [ ] Tap button → drawer slide-up
- [ ] Drawer:
  - [ ] Backdrop blur visible
  - [ ] Max height 80vh
  - [ ] Close button fonctionnel
  - [ ] 4 sections IA visibles
- [ ] Quick actions grid 2 colonnes

**Test 4.6: Quick Actions**
- [ ] Click "Créer un projet"
  - [ ] Modal création projet s'ouvre
- [ ] Click "Ajouter un risque"
  - [ ] Navigate vers vue risques
- [ ] Click "Créer une décision"
  - [ ] Navigate vers vue décisions
- [ ] Click "Générer un rapport"
  - [ ] Navigate vers vue rapports

**Test 4.7: Cache Behavior**
- [ ] Charger synthèse première fois
- [ ] Recharger page immédiatement
- [ ] Synthèse chargée depuis cache (< 50ms)
- [ ] Click "Actualiser"
- [ ] Nouvelle génération IA (2-5s)
- [ ] Synthèse mise à jour

**Test 4.8: Error Handling**
- [ ] Tester avec OpenAI API timeout simulé
- [ ] Synthèse par défaut affichée
- [ ] Message erreur visible
- [ ] Button "Réessayer" disponible
- [ ] Click "Réessayer" → nouvelle tentative

---

### 5. Tests Techniques

**Test 5.1: API Endpoint**
```bash
curl -X POST https://www.powalyze.com/api/ai/executive-summary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "projects": [],
    "risks": [],
    "decisions": [],
    "timeline": [],
    "reports": []
  }'
```
- [ ] Response 200 OK
- [ ] JSON valide retourné
- [ ] Structure `ExecutiveSummary` complète

**Test 5.2: Database Cache**
```sql
-- Vérifier insertion cache après génération IA
SELECT * FROM executive_summary_cache 
WHERE organization_id = '<ORG_ID>' 
ORDER BY generated_at DESC 
LIMIT 1;
```
- [ ] Cache inséré après génération
- [ ] expires_at = generated_at + 24h
- [ ] summary JSONB valide

**Test 5.3: RLS Security**
```sql
-- Tester isolation tenant
SELECT * FROM executive_summary_cache 
WHERE organization_id != '<CURRENT_ORG_ID>';
```
- [ ] Résultat vide (RLS bloque accès autres orgs)

**Test 5.4: Performance**
- [ ] Initial render: < 100ms (sans IA)
- [ ] IA generation: 2-5s
- [ ] Cache hit: < 50ms
- [ ] Mobile drawer animation: 180ms
- [ ] Pas de memory leak (DevTools Profiler)

---

### 6. Tests UX/UI

**Test 6.1: Colors Premium**
- [ ] Gold #C9A86A visible (synthèse card, panel IA)
- [ ] Blue #3A82F7 visible (KPIs, buttons)
- [ ] Severity colors correctes (red/yellow/green)
- [ ] Priority colors correctes (red/yellow/blue)

**Test 6.2: Responsive Design**
- [ ] Desktop (> 1024px): dual-pane layout
- [ ] Tablet (768-1024px): single column
- [ ] Mobile (< 768px): compact cards + drawer
- [ ] Pas de scroll horizontal
- [ ] Touch targets > 44px

**Test 6.3: Animations**
- [ ] Fade-in cards: 120ms smooth
- [ ] Slide-up drawer: 180ms smooth
- [ ] Hover effects: transitions 200ms
- [ ] Loading spinner: rotate animation

**Test 6.4: Accessibility**
- [ ] Tous les buttons ont aria-label
- [ ] Keyboard navigation fonctionnelle
- [ ] Focus states visibles
- [ ] Color contrast ratios conformes WCAG AA
- [ ] Screen reader compatible

---

### 7. Tests Monitoring

**Test 7.1: Console Logs**
- [ ] Ouvrir DevTools Console
- [ ] Aucune erreur rouge
- [ ] Aucun warning jaune (sauf deprecation Next.js middleware)
- [ ] Logs informatifs uniquement

**Test 7.2: Network Tab**
- [ ] POST /api/ai/executive-summary → 200 OK
- [ ] Temps réponse < 10s
- [ ] Payload size raisonnable (< 50KB)

**Test 7.3: Vercel Logs**
```bash
# Vérifier logs Vercel
vercel logs --prod
```
- [ ] Aucune erreur 500
- [ ] Aucun timeout
- [ ] Latency acceptable (< 5s p95)

**Test 7.4: Sentry/Error Tracking**
- [ ] Aucune erreur remontée Sentry (si configuré)
- [ ] Source maps fonctionnelles
- [ ] Stack traces lisibles

---

## 🔐 SÉCURITÉ & CONFORMITÉ

### 8. Security Checklist

**Test 8.1: RLS Policies**
- [ ] Impossible de lire cache autre organisation
- [ ] Impossible d'insérer cache pour autre org
- [ ] Impossible de modifier cache autre org
- [ ] Impossible de supprimer cache autre org

**Test 8.2: API Security**
- [ ] Endpoint requiert Authorization header
- [ ] Token JWT validé
- [ ] Tenant_id extrait correctement
- [ ] Pas de SQL injection possible

**Test 8.3: Data Privacy**
- [ ] Pas de données sensibles dans prompts OpenAI
- [ ] Synthèses isolées par organization_id
- [ ] TTL 24h pour auto-cleanup
- [ ] Pas de logging données sensibles

**Test 8.4: OpenAI Security**
- [ ] API key stockée en variable environnement
- [ ] Pas de API key en clair dans code
- [ ] Graceful degradation si key manquante
- [ ] Rate limiting OpenAI respecté

---

## 📊 MÉTRIQUES & MONITORING

### 9. Metrics Collection

**Métrique 9.1: Performance**
```
Initial render: ____ms (target: < 100ms)
IA generation: ____s (target: 2-5s)
Cache hit: ____ms (target: < 50ms)
Mobile drawer: ____ms (target: 180ms)
```
- [ ] Toutes métriques dans target

**Métrique 9.2: Usage**
```
Synthèses générées/jour: ____
Cache hit ratio: ____%
Erreurs IA/jour: ____
Quick actions clicks/jour: ____
```
- [ ] Métriques collectées

**Métrique 9.3: Business**
```
Utilisateurs actifs/jour: ____
Temps moyen cockpit: ____min
Taux engagement IA: ____%
Recommandations suivies: ____%
```
- [ ] Métriques disponibles

---

## 📞 SUPPORT & ROLLBACK

### 10. Support Preparation

**Documentation:**
- [ ] PACK13-14-LIVRAISON-COMPLETE.md accessible
- [ ] PACK13-14-QUICK-REFERENCE.md accessible
- [ ] Guide troubleshooting créé
- [ ] FAQ mise à jour

**Communication:**
- [ ] Email envoyé équipe support
- [ ] Slack message #product-updates
- [ ] Changelog mis à jour
- [ ] Users notifiés (si applicable)

**Monitoring:**
- [ ] Dashboard Vercel actif
- [ ] Alertes configurées (erreurs > 10/min)
- [ ] Slack webhook configuré
- [ ] On-call schedule défini

---

### 11. Rollback Plan

**En cas de problème critique:**

**Étape 11.1: Rollback Vercel**
```bash
# Lister deployments
vercel ls

# Rollback vers version précédente
vercel rollback <PREVIOUS_DEPLOYMENT_ID>
```
- [ ] Procédure documentée
- [ ] Accès Vercel confirmé
- [ ] Previous deployment ID connu

**Étape 11.2: Rollback Database**
```bash
# Supprimer table si nécessaire
psql $DATABASE_URL -c "DROP TABLE IF EXISTS executive_summary_cache CASCADE;"

# Restaurer backup
psql $DATABASE_URL < backup-YYYYMMDD-HHMMSS.sql
```
- [ ] Procédure documentée
- [ ] Backup disponible
- [ ] Accès database confirmé

**Étape 11.3: Communication Rollback**
- [ ] Informer équipe technique
- [ ] Informer users (si visible)
- [ ] Post-mortem planifié
- [ ] Root cause analysis initiée

---

## ✅ VALIDATION FINALE

### 12. Sign-Off

**Product Owner:**
- [ ] Fonctionnalités validées
- [ ] UX conforme spec
- [ ] Performance acceptable
- [ ] Signature: _________________ Date: _______

**Tech Lead:**
- [ ] Code quality OK
- [ ] Tests passés
- [ ] Security validée
- [ ] Signature: _________________ Date: _______

**DevOps:**
- [ ] Déploiement réussi
- [ ] Monitoring actif
- [ ] Rollback plan ready
- [ ] Signature: _________________ Date: _______

---

## 🎉 POST-DÉPLOIEMENT

### 13. Next Steps

**Immédiat (< 1h):**
- [ ] Monitorer logs pendant 1h
- [ ] Vérifier métriques initiales
- [ ] Répondre feedback initial users

**Court terme (< 24h):**
- [ ] Collecter feedback utilisateurs
- [ ] Analyser métriques jour 1
- [ ] Ajuster si nécessaire

**Moyen terme (< 1 semaine):**
- [ ] Optimiser prompts ANE si besoin
- [ ] Affiner cache strategy
- [ ] Planifier itérations futures

---

**Status Final:** ✅ DEPLOYED TO PRODUCTION
**URL:** https://www.powalyze.com/cockpit
**Date:** 11 Janvier 2026
**Version:** PACK 13 + 14 v1.0.0
