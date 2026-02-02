# 🏗️ RECONSTRUCTION POWALYZE — PLAN COMPLET

## 🎯 Objectif
Reconstruire Powalyze avec une architecture propre, modulaire, scalable, premium.

## 📊 État actuel
- ❌ Dette technique accumulée
- ❌ Erreurs upsert/onConflict récurrentes
- ❌ Logique dispersée
- ❌ Duplication de code
- ❌ Incohérences Demo/Pro

## ✅ État cible
- ✅ Architecture claire et modulaire
- ✅ CRUD simple sans upsert
- ✅ Séparation stricte Demo/Pro
- ✅ Data layer propre
- ✅ UI/UX premium
- ✅ Zéro dette technique

---

## 📋 PHASE 1 : FONDATIONS (EN COURS)

### 1.1 Architecture
```
powalyze/
├── app/
│   ├── cockpit/
│   │   ├── demo/          # Mode démo (lecture seule)
│   │   └── pro/           # Mode pro (édition complète)
│   └── api/
│       └── v1/            # API publique
├── lib/
│   ├── supabase/          # Clients Supabase
│   ├── data/              # Data layer (CRUD)
│   └── mock/              # Données mockées (demo)
├── components/
│   ├── ui/                # Design system
│   ├── cockpit/           # Composants métier
│   └── layouts/           # Layouts
├── modules/
│   ├── projects/          # Module projets
│   ├── risks/             # Module risques
│   ├── decisions/         # Module décisions
│   ├── resources/         # Module ressources
│   ├── dependencies/      # Module dépendances
│   └── reports/           # Module rapports IA
└── middleware.ts          # Routing Demo/Pro
```

### 1.2 Schéma SQL propre
- ✅ Tables minimales
- ✅ Contraintes simples (PK, FK uniquement)
- ✅ ZÉRO contrainte UNIQUE complexe
- ✅ RLS simple par organization_id

### 1.3 Data Layer propre
- ✅ Fonctions CRUD pures
- ✅ ZÉRO upsert
- ✅ Insert + Update séparés
- ✅ Gestion d'erreurs claire

### 1.4 Middleware Demo/Pro
- ✅ Lecture de profiles.plan
- ✅ Redirection automatique
- ✅ Protection des routes

### 1.5 Types TypeScript
- ✅ Types stricts pour chaque entité
- ✅ Cohérence DB ↔ Frontend

---

## 📋 PHASE 2 : AUTH + PROFILES (APRÈS PHASE 1)

### 2.1 Authentication
- Signup simplifié
- Login simplifié
- Session management
- Protected routes

### 2.2 Profiles & Organizations
- Creation profile automatique
- Assignment organization
- Plan management (demo/pro)

---

## 📋 PHASE 3 : MODULE PROJECTS (APRÈS PHASE 2)

### 3.1 Backend
- CRUD projects propre
- Filtres par organization
- Timeline events
- Status management

### 3.2 Frontend
- Liste projets
- Création projet
- Édition projet
- Vue détail projet
- Tableau de bord projet

---

## 📋 PHASE 4 : MODULES MÉTIER (APRÈS PHASE 3)

### 4.1 Module Risks
- CRUD risks
- Matrice risques
- Priorisation

### 4.2 Module Decisions
- CRUD decisions
- Workflow approbation
- Historique

### 4.3 Module Resources
- CRUD resources
- Allocation
- Charge

### 4.4 Module Dependencies
- CRUD dependencies
- Graphe dépendances
- Analyse chemins critiques

---

## 📋 PHASE 5 : IA + API (APRÈS PHASE 4)

### 5.1 Module IA
- Rapports exécutifs
- Synthèse projets
- Détection risques
- Recommandations

### 5.2 API & Webhooks
- API Keys management
- Webhooks configuration
- Logs & monitoring
- Rate limiting

---

## 🎯 Principes directeurs

### ✅ TOUJOURS
- Code simple et lisible
- Types stricts
- Gestion d'erreurs explicite
- Tests de base
- Documentation inline

### ❌ JAMAIS
- .upsert() avec onConflict manuel
- Logique métier dans les composants
- Duplication de code
- Magic numbers
- Variables globales

---

## 🚀 Déploiement

### Checklist avant chaque phase
- [ ] Tests locaux OK
- [ ] Build Vercel OK
- [ ] Migration SQL appliquée
- [ ] Données de démo OK
- [ ] Documentation à jour

---

## 📝 Notes

Ce plan sera ajusté au fur et à mesure de l'avancement.
Chaque phase sera validée avant de passer à la suivante.
