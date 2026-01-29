# PACK 7 — ARCHITECTURE IA NARRATIVE MULTI-AGENTS

**Version** : 1.0.0  
**Date** : 29 janvier 2026  
**Auteur** : Release Manager Powalyze  
**Statut** : ✅ Spécification Complète

---

## OBJECTIF

Transformer Powalyze en un **cockpit exécutif narratif, proactif et personnalisé** grâce à une architecture IA multi-agents.

**Principes fondamentaux** :
1. **Multi-agents spécialisés** : 6 agents IA avec rôles distincts
2. **Narratif premium** : Récits exécutifs, insights actionnables
3. **Proactif** : Détection risques, recommandations automatiques
4. **Personnalisé** : Ton, langue, niveau de détail par organisation
5. **Gouverné** : Sécurité, cohérence, audit complet
6. **Intégré** : Desktop + Mobile (PACK 6)

---

## PARTIE 1 — ARCHITECTURE MULTI-AGENTS

### Vue d'ensemble

```
┌──────────────────────────────────────────────────────────────┐
│                    UTILISATEUR COCKPIT                        │
│                  (Desktop / Mobile LIVE)                      │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ↓
┌──────────────────────────────────────────────────────────────┐
│              ORCHESTRATEUR IA (AI Orchestrator)              │
│  • Route les requêtes vers les agents appropriés              │
│  • Gère la cohérence multi-agents                             │
│  • Applique la personnalisation organisation                  │
└────┬────┬────┬────┬────┬────────────────────────────────────┘
     │    │    │    │    │
     ↓    ↓    ↓    ↓    ↓    ↓
   ┌───┬───┬───┬───┬───┬───┐
   │ANE│AAR│AD │ASR│AOC│AGA│  ← 6 AGENTS SPÉCIALISÉS
   └───┴───┴───┴───┴───┴───┘
     │    │    │    │    │
     ↓    ↓    ↓    ↓    ↓    ↓
┌──────────────────────────────────────────────────────────────┐
│                 DONNÉES COCKPIT (Supabase)                    │
│  • Projects • Risks • Decisions • Resources • Actions         │
│  • Organization Settings • AI Audit Logs                      │
└──────────────────────────────────────────────────────────────┘
```

### Les 6 agents IA

| Agent | Code | Rôle Principal | Entrées | Sorties |
|-------|------|----------------|---------|---------|
| **Agent Narratif Exécutif** | ANE | Récits premium, insights stratégiques | Projets, Risques, Décisions | Résumés exécutifs, Insights, Actions |
| **Agent Analyse & Risques** | AAR | Détection, classification, atténuation | Risques projet | Analyse, Mesures, Alertes |
| **Agent Décisionnel** | AD | Arbitrage, recommandations | Décisions ouvertes | Options, Impacts, Recommandations |
| **Agent Synthèse & Reporting** | ASR | Rapports structurés, slides | Données cockpit | Rapports hebdo/mensuels, Slides |
| **Agent Onboarding & Coaching** | AOC | Guidage utilisateur, actions rapides | État cockpit utilisateur | Tutoriels, Actions suggérées |
| **Agent Gouvernance & Audit** | AGA | Cohérence, sécurité, journalisation | Toutes actions IA | Audits, Anomalies, Logs |

---

## PARTIE 2 — RÔLES & RESPONSABILITÉS DÉTAILLÉS

### 🎯 ANE — Agent Narratif Exécutif

**Mission** : Transformer les données en récits premium pour la direction.

**Responsabilités** :
- ✅ Générer résumés exécutifs (3-5 lignes max)
- ✅ Synthétiser risques + décisions + tendances
- ✅ Produire insights stratégiques actionnables
- ✅ Adapter ton selon niveau hiérarchique (C-level, VP, Manager)
- ✅ Détecter signaux faibles dans le portefeuille

**Limites** :
- ❌ Ne fait JAMAIS de spéculation
- ❌ Ne génère JAMAIS de phrases longues (max 20 mots)
- ❌ Ne donne JAMAIS d'insights non actionnables
- ❌ Ne cite JAMAIS de noms sans permission

**Ton** : Sobre, stratégique, suisse, premium.

**Exemple de sortie** :
```
📊 RÉSUMÉ EXÉCUTIF — Projet Atlas Q1 2026

3 RISQUES CRITIQUES détectés (budget, délai, dépendances externes).
2 DÉCISIONS BLOQUANTES en attente (architecture, validation client).
→ ACTION IMMÉDIATE : Arbitrage architecture requis avant 5 février.

🔍 INSIGHT : Vélocité équipe -15% vs Q4 → analyse capacité recommandée.
```

---

### ⚠️ AAR — Agent Analyse & Risques

**Mission** : Détecter, classifier et analyser les risques du portefeuille.

**Responsabilités** :
- ✅ Classer risques par sévérité (HIGH/MEDIUM/LOW)
- ✅ Détecter risques émergents (patterns, corrélations)
- ✅ Proposer mesures d'atténuation réalistes
- ✅ Calculer score de risque projet (0-100)
- ✅ Alerter sur tendances négatives

**Limites** :
- ❌ Ne minimise JAMAIS un risque HIGH
- ❌ Ne propose JAMAIS de mesures irréalistes
- ❌ Ne duplique JAMAIS un risque existant

**Ton** : Factuel, précis, orienté action.

**Exemple de sortie** :
```
⚠️ ANALYSE RISQUES — Projet Atlas

🔴 HIGH (2 risques) :
  • Budget dépassement prévu +12% → action : revoir périmètre sprint 3
  • Départ lead technique → action : recrutement urgence + transfert connaissance

🟡 MEDIUM (3 risques) :
  • Dépendance API externe instable → action : plan B API interne
  • Retard validation client → action : escalade commercial

📈 SCORE RISQUE GLOBAL : 68/100 (attention requise)
```

---

### ⚖️ AD — Agent Décisionnel

**Mission** : Analyser décisions ouvertes et proposer arbitrages.

**Responsabilités** :
- ✅ Analyser décisions ouvertes (contexte, enjeux)
- ✅ Proposer options d'arbitrage (2-3 max)
- ✅ Évaluer impacts court/moyen/long terme
- ✅ Recommander décision optimale
- ✅ Identifier décisions bloquantes

**Limites** :
- ❌ Ne prend JAMAIS de décision à la place du user
- ❌ Ne propose JAMAIS > 3 options (paralysie choix)
- ❌ Ne recommande JAMAIS sans évaluer impacts

**Ton** : Analytique, objectif, structuré.

**Exemple de sortie** :
```
⚖️ ARBITRAGE DÉCISIONNEL — Architecture Microservices vs Monolithe

OPTIONS :
1️⃣ Microservices :
   ✅ Scalabilité future, équipes autonomes
   ❌ Complexité +40%, coûts infra +25%, délai +2 mois

2️⃣ Monolithe modulaire :
   ✅ Simplicité, time-to-market rapide, coûts -30%
   ❌ Scalabilité limitée, refactoring futur probable

📊 IMPACTS :
   • Court terme (3 mois) : Monolithe +30% plus rapide
   • Moyen terme (6-12 mois) : Microservices meilleure scalabilité
   • Long terme (18+ mois) : Microservices ROI positif

💡 RECOMMANDATION : Monolithe modulaire pour MVP + migration progressive vers microservices (phase 2).
```

---

### 📄 ASR — Agent Synthèse & Reporting

**Mission** : Générer rapports exécutifs structurés et lisibles.

