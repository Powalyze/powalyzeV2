# 📦 QUICK FIX — CRÉER ORGANISATION + MEMBERSHIP MANUELLEMENT

**Date**: 30 janvier 2026  
**Objectif**: Créer immédiatement une organisation pour tester le cockpit  
**Durée**: 2 minutes  
**Status**: ✅ **PRÊT À EXÉCUTER**

---

## 🎯 POURQUOI CE QUICK FIX ?

Si vous avez déjà un compte créé AVANT l'implémentation du BLOC UNIQUE, vous n'avez pas d'organisation automatique. Ce guide corrige ça en 2 minutes.

**Ce que ce fix va réparer** :
- ✅ Vous aurez une organisation valide
- ✅ Vous aurez un membership valide (rôle owner)
- ✅ Les RLS vous reconnaîtront
- ✅ Le cockpit pourra créer des projets
- ✅ L'erreur "Organization ID manquant" disparaîtra
- ✅ Tous les modules seront accessibles

---

## 📋 ÉTAPE 1 : TROUVER VOTRE USER_ID

### Dans Supabase Dashboard :

1. Aller sur **Supabase Dashboard** : https://supabase.com/dashboard
2. Sélectionner votre projet : **Powalyze**
3. Menu latéral → **Authentication**
4. Cliquer sur **Users**
5. Trouver votre utilisateur (votre email)
6. Cliquer sur la ligne pour voir les détails
7. **Copier le champ `ID`** (format UUID : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

**Exemple** :
```
ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
Email: fabrice@powalyze.com
```

➡️ **Sauvegarder cet ID**, on l'appelle `<TON_USER_ID>`

---

## 📋 ÉTAPE 2 : CRÉER VOTRE ORGANISATION

### Dans Supabase SQL Editor :

1. Menu latéral → **SQL Editor**
2. Cliquer sur **New Query**
3. Copier-coller ce SQL (en remplaçant `<TON_USER_ID>`) :

```sql
-- BLOC 1 : Créer votre organisation
INSERT INTO organizations (name, owner_id)
VALUES ('Organisation Fabrice', '<TON_USER_ID>')
RETURNING *;
```

**⚠️ IMPORTANT** : Remplacez `<TON_USER_ID>` par votre vrai ID copié à l'étape 1.

**Exemple complet** :
```sql
INSERT INTO organizations (name, owner_id)
VALUES ('Organisation Fabrice', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
RETURNING *;
```

4. Cliquer sur **Run** (ou `Ctrl+Enter`)

**Résultat attendu** :
```
id                                    | name                  | owner_id                              | created_at           | updated_at
--------------------------------------+-----------------------+---------------------------------------+----------------------+----------------------
c3f2b1d0-1234-5678-90ab-cdef12345678 | Organisation Fabrice  | a1b2c3d4-e5f6-7890-abcd-ef1234567890 | 2026-01-30 12:00:00  | 2026-01-30 12:00:00
```

➡️ **Copier le champ `id` retourné**, on l'appelle `<ORG_ID>`

---

## 📋 ÉTAPE 3 : CRÉER VOTRE MEMBERSHIP

### Dans le même SQL Editor :

1. Copier-coller ce SQL (en remplaçant `<ORG_ID>` et `<TON_USER_ID>`) :

```sql
-- BLOC 2 : Créer votre membership (rôle owner)
INSERT INTO memberships (organization_id, user_id, role)
VALUES ('<ORG_ID>', '<TON_USER_ID>', 'owner')
RETURNING *;
```

**⚠️ IMPORTANT** : Remplacez `<ORG_ID>` par l'ID retourné à l'étape 2, et `<TON_USER_ID>` par votre ID de l'étape 1.

**Exemple complet** :
```sql
INSERT INTO memberships (organization_id, user_id, role)
VALUES ('c3f2b1d0-1234-5678-90ab-cdef12345678', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'owner')
RETURNING *;
```

2. Cliquer sur **Run**

**Résultat attendu** :
```
id                                    | organization_id                       | user_id                               | role    | created_at           | updated_at
--------------------------------------+---------------------------------------+---------------------------------------+---------+----------------------+----------------------
d4e5f6a7-2345-6789-01bc-def234567890 | c3f2b1d0-1234-5678-90ab-cdef12345678 | a1b2c3d4-e5f6-7890-abcd-ef1234567890 | owner   | 2026-01-30 12:00:01  | 2026-01-30 12:00:01
```

---

## 📋 ÉTAPE 4 : METTRE À JOUR USER_METADATA (OPTIONNEL MAIS RECOMMANDÉ)

### Option A : Via SQL (RECOMMANDÉ)

```sql
-- BLOC 3 : Mettre à jour user_metadata avec organization_id
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('organization_id', '<ORG_ID>')
WHERE id = '<TON_USER_ID>';
```

**Exemple complet** :
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('organization_id', 'c3f2b1d0-1234-5678-90ab-cdef12345678')
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
```

### Option B : Via Dashboard Supabase

1. Aller sur **Authentication** → **Users**
2. Cliquer sur votre utilisateur
3. Trouver la section **User Metadata**
4. Cliquer sur **Edit**
5. Ajouter cette ligne dans le JSON :
   ```json
   {
     "organization_id": "c3f2b1d0-1234-5678-90ab-cdef12345678"
   }
   ```
6. Cliquer sur **Save**

---

## 📋 ÉTAPE 5 : VÉRIFICATION

### Vérifier que tout est créé correctement :

```sql
-- Vérifier votre organisation
SELECT * FROM organizations WHERE owner_id = '<TON_USER_ID>';

-- Vérifier votre membership
SELECT * FROM memberships WHERE user_id = '<TON_USER_ID>';

-- Vérifier votre user_metadata
SELECT raw_user_meta_data->>'organization_id' as org_id
FROM auth.users
WHERE id = '<TON_USER_ID>';
```

**Résultats attendus** :
- 1 organisation avec votre nom
- 1 membership avec role 'owner'
- user_metadata contient organization_id

---

## 📋 ÉTAPE 6 : TEST DANS LE COCKPIT

### Tester que tout fonctionne :

1. **Se déconnecter** de Powalyze (pour rafraîchir la session)
2. **Se reconnecter** avec votre compte
3. Aller sur **https://www.powalyze.com/cockpit**
4. Ouvrir la console du navigateur (F12)
5. **Vérifier les logs** :
   ```
   ✅ Session valide - User ID: a1b2c3d4-...
   🔑 Organization ID: c3f2b1d0-...
   🔄 Chargement des données...
   ✅ Données chargées: { projects: 0, risks: 0, ... }
   ```
6. **Créer un projet de test** :
   - Cliquer "Nouveau projet"
   - Nom : "Test Organisation"
   - Description : "Premier projet après fix"
   - Valider
7. **Vérifier** :
   - ✅ Pas d'erreur "Organization ID manquant"
   - ✅ Projet créé avec succès
   - ✅ Cockpit recharge automatiquement
   - ✅ Tous les modules visibles (Synthèse, Projets, Risques, Décisions, Timeline, Rapports)
   - ✅ Sidebar active
   - ✅ Navigation fonctionne

---

## 🧪 VÉRIFICATION SQL FINALE

### Vérifier que le projet a été créé avec organization_id :

```sql
-- Voir tous vos projets
SELECT id, name, organization_id, created_by, created_at
FROM projects
WHERE organization_id = '<ORG_ID>'
ORDER BY created_at DESC;
```

**Résultat attendu** :
```
id          | name                  | organization_id  | created_by       | created_at
------------+-----------------------+------------------+------------------+---------------------
...         | Test Organisation     | c3f2b1d0-...     | a1b2c3d4-...     | 2026-01-30 12:05:00
```

---

## 🎉 RÉSULTAT FINAL

Après ces 6 étapes, vous avez :

✅ **Organisation créée** : `organizations` contient votre organisation  
✅ **Membership créé** : `memberships` vous lie à votre organisation avec role 'owner'  
✅ **User metadata à jour** : `user_metadata.organization_id` est rempli  
✅ **Cockpit fonctionnel** : Vous pouvez créer des projets, risques, décisions  
✅ **RLS actifs** : Vous voyez uniquement vos données (isolation multi-tenant)  
✅ **Parité PRO = DÉMO** : Tous les modules visibles et fonctionnels

---

## 🔧 TROUBLESHOOTING

### Problème 1 : "Table organizations does not exist"

**Cause** : Le schema RLS n'a pas été exécuté.

**Solution** :
```sql
-- Créer la table organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer la table memberships
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);
```

Puis retourner à l'ÉTAPE 2.

---

### Problème 2 : "Organization ID manquant" persiste après fix

**Causes possibles** :
1. user_metadata pas mis à jour (faire ÉTAPE 4)
2. Session pas rafraîchie (se déconnecter/reconnecter)
3. Membership pas créé (vérifier ÉTAPE 3)

**Solution** :
```sql
-- Vérifier tout d'un coup
SELECT 
  u.id as user_id,
  u.email,
  u.raw_user_meta_data->>'organization_id' as metadata_org_id,
  m.organization_id as membership_org_id,
  m.role,
  o.name as org_name
