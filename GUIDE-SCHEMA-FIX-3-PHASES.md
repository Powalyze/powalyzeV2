# 🔧 GUIDE D'EXÉCUTION - SCHÉMA SUPABASE EN 3 PHASES

**Date**: 30 janvier 2026  
**Durée totale**: 2-3 minutes  
**Status**: ✅ **PRÊT À EXÉCUTER**

---

## 📋 CONTEXTE

Le script SQL complet `schema-complete-rls-fix.sql` a échoué avec l'erreur :
```
ERROR: 42703: column "organization_id" does not exist
```

**Cause** : Le script essayait d'utiliser `organization_id` avant de l'avoir créé.

**Solution** : Exécuter le schéma en **3 phases séparées** :

---

## 🎯 PHASE 1 : CRÉER LES COLONNES

### Fichier : `schema-fix-phase1-columns.sql`

**Ce que ça fait** :
- ✅ Crée les tables `organizations` et `memberships`
- ✅ Crée les tables `timeline_events` et `reports`
- ✅ Ajoute `organization_id` à `projects`, `risks`, `decisions`
- ✅ Ajoute `created_by` à `projects`, `risks`, `decisions`
- ✅ Crée les index pour performances

### Instructions :

1. **Ouvrir Supabase SQL Editor** :
   ```
   https://phfeteiholkfiredgero.supabase.co/project/_/sql
   ```

2. **Nouvelle requête** : Cliquer sur "New Query"

3. **Copier-coller** le contenu de `database/schema-fix-phase1-columns.sql`

4. **Exécuter** : Cliquer sur "RUN" (ou Ctrl+Enter)

5. **Vérifier le résultat** :
   - Devrait afficher 5 lignes (decisions, projects, reports, risks, timeline_events)
   - Chaque ligne doit avoir `column_name = organization_id` et `data_type = uuid`

**✅ ATTENDEZ QUE CETTE PHASE SOIT TERMINÉE AVANT DE PASSER À LA PHASE 2**

---

## 🔒 PHASE 2 : ACTIVER RLS

### Fichier : `schema-fix-phase2-rls.sql`

**Ce que ça fait** :
- ✅ Active Row Level Security sur toutes les tables
- ✅ Prépare les tables pour recevoir les policies

### Instructions :

1. **Dans le même SQL Editor**

2. **Nouvelle requête** : Cliquer sur "New Query"

3. **Copier-coller** le contenu de `database/schema-fix-phase2-rls.sql`

4. **Exécuter** : Cliquer sur "RUN"

5. **Vérifier le résultat** :
   - Devrait afficher 7 lignes (toutes les tables)
   - Chaque ligne doit avoir `rowsecurity = true`

**✅ ATTENDEZ QUE CETTE PHASE SOIT TERMINÉE AVANT DE PASSER À LA PHASE 3**

---

## 🛡️ PHASE 3 : CRÉER LES POLICIES

### Fichier : `schema-fix-phase3-policies.sql`

**Ce que ça fait** :
- ✅ Crée 28 policies de sécurité RLS
- ✅ 4 policies par table (SELECT, INSERT, UPDATE, DELETE)
- ✅ Isolation multi-tenant (chaque utilisateur voit uniquement ses données)

### Instructions :

1. **Dans le même SQL Editor**

2. **Nouvelle requête** : Cliquer sur "New Query"

3. **Copier-coller** le contenu de `database/schema-fix-phase3-policies.sql`

4. **Exécuter** : Cliquer sur "RUN"

5. **Vérifier le résultat** :
   - Devrait afficher 28 lignes (28 policies)
   - Répartition :
     - organizations: 4 policies
     - memberships: 4 policies
     - projects: 4 policies
     - risks: 4 policies
     - decisions: 4 policies
     - timeline_events: 4 policies
     - reports: 4 policies

**✅ TERMINÉ ! LE SCHÉMA EST MAINTENANT COMPLET**

---

## 🧪 TEST FINAL

### Vérifier que tout fonctionne :

1. **Rafraîchir la page** : https://www.powalyze.com/cockpit

2. **Ouvrir la console** (F12) et vérifier les logs :
   ```
   ✅ [getCurrentOrganizationId] Found in user_metadata: eca7351b-b4a5-400b-bd19-6d53c8ed52b5
   🔑 [useLiveCockpit] Organization ID: eca7351b-b4a5-400b-bd19-6d53c8ed52b5
   ✅ [useLiveCockpit] Données chargées: {projects: 0, risks: 0, decisions: 0, timeline: 0, reports: 0}
   ```

3. **Créer un projet test** :
   - Cliquer "Nouveau projet"
   - Nom : "Test Schéma Fix"
   - Description : "Premier projet après correction schéma"
   - Valider

4. **Vérifier** :
   - ✅ Pas d'erreur "column does not exist"
   - ✅ Pas d'erreur "Organization ID manquant"
   - ✅ Projet créé avec succès
   - ✅ Cockpit recharge automatiquement
   - ✅ Projet visible dans la liste

### SQL de vérification (optionnel) :

```sql
-- Voir votre projet
SELECT id, name, organization_id, created_by, created_at
FROM projects
WHERE organization_id = 'eca7351b-b4a5-400b-bd19-6d53c8ed52b5'
ORDER BY created_at DESC;
```

