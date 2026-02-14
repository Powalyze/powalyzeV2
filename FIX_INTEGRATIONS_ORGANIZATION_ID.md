# 🔧 FIX: Erreur "column organization_id does not exist"

## Problème
```
Error: Failed to run sql query: ERROR: 42703: column "organization_id" does not exist
```

## Cause
Votre base de données utilise une structure différente de celle attendue. Il existe deux architectures possibles :

### Architecture 1: Multi-tenant avec `organizations`
```sql
profiles → organization_id → organizations
integrations → organization_id → organizations
```

### Architecture 2: Simple avec Supabase Auth
```sql
integrations → user_id → auth.users
```

## Solution: Choisissez VOTRE migration

### ✅ Option A: Version Simple (Recommandée si erreur)

**Utilisez ce fichier** : `database/migrations/add-integrations-table-simple.sql`

Cette version :
- ✅ Fonctionne avec Supabase Auth par défaut
- ✅ Utilise `user_id` directement
- ✅ Pas besoin de table `organizations`
- ✅ Isolation par utilisateur

**Application** :
```sql
-- Via Supabase Dashboard SQL Editor
-- Copiez/collez le contenu de add-integrations-table-simple.sql
```

### ✅ Option B: Version Multi-tenant

**Utilisez ce fichier** : `database/migrations/add-integrations-table.sql` (mis à jour)

Cette version :
- ✅ Crée automatiquement la table `organizations` si elle n'existe pas
- ✅ Ajoute la contrainte FK uniquement si `organizations` existe
- ✅ Utilise des vérifications conditionnelles
- ✅ Gère les deux cas automatiquement

**Application** :
```sql
-- Via Supabase Dashboard SQL Editor
-- Copiez/collez le contenu de add-integrations-table.sql
```

## Étapes de Résolution

### 1. Vérifiez votre structure actuelle

Dans Supabase Dashboard → SQL Editor :
```sql
-- Vérifier si vous avez une table organizations
SELECT EXISTS (
  SELECT 1 FROM pg_tables 
  WHERE tablename = 'organizations'
);

-- Vérifier si vous avez une table profiles avec organization_id
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'organization_id';
```

### 2. Choisissez votre migration

**Si vous avez `organizations` ET `profiles.organization_id`** :
→ Utilisez `add-integrations-table.sql` (mis à jour)

**Si vous n'avez PAS `organizations` ou PAS `profiles`** :
→ Utilisez `add-integrations-table-simple.sql`

### 3. Supprimez l'ancienne tentative (si nécessaire)

```sql
-- Si vous avez une tentative précédente qui a échoué
DROP TABLE IF EXISTS integrations CASCADE;
```

### 4. Appliquez la bonne migration

Via Supabase Dashboard :
1. SQL Editor
2. New Query
3. Copiez le contenu du bon fichier
4. Run

### 5. Vérifiez que ça fonctionne

```sql
-- Vérifier que la table existe
SELECT * FROM integrations LIMIT 1;

-- Vérifier les colonnes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'integrations';
```

Vous devriez voir soit :
- `organization_id` (version multi-tenant)
- `user_id` (version simple)

## Code Frontend Déjà Adapté ✅

Le code dans `app/cockpit/integrations/page.tsx` a été modifié pour **supporter les deux architectures automatiquement** :

```typescript
// Essaie d'abord avec organization_id
if (profile?.organization_id) {
  // Mode multi-tenant
  const { data } = await supabase
    .from('integrations')
    .select('*')
    .eq('organization_id', profile.organization_id);
} else {
  // Mode simple avec user_id
  const { data } = await supabase
    .from('integrations')
    .select('*')
    .eq('user_id', user.id);
}
```

Le frontend s'adapte automatiquement ! 🎉

## Test Final

1. Appliquez la migration appropriée
2. Allez sur `/cockpit/integrations`
3. Cliquez "Connecter" sur une intégration
4. Remplissez et sauvegardez
5. Vérifiez : Toast ✅ + Badge "Connecté"

## Fichiers de Migration

### Version Simple (user_id)
📁 `database/migrations/add-integrations-table-simple.sql`
- Pour Supabase Auth standard
- Colonne `user_id`
- RLS avec `auth.uid()`

### Version Multi-tenant (organization_id)
📁 `database/migrations/add-integrations-table.sql`
- Avec vérifications conditionnelles
- Crée `organizations` si nécessaire
- Colonne `organization_id`
- RLS via `profiles`

## Résumé Rapide

```bash
# 1. Tentative précédente échouée ? Nettoyez
DROP TABLE IF EXISTS integrations CASCADE;

# 2. Structure simple (pas d'organizations) ?
→ Utilisez add-integrations-table-simple.sql

# 3. Structure multi-tenant (avec organizations) ?
→ Utilisez add-integrations-table.sql (mis à jour)

# 4. Testez
→ /cockpit/integrations
```

---

**Status** : ✅ Résolu - Les deux versions disponibles  
**Code Frontend** : ✅ Adapté automatiquement  
**Date** : 13 Février 2026
