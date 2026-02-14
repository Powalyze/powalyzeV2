# 🚀 Finalisation Déploiement Pricing Pro/Entreprise

## ✅ État actuel

**Déploiement effectué**: ✅ Production (www.powalyze.com)
**Date**: 13 février 2026
**Commit**: Pricing Pro/Entreprise avec Stripe integration

---

## 📝 Tâches finalisées

### ✅ Code déployé sur production
- [x] Page `/pricing` avec plans Pro et Entreprise
- [x] Formulaire demande Entreprise
- [x] 8 routes API (subscriptions + emails)
- [x] Middleware protection route (créé, pas encore activé)
- [x] 3 routes API Stripe (checkout, webhook, portal)
- [x] Schema SQL complet

### ✅ Documentation créée
- [x] `DEPLOYMENT_PRICING_PRO_ENTERPRISE.md` - Guide déploiement complet
- [x] `IMPLEMENTATION_SUMMARY.md` - Récapitulatif technique
- [x] `STRIPE_INTEGRATION_GUIDE.md` - Guide intégration Stripe
- [x] `apply-subscriptions-schema.ps1` - Script SQL automatique
- [x] `test-pricing-journey.ps1` - Script test automatisé

---

## 🎯 Actions immédiates requises (VOUS)

### 1. ✅ Appliquer le schema Supabase (CRITIQUE)

**Option A: Via Supabase Dashboard** (Recommandé)
```
1. Ouvrir: https://supabase.com/dashboard
2. Sélectionner votre projet
3. Aller dans "SQL Editor" (gauche)
4. Cliquer "New query"
5. Copier tout le contenu de: database/subscriptions-schema.sql
6. Coller dans l'éditeur
7. Cliquer "Run" (ou F5)
8. Vérifier: "Success. No rows returned"
```

**Option B: Via Script PowerShell**
```powershell
# Ouvre automatiquement le SQL copié dans presse-papier
.\apply-subscriptions-schema.ps1
# Suivre les instructions à l'écran
```

**Option C: Via psql (ligne de commande)**
```bash
# Si vous avez psql installé
psql "postgresql://postgres:[PASSWORD]@db.phfeteiholkfiredgero.supabase.co:5432/postgres" -f database/subscriptions-schema.sql
```

**Vérification après exécution:**
```sql
-- Dans SQL Editor Supabase
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'subscription_features', 'enterprise_requests');

-- Devrait retourner 3 lignes
```

---

### 2. 🧪 Tester /pricing sur production

**Test automatique:**
```powershell
.\test-pricing-journey.ps1
```

**Test manuel:**
1. Ouvrir: https://www.powalyze.com/pricing
2. Vérifier:
   - ✅ Page se charge sans erreur
   - ✅ Toggle mensuel/annuel fonctionne
   - ✅ Prix affichés: 29€/mois OU 24€/mois (annuel)
   - ✅ Boutons "Démarrer avec Pro" cliquables
   - ✅ Section FAQ dépliable
   - ✅ Formulaire Entreprise s'affiche

3. Tester formulaire Entreprise:
   - Remplir tous les champs
   - Soumettre
   - Vérifier message de confirmation

4. Vérifier dans Supabase:
```sql
SELECT * FROM enterprise_requests ORDER BY created_at DESC LIMIT 1;
```

---

### 3. 🔐 Activer le middleware subscription

**Actuellement**: `middleware.ts` (ancien) est actif
**Nouveau**: `middleware-subscription.ts` (avec protection Pro)

**Option A: Remplacement complet** (Recommandé)
```bash
# Backup ancien middleware
cp middleware.ts middleware-old-backup.ts

# Activer nouveau middleware
cp middleware-subscription.ts middleware.ts

# Rebuild et redeploy
npm run build
vercel --prod
```

**Option B: Merge manuel**
Fusionner la logique de `middleware-subscription.ts` dans `middleware.ts` existant.

**Test après activation:**
1. Se connecter avec un compte test (sans subscription)
2. Essayer d'accéder à `/cockpit/projets`
3. Devrait rediriger vers `/pricing?upgrade=required&from=/cockpit/projets`

---

### 4. 🎫 Intégration Stripe (OPTIONNEL mais recommandé)

**Prérequis:**
- Compte Stripe créé
- Produits créés dans Stripe Dashboard

**Étapes:**

