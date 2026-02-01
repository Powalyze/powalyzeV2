# ✅ BLOC FIX APPLIQUÉ - Organization ID Manquant

## 🎯 Problème Résolu
**Erreur critique**: "Organization ID manquant – Veuillez vous reconnecter"  
**Impact**: Bloquait TOUT le cockpit LIVE après création du premier projet

## 🔧 7 Fixes Appliqués

### FIX 1: Création Automatique à l'Inscription ✅
**Fichier**: [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts)

**Modifications**:
```typescript
// Après création utilisateur Supabase:

// 1) Créer organization
const { data: orgData } = await supabase
  .from('organizations')
  .insert({ name: company || `Organisation de ${firstName} ${lastName}` })
  .select().single();

// 2) Créer membership (owner)
await supabase.from('memberships').insert({
  organization_id: orgData.id,
  user_id: data.user.id,
  role: 'owner',
});

// 3) Mettre à jour user_metadata
await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
  user_metadata: {
    ...existingMetadata,
    organization_id: orgData.id, // ✅ CRITIQUE
  },
});

// 4) Rafraîchir session (FIX 6)
await supabase.auth.refreshSession();
```

**Résultat**: Chaque nouvel utilisateur a automatiquement:
- ✅ Une organization créée
- ✅ Un membership avec role `owner`
- ✅ `organization_id` dans user_metadata
- ✅ Session rafraîchie avec nouvelles métadonnées

---

### FIX 2: Hook useCurrentOrganization ✅
**Fichier**: [hooks/useCurrentOrganization.ts](hooks/useCurrentOrganization.ts) *(NOUVEAU)*

**Exports**:
1. **`useCurrentOrganization()`** - Hook React
   ```typescript
   const { organizationId, isLoading, error } = useCurrentOrganization();
   ```
   
2. **`getCurrentOrganizationId()`** - Fonction async
   ```typescript
   const orgId = await getCurrentOrganizationId();
   ```

**Stratégie de récupération**:
1. **Primaire**: Lire `user.user_metadata.organization_id` (rapide)
2. **Fallback**: Chercher dans table `memberships` (si metadata vide)
3. **Auto-sync**: Met à jour user_metadata si trouvé via memberships

**Logs détaillés** pour debugging:
```
🔍 Récupération organization_id...
✅ Utilisateur authentifié: <user_id>
📦 User metadata: { organization_id: <org_id> }
✅ Organization ID trouvé dans user_metadata: <org_id>
```

---

### FIX 3: Utilisation organization_id ✅
**Fichier**: [hooks/useLiveCockpit.ts](hooks/useLiveCockpit.ts) *(Déjà appliqué)*

**Code actuel**:
```typescript
const createProject = async (projectData: Partial<Project>) => {
  // Vérification session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Session expirée - Veuillez vous reconnecter');
  }
  
  // Récupération organization_id
  const organizationId = user.user_metadata?.organization_id;
  
  if (!organizationId) {
    throw new Error('Organization ID manquant - Veuillez vous reconnecter');
  }
  
  // Insertion avec organization_id + created_by
  const { data, error } = await supabase.from('projects').insert({
    organization_id: organizationId,
    created_by: user.id, // ✅ Ajouté dans fix précédent
    ...projectData,
  }).select().single();
  
  // Refetch immédiat
  await fetchAllData();
};
```

**Résultat**: Chaque projet créé a:
- ✅ `organization_id` défini (non NULL)
- ✅ `created_by` défini (non NULL)
- ✅ Rechargement immédiat des données

---

### FIX 4: RLS Supabase ✅
**Fichiers**: 
- [database/schema-auth-roles.sql](database/schema-auth-roles.sql)
- [database/schema-billing-automations-onboarding.sql](database/schema-billing-automations-onboarding.sql)

**Policies correctes** (via memberships):
```sql
-- READ
CREATE POLICY "Members can read projects"
  ON projects FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );

-- INSERT
CREATE POLICY "Members can insert projects"
  ON projects FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.uid()
    )
  );
```

**Tables avec RLS correctes**:
- ✅ projects
- ✅ risks
- ✅ decisions
- ✅ timeline_events
- ✅ reports
- ✅ automations
- ✅ billing_customers
- ✅ billing_subscriptions
- ✅ billing_usage
- ✅ onboarding_progress

**Résultat**: RLS vérifie via `memberships`, PAS directement via `organization_id = auth.uid()`

---

### FIX 5: Script Vérification & Correction ✅
**Fichier**: [database/fix-missing-organizations.sql](database/fix-missing-organizations.sql) *(NOUVEAU)*

**Fonctions SQL créées**:

1. **`fix_missing_organization_for_user(user_id)`**
   - Corrige UN utilisateur spécifique
   - Crée organization + membership
   - Utilisation:
     ```sql
     SELECT * FROM fix_missing_organization_for_user('USER_ID_HERE');
     ```

