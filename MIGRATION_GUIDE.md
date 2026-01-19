# 🚀 POWALYZE — GUIDE DE MIGRATION DEMO → PROD

## Vue d'ensemble

Ce guide vous accompagne étape par étape pour migrer votre cockpit Powalyze du **mode DEMO** (données de démonstration) vers le **mode PRODUCTION** (données réelles avec Supabase et IA).

---

## 📋 Checklist de Migration

### Phase 1: Préparation (15 min)

- [ ] **Vérifier le mode actuel**
  ```bash
  # Vérifier .env.local
  cat .env.local | grep POWALYZE_MODE
  # Si absent ou =demo, vous êtes en mode DEMO
  ```

- [ ] **Sauvegarder la configuration actuelle**
  ```bash
  cp .env.local .env.local.backup
  ```

- [ ] **Vérifier que le mode DEMO fonctionne**
  ```bash
  npm run dev
  # Accéder à http://localhost:3000/cockpit-real
  # Vérifier que le badge "Mode Démo" est affiché
  ```

---

### Phase 2: Configuration Supabase (20 min)

#### 2.1 Créer un projet Supabase

1. Aller sur https://supabase.com
2. Cliquer sur "New Project"
3. Choisir un nom: `powalyze-prod`
4. Choisir une région proche de vos utilisateurs
5. Choisir un mot de passe database sécurisé
6. Attendre la création du projet (2-3 min)

#### 2.2 Récupérer les clés API

1. Dans le projet Supabase, aller dans **Settings** > **API**
2. Copier les valeurs suivantes:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Clé publique (commence par `eyJ...`)
   - **service_role key**: Clé privée (commence par `eyJ...`)

#### 2.3 Exécuter le schéma SQL

1. Dans Supabase, aller dans **SQL Editor**
2. Créer une nouvelle query
3. Copier-coller le contenu de `database/schema.sql`
4. Exécuter (Run)
5. Vérifier qu'il n'y a pas d'erreurs

#### 2.4 Charger les données de seed (optionnel)

1. Dans SQL Editor, créer une nouvelle query
2. Copier-coller le contenu de `database/seed-cockpit.sql`
3. Exécuter (Run)
4. Vérifier dans **Table Editor** que les données sont présentes