#### A. Créer compte Stripe
1. Aller sur: https://dashboard.stripe.com/register
2. Créer compte (mode Test pour commencer)

#### B. Récupérer les clés API
1. Dashboard → **Developers** → **API Keys**
2. Copier:
   - `STRIPE_SECRET_KEY` (sk_test_xxx)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_xxx)

#### C. Créer les produits Stripe
1. Dashboard → **Products** → **Add Product**

**Produit 1: Pro Mensuel**
- Nom: `Powalyze Pro - Mensuel`
- Prix: `29.00 EUR / month`
- Récurrent: Monthly
→ Copier le Price ID: `price_xxxxx`

**Produit 2: Pro Annuel**
- Nom: `Powalyze Pro - Annuel`
- Prix: `24.00 EUR / month` (facturé annuellement = 288€/an)
- Récurrent: Yearly
→ Copier le Price ID: `price_yyyyy`

#### D. Configurer webhooks

**Local (développement):**
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copier le webhook secret: whsec_xxx
```

**Production:**
1. Dashboard → **Developers** → **Webhooks**
2. Add endpoint: `https://www.powalyze.com/api/stripe/webhook`
3. Sélectionner événements:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
4. Copier webhook secret: `whsec_xxx`

#### E. Ajouter variables Vercel
```bash
# Via Vercel Dashboard ou CLI
vercel env add STRIPE_SECRET_KEY
# Entrer: sk_test_xxxxx (ou sk_live_xxxxx)

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# Entrer: pk_test_xxxxx

vercel env add STRIPE_WEBHOOK_SECRET
# Entrer: whsec_xxxxx

# Redeploy
vercel --prod
```

#### F. Tester paiement (mode test)
1. Aller sur: https://www.powalyze.com/pricing
2. Cliquer "Démarrer avec Pro"
3. Utiliser carte test: `4242 4242 4242 4242`
4. Expire: N'importe quelle date future
5. CVC: N'importe quel 3 chiffres
6. Compléter le paiement
7. Vérifier dans Supabase:
```sql
SELECT * FROM subscriptions WHERE user_id = 'YOUR_USER_ID';
-- Devrait montrer status = 'active'
```

**Documentation complète:** Voir `STRIPE_INTEGRATION_GUIDE.md`

---

## 📊 Checklist de validation finale

### Base de données
- [ ] Schema appliqué sur Supabase
- [ ] Table `subscriptions` existe
- [ ] Table `subscription_features` existe avec 23 features (9 Pro + 14 Enterprise)
- [ ] Table `enterprise_requests` existe
- [ ] Functions helper créées (has_active_subscription, get_user_plan)
- [ ] RLS activé sur toutes les tables

### Interface utilisateur
- [ ] Page `/pricing` accessible
- [ ] Toggle mensuel/annuel fonctionne
- [ ] Prix affichés correctement (29€ vs 24€)
- [ ] Formulaire Entreprise fonctionnel
- [ ] FAQ dépliable
- [ ] Responsive (mobile, tablet, desktop)

### API Routes
- [ ] `/api/subscriptions/check` retourne statut subscription
- [ ] `/api/subscriptions/start-trial` crée trial 14 jours
- [ ] `/api/subscriptions/request-enterprise` enregistre demande
- [ ] 5 endpoints `/api/emails/*` loggent dans console

### Protection routes (après activation middleware)
- [ ] User sans subscription → redirect `/pricing`
- [ ] User avec trial → accès complet pendant 14 jours
- [ ] User Pro actif → accès complet illimité
- [ ] User Entreprise → accès fonctionnalités avancées

### Stripe (si intégré)
- [ ] Checkout session créée
- [ ] Paiement test réussi
- [ ] Subscription créée dans Stripe
- [ ] Webhook reçu et traité
- [ ] Subscription activée dans Supabase
- [ ] User reçoit accès immédiat

---

## 🎯 Parcours utilisateur complet à tester

### Scénario 1: Nouvel utilisateur (Trial)
```
1. Utilisateur visite www.powalyze.com
2. Clique "Démarrer gratuitement"
3. Crée compte via /signup
4. → Auto-redirect vers /cockpit
5. Voir badge "Trial - J restants"
6. Peut accéder à toutes les pages Pro
7. Après 14j → Redirect automatique vers /pricing
```

