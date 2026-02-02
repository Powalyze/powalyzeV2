# 🔧 FIX: Erreur "no unique or exclusion constraint matching the ON CONFLICT specification"

## 🎯 Problème identifié

L'erreur se produit dans `lib/supabase-cockpit.ts` ligne 216 :

```typescript
await supabase
  .from('project_predictions')
  .upsert({ ... }, { onConflict: 'project_id' });
```

**Cause** : La table `project_predictions` **n'existe pas** dans Supabase.

## ✅ Solution (3 minutes)

### Étape 1 : Appliquer le schéma SQL

1. Ouvrir **Supabase Dashboard** → SQL Editor
2. Copier/coller le contenu de `database/schema-fix-unique-constraints.sql`
3. Cliquer **Run**

### Étape 2 : Vérifier que ça a fonctionné

Dans SQL Editor, exécutez :

```sql
-- Vérifier que la table existe
SELECT * FROM project_predictions LIMIT 1;

-- Vérifier la contrainte UNIQUE
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'project_predictions'::regclass;
```

Vous devez voir : `project_predictions_project_id_key` avec `contype = 'u'` (UNIQUE).

### Étape 3 : Tester la fonctionnalité

1. Aller sur `/cockpit/projets`
2. Créer un nouveau projet
3. L'IA devrait maintenant pouvoir sauvegarder les prédictions sans erreur

## 📋 Ce que le fix fait

### 1. Crée la table `project_predictions` ✅

```sql
CREATE TABLE project_predictions (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL UNIQUE,  -- ← UNIQUE ici résout l'erreur
  analyzed_at TIMESTAMPTZ,
  confidence DECIMAL,
  summary TEXT,
  risks JSONB,
  opportunities JSONB,
  recommended_actions JSONB,
  project_snapshot JSONB
);
```

### 2. Ajoute les RLS policies (sécurité) ✅

- SELECT, INSERT, UPDATE uniquement pour l'organisation du user
- Empêche l'accès cross-tenant

### 3. Ajoute des index pour performance ✅

- `idx_project_predictions_project` (recherche par projet)
- `idx_project_predictions_analyzed_at` (tri par date)

### 4. Trigger `updated_at` automatique ✅

Chaque UPDATE met à jour `updated_at = NOW()` automatiquement.

## 🧪 Test après fix

### Test manuel dans Supabase SQL Editor :

```sql
-- Insérer une prédiction (la première fois)
INSERT INTO project_predictions (
  project_id, 
  organization_id, 
  confidence, 
  summary
)
VALUES (
  'existing-project-id',
  'existing-org-id',
  85,
  'Test prediction'
)
ON CONFLICT (project_id) DO UPDATE SET
  confidence = EXCLUDED.confidence,
  summary = EXCLUDED.summary,
  analyzed_at = NOW();
```

**Si ça passe sans erreur** → Fix réussi ✅

**Si erreur "no rows returned by a query that expects one row"** → C'est normal, ça veut juste dire que `existing-project-id` n'existe pas, mais le SQL est correct.

## 🔥 Bonus: Contrainte optionnelle (recommandée)

Si vous voulez **empêcher 2 projets avec le même nom** dans une organisation :

```sql
ALTER TABLE projects
  ADD CONSTRAINT projects_org_name_unique UNIQUE (organization_id, name);
```

⚠️ **Attention** : Si vous avez déjà des projets en double, cette commande échouera.  
Dans ce cas, nettoyez d'abord les doublons :

```sql
-- Trouver les doublons
SELECT organization_id, name, COUNT(*) 
FROM projects 
GROUP BY organization_id, name 
HAVING COUNT(*) > 1;

-- Puis supprimer manuellement les doublons avant d'ajouter la contrainte
```

## 📊 Impact

- ✅ L'IA peut maintenant sauvegarder les prédictions de projets
- ✅ Pas de duplication (1 seule prédiction par projet)
- ✅ Mises à jour automatiques si nouvelle analyse lancée
- ✅ Isolation multi-tenant (RLS)
- ✅ Performance optimisée (index)

## 🚀 Prochaines étapes

1. Appliquer le fix SQL (2 min)
2. Tester création de projet (1 min)
3. Vérifier que l'IA fonctionne sans erreur
4. (Optionnel) Ajouter contrainte UNIQUE sur (org_id, name) pour projects

---

## 🐛 Si problème persiste

### Erreur : "relation project_predictions already exists"

→ La table existe déjà, mais sans la contrainte UNIQUE.

**Solution** :

```sql
-- Ajouter seulement la contrainte
ALTER TABLE project_predictions
  ADD CONSTRAINT project_predictions_project_id_unique UNIQUE (project_id);
```

### Erreur : "duplicate key value violates unique constraint"

→ Il y a déjà 2 prédictions pour le même projet.

**Solution** :

```sql
-- Garder seulement la plus récente
DELETE FROM project_predictions
WHERE id NOT IN (
  SELECT DISTINCT ON (project_id) id
  FROM project_predictions
  ORDER BY project_id, analyzed_at DESC
);

-- Puis ajouter la contrainte
ALTER TABLE project_predictions
  ADD CONSTRAINT project_predictions_project_id_unique UNIQUE (project_id);
```

---

**Temps total du fix** : ~3 minutes  
**Redémarrage nécessaire** : Non  
**Impact sur données existantes** : Aucun (table vide)
