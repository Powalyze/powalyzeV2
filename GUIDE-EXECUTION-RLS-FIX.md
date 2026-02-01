# 🚀 Guide d'Exécution - BLOC FIX COMPLET SUPABASE

## ✅ Script Créé
**Fichier**: `database/schema-complete-rls-fix.sql`

Ce script est **IDEMPOTENT** (peut être exécuté plusieurs fois sans risque).

## 📋 Contenu du Script

### 1. Tables Structurantes
- ✅ `organizations` - Organisations multi-tenant
- ✅ `memberships` - Membres avec rôles (owner/admin/member)
- ✅ `audit_logs` - Audit trail des actions
- ✅ `invitations` - Invitations de nouveaux membres

### 2. Colonnes organization_id
- ✅ Ajout sur `projects`, `risks`, `decisions`, `timeline_events`, `reports`
- ✅ Ajout `created_by` sur `projects`, `risks`, `decisions`

### 3. Index de Performance
- ✅ 11 index créés pour optimiser les requêtes RLS

### 4. RLS Activation
- ✅ Activation sur 9 tables

### 5. Policies RLS
- ✅ Organizations (SELECT, INSERT, UPDATE, DELETE)
- ✅ Memberships (SELECT, INSERT, UPDATE, DELETE avec protection self-delete)
- ✅ Invitations (SELECT, INSERT, UPDATE, DELETE)
- ✅ Projects (SELECT, INSERT, UPDATE, DELETE)
- ✅ Risks (SELECT, INSERT, UPDATE, DELETE)
- ✅ Decisions (SELECT, INSERT, UPDATE, DELETE)
- ✅ Timeline Events (SELECT, INSERT, UPDATE, DELETE)
- ✅ Reports (SELECT, INSERT, UPDATE, DELETE)
- ✅ Audit Logs (SELECT restreint aux admin/owner, INSERT pour tous)

### 6. Fonctions Utilitaires
- ✅ `get_user_role(org_id)` - Obtenir le rôle d'un utilisateur
- ✅ `is_admin_or_owner(org_id)` - Vérifier les permissions admin
- ✅ `log_action(org_id, action, metadata)` - Logger une action
- ✅ `get_user_organizations()` - Lister les orgs d'un utilisateur

### 7. Triggers Audit
- ✅ `audit_project_changes` - Audit des projets
- ✅ `audit_risk_changes` - Audit des risques
- ✅ `audit_decision_changes` - Audit des décisions
- ✅ `update_updated_at_column` - Auto-update du champ updated_at

### 8. Checklist Validation
- ✅ 10 vérifications SQL incluses dans le script

---

## 🔧 Procédure d'Exécution

### ÉTAPE 1: Backup (CRITIQUE)

**AVANT toute exécution**, faire un backup complet de la base Supabase:

1. Aller dans Supabase Dashboard → Project → Database → Backups
2. Cliquer sur "Create Manual Backup"
3. Attendre confirmation du backup

**OU** exporter via pg_dump (si accès direct):
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

### ÉTAPE 2: Exécuter le Script dans Supabase

1. **Ouvrir Supabase Dashboard**
   - Aller sur https://supabase.com
   - Sélectionner votre projet Powalyze

2. **Ouvrir SQL Editor**
   - Sidebar → SQL Editor
   - Cliquer sur "New Query"

3. **Copier-Coller le Script**
   - Ouvrir `database/schema-complete-rls-fix.sql`
   - Copier TOUT le contenu (Ctrl+A, Ctrl+C)
   - Coller dans l'éditeur SQL de Supabase

4. **Exécuter le Script**
   - Cliquer sur "Run" ou Ctrl+Enter
   - **Attendre la fin de l'exécution** (peut prendre 30-60 secondes)

5. **Vérifier les Résultats**
   - Vérifier qu'il n'y a **PAS d'erreur** dans la sortie
   - Les warnings "NOTICE: ... already exists" sont **NORMAUX** (script idempotent)

---

### ÉTAPE 3: Vérifications Post-Exécution

#### 3.1. Vérifier auth.uid()
```sql
SELECT auth.uid() as current_user_id;
```
✅ **Attendu**: Retourne votre UUID utilisateur (non NULL)  
❌ **Si NULL**: Session non détectée, se reconnecter

