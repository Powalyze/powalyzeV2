# 🚀 GUIDE DE DÉPLOIEMENT STRIPE

## Variables d'environnement requises

Ajoutez ces variables dans `.env.local` (local) et dans Vercel (production):

```env
# ====================================================================
# STRIPE CONFIGURATION
# ====================================================================

# Clés API Stripe (récupérer depuis https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_xxx  # Utiliser sk_live_xxx en production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # Utiliser pk_live_xxx en production

# Webhook Secret (récupérer après création du webhook)
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Price IDs (créer les produits dans Stripe Dashboard)
STRIPE_PRICE_PRO=price_xxx  # ID du prix PRO (49€/mois)
STRIPE_PRICE_ENTERPRISE=price_yyy  # ID du prix ENTERPRISE (199€/mois)
```

## Étapes de configuration Stripe

### 1. Créer un compte Stripe
1. Aller sur https://dashboard.stripe.com/register
2. Compléter l'inscription
3. Activer le mode TEST d'abord

### 2. Créer les produits et prix
1. Dashboard Stripe → **Products** → **Add product**
2. Créer produit "Powalyze PRO":
   - Name: `Powalyze PRO`
   - Description: `Accès complet au cockpit avec IA et connecteurs`
   - Pricing: `49 EUR / mois`
   - Billing period: `Monthly`
   - Cocher "Recurring"
3. Copier le **Price ID** (commence par `price_xxx`)
4. Remplacer dans `.env.local`: `STRIPE_PRICE_PRO=price_xxx`

### 3. Configurer le Webhook
1. Dashboard Stripe → **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: 
   - Local: `http://localhost:3000/api/stripe/webhook` (utiliser ngrok en dev)
   - Production: `https://www.powalyze.com/api/stripe/webhook`
3. Sélectionner les événements:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copier le **Webhook signing secret** (commence par `whsec_xxx`)
5. Remplacer dans `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_xxx`

### 4. Appliquer la migration SQL
```bash
# Appliquer la migration sur Supabase
psql $DATABASE_URL -f database/migrations/004_multi_user_pro.sql
```

Ou via Supabase Dashboard:
1. Aller sur https://supabase.com/dashboard
2. Projet → **SQL Editor**
3. Copier le contenu de `database/migrations/004_multi_user_pro.sql`
4. Exécuter

### 5. Configurer les variables Vercel (Production)
```bash
# Ajouter les variables d'environnement
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_PRICE_PRO
vercel env add STRIPE_PRICE_ENTERPRISE

# Redéployer
vercel --prod
```

### 6. Tester le flow Stripe

#### En local (avec ngrok):
```bash
# Terminal 1: Démarrer Next.js
npm run dev

# Terminal 2: Exposer localhost avec ngrok
ngrok http 3000

# Copier l'URL ngrok (ex: https://abc123.ngrok.io)
# Créer webhook dans Stripe Dashboard avec cette URL
```

#### Tester le checkout:
1. Aller sur http://localhost:3000/tarifs
2. Cliquer "Passer en PRO"
3. Utiliser carte de test Stripe:
   - Numéro: `4242 4242 4242 4242`
   - Expiration: `12/34`
   - CVC: `123`
4. Vérifier que:
   - Checkout réussit
   - Webhook reçu (voir logs console)
   - Role passe de `demo` → `pro-owner`
   - Accès `/cockpit` débloqué

## Architecture multi-user PRO

### Rôles disponibles:
- **demo**: Utilisateur DEMO (gratuit, données mock)
- **pro-owner**: Propriétaire du compte PRO (peut inviter membres, gérer abonnement)
- **pro-member**: Membre d'une organisation PRO (accès limité)
- **admin**: Administrateur système (accès /admin/users)

### Flow d'upgrade:
1. User DEMO va sur `/tarifs`
2. Clique "Passer en PRO"
3. Stripe Checkout → Paiement 49€/mois
4. Webhook `checkout.session.completed` reçu
5. System met à jour:
   - `profiles.role = 'pro-owner'`
   - `subscriptions.status = 'active'`