---

## 📊 RÉSUMÉ DES 3 PHASES

| Phase | Fichier | Durée | Actions |
|-------|---------|-------|---------|
| **1** | schema-fix-phase1-columns.sql | 30s | Créer colonnes + tables |
| **2** | schema-fix-phase2-rls.sql | 10s | Activer RLS |
| **3** | schema-fix-phase3-policies.sql | 60s | Créer 28 policies |
| **TOTAL** | - | **~2 min** | **Schéma complet fonctionnel** |

---

## 🔧 TROUBLESHOOTING

### Erreur Phase 1 : "relation already exists"

**Cause** : Tables déjà créées (normal).

**Solution** : Continuer, le script utilise `IF NOT EXISTS`.

---

### Erreur Phase 2 : "relation does not exist"

**Cause** : Phase 1 pas exécutée ou échouée.

**Solution** : Retourner à Phase 1 et réexécuter.

---

### Erreur Phase 3 : "column organization_id does not exist"

**Cause** : Phase 1 pas complétée avec succès.

**Solution** : 
1. Vérifier que Phase 1 a bien ajouté les colonnes :
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'projects' 
     AND column_name = 'organization_id';
   ```
2. Si vide, réexécuter Phase 1.

---

### Cockpit affiche toujours des erreurs après les 3 phases

**Vérifications** :

1. **Organization existe ?**
   ```sql
   SELECT * FROM organizations 
   WHERE owner_id = 'c7679d53-7d45-48c0-a901-b36aa1a27ccb';
   ```
   - Devrait retourner 1 ligne : "Organisation Fabrice"

2. **Membership existe ?**
   ```sql
   SELECT * FROM memberships 
   WHERE user_id = 'c7679d53-7d45-48c0-a901-b36aa1a27ccb';
   ```
   - Devrait retourner 1 ligne avec role='owner'

3. **User metadata à jour ?**
   ```sql
   SELECT raw_user_meta_data->>'organization_id' 
   FROM auth.users 
   WHERE id = 'c7679d53-7d45-48c0-a901-b36aa1a27ccb';
   ```
   - Devrait retourner : eca7351b-b4a5-400b-bd19-6d53c8ed52b5

Si l'un de ces éléments manque, consulter `QUICK-FIX-CREATE-ORGANIZATION.md`.

---

## 🎉 APRÈS SUCCÈS

Après exécution des 3 phases avec succès, vous avez :

✅ **Schema complet** : Toutes les colonnes et tables créées  
✅ **RLS actif** : Sécurité multi-tenant activée  
✅ **28 policies** : Isolation des données par organisation  
✅ **Cockpit fonctionnel** : Création de projets/risques/décisions sans erreur  
✅ **Performance optimisée** : Index créés sur toutes les relations  

---

## 📝 NOTES IMPORTANTES

### Pourquoi 3 phases ?

Le script complet original (`schema-complete-rls-fix.sql`) utilisait des blocs `DO $$` conditionnels qui créaient des dépendances circulaires. En séparant en 3 phases linéaires, on garantit :

1. **Phase 1** : Structure de base (colonnes + tables)
2. **Phase 2** : Activation RLS (nécessite colonnes)
3. **Phase 3** : Policies (nécessite RLS activé)

### Durée d'exécution

- **Phase 1** : ~30 secondes (création de colonnes + index)
- **Phase 2** : ~10 secondes (activation RLS sur 7 tables)
- **Phase 3** : ~60 secondes (création de 28 policies avec vérifications)

**Total** : ~2 minutes (normal pour un schéma multi-tenant complet)

### Idempotence

Toutes les phases sont **idempotentes** :
- Peuvent être exécutées plusieurs fois sans erreur
- Utilisent `IF NOT EXISTS`, `DROP POLICY IF EXISTS`, etc.
- Réexécuter ne détruit pas les données existantes

---

## 🔗 DOCUMENTS CONNEXES

- **QUICK-FIX-CREATE-ORGANIZATION.md** : Créer votre organization manuellement
- **BLOC-UNIQUE-ETAPES-2-3-COMPLETE.md** : Implémentation du BLOC UNIQUE
- **schema-complete-rls-fix.sql** : Script original (version monolithique)

---

## 💡 PROCHAINES ÉTAPES

Après avoir exécuté les 3 phases avec succès :

1. ✅ Testez le cockpit : https://www.powalyze.com/cockpit
2. ✅ Créez un projet de test
3. ✅ Vérifiez que les modules fonctionnent (Projets, Risques, Décisions, Timeline, Rapports)
4. ✅ Surveillez les logs Vercel pour erreurs RLS
5. ✅ (Optionnel) Exécutez les phases 10-12 de `schema-complete-rls-fix.sql` pour ajouter audit logs et triggers

---

## 🎯 CONCLUSION

**Temps total** : 2-3 minutes  
**Complexité** : Facile (3 copier-coller SQL)  
**Impact** : Schéma complet avec RLS et multi-tenant  
**Statut** : ✅ Prêt à utiliser

Ce guide garantit une installation **sans erreur** du schéma Supabase en exécutant les opérations dans le bon ordre.

**Bonne exécution !** 🚀