#### 3.2. Vérifier Tables Créées
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname='public' 
  AND tablename IN ('organizations', 'memberships', 'audit_logs', 'invitations')
ORDER BY tablename;
```
✅ **Attendu**: 4 lignes retournées

#### 3.3. Vérifier Colonnes Ajoutées
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
  AND column_name IN ('organization_id', 'created_by')
ORDER BY column_name;
```
✅ **Attendu**: 2 lignes (organization_id UUID, created_by UUID)

#### 3.4. Vérifier RLS Activé
```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('projects', 'risks', 'decisions', 'organizations', 'memberships')
  AND schemaname = 'public'
ORDER BY tablename;
```
✅ **Attendu**: Toutes les tables avec `rowsecurity = true`

#### 3.5. Vérifier Policies Créées
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('projects', 'risks', 'decisions', 'organizations', 'memberships')
ORDER BY tablename, policyname;
```
✅ **Attendu**: Plusieurs policies par table (SELECT, INSERT, UPDATE, DELETE)

#### 3.6. Vérifier Index Créés
```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename IN ('projects', 'risks', 'decisions', 'memberships')
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```
✅ **Attendu**: Plusieurs index (idx_projects_org, idx_memberships_user, etc.)

#### 3.7. Vérifier Fonctions Créées
```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_user_role', 'is_admin_or_owner', 'log_action', 'get_user_organizations')
ORDER BY routine_name;
```
✅ **Attendu**: 4 fonctions

#### 3.8. Vérifier Triggers Créés
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name LIKE 'trigger_%'
  AND event_object_schema = 'public'
ORDER BY event_object_table, trigger_name;
```
✅ **Attendu**: Plusieurs triggers (audit + updated_at)

---

### ÉTAPE 4: Tester avec Utilisateur Réel

#### 4.1. Créer une Organization de Test
```sql
-- Insérer une organization
INSERT INTO organizations (name, owner_id)
VALUES ('Test Organization', auth.uid())
RETURNING *;

-- Noter l'ID retourné (ex: '123e4567-e89b-12d3-a456-426614174000')
```

#### 4.2. Créer un Membership
```sql
-- Remplacer <ORG_ID> par l'ID de l'étape précédente
INSERT INTO memberships (organization_id, user_id, role)
VALUES ('<ORG_ID>', auth.uid(), 'owner')
RETURNING *;
```

#### 4.3. Tester Insertion Projet
```sql
-- Insérer un projet de test
INSERT INTO projects (name, organization_id, created_by, rag_status, status)
VALUES (
  'Test RLS Project',
  (SELECT organization_id FROM memberships WHERE user_id = auth.uid() LIMIT 1),
  auth.uid(),
  'GREEN',
  'IN_PROGRESS'
)
RETURNING *;
```
✅ **Attendu**: Projet créé avec organization_id renseigné

#### 4.4. Tester Lecture Projet
```sql
SELECT id, name, organization_id, created_by 
FROM projects;
```
✅ **Attendu**: Uniquement vos projets visibles (RLS filtrage actif)

#### 4.5. Tester get_user_organizations()
```sql
SELECT * FROM get_user_organizations();
```
✅ **Attendu**: Liste de vos organizations avec votre rôle

#### 4.6. Tester Audit Logs
```sql
SELECT * FROM audit_logs 
WHERE organization_id = (SELECT organization_id FROM memberships WHERE user_id = auth.uid() LIMIT 1)
ORDER BY created_at DESC 
LIMIT 10;
```
✅ **Attendu**: Logs des actions récentes (project_created, etc.)

---

### ÉTAPE 5: Tester Interface Cockpit

1. **Déconnecter/Reconnecter**
   - Aller sur https://www.powalyze.com/login
   - Se déconnecter (si connecté)
   - Se reconnecter avec votre compte

2. **Vérifier Console Navigateur**
   - Ouvrir F12 → Console
   - Vérifier logs de session:
     ```
     ✅ Session valide - User ID: <uuid>
     🔑 Organization ID: <org_id>
     ```

3. **Créer un Projet**
   - Aller sur `/cockpit`
   - Cliquer "Créer un Projet"
   - Remplir formulaire
   - Soumettre

