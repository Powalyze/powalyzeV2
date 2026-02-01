# 🎯 GUIDE: Test du Fix Organization ID Manquant

## ✅ Contexte
Ce guide permet de tester le **BLOC FIX - ORGANIZATION ID MANQUANT** qui résout l'erreur :
> "Organization ID manquant – Veuillez vous reconnecter"

## 🔧 Fixes Appliqués

### FIX 1: Création Automatique Organisation à l'Inscription ✅
**Fichier**: `app/api/auth/signup/route.ts`

Lors de l'inscription, le système crée automatiquement :
1. Une **organization** (nom basé sur company ou nom utilisateur)
2. Un **membership** avec role `owner`
3. Mise à jour de **user_metadata** avec `organization_id`
4. **Rafraîchissement de session** pour recharger les métadonnées

### FIX 2: Hook useCurrentOrganization ✅
**Fichier**: `hooks/useCurrentOrganization.ts`

Hook React pour récupérer l'organization_id avec stratégie de fallback :
1. **Primaire**: Lire `user_metadata.organization_id`
2. **Fallback**: Chercher dans table `memberships`
3. **Auto-sync**: Met à jour user_metadata si trouvé via memberships

**Exports**:
- `useCurrentOrganization()` - Hook React avec loading/error states
- `getCurrentOrganizationId()` - Fonction async pour API routes

### FIX 3: Utilisation organization_id ✅
**Fichier**: `hooks/useLiveCockpit.ts`

Déjà appliqué dans le fix précédent :
```typescript
const { data: insertedData, error } = await supabase.from('projects').insert({
  organization_id: organizationId,
  created_by: user.id,
  ...projectData,
});
```

### FIX 4: RLS Supabase ✅
**Fichiers**: `database/schema-auth-roles.sql`, `database/schema-billing-automations-onboarding.sql`

Toutes les policies RLS utilisent correctement :
```sql
USING (
  organization_id IN (
    SELECT organization_id FROM memberships WHERE user_id = auth.uid()
  )
)
```

### FIX 5: Script de Vérification & Correction ✅
**Fichier**: `database/fix-missing-organizations.sql`

Fonctions SQL pour diagnostiquer et corriger :
- `fix_missing_organization_for_user(user_id)` - Corriger UN utilisateur
- `fix_all_missing_organizations()` - Corriger TOUS les utilisateurs

### FIX 6: Reconnexion Après Inscription ✅
**Fichier**: `app/api/auth/signup/route.ts`

Après création organisation :
```typescript
await supabase.auth.refreshSession();
```

---

## 🧪 Procédure de Test

### ÉTAPE 1: Nouveau Compte (Test FIX 1)

1. **Créer un nouveau compte**
   - Aller sur https://www.powalyze.com/signup
   - Remplir le formulaire :
     - Email: `test-fix-org@example.com`
     - Mot de passe: `Test123456!`
     - Prénom: `Jean`
     - Nom: `Dupont`
     - Entreprise: `Test Corp`

2. **Ouvrir la console navigateur** (F12)
   - Onglet "Console"

3. **Soumettre le formulaire**

4. **Logs attendus dans la console serveur** (Vercel logs):
   ```
   ✅ [Signup] Utilisateur créé: <user_id>
   ✅ [Signup] Organisation créée: <org_id>
   ✅ [Signup] Membership créé pour user: <user_id>
   ✅ [Signup] user_metadata mis à jour avec organization_id: <org_id>
   ✅ [Signup] Session rafraîchie
   ```

5. **Vérification email**
   - Confirmer l'email (si nécessaire)

---

### ÉTAPE 2: Vérifier user_metadata dans Supabase

1. **Aller dans Supabase Dashboard**
   - Authentication → Users
   - Chercher l'utilisateur `test-fix-org@example.com`

2. **Vérifier User Metadata**
   ```json
   {
     "first_name": "Jean",
     "last_name": "Dupont",
     "company": "Test Corp",
     "organization_id": "<UUID_ORG>"
   }
   ```

   ✅ **Si `organization_id` est présent** → FIX 1 fonctionne

3. **Vérifier memberships**
   - SQL Editor → Exécuter :
   ```sql
   SELECT * FROM memberships WHERE user_id = '<user_id>';
   ```

   ✅ **Résultat attendu**:
   ```
   | id | organization_id | user_id | role  | created_at |
   |----|-----------------|---------|-------|------------|
   | .. | <org_id>        | <uid>   | owner | ...        |
   ```

4. **Vérifier organizations**
   ```sql
   SELECT * FROM organizations WHERE id = '<org_id>';
   ```

   ✅ **Résultat attendu**:
   ```
   | id       | name      | created_at |
   |----------|-----------|------------|
   | <org_id> | Test Corp | ...        |
   ```

