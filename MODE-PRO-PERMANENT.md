# 🚀 BLOC UNIQUE — MODE PRO PERMANENT

## ✅ Modifications appliquées

### 1. Backend (SQL) — `database/schema-pro-permanent.sql`

**Créé** : Fichier SQL unique qui combine:
- ✅ Fix contrainte UNIQUE sur `project_predictions` (résout l'erreur upsert)
- ✅ Ajout colonnes `plan`, `pro_active`, `mode` dans `profiles`
- ✅ Valeurs par défaut: `plan='pro'`, `pro_active=true`, `mode='admin'`
- ✅ Mise à jour de TOUS les comptes existants en mode Pro
- ✅ Vérifications automatiques (RAISE NOTICE)

**À faire maintenant** :
1. Ouvrir Supabase Dashboard → SQL Editor
2. Copier/coller le contenu de `database/schema-pro-permanent.sql`
3. Cliquer **Run**
4. Vérifier les messages ✅ dans les logs

### 2. Frontend — Redirection automatique vers cockpit Pro

**Modifié** : `app/cockpit/page.tsx`
- ✅ Redirection automatique vers `/cockpit/projets`
- ✅ Plus d'écran vide "Activez Pro"
- ✅ Loader pendant la redirection

**Modifié** : `components/auth/LoginForm.tsx`
- ✅ Tous les logins redirigent vers `/cockpit/projets`
- ✅ Plus de logique conditionnelle selon plan/mode
- ✅ Mode Pro permanent pour tous

**Modifié** : `app/onboarding/forfait/page.tsx`
- ✅ Update vers `profiles` au lieu de `users`
- ✅ Force `plan='pro'`, `pro_active=true`, `mode='admin'`
- ✅ Redirection directe vers `/cockpit/projets`

## 🎯 Résultat final

### Avant
- Login → Détection plan/mode → Redirection conditionnelle
- Empty state "Activez Pro" sur `/cockpit`
- Différents modes (demo, client, admin)

### Après
- Login → **Directement `/cockpit/projets`** (tous en mode Pro)
- Aucun écran vide
- Un seul mode : **Pro permanent**

## 📋 Checklist de déploiement

- [x] 1. Fichier SQL créé (`schema-pro-permanent.sql`)
- [x] 2. Frontend modifié (3 fichiers)
- [x] 3. Code commité et pushé
- [ ] 4. **SQL exécuté dans Supabase** ⚠️ À FAIRE MAINTENANT
- [ ] 5. Déploiement Vercel (automatique après commit)
- [ ] 6. Test: Login → devrait aller direct sur `/cockpit/projets`

## 🧪 Tests à faire après application SQL

### Test 1 : Vérifier les colonnes
```sql
SELECT column_name, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('plan', 'pro_active', 'mode');
```

**Attendu** :
```
plan       | 'pro'::text  | NO
pro_active | true         | NO
mode       | 'admin'::text| NO
```

### Test 2 : Vérifier les comptes existants
```sql
SELECT id, email, plan, pro_active, mode
FROM profiles
LIMIT 10;
```

**Attendu** : Tous les comptes doivent avoir `plan='pro'`, `pro_active=true`, `mode='admin'`

### Test 3 : Créer un nouveau compte
```sql
INSERT INTO profiles (id, email, organization_id)
VALUES (gen_random_uuid(), 'test@test.com', 'existing-org-id');

-- Puis vérifier les valeurs par défaut
SELECT plan, pro_active, mode FROM profiles WHERE email = 'test@test.com';
```

**Attendu** : `plan='pro'`, `pro_active=true`, `mode='admin'` (par défaut)

### Test 4 : Vérifier project_predictions
```sql
SELECT * FROM project_predictions LIMIT 1;
```

**Attendu** : Table existe, aucune erreur "relation does not exist"

## 🚨 Après application du SQL

1. **Déployer sur Vercel** (déjà fait automatiquement après push)
2. **Tester le login** :
   - Aller sur https://www.powalyze.com/login
   - Se connecter
   - Devrait rediriger automatiquement vers `/cockpit/projets`
3. **Créer un projet** :
   - Cliquer "Nouveau projet"
   - Vérifier qu'il n'y a plus l'erreur "no unique constraint"

## 📊 URLs finales

- **Login** : https://www.powalyze.com/login → Auto-redirect vers `/cockpit/projets`
- **Cockpit** : https://www.powalyze.com/cockpit → Auto-redirect vers `/cockpit/projets`
- **Projets** : https://www.powalyze.com/cockpit/projets ✅ Page cible finale

## 🔥 Commandes Git

```bash
# Vérifier les modifications
git status

# Commit déjà fait (schema-pro-permanent.sql + 3 fichiers frontend)
git log --oneline -1

# Push automatique vers production Vercel
# (déjà configuré avec votre repo GitHub)
```

## ⚙️ Configuration Supabase (Optionnel mais recommandé)

Dans Supabase Dashboard → Authentication → Settings :

1. **Email confirmations** : Désactiver
2. **Auto-confirm new users** : Activer

**Impact** :
- Plus de rate limit sur les emails
- Plus de lien de confirmation expiré
- Inscription instantanée

## 🎉 C'est tout !

Une fois le SQL exécuté dans Supabase :
- ✅ Tous les comptes sont Pro permanent
- ✅ Nouveaux comptes = Pro par défaut
- ✅ Login = direct cockpit projets
- ✅ Plus d'erreur "no unique constraint"
- ✅ UX simplifiée (plus de choix demo/pro)

**Temps total** : 2 minutes (SQL) + 1 minute (test login)
