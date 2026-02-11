# 🔧 FIX: Projets n'apparaissent pas dans le Cockpit

**Date**: 6 février 2026  
**Problème**: Les projets sont créés dans Supabase mais n'apparaissent pas dans l'interface  
**Cause**: Conflit entre schéma multi-tenant (organization_id) et ownership direct (owner_id)  

---

## 🔍 DIAGNOSTIC

### Symptômes
- ✅ Projets visibles dans Supabase Studio
- ❌ GET /api/projects retourne `[]` (liste vide)
- ❌ Projets n'apparaissent pas dans le cockpit

### Cause Racine
**Conflit de schéma RLS** :
1. Table `projects` a deux systèmes possibles :
   - `organization_id` + `organization_members` (multi-tenant)
   - `owner_id` (ownership direct)
2. Les policies RLS vérifient `owner_id = auth.uid()`
3. MAIS les projets n'ont peut-être pas de `owner_id` valide
4. OU les cookies d'authentification ne sont pas transmis correctement

---

## ✅ SOLUTION (Étapes)

### 1️⃣ Vérifier l'état actuel

**Dans Supabase SQL Editor**, exécutez :

```sql
-- Vérifier la structure de la table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
  AND column_name IN ('owner_id', 'organization_id');

-- Vérifier les données
SELECT id, name, owner_id, organization_id, status, created_at 
FROM projects 
ORDER BY created_at DESC;

-- Vérifier votre user_id
SELECT auth.uid() as my_user_id;

-- Vérifier si owner_id correspond
SELECT 
  id, 
  name, 
  owner_id, 
  (owner_id = auth.uid()) as belongs_to_me,
  (owner_id IS NULL) as no_owner
FROM projects;
```

### 2️⃣ Corriger les Policies RLS

```sql
-- =====================================
-- FIX COMPLET RLS PROJECTS
-- =====================================

-- S'assurer que la colonne owner_id existe
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS owner_id UUID;

-- Désactiver RLS temporairement
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les policies existantes
DROP POLICY IF EXISTS "projects_select" ON projects;
DROP POLICY IF EXISTS "projects_select_own" ON projects;
DROP POLICY IF EXISTS "projects_insert" ON projects;
DROP POLICY IF EXISTS "projects_insert_own" ON projects;
DROP POLICY IF EXISTS "projects_update" ON projects;
DROP POLICY IF EXISTS "projects_update_own" ON projects;
DROP POLICY IF EXISTS "projects_delete" ON projects;
DROP POLICY IF EXISTS "projects_delete_own" ON projects;

-- Réactiver RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Créer les nouvelles policies (owner_id UNIQUEMENT)
CREATE POLICY "projects_select_own"
ON projects FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "projects_insert_own"
ON projects FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "projects_update_own"
ON projects FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "projects_delete_own"
ON projects FOR DELETE
USING (owner_id = auth.uid());

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
```

### 3️⃣ Mettre à jour les projets existants

Si vos projets ont `owner_id = NULL`, mettez-les à jour :

**Option A** : Depuis l'interface Supabase (connecté)
```sql
UPDATE projects 
SET owner_id = auth.uid() 
WHERE owner_id IS NULL;
```

**Option B** : Avec un UUID spécifique
1. Récupérez votre UUID user :
   ```sql
   SELECT id FROM auth.users WHERE email = 'votre.email@domain.com';
   ```
2. Mettez à jour :
   ```sql
   UPDATE projects 
   SET owner_id = 'VOTRE-UUID-ICI' 
   WHERE owner_id IS NULL;
   ```

### 4️⃣ Vérifier l'authentification

Dans votre application Next.js, vérifiez que le cookie est bien transmis :

```typescript
// app/api/projects/route.ts (DÉJÀ CORRIGÉ)
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("❌ Pas d'utilisateur connecté!");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("✓ User connecté:", user.id);

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("❌ Erreur Supabase:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`✓ Projets récupérés: ${data?.length || 0}`);
  return NextResponse.json(data || []);
}
```

### 5️⃣ Tester

1. **Dans le navigateur**, ouvrez la console (F12)
2. Allez sur `/cockpit/projects/active`
3. Vérifiez les logs :
   ```
   ✓ User connecté: abc-123-def-456
   ✓ Projets récupérés: 5
   ```
