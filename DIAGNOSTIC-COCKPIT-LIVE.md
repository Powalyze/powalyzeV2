# DIAGNOSTIC COCKPIT LIVE - ANALYSE COMPLÈTE

Date: 30 Janvier 2026
Status: 🔍 **ANALYSE EN COURS**

---

## 🔴 PROBLÈMES IDENTIFIÉS

### 1. ROUTING APRÈS CRÉATION PROJET ❌
**Problème:** Pas de redirection automatique après création projet
**Localisation:** [components/cockpit/CockpitLive.tsx](components/cockpit/CockpitLive.tsx#L57-L67)
**Code actuel:**
```typescript
const handleCreateProject = async (data: ProjectFormData) => {
  try {
    await createProject({...});
    setShowModal(false);
    setCurrentView('projects'); // ❌ Change seulement la vue, pas de redirect
  } catch (err) {
    console.error('Erreur création projet:', err);
  }
};
```

**Impact:** Utilisateur reste sur l'écran vide même après création projet

**Solution:**
- Ajouter `useRouter` de Next.js
- Redirect vers `/cockpit` après création
- Force refresh des données

---

### 2. ÉTAT VIDE LOGIC ⚠️
**Problème:** Condition trop stricte pour état vide
**Localisation:** [components/cockpit/CockpitLive.tsx](components/cockpit/CockpitLive.tsx#L92-L106)
**Code actuel:**
```typescript
if (!isLoading && projects.length === 0) {
  return (
    <div className="flex h-screen items-center justify-center...">
      <EmptyProjects onAction={() => setShowModal(true)} />
    </div>
  );
}
```

**Impact:** Une fois projet créé, la condition reste vraie si les données ne sont pas rechargées

**Solution:**
- Forcer refetch après création
- Ou utiliser router.push pour recharger la page

---

### 3. HOOK USECOCKPIT ✅
**Status:** ✅ Existe déjà et est correct
**Localisation:** [hooks/useLiveCockpit.ts](hooks/useLiveCockpit.ts)
**Fonctionnalités:**
- Charge tous les modules en parallèle
- Gère loading states
- Inclut createProject, createRisk, createDecision
- Exports types complets

**Pas de problème identifié**

---

### 4. STORE ZUSTAND ⚠️
**Problème:** Store existant mais potentiellement non synchronisé
**Localisation:** [stores/cockpitStore.ts](stores/cockpitStore.ts)
**Observations:**
- Store bien défini avec `useCockpitStore`
- Méthodes CRUD présentes
- Mais pas utilisé dans CockpitLive.tsx (utilise `useLiveCockpit` à la place)

**Impact:** Confusion entre deux systèmes (hook vs store)

**Solution:**
- Utiliser SOIT hook SOIT store, pas les deux
- Recommandation: Garder useLiveCockpit (plus simple, déjà fonctionnel)
- Supprimer ou archiver cockpitStore.ts

---

### 5. CLIENTS SUPABASE 🔄
**Problème:** Multiples clients Supabase créés
**Localisations:**
- [lib/supabase/client.ts](lib/supabase/client.ts) ✅ (principal)
- [lib/supabase-singleton.ts](lib/supabase-singleton.ts) ⚠️ (doublon)
- [lib/supabase/prodClient.ts](lib/supabase/prodClient.ts) ⚠️ (prod)
- [lib/supabase/demoClient.ts](lib/supabase/demoClient.ts) ⚠️ (demo)
- [utils/supabase/client.tsx](utils/supabase/client.tsx) ⚠️ (legacy)
- [utils/supabase/server.ts](utils/supabase/server.ts) ⚠️ (server)

**Impact:** Confusion, possibles race conditions, multiple connexions

**Solution:**
- Standardiser sur `lib/supabase/client.ts` (déjà bon)
- Supprimer doublons ou clarifier leur usage

---

### 6. RLS SUPABASE ❓
**Problème:** Besoin de vérifier RLS policies
**Vérifications nécessaires:**
- User a organization_id après signup?
- Membership créée automatiquement?
- RLS projects filtre correctement par organization_id?
- Auth tokens valides?

**Solution:**
- Tester query SQL directement
- Vérifier logs Supabase
- Ajouter logging dans useLiveCockpit

---

### 7. MODULES TOUJOURS VISIBLES ✅
**Status:** ✅ Déjà implémenté correctement
**Observations:**
- EmptyStates existent pour tous modules
- Modules ne se masquent jamais (pas de `if (risks.length > 0)`)
- Design premium avec messages d'invitation

**Pas de problème identifié**

---

## 🎯 CORRECTIONS PRIORITAIRES

### PRIORITÉ 1: ROUTING POST-CRÉATION (CRITIQUE)
**Action:** Ajouter useRouter et redirect

**Fichier:** [components/cockpit/CockpitLive.tsx](components/cockpit/CockpitLive.tsx)

**Avant:**
```typescript
const handleCreateProject = async (data: ProjectFormData) => {
  try {
    await createProject({...});
    setShowModal(false);
    setCurrentView('projects');
  } catch (err) {
    console.error('Erreur création projet:', err);
  }
};
```

**Après:**
```typescript
import { useRouter } from 'next/navigation';

export function CockpitLive() {
  const router = useRouter();
  
  const handleCreateProject = async (data: ProjectFormData) => {
    try {
      await createProject({...});
      setShowModal(false);
      // Force refresh en redirigeant vers cockpit
      router.push('/cockpit');
      router.refresh();
    } catch (err) {
      console.error('Erreur création projet:', err);
    }
  };
}
```

---

### PRIORITÉ 2: LOGGING POUR DIAGNOSTIC
**Action:** Ajouter logs dans useLiveCockpit

**Fichier:** [hooks/useLiveCockpit.ts](hooks/useLiveCockpit.ts)

**Ajout:**
```typescript
useEffect(() => {
  loadData();
}, [user]);

const loadData = async () => {
  console.log('[useLiveCockpit] Start loading data...');
  console.log('[useLiveCockpit] User:', user);
  console.log('[useLiveCockpit] Organization:', organizationId);
  
  // ... existing code ...
  
  console.log('[useLiveCockpit] Projects loaded:', projects.length);
  console.log('[useLiveCockpit] Risks loaded:', risks.length);
  // etc.
};
```

---

### PRIORITÉ 3: REFETCH APRÈS CRÉATION
**Action:** Forcer refetch immédiatement après création

**Fichier:** [components/cockpit/CockpitLive.tsx](components/cockpit/CockpitLive.tsx)

**Modification:**
```typescript
const handleCreateProject = async (data: ProjectFormData) => {
  try {
    await createProject({...});
    setShowModal(false);
    // Refetch immédiat
    await refetch();
    setCurrentView('projects');
  } catch (err) {
    console.error('Erreur création projet:', err);
  }
};
```

---

## ✅ CE QUI FONCTIONNE DÉJÀ

- ✅ Hook useLiveCockpit complet et fonctionnel
- ✅ EmptyStates premium pour tous modules
- ✅ Client Supabase principal (lib/supabase/client.ts)
- ✅ Types TypeScript complets
- ✅ CRUD operations (createProject, createRisk, createDecision)
- ✅ Parallel loading optimisé
- ✅ Error handling
- ✅ Loading states

---

## 🔍 TESTS À EFFECTUER

### Test 1: Création Projet End-to-End
1. Ouvrir /cockpit sans projets
2. Voir écran EmptyProjects
3. Click "Créer mon premier projet"
4. Remplir formulaire
5. Submit
6. **Vérifier:** Redirect vers /cockpit avec projet visible

### Test 2: Vérifier RLS Supabase
```sql
-- Vérifier que user a organization_id
SELECT id, email, 
       raw_user_meta_data->>'organization_id' as org_id
FROM auth.users
WHERE email = 'test@example.com';

-- Vérifier projects accessibles
SELECT * FROM projects
WHERE organization_id = '<USER_ORG_ID>';

-- Vérifier RLS policy
SELECT * FROM pg_policies
WHERE tablename = 'projects';
```

### Test 3: Network Tab
- Ouvrir DevTools Network
- Créer projet
- Vérifier requêtes Supabase
- Vérifier réponses (200 OK vs 403 Forbidden)

---

## 📊 RÉSUMÉ DIAGNOSTIC

**Problèmes critiques:** 1
- Routing post-création manquant

**Problèmes mineurs:** 2
- Multiples clients Supabase (confusion)
- Store Zustand non utilisé

**Non-problèmes:** 4
- Hook useLiveCockpit ✅
- EmptyStates ✅
- Types ✅
- CRUD operations ✅

**Vérifications nécessaires:** 1
- RLS Supabase (à tester en conditions réelles)

---

## 🚀 PLAN D'ACTION

1. **Immédiat (< 15min):**
   - Ajouter useRouter + redirect dans handleCreateProject
   - Tester création projet end-to-end

2. **Court terme (< 1h):**
   - Ajouter logging dans useLiveCockpit
   - Tester avec vraies données Supabase
   - Vérifier RLS policies

3. **Moyen terme (< 1 jour):**
   - Nettoyer clients Supabase multiples
   - Supprimer cockpitStore.ts si non utilisé
   - Documentation mise à jour

---

**Status actuel:** 🟡 Problème identifié, solution simple, implémentation en cours
