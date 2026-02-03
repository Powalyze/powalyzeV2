# 🏗️ ARCHITECTURE COCKPIT POWALYZE V3 — RECONSTRUCTION COMPLÈTE

**Date**: 3 février 2026  
**Auteur**: VB (Lead Dev / Architecte)  
**Objectif**: Effacer et reconstruire un cockpit exécutif moderne (PMO + IA)

---

## 📋 TABLE DES MATIÈRES

1. [Vision & Principes](#vision--principes)
2. [Architecture des Routes](#architecture-des-routes)
3. [Layout Principal](#layout-principal)
4. [Mode DEMO vs Mode PRO](#mode-demo-vs-mode-pro)
5. [Flux de Création de Projet](#flux-de-création-de-projet)
6. [Modules IA Intégrés](#modules-ia-intégrés)
7. [Modèles de Données](#modèles-de-données)
8. [Data Layer & Services](#data-layer--services)
9. [Expérience Utilisateur](#expérience-utilisateur)
10. [Plan d'Implémentation](#plan-dimplémentation)

---

## 🎯 VISION & PRINCIPES

### Vision Globale
**Powalyze = Cockpit exécutif pour gouvernance de portefeuille de projets**

Le cockpit doit être:
- **Project-centric**: Le projet est l'unité centrale de gouvernance
- **IA-native**: L'IA assiste, génère, analyse, narrative
- **Dual-mode**: Demo spectaculaire + Pro actionnable
- **PMO moderne**: Inspiré de monday.com/appwiki mais pour la gouvernance
- **Exécutif**: Conçu pour DG, COMEX, PMO, DSI

### Principes d'Architecture

1. **Single Source of Truth**: Un projet = une entité centrale qui agrège tout
2. **Progressive Disclosure**: Créer vite, enrichir progressivement
3. **AI Everywhere**: IA générative à chaque étape critique
4. **Narrative First**: Pas de données brutes, toujours contextualisées
5. **Zero Friction**: Demo = 0 clic pour tout voir, Pro = 1 clic pour créer

---

## 🗺️ ARCHITECTURE DES ROUTES

### Structure Complète

```
/
├── cockpit/
│   ├── layout.tsx                    # Layout principal cockpit
│   ├── page.tsx                      # Redirect → /cockpit/pro ou /cockpit/demo
│   │
│   ├── demo/                         # 🎭 MODE DEMO
│   │   ├── page.tsx                  # Dashboard demo full page
│   │   ├── projets/
│   │   │   ├── page.tsx              # Liste projets demo
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Détail projet demo
│   │   ├── risques/
│   │   │   └── page.tsx              # Radar risques demo
│   │   ├── decisions/
│   │   │   └── page.tsx              # Board décisions demo
│   │   ├── rapports/
│   │   │   └── page.tsx              # Rapports IA demo
│   │   └── scenarios/
│   │       └── page.tsx              # Scénarios demo
│   │
│   ├── pro/                          # 🚀 MODE PRO
│   │   ├── page.tsx                  # Dashboard pro (vide → CTA)
│   │   ├── onboarding/               # Premier projet obligatoire
│   │   │   ├── page.tsx              # Wizard onboarding
│   │   │   └── actions.ts            # Server actions création
│   │   ├── projets/
│   │   │   ├── page.tsx              # Liste projets (vide si 0)
│   │   │   ├── nouveau/
│   │   │   │   └── page.tsx          # Création projet (étape 1)
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx          # Vue globale projet
│   │   │   │   ├── risques/
│   │   │   │   │   └── page.tsx      # Risques projet
│   │   │   │   ├── decisions/
│   │   │   │   │   └── page.tsx      # Décisions projet
│   │   │   │   ├── scenarios/
│   │   │   │   │   └── page.tsx      # Scénarios projet
│   │   │   │   ├── ressources/
│   │   │   │   │   └── page.tsx      # Ressources/dépendances
│   │   │   │   ├── rapport/
│   │   │   │   │   └── page.tsx      # Rapport IA projet
│   │   │   │   └── enrichir/         # Wizard étapes 2-6
│   │   │   │       ├── risques/
│   │   │   │       │   └── page.tsx  # Étape 2: Risques
│   │   │   │       ├── decisions/
│   │   │   │       │   └── page.tsx  # Étape 3: Décisions
│   │   │   │       ├── scenarios/
│   │   │   │       │   └── page.tsx  # Étape 4: Scénarios
│   │   │   │       ├── ressources/
│   │   │   │       │   └── page.tsx  # Étape 5: Ressources
│   │   │   │       └── rapport/
│   │   │   │           └── page.tsx  # Étape 6: Rapport
│   │   │   └── actions.ts            # Server actions projets
│   │   │
│   │   ├── risques/
│   │   │   ├── page.tsx              # Vue globale risques portefeuille
│   │   │   └── actions.ts
│   │   ├── decisions/
│   │   │   ├── page.tsx              # Board décisions portefeuille
│   │   │   └── actions.ts
│   │   ├── rapports/
│   │   │   ├── page.tsx              # Bibliothèque rapports IA
│   │   │   ├── nouveau/
│   │   │   │   └── page.tsx          # Générer nouveau rapport
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Voir rapport
│   │   │   └── actions.ts
│   │   ├── scenarios/
│   │   │   ├── page.tsx              # Scénarios portefeuille
│   │   │   └── actions.ts
│   │   └── ia/
│   │       ├── page.tsx              # Hub IA (toutes les fonctions)
│   │       └── actions.ts
│   │
│   └── actions.ts                    # Server actions cockpit global
```

### Règles de Navigation

1. **Point d'entrée**: `/cockpit` → Détecte si user a des projets:
   - Si 0 projets → Redirect `/cockpit/pro/onboarding`
   - Si 1+ projets → Redirect `/cockpit/pro`
   - Si mode demo forcé → Redirect `/cockpit/demo`

2. **Mode Demo**: Toujours accessible, full page, immersif, narratif

3. **Mode Pro**: Protected, nécessite auth, progressive disclosure

4. **Navigation latérale** (présente partout dans `/cockpit/pro`):
   - Dashboard
   - Projets
   - Risques
   - Décisions
   - Rapports IA
   - Scénarios
   - Hub IA

---

## 🎨 LAYOUT PRINCIPAL

### Structure Layout (`/cockpit/layout.tsx`)

```tsx
// Structure conceptuelle (pas le code final)

<CockpitLayout>
  <Header>
    <Logo />
    <OrgSwitcher />        {/* Si multi-org */}
    <ModeSwitcher />       {/* Demo ⇄ Pro */}
    <AIAssistant />        {/* Toujours accessible */}
    <UserMenu />
  </Header>
  
  <Sidebar>
    <Nav>
      <NavItem icon="dashboard" label="Dashboard" href="/cockpit/pro" />
      <NavItem icon="projects" label="Projets" href="/cockpit/pro/projets" />
      <NavItem icon="risks" label="Risques" href="/cockpit/pro/risques" />
      <NavItem icon="decisions" label="Décisions" href="/cockpit/pro/decisions" />
      <NavItem icon="reports" label="Rapports IA" href="/cockpit/pro/rapports" />
      <NavItem icon="scenarios" label="Scénarios" href="/cockpit/pro/scenarios" />
      <NavItem icon="ai" label="Hub IA" href="/cockpit/pro/ia" />
    </Nav>
    
    <QuickActions>
      <Button>+ Nouveau projet</Button>
      <Button>🤖 Générer rapport</Button>
    </QuickActions>
    
    <AIInsights>
      {/* Insights IA contextuels */}
      <InsightCard>
        "3 risques critiques détectés"
      </InsightCard>
    </AIInsights>
  </Sidebar>
  
  <Main>
    <Breadcrumb />
    <PageContent>
      {children}
    </PageContent>
  </Main>
</CockpitLayout>
```

### Composants Clés Layout

#### 1. Header
- **Logo**: Powalyze, cliquable → Dashboard
- **OrgSwitcher**: Si user appartient à plusieurs orgs
- **ModeSwitcher**: Toggle Demo ⇄ Pro (avec badge visible)
- **AIAssistant**: Chat IA flottant, toujours accessible
- **UserMenu**: Profil, paramètres, déconnexion

#### 2. Sidebar (Navigation)
- **Navigation primaire**: 7 sections principales
- **QuickActions**: Boutons rapides création projet, rapport IA
- **AIInsights**: Carte contextuelle avec insights IA du moment
- **Collapsible**: Peut se réduire pour + d'espace

#### 3. Main Content Area
- **Breadcrumb**: Fil d'Ariane contextuel
- **PageContent**: Zone principale, adaptative selon la page

### Design System Inspiration

**Style**: Mélange monday.com (clarté, couleurs) + Linear (élégance, typographie)

- **Couleurs**:
  - Primary: Blue (#0066FF) → Actions, liens
  - Success: Green (#00C853) → Santé projets, validations
  - Warning: Orange (#FF9800) → Alertes modérées
  - Danger: Red (#F44336) → Risques critiques
  - AI: Purple (#9C27B0) → Tout ce qui touche à l'IA

- **Typographie**:
  - Headings: Inter Bold
  - Body: Inter Regular
  - Code/Data: JetBrains Mono

- **Spacing**: Système 4px (4, 8, 12, 16, 24, 32, 48, 64)

- **Cards**: Ombres douces, bordures arrondies (8px), hover states

---

## 🎭 MODE DEMO VS MODE PRO

### Mode DEMO (`/cockpit/demo`)

#### Objectif
**Montrer la puissance de Powalyze sans que l'utilisateur ait à créer quoi que ce soit.**

#### Contenu Demo

**Dashboard Demo** (`/cockpit/demo/page.tsx`):
```
┌─────────────────────────────────────────────┐
│ 🎭 MODE DÉMO — Découvrez Powalyze          │
│ Badge: "Données fictives à titre d'exemple"│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📊 VUE PORTEFEUILLE                         │
│                                             │
│ ┌─────────┬─────────┬─────────┬──────────┐ │
│ │ 12      │ 8       │ 3       │ 1        │ │
│ │ Projets │ Actifs  │ Risques │ Décision │ │
│ │         │         │ Critiques│ Urgente │ │
│ └─────────┴─────────┴─────────┴──────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 🤖 SYNTHÈSE IA DU PORTEFEUILLE              │
│                                             │
│ "Votre portefeuille de 12 projets présente │
│  une santé globale correcte (75%), mais    │
│  3 risques critiques nécessitent une       │
│  attention immédiate. La vélocité du       │
│  projet 'Transformation Cloud' est en      │
│  baisse de 23% ce mois-ci..."              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📈 PROJETS CLÉS                             │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🟢 Transformation Cloud        Q1 2026 │ │
│ │    Progress: ████████░░ 80%            │ │
│ │    Owner: Marie Dupont | Budget: 2.5M €│ │
│ │    ⚠️ 2 risques | ✅ 1 décision        │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🟡 Refonte CRM                 Q2 2026 │ │
│ │    Progress: █████░░░░░ 45%            │ │
│ │    Owner: Jean Martin | Budget: 1.8M € │ │
│ │    🔴 1 risque critique                │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🟢 Migration SAP S/4HANA       Q3 2026 │ │
│ │    Progress: ███░░░░░░░ 30%            │ │
│ │    Owner: Sophie Bernard | 4.2M €      │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 🚨 RADAR RISQUES                            │
│                                             │
│   [Graphique radar interactif]             │
│   - Technique: 7/10                        │
│   - Budget: 4/10                           │
│   - Planning: 8/10                         │
│   - Ressources: 6/10                       │
│   - Externe: 3/10                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 🎯 DÉCISIONS EN ATTENTE                     │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🔴 URGENT | COMEX 15/02                │ │
│ │ Arbitrage budget Transformation Cloud   │ │
│ │ IA Recommandation: "Approuver +300K€"  │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Projets Demo** (3 projets pré-remplis):

1. **Transformation Cloud** (Q1 2026)
   - Description narrative complète
   - 80% progression
   - 5 risques (2 médiums, 3 faibles)
   - 3 décisions prises, 1 en attente
   - Rapport IA généré
   - 3 scénarios (optimiste/central/pessimiste)

2. **Refonte CRM** (Q2 2026)
   - 45% progression
   - 1 risque critique (dépassement budget)
   - 2 décisions urgentes
   - Rapport IA avec alertes

3. **Migration SAP S/4HANA** (Q3 2026)
   - 30% progression
   - 4 risques techniques
   - Timeline interactive

#### Caractéristiques Demo

- **Badge visible**: "MODE DÉMO" en haut à droite
- **Call-to-Action**: Bouton "Passer en mode Pro" visible partout
- **Narratif**: Textes longs, contextualisés, storytelling
- **Interactions**: Tout cliquable, explorable
- **IA omniprésente**: Synthèses, recommandations, insights partout

---

### Mode PRO (`/cockpit/pro`)

#### Objectif
**Cockpit actionnable, connecté aux vraies données Supabase, vide au départ.**

#### État Initial (0 projets)

```
┌─────────────────────────────────────────────┐
│ 🚀 BIENVENUE DANS VOTRE COCKPIT             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                                             │
│          [Illustration vide élégante]       │
│                                             │
│   Commencez par créer votre premier projet │
│                                             │
│   Un projet est l'unité centrale de        │
│   gouvernance dans Powalyze.               │
│                                             │
│   ┌───────────────────────────────────────┐ │
│   │  🤖 Créer mon premier projet          │ │
│   │     Assisté par IA (2 min)            │ │
│   └───────────────────────────────────────┘ │
│                                             │
│   ou                                        │
│                                             │
│   🎭 Voir le cockpit en mode démo          │
│                                             │
└─────────────────────────────────────────────┘
```

#### État Rempli (1+ projets)

**Dashboard Pro** (`/cockpit/pro/page.tsx`):
```
┌─────────────────────────────────────────────┐
│ 📊 DASHBOARD                                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ VUE PORTEFEUILLE                            │
│                                             │
│ [KPIs réels calculés en temps réel]        │
│ - Projets actifs                           │
│ - Santé globale                            │
│ - Risques ouverts                          │
│ - Décisions en attente                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 🤖 SYNTHÈSE IA                              │
│ [Génération automatique basée sur data]    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ PROJETS                                     │
│ [Liste projets réels, triable, filtrable]  │
└─────────────────────────────────────────────┘
```

---

## 🚀 FLUX DE CRÉATION DE PROJET

### Principe
**Le projet est obligatoire. Tout le reste est optionnel et progressif.**

### Étape 1 : Création Projet (OBLIGATOIRE)

#### Formulaire Création (`/cockpit/pro/projets/nouveau`)

**Champs obligatoires** :
- **Nom du projet** (texte, max 100 caractères)
- **Contexte/Objectif** (textarea, min 50 caractères)

**Champs optionnels** :
- **Horizon** (dropdown: Q1 2026, Q2 2026, Q3 2026, Q4 2026, Autre)
- **Type** (dropdown: Transformation, Run, Stratégique, Risque, Innovation)
- **Budget estimé** (nombre)
- **Deadline** (date)

**IA Générative intégrée** :

1. **Pendant la saisie** :
   - Après 50 caractères dans "Contexte/Objectif"
   - Bouton "✨ Enrichir avec l'IA"
   - L'IA propose:
     - Une description narrative complète
     - Des objectifs structurés
     - Des premiers risques potentiels (3-5)
     - Des premières décisions à cadrer (2-3)

2. **Interface IA** :
   ```
   ┌─────────────────────────────────────────┐
   │ 🤖 ASSISTANT IA                         │
   │                                         │
   │ "J'ai analysé votre contexte.          │
   │  Voici ce que je propose:"             │
   │                                         │
   │ ┌─────────────────────────────────────┐ │
   │ │ DESCRIPTION NARRATIVE               │ │
   │ │ [Texte généré, éditable]            │ │
   │ └─────────────────────────────────────┘ │
   │                                         │
   │ ┌─────────────────────────────────────┐ │
   │ │ OBJECTIFS IDENTIFIÉS                │ │
   │ │ 1. [Objectif 1]                     │ │
   │ │ 2. [Objectif 2]                     │ │
   │ │ 3. [Objectif 3]                     │ │
   │ └─────────────────────────────────────┘ │
   │                                         │
   │ ┌─────────────────────────────────────┐ │
   │ │ RISQUES POTENTIELS                  │ │
   │ │ 🟡 Risque 1: [Description]          │ │
   │ │ 🟡 Risque 2: [Description]          │ │
   │ │ 🔴 Risque 3: [Description critique] │ │
   │ └─────────────────────────────────────┘ │
   │                                         │
   │ [Valider] [Modifier] [Regénérer]      │
   └─────────────────────────────────────────┘
   ```

3. **Validation** :
   - Bouton "Créer le projet"
   - Sauvegarde dans Supabase (table `projects`)
   - Génération automatique d'un ID
   - Redirect vers `/cockpit/pro/projets/[id]`

---

### Étape 2-6 : Enrichissement Progressif (OPTIONNEL)

#### Après création, proposition Wizard

```
┌─────────────────────────────────────────────┐
│ ✅ PROJET CRÉÉ AVEC SUCCÈS                  │
│                                             │
│ "Transformation Cloud" est maintenant       │
│ dans votre cockpit.                         │
│                                             │
│ Souhaitez-vous enrichir ce projet?          │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ ✨ Oui, continuons (5 étapes)           │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 🚀 Non, je le ferai plus tard              │
│                                             │
└─────────────────────────────────────────────┘
```

#### Si "Oui, continuons"

**Wizard 5 étapes** (`/cockpit/pro/projets/[id]/enrichir/...`):

##### Étape 2 : Risques & Opportunités
```
┌─────────────────────────────────────────────┐
│ ÉTAPE 2/6 — RISQUES & OPPORTUNITÉS         │
│ [Progress bar: ████░░░░░░░░]               │
└─────────────────────────────────────────────┘

🤖 L'IA a identifié 3 risques potentiels :

┌─────────────────────────────────────────────┐
│ 🟡 RISQUE TECHNIQUE                         │
│ Compatibilité legacy avec cloud native     │
│                                             │
│ Probabilité: 60% | Impact: Élevé           │
│ [Ajouter] [Modifier] [Ignorer]             │
└─────────────────────────────────────────────┘

[+ Ajouter un risque manuellement]

[Passer cette étape] [Suivant: Décisions →]
```

##### Étape 3 : Décisions & Arbitrages
```
┌─────────────────────────────────────────────┐
│ ÉTAPE 3/6 — DÉCISIONS & ARBITRAGES         │
│ [Progress bar: ██████░░░░░░]               │
└─────────────────────────────────────────────┘

🤖 Décisions à cadrer identifiées :

┌─────────────────────────────────────────────┐
│ 🎯 DÉCISION STRATÉGIQUE                     │
│ Choix du cloud provider (AWS vs Azure vs GCP)│
│                                             │
│ Comité: COMEX | Échéance: 15/03/2026       │
│ [Ajouter au planning] [Modifier] [Ignorer] │
└─────────────────────────────────────────────┘

[+ Ajouter une décision manuellement]

[Passer] [Suivant: Scénarios →]
```

##### Étape 4 : Scénarios & Impacts
```
┌─────────────────────────────────────────────┐
│ ÉTAPE 4/6 — SCÉNARIOS & IMPACTS            │
│ [Progress bar: ████████░░░░]               │
└─────────────────────────────────────────────┘

🤖 L'IA génère 3 scénarios :

┌─────────────────────────────────────────────┐
│ 🟢 SCÉNARIO OPTIMISTE                       │
│ Livraison Q1 2026, budget respecté         │
│ Probabilité: 30%                           │
│ [Voir détails] [Modifier]                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 🟡 SCÉNARIO CENTRAL                         │
│ Livraison Q2 2026, dépassement 15%         │
│ Probabilité: 50%                           │
│ [Voir détails] [Modifier]                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 🔴 SCÉNARIO PESSIMISTE                      │
│ Livraison Q3 2026, dépassement 40%         │
│ Probabilité: 20%                           │
│ [Voir détails] [Modifier]                  │
└─────────────────────────────────────────────┘

[Passer] [Suivant: Ressources →]
```

##### Étape 5 : Ressources & Dépendances
```
┌─────────────────────────────────────────────┐
│ ÉTAPE 5/6 — RESSOURCES & DÉPENDANCES       │
│ [Progress bar: ██████████░░]               │
└─────────────────────────────────────────────┘

RESSOURCES HUMAINES :
[+ Assigner des ressources]

DÉPENDANCES PROJETS :
Ce projet dépend de :
[Rechercher un projet...]

RESSOURCES MATÉRIELLES/FINANCIÈRES :
[+ Ajouter une ressource]

[Passer] [Suivant: Rapport →]
```

##### Étape 6 : Rapport Exécutif IA
```
┌─────────────────────────────────────────────┐
│ ÉTAPE 6/6 — RAPPORT EXÉCUTIF IA            │
│ [Progress bar: ████████████]               │
└─────────────────────────────────────────────┘

🤖 Génération du rapport exécutif...

┌─────────────────────────────────────────────┐
│ 📄 RAPPORT EXÉCUTIF                         │
│ Projet: Transformation Cloud                │
│ Date: 03/02/2026                           │
│                                             │
│ SYNTHÈSE                                    │
│ [Texte narratif généré par IA]             │
│                                             │
│ POINTS CLÉS                                 │
│ • [Point 1]                                │
│ • [Point 2]                                │
│ • [Point 3]                                │
│                                             │
│ RISQUES MAJEURS                             │
│ [Liste risques avec impacts]                │
│                                             │
│ DÉCISIONS ATTENDUES                         │
│ [Liste décisions avec échéances]            │
│                                             │
│ RECOMMANDATIONS IA                          │
│ [Recommandations stratégiques]              │
│                                             │
│ [Télécharger PDF] [Envoyer COMEX]          │
└─────────────────────────────────────────────┘

[Terminer] [Retour au projet]
```

---

#### Si "Non, je le ferai plus tard"

Redirect vers `/cockpit/pro/projets/[id]` avec:
- Projet créé
- Vue globale accessible
- Boutons "Enrichir" visibles dans chaque section vide

---

## 🤖 MODULES IA INTÉGRÉS

### Architecture IA

```
lib/ai/
├── core/
│   ├── openai-client.ts          # Client OpenAI/Azure OpenAI
│   ├── prompts.ts                # Prompts système centralisés
│   └── schemas.ts                # Zod schemas pour structured outputs
├── generators/
│   ├── project-description.ts    # Génère description narrative
│   ├── project-objectives.ts     # Génère objectifs structurés
│   ├── risk-identifier.ts        # Identifie risques potentiels
│   ├── decision-identifier.ts    # Identifie décisions à cadrer
│   ├── scenario-generator.ts     # Génère scénarios (opt/central/pess)
│   └── report-generator.ts       # Génère rapports exécutifs
├── analyzers/
│   ├── portfolio-analyzer.ts     # Analyse globale portefeuille
│   ├── project-health.ts         # Analyse santé projet
│   ├── risk-predictor.ts         # Prédit probabilité risques
│   └── velocity-tracker.ts       # Analyse vélocité projet
└── assistants/
    ├── chief-of-staff.ts         # AI Chief of Staff (actions stratégiques)
    └── committee-prep.ts         # Préparation documents COMEX
```

### Fonctions IA Détaillées

#### 1. Génération Description Projet

**Input**:
- Nom du projet
- Contexte/Objectif (min 50 caractères)
- Type (optionnel)
- Horizon (optionnel)

**Prompt Système**:
```
Vous êtes un expert en gestion de projet et gouvernance d'entreprise.

À partir des informations fournies par l'utilisateur, générez :

1. UNE DESCRIPTION NARRATIVE COMPLÈTE (200-300 mots) :
   - Contexte de l'entreprise
   - Enjeux business
   - Objectifs stratégiques
   - Périmètre du projet
   - Bénéfices attendus

2. OBJECTIFS STRUCTURÉS (3-5 objectifs SMART) :
   - Spécifiques
   - Mesurables
   - Atteignables
   - Réalistes
   - Temporellement définis

Format de sortie : JSON strictement structuré.

Ton : Exécutif, factuel, orienté gouvernance.
```

**Output** (Zod Schema):
```typescript
{
  description: string;          // 200-300 mots
  objectives: Array<{
    title: string;
    description: string;
    measurable: string;         // KPI associé
    deadline: string;           // Date cible
  }>;
  confidence: number;           // 0-100
}
```

**Utilisation**:
- Appelée via `/api/ai/generate-project-description`
- Latence cible: < 3 secondes
- Fallback: Si erreur, retour champs vides (user saisit manuellement)

---

#### 2. Identification Risques

**Input**:
- Description projet
- Objectifs
- Type projet
- Budget (optionnel)

**Prompt Système**:
```
Vous êtes un expert en gestion de risques projets.

Analysez le projet fourni et identifiez 3-7 risques potentiels :

- RISQUES TECHNIQUES
- RISQUES BUDGÉTAIRES
- RISQUES PLANNING
- RISQUES RESSOURCES
- RISQUES EXTERNES

Pour chaque risque, fournir :
- Titre court (max 60 caractères)
- Description détaillée (100-150 mots)
- Niveau de gravité (low, medium, high, critical)
- Probabilité d'occurrence (0-100%)
- Impact estimé (0-100%)
- Plan de mitigation suggéré (optionnel)

Format : JSON structuré.
```

**Output**:
```typescript
{
  risks: Array<{
    title: string;
    description: string;
    level: 'low' | 'medium' | 'high' | 'critical';
    probability: number;        // 0-100
    impact: number;             // 0-100
    category: string;           // technique, budget, planning, etc.
    mitigation_plan?: string;
  }>;
}
```

---

#### 3. Identification Décisions

**Input**:
- Description projet
- Objectifs
- Risques identifiés

**Prompt Système**:
```
Vous êtes un conseiller stratégique pour comités exécutifs.

Identifiez 2-5 décisions majeures à cadrer pour ce projet :

- DÉCISIONS STRATÉGIQUES (orientation, choix structurants)
- DÉCISIONS BUDGÉTAIRES (investissements, arbitrages)
- DÉCISIONS OPÉRATIONNELLES (organisation, ressources)

Pour chaque décision :
- Titre clair (max 80 caractères)
- Description contexte (100-200 mots)
- Comité concerné (CODIR, COMEX, COPIL)
- Échéance recommandée
- Impacts si non prise
- Options possibles (2-3 options)
- Recommandation IA

Format : JSON structuré.
```

**Output**:
```typescript
{
  decisions: Array<{
    title: string;
    description: string;
    committee: 'CODIR' | 'COMEX' | 'COPIL';
    deadline: string;           // Date recommandée
    impacts: string[];          // Si décision non prise
    options: Array<{
      name: string;
      pros: string[];
      cons: string[];
    }>;
    recommendation: string;     // Recommandation IA
    confidence: number;         // 0-100
  }>;
}
```

---

#### 4. Génération Scénarios

**Input**:
- Projet complet (description, objectifs, risques, décisions)
- Budget
- Deadline

**Prompt Système**:
```
Vous êtes un analyste stratégique spécialisé en planification de scénarios.

Générez 3 scénarios pour ce projet :

1. SCÉNARIO OPTIMISTE (probabilité ~30%)
   - Tout se passe bien
   - Pas de risques majeurs matérialisés
   - Livraison dans les temps et budget

2. SCÉNARIO CENTRAL (probabilité ~50%)
   - Quelques risques se matérialisent
   - Légers retards et dépassements
   - Livraison avec ajustements

3. SCÉNARIO PESSIMISTE (probabilité ~20%)
   - Plusieurs risques majeurs se matérialisent
   - Retards significatifs
   - Dépassements budgétaires importants

Pour chaque scénario :
- Nom narratif
- Description (150-200 mots)
- Probabilité (%)
- Délai de livraison
- Budget final estimé
- Impacts business
- Actions préventives/correctives

Format : JSON structuré.
```

**Output**:
```typescript
{
  scenarios: Array<{
    type: 'optimistic' | 'central' | 'pessimistic';
    name: string;
    description: string;
    probability: number;        // 0-100
    delivery_date: string;
    final_budget: number;
    business_impacts: string[];
    actions: string[];          // Actions recommandées
  }>;
}
```

---

#### 5. Rapport Exécutif IA

**Input**:
- Projet complet (toutes les données)
- Risques
- Décisions
- Scénarios
- Progression actuelle

**Prompt Système**:
```
Vous êtes un Chief of Staff générant un rapport exécutif pour le COMEX.

Générez un rapport structuré comprenant :

1. SYNTHÈSE EXÉCUTIVE (200 mots max)
   - L'essentiel en quelques paragraphes
   - Santé globale du projet
   - Points d'attention majeurs

2. STATUT ACTUEL
   - Avancement (%)
   - Budget consommé vs prévu
   - Respect du planning
   - Santé globale (GREEN/YELLOW/RED)

3. POINTS CLÉS (5-7 bullet points)
   - Réalisations majeures
   - Jalons franchis
   - Points de vigilance

4. RISQUES MAJEURS (top 3)
   - Description
   - Impact
   - Mitigation

5. DÉCISIONS ATTENDUES (top 3)
   - Titre
   - Échéance
   - Impact si non prise

6. PROCHAINES ÉTAPES (30 jours)
   - Actions critiques
   - Jalons à venir

7. RECOMMANDATIONS IA
   - Actions stratégiques à court terme
   - Optimisations possibles

Format : Markdown structuré, ton exécutif.
```

**Output**:
```typescript
{
  report_id: string;
  generated_at: string;
  format: 'markdown';
  sections: {
    executive_summary: string;
    current_status: {
      progress: number;
      budget_consumed: number;
      budget_total: number;
      on_schedule: boolean;
      health: 'green' | 'yellow' | 'red';
    };
    key_points: string[];
    major_risks: Array<{
      title: string;
      impact: string;
      mitigation: string;
    }>;
    pending_decisions: Array<{
      title: string;
      deadline: string;
      impact: string;
    }>;
    next_steps: string[];
    ai_recommendations: string[];
  };
  full_markdown: string;        // Rapport complet en markdown
}
```

---

#### 6. AI Chief of Staff (Portfolio)

**Input**:
- Tous les projets du portefeuille
- Tous les risques ouverts
- Toutes les décisions en attente
- Données historiques (optionnel)

**Prompt Système**:
```
Vous êtes le Chief of Staff IA du DG.

Analysez l'ensemble du portefeuille de projets et générez :

1. SYNTHÈSE PORTEFEUILLE (300 mots)
   - Vue d'ensemble
   - Santé globale
   - Tendances (vélocité, risques, budget)

2. PRIORITÉS STRATÉGIQUES (top 5)
   - Actions à prendre immédiatement
   - Impact business
   - Urgence
   - Complexité

3. ALERTES CRITIQUES (top 3)
   - Projets en difficulté
   - Risques systémiques
   - Décisions bloquantes

4. OPPORTUNITÉS (top 3)
   - Optimisations possibles
   - Synergies entre projets
   - Quick wins

5. RECOMMANDATIONS COMEX
   - Décisions stratégiques à prendre
   - Réallocations ressources
   - Arbitrages budgétaires

Format : JSON structuré.
Ton : Stratégique, factuel, orienté action.
```

**Output** (existant dans `lib/ai-chief-actions.ts`, à enrichir):
```typescript
{
  portfolio_summary: string;
  health_score: number;         // 0-100
  strategic_priorities: Array<{
    title: string;
    description: string;
    impact: string;             // Quantifié
    urgency: 'critical' | 'high' | 'medium';
    complexity: 'low' | 'medium' | 'high';
    confidence: number;         // 0-100
  }>;
  critical_alerts: Array<{
    project_id: string;
    alert_type: 'risk' | 'decision' | 'budget' | 'schedule';
    severity: 'critical' | 'high';
    description: string;
    action_required: string;
  }>;
  opportunities: Array<{
    title: string;
    description: string;
    estimated_benefit: string;
    effort: 'low' | 'medium' | 'high';
  }>;
  comex_recommendations: Array<{
    title: string;
    rationale: string;
    options: Array<{ name: string; impact: string; }>;
    ai_recommendation: string;
  }>;
}
```

---

### API Routes IA

```
/api/ai/
├── generate-project-description   POST
├── identify-risks                 POST
├── identify-decisions             POST
├── generate-scenarios             POST
├── generate-report                POST
├── analyze-portfolio              GET
├── predict-project-health         POST
└── chat                           POST (AI Assistant chat)
```

Toutes les routes :
- Protected (auth requise)
- Rate limited (10 req/min par user)
- Logs dans `webhook_logs` (traçabilité)
- Fallback graceful si OpenAI down

---

## 📊 MODÈLES DE DONNÉES

### Schéma SQL (déjà existant)

Le schéma `schema-v2-clean.sql` est déjà parfait et aligné. Tables:

1. **organizations** (tenant isolation)
2. **profiles** (users + plan)
3. **projects** (cœur du cockpit) ✅
4. **risks** (risques projets) ✅
5. **decisions** (décisions comité) ✅
6. **resources** (ressources)
7. **project_resources** (allocation)
8. **dependencies** (dépendances projets)
9. **reports** (rapports IA) ✅
10. **api_keys** (API externe)
11. **webhooks** (webhooks sortants)
12. **webhook_logs** (historique)

### Extensions Nécessaires

Pour supporter les nouveaux besoins, ajouter:

#### Table: `scenarios` (NEW)

```sql
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('optimistic', 'central', 'pessimistic')),
  name TEXT NOT NULL,
  description TEXT,
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  delivery_date DATE,
  final_budget DECIMAL(15, 2),
  business_impacts JSONB DEFAULT '[]'::jsonb,
  actions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scenarios_project ON scenarios(project_id);
```

#### Table: `project_objectives` (NEW)

```sql
CREATE TABLE project_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  measurable TEXT,              -- KPI
  deadline DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_objectives_project ON project_objectives(project_id);
```

#### Table: `ai_generations` (NEW - traçabilité IA)

```sql
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,    -- 'project', 'risk', 'decision', 'report', 'scenario'
  entity_id UUID,               -- ID de l'entité générée
  generation_type TEXT NOT NULL, -- 'description', 'risk-identification', 'scenario', etc.
  prompt_used TEXT,             -- Prompt système utilisé
  model TEXT,                   -- 'gpt-4', 'gpt-4-turbo', etc.
  input_data JSONB,             -- Input fourni
  output_data JSONB,            -- Output généré
  tokens_used INTEGER,
  latency_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_generations_org ON ai_generations(organization_id);
CREATE INDEX idx_ai_generations_entity ON ai_generations(entity_type, entity_id);
```

### Types TypeScript (à mettre à jour)

**`types/index.ts`** - Ajouter:

```typescript
export interface Scenario {
  id: string;
  organization_id: string;
  project_id: string;
  type: 'optimistic' | 'central' | 'pessimistic';
  name: string;
  description?: string;
  probability: number;           // 0-100
  delivery_date?: Date;
  final_budget?: number;
  business_impacts: string[];
  actions: string[];
  created_at: Date;
  updated_at: Date;
}

export interface ProjectObjective {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  measurable?: string;           // KPI
  deadline?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface AIGeneration {
  id: string;
  organization_id: string;
  user_id?: string;
  entity_type: 'project' | 'risk' | 'decision' | 'report' | 'scenario';
  entity_id?: string;
  generation_type: string;
  prompt_used?: string;
  model: string;
  input_data: any;
  output_data: any;
  tokens_used?: number;
  latency_ms?: number;
  success: boolean;
  error_message?: string;
  created_at: Date;
}
```

---

## 🔧 DATA LAYER & SERVICES

### Architecture Services

```
lib/services/
├── projects/
│   ├── project.service.ts          # CRUD projets
│   ├── project-stats.service.ts    # Stats & agrégations
│   └── project-validation.service.ts
├── risks/
│   ├── risk.service.ts             # CRUD risques
│   └── risk-analysis.service.ts    # Analyse & prédiction
├── decisions/
│   ├── decision.service.ts         # CRUD décisions
│   └── decision-tracking.service.ts
├── scenarios/
│   └── scenario.service.ts         # CRUD scénarios
├── reports/
│   ├── report.service.ts           # CRUD rapports
│   └── report-generation.service.ts # Génération via IA
├── resources/
│   └── resource.service.ts         # CRUD ressources
└── portfolio/
    └── portfolio.service.ts        # Agrégations portefeuille
```

### Service Pattern

Tous les services suivent ce pattern:

```typescript
// Example: lib/services/projects/project.service.ts

import { supabaseAdmin } from '@/lib/supabase';
import { Project } from '@/types';

export class ProjectService {
  
  // GET - Liste projets par org
  static async getProjects(organizationId: string): Promise<Project[]> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  // GET - Un projet par ID
  static async getProject(id: string, organizationId: string): Promise<Project | null> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // POST - Créer projet
  static async createProject(
    organizationId: string,
    userId: string,
    projectData: Partial<Project>
  ): Promise<Project> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([{
        organization_id: organizationId,
        owner_id: userId,
        ...projectData
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // PATCH - Mettre à jour projet
  static async updateProject(
    id: string,
    organizationId: string,
    updates: Partial<Project>
  ): Promise<Project> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // DELETE - Supprimer projet
  static async deleteProject(id: string, organizationId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);
    
    if (error) throw error;
  }
  
  // STATS - Stats projet
  static async getProjectStats(id: string, organizationId: string) {
    // Aggrégation: nb risques, nb décisions, progression, etc.
    const [risks, decisions, objectives] = await Promise.all([
      supabaseAdmin.from('risks').select('id').eq('project_id', id),
      supabaseAdmin.from('decisions').select('id').eq('project_id', id),
      supabaseAdmin.from('project_objectives').select('id').eq('project_id', id)
    ]);
    
    return {
      total_risks: risks.data?.length || 0,
      total_decisions: decisions.data?.length || 0,
      total_objectives: objectives.data?.length || 0
    };
  }
}
```

### Server Actions

Tous les server actions utilisent les services:

```typescript
// Example: app/cockpit/pro/projets/actions.ts

'use server';

import { ProjectService } from '@/lib/services/projects/project.service';
import { getOrganizationId, getUserId } from '@/lib/auth-server';
import { revalidatePath } from 'next/cache';

export async function createProject(formData: FormData) {
  try {
    const organizationId = await getOrganizationId();
    const userId = await getUserId();
    
    if (!organizationId || !userId) {
      return { success: false, error: 'Non authentifié' };
    }
    
    const projectData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: 'active',
      health: 'green',
      progress: 0
    };
    
    const project = await ProjectService.createProject(
      organizationId,
      userId,
      projectData
    );
    
    revalidatePath('/cockpit/pro/projets');
    
    return { success: true, project };
    
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'Erreur lors de la création' };
  }
}

export async function getProjects() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) return { success: false, projects: [] };
    
    const projects = await ProjectService.getProjects(organizationId);
    return { success: true, projects };
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, projects: [] };
  }
}
```

---

## 🎨 EXPÉRIENCE UTILISATEUR

### Persona: DG / DSI / PMO

**Contexte**:
- Gère 10-50 projets simultanément
- Besoin de visibilité rapide (dashboard)
- Doit prendre des décisions stratégiques
- Peu de temps pour saisir des données

### Parcours Utilisateur Type

#### 1. Première Connexion (0 projets)

```
┌────────────────────────────────────────┐
│ LOGIN                                  │
│ Email: jean.martin@entreprise.fr       │
│ Password: ********                     │
│ [Se connecter]                         │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│ ✅ COMPTE CRÉÉ                         │
│ Redirect → /cockpit/pro/onboarding     │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│ 🚀 BIENVENUE JEAN                      │
│                                        │
│ Créons votre premier projet ensemble. │
│ L'IA vous assistera. (2 minutes)      │
│                                        │
│ [C'est parti !]                        │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│ CRÉATION PROJET                        │
│                                        │
│ Nom: Transformation Cloud              │
│ Contexte: Migration infra vers AWS... │
│                                        │
│ [✨ Enrichir avec l'IA]                │
└────────────────────────────────────────┘
         ↓ (3 secondes)
┌────────────────────────────────────────┐
│ 🤖 L'IA A GÉNÉRÉ :                     │
│ • Description narrative complète       │
│ • 5 objectifs SMART                    │
│ • 4 risques potentiels                 │
│ • 2 décisions à cadrer                 │
│                                        │
│ [Valider et créer]                     │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│ ✅ PROJET CRÉÉ                         │
│                                        │
│ Souhaitez-vous enrichir maintenant?    │
│ [Oui (5 min)] [Non, plus tard]        │
└────────────────────────────────────────┘
         ↓ (si "Non")
┌────────────────────────────────────────┐
│ DASHBOARD PRO                          │
│                                        │
│ 📊 1 projet actif                      │
│ 🟢 Transformation Cloud (0% progress)  │
│                                        │
│ [Voir le projet]                       │
└────────────────────────────────────────┘
```

**Temps total**: 2-3 minutes  
**Frictions**: 0  
**Valeur perçue**: Immédiate (IA fait le gros du travail)

---

#### 2. Utilisation Quotidienne (10+ projets)

```
┌────────────────────────────────────────┐
│ LOGIN                                  │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│ DASHBOARD PRO                          │
│                                        │
│ 🤖 SYNTHÈSE IA DU JOUR :               │
│ "3 risques critiques détectés.        │
│  Projet 'Refonte CRM' nécessite       │
│  décision COMEX urgente."             │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ 🔴 ALERTES (3)                     │ │
│ │ • Refonte CRM: Budget dépassé 15%  │ │
│ │ • SAP Migration: Retard 2 semaines │ │
│ │ • Cloud Transfo: Risque technique  │ │
│ └────────────────────────────────────┘ │
│                                        │
│ 📊 PORTEFEUILLE (12 projets)          │
│ [Vue tableau] [Vue timeline]          │
└────────────────────────────────────────┘
         ↓ (clic "Refonte CRM")
┌────────────────────────────────────────┐
│ PROJET: REFONTE CRM                    │
│                                        │
│ 🟡 Santé: YELLOW                       │
│ Progress: ████████░░ 75%               │
│                                        │
│ 🤖 SYNTHÈSE IA :                       │
│ "Budget dépassé de 15% (270K€).       │
│  Décision COMEX requise: approuver    │
│  rallonge ou réduire périmètre."      │
│                                        │
│ [Onglets]                              │
│ Vue Globale | Risques | Décisions |   │
│ Scénarios | Ressources | Rapport      │
│                                        │
│ 🚨 ACTIONS RECOMMANDÉES (3)           │
│ 1. Arbitrage budget (URGENT)          │
│ 2. Réaffecter ressource X             │
│ 3. Replanifier jalons Q2              │
│                                        │
│ [📄 Générer rapport COMEX]             │
└────────────────────────────────────────┘
         ↓ (clic "Générer rapport COMEX")
┌────────────────────────────────────────┐
│ 🤖 GÉNÉRATION RAPPORT...               │
│ [Progress spinner] (5 secondes)        │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│ 📄 RAPPORT EXÉCUTIF GÉNÉRÉ             │
│                                        │
│ [Preview rapport markdown]             │
│                                        │
│ [📥 Télécharger PDF]                   │
│ [📧 Envoyer par email]                 │
│ [💾 Enregistrer dans bibliothèque]     │
└────────────────────────────────────────┘
```

**Temps moyen par tâche**: 30 secondes - 2 minutes  
**Frictions**: Minimales (IA pré-analyse)  
**Valeur perçue**: Très haute (gain de temps considérable)

---

### Principes UX Clés

1. **Zero Data Entry Where Possible**
   - IA génère, user valide/ajuste
   - Pas de champs vides à remplir manuellement si IA peut aider

2. **Progressive Disclosure**
   - Minimum au départ, enrichissement progressif
   - Pas de formulaires à rallonge

3. **Contextual AI**
   - IA toujours présente, jamais imposée
   - Boutons "Enrichir avec l'IA" partout où pertinent

4. **Visual Health Indicators**
   - 🟢 Green / 🟡 Yellow / 🔴 Red partout
   - Pas besoin de lire pour comprendre l'état

5. **Narrative Over Raw Data**
   - Synthèses en langage naturel
   - Pas de tableaux bruts sans contexte

6. **Fast Access to Critical Info**
   - Dashboard = vue 360° en 1 coup d'œil
   - Drill-down en 1 clic

7. **Actionable Insights**
   - Chaque insight IA = action suggérée
   - Boutons d'action directement dans les cartes

---

## 🚧 PLAN D'IMPLÉMENTATION

### Phase 1 : Fondations (Semaine 1)

**Objectif**: Architecture de base, routing, layout

**Tasks**:
1. ✅ Schéma SQL V2 (déjà fait)
2. ✅ Types TypeScript alignés (déjà fait)
3. 🔨 Créer structure routes `/cockpit/demo` et `/cockpit/pro`
4. 🔨 Layout principal cockpit (`/cockpit/layout.tsx`)
5. 🔨 Composants UI de base (Header, Sidebar, Breadcrumb)
6. 🔨 Page redirect `/cockpit/page.tsx` (détecte si 0 projet → onboarding)
7. 🔨 Middleware check: redirection selon présence projets

**Livrables**:
- Routes `/cockpit/demo` et `/cockpit/pro` accessibles
- Layout fonctionnel avec navigation
- Redirect intelligent selon état user

**Tests**:
- User sans projet → `/cockpit/pro/onboarding`
- User avec projets → `/cockpit/pro` (dashboard)
- Navigation sidebar fonctionne

---

### Phase 2 : Mode Demo (Semaine 1-2)

**Objectif**: Créer un mode demo spectaculaire, immersif, narratif

**Tasks**:
1. 🔨 Créer données demo mockées (`lib/demo-data.ts`)
   - 3 projets complets
   - 10+ risques
   - 8+ décisions
   - 3 rapports IA pré-générés
2. 🔨 Page dashboard demo (`/cockpit/demo/page.tsx`)
3. 🔨 Page liste projets demo (`/cockpit/demo/projets/page.tsx`)
4. 🔨 Page détail projet demo (`/cockpit/demo/projets/[id]/page.tsx`)
5. 🔨 Page risques demo (`/cockpit/demo/risques/page.tsx`)
6. 🔨 Page décisions demo (`/cockpit/demo/decisions/page.tsx`)
7. 🔨 Page rapports demo (`/cockpit/demo/rapports/page.tsx`)
8. 🔨 Badge "MODE DÉMO" visible + CTA "Passer en Pro"

**Livrables**:
- Mode demo entièrement fonctionnel
- Narratif immersif, pédagogique
- 0 friction, tout explorable

**Tests**:
- Naviguer dans tous les écrans demo
- Vérifier que données sont cohérentes entre elles
- CTA "Passer en Pro" fonctionne

---

### Phase 3 : Création Projet + IA (Semaine 2)

**Objectif**: Flux de création projet avec IA générative

**Tasks**:
1. 🔨 Page onboarding (`/cockpit/pro/onboarding/page.tsx`)
2. 🔨 Formulaire création projet simple
3. 🔨 API route `/api/ai/generate-project-description`
4. 🔨 API route `/api/ai/identify-risks`
5. 🔨 API route `/api/ai/identify-decisions`
6. 🔨 Intégration OpenAI/Azure OpenAI (`lib/ai/core/openai-client.ts`)
7. 🔨 Server action `createProject` avec génération IA
8. 🔨 Composant `AIGenerationCard` (affichage résultats IA)
9. 🔨 Wizard étapes 2-6 (`/cockpit/pro/projets/[id]/enrichir/*`)

**Livrables**:
- User peut créer un projet en 2 minutes
- IA génère description, objectifs, risques, décisions
- Wizard optionnel fonctionne

**Tests**:
- Créer projet avec contexte minimal → IA génère tout
- Vérifier latence IA < 5s
- Skip wizard, vérifier projet créé quand même

---

### Phase 4 : Dashboard Pro + Vues Projets (Semaine 3)

**Objectif**: Dashboard Pro, liste projets, détail projet

**Tasks**:
1. 🔨 Page dashboard pro (`/cockpit/pro/page.tsx`)
   - KPIs calculés en temps réel
   - Synthèse IA portefeuille
   - Liste projets récents
2. 🔨 Page liste projets (`/cockpit/pro/projets/page.tsx`)
   - Tableau triable/filtrable
   - Vue timeline (optionnel)
3. 🔨 Page détail projet (`/cockpit/pro/projets/[id]/page.tsx`)
   - Vue globale
   - Onglets (Risques, Décisions, Scénarios, Ressources, Rapport)
4. 🔨 Services projets (`lib/services/projects/`)
5. 🔨 Server actions projets (CRUD)

**Livrables**:
- Dashboard pro fonctionnel (vide si 0 projet, rempli sinon)
- Liste projets avec actions (créer, modifier, supprimer)
- Détail projet avec navigation onglets

**Tests**:
- Créer 3 projets, vérifier dashboard se remplit
- Cliquer sur un projet, vérifier détails chargent
- Modifier projet, vérifier changements persistent

---

### Phase 5 : Risques, Décisions, Scénarios (Semaine 3-4)

**Objectif**: Modules complets risques, décisions, scénarios

**Tasks**:
1. 🔨 Tables SQL: `scenarios`, `project_objectives`
2. 🔨 Types TypeScript correspondants
3. 🔨 Pages risques (`/cockpit/pro/risques/*`)
4. 🔨 Pages décisions (`/cockpit/pro/decisions/*`)
5. 🔨 Pages scénarios (`/cockpit/pro/scenarios/*`)
6. 🔨 API route `/api/ai/generate-scenarios`
7. 🔨 Services risques, décisions, scénarios
8. 🔨 Server actions CRUD

**Livrables**:
- User peut gérer risques, décisions, scénarios
- IA peut générer scénarios optimiste/central/pessimiste
- Vues globales portefeuille + vues par projet

**Tests**:
- Créer risque manuellement
- Générer scénarios via IA pour un projet
- Créer décision, assigner comité, échéance

---

### Phase 6 : Rapports IA (Semaine 4)

**Objectif**: Génération rapports exécutifs IA

**Tasks**:
1. 🔨 API route `/api/ai/generate-report`
2. 🔨 Page bibliothèque rapports (`/cockpit/pro/rapports/page.tsx`)
3. 🔨 Page nouveau rapport (`/cockpit/pro/rapports/nouveau/page.tsx`)
4. 🔨 Page voir rapport (`/cockpit/pro/rapports/[id]/page.tsx`)
5. 🔨 Export PDF (optionnel, peut être phase 7)
6. 🔨 Service rapports
7. 🔨 Server actions rapports

**Livrables**:
- User peut générer rapport exécutif pour un projet
- Rapport contient: synthèse, statut, risques, décisions, recommandations
- Rapport sauvegardé dans bibliothèque

**Tests**:
- Générer rapport pour un projet
- Vérifier rapport contient toutes les sections
- Sauvegarder rapport, retrouver dans bibliothèque

---

### Phase 7 : AI Chief of Staff (Semaine 5)

**Objectif**: Analyse globale portefeuille par IA

**Tasks**:
1. 🔨 Enrichir `lib/ai-chief-actions.ts` (déjà existant)
2. 🔨 API route `/api/ai/analyze-portfolio`
3. 🔨 Page hub IA (`/cockpit/pro/ia/page.tsx`)
   - Synthèse portefeuille
   - Priorités stratégiques
   - Alertes critiques
   - Opportunités
4. 🔨 Composants cartes insights IA
5. 🔨 Intégration insights dans dashboard

**Livrables**:
- Dashboard affiche insights IA automatiquement
- Hub IA accessible avec vue détaillée
- IA identifie top 5 actions stratégiques

**Tests**:
- Créer 5+ projets avec risques/décisions
- Vérifier IA génère synthèse cohérente
- Vérifier priorités sont pertinentes

---

### Phase 8 : Polish & Optimisations (Semaine 5-6)

**Objectif**: Finitions, performance, UX

**Tasks**:
1. 🔨 Loading states partout (Suspense, Skeleton)
2. 🔨 Error boundaries
3. 🔨 Toasts notifications améliorées
4. 🔨 Animations micro-interactions
5. 🔨 Responsive design (desktop first, mais mobile OK)
6. 🔨 Rate limiting API IA
7. 🔨 Logs & monitoring (table `ai_generations`)
8. 🔨 Documentation utilisateur (`/ressources/documentation`)
9. 🔨 Tests E2E critiques (Playwright)

**Livrables**:
- Cockpit fluide, rapide, sans bugs
- Toutes les pages responsive
- Documentation à jour

**Tests**:
- Tests E2E: Créer projet → Enrichir → Générer rapport
- Tests performance: Temps chargement < 1s
- Tests erreur: Simuler échec OpenAI, vérifier fallback

---

## 📊 RÉCAPITULATIF

### Architecture Finale

```
COCKPIT POWALYZE V3

/cockpit
  /demo         → 🎭 Mode spectaculaire, narratif, pédagogique
  /pro          → 🚀 Mode actionnable, données réelles
    /onboarding → ✨ Premier projet (obligatoire)
    /projets    → 📊 Gestion projets (CRUD + IA)
    /risques    → 🚨 Gestion risques (analyse + IA)
    /decisions  → 🎯 Gestion décisions (comités)
    /scenarios  → 📈 Scénarios (optimiste/central/pessimiste)
    /rapports   → 📄 Rapports exécutifs IA
    /ia         → 🤖 Hub AI Chief of Staff

IA NATIVE PARTOUT:
- Génération description projet
- Identification risques potentiels
- Identification décisions à cadrer
- Génération scénarios
- Génération rapports exécutifs
- Analyse portefeuille
- Recommandations stratégiques

DATA LAYER:
- Supabase (PostgreSQL + RLS)
- Services pattern (lib/services/)
- Server actions (app/*/actions.ts)
- 12 tables SQL (déjà définies + 3 nouvelles)

UX PRINCIPES:
- Zero friction (IA fait le travail)
- Progressive disclosure (minimum → enrichissement)
- Narrative first (pas de données brutes)
- Contextual AI (toujours dispo, jamais imposée)
- Visual health (🟢🟡🔴 partout)
```

### Timeline

- **Semaine 1**: Fondations + Mode Demo
- **Semaine 2-3**: Création projet IA + Dashboard Pro + Vues projets
- **Semaine 3-4**: Risques, Décisions, Scénarios
- **Semaine 4-5**: Rapports IA + AI Chief of Staff
- **Semaine 5-6**: Polish, optimisations, tests

**Total**: 5-6 semaines pour un cockpit complet, moderne, IA-natif.

---

## 🎯 PROCHAINES ACTIONS IMMÉDIATES

1. **Valider cette architecture** avec l'équipe
2. **Créer les nouvelles tables SQL** (scenarios, project_objectives, ai_generations)
3. **Commencer Phase 1** (structure routes + layout)
4. **Tester IA** (vérifier que OpenAI API fonctionne)
5. **Créer données demo** (lib/demo-data.ts)

---

**FIN DE L'ARCHITECTURE**

🚀 Powalyze Cockpit V3 - Built for Excellence
