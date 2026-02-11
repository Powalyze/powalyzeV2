# Migration vers le système workspace_id

## ✅ Fichiers créés

### 1. `lib/supabaseClient.ts` (simplifié)
Client Supabase standard utilisant `@supabase/supabase-js` directement.

### 2. `lib/useCurrentWorkspace.ts`
Hook React pour récupérer le `workspace_id` depuis la session utilisateur.

- Lit `user.user_metadata.workspace_id`
- Retourne `{ workspaceId, loading }`
- À adapter selon votre structure (profiles, organizations, etc.)

### 3. `components/ExecutiveBlock.tsx` (mis à jour)
- ✅ Utilise `useCurrentWorkspace()`
- ✅ Filtre toutes les requêtes avec `.eq("workspace_id", workspaceId)`
- ✅ Affiche "Chargement..." tant que workspaceId n'est pas disponible

### 4. `app/cockpit/projets/workspace-example.tsx`
Exemple de page complète montrant :
- Import et utilisation du hook `useCurrentWorkspace`
- Filtrage des projets par workspace_id
- Affichage conditionnel (loading, no workspace, no projects)
- Intégration avec ExecutiveBlock

## 🔧 Règle d'or Supabase

**Partout où vous faites une requête Supabase, ajoutez systématiquement :**

```ts
.eq("workspace_id", workspaceId)
```

### Exemples de patterns à appliquer :

```ts
// ❌ AVANT (sans workspace_id)
const { data } = await supabase
  .from("projects")
  .select("*")
  .eq("status", "active");

// ✅ APRÈS (avec workspace_id)
const { data } = await supabase
  .from("projects")
  .select("*")
  .eq("status", "active")
  .eq("workspace_id", workspaceId);
```

## 📋 Checklist migration

### À faire dans chaque fichier qui utilise Supabase :

1. **Importer le hook** :
   ```ts
   import { useCurrentWorkspace } from "@/lib/useCurrentWorkspace";
   ```

2. **Récupérer le workspaceId** :
   ```ts
   const { workspaceId, loading: wsLoading } = useCurrentWorkspace();
   ```

3. **Attendre que workspaceId soit disponible** :
   ```ts
   useEffect(() => {
     if (!workspaceId || wsLoading) return;
     // vos requêtes ici
   }, [workspaceId, wsLoading]);
   ```

4. **Filtrer TOUTES les requêtes** :
   ```ts
   .eq("workspace_id", workspaceId)
   ```

## 🎯 Fichiers à migrer en priorité

### Pages cockpit :
- `/app/cockpit/projets/page.tsx`
- `/app/cockpit/risques/page.tsx`
- `/app/cockpit/kanban/page.tsx`
- `/app/cockpit/gantt/page.tsx`
- `/app/cockpit/kpi/page.tsx`
- `/app/cockpit/equipe/page.tsx`

### API Routes :
- `/app/api/projects/route.ts`
- `/app/api/risks/route.ts`
- `/app/api/decisions/route.ts`
- `/app/api/resources/route.ts`

### Composants :
- Tous les composants dans `/components/cockpit/` qui font des requêtes Supabase

## 🔐 Configuration utilisateur

Le `workspace_id` doit être stocké lors de l'inscription/login.

### Option 1 : user_metadata (actuel)
```ts
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      workspace_id: "xxx-xxx-xxx"
    }
  }
});
```

### Option 2 : Table profiles (recommandé)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  workspace_id UUID NOT NULL,
  role TEXT,
  ...
);
```

Puis dans le hook :
```ts
const { data: profile } = await supabase
  .from("profiles")
  .select("workspace_id")
  .eq("id", user.id)
  .single();

setWorkspaceId(profile?.workspace_id || null);
```

## ⚠️ Points d'attention

1. **RLS Policies** : Vos policies Supabase doivent vérifier `workspace_id` :
   ```sql
   CREATE POLICY "Users can view their workspace projects"
   ON projects FOR SELECT
   USING (workspace_id = auth.jwt() ->> 'workspace_id');
   ```

2. **Création de ressources** : Toujours injecter `workspace_id` :
   ```ts
   const { data } = await supabase
     .from("projects")
     .insert({
       name: "Nouveau projet",
       workspace_id: workspaceId, // ⚠️ Critique
       ...
     });
   ```

3. **Imports Supabase** : Utiliser maintenant :
   ```ts
   import { supabase } from "@/lib/supabaseClient";
   ```
   Au lieu de :
   ```ts
   import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
   ```

## 🚀 Test

Pour tester que tout fonctionne :

1. Créez un utilisateur avec un `workspace_id` dans user_metadata
2. Connectez-vous
3. Vérifiez dans la console : `workspaceId` doit être défini
4. Créez un projet → il doit avoir le bon `workspace_id`
5. Listez les projets → vous ne devez voir que ceux de votre workspace

## 📚 Ressources

- Exemple complet : `app/cockpit/projets/workspace-example.tsx`
- Hook workspace : `lib/useCurrentWorkspace.ts`
- Client Supabase : `lib/supabaseClient.ts`