#### 2.5 Configurer Row Level Security (RLS)

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Politique pour service_role (bypass RLS pour l'API)
-- Les politiques utilisateur seront ajoutées plus tard avec l'authentification
```

---

### Phase 3: Configuration OpenAI (10 min)

#### Option 1: OpenAI Standard (recommandé)

1. Aller sur https://platform.openai.com
2. Créer un compte ou se connecter
3. Aller dans **API Keys**
4. Créer une nouvelle clé: "Powalyze Production"
5. Copier la clé (commence par `sk-proj-...`)
6. ⚠️ **Conserver la clé en lieu sûr, elle ne sera plus affichée**

#### Option 2: Azure OpenAI

1. Créer une ressource Azure OpenAI
2. Déployer un modèle GPT-4 ou GPT-4o
3. Récupérer:
   - Endpoint: `https://your-resource.openai.azure.com`
   - API Key
   - Deployment Name: `gpt-4`

---

### Phase 4: Configuration .env.local (5 min)

Éditer `.env.local`:

```bash
# ============================================
# POWALYZE MODE - PASSER EN PRODUCTION
# ============================================
NEXT_PUBLIC_POWALYZE_MODE=prod

# ============================================
# SUPABASE (requis en mode prod)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# OPENAI (requis pour IA narrative)
# ============================================
# Option 1: OpenAI standard
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Option 2: Azure OpenAI (commenter Option 1 si utilisé)
# AZURE_OPENAI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
# AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# ============================================
# POWALYZE CONFIG
# ============================================
NEXT_PUBLIC_ORGANIZATION_ID=550e8400-e29b-41d4-a716-446655440000
POWALYZE_ORG_CONTEXT="Votre organisation - Portfolio de programmes stratégiques, gouvernance exécutive."
```

#### Obtenir l'Organization ID

Si vous avez chargé les seed data:
```sql
-- Dans Supabase SQL Editor
SELECT id, name FROM organizations;
-- Copier l'UUID de votre organisation
```

Sinon, créer une organisation:
```sql
INSERT INTO organizations (name, domain, context, is_active)
VALUES (
  'Votre Organisation',
  'votre-domaine.com',
  'Description de votre organisation',
  true
)
RETURNING id;
```

---

### Phase 5: Tests de Migration (10 min)

#### 5.1 Build de vérification

```bash
npm run build
# Doit compiler sans erreurs
```

#### 5.2 Test local

```bash
npm run dev
```

#### 5.3 Vérifications

1. **Badge démo disparu**: Le badge "Mode Démo" ne doit plus être visible
2. **Données Supabase**: 
   - Aller sur `/cockpit-real`
   - Vérifier que les projets affichés sont ceux de Supabase
3. **IA Narrative**:
   - Aller sur `/ai-test`
   - Tester "Synthèse Exécutive"
   - Vérifier que l'IA génère un texte personnalisé
4. **Préparation de Comité**:
   - Aller sur `/committee-prep`
   - Sélectionner un comité
   - Générer un brief
   - Vérifier le contenu

---

### Phase 6: Ajout de Données Réelles (temps variable)

#### 6.1 Via SQL Editor

```sql
-- Créer un projet
INSERT INTO projects (
  organization_id,
  name,
  description,
  sponsor,
  pm,
  budget,
  actual_cost,
  status,
  rag_status,
  criticality,
  start_date,
  end_date,
  completion_percentage,
  delay_probability
) VALUES (
  'votre-org-id',
  'Nom du Projet',
  'Description',
  'Sponsor',
  'Chef de Projet',
  1000000,
  450000,
  'ACTIVE',
  'GREEN',
  'HIGH',
  '2024-01-01',
  '2025-12-31',
  45,
  15
);
```

#### 6.2 Via l'interface (à venir)

Module CRUD en cours de développement.

---

### Phase 7: Déploiement Vercel (10 min)

#### 7.1 Connexion Vercel

```bash
vercel login
```

#### 7.2 Configuration des variables

```bash
vercel env add NEXT_PUBLIC_POWALYZE_MODE
# Valeur: prod

vercel env add NEXT_PUBLIC_SUPABASE_URL
# Valeur: votre URL Supabase

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Valeur: votre clé anon

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Valeur: votre clé service_role

vercel env add OPENAI_API_KEY
# Valeur: votre clé OpenAI

vercel env add NEXT_PUBLIC_ORGANIZATION_ID
# Valeur: votre UUID organisation

vercel env add POWALYZE_ORG_CONTEXT
# Valeur: description de votre organisation
```

#### 7.3 Déploiement

```bash
vercel deploy --prod
```

#### 7.4 Vérification production

1. Accéder à l'URL Vercel fournie
2. Vérifier que le cockpit fonctionne
3. Tester l'IA narrative
4. Vérifier les données Supabase

---

## 🔄 Retour en Mode DEMO

Si vous devez revenir temporairement en mode démo:

```bash
# .env.local
NEXT_PUBLIC_POWALYZE_MODE=demo
```

Puis:
```bash
npm run dev
```

Le badge "Mode Démo" réapparaîtra et les données de démonstration seront utilisées.

---

## 🚨 Troubleshooting

### Problème: "Missing Supabase environment variables"

**Solution**: Vérifier que les 3 variables Supabase sont définies dans `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Problème: "OpenAI API error"

**Solutions**:
1. Vérifier que la clé API est correcte
2. Vérifier que vous avez des crédits OpenAI
3. Vérifier les quotas API

### Problème: "No data displayed"

**Solutions**:
1. Vérifier que le schéma SQL a été exécuté
2. Vérifier que l'organization_id dans `.env.local` existe dans Supabase
3. Vérifier les logs Supabase pour les erreurs

### Problème: Build errors après migration

**Solution**:
```bash
rm -rf .next
npm run build
```

---

## 📊 Métriques de Succès

Une migration réussie doit avoir:

- ✅ Build sans erreurs
- ✅ Badge démo invisible
- ✅ Données Supabase affichées
- ✅ IA narrative fonctionnelle
- ✅ Tests IA passants (`/ai-test`)
- ✅ Génération de briefs comité
- ✅ Performance < 3s au chargement

---

## 🆘 Support

- **Documentation**: `/GETTING_STARTED.md`
- **Tests IA**: http://localhost:3000/ai-test
- **Issues**: GitHub Issues
- **Email**: support@powalyze.com

---

## 📝 Checklist Finale

Avant de considérer la migration terminée:

- [ ] Mode PROD activé
- [ ] Supabase configuré et testé
- [ ] OpenAI configuré et testé
- [ ] Schéma SQL exécuté
- [ ] Seed data chargé (optionnel)
- [ ] Organization ID configuré
- [ ] Build réussi
- [ ] Tests locaux passants
- [ ] Badge démo invisible
- [ ] IA narrative testée
- [ ] Déploiement Vercel réussi
- [ ] Tests production passants
- [ ] Documentation équipe mise à jour

---

**Félicitations ! Votre cockpit Powalyze est maintenant en mode PRODUCTION. 🎉**

