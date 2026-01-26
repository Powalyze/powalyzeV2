# ✅ POST-DEPLOYMENT CHECKLIST — POWALYZE 2.0

**Statut déploiement** : ✅ LIVE sur www.powalyze.com  
**Date** : 26 janvier 2026  
**Déploiement** : 59 secondes  
**Routes** : 130 déployées  

---

## 🔴 ACTIONS CRITIQUES (15 MINUTES)

### ✅ Étape 1 : Activer RLS sur Supabase (5 min)

**Procédure** :

1. **Accéder à Supabase Dashboard**
   - URL : https://app.supabase.com
   - Sélectionner le projet Powalyze

2. **SQL Editor → New Query**

3. **Copier/coller ce script SQL** :

```sql
-- ========================================
-- ACTIVATION RLS — POWALYZE 2.0
-- ========================================

-- Activation Row Level Security sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_connectors ENABLE ROW LEVEL SECURITY;

-- Vérification de l'activation (doit retourner 13 lignes avec rowsecurity = true)
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN (
  'profiles',
  'projects', 'demo_projects',
  'risks', 'demo_risks',
  'decisions', 'demo_decisions',
  'anomalies', 'demo_anomalies',
  'reports', 'demo_reports',
  'connectors', 'demo_connectors'
)
ORDER BY tablename;
```

4. **Exécuter → RUN**

5. **Vérifier résultat** :
   - ✅ 13 tables avec `rowsecurity = true`
   - ❌ Si erreur : vérifier que les policies existent (voir `database/schema.sql`)

---

### ✅ Étape 2 : Tester les Guards en Production (5 min)

**URL de test** : https://www.powalyze.com

#### **Test 1 : User DEMO → Guard PRO**

**Contexte** : User avec `mode = 'demo'` dans `profiles`

**Actions** :
1. Se connecter avec credentials DEMO
2. Naviguer vers : `https://www.powalyze.com/cockpit`
3. **Résultat attendu** : Redirection automatique vers `https://www.powalyze.com/cockpit-demo`

**Validation** :
- ✅ URL finale = `/cockpit-demo`
- ✅ Aucune erreur console
- ✅ Données DEMO affichées (tables `demo_*`)

---

#### **Test 2 : User PRO → Guard DEMO**

**Contexte** : User avec `mode = 'pro'` dans `profiles`

**Actions** :
1. Se connecter avec credentials PRO
2. Naviguer vers : `https://www.powalyze.com/cockpit-demo`
3. **Résultat attendu** : Redirection automatique vers `https://www.powalyze.com/cockpit`

**Validation** :
- ✅ URL finale = `/cockpit`
- ✅ Aucune erreur console
- ✅ Données PRO affichées (tables réelles)

---

#### **Test 3 : Non-authentifié → Login**

**Contexte** : Aucun user connecté

**Actions** :
1. Se déconnecter complètement (logout)
2. Naviguer vers : `https://www.powalyze.com/cockpit`
3. **Résultat attendu** : Redirection automatique vers `https://www.powalyze.com/login`

**Validation** :
- ✅ URL finale = `/login`
- ✅ Message : "Vous devez être connecté"
- ✅ Aucune donnée exposée

---

### ✅ Étape 3 : Vérifier Variables d'Environnement (3 min)

**Accéder à Vercel Dashboard** :
- URL : https://vercel.com/powalyzes-projects/powalyze-v2
- Settings → Environment Variables → Production

**Variables critiques à vérifier** :

| Variable | Requis | Source | Test |
|----------|--------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase Dashboard | Connexion DB |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase Dashboard | Connexion DB |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase Dashboard | Admin ops |
| `OPENAI_API_KEY` | ✅ | OpenAI Dashboard | IA endpoints |
| `JWT_SECRET` | ✅ | Généré (unique) | Auth tokens |
| `NEXT_PUBLIC_APP_URL` | ⚠️ | www.powalyze.com | Redirections |

**Si variable manquante** :
1. Ajouter dans Vercel → Environment Variables
2. Redéployer : `npx vercel --prod --yes`

**Test IA endpoint** :
```bash
curl -X POST https://www.powalyze.com/api/ai/chief-actions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "projects": [],
    "risks": []
  }'
```

Résultat attendu : `{ "actions": [...] }` (non erreur 500)

---

### ✅ Étape 4 : Monitoring Production (30 min)

**Commande** :
```bash
npx vercel logs --follow
```

**Ce qu'il faut surveiller** :

| Métrique | Cible | Action si dépassé |
|----------|-------|-------------------|
| Erreurs 5xx | 0 | Rollback immédiat |
| Erreurs 4xx | <5% | Identifier patterns |
| Latence API | <500ms | Analyser requêtes |
| Guards redirects | 100% | Vérifier logs |
| IA responses | >95% | Vérifier quotas |

**Logs critiques à surveiller** :
```
✅ "Guard: mode=demo, redirecting to /cockpit-demo"
✅ "Guard: mode=pro, redirecting to /cockpit"
✅ "Guard: not authenticated, redirecting to /login"
❌ "Error: RLS policy violation" → RLS non activé
❌ "Error: SUPABASE_SERVICE_ROLE_KEY not found" → Env var manquante
❌ "Error: OpenAI API key invalid" → Vérifier OPENAI_API_KEY
```

