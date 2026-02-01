# ✅ PACK 0 + PACK 12 — CHECKLIST DE DÉPLOIEMENT

## 📋 PRÉ-DÉPLOIEMENT

### 1. Build local réussi
- [x] `npm run build` compile sans erreurs
- [x] Aucune erreur TypeScript
- [x] API OpenAI gère l'absence de clé (mode dégradé)

### 2. Fichiers créés
- [x] `hooks/useLiveCockpit.ts` (Hook unifié)
- [x] `components/cockpit/EmptyStates.tsx` (États vides premium)
- [x] `components/cockpit/CockpitLive.tsx` (Cockpit complet)
- [x] `components/cockpit/TimelineDesktop.tsx` (Timeline desktop)
- [x] `components/cockpit/TimelineMobile.tsx` (Timeline mobile)
- [x] `lib/ai-timeline.ts` (IA corrélations)
- [x] `app/api/ai/timeline-insights/route.ts` (API endpoint)
- [x] `database/schema-timeline.sql` (Schéma SQL)
- [x] `app/cockpit/page.tsx` (Page mise à jour)

### 3. Documentation
- [x] `PACK0-PACK12-LIVRAISON-COMPLETE.md` (Livraison détaillée)
- [x] `PACK0-PACK12-QUICK-REFERENCE.md` (Guide rapide)
- [x] `PACK0-PACK12-CHECKLIST-DEPLOY.md` (Cette checklist)

---

## 🚀 ÉTAPES DE DÉPLOIEMENT

### Étape 1: Appliquer le schéma SQL

**Action**:
```bash
# Se connecter à Supabase PROD
psql postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]

# OU via Supabase Dashboard → SQL Editor
```

**Copier-coller** le contenu de `database/schema-timeline.sql`

**Vérifications post-application**:
```sql
-- Vérifier table créée
SELECT * FROM timeline_events LIMIT 1;

-- Vérifier index
\di timeline_events*

-- Vérifier RLS activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'timeline_events';

-- Vérifier policies
SELECT * FROM pg_policies 
WHERE tablename = 'timeline_events';

-- Vérifier triggers
SELECT tgname, tgtype 
FROM pg_trigger 
WHERE tgrelid = 'timeline_events'::regclass;
```

**Résultat attendu**:
- ✅ Table `timeline_events` existe
- ✅ 5 index créés
- ✅ RLS activé (rowsecurity = TRUE)
- ✅ 4 policies (SELECT, INSERT, UPDATE, DELETE)
- ✅ 6 triggers (project/risk/decision created/updated)

---

### Étape 2: Vérifier variables environnement Vercel

**Dashboard Vercel** → Projet → Settings → Environment Variables

**Variables obligatoires**:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
JWT_SECRET=votre-secret-jwt-production
```

**Variables optionnelles (IA timeline)**:
```
# OpenAI Standard
OPENAI_API_KEY=sk-proj-xxx

# OU Azure OpenAI
AZURE_OPENAI_API_KEY=xxx
AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

⚠️ **Note**: Si aucune clé OpenAI, l'IA timeline retournera une erreur 503 mais le cockpit fonctionnera normalement.

---

### Étape 3: Déployer sur Vercel

**Option A: CLI Vercel**
```bash
npx vercel --prod --yes
```

**Option B: Git push (auto-deploy)**
```bash
git add .
git commit -m "feat: PACK 0 + PACK 12 - Cockpit LIVE complet + Timeline exécutive"
git push origin main
```

**Attendre fin du déploiement** (~3-5 minutes)

---

### Étape 4: Tests post-déploiement

#### Test 1: Page cockpit accessible
```
URL: https://www.powalyze.com/cockpit
Attendu: Page s'affiche (état vide ou cockpit)
```

#### Test 2: Création premier projet
1. Click "Créer mon premier projet"
2. Remplir formulaire
3. Submit

**Attendu**:
- ✅ Projet créé
- ✅ Cockpit s'affiche avec sidebar
- ✅ 6 modules visibles
- ✅ Dashboard affiche compteurs

#### Test 3: Navigation modules
1. Click "Projets" → Liste affichée
2. Click "Risques" → État vide ou liste
3. Click "Décisions" → État vide ou liste
4. Click "Timeline" → Timeline affichée
5. Click "Rapports" → État vide ou liste

**Attendu**: Tous les modules s'affichent correctement

#### Test 4: Timeline
1. Accéder "Timeline"
2. Vérifier événement "project_created" présent
3. Click événement → Détail dans panel IA

**Attendu**:
- ✅ Événement affiché avec icône bleue
- ✅ Groupement par jour
- ✅ Détail dans panel droite (desktop) ou drawer (mobile)
- ✅ Métadonnées JSON visibles

