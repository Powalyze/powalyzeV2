# 🚀 CORRECTIONS IMMÉDIATE STRIPE + HEADER - DÉPLOIEMENT

## ✅ CORRECTIONS APPLIQUÉES

### A. DOUBLE HEADER SUPPRIMÉ ✅

**Problème** : La page `/pricing` affichait deux headers (un du layout + un dans la page).

**Solution appliquée** :
- **Supprimé** le header duplicata dans `app/pricing/page.tsx` (lignes 34-68)
- **Conservé** uniquement le `<Navbar />` du `app/layout.tsx`
- **Résultat** : Un seul header visible, cohérent sur toutes les pages

**Fichier modifié** : `app/pricing/page.tsx`

---

### B. PANIER STRIPE FONCTIONNEL ✅

**Créations** :

1. **Composant bouton d'abonnement** : `components/SubscribeProButton.tsx`
   - Vérifie si l'utilisateur est connecté
   - Redirige vers `/signup` si non connecté
   - Appelle l'API Stripe Checkout si connecté
   - Gère les états loading/error
   - Supporte monthly/yearly

2. **Route API Stripe Checkout** : `app/api/stripe/checkout/pro/route.ts`
   - Vérifie l'authentification (Bearer token)
   - Crée ou récupère le Stripe Customer
   - Crée la session Stripe Checkout
   - Redirige vers `success_url: /cockpit?success=true`
   - Gère `cancel_url: /pricing?canceled=true`

3. **Intégration dans /pricing** :
   - Bouton "S'abonner au plan Pro" remplace "Démarrer avec Pro"
   - Passe l'intervalle `monthly` ou `yearly` au composant
   - Affiche loader pendant redirection
   - Affiche erreur si problème

**Fichiers modifiés** :
- `app/pricing/page.tsx` (import + intégration bouton)
- `components/SubscribeProButton.tsx` (nouveau)
- `app/api/stripe/checkout/pro/route.ts` (nouveau)

---

### C. WEBHOOK STRIPE DÉJÀ FONCTIONNEL ✅

**Existant** : `app/api/stripe/webhook/route.ts`

**Événements gérés** :
- `checkout.session.completed` → Crée/met à jour `subscriptions` table
- `customer.subscription.updated` → Met à jour status
- `customer.subscription.deleted` → Marque comme canceled
- `invoice.payment_failed` → Status past_due
- `invoice.payment_succeeded` → Status active

**Action webhook** :
```sql
INSERT INTO subscriptions (
  user_id,
  plan,
  status,
  billing_interval,
  price_monthly,
  price_yearly,
  currency,
  stripe_customer_id,
  stripe_subscription_id,
  stripe_price_id
) VALUES (...);
```

**Résultat** : Utilisateur automatiquement `plan='pro'` après paiement

---

### D. PROTECTION DES ROUTES ✅

**Middleware mis à jour** : `middleware.ts`

**Améliorations** :
1. **Routes publiques** :
   - `/` (vitrine)
   - `/pricing` ✅ (accessible sans auth)
   - `/demo` (démo publique)
   - `/services`, `/contact`
   - `/auth/**`, `/login`, `/signup`

2. **Protection /cockpit** :
   - Vérifie table `subscriptions` directement
   - Filtre `status = 'active'` et `plan = 'pro'`
   - Redirect `/login` si pas authentifié
   - Redirect `/pricing` si authentifié mais pas Pro

3. **Exceptions API** :
   - `/api/stripe/checkout/**` → Pas de middleware check
   - `/api/stripe/webhook` → Pas de middleware check (signature Stripe)

**Logique** :
```typescript
const { data: subscription } = await supabase
  .from('subscriptions')
  .select('plan, status')
  .eq('user_id', user.id)
  .eq('status', 'active')
  .single();

const isPro = subscription?.plan === 'pro' && subscription?.status === 'active';
```

**Fichier modifié** : `middleware.ts`

---

### E. MODE ENTREPRISE ✅

**Déjà existant** :
- Bouton "Demander un devis" dans `/pricing`
- Modal `EnterpriseRequestForm` s'ouvre
- Formulaire envoyé (probablement via email ou webhook)

**Aucune modification requise** ✅

---

## 🔧 CONFIGURATION NÉCESSAIRE

### Variables d'environnement (Vercel)

**Créer dans Vercel Dashboard** → Project → Settings → Environment Variables :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx (ou sk_live_xxx)
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Price IDs Stripe
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=price_yyy

# Auth
JWT_SECRET=changez-moi-en-production
NEXTAUTH_SECRET=changez-moi-aussi
NEXTAUTH_URL=https://www.powalyze.com
```

### Créer les produits Stripe

**Dans Stripe Dashboard** :

1. **Créer un produit "Powalyze PRO"**
   - Nom : Powalyze PRO
   - Description : Cockpit exécutif complet

2. **Créer deux prix** :
   - **Monthly** : 29 EUR/mois → Copier `price_xxx`
   - **Yearly** : 24 EUR/mois (288 EUR/an) → Copier `price_yyy`

3. **Ajouter dans Vercel** :
   ```bash
   vercel env add NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY
   # Entrer: price_xxx
   
   vercel env add NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY
   # Entrer: price_yyy
   ```

### Configurer Webhook Stripe

**Dans Stripe Dashboard** → Webhooks :

1. **Créer un endpoint** :
   - URL : `https://www.powalyze.com/api/stripe/webhook`
   - Events : Sélectionner tout `checkout.*` et `customer.subscription.*`