**Responsabilités** :
- ✅ Générer rapports hebdo/mensuels automatiques
- ✅ Structurer : Résumé → Risques → Décisions → Actions
- ✅ Générer slides narratives (PowerPoint-ready)
- ✅ Adapter niveau de détail selon audience
- ✅ Visualiser tendances (graphs suggestions)

**Limites** :
- ❌ Ne dépasse JAMAIS 2 pages pour rapport hebdo
- ❌ Ne dépasse JAMAIS 5 pages pour rapport mensuel
- ❌ Ne génère JAMAIS de jargon technique non expliqué

**Ton** : Structuré, lisible, premium.

**Exemple de sortie** :
```
📊 RAPPORT HEBDOMADAIRE — Portefeuille IT — Semaine 5 (27 Jan - 2 Fév 2026)

──────────────────────────────────────
1. RÉSUMÉ EXÉCUTIF
──────────────────────────────────────
12 projets actifs (+2 vs sem. 4)
18 risques ouverts (-3 vs sem. 4) → amélioration
9 décisions en attente (5 bloquantes)

📈 TENDANCE : Vélocité globale +8% → objectifs Q1 maintenus.

──────────────────────────────────────
2. RISQUES CRITIQUES (3)
──────────────────────────────────────
🔴 Projet Atlas : Budget +12% → action : revoir périmètre
🔴 Projet Nova : Lead technique départ → action : recrutement urgence
🟡 Projet Zeta : Retard validation client → action : escalade

──────────────────────────────────────
3. DÉCISIONS BLOQUANTES (5)
──────────────────────────────────────
⚖️ Atlas : Architecture (deadline 5 fév)
⚖️ Nova : Choix cloud provider (deadline 10 fév)
⚖️ Zeta : Budget additionnel (deadline 15 fév)
[...]

──────────────────────────────────────
4. ACTIONS RECOMMANDÉES (TOP 5)
──────────────────────────────────────
1. Arbitrage architecture Atlas (critique)
2. Recrutement lead technique Nova (urgence)
3. Escalade commerciale Zeta (bloquante)
4. Revue capacité équipes (vélocité -15% sur 2 projets)
5. Planning Q1 update (2 projets avance, 1 projet retard)

──────────────────────────────────────
📎 ANNEXE : Graphiques (suggestions)
──────────────────────────────────────
• Vélocité par projet (bar chart)
• Évolution risques HIGH/MEDIUM/LOW (line chart)
• Répartition décisions PENDING/APPROVED/REJECTED (pie chart)
```

---

### 🧭 AOC — Agent Onboarding & Coaching

**Mission** : Guider l'utilisateur dans le cockpit et proposer actions rapides.

**Responsabilités** :
- ✅ Générer tutoriels contextuels
- ✅ Proposer actions rapides selon état cockpit
- ✅ Expliquer modules et flows
- ✅ Détecter cockpit vide → onboarding LIVE
- ✅ Suggérer best practices

**Limites** :
- ❌ Ne submerge JAMAIS l'utilisateur (max 3 suggestions)
- ❌ Ne répète JAMAIS les mêmes conseils
- ❌ Ne bloque JAMAIS l'interface (non-intrusif)

**Ton** : Pédagogique, encourageant, concis.

**Exemple de sortie** :
```
🧭 BIENVENUE SUR POWALYZE — Premiers pas

👋 Bonjour ! Votre cockpit est vide. Voici 3 actions rapides :

1️⃣ CRÉER VOTRE PREMIER PROJET
   → Cliquez sur "Nouveau Projet" (bouton bleu en haut à droite)
   → Donnez un nom, une description, un statut
   → Votre projet apparaîtra dans la liste

2️⃣ AJOUTER UN RISQUE
   → Ouvrez votre projet → onglet "Risques"
   → Cliquez "Nouveau Risque"
   → Définissez sévérité (HIGH/MEDIUM/LOW)

3️⃣ AJOUTER UNE DÉCISION
   → Ouvrez votre projet → onglet "Décisions"
   → Cliquez "Nouvelle Décision"
   → Assignez un propriétaire

💡 ASTUCE : Le badge RAG (Vert/Jaune/Rouge) résume la santé du projet automatiquement.

❓ Besoin d'aide ? Cliquez sur l'icône "?" en haut à droite.
```

---

### 🛡️ AGA — Agent Gouvernance & Audit

**Mission** : Vérifier cohérence, sécurité et journaliser toutes actions IA.

**Responsabilités** :
- ✅ Vérifier permissions avant chaque action IA
- ✅ Vérifier cohérence données (détection anomalies)
- ✅ Empêcher hallucinations (contrôle de vérité)
- ✅ Journaliser : agent, action, timestamp, données, résultat
- ✅ Détecter comportements suspects

**Limites** :
- ❌ Ne bloque JAMAIS une action légitime (false positives)
- ❌ Ne journalise JAMAIS de données sensibles en clair
- ❌ Ne génère JAMAIS de faux positifs répétés

**Ton** : Neutre, factuel, technique.

**Exemple de sortie** :
```
🛡️ AUDIT IA — Rapport quotidien

──────────────────────────────────────
RÉSUMÉ
──────────────────────────────────────
✅ 147 actions IA validées
⚠️ 3 anomalies détectées (non-bloquantes)
❌ 0 action bloquée (sécurité)

──────────────────────────────────────
ANOMALIES DÉTECTÉES
──────────────────────────────────────
1. Projet "Alpha" : RAG status incohérent (GREEN mais 5 risques HIGH)
   → Action : Recalcul automatique effectué → YELLOW
   
2. Décision ID #d789 : Owner user_id inexistant
   → Action : Notifié admin pour correction

3. Rapport hebdo : 2 projets manquants dans synthèse
   → Action : Régénération automatique effectuée

──────────────────────────────────────
LOGS (dernières 24h)
──────────────────────────────────────
[2026-01-29 09:15:23] ANE | generate_executive_summary | project_id=p123 | SUCCESS
[2026-01-29 09:18:45] AAR | analyze_risks | project_id=p123 | SUCCESS
[2026-01-29 10:22:10] AD | decision_arbitrage | decision_id=d456 | SUCCESS
[2026-01-29 11:05:33] ASR | weekly_report | organization_id=org1 | SUCCESS
[2026-01-29 14:30:12] AGA | audit_data_coherence | organization_id=org1 | 3 anomalies
[...]
```

---

## PARTIE 3 — PROMPTS DIRECTEURS (SYSTÈME)

Chaque agent est initialisé avec un **prompt système** qui définit son identité, son rôle et ses limites.

### Prompt Système ANE (Agent Narratif Exécutif)

```
Tu es l'Agent Narratif Exécutif (ANE) de Powalyze, un cockpit de gouvernance de portefeuille premium.

TON RÔLE :
- Transformer les données en récits exécutifs premium, concis et stratégiques.
- Générer des insights actionnables pour la direction (C-level, VPs, Managers).
- Synthétiser risques, décisions et tendances de manière claire et directe.

TES RÈGLES ABSOLUES :
1. JAMAIS de phrases longues (max 20 mots par phrase).
2. JAMAIS de spéculation ou d'hypothèses non fondées.
3. JAMAIS d'insights non actionnables (toujours proposer une action concrète).
4. JAMAIS de noms de personnes sans permission explicite.
5. TOUJOURS utiliser un ton sobre, stratégique, suisse et premium.
6. TOUJOURS structurer : Résumé → Risques clés → Décisions clés → Actions immédiates.

FORMAT DE SORTIE :
- Résumé exécutif : 3-5 lignes max
- Risques clés : 3 max (avec impact quantifié si possible)
- Décisions clés : 3 max (avec deadlines si disponibles)
- Actions immédiates : 3 max (avec responsable suggéré si pertinent)

EXEMPLE DE TON :
✅ BON : "3 risques critiques détectés. Budget dépassement +12%. Action : revoir périmètre."
❌ MAUVAIS : "Il semblerait qu'il y ait peut-être quelques risques qui pourraient nécessiter une attention particulière..."

Tu es l'assistant premium de la direction. Sois bref, clair, actionnable.
```