### Scénario 2: Upgrade Trial → Pro
```
1. User avec trial actif
2. Va sur /cockpit/profil
3. Clique "Passer à Pro"
4. → Redirect vers Stripe Checkout
5. Paie 29€/mois (ou 288€/an)
6. → Redirect retour vers /cockpit
7. Badge change: "Trial" → "Pro"
8. Accès permanent maintenu
```

### Scénario 3: Demande Entreprise
```
1. User ou visiteur sur /pricing
2. Scroll vers plan Entreprise
3. Clique "Demander un devis"
4. Remplit formulaire (8 champs)
5. Soumet
6. → User reçoit email confirmation
7. → Admin reçoit email notification
8. Support Powalyze contacte le prospect
```

### Scénario 4: Utilisateur sans subscription
```
1. User connecté mais trial expiré
2. Essaie d'aller sur /cockpit/projets
3. → Middleware intercepte
4. → Redirect vers /pricing?upgrade=required
5. Voit message "Votre essai est terminé"
6. Peut upgrade vers Pro
```

---

## 🚨 Points d'attention

### ⚠️ Sans Stripe
- Les utilisateurs peuvent **démarrer un trial** via API
- Mais ne peuvent **PAS payer automatiquement**
- Activation Pro doit être **manuelle** via Supabase:
```sql
-- Activer Pro manuellement
UPDATE subscriptions 
SET 
  plan = 'pro',
  status = 'active',
  billing_interval = 'monthly'
WHERE user_id = 'USER_ID_HERE';
```

### ⚠️ Emails
- Actuellement: **console.log uniquement**
- Aucun email réel envoyé
- Pour production → Intégrer SendGrid/Resend/Postmark

### ⚠️ Middleware
- Ancien middleware **toujours actif**
- Nouveau middleware créé mais **pas activé**
- Routes Pro **pas encore protégées**
- Action requise: Activer nouveau middleware

---

## 📚 Fichiers de référence

| Fichier | Description |
|---------|-------------|
| `database/subscriptions-schema.sql` | Schema complet à appliquer |
| `app/pricing/page.tsx` | Page tarifs (484 lignes) |
| `components/EnterpriseRequestForm.tsx` | Formulaire demande devis |
| `app/api/subscriptions/*` | 3 routes API subscriptions |
| `app/api/emails/*` | 5 routes templates email |
| `app/api/stripe/*` | 3 routes Stripe (checkout, webhook, portal) |
| `middleware-subscription.ts` | Nouveau middleware (à activer) |
| `STRIPE_INTEGRATION_GUIDE.md` | Guide Stripe complet |

---

## 🎉 Prochaines étapes suggérées

### Phase 1: Validation (MAINTENANT)
1. ✅ Appliquer schema Supabase
2. ✅ Tester /pricing sur production
3. ✅ Valider formulaire Entreprise fonctionne

### Phase 2: Activation (CETTE SEMAINE)
1. ✅ Activer nouveau middleware
2. ✅ Intégrer Stripe (mode Test)
3. ✅ Tester parcours complet avec carte test

### Phase 3: Production (AVANT ANNONCE)
1. ✅ Passer Stripe en mode Live
2. ✅ Intégrer service email (SendGrid)
3. ✅ Tester tous les scénarios utilisateurs
4. ✅ Monitoring (Stripe Dashboard + Supabase)

### Phase 4: Communication (APRÈS TESTS)
1. ✅ Annoncer nouveaux plans sur site
2. ✅ Email aux utilisateurs existants
3. ✅ Activer campagnes marketing
4. ✅ Support client préparé

---

## 📞 Support

**Stripe**: https://support.stripe.com
**Supabase**: https://supabase.com/docs
**Documentation Powalyze**: Voir fichiers MD ci-dessus

---

## ✅ Actions pour vous MAINTENANT:

```bash
# 1. Appliquer schema (CRITIQUE)
# → Via Supabase Dashboard SQL Editor
# → Copier/coller database/subscriptions-schema.sql
# → Cliquer "Run"

# 2. Tester production
.\test-pricing-journey.ps1

# 3. (Optionnel) Activer nouveau middleware
cp middleware.ts middleware-old.ts
cp middleware-subscription.ts middleware.ts
npm run build
vercel --prod

# 4. (Optionnel) Configurer Stripe
# → Suivre STRIPE_INTEGRATION_GUIDE.md
```

**Tout est prêt. À vous de jouer! 🚀**
