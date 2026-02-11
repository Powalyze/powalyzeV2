# 🚀 Guide Post-Déploiement Powalyze - Automations & Documents

## ✅ Déploiement Code
- **Status** : ✅ TERMINÉ
- **URL Production** : https://www.powalyze.com
- **Date** : 5 février 2026

---

## 🔧 Configuration Supabase (EN COURS)

### ✅ Étape 1 : Migration SQL
**Fichier** : `database/migrate-add-created-by.sql`

1. Ouvrir https://app.supabase.com
2. Sélectionner projet Powalyze
3. SQL Editor → New query
4. Coller le SQL (déjà dans presse-papier)
5. Cliquer RUN ▶️

**Vérification** :
```sql
SELECT 
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = 'automations' AND column_name = 'created_by') as ok_automations,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = 'documents' AND column_name = 'created_by') as ok_documents,
  (SELECT COUNT(*) FROM pg_trigger 
   WHERE tgname = 'trg_apply_project_status_automations') as ok_trigger;
```
✅ Résultat attendu : `1, 1, 1`

---

### ⏳ Étape 2 : Créer Bucket Storage "documents"

1. Supabase Dashboard → **Storage**
2. Cliquer **New Bucket**
3. Configuration :
   - Name : `documents`
   - Public : ❌ NON
   - Max file size : 50 MB
4. Cliquer **Create Bucket**

---

### ⏳ Étape 3 : Configurer Storage Policies

**Fichier** : `database/storage-policies-documents.sql`

Dans le bucket "documents" → Policies → New Policy, créer 3 policies :

#### Policy 1 : Upload
```sql
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 2 : Read
```sql
CREATE POLICY "Users can read their own documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 3 : Delete
```sql
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 🧪 Tests Fonctionnels

### Test Automations
1. Aller sur https://www.powalyze.com/cockpit/automations
2. Cliquer "+ Nouvelle automatisation"
3. Remplir formulaire :
   - Nom : "Test Owner"
   - Trigger : draft → active
   - User ID : `<votre-uuid>`
   - Rôle : Owner
4. Créer et vérifier dans la liste
5. Tester Toggle Active/Pause
6. Tester Édition
7. Tester Suppression

### Test Documents
1. Aller sur https://www.powalyze.com/cockpit/documents
2. Glisser-déposer un fichier PDF
3. Vérifier affichage dans tableau
4. Vérifier taille en Ko
5. Tester Suppression

### Test Trigger Automatique
1. Créer projet en statut "draft"
2. Créer automation : draft → active
3. Changer projet à "active"
4. Vérifier assignment dans `project_assignments`

---

## 📊 État d'Avancement

| Tâche | Status |
|-------|--------|
| Code déployé | ✅ |
| Migration SQL | ⏳ |
| Bucket Storage | ⏳ |
| Storage Policies | ⏳ |
| Tests Automations | ⏳ |
| Tests Documents | ⏳ |

---

## 🔗 Liens Utiles

- **Production** : https://www.powalyze.com
- **Supabase** : https://app.supabase.com
- **Vercel Dashboard** : https://vercel.com/powalyzes-projects/powalyze-v2

---

**Dernière mise à jour** : 5 février 2026 - Déploiement réussi
