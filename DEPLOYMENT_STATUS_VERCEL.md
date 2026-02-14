# ⚠️ ATTENTION : Déploiement échoué sur Vercel

## 🎯 Corrections appliquées localement (✅ Build local réussi)

### A. Header unique ✅
- Supprimé header duplicata dans `/pricing`
- Conservé uniquement `<Navbar />` du layout

### B. Bouton abonnement Stripe ✅
- Créé `components/SubscribeProButton.tsx`
- Créé route API `/api/stripe/checkout/pro`
- Intégré dans `/pricing` à la place de "Démarrer avec Pro"

### C. Protection routes middleware ✅
- Ajouté `/pricing` aux routes publiques
- Vérification table `subscriptions` au lieu de `users.pro_active`
- Exceptions pour `/api/stripe/*`

---

## ❌ ERREUR DÉPLOIEMENT VERCEL

**Build local** : ✅ Réussi (0 erreurs)  
**Build Vercel** : ❌ Échec `npm run build exited with 1`

**Causes possibles** :

1. **Variables d'environnement manquantes** :
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   STRIPE_SECRET_KEY
   NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY
   NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY
   ```

2. **Middleware vérifie table `subscriptions`** :
   - Le code middleware essaie de query `subscriptions` table
   - Si Supabase pas configuré → erreur à la compilation

---

## 🔧 SOLUTIONS

### Option 1 : Configurer les variables Vercel ⭐ RECOMMANDÉ

**Dans Vercel Dashboard** → powalyze-v2 → Settings → Environment Variables

Ajouter :
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=price_yyy
JWT_SECRET=votre-secret-jwt
```

Puis redéployer :
```bash
vercel --prod
```

---

### Option 2 : Rendre le middleware plus tolérant

**Modifier middleware.ts** pour ne pas fail si Supabase indisponible :

```typescript
// Si connecté via Supabase, récupérer les infos utilisateur
if (user && supabase) {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    // Si erreur de connexion, laisser passer en mode dégradé
    if (error) {
      console.warn('⚠️ [MIDDLEWARE] Supabase query failed:', error);
      return res;
    }

    const isPro = subscription?.plan === 'pro' && subscription?.status === 'active';
    // ... reste du code
```

---

### Option 3 : Mode DEMO pour le build

**Ajouter dans `.env.production`** :

```env
# Mode DEMO pour build sans Supabase
NEXT_PUBLIC_DEMO_MODE=true
```

**Puis dans middleware** :

```typescript
// Mode DEMO : skip Supabase checks
if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
  console.log('🎭 [MIDDLEWARE] Mode DEMO activé');
  return res;
}
```

---

## 📋 FICHIERS MODIFIÉS (prêts pour déploiement)

| Fichier | Status | Description |
|---------|--------|-------------|
| `app/pricing/page.tsx` | ✅ Modifié | Header supprimé + SubscribeProButton intégré |
| `components/SubscribeProButton.tsx` | ✅ Créé | Composant bouton abonnement |
| `app/api/stripe/checkout/pro/route.ts` | ✅ Créé | API Stripe Checkout |
| `middleware.ts` | ✅ Modifié | Protection routes + subscriptions check |
| `.env.local.example` | ✅ Créé | Template variables |

**Build local** : ✅ 230 routes générées, 0 erreurs  
**Prêt pour déploiement** : ⚠️ Nécessite config Vercel

---

## 🚀 PROCHAINES ÉTAPES

### 1. Configurer Vercel

```bash
# Depuis votre dashboard Vercel
# Settings → Environment Variables → Add
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY
```

### 2. Créer produits Stripe

**Stripe Dashboard** → Products :
- Créer "Powalyze PRO"
- Prix 1 : 29 EUR/mois → Copier `price_xxx`
- Prix 2 : 24 EUR/mois (288 EUR/an) → Copier `price_yyy`

### 3. Configurer webhook Stripe

**Stripe Dashboard** → Webhooks :
- URL : `https://www.powalyze.com/api/stripe/webhook`
- Events : `checkout.*`, `customer.subscription.*`
- Copier signing secret → `STRIPE_WEBHOOK_SECRET`

### 4. Créer table `subscriptions` dans Supabase

```sql
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('pro', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  billing_interval TEXT CHECK (billing_interval IN ('monthly', 'yearly')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_subscriptions" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id);
```

### 5. Redéployer

```bash
vercel --prod
```

---

## ✅ RÉSULTAT FINAL ATTENDU

**Après configuration** :

1. ✅ Header unique sur toutes les pages
2. ✅ Bouton "S'abonner au plan Pro" sur `/pricing`
3. ✅ Redirect vers Stripe Checkout
4. ✅ Paiement → Webhook → `subscriptions` mise à jour
5. ✅ Accès immédiat au cockpit Pro
6. ✅ Protection des routes fonctionnelle

---

**Date** : 2026-02-14  
**Status** : ⚠️ BUILD LOCAL OK, CONFIG VERCEL REQUISE  
**Next** : Configurer variables Vercel → Redéployer