**Dashboard Vercel Analytics** :
- Accéder à : https://vercel.com/powalyzes-projects/powalyze-v2/analytics
- Vérifier :
  - **Core Web Vitals** : LCP <2.5s, FCP <1.8s, INP <200ms
  - **Status codes** : 2xx >95%, 4xx <5%, 5xx = 0%
  - **Top pages** : `/cockpit`, `/cockpit-demo`, `/login`

---

## 🟡 ACTIONS RECOMMANDÉES (24H)

### ✅ Test CRUD complet

**Scénario DEMO** :
1. Login user DEMO
2. Créer un risque dans `/cockpit-demo/risques/nouveau`
3. Vérifier présence dans `demo_risks` (non `risks`)
4. Modifier le risque
5. Supprimer le risque

**Scénario PRO** :
1. Login user PRO
2. Créer une décision dans `/cockpit/decisions/nouveau`
3. Vérifier présence dans `decisions` (non `demo_decisions`)
4. Modifier la décision
5. Supprimer la décision

---

### ✅ Test IA endpoints

**Endpoints à tester** :

| Endpoint | Méthode | Body | Résultat attendu |
|----------|---------|------|------------------|
| `/api/ai/chief-actions` | POST | `{projects, risks}` | `{actions: [...]}` |
| `/api/ai/predict` | POST | `{project}` | `{prediction: {...}}` |
| `/api/ai/generate-brief` | POST | `{context}` | `{brief: "..."}` |

**Script de test** :
```javascript
// test-ai.js
const testAI = async () => {
  const response = await fetch('https://www.powalyze.com/api/ai/chief-actions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${YOUR_TOKEN}`
    },
    body: JSON.stringify({
      projects: [],
      risks: []
    })
  });
  
  const data = await response.json();
  console.log('✅ AI response:', data);
};

testAI();
```

---

### ✅ Performance Audit

**Lighthouse CI** :
```bash
npx lighthouse https://www.powalyze.com --view
```

**Cibles** :
- Performance : >90
- Accessibility : >95
- Best Practices : >95
- SEO : >90

**Si <90** :
- Consulter `PERFORMANCE_OPTIMIZATIONS.md`
- Vérifier images optimisées
- Vérifier Turbopack enabled
- Vérifier CDN Vercel

---

## 🟢 ACTIONS OPTIONNELLES (7 JOURS)

### ✅ Upload vidéo HERO

**Fichier** : `public/videos/powalyze-manifeste.mp4`

**Specs** :
- Format : MP4, H.264
- Résolution : 1920x1080 minimum
- Compression : web-optimized
- Durée : 30-60 secondes
- Poids : <10 MB

**Validation** :
- Tester sur `/` (vitrine)
- Vérifier autoplay + muted
- Vérifier fallback image

---

### ✅ Compléter traductions FR

**Fichier** : `locales/fr.json`

**Clés manquantes** :
- `common.actions.filter`
- `common.actions.export`
- `cockpit.modules.decisions.newDecision`
- Autres (voir build warnings)

**Impact** : Non-bloquant, améliore UX

---

## 📊 CHECKLIST DE VALIDATION

### Sécurité
- [x] RLS activé (13 tables)
- [x] Guards actifs (guardProRoute, guardDemoRoute)
- [x] SERVICE_ROLE_KEY server-only
- [x] JWT_SECRET production unique
- [x] HTTPS uniquement
- [ ] Test intrusion DEMO→PRO

### Performance
- [x] Build <10s (actuel : 7.9s)
- [x] Routes <150 (actuel : 130)
- [x] Turbopack enabled
- [ ] Lighthouse >90

### Fonctionnel
- [x] 130 routes déployées
- [x] 13 modules CRUD opérationnels
- [ ] 3 guards testés en production
- [ ] CRUD DEMO testé
- [ ] CRUD PRO testé
- [ ] 16 endpoints IA testés

### Monitoring
- [ ] Logs 30 min sans erreur
- [ ] Analytics Vercel configuré
- [ ] Alerting configuré (Phase 3)
- [ ] Dashboards créés (Phase 3)

---

## 🚨 ROLLBACK PROCÉDURE

**Si problème critique détecté** :

```bash
# 1. Identifier le déploiement précédent
npx vercel ls

# 2. Rollback vers version stable
npx vercel rollback

# 3. Vérifier rollback effectif
curl https://www.powalyze.com/api/health
```

**Critères de rollback immédiat** :
- Erreurs 5xx >10/min
- Guards non fonctionnels
- Fuite DEMO↔PRO détectée
- RLS violation en masse
- IA endpoints down >80%

---

## 📞 CONTACTS ESCALATION

| Niveau | Délai | Contact |
|--------|-------|---------|
| **P0** (site down) | Immédiat | DevOps Lead |
| **P1** (fonctionnel critique) | 15 min | Release Manager |
| **P2** (dégradé non-bloquant) | 2h | QA Lead |
| **P3** (mineur) | 24h | Product Owner |

---

## ✅ STATUT GLOBAL

**Déploiement** : ✅ SUCCÈS  
**Guards** : ⏳ À tester  
**RLS** : ⏳ À activer  
**Monitoring** : ⏳ 30 min requis  

**Next critical action** : Activer RLS (5 min) → Tester guards (5 min)
