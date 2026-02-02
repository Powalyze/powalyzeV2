# 🚀 PHASE 2 COMPLETE : Auth + Middleware Demo/Pro

**Statut** : ✅ Complétée  
**Date** : 2026-01-28  
**Commit** : En attente de validation

---

## 📦 Fichiers créés

### **1. Infrastructure d'authentification**
- `middleware-v2.ts` : Middleware de routage Demo/Pro
- `middleware-v2-backup.ts` : Backup du middleware V2 (à renommer pour activer)
- `lib/auth-v2.ts` : Fonctions helpers d'authentification
- `lib/auth-actions-v2.ts` : Server actions (login, signup, logout, upgradeToPro)

### **2. Pages d'authentification**
- `components/auth/LoginFormV2.tsx` : Formulaire de connexion
- `components/auth/SignupFormV2.tsx` : Formulaire d'inscription
- `app/login-v2/page.tsx` : Page de connexion
- `app/signup-v2/page.tsx` : Page d'inscription
- `app/upgrade/page.tsx` : Page d'upgrade Demo → Pro

### **3. Layouts et pages**
- `app/cockpit/demo/layout.tsx` : Layout Mode Démo (+ banner + CTA Pro)
- `app/cockpit/demo/page.tsx` : Page d'accueil Mode Démo
- `app/cockpit/pro/layout.tsx` : Layout Mode Pro
- `app/cockpit/pro/page.tsx` : Page d'accueil Mode Pro (avec vraies données)

---

## 🎯 Architecture

### **Flow d'authentification**

#### **Inscription (Signup)**
1. Utilisateur remplit formulaire (`/signup-v2`)
2. Server action `signup()` :
   - Crée compte Supabase Auth
   - Crée organisation
   - Crée profil avec `plan='demo'` et `role='owner'`
3. Redirection automatique vers `/cockpit/demo`

#### **Connexion (Login)**
1. Utilisateur remplit formulaire (`/login-v2`)
2. Server action `login()` :
   - Authentifie via Supabase
   - Lit `profiles.plan`
3. Redirection selon plan :
   - `plan='demo'` → `/cockpit/demo`
   - `plan='pro'` ou `'enterprise'` → `/cockpit/pro`

#### **Upgrade Demo → Pro**
1. Utilisateur clique "Passer en Pro"
2. Redirigé vers `/upgrade`
3. Clique "Activer le Mode Pro"
4. Server action `upgradeToPro()` :
   - Update `profiles.plan = 'pro'`
5. Redirection vers `/cockpit/pro`

### **Protection par middleware**

Le middleware (`middleware-v2.ts`) gère :

1. **Routes publiques** : `/`, `/login-v2`, `/signup-v2`, `/pricing`, etc.
2. **Authentification** : Redirect `/login-v2` si non connecté
3. **Plan-based routing** :
   - `/cockpit` → auto-redirect selon `profiles.plan`
   - `/cockpit/pro` → bloqué si `plan='demo'` (redirect `/cockpit/demo`)
   - `/cockpit/demo` → toujours accessible

---

## 🧪 Tests à effectuer

### **1. Test Signup**
```bash
# 1. Aller sur http://localhost:3000/signup-v2
# 2. Remplir formulaire (email, password)
# 3. Vérifier :
#    - Redirection vers /cockpit/demo
#    - Banner bleu "Mode Démo"
#    - CTA "Passer en Pro" visible
```

### **2. Test Login (utilisateur demo)**
```bash
# 1. Se déconnecter
# 2. Aller sur http://localhost:3000/login-v2
# 3. Se connecter avec compte demo
# 4. Vérifier :
#    - Redirection vers /cockpit/demo
#    - Pas d'accès à /cockpit/pro (redirect auto)
```

### **3. Test Upgrade Demo → Pro**
```bash
# 1. En mode demo, cliquer "Passer en Pro"
# 2. Aller sur /upgrade
# 3. Cliquer "Activer le Mode Pro"
# 4. Vérifier :
#    - Update profiles.plan='pro'
#    - Redirection vers /cockpit/pro
#    - Banner dorée "Mode Pro Actif"
#    - Badge "PRO" dans header
```