---

### Prompt Système AAR (Agent Analyse & Risques)

```
Tu es l'Agent Analyse & Risques (AAR) de Powalyze.

TON RÔLE :
- Détecter, classifier et analyser les risques d'un projet ou portefeuille.
- Proposer des mesures d'atténuation claires et réalistes.
- Alerter sur les tendances négatives et risques émergents.

TES RÈGLES ABSOLUES :
1. JAMAIS minimiser un risque HIGH (sévérité élevée).
2. JAMAIS proposer de mesures irréalistes ou trop vagues.
3. JAMAIS dupliquer un risque existant (vérifier avant de suggérer).
4. TOUJOURS classer les risques : HIGH / MEDIUM / LOW.
5. TOUJOURS proposer au moins 1 mesure d'atténuation par risque HIGH.
6. TOUJOURS quantifier l'impact si possible (budget, délai, ressources).

FORMAT DE SORTIE :
- Classification : HIGH / MEDIUM / LOW avec justification
- Impact estimé : Budget / Délai / Qualité / Ressources
- Mesures d'atténuation : Actions concrètes et assignables
- Score de risque projet : 0-100 (algorithme : poids sévérité × probabilité)

EXEMPLE DE TON :
✅ BON : "Risque HIGH : Budget dépassement +12% (€50K). Mesure : Revoir périmètre sprint 3 ou budget additionnel."
❌ MAUVAIS : "Il y a un problème de budget, il faudrait faire quelque chose."

Tu es l'expert risques du cockpit. Sois factuel, précis, orienté action.
```

---

### Prompt Système AD (Agent Décisionnel)

```
Tu es l'Agent Décisionnel (AD) de Powalyze.

TON RÔLE :
- Analyser les décisions ouvertes et proposer des arbitrages.
- Évaluer les impacts court/moyen/long terme de chaque option.
- Recommander la décision optimale avec justification claire.

TES RÈGLES ABSOLUES :
1. JAMAIS prendre de décision à la place de l'utilisateur (tu proposes, il décide).
2. JAMAIS proposer plus de 3 options (risque de paralysie du choix).
3. JAMAIS recommander sans évaluer les impacts (court/moyen/long terme).
4. TOUJOURS structurer : Options → Impacts → Recommandation.
5. TOUJOURS quantifier les impacts si possible (coûts, délais, risques).
6. TOUJOURS être objectif (pas de biais personnel).

FORMAT DE SORTIE :
- Option 1 : Avantages ✅ + Inconvénients ❌
- Option 2 : Avantages ✅ + Inconvénients ❌
- (Option 3 si pertinent)
- Impacts : Court terme (0-3 mois) / Moyen terme (3-12 mois) / Long terme (12+ mois)
- Recommandation : Choix optimal avec justification

EXEMPLE DE TON :
✅ BON : "Option 1 : Microservices. ✅ Scalabilité. ❌ Complexité +40%, délai +2 mois. Recommandation : Monolithe MVP puis migration progressive."
❌ MAUVAIS : "Les microservices c'est bien mais c'est compliqué, à vous de voir..."

Tu es le conseiller décisionnel du cockpit. Sois analytique, objectif, structuré.
```

---

### Prompt Système ASR (Agent Synthèse & Reporting)

```
Tu es l'Agent Synthèse & Reporting (ASR) de Powalyze.

TON RÔLE :
- Générer des rapports exécutifs structurés et lisibles (hebdo/mensuels).
- Produire des slides narratives prêtes pour PowerPoint/Keynote.
- Adapter le niveau de détail selon l'audience (C-level, VPs, Managers).

TES RÈGLES ABSOLUES :
1. JAMAIS dépasser 2 pages pour un rapport hebdomadaire.
2. JAMAIS dépasser 5 pages pour un rapport mensuel.
3. JAMAIS utiliser de jargon technique sans l'expliquer.
4. TOUJOURS structurer : Résumé → Risques → Décisions → Actions.
5. TOUJOURS inclure des tendances (évolution vs période précédente).
6. TOUJOURS suggérer des visualisations (graphs, charts).

FORMAT DE SORTIE :
1. RÉSUMÉ EXÉCUTIF (3-5 lignes)
2. RISQUES CRITIQUES (top 3-5)
3. DÉCISIONS BLOQUANTES (top 3-5)
4. ACTIONS RECOMMANDÉES (top 5)
5. TENDANCES (évolution KPIs)
6. ANNEXES (graphs suggestions)

EXEMPLE DE TON :
✅ BON : "12 projets actifs (+2). 18 risques ouverts (-3). Vélocité +8%. Objectifs Q1 maintenus."
❌ MAUVAIS : "Il y a eu pas mal de changements cette semaine avec plusieurs projets qui ont évolué..."

Tu es le générateur de rapports premium du cockpit. Sois structuré, lisible, premium.
```

---

### Prompt Système AOC (Agent Onboarding & Coaching)

```
Tu es l'Agent Onboarding & Coaching (AOC) de Powalyze.

TON RÔLE :
- Guider l'utilisateur dans le cockpit avec des tutoriels contextuels.
- Proposer des actions rapides selon l'état de son cockpit.
- Expliquer les modules, flows et best practices.

TES RÈGLES ABSOLUES :
1. JAMAIS submerger l'utilisateur (max 3 suggestions à la fois).
2. JAMAIS répéter les mêmes conseils (mémoriser ce qui a été dit).
3. JAMAIS bloquer l'interface (messages non-intrusifs, dismissibles).
4. TOUJOURS être pédagogique, encourageant et concis.
5. TOUJOURS proposer des actions concrètes et réalisables en <5 min.
6. TOUJOURS détecter si le cockpit est vide → onboarding LIVE.

FORMAT DE SORTIE :
- Titre : Accueillant et clair
- 3 actions rapides max : Numérotées, avec instructions claires
- 1 astuce optionnelle : Best practice ou conseil avancé
- 1 lien aide optionnel : Vers documentation ou support

EXEMPLE DE TON :
✅ BON : "👋 Bienvenue ! Votre cockpit est vide. 1️⃣ Créer votre premier projet (bouton bleu). 2️⃣ Ajouter un risque. 3️⃣ Ajouter une décision."
❌ MAUVAIS : "Il faudrait commencer par configurer plusieurs éléments dans le système pour pouvoir utiliser toutes les fonctionnalités..."

Tu es le guide bienveillant du cockpit. Sois pédagogique, encourageant, concis.
```

---

### Prompt Système AGA (Agent Gouvernance & Audit)

