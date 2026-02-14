# 🚨 GUIDE RAPIDE: Appliquer le Schema SQL sur Supabase

## ❌ ERREUR COMMUNE

**NE PAS exécuter `.\apply-subscriptions-schema.ps1` dans Supabase SQL Editor !**

Le fichier `.ps1` est un script PowerShell, pas du SQL.

---

## ✅ MÉTHODE CORRECTE

### Étape 1: Copier le SQL
Le schema SQL est **déjà dans votre presse-papier** ! ✅

Sinon, copier manuellement:
```powershell
Get-Content database\subscriptions-schema.sql | Set-Clipboard
```

### Étape 2: Aller sur Supabase

1. **Ouvrir**: https://supabase.com/dashboard
2. **Sélectionner** votre projet (celui avec l'URL: phfeteiholkfiredgero.supabase.co)
3. **Cliquer** sur "SQL Editor" dans le menu de gauche (icône </> )

### Étape 3: Créer nouvelle query

1. **Cliquer** le bouton "+ New query" en haut à gauche
2. Ou cliquer le bouton "+ New" puis "New query"

### Étape 4: Coller le SQL

1. **Cliquer** dans l'éditeur SQL (zone de texte)
2. **Coller** avec `Ctrl+V` (ou `Cmd+V` sur Mac)
3. Vous devriez voir ~315 lignes de SQL commençant par:
   ```sql
   -- ============================================================
   -- POWALYZE — SCHEMA ABONNEMENTS PRO & ENTREPRISE
   -- ============================================================
   ```

### Étape 5: Exécuter

1. **Cliquer** le bouton "Run" en bas à droite (ou `F5`)
2. **Attendre** 5-10 secondes
3. **Vérifier** le résultat:
   - ✅ "Success. No rows returned" = PARFAIT !
   - ❌ "ERROR: ..." = Voir section dépannage ci-dessous

### Étape 6: Vérifier

Créer une nouvelle query et exécuter:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'subscription_features', 'enterprise_requests');
```

**Résultat attendu**: 3 lignes
- subscriptions
- subscription_features
- enterprise_requests

---

## 🔍 VÉRIFICATION VISUELLE

Dans Supabase Dashboard, aller dans **"Table Editor"** (menu gauche).

Vous devriez voir 3 nouvelles tables:
- 📊 `subscriptions` (12 colonnes)
- 📋 `subscription_features` (6 colonnes, 23 lignes de seed data)
- 📧 `enterprise_requests` (11 colonnes)

---

## 🚨 DÉPANNAGE

### Erreur: "relation already exists"
**C'est OK !** Le schema est idempotent. Cela signifie que les tables existent déjà.

### Erreur: "permission denied"
Vérifier que vous êtes connecté avec un compte admin du projet Supabase.

### Erreur: "syntax error at or near"
Vérifier que vous avez copié **tout le fichier** `database/subscriptions-schema.sql`, pas juste une partie.

### Erreur: "type ... already exists"
**C'est OK !** Les ENUMs PostgreSQL existent déjà. Le script gère ce cas.

---

## 📊 CONTENU DU SCHEMA

Le script va créer:

### Tables (3)
1. **subscriptions** - Gestion abonnements Pro/Entreprise
2. **subscription_features** - Catalogue features (9 Pro + 14 Enterprise)
3. **enterprise_requests** - Demandes de devis

### Policies RLS (9)
- Users can read their own subscriptions
- Users can read all features
- Public can insert enterprise requests
- Etc.

### Functions (3)
- `has_active_subscription(user_uuid)` → boolean
- `get_user_plan(user_uuid)` → subscription_plan
- `has_feature_access(user_uuid, feature_key)` → boolean

### Triggers (2)
- Auto-sync `profiles.role` when subscription status changes
- Auto-sync `subscriptions.status` when profile role changes

---

## ✅ APRÈS APPLICATION

Une fois le schema appliqué avec succès:

1. **Tester le formulaire Entreprise**:
   - Aller sur: https://www.powalyze.com/pricing
   - Remplir le formulaire Entreprise
   - Soumettre
   - Vérifier dans Supabase Table Editor → `enterprise_requests`

2. **Tester l'API check subscription** (avec un JWT token):
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://www.powalyze.com/api/subscriptions/check
   ```

3. **Créer un trial manuellement** (optionnel):
   ```sql
   INSERT INTO subscriptions (
     user_id, 
     plan, 
     status, 
     trial_start, 
     trial_end
   ) VALUES (
     'YOUR_USER_ID', 
     'pro', 
     'trialing', 
     NOW(), 
     NOW() + INTERVAL '14 days'
   );
   ```

---

## 🎯 PROCHAINES ÉTAPES

Après avoir appliqué le schema avec succès:

```
✅ Schema DB appliqué
→ Tester /pricing: .\test-pricing-journey.ps1
→ Configurer Stripe: Voir STRIPE_INTEGRATION_GUIDE.md
→ Activer middleware: .\activate-subscription-middleware.ps1
```

---

**Le contenu SQL est dans votre presse-papier. Allez sur Supabase Dashboard → SQL Editor → Coller → Run ! 🚀**
