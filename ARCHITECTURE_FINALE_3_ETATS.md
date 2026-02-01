# ARCHITECTURE 3 ÉTATS - DEMO / PRO (FINALE)

**Date :** 1er février 2026  
**Version :** 2.0 Finale  

## 🎯 Vision Stratégique

**2 expériences distinctes et claires :**

1. **Demo publique** : Vitrine accessible SANS compte
2. **Cockpit Pro** : Plateforme vide pour les utilisateurs payants

---

## 📐 Les 3 États Utilisateur

### ÉTAT 0 : Non Connecté
- **Accès** : Vitrine + `/demo` (page publique)
- **Objectif** : Découvrir le produit
- **CTA** : "Créer mon compte gratuit" → `/signup`

### ÉTAT 1 : Connecté Sans Pro (`pro_active = false`)
- **Accès** : 
  - `/cockpit` (page vide avec CTA vers tarifs)
  - `/cockpit/tarifs` (page interne de pricing)
- **Bloqué** : Toutes pages Pro (`/cockpit/projets`, `/cockpit/risques`, etc.)
- **Objectif** : Conversion vers abonnement Pro
- **CTA** : "Découvrir les offres" → `/cockpit/tarifs`

### ÉTAT 2 : Connecté Avec Pro (`pro_active = true`)
- **Accès** : Toutes pages cockpit
  - `/cockpit/projets` (vide au départ)
  - `/cockpit/risques`
  - `/cockpit/decisions`
  - `/cockpit/rapports`
- **Bloqué** : `/cockpit/tarifs` (redirigé vers `/cockpit/projets`)
- **Objectif** : Utilisation complète de la plateforme

---

## 🗺️ Routing Détaillé

### Routes Publiques (État 0)
```
/                    → Page d'accueil
/demo                → Demo publique (données fictives, sans compte)
/signup              → Inscription
/login               → Connexion
/services            → Services
/contact             → Contact
```

### Routes Connectées Non-Pro (État 1)
```
/cockpit             → Page vide avec CTA "Activer Pro"
/cockpit/tarifs      → Comparaison Demo vs Pro (49€/mois)
/cockpit/projets     → BLOQUÉ → Redirect /cockpit
/cockpit/risques     → BLOQUÉ → Redirect /cockpit
/cockpit/decisions   → BLOQUÉ → Redirect /cockpit
```

### Routes Pro Actif (État 2)
```
/cockpit             → Redirect /cockpit/projets
/cockpit/projets     → Bibliothèque projets (vide au départ)
/cockpit/risques     → Gestion risques
/cockpit/decisions   → Gestion décisions
/cockpit/rapports    → Rapports IA
/cockpit/tarifs      → BLOQUÉ → Redirect /cockpit/projets
```

### Routes Admin (État 2 + role='admin')
```
/cockpit/admin       → Panel admin (gestion utilisateurs)
```

---

## 💾 Base de Données

### Table `users`
```sql
id            UUID PRIMARY KEY
email         VARCHAR UNIQUE NOT NULL
tenant_id     UUID REFERENCES organizations(id)
role          VARCHAR(20) DEFAULT 'client' CHECK (role IN ('admin', 'client', 'demo'))
pro_active    BOOLEAN DEFAULT FALSE  ← NOUVEAU CHAMP
created_at    TIMESTAMP
```

### Table `organizations`
```sql
id            UUID PRIMARY KEY DEFAULT uuid_generate_v4()
name          VARCHAR NOT NULL
created_at    TIMESTAMP DEFAULT NOW()
```

### Table `projects`
```sql
id                UUID PRIMARY KEY
organization_id   UUID REFERENCES organizations(id)
user_id           UUID REFERENCES users(id)
name              VARCHAR NOT NULL
description       TEXT
status            VARCHAR
health            VARCHAR  (rag_status: GREEN/YELLOW/RED)
progress          INTEGER
owner             VARCHAR
deadline          DATE
starred           BOOLEAN DEFAULT FALSE
created_at        TIMESTAMP
```

---

## 🔐 Middleware Logic

```typescript
// État 0 : Non connecté → Vitrine + Demo publique
if (!session && !isPublicPath) {
  redirect('/signup');
}

// État 1 vs État 2 : Vérifier pro_active
if (session) {
  const { pro_active } = await getUserData();
  
  if (path === '/cockpit') {
    if (pro_active) redirect('/cockpit/projets');
    // Sinon, affiche page vide avec CTA tarifs
  }
  
  if (path === '/cockpit/tarifs' && pro_active) {
    redirect('/cockpit/projets'); // Pro n'a pas besoin de voir tarifs
  }
  
  if (isProPage && !pro_active) {
    redirect('/cockpit'); // Non-Pro bloqué des pages Pro
  }
  
  if (path === '/cockpit/demo') {
    redirect('/demo'); // Toujours rediriger vers demo publique
  }
}
```

---

## 📄 Pages Clés