```
Tu es l'Agent Gouvernance & Audit (AGA) de Powalyze.

TON RÔLE :
- Vérifier la cohérence des données et détecter les anomalies.
- Vérifier les permissions avant chaque action IA (sécurité).
- Journaliser toutes les actions IA avec timestamp, agent, action, données utilisées, résultat.

TES RÈGLES ABSOLUES :
1. JAMAIS bloquer une action légitime (éviter les faux positifs).
2. JAMAIS journaliser de données sensibles en clair (hash ou redact).
3. JAMAIS générer de faux positifs répétés (calibrer seuils).
4. TOUJOURS vérifier les permissions utilisateur avant action IA.
5. TOUJOURS détecter incohérences : RAG status vs risques, owner inexistant, etc.
6. TOUJOURS journaliser au format structuré (timestamp, agent, action, result, error).

FORMAT DE SORTIE (Audit Report) :
1. RÉSUMÉ : Actions validées / Anomalies détectées / Actions bloquées
2. ANOMALIES DÉTECTÉES : Description + Action corrective prise
3. LOGS : Dernières 24h (format structuré)

FORMAT LOG :
[YYYY-MM-DD HH:MM:SS] AGENT | ACTION | CONTEXT | STATUS | ERROR (if any)

EXEMPLE DE TON :
✅ BON : "✅ 147 actions validées. ⚠️ 3 anomalies détectées : Projet Alpha RAG incohérent (recalculé automatiquement)."
❌ MAUVAIS : "Tout s'est bien passé, il y a eu quelques petits problèmes mais rien de grave..."

Tu es le gardien de la cohérence et de la sécurité du cockpit. Sois neutre, factuel, technique.
```

---

## PARTIE 4 — SCÉNARIOS EXÉCUTIFS

### Scénario 1 : Synthèse Projet (ANE)

**Déclencheur** : Utilisateur ouvre page détail projet.

**Entrées** :
- Projet : id, name, status, rag_status, budget, start_date, end_date
- Risques : liste (title, severity, status, impact)
- Décisions : liste (title, status, owner, deadline)
- Resources : liste (users, allocations)

**Traitement ANE** :
1. Analyse santé projet (RAG status)
2. Identifie 3 risques clés (HIGH priority)
3. Identifie 3 décisions clés (PENDING + proche deadline)
4. Génère 3 actions immédiates
5. Détecte insight stratégique (pattern, tendance)

**Sortie** :
```json
{
  "executiveSummary": {
    "headline": "Projet Atlas Q1 2026 : Attention requise (RAG YELLOW)",
    "keyPoints": [
      "3 risques critiques détectés (budget, délai, dépendances)",
      "2 décisions bloquantes en attente (architecture, validation client)",
      "Vélocité équipe -15% vs Q4 → analyse capacité recommandée"
    ]
  },
  "keyRisks": [
    {
      "id": "r123",
      "title": "Budget dépassement prévu +12%",
      "severity": "HIGH",
      "impact": "€50K additionnel requis",
      "action": "Revoir périmètre sprint 3 ou demander budget additionnel"
    },
    {
      "id": "r456",
      "title": "Départ lead technique",
      "severity": "HIGH",
      "impact": "Retard 2-3 semaines si non remplacé",
      "action": "Recrutement urgence + transfert connaissance immédiat"
    },
    {
      "id": "r789",
      "title": "Dépendance API externe instable",
      "severity": "MEDIUM",
      "impact": "Risque blocage sprints 4-5",
      "action": "Développer plan B : API interne"
    }
  ],
  "keyDecisions": [
    {
      "id": "d123",
      "title": "Choix architecture : Microservices vs Monolithe",
      "status": "PENDING",
      "deadline": "2026-02-05",
      "blocking": true,
      "action": "Arbitrage requis avant 5 février (bloque sprint 3)"
    },
    {
      "id": "d456",
      "title": "Validation client : Phase 2 périmètre",
      "status": "PENDING",
      "deadline": "2026-02-10",
      "blocking": true,
      "action": "Escalade commerciale pour obtenir validation"
    }
  ],
  "immediateActions": [
    {
      "priority": 1,
      "action": "Arbitrage architecture (décision d123)",
      "deadline": "2026-02-05",
      "responsible": "CTO"
    },
    {
      "priority": 2,
      "action": "Recrutement lead technique (risque r456)",
      "deadline": "ASAP",
      "responsible": "RH + Hiring Manager"
    },
    {
      "priority": 3,
      "action": "Analyse capacité équipe (vélocité -15%)",
      "deadline": "2026-02-08",
      "responsible": "Chef de projet"
    }
  ],
  "strategicInsight": {
    "type": "TREND_NEGATIVE",
    "message": "Vélocité équipe -15% vs Q4. Pattern détecté : surcharge 2 développeurs clés.",
    "recommendation": "Rééquilibrer allocations ou recruter 1 développeur additionnel."
  }
}
```

---

### Scénario 2 : Analyse Risques Projet (AAR)

**Déclencheur** : Utilisateur clique "Analyser risques avec IA" sur page projet.

**Entrées** :
- Projet : id, name, budget, timeline
- Risques existants : liste (title, severity, status, description, mitigation_actions)

**Traitement AAR** :
1. Classe risques existants (HIGH/MEDIUM/LOW)
2. Détecte patterns (ex : plusieurs risques "budget" → pattern "contrôle coûts faible")
3. Calcule score de risque global projet (0-100)
4. Propose mesures d'atténuation pour risques HIGH
5. Alerte si tendance négative (nb risques HIGH augmente)

**Sortie** :
```json
{
  "riskAnalysis": {
    "projectId": "p123",
    "projectName": "Atlas",
    "riskScore": 68,
    "riskLevel": "ATTENTION_REQUIRED",
    "summary": "2 risques HIGH, 3 risques MEDIUM, 1 risque LOW. Score 68/100 → attention requise."
  },
  "risksByCategory": {
    "HIGH": [
      {
        "id": "r123",
        "title": "Budget dépassement prévu +12%",
        "currentStatus": "OPEN",
        "impact": {
          "budget": 50000,
          "delay": "0 days",
          "quality": "none"
        },
        "mitigationActions": [
          {
            "action": "Revoir périmètre sprint 3 : retirer features non-critiques",
            "effort": "2 jours",
            "impact": "Réduction -€30K"
          },
          {
            "action": "Demander budget additionnel (+€50K) avec justification ROI",
            "effort": "1 semaine",
            "impact": "Budget sécurisé"
          }
        ]
      },
      {
        "id": "r456",
        "title": "Départ lead technique",
        "currentStatus": "OPEN",
        "impact": {
          "budget": 0,
          "delay": "2-3 weeks",
          "quality": "high risk"
        },
        "mitigationActions": [
          {
            "action": "Recrutement urgence : publier offre + chasse de tête",
            "effort": "2-4 semaines",
            "impact": "Remplacement qualifié"
          },
          {
            "action": "Transfert connaissance immédiat : doc + pair programming avec équipe",
            "effort": "1 semaine",
            "impact": "Réduction risque connaissance perdue"
          }
        ]
      }
    ],
    "MEDIUM": [...],
    "LOW": [...]
  },
  "emergingRisks": [
    {
      "type": "PATTERN_DETECTED",
      "title": "Contrôle des coûts faible",
      "description": "3 risques liés au budget détectés → pattern 'contrôle coûts insuffisant'.",
      "recommendation": "Mettre en place suivi budgétaire hebdomadaire avec alertes automatiques."
    }
  ],
  "trend": {
    "status": "NEGATIVE",
    "message": "Nombre risques HIGH : 2 (+1 vs mois dernier). Tendance négative.",
    "action": "Escalade recommandée au comité de direction."
  }
}
```

---

### Scénario 3 : Arbitrage Décisionnel (AD)

**Déclencheur** : Utilisateur clique "Analyser décision avec IA" sur décision PENDING.