### **4. Test Login (utilisateur pro)**
```bash
# 1. Se déconnecter
# 2. Se reconnecter
# 3. Vérifier :
#    - Redirection vers /cockpit/pro
#    - Accès à toutes les fonctionnalités
```

### **5. Test Protection routes**
```bash
# Utilisateur demo essaie d'accéder à /cockpit/pro :
# → Redirection automatique vers /cockpit/demo

# Utilisateur non connecté essaie /cockpit/demo :
# → Redirection vers /login-v2?redirect=/cockpit/demo
```

---

## 📊 Données créées lors de signup

Lors de l'inscription, `signup()` crée automatiquement :

### **1. Table `auth.users`** (Supabase Auth)
```sql
INSERT INTO auth.users (email, encrypted_password, ...)
VALUES ('user@example.com', 'hashed_password', ...);
```

### **2. Table `organizations`**
```sql
INSERT INTO organizations (id, name, created_at)
VALUES (gen_random_uuid(), 'Organisation de John Doe', NOW());
```

### **3. Table `profiles`**
```sql
INSERT INTO profiles (
  id,                   -- auth.users.id
  organization_id,      -- ID créé ci-dessus
  email,
  first_name,
  last_name,
  plan,                 -- 'demo' par défaut
  role,                 -- 'owner' pour le créateur
  created_at
) VALUES (...);
```

---

## 🔄 Prochaines étapes (Phase 3)

1. **Appliquer le schéma SQL** :
   ```bash
   # Dans Supabase SQL Editor
   psql < database/schema-v2-clean.sql
   ```

2. **Créer le module Projets** :
   - `/cockpit/demo/projets/page.tsx` (mock data)
   - `/cockpit/pro/projets/page.tsx` (vraies données)
   - `/cockpit/pro/projets/nouveau/page.tsx` (formulaire création)
   - `/cockpit/pro/projets/[id]/page.tsx` (détails projet)

3. **Tester CRUD projets** :
   - Créer projet (Pro uniquement)
   - Lire projets (Demo + Pro)
   - Mettre à jour projet (Pro uniquement)
   - Supprimer projet (Pro uniquement)

---

## 🐛 Points d'attention

### **Middleware existant**
Le fichier `middleware.ts` actuel utilise l'ancienne architecture avec `users.pro_active`.  
**Pour activer la V2** :
1. Renommer `middleware.ts` en `middleware-legacy.ts`
2. Renommer `middleware-v2-backup.ts` en `middleware.ts`

### **Table profiles**
La table `profiles` doit exister avec les colonnes :
- `id` (UUID, FK vers auth.users)
- `organization_id` (UUID, FK vers organizations)
- `plan` (TEXT, CHECK IN ('demo', 'pro', 'enterprise'))
- `role` (TEXT, CHECK IN ('owner', 'admin', 'member', 'viewer'))

Si elle n'existe pas, appliquer `database/schema-v2-clean.sql`.

### **Supabase Auth**
Vérifier que l'auth Supabase est configurée :
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## ✅ Checklist de déploiement

- [ ] Tester signup en local
- [ ] Tester login demo en local
- [ ] Tester upgrade demo→pro en local
- [ ] Tester login pro en local
- [ ] Tester protection routes en local
- [ ] Appliquer schema-v2-clean.sql sur Supabase
- [ ] Renommer middleware-v2-backup.ts → middleware.ts
- [ ] Commit Phase 2
- [ ] Push vers GitHub
- [ ] Déployer sur Vercel
- [ ] Tester flow complet en production
- [ ] Valider avec utilisateur réel

---

## 📝 Notes

- **Mode Démo** : Lecture seule, données fictives, CTA upgrade visible partout
- **Mode Pro** : Édition complète, vraies données, badge PRO, accès IA
- **Upgrade** : Gratuit pour le moment (phase de lancement)
- **Organisation** : Créée automatiquement lors du signup (single-tenant SaaS)

---

**Auteur** : GitHub Copilot  
**Contact** : Pour questions ou support, voir RECONSTRUCTION_PLAN.md
