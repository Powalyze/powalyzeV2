# 🎭 Guide Test Mode Mock - Wizard Phase 4

**Date**: 28 janvier 2025  
**Objectif**: Tester le wizard sans utiliser l'API OpenAI (0€)

---

## ✅ PRÉ-REQUIS

### 1. Vérifier `.env.local`
```env
# Mode mock activé automatiquement si clé commence par "sk-fake"
OPENAI_API_KEY=sk-proj-VOTRE_VRAIE_CLE_ICI

# OU simplement laisser fake:
OPENAI_API_KEY=sk-fake-key-for-build

# Supabase PROD requis
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### 2. Démarrer le serveur
```bash
npm run dev
```

### 3. Préparer compte test
- Login: `fabrice@advanceam.com` / `Advanceam2025!`
- OU créer nouveau compte via `/signup`

---

## 🎯 SCÉNARIO DE TEST COMPLET

### **Étape 1: Créer Projet avec Wizard**

1. Naviguer vers `/cockpit-client-supabase`
2. Cliquer "Nouveau Projet"
3. Remplir le formulaire:
   - **Nom**: `Test Mock Mode - Refonte CRM`
   - **Description**: `Migration du CRM legacy vers solution cloud moderne avec intégration Salesforce`
   - **Budget**: `450000` (450K€)
   - **Date fin**: `2025-09-30`
   - **RAG**: Sélectionner `YELLOW`
   - ✅ **Cocher**: "Lancer l'assistant IA de préparation"
4. Cliquer "Créer le projet"

**Résultat attendu**:
- Projet créé dans la base
- Redirection automatique vers `/wizard-prep?projectId=xxx`
- Interface wizard affichée avec 5 étapes

---

### **Étape 2: Générer Risques (Step 1)**

**Page**: `/wizard-prep?projectId=xxx&step=1`

1. Vérifier affichage:
   - Titre: "Étape 1/5 : Identification des Risques"
   - Résumé du projet visible
   - Bouton "Générer les Risques avec IA"
2. Cliquer "Générer les Risques avec IA"
3. **Observer**:
   - Loading spinner affiché
   - Délai simulé: **4-7 secondes**
   - Toast notification: "Risques générés avec succès"
4. Vérifier données affichées:
   - **4 risques** mockés:
     1. Risque de migration de données (CRITICAL)
     2. Manque de compétences équipe (HIGH)
     3. Résistance au changement (MEDIUM)
     4. Dépassement budgétaire (HIGH)
   - Chaque risque affiche: title, level, probability %, impact %, mitigation_plan
5. Cliquer "Suivant"

**Validation Base de Données**:
```sql
SELECT * FROM risks WHERE project_id = 'xxx';
-- Doit retourner 4 lignes

SELECT * FROM ai_generations 
WHERE project_id = 'xxx' AND entity_type = 'risk';
-- Doit avoir mode = 'mock'
```

---

### **Étape 3: Générer Décisions (Step 2)**

**Page**: `/wizard-prep?projectId=xxx&step=2`

1. Vérifier affichage:
   - Titre: "Étape 2/5 : Décisions Stratégiques"
   - Bouton "Générer les Décisions avec IA"
2. Cliquer "Générer les Décisions avec IA"
3. **Observer**:
   - Loading spinner
   - Délai simulé: **5-9 secondes**
   - Toast: "Décisions générées avec succès"
4. Vérifier données affichées:
   - **3 décisions** mockées:
     1. Choix solution cloud (URGENT, COMEX)
     2. Formation équipe (HIGH, CODIR)
     3. Planning migration (URGENT, COMEX)
   - Chaque décision affiche: title, type, urgency, committee, options, impacts
5. Cliquer "Suivant"

**Validation Base de Données**:
```sql
SELECT * FROM decisions WHERE project_id = 'xxx';
-- Doit retourner 3 lignes

SELECT * FROM ai_generations 
WHERE project_id = 'xxx' AND entity_type = 'decision';
-- Doit avoir mode = 'mock'
```

---

### **Étape 4: Générer Scénarios (Step 3)**

**Page**: `/wizard-prep?projectId=xxx&step=3`

1. Vérifier affichage:
   - Titre: "Étape 3/5 : Scénarios Prévisionnels"
   - Bouton "Générer les Scénarios avec IA"
2. Cliquer "Générer les Scénarios avec IA"
3. **Observer**:
   - Loading spinner
   - Délai simulé: **6-10 secondes**
   - Toast: "Scénarios générés avec succès"
4. Vérifier données affichées:
   - **3 scénarios** mockés:
     1. OPTIMISTIC (20% prob): Livraison avancée 2 mois, -15% budget
     2. CENTRAL (60% prob): Livraison à temps, +5% budget
     3. PESSIMISTIC (20% prob): Retard 4 mois, +30% budget
   - Chaque scénario affiche: type, probability, delivery_date, final_budget, business_impacts (4 bullets), actions (4 bullets)
5. Cliquer "Suivant"

**Validation Base de Données**:
```sql
SELECT * FROM scenarios WHERE project_id = 'xxx';
-- Doit retourner exactement 3 lignes (optimistic, central, pessimistic)