**Entrées** :
- Décision : id, title, description, context, options (si définies)
- Projet : budget, timeline, contraintes

**Traitement AD** :
1. Identifie les options (2-3 max)
2. Analyse avantages/inconvénients de chaque option
3. Évalue impacts court/moyen/long terme
4. Recommande option optimale avec justification
5. Identifie si décision bloquante (deadline proche + impact fort)

**Sortie** :
```json
{
  "decisionAnalysis": {
    "decisionId": "d123",
    "title": "Choix architecture : Microservices vs Monolithe",
    "status": "PENDING",
    "blocking": true,
    "deadline": "2026-02-05"
  },
  "options": [
    {
      "optionId": 1,
      "name": "Architecture Microservices",
      "advantages": [
        "Scalabilité future excellente (horizontal scaling)",
        "Équipes autonomes (déploiements indépendants)",
        "Résilience (isolation des pannes)"
      ],
      "disadvantages": [
        "Complexité technique +40% (orchestration, monitoring)",
        "Coûts infrastructure +25% (containers, load balancers)",
        "Délai supplémentaire +2 mois (setup + tests)"
      ],
      "estimatedCost": 150000,
      "estimatedDelay": "2 months"
    },
    {
      "optionId": 2,
      "name": "Monolithe modulaire",
      "advantages": [
        "Simplicité technique (déploiement unique)",
        "Time-to-market rapide (-30% vs microservices)",
        "Coûts réduits -30% (infra simple)"
      ],
      "disadvantages": [
        "Scalabilité limitée (vertical scaling uniquement)",
        "Couplage équipes (déploiements synchronisés)",
        "Refactoring futur probable (migration vers microservices phase 2)"
      ],
      "estimatedCost": 100000,
      "estimatedDelay": "0 months"
    }
  ],
  "impactAnalysis": {
    "shortTerm": {
      "period": "0-3 months",
      "analysis": "Monolithe +30% plus rapide pour MVP. Microservices retarde lancement de 2 mois.",
      "winner": "Monolithe"
    },
    "mediumTerm": {
      "period": "3-12 months",
      "analysis": "Microservices meilleure scalabilité si croissance forte (>10K users). Monolithe suffisant si croissance modérée.",
      "winner": "Microservices (si croissance forte)"
    },
    "longTerm": {
      "period": "12+ months",
      "analysis": "Microservices ROI positif après 18 mois (scalabilité + résilience). Monolithe nécessitera refactoring coûteux.",
      "winner": "Microservices"
    }
  },
  "recommendation": {
    "choice": "Option 2 : Monolithe modulaire pour MVP",
    "justification": "Time-to-market critique pour Q1. Monolithe permet lancement rapide. Migration progressive vers microservices en phase 2 (Q3-Q4) quand croissance validée.",
    "conditions": [
      "Architecture modulaire dès le départ (préparer migration future)",
      "Documentation exhaustive des modules",
      "Planning migration microservices phase 2 (Q3 2026)"
    ],
    "alternativeScenario": "Si croissance >10K users avant Q3 → accélérer migration microservices."
  }
}
```

---

### Scénario 4 : Rapport Hebdomadaire Automatique (ASR)

**Déclencheur** : Cron job chaque lundi 08h00 OU utilisateur clique "Générer rapport hebdo".

**Entrées** :
- Tous les projets de l'organisation (actifs)
- Tous les risques (ouverts)
- Toutes les décisions (ouvertes)
- Données semaine précédente (pour comparaison)

**Traitement ASR** :
1. Agrège données : nb projets, nb risques, nb décisions
2. Calcule tendances : évolution vs semaine précédente
3. Identifie top risques critiques (HIGH)
4. Identifie top décisions bloquantes (PENDING + deadline proche)
5. Propose top 5 actions recommandées
6. Génère visualisations suggestions

**Sortie** :
```json
{
  "weeklyReport": {
    "organization": "Acme Corp",
    "period": "Semaine 5 (27 Jan - 2 Fév 2026)",
    "generatedAt": "2026-02-03T08:00:00Z",
    "format": "executive_summary"
  },
  "executiveSummary": {
    "headline": "12 projets actifs (+2 vs sem. 4). 18 risques ouverts (-3 vs sem. 4). 9 décisions en attente (5 bloquantes).",
    "trend": "Vélocité globale +8%. Objectifs Q1 maintenus.",
    "overallStatus": "ON_TRACK_WITH_ATTENTION"
  },
  "projects": {
    "total": 12,
    "change": +2,
    "byStatus": {
      "GREEN": 7,
      "YELLOW": 4,
      "RED": 1
    }
  },
  "risks": {
    "total": 18,
    "change": -3,
    "bySeverity": {
      "HIGH": 5,
      "MEDIUM": 9,
      "LOW": 4
    },
    "criticalRisks": [
      {
        "projectName": "Atlas",
        "riskTitle": "Budget dépassement +12%",
        "severity": "HIGH",
        "action": "Revoir périmètre sprint 3"
      },
      {
        "projectName": "Nova",
        "riskTitle": "Départ lead technique",
        "severity": "HIGH",
        "action": "Recrutement urgence"
      },
      {
        "projectName": "Zeta",
        "riskTitle": "Retard validation client",
        "severity": "MEDIUM",
        "action": "Escalade commerciale"
      }
    ]
  },
  "decisions": {
    "total": 9,
    "pending": 5,
    "blocking": 5,
    "blockingDecisions": [
      {
        "projectName": "Atlas",
        "decisionTitle": "Architecture Microservices vs Monolithe",
        "deadline": "2026-02-05",
        "daysRemaining": 2
      },
      {
        "projectName": "Nova",
        "decisionTitle": "Choix cloud provider",
        "deadline": "2026-02-10",
        "daysRemaining": 7
      },
      {...}
    ]
  },
  "recommendedActions": [
    {
      "priority": 1,
      "action": "Arbitrage architecture Atlas",
      "reason": "Décision bloquante (deadline 5 fév)",
      "responsible": "CTO"
    },
    {
      "priority": 2,
      "action": "Recrutement lead technique Nova",
      "reason": "Risque HIGH (retard 2-3 semaines)",
      "responsible": "RH"
    },
    {
      "priority": 3,
      "action": "Escalade commerciale Zeta",
      "reason": "Décision bloquante validation client",
      "responsible": "Sales"
    },
    {
      "priority": 4,
      "action": "Revue capacité équipes",
      "reason": "Vélocité -15% sur 2 projets",
      "responsible": "PMO"
    },
    {
      "priority": 5,
      "action": "Planning Q1 update",
      "reason": "2 projets en avance, 1 projet en retard",
      "responsible": "Release Manager"
    }
  ],
  "visualizationsSuggestions": [
    {
      "type": "bar_chart",
      "title": "Vélocité par projet",
      "description": "Comparer vélocité sprints actuels vs Q4 2025"
    },
    {
      "type": "line_chart",
      "title": "Évolution risques HIGH/MEDIUM/LOW",
      "description": "Tendance sur 8 dernières semaines"
    },
    {
      "type": "pie_chart",
      "title": "Répartition décisions PENDING/APPROVED/REJECTED",
      "description": "Status décisions semaine en cours"
    }
  ]
}
```

---

### Scénario 5 : Onboarding LIVE (AOC)

**Déclencheur** : Utilisateur nouveau OU cockpit vide (0 projets).

**Entrées** :
- User : id, role, created_at
- Organization : settings (modules activés)
- Cockpit state : nb projets, nb risques, nb décisions

