# 🚀 Powalyze — Cockpit Exécutif & Gouvernance IA

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/powalyze/powalyze)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/powalyze/powalyze)
[![Demo](https://img.shields.io/badge/demo-ready-brightgreen.svg)](http://localhost:3000/cockpit-real)

**Powalyze** est un cockpit exécutif moderne pour le pilotage de portefeuille de projets, avec IA narrative intégrée.

## ✨ Fonctionnalités

- 🎯 **Mode DEMO**: Fonctionne immédiatement sans configuration (données de démonstration incluses)
- 🚀 **Mode PROD**: Connexion à Supabase pour données réelles + OpenAI pour IA narrative
- 📊 **Vue 360°**: Dashboard complet du portfolio (projets, risques, décisions, actions)
- 🤖 **IA Narrative**: Génération automatique de synthèses exécutives et briefs de comité
- 📝 **Préparation de Comité**: Génération de documents de comité prêts à l'emploi
- 🧪 **Tests IA**: Interface de test pour valider les fonctions IA

## 🎯 Démarrage Rapide (Mode DEMO)

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer en mode développement
npm run dev

# 3. Ouvrir le navigateur
# http://localhost:3000/cockpit-real  → Dashboard principal
# http://localhost:3000/committee-prep → Préparation de comité
# http://localhost:3000/ai-test → Tests IA narrative
```

**C'est tout !** Le mode DEMO fonctionne sans aucune configuration additionnelle.

Vous verrez un badge bleu "Mode Démo" en haut à droite confirmant que vous utilisez les données de démonstration.

## Stack Technique

- **Framework**: Next.js 14.2 (App Router)
- **UI**: Tailwind CSS + composants custom
- **Database**: PostgreSQL via Supabase (mode PROD)
- **IA**: OpenAI GPT-4 ou Azure OpenAI
- **TypeScript**: Strict mode, types exhaustifs
- **Déploiement**: Vercel-ready

# Configurer les variables d'environnement
cp .env.local.example .env.local
# Éditer .env.local avec vos valeurs

# Lancer en développement
npm run dev
```

## Configuration

Fichier `.env.local` requis:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/powalyze
JWT_SECRET=your-super-secret-jwt-key
POWERBI_CLIENT_ID=your-azure-app-id
POWERBI_CLIENT_SECRET=your-azure-app-secret
POWERBI_TENANT_ID=your-azure-tenant-id
POWERBI_WORKSPACE_ID=your-powerbi-workspace-id
POWERBI_REPORT_ID=your-powerbi-report-id
```

## Structure du Projet

```
powalyze/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentification
│   │   ├── cockpit/       # Dashboard 360°
│   │   ├── projects/      # Gestion projets
│   │   ├── risks/         # Gestion risques
│   │   ├── resources/     # Gestion ressources
│   │   ├── finances/      # Gestion finances
│   │   ├── ai/            # Prédictions IA
│   │   └── powerbi/       # Intégration Power BI
│   ├── layout.tsx
│   ├── page.tsx           # Cockpit 360°
│   └── globals.css
├── components/
│   ├── Cockpit/           # Composants dashboard
│   └── PowerBI/           # Composants Power BI
├── lib/
│   ├── db.ts              # Client PostgreSQL
│   ├── auth.ts            # JWT & RBAC
│   └── powerbi.ts         # Client Power BI
├── types/
│   └── index.ts           # Types TypeScript
├── middleware.ts          # Multi-tenant resolver
└── database/
    ├── schema.sql         # Schéma PostgreSQL
    └── seed.sql           # Données de démo
```

## Modules Révolutionnaires

### 1. 🚀 Cockpit 360° Ultra (`/`)
- KPIs temps réel avec refresh 30s
- Heatmap risques quantique
- Timeline prédictive avec IA
- Insights IA avancés + auto-actions

### 2. 🧬 Digital Twin - Jumeau Numérique (`/api/ai/digital-twin`)
- **Synchronisation temps réel** du projet
- Health Score, Vélocité, Burn Rate live
- **Modèle prédictif avancé**: date livraison, budget final, qualité
- Scénarios simulation What-If
- **Recommandations autonomes auto-exécutables**
- Alertes temps réel critiques

### 3. 🔮 Quantum Risk Analysis (`/api/ai/quantum-analysis`)
- **Simulation Monte Carlo** 10,000+ itérations
- Superposition d'états quantiques
- Analyse corrélations inter-projets (entanglement)
- Probabilité succès via mécanique quantique
- 5 scénarios parallèles simultanés

### 4. ⚡ Auto-Healing Autonome (`/api/ai/auto-healing`)
- **Détection automatique** des problèmes
- **Actions correctives autonomes** sans intervention humaine
- Assignment automatique des risques via AI matching
- Optimisation coûts infrastructure automatique
- Génération plans mitigation IA
- Escalations intelligentes COMEX

### 5. 🧠 NLP Sentiment Analysis (`/api/ai/nlp-sentiment`)
- **Analyse sentiment** communications équipe (Slack, Teams, Email)
- Indicateurs émotionnels: stress, motivation, satisfaction
- Détection signaux faibles de risque
- Analyse engagement stakeholders
- Recommandations actions préventives

### 6. 🎯 Portfolio Optimization AI (`/api/ai/portfolio-optimization`)
- **Optimisation automatique** du portefeuille projets
- Recommandations: CONTINUE, ACCELERATE, PAUSE, CANCEL, PIVOT
- Réallocation intelligente des ressources
- Maximisation ROI global
- Analyse impact décisions

### 7. 🔗 Blockchain Audit Trail (`/api/blockchain/audit`)
- **Traçabilité immuable** de toutes les actions
- Conformité GDPR, SOX, ISO27001
- Vérification intégrité 100%
- Smart contracts pour approbations
- Preuve cryptographique des changements

### 8. 🎤 Voice Commands (`/api/voice/command`)
- **Commandes vocales naturelles** en français
- NLP avancé pour compréhension intention
- Actions: "Affiche projet X", "Crée un risque", "Lance prévision IA"
- Extraction entités automatique
- Réponses vocales intelligentes

### 9. 📊 Portefeuille Projets Avancé (`/api/projects`)
- CRUD complet + historique blockchain
- Vues: tableau, kanban, timeline, 3D
- Prédictions retard ML
- Auto-classification par IA

### 10. 🛡️ Gestion Risques Intelligente (`/api/risks`)
- Registre risques avec auto-scoring
- Matrice quantique probabilité/impact
- Suggestions IA proactives
- Auto-génération plans mitigation

### 11. 💰 Finances Prédictives (`/api/finances`)
- Budgets, coûts, écarts temps réel
- **Prévisions IA ultra-précises**
- Alertes dépassement automatiques
- Optimisation coûts autonome

### 12. 📈 Power BI Advanced (`/api/powerbi/token`)
- Génération tokens embed sécurisés
- Datasets dynamiques temps réel
- Composant React avec auto-refresh

## API Révolutionnaires

### 🧬 Digital Twin & Temps Réel
```typescript
GET /api/ai/digital-twin?project_id=xxx
Response: {
  real_time_state: { health_score, velocity, burn_rate, team_sentiment, code_quality },
  predictive_model: { completion_forecast, budget_at_completion, quality_forecast },
  autonomous_recommendations: [...],
  real_time_alerts: [...]
}
```

### 🔮 Quantum Analysis
```typescript
POST /api/ai/quantum-analysis
Body: { project_id, simulation_depth: 10000 }
Response: {
  quantum_states: [...5 scénarios parallèles],
  entanglement_risks: [...corrélations projets],
  superposition_outcomes: [...résultats possibles],
  success_probability: 78.5
}
```

### ⚡ Auto-Healing
```typescript
POST /api/ai/auto-healing
Body: { project_id }
Response: {
  issues_detected: [...],
  healing_actions: [...actions autonomes exécutées],
  autonomous_decisions: [...],
  human_escalations: [...]
}
```

### 🧠 NLP Sentiment
```typescript
POST /api/ai/nlp-sentiment
Body: { project_id, data_sources: ['slack', 'teams', 'jira'] }
Response: {
  sentiment_analysis: { overall_score, emotional_indicators, key_themes },
  communication_patterns: {...},
  stakeholder_engagement: [...],
  risk_signals: [...]
}
```

### 🎯 Portfolio Optimization
```typescript
POST /api/ai/portfolio-optimization
Body: { optimization_goal: 'MAX_ROI' }
Response: {
  current_portfolio: {...},
  optimization_recommendations: [CONTINUE/ACCELERATE/PAUSE/CANCEL/PIVOT],
  optimized_portfolio: {...amélioration +25%},
  resource_reallocation: [...]
}
```

### 🔗 Blockchain Audit
```typescript
GET /api/blockchain/audit?entity_type=project&entity_id=xxx
Response: {
  blockchain_verified: true,
  audit_entries: [...transactions immuables],
  integrity_score: 100,
  compliance_status: { gdpr: true, sox: true, iso27001: true }
}
```

### 🎤 Voice Commands
```typescript
POST /api/voice/command
Body: { transcript: "Affiche le projet Cloud Migration" }
Response: {
  intent: 'SHOW_PROJECT',
  entities: { project_name: 'Cloud Migration' },
  action: { type: 'NAVIGATE', params: {...} },
  response: "Affichage du projet Cloud Migration"
}
```

## Multi-tenant

Architecture par colonne `tenant_id` + Row Level Security (RLS) PostgreSQL.

Middleware automatique:
- Extraction JWT
- Résolution tenant
- Injection contexte dans headers

## Sécurité

- JWT avec expiration 24h
- RBAC: COMEX, PMO, ANALYSTE
- RLS PostgreSQL par tenant
- Audit logs complet
- Validation Zod sur toutes les entrées

## Power BI

Configuration Azure AD requise:
1. Créer App Registration
2. Permissions: Report.Read.All, Dataset.Read.All
3. Ajouter à Power BI workspace
4. Configurer variables d'environnement

## Production

```bash
npm run build
npm start
```

Environnements recommandés:
- Vercel / Azure App Service (frontend)
- Azure PostgreSQL / AWS RDS (database)
- Azure Power BI Premium (BI)

## Licence

Propriétaire - Powalyze © 2026
