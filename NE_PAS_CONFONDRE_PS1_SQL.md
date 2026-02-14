# ⚠️ NE PAS CONFONDRE: Script PowerShell vs Fichier SQL

## 🔴 ERREUR À ÉVITER

```
❌ NE PAS exécuter .\apply-subscriptions-schema.ps1 dans Supabase SQL Editor
```

---

## 📁 DEUX FICHIERS DIFFÉRENTS

### 1️⃣ `apply-subscriptions-schema.ps1` - Script PowerShell

**Type**: Script d'automatisation PowerShell  
**Où l'utiliser**: Terminal PowerShell (VS Code ou Windows PowerShell)  
**Quoi**: Copie le SQL dans votre presse-papier et vous guide  

**Contenu (exemple)**:
```powershell
# PowerShell Script to apply subscriptions schema to Supabase
Write-Host "🗄️  Application du schema..." -ForegroundColor Cyan
$sqlContent = Get-Content "database\subscriptions-schema.sql" -Raw
Set-Clipboard -Value $sqlContent
# etc.
```

**Utilisation**:
```powershell
# Dans le terminal PowerShell
.\apply-subscriptions-schema.ps1
```

---

### 2️⃣ `database/subscriptions-schema.sql` - Fichier SQL

**Type**: Script SQL pur pour PostgreSQL  
**Où l'utiliser**: Supabase SQL Editor  
**Quoi**: Crée les tables, policies, functions, triggers  

**Contenu (début)**:
```sql
-- ============================================================
-- POWALYZE — SCHEMA ABONNEMENTS PRO & ENTREPRISE
-- ============================================================

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  -- etc.
);
```

**Utilisation**:
```
1. Copier le contenu du fichier
2. Aller sur Supabase Dashboard → SQL Editor
3. Coller dans "New query"
4. Cliquer "Run"
```

---

## 🎯 RÉCAPITULATIF

| Fichier | Type | Où exécuter | But |
|---------|------|-------------|-----|
| `apply-subscriptions-schema.ps1` | PowerShell | Terminal | Automatisation (copie SQL) |
| `database/subscriptions-schema.sql` | SQL | Supabase SQL Editor | Création tables DB |

---

## ✅ PROCESSUS CORRECT

### Option A: Automatique (via script PowerShell)

```powershell
# 1. Dans terminal PowerShell
.\apply-subscriptions-schema.ps1

# 2. Le script copie le SQL dans presse-papier
# 3. Aller sur Supabase Dashboard → SQL Editor
# 4. Coller (Ctrl+V)
# 5. Cliquer "Run"
```

### Option B: Manuel (sans script)

```powershell
# 1. Copier le SQL dans presse-papier
Get-Content database\subscriptions-schema.sql | Set-Clipboard

# 2. Aller sur Supabase Dashboard → SQL Editor
# 3. Coller (Ctrl+V)
# 4. Cliquer "Run"
```

### Option C: Ultra-manuel (copier/coller fichier)

```
1. Ouvrir: database/subscriptions-schema.sql dans VS Code
2. Sélectionner tout (Ctrl+A)
3. Copier (Ctrl+C)
4. Aller sur Supabase Dashboard → SQL Editor
5. Coller (Ctrl+V)
6. Cliquer "Run"
```

---

## 🚨 ERREURS COMMUNES

### Erreur #1: Exécuter .ps1 dans Supabase
```
❌ Copier ".\apply-subscriptions-schema.ps1" dans Supabase SQL Editor
✅ Copier "database/subscriptions-schema.sql" dans Supabase SQL Editor
```

### Erreur #2: Exécuter .sql dans PowerShell
```
❌ PS C:\powalyze> .\database\subscriptions-schema.sql
✅ Copier contenu du .sql → Supabase SQL Editor → Run
```

### Erreur #3: Nom de fichier au lieu du contenu
```
❌ Taper "subscriptions-schema.sql" dans Supabase SQL Editor
✅ Copier le CONTENU du fichier (315 lignes de code SQL)
```

---

## 📋 CHECKLIST RAPIDE

Avant d'aller sur Supabase, vérifier:

- [ ] J'ai **copié le contenu** de `database/subscriptions-schema.sql`
- [ ] Pas juste le nom du fichier "subscriptions-schema.sql"
- [ ] Pas le script PowerShell "apply-subscriptions-schema.ps1"
- [ ] Mais bien les **315 lignes de code SQL**
- [ ] Commençant par `-- ============================================================`

Dans Supabase SQL Editor, vérifier:

- [ ] Je suis dans **"SQL Editor"** (pas Table Editor)
- [ ] J'ai créé une **"New query"**
- [ ] J'ai **collé le SQL** (Ctrl+V)
- [ ] Je vois ~315 lignes de code SQL
- [ ] Je clique **"Run"** (pas "Save")

---

## ✅ RÉSULTAT ATTENDU

Après avoir cliqué "Run" dans Supabase:

```
✅ Success. No rows returned
```

Puis vérifier dans **Table Editor** (menu gauche):

```
📊 subscriptions (nouvelle table)
📋 subscription_features (nouvelle table avec 23 lignes)
📧 enterprise_requests (nouvelle table)
```

---

**Le SQL est dans votre presse-papier maintenant. Allez sur Supabase Dashboard ! 🚀**

**Guide détaillé**: Voir `GUIDE_APPLICATION_SCHEMA_SUPABASE.md`
