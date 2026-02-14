# 🚀 DÉPLOIEMENT TARIFAIRE PRO / ENTREPRISE — PRÉ-PRODUCTION

## 📋 Résumé des modifications

Cette branche introduit une nouvelle structure tarifaire complète avec deux modes :
- **Mode Pro** : Abonnement mensuel/annuel (29€/24€ par mois)
- **Mode Entreprise** : Sur mesure avec devis personnalisé

---

## 📁 Fichiers créés

### 1. **Base de données**
```
database/subscriptions-schema.sql
```
- Tables : `subscriptions`, `subscription_features`, `enterprise_requests`
- Triggers automatiques pour sync profile ↔ subscription
- Functions helpers : `has_active_subscription()`, `get_user_plan()`, `has_feature_access()`
- Seed data pour les features Pro et Entreprise

### 2. **Pages**
```
app/pricing/page.tsx (NOUVELLE PAGE)
```
- Page tarifs complète avec hero, toggle mensuel/annuel, plans Pro/Entreprise, FAQ
- Animations on-scroll
- Responsive design
- Formulaire de demande Entreprise intégré

### 3. **Composants**
```
components/EnterpriseRequestForm.tsx
```
- Formulaire complet de demande de devis Entreprise
- Validation côté client
- Feedback visuel après soumission

### 4. **API Routes**

**Subscriptions:**
```
app/api/subscriptions/check/route.ts         → Vérifier l'abonnement actif
app/api/subscriptions/start-trial/route.ts   → Démarrer essai Pro (14 jours)
app/api/subscriptions/request-enterprise/route.ts → Demande de devis Entreprise
```

**Emails transactionnels:**
```
app/api/emails/trial-started/route.ts              → Confirmation démarrage essai
app/api/emails/pro-activated/route.ts              → Confirmation abonnement Pro
app/api/emails/trial-reminder/route.ts             → Rappel fin d'essai
app/api/emails/enterprise-request/route.ts         → Accusé réception demande Entreprise
app/api/emails/admin-enterprise-notification/route.ts → Notification admin
```

### 5. **Middleware**
```
middleware-subscription.ts (NOUVEAU MIDDLEWARE)
```
- Vérifie l'abonnement actif pour accès aux pages Pro
- Redirige vers /pricing si pas d'abonnement
- Injecte headers `x-user-plan`, `x-user-is-pro`, `x-user-is-enterprise`

---

## 🔧 Configuration requise

### Variables d'environnement (Vercel)

```env
# Supabase (existantes)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# JWT Auth (existante)
JWT_SECRET=xxx

# Email admin (nouvelle)
ADMIN_EMAIL=admin@powalyze.com

# OpenAI (existante)
OPENAI_API_KEY=sk-xxx

# Vercel (auto)
NEXT_PUBLIC_VERCEL_URL=auto
```

### Stripe (optionnel, pour v2)
```env
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
```

---

## 🗄️ Déploiement Base de données

### Sur Supabase Production :

```bash
# 1. Se connecter à Supabase
# 2. SQL Editor → New Query
# 3. Coller le contenu de database/subscriptions-schema.sql
# 4. Run
```

**⚠️ Important :** Le schema est idempotent (peut être exécuté plusieurs fois sans danger).

---

## 🚢 Déploiement Vercel

### Option 1 : Déploiement séparé (RECOMMANDÉ pour validation)

```bash
# Créer un nouveau projet Vercel (pré-prod)
npx vercel --project-name powalyze-preprod --yes

# Déployer en production sur ce projet
npx vercel --prod --yes
```

URL obtenue : `https://powalyze-preprod.vercel.app`

### Option 2 : Branch preview (alternative)

```bash
# Créer une branche
git checkout -b feature/pricing-pro-enterprise

# Commit & push
git add .
git commit -m "feat: nouvelle page tarifs Pro/Entreprise avec système d'abonnements"
git push origin feature/pricing-pro-enterprise

# Vercel créera automatiquement un preview deployment
```

URL obtenue : `https://powalyze-v2-git-feature-pricing-xxx.vercel.app`

---

## 🧪 Tests à effectuer

### 1. **Page /pricing**
- [ ] Affichage correct sur desktop et mobile
- [ ] Toggle mensuel/annuel fonctionne
- [ ] Boutons "Démarrer avec Pro" → `/signup?plan=pro`
- [ ] Boutons "Demander un devis" → scroll vers formulaire
- [ ] FAQ accordéons fonctionnent

### 2. **Formulaire Entreprise**
- [ ] Validation des champs obligatoires
- [ ] Soumission réussie
- [ ] Message de confirmation s'affiche
- [ ] Email de confirmation envoyé (vérifier logs)

### 3. **API Subscriptions**
```bash
# Test start-trial (requiert auth token)
curl -X POST https://votre-url.vercel.app/api/subscriptions/start-trial \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Test check subscription
curl -X GET https://votre-url.vercel.app/api/subscriptions/check \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test enterprise request (public)
curl -X POST https://votre-url.vercel.app/api/subscriptions/request-enterprise \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "Test User",
    "company": "Test Corp",
    "message": "Interested in enterprise plan"
  }'
```

### 4. **Middleware Protection**
- [ ] Utilisateur non-Pro accédant à `/cockpit/projets` → redirigé vers `/pricing`
- [ ] Utilisateur Pro → accès direct
- [ ] Utilisateur avec trial actif → accès direct
- [ ] Utilisateur avec trial expiré → redirigé vers `/pricing`

