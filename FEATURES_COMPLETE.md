# 🚀 Powalyze - Enterprise PMO Platform

## Vue d'ensemble

**Powalyze** est une plateforme complète de gouvernance de portfolio de projets avec intelligence artificielle intégrée. Conçue pour surpasser Monday.com, Jira et autres outils PMO, Powalyze offre une expérience premium avec des fonctionnalités avancées pour les équipes enterprise.

## ⚡ Fonctionnalités principales

### 📊 Gestion de portfolio
- **Dashboard exécutif** : Vue 360° de la santé du portfolio en temps réel
- **Projets multi-vues** : Kanban, Gantt, Liste, Timeline
- **KPI stratégiques** : 8 métriques clés avec tendances et alertes
- **Power BI intégré** : Analytics avancés et rapports personnalisés

### 🎯 Gestion de projets
- **Kanban board** : 6 colonnes personnalisables avec drag & drop
- **Gantt interactif** : Visualisation timeline avec dépendances
- **Gestion des risques** : Matrice probabilité/impact, escalade automatique
- **Décisions trackées** : Historique complet avec accountability

### 📄 Collaboration
- **Système de commentaires** : Mentions @user, threading, emojis
- **Notifications temps réel** : Centre de notifications avec 5 types d'alertes
- **Gestion documentaire** : Upload drag & drop, versioning, prévisualisation
- **Activity log** : Audit trail complet de toutes les actions

### 🤖 Intelligence Artificielle
- **Chief of Staff virtuel** : Génère 6 actions stratégiques basées sur l'analyse portfolio
- **Project Predictor** : Prédit probabilité de succès, risques budgétaires, vélocité
- **Committee Prep** : Génère automatiquement briefs exécutifs et documents COMEX
- **Auto-insights** : Détection automatique d'anomalies et recommandations

### ⚙️ Automatisations
- **Workflow builder** : Interface visuelle pour créer des automatisations
- **Templates prédéfinis** : Alertes budget, escalade risques, rapports auto
- **Triggers personnalisés** : Basés sur événements, temps, conditions métier
- **Actions multiples** : Notifications, création entités, webhooks, exports

### 🔌 Intégrations
- **Jira** : Sync bidirectionnelle issues et projets
- **Slack** : Notifications instantanées, commandes slash
- **GitHub** : Suivi commits, PRs, releases
- **Azure DevOps** : Pipelines, Work Items, test results
- **Microsoft Teams** : Bot intégré, Adaptive Cards
- **Power BI** : Dashboards live, exports automatiques
- **API REST complète** : Webhooks, SSE, GraphQL

### 🎨 Expérience utilisateur
- **Command Palette (Ctrl+K)** : Accès rapide à toutes les fonctionnalités
- **Mode sombre** : Design premium slate-950 avec accents amber
- **Responsive mobile** : PWA-ready avec offline support
- **Multilangue** : FR/EN avec i18n système complet
- **Accessibilité** : WCAG 2.1 AA compliant

## 🏗️ Architecture

### Stack technique
```
Frontend:  Next.js 14 (App Router), React 18, TypeScript
Styling:   Tailwind CSS 3, Lucide Icons
Backend:   Supabase (PostgreSQL + Auth + Storage)
AI:        OpenAI GPT-4 / Azure OpenAI
Deploy:    Vercel Edge Network
```

### Mode dual (DEMO/PROD)
Powalyze fonctionne en 2 modes distincts :

**DEMO Mode** (par défaut) :
- Données fixes depuis `lib/cockpitData.ts`
- Aucune configuration requise
- Badge bleu "Mode Démo" dans l'UI
- Parfait pour démos et tests

**PROD Mode** :
- Connexion Supabase pour données réelles
- OpenAI/Azure OpenAI pour IA
- Badge gris "Mode Production"
- Variables `.env.local` requises

### Base de données
Schema complet dans `database/schema-complete-pro.sql` :
- **Projects** : Gestion projets avec RAG status
- **Risks** : Matrice probabilité/impact
- **Decisions** : Tracking décisions avec impact
- **Comments** : Système mentions avec threading
- **Notifications** : 5 types (mention, status, deadline, comment, risk)
- **Documents** : Versioning, metadata, preview
- **Tasks** : Subtasks, dépendances, time tracking
- **Automations** : Triggers, conditions, actions
- **Integrations** : Webhooks, auth tokens, sync logs

## 🚀 Démarrage rapide

### Installation
```bash
git clone https://github.com/votre-org/powalyze.git
cd powalyze
npm install
```

### Configuration (optionnel pour DEMO)
Créer `.env.local` :
```env
# Supabase (PROD mode)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# OpenAI (IA features)
OPENAI_API_KEY=sk-xxx
# OU Azure OpenAI
AZURE_OPENAI_API_KEY=xxx
AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Auth
JWT_SECRET=change-in-production

# Power BI (optionnel)
POWERBI_CLIENT_ID=xxx
POWERBI_CLIENT_SECRET=xxx
```

### Lancement
```bash
npm run dev     # Dev server sur localhost:3000
npm run build   # Build production
npm run lint    # ESLint check
```

### URLs par défaut
- Dashboard : `http://localhost:3000/cockpit`
- Kanban : `http://localhost:3000/cockpit/kanban`
- Gantt : `http://localhost:3000/cockpit/gantt`
- KPI : `http://localhost:3000/cockpit/kpi`
- Documents : `http://localhost:3000/cockpit/documents`
- Automatisations : `http://localhost:3000/cockpit/automations`

