# PACK 7 — CHECKLIST VALIDATION IA

**Version** : 1.0.0  
**Date** : 29 janvier 2026  
**QA Lead** + **Release Manager**  
**Statut** : ✅ Prêt pour validation

---

## OBJECTIF

Checklist complète de validation de l'architecture IA narrative multi-agents de Powalyze.

**Total** : 200+ critères de validation  
**Scoring** : (Validés / Total) × 100

---

## SECTION 1 : INFRASTRUCTURE & SETUP (25 critères)

### 1.1 — Database

- [ ] Table `organization_settings` créée
- [ ] Table `ai_audit_logs` créée
- [ ] Index créés : `idx_org_settings_org`, `idx_ai_audit_org`, `idx_ai_audit_agent`, `idx_ai_audit_status`, `idx_ai_audit_created`
- [ ] RLS activé sur les 2 tables
- [ ] Policies créées : admin view settings, admin update settings, admin view audit logs
- [ ] Champs types corrects : `ai_tone` (formal/neutral/direct), `ai_language` (FR/EN/DE/NO/ES/IT), `ai_detail_level` (1-3)
- [ ] Valeurs par défaut correctes : `ai_tone=neutral`, `ai_language=FR`, `ai_detail_level=2`, `report_frequency=weekly`
- [ ] Contraintes CHECK valides (pas d'erreur insertion)

### 1.2 — Configuration OpenAI/Azure

- [ ] Variable `OPENAI_API_KEY` OU `AZURE_OPENAI_API_KEY` définie
- [ ] Si Azure : `AZURE_OPENAI_ENDPOINT` défini
- [ ] Si Azure : `AZURE_OPENAI_DEPLOYMENT_NAME` défini
- [ ] Si Azure : `AZURE_OPENAI_API_VERSION` défini
- [ ] Client OpenAI instancié correctement (`lib/ai-agents/openai-client.ts`)
- [ ] Test connexion OpenAI : Appel simple fonctionne
- [ ] Gestion erreurs : Timeout, quota exceeded, invalid API key

### 1.3 — Structure fichiers

- [ ] Dossier `lib/ai-agents/` créé
- [ ] Fichiers : `openai-client.ts`, `types.ts`, `utils.ts`, `orchestrator.ts` présents
- [ ] Dossiers agents : `ane/`, `aar/`, `ad/`, `asr/`, `aoc/`, `aga/` créés
- [ ] Chaque agent a : `agent.ts`, `system-prompt.ts`, `types.ts`
- [ ] Dossier `app/api/ai/` créé
- [ ] API routes : `executive-summary/`, `analyze-risks/`, `decision-arbitrage/`, `weekly-report/`, `onboarding/`, `audit/` créés
- [ ] Composants UI : `components/cockpit/AIInsightsPanel.tsx`, `components/cockpit/mobile/AIInsightCardMobile.tsx` créés

### 1.4 — Fonctions utilitaires

- [ ] Fonction `getOrgSettings(organizationId)` implémentée
- [ ] Fonction `logAIAction(...)` implémentée
- [ ] Fonction `redactSensitiveData(data)` implémentée
- [ ] Gestion erreurs : Settings non trouvés → Retourne defaults

---

## SECTION 2 : AGENT ANE (Agent Narratif Exécutif) (30 critères)

### 2.1 — Types & Interfaces

- [ ] `ANEInput` défini : `project`, `risks`, `decisions`, `resources`
- [ ] `ANEOutput` défini : `executiveSummary`, `keyRisks` (3 max), `keyDecisions` (3 max), `immediateActions` (3 max), `strategicInsight` (optionnel)
- [ ] Types corrects : `rag_status` ("GREEN"|"YELLOW"|"RED"), `severity` ("HIGH"|"MEDIUM"|"LOW"), `status` ("PENDING"|"APPROVED"|"REJECTED")

### 2.2 — Prompt Système

- [ ] Fonction `buildANESystemPrompt(settings)` implémentée
- [ ] Adaptation `ai_tone` : formal/neutral/direct appliquée
- [ ] Adaptation `ai_detail_level` : 1 (concis) / 2 (standard) / 3 (détaillé) appliquée
- [ ] Adaptation `executive_level` : c_level/vp/manager appliquée
- [ ] Adaptation `ai_language` : FR/EN/DE/NO/ES/IT appliquée
- [ ] Règles absolues présentes : max 20 mots/phrase, pas de spéculation, insights actionnables uniquement
- [ ] Format JSON spécifié clairement dans prompt

### 2.3 — Agent Logic

- [ ] Fonction `generateExecutiveSummary(input, context)` implémentée
- [ ] Appel OpenAI avec `response_format: { type: "json_object" }`
- [ ] Température : 0.3 (cohérence)
- [ ] Max tokens : 2000
- [ ] Parsing JSON output : Gestion erreurs
- [ ] Logging : `logAIAction` appelé en SUCCESS et ERROR
- [ ] Execution time : Mesuré et loggé

### 2.4 — API Endpoint

- [ ] Route `/api/ai/executive-summary` créée (POST)
- [ ] Récupération `projectId`, `organizationId` du body
- [ ] Récupération `userId` du header `x-user-id`
- [ ] Vérification module ANE activé : `settings.modules_enabled.ane`
- [ ] Fetch project data : Supabase query `.from("projects").eq("id", projectId)`
- [ ] Fetch risks data : `.from("risks").eq("project_id", projectId)`
- [ ] Fetch decisions data : `.from("decisions").eq("project_id", projectId)`
- [ ] Gestion erreurs : Project not found (404), Internal error (500)
- [ ] Retour JSON : `ANEOutput` structure

### 2.5 — Tests Fonctionnels

- [ ] Test 1 : Projet avec 0 risques → Résumé positif, insight TREND_POSITIVE
- [ ] Test 2 : Projet avec 5 risques HIGH → Résumé critique, keyRisks contient 3 HIGH
- [ ] Test 3 : Projet avec décisions bloquantes (deadline proche) → immediateActions contient arbitrage
- [ ] Test 4 : Projet vide (0 risques, 0 décisions) → EmptyState message
- [ ] Test 5 : Langue FR → Output en français
- [ ] Test 6 : Langue EN → Output en anglais
- [ ] Test 7 : Detail level 1 → Résumé ultra-concis (3 lignes max)
- [ ] Test 8 : Detail level 3 → Résumé détaillé (5-7 lignes)

---

## SECTION 3 : AGENT AAR (Agent Analyse & Risques) (25 critères)

### 3.1 — Types & Interfaces

- [ ] `AARInput` défini : `project`, `risks`
- [ ] `AAROutput` défini : `riskAnalysis` (score 0-100), `risksByCategory` (HIGH/MEDIUM/LOW), `emergingRisks`, `trend`

### 3.2 — Prompt Système

- [ ] Fonction `buildAARSystemPrompt(settings)` implémentée
- [ ] Règles : Jamais minimiser HIGH, toujours proposer mitigation, quantifier impacts
- [ ] Calcul risk score spécifié : HIGH=30pts, MEDIUM=15pts, LOW=5pts

### 3.3 — Agent Logic

- [ ] Fonction `analyzeRisks(input, context)` implémentée
- [ ] Température : 0.2 (précision)
- [ ] Logging : SUCCESS/ERROR

### 3.4 — API Endpoint

- [ ] Route `/api/ai/analyze-risks` créée (POST)
- [ ] Module AAR vérifié : `settings.modules_enabled.aar`
- [ ] Fetch project + risks

### 3.5 — Tests Fonctionnels

- [ ] Test 1 : Projet 10 risques (3 HIGH, 5 MEDIUM, 2 LOW) → Risk score = 3×30 + 5×15 + 2×5 = 175 (plafonné 100) → CRITICAL
- [ ] Test 2 : Projet 0 risques → Risk score = 0 → LOW
- [ ] Test 3 : Risques HIGH → Mesures d'atténuation proposées (2+ actions par HIGH)
- [ ] Test 4 : Pattern détecté : 3 risques "budget" → emergingRisk type PATTERN_DETECTED
- [ ] Test 5 : Trend NEGATIVE si nb risques HIGH augmente vs période précédente

---

## SECTION 4 : AGENT AD (Agent Décisionnel) (20 critères)

### 4.1 — Types & Interfaces

- [ ] `ADInput` défini : `decision`, `project`
- [ ] `ADOutput` défini : `decisionAnalysis`, `options` (2-3 max), `impactAnalysis` (short/medium/long), `recommendation`

### 4.2 — Prompt Système

- [ ] Fonction `buildADSystemPrompt(settings)` implémentée
- [ ] Règles : Jamais prendre décision, max 3 options, impacts quantifiés

### 4.3 — Agent Logic

- [ ] Fonction `analyzeDecision(input, context)` implémentée
- [ ] Température : 0.3

### 4.4 — API Endpoint

- [ ] Route `/api/ai/decision-arbitrage` créée (POST)
- [ ] Module AD vérifié

### 4.5 — Tests Fonctionnels

- [ ] Test 1 : Décision sans options définies → Génère 2-3 options automatiquement
- [ ] Test 2 : Options avec avantages/inconvénients détaillés
- [ ] Test 3 : Impacts court/moyen/long terme évalués (quantifiés si possible)
- [ ] Test 4 : Recommandation justifiée avec conditions
- [ ] Test 5 : Décision bloquante → `blocking: true` détecté

---

## SECTION 5 : AGENT ASR (Agent Synthèse & Reporting) (25 critères)

### 5.1 — Types & Interfaces

- [ ] `ASRInput` défini : `organization`, `period`, `projects`, `risks`, `decisions`, `previousPeriodData`
- [ ] `ASROutput` défini : `weeklyReport`, `executiveSummary`, `projects`, `risks` (criticalRisks), `decisions` (blockingDecisions), `recommendedActions`, `visualizationsSuggestions`

### 5.2 — Prompt Système

- [ ] Fonction `buildASRSystemPrompt(settings)` implémentée
- [ ] Règles : Max 2 pages hebdo, max 5 pages mensuel, pas de jargon technique

### 5.3 — Agent Logic

- [ ] Fonction `generateReport(input, context)` implémentée
- [ ] Température : 0.3
- [ ] Max tokens : 3000 (rapport long)

### 5.4 — API Endpoint

- [ ] Route `/api/ai/weekly-report` créée (POST)
- [ ] Module ASR vérifié
- [ ] Fetch all projects, risks, decisions de l'organisation
- [ ] Calcul tendances vs période précédente (change: +2 projets, -3 risques)

### 5.5 — Tests Fonctionnels

- [ ] Test 1 : Organisation 10 projets → Rapport contient tous projets
- [ ] Test 2 : Structure : executiveSummary → projects → risks → decisions → recommendedActions
- [ ] Test 3 : CriticalRisks (top 3-5 HIGH)
- [ ] Test 4 : BlockingDecisions (PENDING + deadline proche)
- [ ] Test 5 : RecommendedActions (top 5, prioritized)
- [ ] Test 6 : VisualizationsSuggestions (3+) : bar_chart, line_chart, pie_chart
- [ ] Test 7 : Tendances calculées : "12 projets (+2 vs sem. 4)"
- [ ] Test 8 : OverallStatus : ON_TRACK / ON_TRACK_WITH_ATTENTION / AT_RISK / CRITICAL

---

## SECTION 6 : AGENT AOC (Agent Onboarding & Coaching) (20 critères)

### 6.1 — Types & Interfaces

- [ ] `AOCInput` défini : `user`, `organization`, `cockpitState`
- [ ] `AOCOutput` défini : `onboarding`, `welcomeMessage`, `quickActions` (3 max), `tip`, `helpLink`

### 6.2 — Prompt Système

- [ ] Fonction `buildAOCSystemPrompt(settings)` implémentée
- [ ] Règles : Max 3 suggestions, jamais répéter, non-intrusif

### 6.3 — Agent Logic

- [ ] Fonction `generateOnboarding(input, context)` implémentée
- [ ] Température : 0.4 (créativité modérée)

### 6.4 — API Endpoint

- [ ] Route `/api/ai/onboarding` créée (POST)
- [ ] Module AOC vérifié
- [ ] Détection cockpit state : EMPTY / PARTIALLY_FILLED / ACTIVE

### 6.5 — Tests Fonctionnels

- [ ] Test 1 : User nouveau (created_at < 7 jours) + cockpit vide → Onboarding "Premiers pas"
- [ ] Test 2 : Cockpit vide (0 projets) → 3 actions : Créer projet, Ajouter risque, Ajouter décision
- [ ] Test 3 : Cockpit partiellement rempli (1-2 projets) → Suggestions contextuelles
- [ ] Test 4 : Cockpit actif (5+ projets) → Tips avancés
- [ ] Test 5 : QuickActions : step, title, description, details, icon, estimatedTime présents
- [ ] Test 6 : Tip optionnel présent si pertinent
- [ ] Test 7 : HelpLink présent (text, url, icon)

---

## SECTION 7 : AGENT AGA (Agent Gouvernance & Audit) (30 critères)

### 7.1 — Permissions

- [ ] Fichier `lib/ai-agents/aga/permissions.ts` créé
- [ ] Fonction `checkPermissions(userId, action, context)` implémentée
- [ ] PERMISSION_MATRIX défini : super_admin (all), admin, chef_projet, contributeur, lecteur
- [ ] Vérification rôle : Query `user_roles` table
- [ ] Actions autorisées : generate_executive_summary, analyze_risks, decision_arbitrage, generate_report, generate_onboarding
- [ ] Test 1 : super_admin → Toutes actions autorisées
- [ ] Test 2 : admin → Toutes actions sauf AGA
- [ ] Test 3 : lecteur → Aucune action autorisée (403)

### 7.2 — Vérifications Cohérence

- [ ] Fichier `lib/ai-agents/aga/coherence-checks.ts` créé
- [ ] Fonction `checkDataCoherence(projectId)` implémentée
- [ ] Check 1 : RAG status cohérent avec risques (GREEN + 3 HIGH → INCOHERENT)
- [ ] Check 2 : Dates cohérentes (end_date >= start_date)
- [ ] Check 3 : Owners existent (decision.owner_id dans users table)
- [ ] Auto-fix : RAG status recalculé automatiquement si incohérent
- [ ] Retour : `{ passed: boolean, anomalies: [...] }`
- [ ] Test 1 : Projet GREEN + 5 HIGH → Détecte anomalie, auto-fix → YELLOW
- [ ] Test 2 : Projet end_date < start_date → Détecte anomalie, pas de fix (alerte admin)
- [ ] Test 3 : Décision owner inexistant → Détecte anomalie

### 7.3 — Agent Logic

- [ ] Fonction `runAudit(input, context)` implémentée
- [ ] Fetch logs IA dernières 24h : `.from("ai_audit_logs").gte("created_at", ...)`
- [ ] Fetch all projects de l'organisation
- [ ] Exécute `checkDataCoherence` sur chaque projet
- [ ] Agrège anomalies
- [ ] Génère rapport : summary, anomalies, logs (50 derniers), securityChecks

### 7.4 — API Endpoint

- [ ] Route `/api/ai/audit` créée (GET)
- [ ] Query params : `organizationId`, `period` (24h/7d/30d)
- [ ] Module AGA vérifié (optionnel : peut être toujours actif)

### 7.5 — Logging

- [ ] Fonction `logAIAction` appelée dans tous agents (ANE, AAR, AD, ASR, AOC, AGA)
- [ ] Logs contiennent : agent, action, context, input_data, output_data, status, execution_time_ms
- [ ] Redaction activée : `sensitive_data_redaction=true` → Emails, passwords, tokens redacted
- [ ] Test 1 : Appel ANE → Log créé dans `ai_audit_logs`
- [ ] Test 2 : Erreur AAR → Log status=ERROR, error_message présent
- [ ] Test 3 : Permission denied → Log status=BLOCKED, permission_check_passed=false

### 7.6 — Tests Fonctionnels

- [ ] Test 1 : Audit quotidien → Rapport généré (summary + anomalies + logs)
- [ ] Test 2 : 147 actions IA → summary.totalAIActions = 147
- [ ] Test 3 : 3 anomalies détectées → anomalies array contient 3 items
- [ ] Test 4 : SecurityChecks : permissionsViolations, unauthorizedAccess, suspiciousActivity calculés

---

## SECTION 8 : PERSONNALISATION PAR ORGANISATION (15 critères)

### 8.1 — Settings

- [ ] Table `organization_settings` contient settings pour toutes organisations
- [ ] Settings par défaut créés pour organisations sans config
- [ ] Fonction `getOrgSettings(organizationId)` retourne defaults si non trouvé

### 8.2 — Application dans Prompts

- [ ] Prompt ANE adapte `ai_tone` : formal/neutral/direct
- [ ] Prompt ANE adapte `ai_detail_level` : 1 (concis) / 2 (standard) / 3 (détaillé)
- [ ] Prompt ANE adapte `executive_level` : c_level / vp / manager
- [ ] Prompt ANE adapte `ai_language` : FR/EN/DE/NO/ES/IT
- [ ] Tous agents (AAR, AD, ASR, AOC) adaptent langue selon settings

### 8.3 — Modules Activés

- [ ] Vérification `settings.modules_enabled.ane` avant appel ANE
- [ ] Vérification `settings.modules_enabled.aar` avant appel AAR
- [ ] Vérification `settings.modules_enabled.ad` avant appel AD
- [ ] Vérification `settings.modules_enabled.asr` avant appel ASR
- [ ] Vérification `settings.modules_enabled.aoc` avant appel AOC
- [ ] Si module désactivé → Retourne erreur 400 "Module not enabled"

### 8.4 — Tests

- [ ] Test 1 : Org avec `ai_tone=formal` → Résumé ANE formel
- [ ] Test 2 : Org avec `ai_language=EN` → Résumé ANE en anglais
- [ ] Test 3 : Org avec `modules_enabled.ane=false` → Erreur 400

---

## SECTION 9 : INTÉGRATION UI DESKTOP (20 critères)

### 9.1 — Composant AIInsightsPanel

- [ ] Fichier `components/cockpit/AIInsightsPanel.tsx` créé
- [ ] Props : `projectId`, `organizationId`
- [ ] État : `loading`, `insights`
- [ ] Fonction `generateInsights()` : Appelle `/api/ai/executive-summary`
- [ ] Bouton "Générer" : Déclenche génération
- [ ] Loading state : Affiche "Génération..." (2-5s)

### 9.2 — Affichage Insights

- [ ] Section "Résumé Exécutif" : Headline + keyPoints (liste)
- [ ] Section "Risques Clés" : Cards avec severity badge (HIGH=rouge, MEDIUM=jaune, LOW=vert), title, impact, action
- [ ] Section "Décisions Clés" : Cards avec badge BLOQUANTE si applicable, title, deadline, action
- [ ] Section "Actions Immédiates" : Liste ordonnée (priority 1-5), action, responsible, deadline
- [ ] Section "Insight Stratégique" : Message + recommendation (si présent)

### 9.3 — Design System (PACK 4)

- [ ] Couleurs : bg #111111, border #1E1E1E, text #FFFFFF/#9A9A9A
- [ ] Spacing : 24px sections, 12px cards gap, 16px padding
- [ ] Border radius : 12px panel, 8px cards
- [ ] Icons : Sparkles (#3A82F7), AlertTriangle (#FFB800), CheckSquare (#3A82F7), TrendingUp (#00C853)
- [ ] Typography : 18px titre, 14px texte, 12px détails

### 9.4 — Intégration Page Projet

- [ ] `AIInsightsPanel` intégré dans page détail projet (`/cockpit/projet/[id]`)
- [ ] Positionné en haut (après header projet, avant tabs)
- [ ] Responsive : Affichage correct desktop (1280px+)

### 9.5 — Tests

- [ ] Test 1 : Cliquer "Générer" → Loading 2-5s → Insights affichés
- [ ] Test 2 : Risques HIGH affichés avec badge rouge
- [ ] Test 3 : Décisions bloquantes affichées avec badge BLOQUANTE
- [ ] Test 4 : Actions immédiates numérotées 1-5

---

## SECTION 10 : INTÉGRATION UI MOBILE (PACK 6) (15 critères)

### 10.1 — Composant AIInsightCardMobile

- [ ] Fichier `components/cockpit/mobile/AIInsightCardMobile.tsx` créé
- [ ] Props : `insight` (type, title, description, priority)
- [ ] Dimensions : 100% width, min 72px height, padding 12px 16px
- [ ] Icon : Sparkles 20px (#3A82F7)
- [ ] Priority badge : HIGH (rouge), MEDIUM (jaune), LOW (vert)

### 10.2 — Mobile UX (PACK 6)

- [ ] Tap feedback : opacity 0.9 + transform scale 0.99 (80ms)
- [ ] Border radius : 12px
- [ ] Typography : 14px title (600), 12px description (#9A9A9A)
- [ ] Touch target : ≥44x44px (card entière cliquable)

### 10.3 — Intégration Cockpit Mobile

- [ ] `AIInsightCardMobile` intégré dans page projet mobile (`/cockpit/projet/[id]` mobile)
- [ ] Liste insights : Map sur risks/decisions/actions
- [ ] Scroll vertical : Smooth

### 10.4 — Tests Devices

- [ ] iPhone SE 375px : Affichage correct, lisible
- [ ] iPhone 13 390px : Optimal
- [ ] Android 360px : Min viewport OK
- [ ] Tap feedback visible (opacity change)

### 10.5 — Transitions (PACK 6)

- [ ] Transition opacity : 80ms ease-out
- [ ] Pas de jank (60fps)

---

## SECTION 11 : PERFORMANCE (15 critères)

### 11.1 — Temps Réponse

- [ ] ANE : <5s (95e percentile)
- [ ] AAR : <5s
- [ ] AD : <5s
- [ ] ASR : <10s (rapport long)
- [ ] AOC : <3s (simple)
- [ ] AGA : <5s

### 11.2 — Optimisations

- [ ] Température optimale : 0.2-0.4 (cohérence + rapidité)
- [ ] Max tokens : 2000-3000 (pas plus)
- [ ] Response format JSON activé (parsing rapide)
- [ ] Timeout Next.js : `export const maxDuration = 60;` dans API routes

### 11.3 — Monitoring

- [ ] Execution time loggé dans `ai_audit_logs`
- [ ] Alertes si >10s
- [ ] Retry logic si timeout OpenAI

### 11.4 — Tests Charge

- [ ] 10 appels simultanés ANE → Tous <10s
- [ ] 50 appels en 1 min → Pas de throttle OpenAI

---

## SECTION 12 : SÉCURITÉ & GOUVERNANCE (20 critères)

### 12.1 — Permissions

- [ ] Vérification permissions avant chaque appel IA
- [ ] Roles testés : super_admin (all), admin, chef_projet, contributeur, lecteur
- [ ] 403 Forbidden si permission denied

### 12.2 — Redaction Données Sensibles

- [ ] `sensitive_data_redaction=true` par défaut
- [ ] Fonction `redactSensitiveData` implémentée
- [ ] Keys sensibles : email, password, token, api_key, phone, ssn → [REDACTED]
- [ ] Test : Log avec email → Email = "[REDACTED]" dans `ai_audit_logs`

### 12.3 — Audit Logs

- [ ] Tous appels IA loggés (SUCCESS/ERROR/BLOCKED)
- [ ] Context complet : organizationId, userId, timestamp
- [ ] Input/output data loggés (avec redaction si activé)
- [ ] Retention : 90 jours par défaut (configurable)

### 12.4 — Vérifications Cohérence

- [ ] AGA exécute `checkDataCoherence` quotidiennement (cron job)
- [ ] Anomalies détectées : RAG incohérent, dates incohérentes, owners inexistants
- [ ] Auto-fix appliqué si possible (ex: RAG status recalculé)
- [ ] Alertes admin si anomalies non-fixables

### 12.5 — RLS (Row Level Security)

- [ ] RLS activé sur `organization_settings`
- [ ] RLS activé sur `ai_audit_logs`
- [ ] Policies : Admin uniquement pour settings, Admin uniquement pour logs

### 12.6 — Tests Sécurité

- [ ] Test 1 : User lecteur tente d'appeler ANE → 403 Forbidden
- [ ] Test 2 : User admin d'org A tente d'accéder logs org B → Pas de résultats (RLS)
- [ ] Test 3 : Données sensibles dans input → Redacted dans logs

---

## SECTION 13 : VALIDATION FINALE (15 critères)

### 13.1 — Tests End-to-End

- [ ] Flow complet : User ouvre projet → Génère insights ANE → Affiche résultats → Log créé
- [ ] Flow rapport : Admin génère rapport hebdo ASR → Rapport structuré → Envoyé par email (si configured)
- [ ] Flow onboarding : User nouveau → AOC génère tutoriel → Affiche 3 actions → User crée projet
- [ ] Flow audit : AGA exécute audit quotidien → Détecte 3 anomalies → Auto-fix appliqué → Rapport généré

### 13.2 — Tests Erreurs

- [ ] OpenAI timeout → Erreur 500, log ERROR créé
- [ ] OpenAI quota exceeded → Erreur 429, log ERROR créé
- [ ] Project not found → Erreur 404
- [ ] Module disabled → Erreur 400
- [ ] Permission denied → Erreur 403

### 13.3 — Qualité Code

- [ ] TypeScript : 0 erreurs (`npx tsc --noEmit`)
- [ ] ESLint : 0 warnings
- [ ] Tous types définis (pas de `any`)
- [ ] Code documenté (JSDoc comments sur fonctions principales)

### 13.4 — Documentation

- [ ] README IA ajouté (`docs/AI_README.md`)
- [ ] Guide configuration OpenAI/Azure
- [ ] Exemples appels API
- [ ] Troubleshooting FAQ

### 13.5 — Déploiement

- [ ] Build production : `npm run build` → SUCCESS
- [ ] Variables d'environnement Vercel : `OPENAI_API_KEY` ou `AZURE_OPENAI_*` configurées
- [ ] Déploiement staging : Tests E2E passés
- [ ] Déploiement production : Release Manager approval

---

## SCORING & DÉCISION

### Calcul Score

**Total critères** : 200+

**Score** = (Critères validés ✅ / Total critères) × 100

### Critères de Validation

| Score | Décision | Action |
|-------|----------|--------|
| **100%** | **✅ GO PRODUCTION** | Déploiement immédiat autorisé |
| **95-99%** | **⚠️ GO WITH CONDITIONS** | Déploiement avec corrections mineures (1-2 jours max) |
| **90-94%** | **⚠️ MAJOR ISSUES** | Corrections majeures requises (3-5 jours), re-validation QA |
| **<90%** | **❌ NO-GO** | Rework complet, nouvelle validation complète |

---

## DÉCISION FINALE

**Date** : _______________  
**QA Lead** : _______________  
**Release Manager** : _______________

**Score obtenu** : _____ / 200+ = _____ %

**Décision** :  
☐ GO PRODUCTION  
☐ GO WITH CONDITIONS (détails : ___________________)  
☐ NO-GO (raisons : ___________________)

**Signature QA Lead** : _______________  
**Signature Release Manager** : _______________

---

## ANNEXES

### Annexe A : Tests Manuels Supplémentaires

1. **Test Multi-Langue** :
   - Org FR → Résumés en français ✅
   - Org EN → Résumés en anglais ✅
   - Org DE → Résumés en allemand ✅

2. **Test Multi-Tone** :
   - Org tone=formal → "Nous recommandons..." ✅
   - Org tone=direct → "Recommandation :" ✅

3. **Test Detail Level** :
   - Level 1 : 3 lignes max par section ✅
   - Level 2 : 3-5 lignes ✅
   - Level 3 : 5-7 lignes ✅

### Annexe B : Edge Cases

1. **Projet sans données** :
   - 0 risques, 0 décisions → ANE génère message "Projet sain, aucune action requise"
   - AOC suggère "Ajouter des risques pour meilleure visibilité"

2. **Organisation 100+ projets** :
   - ASR rapport hebdo → Agrège correctement
   - Performance <10s

3. **Dépassement quota OpenAI** :
   - Erreur 429 → Log ERROR
   - Message user : "Service temporairement indisponible, réessayez dans 5 min"

### Annexe C : Rapports à Générer

1. **Rapport QA PACK 7** : Document synthèse validation (à créer après validation complète)
2. **CHANGELOG Technique PACK 7** : Liste toutes modifications/ajouts (VB deliverable)
3. **Rapport Performance IA** : Metrics 48h post-déploiement (monitoring PACK 5)

---

**FIN PACK 7 — CHECKLIST VALIDATION IA**
