# Restructuration SaaS Powalyze - Documentation

## Vue d'ensemble

Restructuration complète de Powalyze en architecture SaaS Next.js 14 avec App Router, séparation claire entre mode Demo et mode Pro, et onboarding automatique.

## Architecture

### Structure des routes

```
app/
├── (public)/                 # Routes publiques (vitrine)
│   ├── layout.tsx
│   └── page.tsx             # Page d'accueil avec Hero, Features, etc.
│
├── (app)/                    # Routes applicatives
│   ├── layout.tsx
│   ├── pro/                 # Cockpit Pro (auth requise)
│   │   └── page.tsx
│   └── demo/                # Cockpit Demo (sans auth)
│       └── page.tsx
│
├── login/                   # Page de connexion (existante)
│   └── page.tsx
│
└── api/
    └── onboarding/          # Onboarding automatique
        └── route.ts
```

### Composants créés

#### Cockpit (components/cockpit/)
- **CockpitView.tsx** : Composant principal (dual-mode)
- **CockpitHeader.tsx** : Header avec logo, organisation, badge mode
- **CockpitKpis.tsx** : Cartes de statistiques (critiques, warnings, OK, total)
- **CockpitTable.tsx** : Tableau filtrable des items (risques, décisions, KPIs)

#### Marketing (components/marketing/)
- **Hero.tsx** : Section héro avec CTAs Demo/Pro
- **Features.tsx** : Grid de 6 fonctionnalités clés
- **HowItWorks.tsx** : 3 étapes pour démarrer
- **Footer.tsx** : Footer complet avec liens

#### Auth (components/auth/)
- **LoginForm.tsx** : Formulaire de connexion avec onboarding auto

### Bibliothèques (lib/)
- **types-saas.ts** : Types TypeScript (Organisation, Domain, Cockpit, Item, etc.)
- **demoData.ts** : Données mockées pour le mode Demo
- **cockpit.ts** : Fonctions CRUD (getProCockpitData, getDemoCockpitData, createItem, etc.)

## Schéma de base de données

### Tables créées (database/schema-saas.sql)

1. **organisations** : Entités client
2. **domains** : Domaines stratégiques (Gouvernance, Risques, etc.)
3. **cockpits** : Tableaux de bord par domaine
4. **items** : Éléments suivis (risk, decision, kpi)
5. **user_profiles** : Lien auth.users → organisations

### Row Level Security (RLS)

- Politique de sécurité par organisation
- Isolation des données entre tenants
- Accès basé sur le user_profile.organisation_id

## Fonctionnalités

### Mode Demo
- Accès sans authentification : `/demo`
- Données mockées (lib/demoData.ts)
- Badge bleu "Mode Démo"
- Lecture seule (ou actions limitées)
- CTA vers mode Pro

### Mode Pro
- Authentification requise : `/pro`
- Données réelles depuis Supabase
- Onboarding automatique à la première connexion
- CRUD complet sur les items
- Multi-utilisateurs avec RLS

### Onboarding automatique

Lors de la première connexion, le système crée automatiquement :
1. Une organisation (nom basé sur l'email)
2. Un domaine "Gouvernance & Risques"
3. Un cockpit "Cockpit Exécutif"
4. 3 items de démonstration (1 risque, 1 décision, 1 KPI)
5. Un user_profile avec role='owner'

## Installation

### 1. Appliquer le schéma Supabase

```bash
# Dans Supabase SQL Editor ou psql
psql $DATABASE_URL -f database/schema-saas.sql
```

### 2. Installer les dépendances manquantes

```bash
npm install @supabase/auth-helpers-nextjs
```

### 3. Variables d'environnement

Vérifier `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### 4. Créer un utilisateur test

Dans Supabase Dashboard > Authentication > Users :
- Email : `demo@powalyze.com`
- Mot de passe : `Demo2026!`
- Confirm email automatically : ✓

## URLs

- **Vitrine** : `/` (nouvelle page d'accueil)
- **Mode Demo** : `/demo` (sans auth)
- **Mode Pro** : `/pro` (avec auth)
- **Login** : `/login` (avec onboarding auto)

## Flux utilisateur

### Nouvel utilisateur
1. Visite `/` → découvre Powalyze
2. Clique "Explorer le mode Demo" → `/demo`
3. Clique "Passer au mode Pro" → `/login`
4. Se connecte → onboarding automatique
5. Redirigé vers `/pro` avec son organisation

### Utilisateur existant
1. Visite `/login`
2. Se connecte
3. Onboarding détecte qu'il est déjà onboardé
4. Redirigé vers `/pro` avec ses données

## Prochaines étapes

- [ ] Installer `@supabase/auth-helpers-nextjs`
- [ ] Appliquer le schéma SQL à Supabase
- [ ] Tester le flux complet Demo → Pro
- [ ] Ajouter d'autres pages (/pricing, /contact, etc.)
- [ ] Implémenter l'édition d'items en mode Pro
- [ ] Ajouter la gestion d'équipe (invitations)
- [ ] Créer des dashboards par rôle

## Différences avec l'ancienne structure

| Avant | Après |
|-------|-------|
| `/cockpit-demo` | `/demo` |
| `/cockpit-real` | `/pro` |
| Multiple pages cockpit | Un seul `CockpitView` dual-mode |
| Pas d'onboarding | Onboarding automatique |
| Pas de vitrine claire | Page d'accueil marketing |
| Organisation confuse | Structure claire (public)/(app) |

## Notes techniques

- **Next.js 14 App Router** : Server Components par défaut
- **Supabase Auth** : via `@supabase/auth-helpers-nextjs`
- **TypeScript strict** : Types complets dans `types-saas.ts`
- **Tailwind CSS** : Design system cohérent
- **Lucide React** : Icônes modernes
- **RLS Supabase** : Sécurité multi-tenant native

## Support

En cas de problème :
1. Vérifier les logs console (côté client et serveur)
2. Vérifier les variables d'environnement
3. Vérifier que le schéma SQL est appliqué
4. Vérifier l'authentification Supabase
5. Consulter `GUIDE_RAPIDE_LOGIN_FIX.md` pour les erreurs d'auth