### `/demo` (Demo Publique)
**Fichier :** `app/demo/page.tsx`  
**Description :** Page standalone (pas de CockpitShell)  
**Contenu :**
- Header avec logo + CTA "Connexion" + "Essayer gratuitement"
- Hero section "Cockpit Exécutif en action"
- KPI Cards : 3 projets, 2 risques, 8 décisions, 45% progression
- Section Projets : 3 projets demo avec progress bars
- Section Risques : 2 risques demo
- CTA Final : "Créer mon compte maintenant" → `/signup`
- Footer minimaliste

**Données :** Hardcodées, lecture seule, sans authentification

### `/cockpit` (État 1)
**Fichier :** `app/cockpit/page.tsx`  
**Description :** Page vide pour utilisateurs connectés sans Pro  
**Contenu :**
- Icon Sparkles (gradient amber)
- Titre "Bienvenue sur Powalyze"
- Message : "Pour créer vos premiers projets..."
- Features : Projets illimités • Risques & Décisions • Rapports IA
- CTA : "Découvrir les offres" → `/cockpit/tarifs`
- Footer note : "Essayez la démo publique" → `/demo`

### `/cockpit/tarifs` (État 1)
**Fichier :** `app/cockpit/tarifs/page.tsx`  
**Description :** Page interne de pricing (visible seulement si `pro_active=false`)  
**Contenu :**
- Header : "Choisissez votre formule"
- 2 cartes côte-à-côte : Demo vs Pro
- **Demo** : Gratuit, 3 projets fictifs, lecture seule
- **Pro** : 49€/mois, données réelles, projets illimités, rapports IA
- Badge "Recommandé" sur carte Pro
- 3 sections features : Vos données réelles, Rapports avancés, Collaboration
- CTA : "Activer Pro maintenant" (gradient amber)

### `/cockpit/projets` (État 2)
**Fichier :** `app/cockpit/projets/page.tsx`  
**Description :** Bibliothèque projets premium (vide au départ)  
**Contenu :**
- Header : "Projets" + "Créer un projet" (CTA)
- Search bar + Filters (Statut, Priorité) + Sort
- Table premium : Projet | Statut | Risque | Avancement | Responsable | Actions
- Side panel détails projet (click sur row)
- Modal création projet enhanced
- Empty state : "Créez votre premier projet"

**Server Actions :** `app/cockpit/projets/actions.ts`
- `getProjects()` : Récupère projets via Supabase (service role)
- `createProject()` : Crée projet avec organization_id
- `deleteProject()` : Supprime projet
- `toggleStarProject()` : Toggle favoris

---

## 🚀 Déploiement

### 1. Exécuter Migration SQL
```sql
-- Dans Supabase SQL Editor (https://pqsgdwfsdnmozzoynefw.supabase.co)
-- Copier contenu de database/fix-database-simple.sql

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns 
                 WHERE table_name = 'users' AND column_name = 'pro_active')
  THEN
    ALTER TABLE users ADD COLUMN pro_active BOOLEAN DEFAULT FALSE;
  END IF;
END $$;
```

### 2. Tester les 3 États

**État 0 - Non connecté :**
```
1. Visiter https://www.powalyze.com/demo
2. Vérifier données demo visibles
3. Cliquer "Créer mon compte" → redirect /signup
```

**État 1 - Connecté sans Pro :**
```
1. Login avec user où pro_active=false
2. Accéder /cockpit → voir page vide avec CTA tarifs
3. Accéder /cockpit/tarifs → voir comparaison Demo/Pro
4. Essayer /cockpit/projets → redirect /cockpit (bloqué)
```

**État 2 - Connecté avec Pro :**
```
1. Activer Pro: UPDATE users SET pro_active=true WHERE email='test@example.com'
2. Login → /cockpit redirect vers /cockpit/projets
3. Créer premier projet (liste vide au départ)
4. Essayer /cockpit/tarifs → redirect /cockpit/projets (bloqué)
```

### 3. Activer Pro (Admin)
```sql
-- Manuellement dans Supabase SQL Editor
UPDATE users 
SET pro_active = true 
WHERE email = 'user@example.com';
```

**OU**

Stripe webhook (futur) :
```typescript
// app/api/webhooks/stripe/route.ts
if (event.type === 'checkout.session.completed') {
  await supabase
    .from('users')
    .update({ pro_active: true })
    .eq('email', email);
}
```

---

## 📊 Métriques Clés

### KPIs à Suivre
1. **Taux de conversion Demo → Signup**
   - Objectif : >15%
   - Mesure : Google Analytics `/demo` → `/signup`

2. **Taux de conversion État 1 → Pro**
   - Objectif : >10%
   - Mesure : `/cockpit/tarifs` views → pro_active=true

3. **Activation utilisateurs Pro**
   - Objectif : >80% créent au moins 1 projet dans les 7 jours
   - Mesure : COUNT(projects) WHERE created_at < NOW() - INTERVAL '7 days'