2. **`fix_all_missing_organizations()`**
   - Corrige TOUS les utilisateurs sans membership
   - Utilisation:
     ```sql
     SELECT * FROM fix_all_missing_organizations();
     ```

**Diagnostics inclus**:
```sql
-- Lister utilisateurs sans membership
SELECT au.id, au.email
FROM auth.users au
LEFT JOIN memberships m ON m.user_id = au.id
WHERE m.id IS NULL;

-- Compter utilisateurs sans membership
SELECT COUNT(*) as users_without_membership
FROM auth.users au
LEFT JOIN memberships m ON m.user_id = au.id
WHERE m.id IS NULL;
```

**Résultat**: Utilisateurs existants (avant le fix) peuvent être corrigés automatiquement

---

### FIX 6: Reconnexion Après Inscription ✅
**Fichier**: [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts)

**Code**:
```typescript
// Après création organization + membership + update metadata
if (data.session) {
  await supabase.auth.refreshSession();
  console.log('✅ [Signup] Session rafraîchie');
}
```

**Résultat**: Session rafraîchie automatiquement pour recharger user_metadata avec `organization_id`

---

### FIX 7: Guide de Test ✅
**Fichier**: [GUIDE-TEST-FIX-ORGANIZATION-ID.md](GUIDE-TEST-FIX-ORGANIZATION-ID.md) *(NOUVEAU)*

**Contenu**:
- ✅ Procédure test complète (7 étapes)
- ✅ Logs attendus dans console
- ✅ Vérifications Supabase
- ✅ Tests RLS
- ✅ Troubleshooting
- ✅ Checklist validation

---

## 📊 Résultats

### Build & Déploiement
```bash
✓ Compiled successfully in 15.1s
✓ Finished TypeScript in 27.3s
✓ 167 pages generated
✅ Production: https://www.powalyze.com
```

**Status**: ✅ **DÉPLOYÉ EN PRODUCTION**

---

## 🧪 Tests à Effectuer

### Test 1: Nouvelle Inscription
1. Créer compte sur `/signup`
2. Vérifier logs serveur (Vercel):
   ```
   ✅ Organisation créée: <org_id>
   ✅ Membership créé
   ✅ user_metadata mis à jour
   ✅ Session rafraîchie
   ```
3. Vérifier dans Supabase:
   - user_metadata contient `organization_id`
   - memberships a 1 ligne avec role `owner`
   - organizations a 1 nouvelle ligne

### Test 2: Création Projet
1. Login sur `/cockpit`
2. Créer un projet
3. Vérifier console:
   ```
   ✅ Session valide - User ID: <user_id>
   🔑 Organization ID: <org_id>
   ✅ Projet créé
   ```
4. Vérifier: **PAS d'erreur "Organization ID manquant"**

### Test 3: Hook useCurrentOrganization
1. Ouvrir console navigateur (F12)
2. Aller sur `/cockpit`
3. Vérifier logs:
   ```
   🔍 Récupération organization_id...
   ✅ Organization ID trouvé: <org_id>
   ```

### Test 4: Fallback Memberships
1. Supprimer temporairement `organization_id` de user_metadata dans Supabase
2. Rafraîchir `/cockpit`
3. Vérifier logs:
   ```
   ⚠️ Organization ID absent de user_metadata
   ✅ Organization ID trouvé via memberships
   🔄 Mise à jour user_metadata
   ```

### Test 5: RLS Policies
```sql
-- Vérifier auth.uid() fonctionne
SELECT auth.uid() as current_user_id;

-- Tester lecture projets
SELECT id, name, organization_id 
FROM projects 
WHERE organization_id IN (
  SELECT organization_id FROM memberships WHERE user_id = auth.uid()
);
```

### Test 6: Correction Utilisateurs Existants
```sql
-- Diagnostiquer
SELECT COUNT(*) FROM auth.users au
LEFT JOIN memberships m ON m.user_id = au.id
WHERE m.id IS NULL;

-- Corriger
SELECT * FROM fix_all_missing_organizations();
```

---

## 🚨 Troubleshooting

### "Organization ID manquant" persiste

**Solution 1**: Se déconnecter et se reconnecter
```typescript
await supabase.auth.signOut();
// Se reconnecter via /login
```

**Solution 2**: Vérifier user_metadata
```sql
SELECT id, email, raw_user_meta_data->>'organization_id' 
FROM auth.users 
WHERE email = 'USER_EMAIL';
```

**Solution 3**: Vérifier membership
```sql
SELECT * FROM memberships WHERE user_id = 'USER_ID';
```

**Solution 4**: Exécuter script correction
```sql
SELECT * FROM fix_missing_organization_for_user('USER_ID');
```

---

### Erreur lors de l'inscription