**Traitement AOC** :
1. Détecte état cockpit (vide / partiellement rempli / complet)
2. Génère tutoriel contextuel selon état
3. Propose 3 actions rapides max
4. Suggère 1 best practice

**Sortie** :
```json
{
  "onboarding": {
    "userId": "u123",
    "cockpitState": "EMPTY",
    "trigger": "first_login"
  },
  "welcomeMessage": {
    "title": "👋 Bienvenue sur Powalyze",
    "subtitle": "Votre cockpit est vide. Voici 3 actions rapides pour démarrer :"
  },
  "quickActions": [
    {
      "step": 1,
      "title": "Créer votre premier projet",
      "description": "Cliquez sur le bouton 'Nouveau Projet' (bleu, en haut à droite).",
      "details": "Donnez un nom, une description, un statut (GREEN/YELLOW/RED). Votre projet apparaîtra dans la liste.",
      "icon": "📁",
      "estimatedTime": "2 min"
    },
    {
      "step": 2,
      "title": "Ajouter un risque",
      "description": "Ouvrez votre projet → onglet 'Risques' → cliquez 'Nouveau Risque'.",
      "details": "Définissez un titre, une sévérité (HIGH/MEDIUM/LOW), une description. Le risque apparaîtra dans le projet.",
      "icon": "⚠️",
      "estimatedTime": "3 min"
    },
    {
      "step": 3,
      "title": "Ajouter une décision",
      "description": "Ouvrez votre projet → onglet 'Décisions' → cliquez 'Nouvelle Décision'.",
      "details": "Définissez un titre, un propriétaire, un statut (PENDING/APPROVED/REJECTED). La décision sera trackée.",
      "icon": "⚖️",
      "estimatedTime": "2 min"
    }
  ],
  "tip": {
    "icon": "💡",
    "title": "ASTUCE",
    "message": "Le badge RAG (🟢 Vert / 🟡 Jaune / 🔴 Rouge) résume automatiquement la santé de votre projet. Vous pouvez le changer manuellement à tout moment."
  },
  "helpLink": {
    "text": "Besoin d'aide ?",
    "url": "/aide",
    "icon": "❓"
  }
}
```

---

### Scénario 6 : Audit Quotidien IA (AGA)

**Déclencheur** : Cron job chaque jour à 00h00 OU action IA sensible.

**Entrées** :
- Tous les logs IA des dernières 24h
- Toutes les données cockpit (projets, risques, décisions)
- Permissions utilisateurs

**Traitement AGA** :
1. Vérifie cohérence données (ex : RAG GREEN mais 5 risques HIGH → incohérent)
2. Détecte anomalies (ex : owner user_id inexistant)
3. Vérifie permissions (ex : user role LECTEUR a créé projet → suspect)
4. Journalise toutes actions IA
5. Génère rapport quotidien

**Sortie** :
```json
{
  "auditReport": {
    "organization": "Acme Corp",
    "period": "Dernières 24h (28 Jan 00:00 - 29 Jan 00:00)",
    "generatedAt": "2026-01-29T00:00:00Z"
  },
  "summary": {
    "totalAIActions": 147,
    "actionsValidated": 147,
    "anomaliesDetected": 3,
    "actionsBlocked": 0
  },
  "anomalies": [
    {
      "anomalyId": "a1",
      "type": "DATA_COHERENCE",
      "severity": "MEDIUM",
      "description": "Projet 'Alpha' : RAG status GREEN mais 5 risques HIGH détectés.",
      "detectedAt": "2026-01-28T14:32:10Z",
      "autoFixApplied": true,
      "autoFixAction": "Recalcul automatique RAG status → YELLOW",
      "result": "RAG status mis à jour : GREEN → YELLOW"
    },
    {
      "anomalyId": "a2",
      "type": "DATA_INTEGRITY",
      "severity": "HIGH",
      "description": "Décision ID #d789 : Owner user_id='u999' inexistant dans base.",
      "detectedAt": "2026-01-28T16:45:22Z",
      "autoFixApplied": false,
      "manualAction": "Notification envoyée à l'admin pour correction manuelle."
    },
    {
      "anomalyId": "a3",
      "type": "REPORT_GENERATION",
      "severity": "LOW",
      "description": "Rapport hebdo : 2 projets manquants dans synthèse (projets archivés non filtrés).",
      "detectedAt": "2026-01-28T08:05:33Z",
      "autoFixApplied": true,
      "autoFixAction": "Régénération automatique du rapport avec filtre 'actifs uniquement'.",
      "result": "Rapport régénéré avec succès"
    }
  ],
  "logs": [
    {
      "timestamp": "2026-01-28T09:15:23Z",
      "agent": "ANE",
      "action": "generate_executive_summary",
      "context": {
        "projectId": "p123",
        "userId": "u456"
      },
      "status": "SUCCESS",
      "executionTime": "2.3s"
    },
    {
      "timestamp": "2026-01-28T09:18:45Z",
      "agent": "AAR",
      "action": "analyze_risks",
      "context": {
        "projectId": "p123",
        "risksCount": 7
      },
      "status": "SUCCESS",
      "executionTime": "3.1s"
    },
    {
      "timestamp": "2026-01-28T10:22:10Z",
      "agent": "AD",
      "action": "decision_arbitrage",
      "context": {
        "decisionId": "d456"
      },
      "status": "SUCCESS",
      "executionTime": "4.2s"
    },
    {...}
  ],
  "securityChecks": {
    "permissionsViolations": 0,
    "unauthorizedAccess": 0,
    "suspiciousActivity": 0
  }
}
```

---

## PARTIE 5 — PERSONNALISATION PAR ORGANISATION

Chaque organisation peut personnaliser l'expérience IA selon ses besoins.

### Table `organization_settings`

```sql
CREATE TABLE organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Personnalisation IA
  ai_tone TEXT DEFAULT 'neutral' CHECK (ai_tone IN ('formal', 'neutral', 'direct')),
  ai_language TEXT DEFAULT 'FR' CHECK (ai_language IN ('FR', 'EN', 'DE', 'NO', 'ES', 'IT')),
  ai_detail_level INTEGER DEFAULT 2 CHECK (ai_detail_level BETWEEN 1 AND 3), -- 1=concis, 2=standard, 3=détaillé
  executive_level TEXT DEFAULT 'manager' CHECK (executive_level IN ('c_level', 'vp', 'manager')),
  
  -- Modules activés
  modules_enabled JSONB DEFAULT '{"ane": true, "aar": true, "ad": true, "asr": true, "aoc": true, "aga": true}'::jsonb,
  
  -- Rapports automatiques
  report_frequency TEXT DEFAULT 'weekly' CHECK (report_frequency IN ('daily', 'weekly', 'monthly', 'disabled')),
  report_day INTEGER DEFAULT 1 CHECK (report_day BETWEEN 1 AND 7), -- 1=Lundi, 7=Dimanche
  report_hour INTEGER DEFAULT 8 CHECK (report_hour BETWEEN 0 AND 23),
  report_recipients JSONB DEFAULT '[]'::jsonb, -- Emails
  
  -- Sécurité & gouvernance
  require_approval_for_ai_actions BOOLEAN DEFAULT false,
  ai_audit_retention_days INTEGER DEFAULT 90,
  sensitive_data_redaction BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_settings_org ON organization_settings(organization_id);
```

### Exemples de configurations

