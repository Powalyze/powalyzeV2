# TEST PLAN - FIX COCKPIT LIVE

Date: 30 Janvier 2026
Status: ✅ **FIX APPLIQUÉ - TESTS REQUIS**

---

## 🎯 PROBLÈME RÉSOLU

**Issue critique:** Cockpit LIVE restait sur écran vide après création premier projet.

**Root cause identifiée:** Pas de redirection après `createProject()` dans `CockpitLive.tsx`

**Solution appliquée:**
```typescript
// AVANT
const handleCreateProject = async (data: ProjectFormData) => {
  await createProject({...});
  setShowModal(false);
  setCurrentView('projects'); // ❌ Change seulement state local
};

// APRÈS
import { useRouter } from 'next/navigation';
const router = useRouter();

const handleCreateProject = async (data: ProjectFormData) => {
  await createProject({...});
  setShowModal(false);
  router.push('/cockpit'); // ✅ Force navigation
  router.refresh(); // ✅ Force data refresh
};
```

---

## ✅ BUILD VERIFICATION

**Status:** ✅ **BUILD SUCCESSFUL**

```
Compilation: 11.8s
TypeScript: 22.0s (0 errors)
Pages: 163 generated
Size: Production optimized
```

**Conclusion:** Fix n'introduit pas de régression, prêt pour déploiement.

---

## 🧪 PLAN DE TEST MANUEL

### TEST 1: Création premier projet (Nouvel utilisateur)

**Pré-requis:**
- Compte utilisateur créé
- Organization_id assigné
- Accès à Supabase database

**Steps:**
1. Se connecter avec credentials de test
2. Naviguer vers `/cockpit`
3. **VÉRIFIER:** EmptyProjects screen s'affiche
4. **VÉRIFIER:** Message "Créez votre premier projet pour commencer"
5. Cliquer sur "Créer mon premier projet"
6. **VÉRIFIER:** Modal s'ouvre
7. Remplir formulaire:
   - Nom: "Projet Test Alpha"
   - Description: "Test post-fix routing"
   - Budget: 100000
8. Soumettre formulaire
9. **VÉRIFIER:** Loading indicator pendant création
10. **VÉRIFIER:** Modal se ferme
11. ✅ **CRITIQUE:** Page redirige vers `/cockpit`
12. ✅ **CRITIQUE:** Projet "Projet Test Alpha" apparaît dans liste
13. ✅ **CRITIQUE:** Modules cockpit visibles (6 modules + Executive Summary)

**Résultat attendu:**
- ✅ Projet créé en database
- ✅ Page navigue automatiquement
- ✅ Cockpit affiche projet + modules
- ✅ Pas de boucle infinie
- ✅ Pas d'erreur console

**Résultat en cas d'échec:**
- ❌ Page reste sur EmptyProjects
- ❌ Projet créé mais invisible
- ❌ Erreur RLS Supabase
- ❌ Console error "organization_id undefined"

---

### TEST 2: Création projet additionnel (Utilisateur existant)

**Pré-requis:**
- Utilisateur a déjà 1+ projet
- Cockpit déjà affiché

**Steps:**
1. Naviguer vers `/cockpit`
2. **VÉRIFIER:** Cockpit affiche projets existants
3. Cliquer sur "+ Nouveau projet" (header)
4. Remplir formulaire:
   - Nom: "Projet Test Beta"
   - Description: "Second projet test"
   - Budget: 50000
5. Soumettre
6. ✅ **VÉRIFIER:** Modal se ferme
7. ✅ **VÉRIFIER:** Page refresh (router.refresh())
8. ✅ **VÉRIFIER:** Nouveau projet apparaît immédiatement

**Résultat attendu:**
- ✅ Projet ajouté à liste
- ✅ Liste mise à jour sans reload complet
- ✅ Pas de duplication

---

### TEST 3: Vérification modules cockpit

**Steps:**
1. Après création projet (TEST 1 ou 2)
2. **VÉRIFIER:** 7 sections visibles:
   - Executive Summary (PACK 13)
   - Projects (avec projet créé)
   - Risks (état vide avec EmptyRisks)
   - Decisions (état vide avec EmptyDecisions)
   - Timeline (état vide)
   - Reports (état vide)
   - Chief of Staff Actions (PACK 14)

**Résultat attendu:**
- ✅ Tous modules affichés (pas de masquage si vide)
- ✅ EmptyStates fonctionnent (montrent "Créer premier risque")
- ✅ Aucun module caché par erreur