---

### ÉTAPE 3: Test Hook useCurrentOrganization (FIX 2)

1. **Se connecter avec le compte test**
   - Login sur https://www.powalyze.com/login
   - Email: `test-fix-org@example.com`
   - Password: `Test123456!`

2. **Ouvrir console navigateur** (F12)

3. **Aller sur /cockpit**
   - URL: https://www.powalyze.com/cockpit

4. **Logs attendus dans la console**:
   ```
   🔍 [useCurrentOrganization] Récupération organization_id...
   ✅ [useCurrentOrganization] Utilisateur authentifié: <user_id>
   📦 [useCurrentOrganization] User metadata: { organization_id: <org_id>, ... }
   ✅ [useCurrentOrganization] Organization ID trouvé dans user_metadata: <org_id>
   ```

   ✅ **Si ces logs apparaissent** → FIX 2 fonctionne (stratégie primaire)

---

### ÉTAPE 4: Test Fallback Memberships

1. **Simuler absence de organization_id dans user_metadata**
   - Dans Supabase → Authentication → Users → Éditer user_metadata
   - **Supprimer** la clé `organization_id` temporairement

2. **Rafraîchir /cockpit**

3. **Logs attendus**:
   ```
   🔍 [useCurrentOrganization] Récupération organization_id...
   ✅ [useCurrentOrganization] Utilisateur authentifié: <user_id>
   ⚠️ [useCurrentOrganization] Organization ID absent de user_metadata, tentative via memberships...
   ✅ [useCurrentOrganization] Organization ID trouvé via memberships: <org_id>
   🔄 [useCurrentOrganization] Mise à jour user_metadata avec organization_id...
   ✅ [useCurrentOrganization] user_metadata mis à jour
   ```

   ✅ **Si ces logs apparaissent** → Fallback fonctionne

4. **Re-vérifier user_metadata dans Supabase**
   - L'`organization_id` doit être restauré automatiquement

---

### ÉTAPE 5: Test Création de Projet (FIX 3)

1. **Sur /cockpit, cliquer "Créer un Projet"**

2. **Remplir le formulaire**:
   - Nom: `Test Fix Organization`
   - Description: `Vérification organization_id`
   - RAG Status: `GREEN`

3. **Logs attendus dans la console**:
   ```
   📝 [useLiveCockpit] createProject appelé: {...}
   ✅ [useLiveCockpit] Session valide - User ID: <user_id>
   ✅ [useLiveCockpit] User metadata: { organization_id: <org_id>, ... }
   🔑 [useLiveCockpit] Organization ID: <org_id>
   💾 [useLiveCockpit] Insertion dans Supabase...
   ✅ [useLiveCockpit] Projet créé: { id: <project_id>, organization_id: <org_id>, ... }
   ```

   ✅ **Résultat attendu**:
   - ✅ **Pas d'erreur** "Organization ID manquant"
   - ✅ **Projet créé** avec succès
   - ✅ **Cockpit chargé** avec tous les modules visibles
   - ✅ **Projet visible** dans la liste

4. **Vérifier dans Supabase**:
   ```sql
   SELECT id, name, organization_id, created_by 
   FROM projects 
   WHERE name = 'Test Fix Organization';
   ```

   ✅ **Doit avoir**:
   - `organization_id` = `<org_id>` (non NULL)
   - `created_by` = `<user_id>` (non NULL)

---

### ÉTAPE 6: Test RLS (FIX 4)

1. **Exécuter dans SQL Editor**:
   ```sql
   -- Vérifier que auth.uid() fonctionne
   SELECT auth.uid() as current_user_id;
   
   -- Doit retourner votre user_id (non NULL)
   ```

2. **Tester lecture projets via RLS**:
   ```sql
   SELECT id, name, organization_id 
   FROM projects 
   WHERE organization_id IN (
     SELECT organization_id 
     FROM memberships 
     WHERE user_id = auth.uid()
   );
   
   -- Doit retourner vos projets
   ```

3. **Tester insertion via RLS**:
   ```sql
   INSERT INTO projects (name, organization_id, created_by)
   VALUES (
     'Test RLS',
     (SELECT organization_id FROM memberships WHERE user_id = auth.uid() LIMIT 1),
     auth.uid()
   )
   RETURNING *;
   
   -- Doit réussir si vous êtes membre d'une organisation
   ```

   ✅ **Si pas d'erreur 403** → RLS fonctionne

---

### ÉTAPE 7: Test Correction Utilisateurs Existants (FIX 5)

