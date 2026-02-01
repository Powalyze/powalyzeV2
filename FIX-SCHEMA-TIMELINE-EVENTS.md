# 🔧 FIX SCHEMA - Table timeline_events Manquante

**Date**: 30 janvier 2026  
**Erreur**: `ERROR: 42P01: relation "public.timeline_events" does not exist`  
**Status**: ✅ **CORRIGÉ**

---

## 🎯 PROBLÈME

Lors de l'exécution de `schema-complete-rls-fix.sql`, l'erreur suivante se produit :

```
ERROR: 42P01: relation "public.timeline_events" does not exist
```

**Cause** : Le schema original supposait que toutes les tables (`projects`, `risks`, `decisions`, `timeline_events`, `reports`) existaient déjà. Or, `timeline_events` et `reports` peuvent ne pas exister dans certaines bases de données.

---

## ✅ SOLUTION APPLIQUÉE

### Modifications apportées au schema SQL

#### 1. **Création des tables manquantes**

Ajout de `CREATE TABLE IF NOT EXISTS` pour `timeline_events` et `reports` :

```sql
--------------------------------------------------
-- 2) CRÉER TABLES MANQUANTES (SI NÉCESSAIRE)
--------------------------------------------------

-- Créer timeline_events si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  project_id UUID,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- Créer reports si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  title TEXT NOT NULL,
  content TEXT,
  period TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. **Gestion conditionnelle des colonnes**

Remplacement de `ALTER TABLE IF EXISTS` par des blocs `DO $$` :

**Avant (problématique)** :
```sql
ALTER TABLE IF EXISTS public.timeline_events
  ADD COLUMN IF NOT EXISTS organization_id UUID;
```

**Après (corrigé)** :
```sql
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'timeline_events') THEN
    ALTER TABLE public.timeline_events ADD COLUMN IF NOT EXISTS organization_id UUID;
  END IF;
END $$;
```

#### 3. **Index avec vérification d'existence**

**Avant (problématique)** :
```sql
CREATE INDEX IF NOT EXISTS idx_timeline_org ON public.timeline_events(organization_id);
```

**Après (corrigé)** :
```sql
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
    CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
  END IF;
  
  -- Timeline events (toujours créée maintenant)
  CREATE INDEX IF NOT EXISTS idx_timeline_org ON public.timeline_events(organization_id);
END $$;
```

#### 4. **RLS avec vérification d'existence**

**Avant (problématique)** :
```sql
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
```

**Après (corrigé)** :
```sql
-- Toujours activer RLS sur les tables créées par ce script
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Activer RLS conditionnellement sur les tables qui peuvent exister
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
    ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;
```

---

## 🚀 EXÉCUTION DU SCHEMA CORRIGÉ

### Étape 1 : Backup (CRITIQUE ⚠️)

```bash
# Dans Supabase Dashboard
1. Project → Database → Backups
2. Click "Create Manual Backup"
3. Wait for confirmation
```

### Étape 2 : Exécuter le schema corrigé

```bash
# Dans Supabase SQL Editor
1. Ouvrir SQL Editor → New Query
2. Copier le contenu complet de schema-complete-rls-fix.sql (corrigé)
3. Coller dans l'éditeur
4. Click "Run" (Ctrl+Enter)
5. Attendre 30-60 secondes
```

### Étape 3 : Vérifier la création des tables

```sql
-- Vérifier que timeline_events existe maintenant
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('timeline_events', 'reports', 'organizations', 'memberships');
```

**Résultat attendu** :
```
timeline_events
reports
organizations
memberships
```

### Étape 4 : Vérifier les colonnes

```sql
-- Vérifier que organization_id a été ajouté
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND column_name = 'organization_id'
  AND table_name IN ('timeline_events', 'reports', 'projects', 'risks', 'decisions');