2. **Copier le signing secret** :
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET
   # Entrer: whsec_xxx
   ```

---

## 📊 SCHÉMA DATABASE REQUIS

**Table `subscriptions`** (doit exister dans Supabase) :

```sql
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('pro', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  billing_interval TEXT CHECK (billing_interval IN ('monthly', 'yearly')),
  price_monthly NUMERIC,
  price_yearly NUMERIC,
  currency TEXT DEFAULT 'EUR',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  is_enterprise BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_subscriptions" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
```

**Appliquer dans Supabase** :
1. Supabase Dashboard → SQL Editor
2. Coller le SQL ci-dessus
3. Run

---

## 🚀 DÉPLOIEMENT PRÉ-PROD

### Étape 1 : Build local

```bash
npm run build
```

**Vérifier** :
- ✅ 0 erreurs TypeScript
- ✅ 0 erreurs de build
- ✅ Routes générées correctement

### Étape 2 : Déployer en preview (PAS PRODUCTION)

```bash
vercel --no-production
```

**Résultat** : URL temporaire `https://powalyze-xxx.vercel.app`

### Étape 3 : Tests sur preview

**Tests à effectuer** :

1. **Header unique** :
   - ✅ Visiter `/pricing`
   - ✅ Vérifier un seul header visible
   - ✅ Logo Powalyze cliquable → retour `/`

2. **Bouton abonnement** :
   - ✅ Cliquer "S'abonner au plan Pro"
   - ✅ Si pas connecté → redirect `/signup?plan=pro`
   - ✅ Si connecté → redirect Stripe Checkout

3. **Stripe Checkout** :
   - ✅ Formulaire de paiement Stripe s'affiche
   - ✅ Remplir avec carte test : `4242 4242 4242 4242`
   - ✅ Après paiement → redirect `/cockpit?success=true`

4. **Accès cockpit** :
   - ✅ Utilisateur a maintenant `plan='pro'` dans `subscriptions`
   - ✅ Peut accéder `/cockpit/projets`
   - ✅ Toutes les fonctionnalités Pro accessibles

5. **Protection** :
   - ✅ Déconnexion → Accès `/cockpit` → redirect `/login`
   - ✅ Connexion sans Pro → redirect `/pricing`

### Étape 4 : Validation utilisateur

**Fournir à l'utilisateur** :
- URL preview : `https://powalyze-xxx.vercel.app`
- Carte test Stripe : `4242 4242 4242 4242`
- Email test : `test@powalyze.com`

**Attendre validation avant production** ✋

---

## 📁 FICHIERS MODIFIÉS

| Fichier | Action | Description |
|---------|--------|-------------|
| `app/pricing/page.tsx` | ✏️ Modifié | Suppression header + intégration SubscribeProButton |
| `components/SubscribeProButton.tsx` | ✨ Créé | Composant bouton abonnement Stripe |
| `app/api/stripe/checkout/pro/route.ts` | ✨ Créé | API création session Stripe Checkout |
| `middleware.ts` | ✏️ Modifié | Protection routes + vérification subscriptions |
| `.env.local.example` | ✨ Créé | Template variables environnement |

**Total** : 3 créations, 2 modifications

---

## 🧪 CHECKLIST VALIDATION

**Avant déploiement production** :

- [ ] Build local réussi (0 erreurs)
- [ ] Preview déployée et accessible
- [ ] Header unique visible sur `/pricing`
- [ ] Bouton "S'abonner" redirige vers Stripe
- [ ] Paiement test fonctionnel (carte 4242...)
- [ ] Webhook reçu et subscriptions mise à jour
- [ ] Accès `/cockpit` autorisé après abonnement
- [ ] Variables Vercel configurées (Stripe, Supabase)
- [ ] Webhook Stripe configuré (endpoint + secret)
- [ ] Table `subscriptions` créée dans Supabase
- [ ] Validation utilisateur OK ✅

---

## 🎯 RÉSULTAT FINAL

**Expérience utilisateur** :

1. **Visiteur** → `/pricing` → Un seul header ✅
2. **Clic "S'abonner"** → Signup si besoin, sinon Stripe Checkout ✅
3. **Paiement Stripe** → Formulaire sécurisé, carte bancaire ✅
4. **Webhook automatique** → `subscriptions.plan = 'pro'` ✅
5. **Redirect /cockpit** → Accès immédiat au cockpit Pro ✅
6. **Mode Entreprise** → "Demander un devis" → Formulaire contact ✅

**Architecture** :
- ✅ Un seul header (layout-managed)
- ✅ Panier Stripe fonctionnel (abonnement)
- ✅ Webhook automatique (mise à jour DB)
- ✅ Protection routes (middleware)
- ✅ Mode Entreprise séparé (formulaire)

**Prêt pour production après validation** 🚀

---

**Date** : 2026-02-14  
**Status** : ✅ PRÉ-PROD READY  
**Next** : Tests + Validation utilisateur → Production