6. User peut maintenant:
   - Accéder `/cockpit` (données réelles)
   - Inviter membres sur `/cockpit/equipe`
   - Gérer abonnement sur `/cockpit/abonnement`

### Gestion employés:
1. Pro-owner va sur `/cockpit/equipe`
2. Clique "Inviter un membre"
3. Entre email employé
4. System crée:
   - Profile avec `role='pro-member'`
   - Entry dans `organizations_members`
5. Employé reçoit email invitation
6. Employé se connecte → Accès `/cockpit`

## Sécurité

### RLS Policies activées:
- ✅ `subscriptions`: Seuls members de l'org peuvent voir
- ✅ `organizations_members`: Seul pro-owner peut gérer
- ✅ `profiles`: Seul admin peut changer rôles
- ✅ `demo_*`: Isolation par user_id + role='demo'
- ✅ `projects/risks/decisions`: Isolation par organization_id + role IN ('pro-owner', 'pro-member')

### Guards implémentées:
- `guardDemo()`: Protège `/cockpit-demo`
- `guardPro()`: Protège `/cockpit` (pro-owner + pro-member + admin)
- `guardAdmin()`: Protège `/admin/users`

## Monitoring Stripe

### Dashboard Stripe:
- **Customers**: Voir tous les clients Powalyze
- **Subscriptions**: Statut abonnements actifs/annulés
- **Payments**: Historique paiements
- **Webhooks**: Logs des événements reçus

### Logs Next.js:
```bash
# Voir logs webhooks
grep "Webhook reçu" logs.txt

# Voir logs checkout
grep "Checkout completé" logs.txt

# Voir logs upgrade
grep "Subscription mise à jour" logs.txt
```

## Troubleshooting

### Webhook ne fonctionne pas:
1. Vérifier `STRIPE_WEBHOOK_SECRET` dans `.env.local`
2. Vérifier URL webhook dans Stripe Dashboard
3. Vérifier logs Stripe: Dashboard → Webhooks → [votre endpoint] → Logs
4. Tester manuellement: Dashboard → Webhooks → Send test webhook

### Checkout échoue:
1. Vérifier `STRIPE_SECRET_KEY` est correct
2. Vérifier `STRIPE_PRICE_PRO` existe dans Stripe
3. Vérifier user est authentifié (supabase session)
4. Voir logs console: `npm run dev`

### User ne passe pas en PRO après paiement:
1. Vérifier webhook `checkout.session.completed` reçu
2. Vérifier metadata `organization_id` et `user_id` présents
3. Vérifier mise à jour DB: `SELECT * FROM subscriptions WHERE organization_id = 'xxx'`
4. Vérifier role: `SELECT role FROM profiles WHERE id = 'xxx'`

## Passer en production

### Checklist avant LIVE:
- [ ] Créer compte Stripe LIVE (sortir du mode TEST)
- [ ] Créer produits PRO/ENTERPRISE en mode LIVE
- [ ] Copier les Price IDs LIVE dans variables Vercel
- [ ] Créer webhook avec URL production (https://www.powalyze.com/api/stripe/webhook)
- [ ] Activer clés API LIVE (`sk_live_xxx` et `pk_live_xxx`)
- [ ] Tester checkout avec vraie carte (puis rembourser)
- [ ] Configurer alertes Stripe (paiements échoués, etc.)
- [ ] Ajouter page mentions légales avec infos Stripe
- [ ] Ajouter page CGV avec conditions abonnement

## Support

Pour toute question Stripe:
- Documentation: https://stripe.com/docs
- Support Stripe: https://support.stripe.com
- Communauté: https://github.com/stripe-samples

---

**Dernière mise à jour**: 2026-01-27  
**Version Stripe**: 2024-12-18.acacia  
**Version Next.js**: 16.1.3