SELECT * FROM ai_generations 
WHERE project_id = 'xxx' AND entity_type = 'scenario';
-- Doit avoir mode = 'mock'
```

---

### **Étape 5: Générer Objectifs (Step 4)**

**Page**: `/wizard-prep?projectId=xxx&step=4`

1. Vérifier affichage:
   - Titre: "Étape 4/5 : Objectifs SMART"
   - Bouton "Générer les Objectifs avec IA"
2. Cliquer "Générer les Objectifs avec IA"
3. **Observer**:
   - Loading spinner
   - Délai simulé: **5-8 secondes**
   - Toast: "Objectifs générés avec succès"
4. Vérifier données affichées:
   - **4 objectifs** mockés:
     1. Livraison Phase 1 (2025-04-30, HIGH)
     2. Adoption 80% utilisateurs (2025-07-31, HIGH)
     3. Performance < 2s (2025-08-31, MEDIUM)
     4. Satisfaction > 8/10 (2025-09-30, MEDIUM)
   - Chaque objectif affiche: title, measurable KPI, deadline, priority, category
5. Cliquer "Suivant"

**Validation Base de Données**:
```sql
SELECT * FROM project_objectives WHERE project_id = 'xxx';
-- Doit retourner 4 lignes

SELECT * FROM ai_generations 
WHERE project_id = 'xxx' AND entity_type = 'objective';
-- Doit avoir mode = 'mock'
```

---

### **Étape 6: Générer Rapport (Step 5)**

**Page**: `/wizard-prep?projectId=xxx&step=5`

1. Vérifier affichage:
   - Titre: "Étape 5/5 : Rapport Exécutif"
   - Bouton "Générer le Rapport Exécutif"
2. Cliquer "Générer le Rapport Exécutif"
3. **Observer**:
   - Loading spinner
   - Délai simulé: **8-12 secondes** (le plus long)
   - Toast: "Rapport généré avec succès"
4. Vérifier données affichées:
   - **Summary**: 500 mots, 6 paragraphes (contexte, risques, décisions, scénarios, objectifs, conclusion)
   - **Recommendations**: 6 recommandations stratégiques (30-60 mots chacune)
5. Cliquer "Terminer" (ou "Retour au Dashboard")

**Validation Base de Données**:
```sql
SELECT * FROM reports WHERE project_id = 'xxx';
-- Doit retourner 1 ligne avec type = 'executive'

SELECT * FROM ai_generations 
WHERE project_id = 'xxx' AND entity_type = 'report';
-- Doit avoir mode = 'mock'
```

---

## 📊 VALIDATION GLOBALE

### 1. Vérifier Logs ai_generations
```sql
SELECT 
  entity_type,
  generation_type,
  tokens_used,
  latency_ms,
  mode,
  created_at
FROM ai_generations
WHERE project_id = 'xxx'
ORDER BY created_at ASC;
```

**Résultat attendu**:
```
entity_type | generation_type        | tokens_used | latency_ms | mode | created_at
------------|------------------------|-------------|------------|------|------------------
risk        | risk_identification    | ~1500       | 4000-7000  | mock | 2025-01-28 ...
decision    | strategic_decisions    | ~1800       | 5000-9000  | mock | 2025-01-28 ...
scenario    | predictive_scenarios   | ~2200       | 6000-10000 | mock | 2025-01-28 ...
objective   | smart_objectives       | ~1600       | 5000-8000  | mock | 2025-01-28 ...
report      | executive_report       | ~3500       | 8000-12000 | mock | 2025-01-28 ...
```

**Points clés**:
- `mode = 'mock'` pour toutes les lignes ✅
- `tokens_used` calculés automatiquement (~4 chars/token)
- `latency_ms` correspond aux délais simulés
- `success = true` pour toutes

### 2. Vérifier Intégrité Projet
```sql
SELECT 
  p.name,
  (SELECT COUNT(*) FROM risks WHERE project_id = p.id) as risks_count,
  (SELECT COUNT(*) FROM decisions WHERE project_id = p.id) as decisions_count,
  (SELECT COUNT(*) FROM scenarios WHERE project_id = p.id) as scenarios_count,
  (SELECT COUNT(*) FROM project_objectives WHERE project_id = p.id) as objectives_count,
  (SELECT COUNT(*) FROM reports WHERE project_id = p.id) as reports_count
