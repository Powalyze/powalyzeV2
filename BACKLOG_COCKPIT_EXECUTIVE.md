# BACKLOG COMPLET - COCKPIT EXÉCUTIF POWALYZE

Date: 2026-02-04
Version: 1.0

## Épics & User Stories

### Épic A – Connexion des canaux et connecteurs

**US-A1 – Connecter un fichier Excel/CSV**
- En tant que responsable reporting
- Je veux uploader un fichier Excel/CSV et le mapper aux champs Powalyze
- Afin de alimenter automatiquement le cockpit sans ressaisir les données

**US-A2 – Connecter un CRM / ERP / outil projet**
- En tant que DSI / PMO
- Je veux connecter mon CRM/ERP/Jira/Monday via API
- Afin de synchroniser automatiquement projets, budgets, risques et décisions

**US-A3 – Planifier le rafraîchissement**
- En tant que responsable gouvernance
- Je veux définir une fréquence (horaire, quotidienne, hebdo, mensuelle)
- Afin de garantir que les données du cockpit sont toujours à jour

**US-A4 – Voir l'état des connecteurs**
- En tant que admin
- Je veux voir quels connecteurs sont actifs, en erreur, ou en attente
- Afin de sécuriser la fiabilité du reporting

---

### Épic B – Cockpit exécutif vivant

**US-B1 – Voir la synthèse exécutive**
- Voir en un écran : nb projets, % alignement, saturation IT, dépassement budget, décisions en attente, risques critiques

**US-B2 – Filtrer par BU / pays / statut**
- Filtrer tous les blocs du cockpit par BU, pays, statut projet

**US-B3 – Voir les décisions en attente**
- Lister les décisions en attente avec impact, priorité, délai

**US-B4 – Voir les anomalies**
- Visualiser les anomalies détectées (budget, capacité, planning)

---

### Épic C – IA Narrateur & décisions

**US-C1 – Générer un résumé exécutif**
- En un clic, générer un texte lisible en comité

**US-C2 – Aide à la décision**
- Pour une décision donnée, obtenir un scoring des options + justification

**US-C3 – Simulation de rééquilibrage**
- Proposer une réallocation des capacités pour réduire la saturation

---

### Épic D – Automatisation du reporting

**US-D1 – Générer automatiquement un rapport mensuel**
**US-D2 – Envoyer automatiquement le rapport aux parties prenantes**
**US-D3 – Consulter l'historique des rapports**

---

## Plan d'implémentation (7 jours)

### Jour 1 – Fondations données
✅ Créer les tables Supabase (schema-cockpit-executive.sql)
✅ Créer la vue executive_overview
- Insérer un jeu de données de test réaliste (10–20 projets, décisions, risques)

### Jour 2 – API Cockpit
✅ /api/cockpit/overview
✅ /api/cockpit/projects
✅ /api/cockpit/decisions
✅ /api/cockpit/anomalies
✅ /api/cockpit/timeline
- Tester avec Postman / Thunder Client

### Jour 3 – Front cockpit (données réelles)
✅ Créer useCockpitData
✅ Brancher les blocs : Portfolio, Décisions
- Brancher Anomalies, Timeline
- Remplacer toutes les valeurs statiques par des données réelles

### Jour 4 – Connecteurs (fichiers + 1 SaaS)
- Implémenter /api/connectors/file
- Créer une page "Connecteurs" simple (upload fichier → import projets)
- Implémenter un connecteur SaaS cible (ex : Jira ou Monday) en mode POC

### Jour 5 – IA (résumé + décisions)
- Implémenter /api/ai/summary
- Implémenter /api/ai/decision-support
- Brancher le bloc "Résumé exécutif IA"
- Brancher le clic sur une décision → recommandation IA

### Jour 6 – Simulation & anomalies
- Implémenter /api/ai/rebalance
- Implémenter /api/ai/anomalies (ou logique déterministe au début)
- Brancher le bloc "Capacité & saturation" + "Radar des anomalies"

### Jour 7 – Automatisation reporting
- Créer table reports ✅
- Créer job planifié (cron / scheduler) pour rafraîchir les données
- Créer envoi email simple avec lien cockpit + résumé

---

## Fichiers créés

### Database
- schema-cockpit-executive.sql ✅

### API Routes
- app/api/cockpit/overview/route.ts ✅
- app/api/cockpit/projects/route.ts ✅
- app/api/cockpit/decisions/route.ts ✅
- app/api/cockpit/anomalies/route.ts ✅
- app/api/cockpit/timeline/route.ts ✅

### Hooks
- lib/hooks/useCockpitData.ts ✅

### Components
- components/cockpit/PortfolioCard.tsx ✅
- components/cockpit/DecisionsCard.tsx ✅

---

## Prochaines étapes

1. Appliquer le schéma SQL sur Supabase
2. Créer des données de test
3. Tester les API routes
4. Créer la page cockpit exécutif complète
5. Implémenter les connecteurs
6. Intégrer l'IA OpenAI pour narratifs