**Si vous avez des utilisateurs SANS organization** (créés avant le fix):

1. **Diagnostiquer**:
   ```sql
   -- Lister utilisateurs sans membership
   SELECT 
     au.id as user_id,
     au.email,
     au.raw_user_meta_data->>'first_name' as first_name,
     au.raw_user_meta_data->>'last_name' as last_name
   FROM auth.users au
   LEFT JOIN memberships m ON m.user_id = au.id
   WHERE m.id IS NULL;
   ```

2. **Corriger UN utilisateur**:
   ```sql
   SELECT * FROM fix_missing_organization_for_user('USER_ID_HERE');
   
   -- Résultat attendu:
   -- | organization_id | membership_id | status                                    |
   -- |-----------------|---------------|-------------------------------------------|
   -- | <new_org_id>    | <memb_id>     | SUCCESS: Organization and membership created |
   ```

3. **Corriger TOUS les utilisateurs**:
   ```sql
   SELECT * FROM fix_all_missing_organizations();
   ```

4. **Vérifier post-correction**:
   ```sql
   -- Vérifier qu'il n'y a plus d'utilisateurs sans membership
   SELECT COUNT(*) as users_without_membership
   FROM auth.users au
   LEFT JOIN memberships m ON m.user_id = au.id
   WHERE m.id IS NULL;
   
   -- Doit retourner: 0
   ```

---

## 🚨 Troubleshooting

### Problème: "Organization ID manquant" persiste

**Cause 1**: user_metadata non mis à jour
- **Solution**: Se déconnecter et se reconnecter
- **Vérifier**: Dans Supabase Dashboard que user_metadata contient `organization_id`

**Cause 2**: Membership n'existe pas
- **Solution**: Exécuter `SELECT * FROM fix_missing_organization_for_user('<user_id>');`
- **Vérifier**: `SELECT * FROM memberships WHERE user_id = '<user_id>';`

**Cause 3**: RLS bloque
- **Solution**: Exécuter `database/schema-auth-roles.sql` pour corriger les policies
- **Vérifier**: `SELECT auth.uid();` doit retourner votre user_id

---

### Problème: Erreur lors de l'inscription

**Erreur**: "Cannot insert into organizations"
- **Cause**: Table `organizations` n'existe pas
- **Solution**: Exécuter `database/schema-auth-roles.sql` dans Supabase SQL Editor

**Erreur**: "Cannot insert into memberships"
- **Cause**: Table `memberships` n'existe pas
- **Solution**: Exécuter `database/schema-auth-roles.sql`

**Erreur**: "Foreign key violation"
- **Cause**: Référence invalide
- **Solution**: Vérifier que `organizations.id` existe avant d'insérer dans `memberships`

---

### Problème: Hook useCurrentOrganization retourne null

**Cause 1**: Utilisateur non authentifié
- **Solution**: Se connecter d'abord

**Cause 2**: Pas de membership
- **Solution**: Exécuter script de correction FIX 5

**Cause 3**: user_metadata ET memberships vides
- **Solution**: 
  1. Créer manuellement une organization
  2. Créer manuellement un membership
  3. Mettre à jour user_metadata via Supabase Admin API

---

## ✅ Checklist de Validation Complète

- [ ] **FIX 1**: Nouvel utilisateur créé avec organization + membership + user_metadata
- [ ] **FIX 2**: Hook useCurrentOrganization récupère organization_id
- [ ] **FIX 2bis**: Fallback memberships fonctionne si user_metadata vide
- [ ] **FIX 3**: Création projet avec organization_id et created_by
- [ ] **FIX 4**: RLS permet lecture/écriture via memberships
- [ ] **FIX 5**: Script correction appliqué aux utilisateurs existants
- [ ] **FIX 6**: Session rafraîchie après inscription
- [ ] **FIX 7**: Cockpit affiche tous les modules sans erreur
- [ ] **Bonus**: Pas d'erreur 401/403 dans la console
- [ ] **Bonus**: Projets visibles immédiatement après création

---

## 📊 Résultats Attendus

### Inscription:
✅ Organization créée automatiquement  
✅ Membership (owner) créé  
✅ user_metadata mis à jour  
✅ Session rafraîchie  

### Cockpit:
✅ organization_id récupéré  
✅ Tous modules affichés  
✅ Création projet sans erreur  
✅ Données visibles  

### RLS:
✅ auth.uid() fonctionne  
✅ Memberships utilisés pour authorization  
✅ Pas de 403 Forbidden  

---

**Date**: 30 Janvier 2026  
**Version**: v2.0.0  
**Status**: ✅ **FIXES APPLIQUÉS - EN ATTENTE DE TEST**