#### Test 5: IA Timeline (si OpenAI configuré)
1. Dans Timeline, click "Analyser"
2. Attendre génération (~3-5s)

**Attendu**:
- ✅ Insights affichés dans panel/drawer
- ✅ Corrélations, signaux faibles, tendances, summary
- ✅ Pas d'erreur console

#### Test 6: Mobile responsive
1. Ouvrir sur mobile ou DevTools (375px)
2. Click menu hamburger
3. Naviguer modules

**Attendu**:
- ✅ Menu hamburger fonctionne
- ✅ Navigation fluide
- ✅ Timeline compacte
- ✅ Drawer détails fonctionne

---

## 🔍 VÉRIFICATIONS CONSOLE

### Console navigateur (F12)
**Aucune erreur de ce type**:
- ❌ "Failed to execute 'set' on 'Headers'" (corrigé dans déploiement précédent)
- ❌ "Multiple GoTrueClient instances"
- ❌ "localStorage in loop"
- ❌ TypeScript errors

**Logs attendus**:
- ✅ "✅ Headers ISO-8859-1 protection active" (si fix headers chargé)

---

## 📊 MONITORING POST-DÉPLOIEMENT

### Jour 1 (24h)
- [ ] Vérifier Vercel Analytics → Pas de spike erreurs
- [ ] Vérifier Supabase Dashboard → Requêtes timeline_events
- [ ] Vérifier aucun email d'alerte Vercel
- [ ] Tester création 5 projets → 5 événements timeline

### Semaine 1
- [ ] Vérifier performance timeline (< 2s chargement)
- [ ] Vérifier IA timeline génère insights cohérents
- [ ] Collecter feedback utilisateurs premiers tests
- [ ] Vérifier triggers SQL fonctionnent (événements automatiques)

---

## 🐛 TROUBLESHOOTING

### Problème: "Table timeline_events does not exist"
**Solution**: Réappliquer `database/schema-timeline.sql`

### Problème: "Missing credentials OpenAI"
**Solution**: 
1. Ajouter `OPENAI_API_KEY` dans Vercel
2. OU accepter mode dégradé (IA timeline retourne 503)

### Problème: Timeline vide
**Cause**: Aucun événement généré
**Solution**: 
1. Créer projet → Événement `project_created` généré
2. Vérifier triggers SQL actifs: `SELECT * FROM pg_trigger WHERE tgrelid = 'projects'::regclass;`

### Problème: RLS denied
**Solution**: 
1. Vérifier `organization_id` dans `user.user_metadata`
2. Vérifier membership table: `SELECT * FROM organization_members WHERE user_id = 'xxx';`

### Problème: Événements non générés
**Vérification**:
```sql
-- Vérifier fonction trigger existe
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'create_timeline_event_trigger';

-- Vérifier triggers attachés
SELECT tgname FROM pg_trigger 
WHERE tgrelid IN ('projects'::regclass, 'risks'::regclass, 'decisions'::regclass);
```

---

## ✅ VALIDATION FINALE

### Cockpit LIVE
- [ ] Page `/cockpit` accessible
- [ ] État vide premium affiché si aucun projet
- [ ] Création projet fonctionne
- [ ] 6 modules visibles (projets, risques, décisions, timeline, rapports, dashboard)
- [ ] Navigation fluide
- [ ] Tous états vides premium affichés

### Timeline
- [ ] Événements affichés chronologiquement
- [ ] Groupement par jour
- [ ] Icônes colorées par type
- [ ] Filtrage par type fonctionne
- [ ] Recherche textuelle fonctionne
- [ ] Détail événement dans panel/drawer

### IA
- [ ] Bouton "Analyser" visible
- [ ] Click génère insights (si OpenAI configuré)
- [ ] Insights affichés correctement
- [ ] Gestion mode dégradé si pas de clé

### Mobile
- [ ] Menu hamburger
- [ ] Navigation modules
- [ ] Timeline compacte
- [ ] Drawer détails fonctionne

### Performance
- [ ] Chargement cockpit < 2s
- [ ] Navigation modules < 200ms
- [ ] Génération insights IA < 5s
- [ ] Pas de lag scroll timeline

---

## 📝 NOTES POST-DÉPLOIEMENT

**Date déploiement**: _____________

**Version**: PACK 0 + PACK 12

**Environnement**: Production (Vercel + Supabase)

**Tests réussis**:
- [ ] Cockpit LIVE
- [ ] Timeline desktop
- [ ] Timeline mobile
- [ ] IA insights
- [ ] États vides

**Problèmes rencontrés**:
_________________________________________________________________
_________________________________________________________________

**Actions correctives**:
_________________________________________________________________
_________________________________________________________________

**Feedback utilisateurs**:
_________________________________________________________________
_________________________________________________________________

---

**DÉPLOIEMENT TERMINÉ** ✅

Prochain pack: ________________