**Configuration C-Level (Direction)** :
```json
{
  "ai_tone": "formal",
  "ai_language": "FR",
  "ai_detail_level": 1,
  "executive_level": "c_level",
  "modules_enabled": {
    "ane": true,
    "aar": true,
    "ad": true,
    "asr": true,
    "aoc": false,
    "aga": true
  },
  "report_frequency": "weekly",
  "report_day": 1,
  "report_hour": 8
}
```

**Configuration Manager (Chef de projet)** :
```json
{
  "ai_tone": "neutral",
  "ai_language": "FR",
  "ai_detail_level": 2,
  "executive_level": "manager",
  "modules_enabled": {
    "ane": true,
    "aar": true,
    "ad": true,
    "asr": true,
    "aoc": true,
    "aga": false
  },
  "report_frequency": "weekly",
  "report_day": 5,
  "report_hour": 17
}
```

### Application de la personnalisation

Chaque appel IA doit :
1. Récupérer `organization_settings` de l'organisation
2. Appliquer `ai_tone`, `ai_language`, `ai_detail_level` au prompt système
3. Vérifier si module agent activé (`modules_enabled`)
4. Adapter sortie selon `executive_level`

**Exemple adaptation prompt ANE** :
```typescript
function buildANEPrompt(settings: OrganizationSettings): string {
  const basePrompt = "Tu es l'Agent Narratif Exécutif (ANE) de Powalyze.";
  
  // Adapter ton
  let toneInstruction = "";
  if (settings.ai_tone === "formal") {
    toneInstruction = "Utilise un ton formel, protocolaire, adapté à la direction générale.";
  } else if (settings.ai_tone === "direct") {
    toneInstruction = "Utilise un ton direct, factuel, sans fioritures.";
  } else {
    toneInstruction = "Utilise un ton neutre, professionnel, équilibré.";
  }
  
  // Adapter niveau de détail
  let detailInstruction = "";
  if (settings.ai_detail_level === 1) {
    detailInstruction = "Sois ultra-concis (max 3 lignes par section).";
  } else if (settings.ai_detail_level === 3) {
    detailInstruction = "Fournis des détails complets (5-7 lignes par section, contexte étendu).";
  } else {
    detailInstruction = "Fournis un niveau de détail standard (3-5 lignes par section).";
  }
  
  // Adapter niveau exécutif
  let executiveInstruction = "";
  if (settings.executive_level === "c_level") {
    executiveInstruction = "Audience : Direction générale (CEO, CFO, COO). Insights stratégiques uniquement.";
  } else if (settings.executive_level === "vp") {
    executiveInstruction = "Audience : VPs. Équilibre stratégie + opérationnel.";
  } else {
    executiveInstruction = "Audience : Managers. Focus opérationnel et tactique.";
  }
  
  // Adapter langue
  let languageInstruction = `Réponds en ${settings.ai_language}.`;
  
  return `${basePrompt}\n\n${toneInstruction}\n${detailInstruction}\n${executiveInstruction}\n${languageInstruction}`;
}
```

---

## PARTIE 6 — GOUVERNANCE IA

### Table `ai_audit_logs`

```sql
CREATE TABLE ai_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Métadonnées action
  agent TEXT NOT NULL CHECK (agent IN ('ANE', 'AAR', 'AD', 'ASR', 'AOC', 'AGA', 'ORCHESTRATOR')),
  action TEXT NOT NULL, -- Ex: "generate_executive_summary", "analyze_risks"
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Contexte
  context JSONB NOT NULL, -- Ex: {"projectId": "p123", "risksCount": 7}
  input_data JSONB, -- Données d'entrée (peut être redacted)
  output_data JSONB, -- Données de sortie
  
  -- Résultat
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'ERROR', 'BLOCKED')),
  error_message TEXT,
  execution_time_ms INTEGER,
  
  -- Gouvernance
  permission_check_passed BOOLEAN DEFAULT true,
  coherence_check_passed BOOLEAN DEFAULT true,
  anomaly_detected BOOLEAN DEFAULT false,
  anomaly_details JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_audit_org ON ai_audit_logs(organization_id);
CREATE INDEX idx_ai_audit_agent ON ai_audit_logs(agent);
CREATE INDEX idx_ai_audit_status ON ai_audit_logs(status);
CREATE INDEX idx_ai_audit_created ON ai_audit_logs(created_at DESC);
```

### Vérifications AGA

**1. Vérification Permissions** :
```typescript
async function checkPermissions(
  userId: string,
  action: string,
  context: any
): Promise<boolean> {
  // Récupérer rôle utilisateur
  const userRole = await getUserRole(userId);
  
  // Vérifier si action autorisée selon rôle
  const permissionMatrix = {
    super_admin: ["*"],
    admin: ["generate_summary", "analyze_risks", "decision_arbitrage", "generate_report"],
    chef_projet: ["generate_summary", "analyze_risks", "decision_arbitrage"],
    contributeur: ["generate_summary"],
    lecteur: []
  };
  
  const allowedActions = permissionMatrix[userRole] || [];
  
  if (allowedActions.includes("*") || allowedActions.includes(action)) {
    return true;
  }
  
  // Log tentative non autorisée
  await logAuditEvent({
    agent: "AGA",
    action: "permission_check",
    userId,
    context: { attemptedAction: action },
    status: "BLOCKED",
    permission_check_passed: false
  });
  
  return false;
}
```

**2. Vérification Cohérence Données** :
```typescript
async function checkDataCoherence(
  projectId: string
): Promise<{ passed: boolean; anomalies: any[] }> {
  const anomalies = [];
  
  // Récupérer projet + risques
  const project = await getProject(projectId);
  const risks = await getRisks(projectId);
  
  // Vérification 1 : RAG status cohérent avec risques
  const highRisksCount = risks.filter(r => r.severity === "HIGH").length;
  if (project.rag_status === "GREEN" && highRisksCount >= 3) {
    anomalies.push({
      type: "RAG_INCOHERENT",
      severity: "MEDIUM",
      description: `RAG GREEN mais ${highRisksCount} risques HIGH`,
      autoFix: "Recalculer RAG status automatiquement"
    });
  }
  
  // Vérification 2 : Dates cohérentes
  if (new Date(project.end_date) < new Date(project.start_date)) {
    anomalies.push({
      type: "DATE_INCOHERENT",
      severity: "HIGH",
      description: "Date fin < Date début",
      autoFix: "Alerter admin pour correction manuelle"
    });
  }
  
  // Vérification 3 : Owners existent
  const decisions = await getDecisions(projectId);
  for (const decision of decisions) {
    if (decision.owner_id) {
      const ownerExists = await userExists(decision.owner_id);
      if (!ownerExists) {
        anomalies.push({
          type: "OWNER_INEXISTANT",
          severity: "HIGH",
          description: `Décision ${decision.id} : Owner ${decision.owner_id} inexistant`,
          autoFix: "Notifier admin"
        });
      }
    }
  }
  
  return {
    passed: anomalies.length === 0,
    anomalies
  };
}
```

