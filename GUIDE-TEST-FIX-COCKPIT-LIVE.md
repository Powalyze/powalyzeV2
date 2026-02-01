# 🔥 GUIDE DE TEST - FIX COCKPIT LIVE COMPLET

Date: 30 Janvier 2026
Status: 🧪 **PRÊT POUR TESTS**

---

## ✅ CORRECTIFS APPLIQUÉS

### 1. Routing + Refetch (CockpitLive.tsx)
```typescript
const handleCreateProject = async (data: ProjectFormData) => {
  // 1. Créer le projet
  await createProject({...});
  
  // 2. Recharger IMMÉDIATEMENT les données
  await refetch();
  
  // 3. Fermer modal
  setShowModal(false);
  
  // 4. Attendre 300ms (propagation state)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 5. Rediriger vers /cockpit
  router.push('/cockpit');
  router.refresh();
};
```

**Résultat:** Après création projet, refetch() est appelé AVANT la redirection.

---

### 2. Logs de Debug (useLiveCockpit.ts)
```typescript
console.log('🚀 [useLiveCockpit] createProject appelé');
console.log('🔑 [useLiveCockpit] Organization ID:', organizationId);
console.log('💾 [useLiveCockpit] Insertion dans Supabase...');
console.log('✅ [useLiveCockpit] Projet créé:', insertedData);
console.log('🔄 [useLiveCockpit] Rechargement des données...');
console.log('✅ [useLiveCockpit] Données rechargées');
```

**Résultat:** Traçage complet du flow pour identifier le blocage.

---

### 3. Vérification organization_id (useLiveCockpit.ts)
```typescript
if (!organizationId) {
  throw new Error('Organization ID manquant - Veuillez vous reconnecter');
}
```

**Résultat:** Erreur explicite si organization_id manquant.

---

### 4. Script SQL RLS (database/fix-rls-policies.sql)
- Supprime toutes les mauvaises policies
- Recrée les bonnes policies avec memberships check
- Ajoute vérifications et tests

**Résultat:** RLS correctes pour projets, risques, décisions, timeline, reports.

---

## 🧪 PLAN DE TEST MANUEL

### TEST 1: Logs Console (CRITIQUE)

**Steps:**
1. Ouvrir DevTools Console (F12)
2. Se connecter à Powalyze
3. Naviguer vers `/cockpit`
4. Ouvrir modal "Créer projet"
5. Remplir formulaire:
   - Nom: "Test Fix LIVE"
   - Description: "Vérification corrections"
   - Budget: 100000
6. Cliquer "Créer"
7. **OBSERVER LES LOGS CONSOLE:**

**Logs attendus:**
```
🚀 [CockpitLive] Création projet: Test Fix LIVE
📝 [useLiveCockpit] createProject appelé: {...}
🔑 [useLiveCockpit] Organization ID: org_xxx
💾 [useLiveCockpit] Insertion dans Supabase...
✅ [useLiveCockpit] Projet créé: {id: "...", name: "Test Fix LIVE", ...}
🔄 [useLiveCockpit] Rechargement des données...
✅ [useLiveCockpit] Données rechargées
✅ [CockpitLive] Projet créé dans Supabase
🔄 [CockpitLive] Rechargement données...
✅ [CockpitLive] Données rechargées
🎯 [CockpitLive] Redirection vers /cockpit
```

**Si erreur:**
```
❌ [useLiveCockpit] Organization ID manquant dans user_metadata
```
→ Problème: User n'a pas organization_id

```
❌ [useLiveCockpit] Erreur Supabase: {...}
```
→ Problème: RLS bloquent l'insertion

---

### TEST 2: Vérification Supabase (CRITIQUE)

**Pre-requis:** Accès Supabase dashboard

**Steps:**
1. Aller sur Supabase → Table Editor
2. Sélectionner table `auth.users`
3. Trouver votre user
4. **VÉRIFIER:** `raw_user_meta_data` contient `organization_id`

**Résultat attendu:**
```json
{
  "organization_id": "org_xxx",
  "email": "test@powalyze.com"
}
```

**Si organization_id manquant:**
→ Exécuter SQL:
```sql
-- Créer organization
INSERT INTO organizations (id, name) VALUES
  ('org_test_001', 'Test Organization');

-- Créer membership
INSERT INTO memberships (organization_id, user_id, role) VALUES
  ('org_test_001', 'USER_ID_ICI', 'owner');

-- Mettre à jour user metadata
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{organization_id}',
  '"org_test_001"'
)
WHERE id = 'USER_ID_ICI';
```

---

### TEST 3: RLS Policies (CRITIQUE)

