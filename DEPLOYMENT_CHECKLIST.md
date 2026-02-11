# 📋 CHECKLIST DÉPLOIEMENT - Automations & Documents

## ✅ Code (Terminé)
- [x] Migration SQL créée (`database/migrate-add-created-by.sql`)
- [x] API routes avec authentification Supabase
- [x] UI Premium Tailwind (automations + documents)
- [x] Build réussi (205 routes compilées)
- [x] Déploiement Vercel lancé

## 🔧 Configuration Supabase (À FAIRE MANUELLEMENT)

### 1️⃣ Exécuter la migration SQL

**Étapes :**
1. Ouvrir [Supabase Dashboard](https://app.supabase.com)
2. Sélectionner votre projet Powalyze
3. Aller dans **SQL Editor**
4. Copier **tout le contenu** de `database/migrate-add-created-by.sql`
5. Coller dans l'éditeur SQL
6. Cliquer sur **RUN** ▶️

**Ce que ça fait :**
- Ajoute `created_by` aux tables `automations` et `documents`
- Active Row Level Security (RLS)
- Crée les policies d'accès utilisateur
- Crée la table `project_assignments`
- Crée le trigger automatique sur changement de statut projet

### 2️⃣ Créer le bucket Storage "documents"

**Étapes :**
1. Dans Supabase Dashboard, aller dans **Storage**
2. Cliquer sur **New Bucket** (+ Nouveau bucket)
3. Configuration :
   - **Name** : `documents`
   - **Public** : ❌ NON (décoché)
   - **File size limit** : 50 MB (par défaut)
4. Cliquer **Create Bucket**

### 3️⃣ Configurer les RLS Policies du Storage

**Étapes :**
1. Cliquer sur le bucket `documents` créé
2. Aller dans **Policies**
3. Créer 3 policies :

#### Policy 1 : Upload files
```sql
CREATE POLICY "Users can upload their own documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 2 : Read files
```sql
CREATE POLICY "Users can read their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 3 : Delete files
```sql
CREATE POLICY "Users can delete their own documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 🧪 Tests Fonctionnels

Une fois la configuration Supabase terminée :

### Test Automations
1. Aller sur https://www.powalyze.com/cockpit/automations
2. Cliquer **+ Nouvelle automatisation**
3. Remplir :
   - Nom : "Test assignation Owner"
   - Description : "Quand projet passe de draft à active"
   - Trigger : De `draft` → À `active`
   - Action : User ID = `<votre-user-id>`, Rôle = `Owner`
4. Cliquer **Créer**
5. Vérifier que l'automatisation apparaît dans la liste
6. Tester toggle Active/Pause
7. Tester Édition
8. Tester Suppression

### Test Documents
1. Aller sur https://www.powalyze.com/cockpit/documents
2. Glisser-déposer un fichier PDF dans la zone
3. Vérifier que le fichier apparaît dans le tableau
4. Vérifier la taille en Ko affichée
5. Cliquer **Supprimer** et confirmer

### Test Trigger Automatique
1. Créer un projet en mode `draft`
2. Créer une automatisation : `draft` → `active` avec votre user_id
3. Changer le statut du projet à `active`
4. Vérifier dans la table `project_assignments` que vous êtes assigné automatiquement

## 🔍 Vérifications Finales

### Database
```sql
-- Vérifier que les colonnes existent
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'automations' AND column_name = 'created_by';

-- Vérifier les policies
SELECT * FROM pg_policies WHERE tablename IN ('automations', 'documents');

-- Vérifier le trigger
SELECT tgname FROM pg_trigger WHERE tgname = 'trg_apply_project_status_automations';
```

### Storage
- [ ] Bucket `documents` existe
- [ ] Bucket est **privé** (non public)
- [ ] 3 RLS policies configurées

### Frontend
- [ ] Page /cockpit/automations charge sans erreur
- [ ] Page /cockpit/documents charge sans erreur
- [ ] Pas d'erreur 401 Unauthorized
- [ ] Toast notifications fonctionnent

## 📝 Notes Techniques

### Architecture utilisée
- **Package** : `@supabase/ssr` (NOT `@supabase/auth-helpers-nextjs`)
- **Pattern** : `createSupabaseServerClient()` dans API routes
- **Auth** : JWT via `auth.getUser()` 
- **Storage** : Paths `user-{uuid}/timestamp-filename`

### Endpoints API créés
- `GET /api/automations` - Liste automations utilisateur
- `POST /api/automations` - Crée automatisation
- `PATCH /api/automations/[id]` - Modifie automatisation
- `DELETE /api/automations/[id]` - Supprime automatisation
- `GET /api/documents` - Liste documents utilisateur
- `POST /api/documents/upload` - Upload fichier (multipart/form-data)
- `DELETE /api/documents/[id]` - Supprime document + fichier Storage

### Sécurité
- ✅ RLS activé sur tables
- ✅ Policies basées sur `auth.uid() = created_by`
- ✅ Storage isolé par user_id dans le path
- ✅ Validation ownership dans API routes

---

## 🚀 Commande de déploiement

Si besoin de redéployer après changements :

```powershell
npm run build
npx vercel --prod --yes
```

---

**Date de création** : 5 février 2026  
**Status déploiement code** : ✅ TERMINÉ  
**Status configuration Supabase** : ⏳ EN ATTENTE