4. Si vous voyez `Unauthorized` → problème d'authentification
5. Si vous voyez `Projets récupérés: 0` → problème RLS ou owner_id

---

## 🧪 TESTS

### Test 1 : Vérifier l'authentification
```bash
# Dans la console du navigateur (F12)
fetch('/api/projects')
  .then(r => r.json())
  .then(console.log);
```

**Résultat attendu** : Liste de projets (pas `{ error: "Unauthorized" }`)

### Test 2 : Vérifier RLS dans Supabase
```sql
-- Dans SQL Editor, connecté avec votre compte
SELECT * FROM projects;
```

**Résultat attendu** : Vos projets apparaissent

### Test 3 : Vérifier owner_id
```sql
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN owner_id = auth.uid() THEN 1 END) as mine,
  COUNT(CASE WHEN owner_id IS NULL THEN 1 END) as orphaned
FROM projects;
```

**Résultat attendu** : `mine > 0`, `orphaned = 0`

---

## 📋 CHECKLIST DE DÉPLOIEMENT

- [ ] Policies RLS créées
- [ ] Tous les projets ont un `owner_id` valide
- [ ] GET `/api/projects` retourne des données
- [ ] Page `/cockpit/projects/active` affiche les projets
- [ ] Authentification fonctionne (cookies transmis)
- [ ] Index `idx_projects_owner_id` créé

---

## 🚀 PAGE PROJETS ACTIFS

**URL** : `/cockpit/projects/active`

**Fonctionnalités** :
- ✅ Liste tous les projets avec `status = "active"`
- ✅ Affiche progression, dates, budget
- ✅ Filtrage automatique côté client
- ✅ Design glassmorphism cohérent
- ✅ Loading states + error handling
- ✅ Bouton retour vers tous les projets

---

## 🔧 SCRIPTS UTILES

### PowerShell : Diagnostic automatique
```powershell
.\fix-projects-rls.ps1
```

### SQL : Vérification rapide
```sql
-- Mes projets
SELECT * FROM projects WHERE owner_id = auth.uid();

-- Tous les projets (admin only)
SELECT id, name, owner_id, status FROM projects;

-- Policies actives
SELECT * FROM pg_policies WHERE tablename = 'projects';
```

---

## 📚 DOCUMENTATION

### Schéma de données
```typescript
type Project = {
  id: string;
  name: string;
  status: "draft" | "active" | "in_progress" | "completed" | "archived";
  owner_id: string; // UUID de auth.users
  organization_id?: string; // Optionnel (multi-tenant)
  start_date: string | null;
  end_date: string | null;
  progress: number | null;
  budget?: number;
  description?: string;
  created_at: string;
  updated_at: string;
};
```

### Flow d'authentification
```
1. User login → Supabase Auth crée session
2. Cookie `sb-access-token` stocké
3. createClient() lit le cookie via cookies()
4. auth.getUser() récupère user.id
5. RLS vérifie owner_id = auth.uid()
6. Projets filtrés automatiquement
```

---

## ⚠️ PROBLÈMES CONNUS

### Problème 1 : Cookie non transmis
**Symptôme** : `401 Unauthorized`  
**Solution** : Vérifier que `createClient()` utilise bien `cookies()` de Next.js

### Problème 2 : owner_id NULL
**Symptôme** : Projets existent mais liste vide  
**Solution** : `UPDATE projects SET owner_id = auth.uid() WHERE owner_id IS NULL`

### Problème 3 : Conflit organization_id vs owner_id
**Symptôme** : Migrations SQL échouent  
**Solution** : Choisir UN seul système (owner_id recommandé pour simplicité)

---

## 📞 SUPPORT

Si le problème persiste après avoir suivi ce guide :

1. Vérifier les logs Next.js : `npm run dev`
2. Vérifier les logs Supabase : SQL Editor → Logs
3. Vérifier la console navigateur (F12)
4. Exécuter `.\fix-projects-rls.ps1` pour diagnostic

---

**✅ FIX APPLIQUÉ LE** : 6 février 2026  
**🔧 FICHIERS MODIFIÉS** :
- `app/api/projects/route.ts` (ajout logs)
- `app/cockpit/projects/active/page.tsx` (nouvelle page)
- `fix-projects-rls.ps1` (script diagnostic)
- `FIX-PROJECTS-RLS-GUIDE.md` (ce document)