## 📚 Documentation

### Guides complets
- **Setup** : `README.md`
- **Migration DEMO→PROD** : `MIGRATION_GUIDE.md`
- **Nouveau client** : `GUIDE-NOUVEAU-CLIENT.md`
- **Performance** : `PERFORMANCE_OPTIMIZATIONS.md`
- **Architecture** : `ARCHITECTURE_OFFICIELLE_2026.md`

### Composants clés
- `components/cockpit/Comments.tsx` : Système commentaires avec mentions
- `components/cockpit/NotificationCenter.tsx` : Centre notifications
- `components/cockpit/GanttChart.tsx` : Diagramme Gantt interactif
- `components/cockpit/DocumentManager.tsx` : Gestion documents
- `components/cockpit/AutomationBuilder.tsx` : Créateur automatisations
- `components/cockpit/CommandPalette.tsx` : Palette commandes (Ctrl+K)

### API Routes
- `/api/auth/*` : Authentification JWT
- `/api/projects/*` : CRUD projets
- `/api/risks/*` : Gestion risques
- `/api/decisions/*` : Tracking décisions
- `/api/ai/*` : Endpoints IA (Chief, Predictor, Committee)
- `/api/webhooks/*` : Intégrations externes

## 🎯 Roadmap

### Phase 1 : Foundation ✅
- [x] Dashboard exécutif
- [x] Gestion projets/risques/décisions
- [x] Kanban board
- [x] KPI dashboard
- [x] Power BI integration

### Phase 2 : Collaboration ✅
- [x] Système commentaires + mentions
- [x] Notifications temps réel
- [x] Gestion documentaire
- [x] Activity timeline

### Phase 3 : Automation ✅
- [x] Workflow builder
- [x] Templates automatisations
- [x] Intégrations (Jira, Slack, GitHub, Azure DevOps)
- [x] API REST + Webhooks

### Phase 4 : Advanced (En cours)
- [ ] Gantt drag & drop complet
- [ ] Resource capacity planning
- [ ] Time tracking avancé
- [ ] Custom dashboards builder
- [ ] Mobile PWA native
- [ ] Mode offline

### Phase 5 : Enterprise
- [ ] SSO/SAML
- [ ] Advanced RLS (Row Level Security)
- [ ] Audit logs complets
- [ ] White labeling
- [ ] Multi-tenant SaaS
- [ ] High availability

## 🔧 Développement

### Structure du projet
```
powalyze/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── cockpit/           # Dashboard pages
│   │   ├── kanban/
│   │   ├── gantt/
│   │   ├── kpi/
│   │   ├── documents/
│   │   └── automations/
│   └── committee-prep/    # IA document generation
├── components/
│   ├── cockpit/           # Dashboard components
│   ├── vitrine/           # Marketing pages
│   └── ui/                # Reusable primitives
├── lib/
│   ├── ai*.ts             # IA prompt engineering
│   ├── supabase*.ts       # Supabase clients
│   ├── auth.ts            # JWT authentication
│   └── cockpitData.ts     # DEMO data
├── database/
│   ├── schema.sql         # Base schema
│   └── schema-complete-pro.sql  # Extended schema
└── locales/               # i18n translations
```

### Patterns de développement

**Ajout d'un endpoint API** :
1. Créer `app/api/<endpoint>/route.ts`
2. Vérifier si route publique → Ajouter à `middleware.ts`
3. Extraire tenant context :
```typescript
const tenantId = request.headers.get('x-tenant-id');
const userId = request.headers.get('x-user-id');
```

**Nouveau composant dashboard** :
1. Créer `components/cockpit/<Component>.tsx`
2. Utiliser Tailwind avec thème dark (slate-950)
3. Importer dans page correspondante

**Modification prompts IA** :
- Chief of Staff : `lib/ai-chief-actions.ts`
- Project Predictor : `lib/ai-project-predictor.ts`
- Committee Prep : Inline dans `/committee-prep/page.tsx`

## 📊 Métriques & Performance

### Objectifs de performance
- **INP** : < 200ms (Interaction to Next Paint)
- **FCP** : < 1.8s (First Contentful Paint)
- **LCP** : < 2.5s (Largest Contentful Paint)
- **CLS** : < 0.1 (Cumulative Layout Shift)

### Optimisations appliquées
- Lazy loading des composants lourds
- Debouncing des appels IA
- Power BI iframe lazy load
- Toast max 30 concurrent
- Route-level loading states

## 🤝 Contribution

### Workflow Git
```bash
git checkout -b feature/nom-feature
# Développement...
git commit -m "feat: description"
git push origin feature/nom-feature
# Créer Pull Request
```

### Conventions
- **Commits** : Conventional Commits (feat, fix, docs, refactor)
- **Branches** : feature/, bugfix/, hotfix/
- **Code style** : ESLint + Prettier
- **Types** : TypeScript strict mode

## 📝 Licence

Propriétaire - Tous droits réservés © 2026 Powalyze

## 🙏 Remerciements

Construit avec ❤️ par l'équipe Powalyze

Technologies utilisées :
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [OpenAI](https://openai.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Vercel](https://vercel.com)

---

**Version** : 2.0.0  
**Dernière mise à jour** : Février 2026  
**Status** : 🚀 Production Ready