**3. Journalisation** :
```typescript
async function logAIAction(params: {
  agent: string;
  action: string;
  userId?: string;
  context: any;
  inputData?: any;
  outputData?: any;
  status: "SUCCESS" | "ERROR" | "BLOCKED";
  errorMessage?: string;
  executionTimeMs: number;
  permissionCheckPassed: boolean;
  coherenceCheckPassed: boolean;
  anomalyDetected: boolean;
  anomalyDetails?: any;
}) {
  // Redact sensitive data si activé
  const settings = await getOrgSettings(params.context.organizationId);
  let inputDataToLog = params.inputData;
  let outputDataToLog = params.outputData;
  
  if (settings.sensitive_data_redaction) {
    inputDataToLog = redactSensitiveData(params.inputData);
    outputDataToLog = redactSensitiveData(params.outputData);
  }
  
  // Insérer log
  await supabase.from("ai_audit_logs").insert({
    organization_id: params.context.organizationId,
    agent: params.agent,
    action: params.action,
    user_id: params.userId,
    context: params.context,
    input_data: inputDataToLog,
    output_data: outputDataToLog,
    status: params.status,
    error_message: params.errorMessage,
    execution_time_ms: params.executionTimeMs,
    permission_check_passed: params.permissionCheckPassed,
    coherence_check_passed: params.coherenceCheckPassed,
    anomaly_detected: params.anomalyDetected,
    anomaly_details: params.anomalyDetails
  });
}
```

---

## PARTIE 7 — INTÉGRATION COCKPIT (DESKTOP + MOBILE)

### Intégration Desktop

**Composant IA Panel** :
```typescript
// components/cockpit/AIInsightsPanel.tsx
"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIInsightsPanelProps {
  projectId: string;
  organizationId: string;
}

export function AIInsightsPanel({ projectId, organizationId }: AIInsightsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  async function generateInsights() {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/executive-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, organizationId })
      });
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error("Erreur génération insights:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-insights-panel">
      <div className="panel-header">
        <Sparkles className="icon" />
        <h3>IA Insights Exécutifs</h3>
        <Button onClick={generateInsights} disabled={loading}>
          {loading ? "Génération..." : "Générer"}
        </Button>
      </div>

      {insights && (
        <div className="insights-content">
          {/* Résumé exécutif */}
          <section className="summary">
            <h4>📊 Résumé Exécutif</h4>
            <p>{insights.executiveSummary.headline}</p>
            <ul>
              {insights.executiveSummary.keyPoints.map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </section>

          {/* Risques clés */}
          <section className="risks">
            <h4><AlertTriangle size={16} /> Risques Clés</h4>
            {insights.keyRisks.map((risk: any) => (
              <div key={risk.id} className="risk-card">
                <span className={`severity-badge ${risk.severity}`}>{risk.severity}</span>
                <h5>{risk.title}</h5>
                <p className="impact">{risk.impact}</p>
                <p className="action">→ {risk.action}</p>
              </div>
            ))}
          </section>

          {/* Décisions clés */}
          <section className="decisions">
            <h4><CheckSquare size={16} /> Décisions Clés</h4>
            {insights.keyDecisions.map((decision: any) => (
              <div key={decision.id} className="decision-card">
                {decision.blocking && <span className="blocking-badge">BLOQUANTE</span>}
                <h5>{decision.title}</h5>
                <p className="deadline">Deadline : {decision.deadline}</p>
                <p className="action">→ {decision.action}</p>
              </div>
            ))}
          </section>

          {/* Actions immédiates */}
          <section className="actions">
            <h4><TrendingUp size={16} /> Actions Immédiates</h4>
            <ol>
              {insights.immediateActions.map((action: any, i: number) => (
                <li key={i}>
                  <strong>{action.action}</strong>
                  <span className="responsible">Responsable : {action.responsible}</span>
                  <span className="deadline">Deadline : {action.deadline}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Insight stratégique */}
          {insights.strategicInsight && (
            <section className="strategic-insight">
              <h4>🔍 Insight Stratégique</h4>
              <p>{insights.strategicInsight.message}</p>
              <p className="recommendation">💡 {insights.strategicInsight.recommendation}</p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
```

### Intégration Mobile (PACK 6)

**Composant IA Card Mobile** :
```typescript
// components/cockpit/mobile/AIInsightCardMobile.tsx
"use client";

import { Sparkles } from "lucide-react";

interface AIInsightCardMobileProps {
  insight: {
    type: "RISK" | "DECISION" | "ACTION" | "INSIGHT";
    title: string;
    description: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
  };
  onClick?: () => void;
}

export function AIInsightCardMobile({ insight, onClick }: AIInsightCardMobileProps) {
  return (
    <div 
      className="ai-insight-card-mobile"
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: "72px",
        padding: "12px 16px",
        backgroundColor: "#111111",
        border: "1px solid #1E1E1E",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        transition: "opacity 120ms ease-out"
      }}
    >
      <div className="icon" style={{ flexShrink: 0 }}>
        <Sparkles size={20} color="#3A82F7" />
      </div>
      
      <div className="content" style={{ flex: 1 }}>
        <h4 style={{ 
          fontSize: "14px", 
          fontWeight: 600, 
          color: "#FFFFFF",
          marginBottom: "4px"
        }}>
          {insight.title}
        </h4>
        <p style={{ 
          fontSize: "12px", 
          color: "#9A9A9A",
          lineHeight: 1.4
        }}>
          {insight.description}
        </p>
      </div>
      
      <span 
        className="priority-badge"
        style={{
          flexShrink: 0,
          fontSize: "11px",
          fontWeight: 600,
          padding: "4px 8px",
          borderRadius: "4px",
          backgroundColor: insight.priority === "HIGH" ? "#FF4545" : insight.priority === "MEDIUM" ? "#FFB800" : "#00C853",
          color: "#FFFFFF"
        }}
      >
        {insight.priority}
      </span>
    </div>
  );
}
```

**Flow Mobile IA** :
1. User ouvre projet → AI Insights section en haut
2. Tap "Générer Insights IA" → Loading 2-3s
3. Slide-up modal avec insights (résumé + risques + décisions + actions)
4. Tap insight card → Détail (scroll vertical, modal)
5. Tap "Appliquer action" → Crée tâche / décision / risque automatiquement

---

## CHECKLIST IMPLÉMENTATION

- [ ] **Architecture** : 6 agents créés (ANE, AAR, AD, ASR, AOC, AGA)
- [ ] **Prompts** : Prompts système définis pour chaque agent
- [ ] **Scénarios** : 6 scénarios implémentés (synthèse, risques, décision, reporting, onboarding, audit)
- [ ] **Personnalisation** : Table `organization_settings` créée + application dans prompts
- [ ] **Gouvernance** : Table `ai_audit_logs` créée + AGA fonctionnel
- [ ] **Intégration Desktop** : `AIInsightsPanel` composant créé
- [ ] **Intégration Mobile** : `AIInsightCardMobile` composant créé (PACK 6)
- [ ] **API Routes** : `/api/ai/executive-summary`, `/api/ai/analyze-risks`, `/api/ai/decision-arbitrage`, `/api/ai/weekly-report`, `/api/ai/onboarding`, `/api/ai/audit`
- [ ] **Tests** : Tous agents testés avec données réelles
- [ ] **Performance** : Temps réponse <5s pour tous agents
- [ ] **Sécurité** : Permissions vérifiées avant chaque action IA
- [ ] **Monitoring** : Logs IA centralisés + dashboard audit

---

## PROCHAINES ÉTAPES

1. **VB** : Implémenter infrastructure IA (lib/ai-agents/, API routes)
2. **VB** : Créer tables `organization_settings` + `ai_audit_logs`
3. **VB** : Implémenter les 6 agents (ANE, AAR, AD, ASR, AOC, AGA)
4. **VB** : Intégrer composants desktop + mobile
5. **QA** : Valider tous scénarios avec données réelles
6. **Release Manager** : Déploiement production PACK 7

**Estimation** : 7-10 jours développement + 2-3 jours tests/validation.

---

**FIN PACK 7 — ARCHITECTURE IA NARRATIVE MULTI-AGENTS**
