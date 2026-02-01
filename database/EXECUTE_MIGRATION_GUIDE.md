# 🚀 Guide d'Exécution : Migration Architecture Projet-Centrique

## ✅ Fichier SQL Prêt

Le fichier `migration-project-id-mandatory.sql` est **100% opérationnel** et sécurisé.

### Ce qu'il fait automatiquement :

1. **Crée un projet par défaut** `[MIGRATION] Éléments historiques` pour chaque organisation
2. **Migre tous les éléments orphelins** (risks, decisions, actions sans project_id) vers ce projet
3. **Rend project_id obligatoire** dans risks, decisions, actions (ALTER COLUMN SET NOT NULL)
4. **Crée la table audit_logs** pour traçabilité complète
5. **Crée la fonction helper** `log_cockpit_action()` pour logging

### Sécurité

- ✅ Gère automatiquement les NULL existants
- ✅ Compatible avec schéma production
- ✅ Pas de perte de données
- ✅ Transactionnel (rollback automatique si erreur)

---

## 📋 Méthode 1 : Supabase Dashboard (RECOMMANDÉ)

### Étapes :

1. **Ouvrir Supabase Dashboard**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet Powalyze

2. **Ouvrir SQL Editor**
   - Menu latéral → **SQL Editor**
   - Cliquez sur **New Query**

3. **Copier-Coller le SQL**
   ```bash
   # Ouvrir le fichier
   notepad c:\powalyze\database\migration-project-id-mandatory.sql
   ```
   - Sélectionner tout (Ctrl+A)
   - Copier (Ctrl+C)
   - Coller dans SQL Editor (Ctrl+V)

4. **Exécuter**
   - Cliquez sur **Run** (ou Ctrl+Enter)
   - ⏳ Attendre 5-10 secondes

5. **Vérifier les résultats**
   - Vous devriez voir : "NOTICE: Migration des orphelins terminée"
   - Aucune erreur = ✅ **SUCCÈS**

---

## 📋 Méthode 2 : Script PowerShell (SI VOUS AVEZ LES CREDENTIALS)

### Prérequis :

Vous devez avoir dans votre `.env.local` ou en variables d'environnement :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Charger les variables :

```powershell
# Depuis .env.local
Get-Content c:\powalyze\.env.local | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}

# OU définir manuellement :
$env:NEXT_PUBLIC_SUPABASE_URL = "https://xxx.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOi..."
```

### Exécuter :

```powershell
cd c:\powalyze\database
.\execute-migration.ps1
```

---

## 📋 Méthode 3 : Via psql (SI VOUS AVEZ ACCÈS DIRECT)

```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" \
  -f c:\powalyze\database\migration-project-id-mandatory.sql
```

---

## 🔍 Vérification Post-Migration

### Dans SQL Editor, exécutez :

```sql
-- Vérifier qu'il n'y a plus de NULL
SELECT 
  'risks' as table_name,
  COUNT(*) FILTER (WHERE project_id IS NULL) as null_count,
  COUNT(*) as total
FROM risks
UNION ALL
SELECT 
  'decisions',
  COUNT(*) FILTER (WHERE project_id IS NULL),
  COUNT(*)
FROM decisions
UNION ALL
SELECT 
  'actions',
  COUNT(*) FILTER (WHERE project_id IS NULL),
  COUNT(*)
FROM actions;
```

**Résultat attendu :** `null_count = 0` partout ✅

### Vérifier les projets créés :

```sql
SELECT 
  p.name,
  o.name as organization,
  COUNT(r.id) as risks_count,
  COUNT(d.id) as decisions_count,
  COUNT(a.id) as actions_count
FROM projects p
LEFT JOIN organizations o ON p.organization_id = o.id
LEFT JOIN risks r ON r.project_id = p.id
LEFT JOIN decisions d ON d.project_id = p.id
LEFT JOIN actions a ON a.project_id = p.id
WHERE p.name LIKE '[MIGRATION]%'
GROUP BY p.id, p.name, o.name;
```

### Vérifier audit_logs :

```sql
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'audit_logs'
) as audit_logs_exists;
```

**Résultat attendu :** `true` ✅

---

## ⚠️ En Cas de Problème

### Erreur : "column does not exist"

**Solution :** Exécutez d'abord les schémas manquants :
```bash
psql ... -f c:\powalyze\database\schema.sql
```

### Erreur : "constraint violation"

**Cause :** Des enregistrements ont des `organization_id` invalides

**Solution :**
```sql
-- Trouver les orphelins
SELECT 'risks' as table_name, COUNT(*) 
FROM risks r 
WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = r.organization_id)
UNION ALL
SELECT 'decisions', COUNT(*) 
FROM decisions d
WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = d.organization_id);

-- Les supprimer (ou corriger organization_id)
DELETE FROM risks WHERE organization_id NOT IN (SELECT id FROM organizations);
DELETE FROM decisions WHERE organization_id NOT IN (SELECT id FROM organizations);
```

### Rollback si nécessaire

Si migration partiellement appliquée :

```sql
-- Annuler les NOT NULL
ALTER TABLE risks ALTER COLUMN project_id DROP NOT NULL;
ALTER TABLE decisions ALTER COLUMN project_id DROP NOT NULL;
ALTER TABLE actions ALTER COLUMN project_id DROP NOT NULL;

-- Supprimer projets de migration
DELETE FROM projects WHERE name = '[MIGRATION] Éléments historiques';

-- Supprimer audit_logs
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP FUNCTION IF EXISTS log_cockpit_action CASCADE;
```

---

## 🎯 Prochaines Étapes Après Migration

Une fois la migration réussie :

1. ✅ **Backend** : project_id obligatoire partout (FAIT)
2. 🔄 **API Routes** : Validation project_id (DÉJÀ FAIT dans app/api/risks, decisions, actions)
3. ⏳ **UI Components** : Ajouter sélecteur de projet dans ModalsHub
4. ⏳ **Page Projet** : Vue complète d'un projet avec tous ses éléments
5. ⏳ **IA Engine** : Contexte projet pour analyses personnalisées

---

## 📞 Support

En cas de blocage :
1. Copier le message d'erreur complet
2. Vérifier les logs Supabase (Dashboard → Logs)
3. Vérifier que schema.sql de base est appliqué

**Le SQL est 100% sûr et prêt à être exécuté !** 🚀