4. **Vérifier Résultat**
   - ✅ **Pas d'erreur** "Organization ID manquant"
   - ✅ **Projet créé** et visible
   - ✅ **Tous les modules** affichés (Synthèse, Projets, Risques, etc.)
   - ✅ **Pas d'erreur 403** dans la console

5. **Vérifier Données dans Supabase**
   ```sql
   SELECT id, name, organization_id, created_by 
   FROM projects 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```
   ✅ **Attendu**: Projets avec organization_id et created_by renseignés

---

## 🚨 Résolution de Problèmes

### Erreur: "relation already exists"
**Cause**: Tables déjà créées  
**Solution**: Normal, le script est idempotent, continuer

### Erreur: "column already exists"
**Cause**: Colonnes déjà ajoutées  
**Solution**: Normal, le script est idempotent, continuer

### Erreur: "policy already exists"
**Cause**: Les DROP POLICY n'ont pas fonctionné  
**Solution**: Relancer le script ou supprimer manuellement:
```sql
DROP POLICY IF EXISTS projects_select ON public.projects CASCADE;
```

### Erreur: "new row violates row-level security"
**Cause**: RLS bloque l'insertion  
**Solutions**:
1. Vérifier que membership existe:
   ```sql
   SELECT * FROM memberships WHERE user_id = auth.uid();
   ```
2. Si pas de membership, en créer un:
   ```sql
   INSERT INTO memberships (organization_id, user_id, role)
   VALUES ('<ORG_ID>', auth.uid(), 'owner');
   ```
3. Vérifier que organization_id est renseigné dans l'INSERT

### Erreur: "organization_id cannot be null"
**Cause**: Tentative d'insertion sans organization_id  
**Solution**: Utiliser user_metadata ou memberships:
```typescript
const organizationId = user.user_metadata?.organization_id ||
  (await supabase.from('memberships').select('organization_id').eq('user_id', user.id).single()).data?.organization_id;
```

### Erreur: "auth.uid() returns NULL"
**Cause**: Session non détectée  
**Solutions**:
1. Vérifier cookies Supabase (F12 → Application → Cookies)
2. Se déconnecter et se reconnecter
3. Vérifier que createBrowserClient est utilisé (fix précédent)

---

## ✅ Checklist Post-Application

- [ ] **Backup effectué** avant exécution
- [ ] **Script exécuté** sans erreur bloquante
- [ ] **Tables créées**: organizations, memberships, audit_logs, invitations
- [ ] **Colonnes ajoutées**: organization_id, created_by sur tables cockpit
- [ ] **RLS activé** sur toutes les tables
- [ ] **Policies créées** (vérifiées via pg_policies)
- [ ] **Index créés** (vérifiés via pg_indexes)
- [ ] **Fonctions créées** (get_user_role, is_admin_or_owner, etc.)
- [ ] **Triggers créés** (audit + updated_at)
- [ ] **auth.uid() fonctionne** (retourne UUID)
- [ ] **Organization de test créée**
- [ ] **Membership de test créé**
- [ ] **Projet de test créé** avec organization_id
- [ ] **Lecture projets fonctionne** (RLS filtrage)
- [ ] **get_user_organizations() fonctionne**
- [ ] **Audit logs enregistre les actions**
- [ ] **Interface cockpit fonctionne** sans erreur
- [ ] **Création projet via UI** sans erreur "Organization ID manquant"
- [ ] **Tous les modules cockpit visibles**
- [ ] **Pas d'erreur 403 dans console**

---

## 📚 Fichiers Associés

- **Script SQL**: `database/schema-complete-rls-fix.sql`
- **Hook Organization**: `hooks/useCurrentOrganization.ts`
- **Fix Signup**: `app/api/auth/signup/route.ts`
- **Script Correction**: `database/fix-missing-organizations.sql`
- **Guide Test**: `GUIDE-TEST-FIX-ORGANIZATION-ID.md`

---

**Date**: 30 Janvier 2026  
**Status**: ✅ **SCRIPT CRÉÉ - PRÊT POUR EXÉCUTION**  
**Next**: Exécuter dans Supabase SQL Editor