FROM projects p
WHERE p.id = 'xxx';
```

**Résultat attendu**:
```
name                          | risks_count | decisions_count | scenarios_count | objectives_count | reports_count
------------------------------|-------------|-----------------|-----------------|------------------|---------------
Test Mock Mode - Refonte CRM  | 4           | 3               | 3               | 4                | 1
```

---

## 🔍 TESTS NÉGATIFS

### Test 1: Données Consistantes Entre Runs
1. Créer **2 projets différents** avec wizard
2. Comparer les risques générés
3. **Attendu**: Données identiques (mock utilise toujours les mêmes templates)

### Test 2: Mode Production Non Affecté
1. Ajouter vraie clé OpenAI dans `.env.local`:
   ```env
   OPENAI_API_KEY=sk-proj-VRAIE_CLE_OPENAI_ICI
   ```
2. Redémarrer serveur: `npm run dev`
3. Créer nouveau projet avec wizard
4. **Attendu**: Appels réels OpenAI, données différentes à chaque run, `mode = 'production'` dans ai_generations

### Test 3: Détection Automatique Mock
1. Tester avec différentes clés:
   ```env
   OPENAI_API_KEY=sk-fake-key           → Mode mock ✅
   OPENAI_API_KEY=sk-fake-test-123      → Mode mock ✅
   OPENAI_API_KEY=                      → Mode mock ✅ (vide)
   OPENAI_API_KEY=sk-proj-abc123...     → Mode production ✅
   ```

---

## 📝 CHECKLIST FINALE

- [ ] 5 étapes wizard complétées sans erreur
- [ ] 4 risques insérés dans base
- [ ] 3 décisions insérées dans base
- [ ] 3 scénarios insérés dans base
- [ ] 4 objectifs insérés dans base
- [ ] 1 rapport inséré dans base
- [ ] 5 logs ai_generations avec `mode = 'mock'`
- [ ] Délais simulés observés (4-12 secondes selon étape)
- [ ] Aucune erreur console navigateur
- [ ] Aucune erreur terminal serveur
- [ ] Toasts notifications affichés
- [ ] Navigation wizard fluide (Suivant/Précédent)
- [ ] Redirection dashboard après "Terminer"

---

## 🎯 AVANTAGES MODE MOCK

| Critère                  | Mode Mock        | Mode Production   |
|--------------------------|------------------|-------------------|
| **Coût par wizard**      | 0€ ✅            | ~0.05€            |
| **Tests illimités**      | ✅ Oui           | ⚠️ Limité (quotas)|
| **Rapidité tests**       | ✅ Immédiat      | ⏳ Attente API    |
| **Données cohérentes**   | ✅ Reproductibles| ❌ Aléatoires     |
| **Validation UI/UX**     | ✅ Complète      | ✅ Complète       |
| **Validation BD**        | ✅ Complète      | ✅ Complète       |
| **Qualité contenu**      | ⚠️ Générique     | ✅ Personnalisé   |

**Recommandation**: Mode mock pour **validation technique** (UI, navigation, base de données), mode production pour **validation fonctionnelle** (qualité contenu IA).

---

## 🐛 TROUBLESHOOTING

### Problème: "Empty response from OpenAI"
**Cause**: Clé OpenAI commence par `sk-proj` mais n'est pas valide  
**Solution**: Remplacer par `sk-fake-key` pour forcer mode mock

### Problème: Résultats toujours identiques
**Cause**: Mode mock actif (par design)  
**Solution**: Normal! C'est l'objectif du mode mock. Utiliser vraie clé OpenAI pour données variables.

### Problème: Erreur 500 sur génération
**Cause**: Problème base de données ou parsing  
**Solution**: Vérifier logs serveur, tables schema, organisation_id matching

### Problème: Meta.mode non affiché
**Cause**: Ancienne version API route  
**Solution**: Vérifier que les 5 routes ont bien le code mock appliqué

---

## 📚 FICHIERS MODIFIÉS

### Nouveau:
- `lib/ai-mock-data.ts` (~400 lignes)

### Modifiés:
- `app/api/ai/risks/generate/route.ts`
- `app/api/ai/decisions/generate/route.ts`
- `app/api/ai/scenarios/generate/route.ts`
- `app/api/ai/objectives/generate/route.ts`
- `app/api/ai/report/generate/route.ts`

### Pattern appliqué:
```typescript
const USE_MOCK = !process.env.OPENAI_API_KEY || 
                 process.env.OPENAI_API_KEY.startsWith('sk-fake');

if (USE_MOCK) {
  await simulateAPIDelay(min, max);
  data = MOCK_*;
  tokensUsed = calculateMockTokens(input, output);
} else {
  // OpenAI call
}

return { data, meta: { mode: USE_MOCK ? 'mock' : 'production' } };
```

---

## ✅ PROCHAINES ÉTAPES

Après validation mode mock:

1. **Option A**: Ajouter vraie clé OpenAI et tester mode production
2. **Option B**: Déployer sur Vercel avec mode mock pour staging
3. **Option C**: Continuer Phase 5 (Services Layer refactoring)

---

**Auteur**: Fabrice Meïr  
**Contact**: fabrice@advanceam.com  
**Powalyze**: Executive Cockpit v2.0