```

**Résultat attendu** :
```
timeline_events | organization_id
reports         | organization_id
projects        | organization_id
risks           | organization_id
decisions       | organization_id
```

### Étape 5 : Vérifier les policies RLS

```sql
-- Vérifier les policies sur timeline_events
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'timeline_events';
```

**Résultat attendu** :
```
public | timeline_events | timeline_select
public | timeline_events | timeline_insert
public | timeline_events | timeline_update
public | timeline_events | timeline_delete
```

---

## 🧪 TEST DE FONCTIONNEMENT

### Test 1 : Insertion dans timeline_events

```sql
-- Créer un événement de test (remplacer <ORG_ID> par votre organization_id)
INSERT INTO timeline_events (
  organization_id,
  type,
  title,
  description
) VALUES (
  '<ORG_ID>',
  'test_event',
  'Test Event',
  'This is a test event'
) RETURNING *;
```

**Résultat attendu** : Une ligne est insérée et retournée.

### Test 2 : Lecture avec RLS

```sql
-- Vérifier que vous pouvez lire vos propres événements
SELECT * FROM timeline_events 
WHERE organization_id IN (
  SELECT organization_id FROM memberships WHERE user_id = auth.uid()
);
```

**Résultat attendu** : Vous voyez uniquement les événements de votre organisation.

### Test 3 : Vérifier isolation multi-tenant

```sql
-- Compter les événements (devrait être filtré par RLS)
SELECT COUNT(*) FROM timeline_events;
```

**Résultat attendu** : Nombre d'événements de votre organisation uniquement, pas tous les événements de la base.

---

## 📋 DIFFÉRENCES AVEC LA VERSION ORIGINALE

| Aspect | Version Originale | Version Corrigée |
|--------|-------------------|------------------|
| Table timeline_events | Supposée existante | **Créée si absente** |
| Table reports | Supposée existante | **Créée si absente** |
| ALTER TABLE IF EXISTS | Utilisé | **Remplacé par DO $$ blocks** |
| Index | Créés inconditionnellement | **Vérification d'existence** |
| RLS ENABLE | Inconditionnel | **Conditionnel pour tables optionnelles** |
| Gestion erreurs | Basique | **Robuste avec IF EXISTS** |

---

## ⚠️ NOTES IMPORTANTES

### Tables Créées par ce Script

Ce script **crée automatiquement** les tables suivantes si elles n'existent pas :
- ✅ `organizations`
- ✅ `memberships`
- ✅ `audit_logs`
- ✅ `invitations`
- ✅ `timeline_events` ← **NOUVEAU**
- ✅ `reports` ← **NOUVEAU**

### Tables Supposées Existantes (optionnelles)

Ce script **modifie** les tables suivantes si elles existent :
- ⚠️ `projects` (ajout organization_id, created_by)
- ⚠️ `risks` (ajout organization_id, created_by)
- ⚠️ `decisions` (ajout organization_id, created_by)

**Si ces tables n'existent pas**, elles doivent être créées manuellement ou via un autre script de migration.

---

## 🔗 DOCUMENTS CONNEXES

- **schema-complete-rls-fix.sql** : Schema SQL corrigé (808 lignes)
- **GUIDE-EXECUTION-RLS-FIX.md** : Guide complet d'exécution
- **BLOC-FIX-COMPLET-SUPABASE-SUMMARY.md** : Résumé de tous les fixes
- **FIX-COCKPIT-BLOQUE-CREATION-PROJET.md** : Fix du problème de blocage cockpit

---

## ✅ CHECKLIST POST-EXÉCUTION

- [ ] Backup créé avant exécution
- [ ] Script exécuté sans erreur bloquante
- [ ] Table `timeline_events` créée
- [ ] Table `reports` créée
- [ ] Colonne `organization_id` ajoutée sur toutes les tables
- [ ] Indexes créés avec succès
- [ ] RLS activé sur toutes les tables
- [ ] Policies créées (40+ policies)
- [ ] Test d'insertion réussi
- [ ] Test de lecture avec RLS réussi
- [ ] Isolation multi-tenant vérifiée

---

## 🎉 RÉSULTAT ATTENDU

Après exécution du schema corrigé :

1. ✅ **Tables manquantes créées** : `timeline_events` et `reports` existent maintenant
2. ✅ **Colonnes ajoutées** : `organization_id` sur toutes les tables cockpit
3. ✅ **RLS activé** : Toutes les tables ont Row Level Security
4. ✅ **Policies créées** : 40+ policies pour isolation multi-tenant
5. ✅ **Indexes créés** : 11 indexes pour optimiser les performances
6. ✅ **Audit logs** : Système d'audit complet avec triggers
7. ✅ **Fonctions utilitaires** : `get_user_role()`, `is_admin_or_owner()`, etc.

**Plus aucune erreur** : Le cockpit peut maintenant lire/écrire dans `timeline_events` et `reports` avec isolation multi-tenant complète.