**Erreur**: "Cannot insert into organizations"
- **Cause**: Table `organizations` n'existe pas
- **Solution**: Exécuter `database/schema-auth-roles.sql`

**Erreur**: "Foreign key violation"
- **Cause**: Référence invalide
- **Solution**: Vérifier ordre d'exécution SQL (organizations → memberships)

---

### Hook retourne null

**Cause 1**: Utilisateur non authentifié
- **Solution**: Se connecter d'abord

**Cause 2**: Pas de membership
- **Solution**: Exécuter script FIX 5

**Cause 3**: Table memberships n'existe pas
- **Solution**: Exécuter `database/schema-auth-roles.sql`

---

## ✅ Checklist de Validation

- [x] **FIX 1**: Code signup modifié avec création org + membership + metadata
- [x] **FIX 2**: Hook useCurrentOrganization créé avec fallback memberships
- [x] **FIX 3**: useLiveCockpit utilise organization_id + created_by
- [x] **FIX 4**: RLS policies correctes dans tous les schémas SQL
- [x] **FIX 5**: Script SQL correction créé avec fonctions
- [x] **FIX 6**: refreshSession() ajouté après création org
- [x] **FIX 7**: Guide de test complet créé
- [x] **Build**: ✅ 167 pages, 0 erreur TypeScript
- [x] **Déploiement**: ✅ https://www.powalyze.com
- [ ] **Test inscription**: En attente test utilisateur
- [ ] **Test création projet**: En attente test utilisateur
- [ ] **Test RLS**: En attente vérification Supabase
- [ ] **Exécution schémas SQL**: En attente exécution dans Supabase

---

## 📝 Fichiers Créés/Modifiés

### Modifiés:
1. ✅ `app/api/auth/signup/route.ts` - Création auto org + membership + metadata
2. ✅ `hooks/useLiveCockpit.ts` - Utilisation organization_id (déjà fait)
3. ✅ `lib/supabase/client.ts` - Client createBrowserClient (fix précédent)

### Créés:
4. ✅ `hooks/useCurrentOrganization.ts` - Hook + fonction async
5. ✅ `database/fix-missing-organizations.sql` - Script correction
6. ✅ `GUIDE-TEST-FIX-ORGANIZATION-ID.md` - Guide test complet
7. ✅ `FIX-ORGANIZATION-ID-SUMMARY.md` - Ce fichier (résumé)

### Existants (RLS correctes):
8. ✅ `database/schema-auth-roles.sql` - Tables org + memberships + RLS
9. ✅ `database/schema-billing-automations-onboarding.sql` - RLS billing + automations

---

## 🎯 Prochaines Étapes

### IMMÉDIAT (Manuel):
1. **Exécuter schémas SQL dans Supabase** (si pas déjà fait):
   ```sql
   -- Dans Supabase SQL Editor:
   -- 1) Exécuter database/schema-auth-roles.sql
   -- 2) Exécuter database/schema-billing-automations-onboarding.sql
   ```

2. **Tester nouvelle inscription**:
   - Créer un nouveau compte
   - Vérifier que organization + membership sont créés
   - Vérifier user_metadata contient organization_id

3. **Tester création projet**:
   - Login avec le nouveau compte
   - Créer un projet
   - Vérifier: PAS d'erreur "Organization ID manquant"

4. **Corriger utilisateurs existants** (si nécessaire):
   ```sql
   -- Si des utilisateurs existent sans organization:
   SELECT * FROM fix_all_missing_organizations();
   ```

### MOYEN TERME:
5. Monitorer logs Vercel pour erreurs signup
6. Vérifier RLS policies fonctionnent correctement
7. Tester fallback memberships en supprimant temporairement organization_id de user_metadata

### LONG TERME:
8. Implémenter PACK 17 (Zustand optimization + Suspense)
9. Configurer Vercel Cron pour automations
10. Tester billing limits avec plans Stripe

---

## 📚 Documentation Complémentaire

- **Guide Test Détaillé**: [GUIDE-TEST-FIX-ORGANIZATION-ID.md](GUIDE-TEST-FIX-ORGANIZATION-ID.md)
- **Script SQL Correction**: [database/fix-missing-organizations.sql](database/fix-missing-organizations.sql)
- **Schema Auth**: [database/schema-auth-roles.sql](database/schema-auth-roles.sql)
- **Fix Client Supabase**: [FIX-DEFINITIF-APPLIQUE.md](FIX-DEFINITIF-APPLIQUE.md)

---

**Date d'Application**: 30 Janvier 2026  
**Version**: v2.0.0 (167 pages)  
**Build**: ✅ Successful  
**Déploiement**: ✅ https://www.powalyze.com  
**Status**: ✅ **APPLIQUÉ ET DÉPLOYÉ - EN ATTENTE DE TEST**