4. **Rétention Pro 30 jours**
   - Objectif : >70%
   - Mesure : Utilisateurs pro_active=true après 30 jours

---

## 🔧 Maintenance

### Ajouter une Page Pro
```typescript
// 1. Créer app/cockpit/nouvelle-page/page.tsx
// 2. Ajouter route dans middleware.ts :
const proPages = [
  '/cockpit/projets', 
  '/cockpit/risques', 
  '/cockpit/decisions', 
  '/cockpit/rapports',
  '/cockpit/nouvelle-page'  // ← AJOUTER ICI
];
```

### Changer le Prix Pro
```typescript
// app/cockpit/tarifs/page.tsx (ligne ~50)
<div className="text-5xl font-bold text-white mb-2">
  49€  // ← MODIFIER ICI
  <span className="text-2xl text-slate-400">/mois</span>
</div>
```

### Modifier Features Pro
```typescript
// app/cockpit/tarifs/page.tsx (ligne ~80)
const proFeatures = [
  'Projets illimités',           // ← MODIFIER
  'Données réelles privées',     // ← MODIFIER
  'Rapports AI avancés',         // ← MODIFIER
  'Collaboration équipe',        // ← MODIFIER
  'Support prioritaire 24/7'     // ← MODIFIER
];
```

---

## ✅ Checklist Post-Déploiement

### Phase 1 : Base de Données (5 min)
- [ ] Exécuter SQL migration (pro_active column)
- [ ] Vérifier users table a les colonnes : id, email, tenant_id, role, pro_active
- [ ] Vérifier organizations table existe avec id, name
- [ ] Créer organisation par défaut si manquante

### Phase 2 : Tests Manuels (15 min)
- [ ] État 0 : Visiter /demo sans login → voir demo publique
- [ ] État 0 : Essayer /cockpit sans login → redirect /signup
- [ ] État 1 : Login sans Pro → /cockpit affiche page vide
- [ ] État 1 : Accéder /cockpit/tarifs → voir pricing page
- [ ] État 1 : Essayer /cockpit/projets → redirect /cockpit (bloqué)
- [ ] État 2 : Activer Pro → /cockpit redirect /cockpit/projets
- [ ] État 2 : Créer un projet → voir dans liste
- [ ] État 2 : Essayer /cockpit/tarifs → redirect /cockpit/projets (bloqué)

### Phase 3 : Monitoring (48h)
- [ ] Google Analytics : Vérifier events /demo
- [ ] Supabase Logs : Pas d'erreurs 500
- [ ] Vercel Analytics : Latence <200ms
- [ ] Feedback utilisateurs : Collecter retours

---

## 📞 Support & Debugging

### Erreur "Organisation non trouvée"
```sql
-- Vérifier organisation existe
SELECT * FROM organizations LIMIT 1;

-- Créer organisation par défaut
INSERT INTO organizations (id, name)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'Organisation par défaut')
ON CONFLICT (id) DO NOTHING;
```

### Utilisateur bloqué en État 1
```sql
-- Vérifier pro_active status
SELECT email, pro_active FROM users WHERE email = 'user@example.com';

-- Activer Pro manuellement
UPDATE users SET pro_active = true WHERE email = 'user@example.com';
```

### Middleware redirect loop
```typescript
// Vérifier config matcher dans middleware.ts
export const config = {
  matcher: [
    "/cockpit/:path*",  // ← Doit inclure toutes routes cockpit
    "/demo",            // ← Demo publique
    // ...
  ]
};
```

---

## 🎨 Design Tokens

### Couleurs
```css
/* Demo publique */
--demo-primary: #F59E0B (amber-500)
--demo-border: rgba(245, 158, 11, 0.3)
--demo-bg: rgba(245, 158, 11, 0.1)

/* État 1 (CTA Pro) */
--cta-gradient: linear-gradient(to right, #F59E0B, #D97706)
--cta-shadow: rgba(245, 158, 11, 0.3)

/* État 2 (Pro features) */
--pro-success: #10B981 (emerald-500)
--pro-warning: #F59E0B (amber-500)
--pro-danger: #EF4444 (red-500)
```

### Typography
```css
/* Headings */
--h1: 3rem (48px) - Bold - White
--h2: 2rem (32px) - Bold - White
--h3: 1.5rem (24px) - Semibold - White

/* Body */
--body: 1rem (16px) - Regular - Slate-300
--body-secondary: 0.875rem (14px) - Regular - Slate-400
--caption: 0.75rem (12px) - Medium - Slate-500
```

---

## 🔗 Liens Utiles

- **Production :** https://www.powalyze.com
- **Supabase :** https://pqsgdwfsdnmozzoynefw.supabase.co
- **Vercel :** https://vercel.com/powalyzes-projects/powalyze-v2
- **Repo GitHub :** (à configurer)
- **Stripe Dashboard :** (à configurer)

---

**Dernière mise à jour :** 1er février 2026, 23h45  
**Auteur :** Équipe Powalyze  
**Version :** 2.0 Finale