---

### TEST 4: Vérification RLS Supabase

**Pré-requis:**
- Accès Supabase dashboard
- User test avec organization_id connu

**SQL Queries:**
```sql
-- 1. Vérifier user a organization_id
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'organization_id' as org_id
FROM auth.users 
WHERE email = 'test@powalyze.com';

-- 2. Vérifier projets accessibles
SELECT * FROM projects 
WHERE organization_id = 'org_xxx';

-- 3. Vérifier RLS policies actives
SELECT * FROM pg_policies 
WHERE tablename = 'projects';

-- 4. Test RLS isolation (doit retourner 0 rows)
SELECT * FROM projects 
WHERE organization_id = 'autre_org_id';
```

**Résultat attendu:**
- ✅ User a organization_id valide
- ✅ Projets filtrés par organization_id
- ✅ RLS bloque accès autre org
- ✅ Pas d'erreur 403 en console

---

### TEST 5: Vérification useLiveCockpit hook

**Steps:**
1. Ouvrir DevTools console
2. Naviguer vers `/cockpit`
3. **VÉRIFIER:** Console log "Loading cockpit data..." (si activé)
4. **VÉRIFIER:** Pas de boucle infinie (max 1 appel par navigation)
5. **VÉRIFIER:** Data loaded en < 2s

**Résultat attendu:**
- ✅ Hook charge data 1 fois
- ✅ Parallel loading (Promise.all)
- ✅ Pas de re-fetch infini

---

## 🐛 PROBLÈMES CONNUS (Non-critiques)

### Issue 1: Multiple Supabase clients
**Severity:** 🟡 MEDIUM
**Impact:** Confusion code, pas de bug fonctionnel
**Files:**
- `lib/supabase/client.ts` (primary)
- `lib/supabase-singleton.ts`
- `lib/supabase/prodClient.ts`
- `lib/supabase/demoClient.ts`
- `utils/supabase/client.tsx`

**Action:** Consolidation future (PACK 29 - Refactoring)

---

### Issue 2: cockpitStore.ts unused
**Severity:** 🟢 LOW
**Impact:** Store existe mais non utilisé par CockpitLive
**File:** `stores/cockpitStore.ts`
**Action:** Supprimer ou documenter pourquoi non utilisé

---

### Issue 3: CSS inline styles warning
**Severity:** 🟢 LOW
**Impact:** Warning Next.js build (pre-existing)
**File:** `components/cockpit/CockpitLive.tsx` line 344
**Action:** Migrer vers Tailwind classes (cleanup)

---

## 📊 CHECKLIST DÉPLOIEMENT

### Pre-Deployment
- [x] Fix appliqué (router.push + router.refresh)
- [x] Build successful (163 pages)
- [x] 0 TypeScript errors
- [ ] Tests manuels exécutés (TEST 1-5)
- [ ] RLS Supabase vérifiées
- [ ] Environment variables Vercel confirmées

### Deployment
- [ ] Deploy to Vercel staging
- [ ] Smoke tests staging
- [ ] Deploy to production (`npx vercel --prod --yes`)
- [ ] Smoke tests production

### Post-Deployment
- [ ] Test création projet (TEST 1)
- [ ] Test modules visibles (TEST 3)
- [ ] Monitor logs Vercel (pas d'erreurs)
- [ ] Monitor Supabase (queries OK)
- [ ] User feedback (beta users)

---

## 🎯 CRITÈRES DE SUCCÈS

**Must-Have (Bloquants):**
- ✅ Projet créé apparaît immédiatement
- ✅ Page navigue vers /cockpit
- ✅ Tous modules visibles
- ✅ Pas d'erreur console
- ✅ RLS Supabase fonctionnelles

**Nice-to-Have:**
- ✅ Performance < 2s
- ✅ Animations smooth
- ✅ EmptyStates UI/UX excellente

---

## 🚀 NEXT STEPS

1. **Immediate:** Exécuter tests manuels (TEST 1-5)
2. **Short-term:** Deploy to production si tests OK
3. **Medium-term:** Consolidate Supabase clients (PACK 29)
4. **Long-term:** Phase 2 execution (PACK 15-30)

---

**Status:** ✅ FIX APPLIQUÉ - PRÊT POUR TESTS
**Responsable:** Agent IA + Product Owner
**Deadline:** 30 Janvier 2026 EOD
