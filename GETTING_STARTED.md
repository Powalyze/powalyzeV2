# 🚀 POWALYZE — GUIDE DE DÉMARRAGE

## Mode Démo vs Mode Production

Powalyze fonctionne en **2 modes** :

### 🔵 Mode DEMO (par défaut)
- **Aucune configuration requise**
- Données de démonstration premium intégrées
- Idéal pour tester, démontrer, développer
- IA narrative avec fallback si API non configurée
- Badge visuel "Mode Démo" affiché

```bash
# .env.local
NEXT_PUBLIC_POWALYZE_MODE=demo
```

### 🟢 Mode PRODUCTION
- Connexion à Supabase requise
- IA narrative Azure OpenAI ou OpenAI
- Données réelles persistantes
- Multi-tenancy avec organization_id

```bash
# .env.local
NEXT_PUBLIC_POWALYZE_MODE=prod
```

---

## 🎯 Démarrage Rapide (Mode Démo)

```bash
# 1. Cloner et installer
git clone https://github.com/votre-repo/powalyze
cd powalyze
npm install

# 2. Créer .env.local (mode démo par défaut)
cp .env.example .env.local

# 3. Lancer
npm run dev
```

➡️ Accéder au cockpit : http://localhost:3000/cockpit-real

Aucune base de données requise ! Le mode démo contient :
- 5 projets réalistes
- 5 risques critiques
- 4 décisions en attente
- 7 actions prioritaires
- 3 comités

---

## 🔧 Configuration Production

### 1️⃣ Créer un projet Supabase

```bash
# Aller sur https://supabase.com
# Créer un nouveau projet
# Copier l'URL et les clés API
```

### 2️⃣ Exécuter le schéma SQL

Dans Supabase SQL Editor :

```sql
-- 1. Exécuter database/schema.sql
-- 2. Exécuter database/seed-cockpit.sql (données démo)
```

### 3️⃣ Configurer les variables d'environnement

```bash
# .env.local
NEXT_PUBLIC_POWALYZE_MODE=prod

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OpenAI (choisir une option)
# Option 1 : OpenAI standard
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Option 2 : Azure OpenAI
AZURE_OPENAI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AZURE_OPENAI_ENDPOINT=https://xxxxx.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Config organisation
NEXT_PUBLIC_ORGANIZATION_ID=550e8400-e29b-41d4-a716-446655440000
POWALYZE_ORG_CONTEXT="Groupe XYZ, portefeuille de programmes stratégiques."
```

### 4️⃣ Lancer

```bash
npm run dev
```

---

## 📊 Données de Démonstration

### Mode DEMO Premium inclut :

**5 Projets stratégiques**
- Programme Transformation Digitale (YELLOW, HIGH) - 56% complete
- Migration ERP Groupe (RED, CRITICAL) - 78% complete
- Programme ESG & Compliance (GREEN, MEDIUM) - 40% complete
- Refonte Plateforme E-commerce (YELLOW, HIGH) - 34% complete
- Consolidation Datacenters (GREEN, MEDIUM) - 52% complete

**5 Risques critiques**
- Retard migration filiales (Score: 60)
- Surcharge équipes clés (Score: 45.5)
- Dépendance cloud (Score: 30)
- Qualité données ERP (Score: 72.25)
- Évolution réglementaire ESG (Score: 30)

**4 Décisions en attente**
- Arbitrage budgétaire ERP (+1.2M€)
- Priorisation chantiers Transformation
- GO/NOGO Phase 2 E-commerce
- Validation périmètre ESG 2025

**7 Actions prioritaires**
- 2 CRITICAL (dont 1 en retard)
- 3 HIGH
- 2 MEDIUM
- Statuts : TODO, IN_PROGRESS, BLOCKED

**3 Comités**
- COMEX (mensuel)
- Comité Transformation (bimensuel)
- Comité Investissements (mensuel)

---

## 🤖 IA Narrative

### Configuration OpenAI

```bash
# Option 1 : OpenAI standard (recommandé pour démarrer)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Configuration Azure OpenAI

```bash
AZURE_OPENAI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

### Fonctionnalités IA

1. **Synthèse Exécutive** (`/api/ai/executive-summary`)
   - Résumé global du portfolio
   - Points d'attention critiques
   - Risques majeurs
   - Arbitrages nécessaires
   - Recommandations actionnables

2. **Préparation de Comité** (`/api/ai/committee-brief`)
   - Objet du comité
   - Dossiers prioritaires
   - Décisions attendues
   - Points de tension
   - Recommandations sponsor

3. **Actions Prioritaires** (via DataProvider)
   - Synthèse globale
   - Actions critiques
   - Actions en retard
   - Recommandations de pilotage

### Mode Fallback

Si l'IA n'est pas configurée, les API retournent des réponses démo structurées.

---

## 🎨 Personnalisation

### Adapter les données DEMO

Éditer `lib/dataProvider.ts` :

```typescript
export const demoProjects: Project[] = [
  {
    id: 'p1',
    name: 'Votre Projet',
    status: 'ACTIVE',
    rag_status: 'GREEN',
    criticality: 'HIGH',
    // ... autres champs
  },
];
```

### Adapter les prompts IA

Éditer `lib/ai.ts` :

```typescript
const SYSTEM_PROMPT_BASE = `Tu es l'IA narrative de Powalyze...`;
```

### Thème visuel

Modifier `tailwind.config.ts` et `styles/theme.css`

---

## 📁 Structure du Projet

```
powalyze/
├── app/
│   ├── cockpit-real/          # Cockpit principal
│   ├── committee-prep/        # Préparation comités
│   └── api/
│       ├── ai/                # Routes IA
│       └── cockpit/           # Routes CRUD
├── components/
│   ├── cockpit/               # Composants cockpit
│   ├── DemoBadge.tsx          # Badge mode démo
│   └── ui/                    # Composants UI
├── lib/
│   ├── dataProvider.ts        # Switch DEMO/PROD + seed
│   ├── ai.ts                  # Helpers IA narrative
│   ├── supabase.ts            # Client Supabase
│   └── utils.ts               # Utilitaires
├── database/
│   ├── schema.sql             # Schéma PostgreSQL
│   └── seed-cockpit.sql       # Données seed
└── types/
    └── cockpit.ts             # Types TypeScript
```

---

## 🚀 Déploiement Vercel

```bash
# 1. Connecter Vercel
vercel login

# 2. Configurer les variables d'environnement
vercel env add NEXT_PUBLIC_POWALYZE_MODE
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY

# 3. Déployer
vercel deploy --prod
```

---

## 🆘 Support

- Documentation : `/docs`
- Issues : GitHub Issues
- Email : support@powalyze.com

---

## 📝 Checklist Go-Live

- [ ] Mode PROD configuré
- [ ] Supabase projet créé
- [ ] Schéma SQL exécuté
- [ ] Seed data chargé
- [ ] Variables d'environnement configurées
- [ ] OpenAI/Azure OpenAI configuré
- [ ] Build réussi (`npm run build`)
- [ ] Tests cockpit fonctionnels
- [ ] IA narrative testée
- [ ] Déploiement Vercel effectué

---

**Powalyze — Cockpit Exécutif Suisse · Gouvernance IA**