**Pre-requis:** Accès Supabase SQL Editor

**Steps:**
1. Aller sur Supabase → SQL Editor
2. Copier le contenu de `database/fix-rls-policies.sql`
3. Exécuter tout le script
4. **VÉRIFIER:** Résultat final doit montrer:

```
tablename        | policy_count
-----------------+-------------
projects         | 4
risks            | 4
decisions        | 4
timeline_events  | 2
reports          | 3
```

**Policies attendues pour projects:**
- Users can read projects in their organization (SELECT)
- Users can create projects in their organization (INSERT)
- Users can update projects in their organization (UPDATE)
- Owners and admins can delete projects (DELETE)

---

### TEST 4: Flow Complet (INTÉGRATION)

**Steps:**
1. Se connecter (user avec organization_id)
2. Naviguer vers `/cockpit`
3. **VÉRIFIER:** EmptyProjects screen si 0 projets
4. Cliquer "Créer mon premier projet"
5. **VÉRIFIER:** Modal s'ouvre
6. Remplir formulaire
7. Soumettre
8. **VÉRIFIER:** Console logs complets (voir TEST 1)
9. **VÉRIFIER:** Modal se ferme
10. **ATTENDRE:** 300ms (délai)
11. **VÉRIFIER:** Page redirige vers `/cockpit`
12. **VÉRIFIER:** Cockpit affiche modules:
    - ✅ Synthèse Exécutive
    - ✅ Projets (avec projet créé)
    - ✅ Risques (vide)
    - ✅ Décisions (vide)
    - ✅ Timeline (vide)
    - ✅ Rapports (vide)
13. **VÉRIFIER:** Sidebar navigation fonctionne
14. **VÉRIFIER:** Panel IA s'ouvre (mobile)

---

### TEST 5: Création Projet Additionnel

**Pre-requis:** Avoir déjà 1+ projet

**Steps:**
1. Être sur `/cockpit` avec projets visibles
2. Cliquer "+ Nouveau projet" (header ou sidebar)
3. Remplir formulaire
4. Soumettre
5. **VÉRIFIER:** Console logs
6. **VÉRIFIER:** Liste projets mise à jour immédiatement
7. **VÉRIFIER:** Nouveau projet apparaît en haut
8. **VÉRIFIER:** Pas de duplication

---

## 🐛 DÉPANNAGE

### Problème 1: "Organization ID manquant"
**Cause:** User n'a pas organization_id dans metadata
**Solution:** Exécuter SQL de TEST 2

### Problème 2: "Erreur Supabase: permission denied"
**Cause:** RLS policies incorrectes
**Solution:** Exécuter `database/fix-rls-policies.sql`

### Problème 3: "Projet créé mais invisible"
**Cause:** organization_id non injecté lors de création
**Solution:** Vérifier logs console, voir si organization_id est NULL

### Problème 4: "Page reste sur EmptyProjects"
**Cause:** refetch() n'est pas appelé ou échoue
**Solution:** Vérifier logs console, voir erreur Supabase

### Problème 5: "Boucle infinie de rechargement"
**Cause:** useEffect sans dépendances correctes
**Solution:** Vérifier `useLiveCockpit.ts` ligne 193 `useEffect(() => { fetchAllData(); }, [fetchAllData]);`

---

## 📊 CRITÈRES DE SUCCÈS

### Must-Have (Bloquants):
- ✅ Projet créé apparaît immédiatement après création
- ✅ Page redirige vers `/cockpit` automatiquement
- ✅ Tous les 6 modules visibles (même vides)
- ✅ Aucune erreur console (sauf warnings CSS)
- ✅ RLS Supabase fonctionnelles
- ✅ organization_id injecté correctement

### Nice-to-Have:
- ✅ Logs de debug clairs
- ✅ Messages d'erreur explicites
- ✅ Animations smooth
- ✅ Performance < 2s

---

## 🚀 COMMANDES RAPIDES

### Build local
```bash
npm run build
```

### Deploy production
```bash
npx vercel --prod --yes
```

### Voir logs production (Vercel)
```bash
npx vercel logs
```

### SQL Debug (Supabase)
```sql
-- Voir projets du user courant
SELECT p.*, m.role 
FROM projects p
JOIN memberships m ON p.organization_id = m.organization_id
WHERE m.user_id = auth.uid();

-- Voir organization_id du user
SELECT 
  id,
  email,
  raw_user_meta_data->>'organization_id' as org_id
FROM auth.users
WHERE email = 'test@powalyze.com';
```

---

**Status:** ✅ PRÊT POUR TESTS
**Responsable:** Team Powalyze
**Deadline:** 30 Janvier 2026 EOD