FROM auth.users u
LEFT JOIN memberships m ON m.user_id = u.id
LEFT JOIN organizations o ON o.id = m.organization_id
WHERE u.email = '<VOTRE_EMAIL>';
```

**Résultat attendu** : Une ligne avec `metadata_org_id`, `membership_org_id`, et `org_name` remplis.

---

### Problème 3 : Projet créé mais invisible

**Cause** : RLS policies pas actives ou mal configurées.

**Solution temporaire** : Désactiver RLS pour tester :
```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
```

**⚠️ ATTENTION** : Réactiver RLS après test :
```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```

**Solution permanente** : Exécuter `schema-complete-rls-fix.sql` complet.

---

## 🔗 DOCUMENTS CONNEXES

- **BLOC-UNIQUE-PARITE-PRO-DEMO-COMPLETE.md** : Implémentation complète du BLOC UNIQUE
- **schema-complete-rls-fix.sql** : Schema SQL complet avec toutes les policies
- **GUIDE-EXECUTION-RLS-FIX.md** : Guide d'exécution du schema complet
- **FIX-COCKPIT-BLOQUE-CREATION-PROJET.md** : Fix du blocage après création projet

---

## 💡 NOTES IMPORTANTES

### Ce Quick Fix est temporaire

Ce guide crée **manuellement** ce que le système fait **automatiquement** à l'inscription (depuis l'implémentation du BLOC UNIQUE).

**Pour les nouveaux utilisateurs** (après déploiement du BLOC UNIQUE) :
- ✅ Organisation créée automatiquement à l'inscription
- ✅ Membership créé automatiquement
- ✅ user_metadata rempli automatiquement
- ✅ Session rafraîchie automatiquement

**Pour les utilisateurs existants** (créés avant BLOC UNIQUE) :
- ⚠️ Doivent utiliser ce Quick Fix une seule fois
- ⚠️ Ou attendre qu'un script de migration global soit exécuté

### Prochaine étape recommandée

Exécuter le schema SQL complet (`schema-complete-rls-fix.sql`) pour :
- ✅ Activer toutes les RLS policies
- ✅ Créer les audit_logs
- ✅ Créer les invitations
- ✅ Créer les fonctions utilitaires
- ✅ Créer les triggers automatiques

**Voir** : `GUIDE-EXECUTION-RLS-FIX.md` pour les instructions complètes.

---

## 🎯 CONCLUSION

**Temps total** : 2-5 minutes  
**Complexité** : Facile (copier-coller SQL)  
**Impact** : Immédiat - Cockpit fonctionnel  
**Statut** : ✅ Prêt à utiliser

Après ce Quick Fix, vous pouvez utiliser le cockpit LIVE exactement comme la démo, avec :
- Tous les modules visibles
- Création de projets fonctionnelle
- Synthèse IA active
- Timeline, Risques, Décisions accessibles
- Isolation multi-tenant (vos données uniquement)

**Bonne utilisation !** 🚀