### 5. **Email Templates**
Vérifier les logs serveur pour :
- [ ] Email démarrage essai
- [ ] Email activation Pro
- [ ] Email rappel fin d'essai
- [ ] Email accusé réception Entreprise
- [ ] Email notification admin

---

## 🔄 Logique d'accès

```
┌─────────────────────────────────────────────────────────┐
│                    Utilisateur                          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ├─ Non connecté
                   │  └─> /pricing (public)
                   │  └─> /signup → Créer compte
                   │
                   ├─ Connecté SANS abonnement
                   │  └─> /cockpit → Cockpit vide avec CTA upgrade
                   │  └─> /cockpit/projets → Redirect /pricing
                   │  └─> /pricing → Accès (choisir plan)
                   │
                   ├─ Connecté avec TRIAL actif (14j)
                   │  └─> /cockpit → Accès complet
                   │  └─> /cockpit/projets → Accès complet
                   │  └─> Email rappel J-3
                   │
                   ├─ Connecté avec TRIAL expiré
                   │  └─> /cockpit/projets → Redirect /pricing
                   │  └─> Message "Essai terminé, passez en Pro"
                   │
                   ├─ Abonné PRO (actif)
                   │  └─> /cockpit → Redirect /cockpit/projets
                   │  └─> /cockpit/projets → Accès complet
                   │  └─> Tous modules Pro disponibles
                   │
                   └─ Client ENTREPRISE (actif)
                      └─> /cockpit → Redirect /cockpit/projets
                      └─> Tous modules Pro + Entreprise
                      └─> Badge "Entreprise" dans UI
```

---

## 📊 Structure des plans

### Pro (29€/mois ou 24€/mois annuel)
```json
{
  "plan": "pro",
  "features": [
    "projects_unlimited",
    "risks_management",
    "decisions_tracking",
    "ai_narratives",
    "reports_auto",
    "exports_pdf",
    "multi_language",
    "support_standard"
  ],
  "trial_days": 14,
  "users_limit": 10
}
```

### Entreprise (sur devis)
```json
{
  "plan": "enterprise",
  "features": [
    "all_pro_features",
    "connectors_advanced",
    "governance_multi_team",
    "roles_advanced",
    "support_priority",
    "onboarding_custom",
    "deployment_dedicated"
  ],
  "users_limit": null,
  "is_enterprise": true
}
```

---

## 🔐 Sécurité

- **RLS actif** sur toutes les tables subscriptions
- **Validation JWT** sur toutes les API routes
- **CORS** configuré pour API
- **Rate limiting** à ajouter (recommandé pour production)

---

## 📈 Prochaines étapes

### Phase 1 (Validation - CURRENT)
- [x] Page /pricing créée
- [x] API subscriptions créées
- [x] Middleware protection créé
- [x] Email templates créés
- [ ] **Déploiement Vercel pré-prod**
- [ ] **Tests utilisateur**
- [ ] **Validation client**

### Phase 2 (Production)
- [ ] Intégration Stripe pour paiements
- [ ] Webhooks Stripe pour auto-activation
- [ ] Service d'emailing (SendGrid/Resend/Postmark)
- [ ] Dashboard admin pour gérer subscriptions
- [ ] Analytics (Mixpanel/Amplitude)

### Phase 3 (Optimisation)
- [ ] Tests A/B sur page tarifs
- [ ] Onboarding personnalisé par plan
- [ ] Chatbot pour demandes Entreprise
- [ ] Self-service upgrade Pro → Entreprise

---

## 🆘 Support

### Problèmes courants

**1. "Missing authorization header"**
- Vérifier que le token JWT est bien envoyé via header `Authorization: Bearer TOKEN`

**2. "Database error lors du check subscription"**
- Vérifier que le schema `subscriptions-schema.sql` est bien appliqué
- Vérifier les variables d'env Supabase

**3. "Email not sent"**
- Emails sont loggés en console pour l'instant (pas de service d'envoi réel)
- Intégrer SendGrid/Resend pour envoi réel

**4. "Redirect loop /pricing → /cockpit"**
- Vérifier la logique middleware
- Vérifier que l'utilisateur a bien un subscription actif dans la DB

---

## 📞 Contact

**Questions / Validation :**
- Fabrice (Product Owner)
- Email: [votre email]

**Déploiement Vercel :**
- URL pré-prod: **À FOURNIR APRÈS DÉPLOIEMENT**
- URL production actuelle: https://www.powalyze.com (NE PAS TOUCHER)

---

## ✅ Checklist validation finale

Avant merge vers `main` et déploiement sur powalyze.com :

- [ ] Page /pricing testée sur mobile + desktop
- [ ] Formulaire Entreprise fonctionne
- [ ] API subscriptions testées
- [ ] Middleware protection testée
- [ ] Email templates validés
- [ ] Schema Supabase appliqué
- [ ] Variables d'env configurées
- [ ] Tests utilisateurs réalisés
- [ ] Validation Product Owner
- [ ] Documentation à jour

**Date validation :** _____________  
**Validé par :** _____________

---

## 📝 Notes de déploiement

```bash
# Pour déployer sur pré-prod Vercel
cd powalyze
npx vercel --project-name powalyze-preprod --prod --yes

# Récupérer l'URL
# → https://powalyze-preprod.vercel.app

# Tester en priorité :
# 1. /pricing
# 2. /api/subscriptions/request-enterprise
# 3. Middleware sur /cockpit avec utilisateur sans abonnement
```

**🎯 Objectif : Validation complète avant merge vers production**
