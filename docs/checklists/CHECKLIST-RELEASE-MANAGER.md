# Checklist Release Manager - PACK 5

**Rôle** : Release Manager  
**Objectif** : Valider staging, autoriser production, gérer communication

---

## ✅ PRÉ-VALIDATION

### Documents requis reçus
- [ ] **QA Report** : `docs/reports/RAPPORT-QA-[VERSION].md`
- [ ] **Deployment Log** : `docs/reports/DEPLOYMENT-LOG-[VERSION].md`
- [ ] **CHANGELOG Technique** : `CHANGELOG-TECHNIQUE.md`
- [ ] **Release Notes** : `docs/RELEASE-NOTES-[VERSION].md` (draft)
- [ ] **Support Guide** : `docs/SUPPORT-GUIDE-[VERSION].md` (draft)

### Status des équipes
- [ ] **QA** : ✅ PASS (tous tests critiques OK)
- [ ] **DevOps** : ✅ Staging déployé et fonctionnel
- [ ] **VB** : ✅ Code prêt, CHANGELOG à jour
- [ ] **Support** : ⚠️ Préparation en cours (briefing planifié)

---

## 🔍 VALIDATION STAGING

### URL Staging
**URL** : [https://staging.powalyze.com]  
**Deployment ID** : [ID Vercel]  
**Commit** : [hash]

### Tests manuels critiques

#### Parcours 1 : Homepage → Login → Cockpit
- [ ] Homepage charge (< 3s)
- [ ] Navbar fonctionnelle
- [ ] Login avec email/password fonctionne
- [ ] Redirect vers `/cockpit` après login
- [ ] Cockpit affiche dashboard (DEMO ou LIVE)

#### Parcours 2 : Création projet (LIVE)
- [ ] Bouton "Nouveau projet" visible
- [ ] Modal s'ouvre avec formulaire
- [ ] Champs : Nom (requis), Description, Budget
- [ ] Validation : Nom vide → bouton désactivé
- [ ] Submit : Projet créé et visible instantanément
- [ ] Toast feedback : "Projet créé" visible

#### Parcours 3 : Mobile (< 768px)
- [ ] Bottom navigation visible
- [ ] Header responsive
- [ ] Cartes projets adaptées (1 colonne)
- [ ] Touch targets > 48px
- [ ] Scroll fluide
- [ ] Pas de contenu coupé

#### Parcours 4 : i18n FR/EN
- [ ] Switch langue (si disponible)
- [ ] Textes FR corrects
- [ ] Textes EN corrects
- [ ] Pas de clés i18n visibles (`copy.key.value`)

#### Parcours 5 : Nouvelles features (PACK X)
- [ ] Feature 1 : [Description test]
- [ ] Feature 2 : [Description test]
- [ ] Feature 3 : [Description test]

### Bugs identifiés

#### Bugs bloquants (P1) ❌
- [Aucun] / [Liste bugs]

**Si bugs P1** → ❌ **NO-GO** : Retour DevOps/VB

#### Bugs majeurs (P2) ⚠️
- [Aucun] / [Liste bugs avec workaround]

**Si bugs P2** → ⚠️ **GO WITH CONDITIONS** : Monitoring renforcé

#### Bugs mineurs (P3) ℹ️
- [Aucun] / [Liste bugs cosmétiques]

**Si bugs P3 seulement** → ✅ **GO** : Suivi post-release

---

## 📊 VALIDATION QA REPORT

### Métriques QA
- **Tests effectués** : [X] / [Y]
- **Tests réussis** : [X] ✅
- **Tests échoués** : [Y] ❌
- **Status QA** : ✅ PASS / ⚠️ PASS WITH WARNINGS / ❌ FAIL

### Tests critiques

#### Fonctionnel
- [ ] Toutes les routes accessibles : ✅
- [ ] DEMO mode fonctionne : ✅
- [ ] LIVE mode fonctionne : ✅ (si configuré)
- [ ] Authentication : ✅
- [ ] RLS Supabase : ✅

#### Performance
- [ ] LCP < 2.5s : ✅ ([X.X]s)
- [ ] INP < 200ms : ✅ ([X]ms)
- [ ] Lighthouse > 90 : ✅ ([score])

#### Cross-browser
- [ ] Chrome : ✅
- [ ] Firefox : ✅
- [ ] Safari : ✅
- [ ] Edge : ✅

#### Mobile
- [ ] iPhone (< 768px) : ✅
- [ ] Android (< 768px) : ✅
- [ ] Responsive (320px - 2560px) : ✅

---

## 📝 VALIDATION DOCUMENTATION

### Release Notes (utilisateur)
- [ ] **Fichier créé** : `docs/RELEASE-NOTES-[VERSION].md`
- [ ] **Section "Nouveautés"** : Complète et claire
- [ ] **Section "Améliorations"** : Listées
- [ ] **Section "Corrections"** : Bugs résolus listés
- [ ] **Breaking changes** : Documentés si applicable
- [ ] **Screenshots** : Ajoutés pour features visuelles
- [ ] **Migration guide** : Créé si breaking changes
- [ ] **Tone** : Orienté utilisateur (bénéfices, pas technique)

### Support Guide
- [ ] **Scripts de support** : Créés pour nouvelles features
- [ ] **FAQ** : Questions anticipées répondues
- [ ] **Troubleshooting** : Procédures de debug
- [ ] **Escalation matrix** : À jour

### Documentation technique
- [ ] **CHANGELOG technique** : À jour
- [ ] **API documentation** : Mise à jour si nouveaux endpoints
- [ ] **Architecture** : Mise à jour si changements

---

## ⚠️ BREAKING CHANGES

### Présence de breaking changes ?
- [ ] ✅ **OUI** : [Détails ci-dessous]
- [ ] ❌ **NON**

### Si OUI, validation obligatoire :
- [ ] **Migration guide** : Créé et clair
- [ ] **Communication users** : Email prévu avant release
- [ ] **Deprecation warnings** : Ajoutés dans le code (si applicable)
- [ ] **Support préparé** : Scripts pour aider migration

---

## 🛠️ VALIDATION DEVOPS

### Build & Deployment
- [ ] **Build production** : ✅ Success (0 erreurs)
- [ ] **TypeScript** : ✅ 0 erreurs
- [ ] **Routes generated** : [nombre]
- [ ] **Staging URL** : Accessible et fonctionnel
- [ ] **Tests smoke staging** : ✅ Tous passent

### Migrations Supabase
- [ ] **Migrations appliquées** : ✅
- [ ] **Backup pré-migration** : ✅ Créé
- [ ] **RLS activé** : ✅ Vérifié sur toutes les tables
- [ ] **Tests isolation** : ✅ Pas de leakage multi-tenant

### Logs & Monitoring
- [ ] **Logs staging** : Pas d'erreurs critiques
- [ ] **Monitoring configuré** : ✅ Dashboard + alertes
- [ ] **Rollback plan** : ✅ Préparé et testé

---

## 👥 VALIDATION SUPPORT

### Support Team Readiness
- [ ] **Brief planifié** : Date [JJ/MM/AAAA] HH:MM
- [ ] **Scripts de support** : ✅ Prêts
- [ ] **FAQ** : ✅ Mise à jour
- [ ] **Équipe disponible** : ✅ 48h post-release

---

## 🔄 ROLLBACK PLAN

### Rollback Ready ?
- [ ] ✅ **OUI** : [Procédure ci-dessous]
- [ ] ❌ **NON** → ❌ **NO-GO**

### Procédure rollback
```bash
# 1. Revert Vercel deployment
vercel rollback [deployment-id]

# 2. Revert Supabase migrations (si applicable)
[SQL rollback script disponible]

# 3. Communication
[Template Slack #incidents + Email users préparé]
```

### Critères rollback automatique
- ❌ Downtime > 5 min
- ❌ Taux d'erreur > 10%
- ❌ Latence moyenne > 3s
- ❌ Incident critique (P1)

### Équipe rollback
- [ ] **DevOps** : Disponible 24h post-release
- [ ] **VB** : En standby pour fix rapide
- [ ] **Release Manager** : Monitoring actif

---

## 📣 COMMUNICATION PLAN

### Communication Interne

#### Avant release
- [ ] **Email équipe** : "[RELEASE] Version [X.Y.Z] - [Date]"
  ```
  Subject: [RELEASE] Version [X.Y.Z] - [Date]
  
  Team,
  
  Nous déployons la version [X.Y.Z] le [Date] à [Heure].
  
  Features principales :
  - [Feature 1]
  - [Feature 2]
  - [Feature 3]
  
  Breaking changes : [OUI/NON]
  Downtime attendu : [X min] / Aucun
  
  Support team briefing : [Date] [Heure]
  Monitoring actif : 48h post-release
  
  Questions ? Slack #releases
  
  [Signature]
  ```

- [ ] **Slack announcement** : #releases
  ```
  🚀 RELEASE [X.Y.Z] - [Date] [Heure]
  
  ✨ Nouveautés :
  - [Feature 1]
  - [Feature 2]
  
  ⚠️ Breaking changes : [OUI/NON]
  📊 Status : Monitoring actif 48h
  
  Staging : [URL]
  Production : Après approval
  ```

- [ ] **Brief support team** : Planifié [Date] [Heure]

#### Pendant release
- [ ] **Updates temps réel** : Slack #releases
- [ ] **Status updates** : Toutes les 30 min si problème

#### Après release
- [ ] **Recap email** : Succès + Métriques + Feedback
- [ ] **Post-mortem** : Si incident (dans les 48h)

### Communication Externe

#### Avant release (si breaking changes)
- [ ] **Email users** : "Nouveautés à venir + Migration guide"
- [ ] **Blog post** : Annonce (si feature majeure)

#### Après release
- [ ] **CHANGELOG public** : Site web + GitHub
- [ ] **Post LinkedIn** : [Draft préparé]
- [ ] **Post Twitter** : [Draft préparé]
- [ ] **Newsletter** : Si feature majeure

---

## 🎯 DECISION MATRIX

### Checklist pré-approval COMPLÈTE
- [ ] ✅ Staging validé manuellement
- [ ] ✅ QA Report : PASS
- [ ] ✅ Pas de bugs bloquants (P1)
- [ ] ✅ Documentation complète
- [ ] ✅ Support team prête
- [ ] ✅ Monitoring configuré
- [ ] ✅ Rollback plan prêt
- [ ] ✅ Communication préparée

### Critères GO/NO-GO

#### ✅ GO si :
- ✅ Tous les tests critiques passent
- ✅ Pas de bug bloquant (P1)
- ✅ Documentation complète
- ✅ Support prêt
- ✅ Rollback plan prêt
- ✅ Monitoring actif

#### ⚠️ GO WITH CONDITIONS si :
- ⚠️ Bugs P2 avec workaround
- ⚠️ Monitoring renforcé requis
- ⚠️ Support en alerte

#### ❌ NO-GO si :
- ❌ Bug bloquant (P1) identifié
- ❌ Tests critiques échouent
- ❌ Documentation incomplète
- ❌ Support non prêt
- ❌ Pas de rollback plan

---

## 🚦 DECISION FINALE

### Status
- [ ] ✅ **GO PRODUCTION** - Release approuvée
- [ ] ⚠️ **GO WITH CONDITIONS** - Approuvée avec réserves
- [ ] ❌ **NO-GO** - Release refusée

---

### Si ✅ GO PRODUCTION

**Autorisation explicite à envoyer** :

```
✅ RELEASE APPROVED FOR PRODUCTION

Version : [X.Y.Z]
Release date : [JJ/MM/AAAA]
Release time : [HH:MM]

Features :
- [Feature 1]
- [Feature 2]
- [Feature 3]

Breaking changes : [OUI/NON]
Downtime attendu : [X min] / Aucun
Rollback plan : ✅ READY
Monitoring : ✅ ACTIVE 48h
Communication : ✅ PREPARED

QA Status : ✅ PASS
Staging : ✅ VALIDATED
Support : ✅ READY

Release Manager : [Nom]
Date : [JJ/MM/AAAA HH:MM]
Signature : [Signature]

🚀 DevOps autorisé à déployer en production
```

**Envoi** :
- [ ] Email DevOps + équipe
- [ ] Slack #releases
- [ ] Ticket release (si applicable)

**Next step** : DevOps déploie en production

---

### Si ⚠️ GO WITH CONDITIONS

**Conditions à respecter** :
1. [Condition 1]
2. [Condition 2]
3. [Condition 3]

**Monitoring renforcé** :
- [ ] [Point 1 à surveiller]
- [ ] [Point 2 à surveiller]

**Seuils d'alerte abaissés** :
- Latence : > 500ms (au lieu de > 1s)
- Erreurs : > 2% (au lieu de > 5%)

**Équipe en alerte** : Support + DevOps + VB en standby

---

### Si ❌ NO-GO

**Raisons** :
1. [Raison 1]
2. [Raison 2]
3. [Raison 3]

**Actions requises avant nouvelle validation** :
- [ ] [Action 1]
- [ ] [Action 2]
- [ ] [Action 3]

**Nouvelle validation prévue** : [Date]

**Communication équipe** :
```
❌ RELEASE [X.Y.Z] - NO-GO

Raisons :
- [Raison 1]
- [Raison 2]

Actions requises :
- [Action 1]
- [Action 2]

Nouvelle validation : [Date]

Merci pour votre travail. Nous reprenons dès que les blockers sont levés.

[Signature]
```

---

## 📊 POST-APPROVAL MONITORING

### Monitoring 48h
- [ ] **Dashboard configuré** : Vercel + Supabase
- [ ] **Alertes actives** : Email + Slack
- [ ] **Équipe disponible** : DevOps + Support + VB
- [ ] **Check points** :
  - [ ] +15 min post-release
  - [ ] +1h post-release
  - [ ] +6h post-release
  - [ ] +24h post-release
  - [ ] +48h post-release

### Métriques à surveiller
| Métrique | Seuil OK | Seuil WARNING | Action |
|----------|----------|---------------|--------|
| Uptime | > 99.9% | < 99.9% | Alert team |
| Latence P95 | < 300ms | > 500ms | Investigate |
| Taux d'erreur | < 1% | > 5% | Rollback |
| INP | < 200ms | > 300ms | Monitor |

---

## 📝 NOTES POST-DECISION

### Feedback QA
```
[Commentaires QA Engineer]
```

### Feedback DevOps
```
[Commentaires DevOps Engineer]
```

### Points d'attention post-release
- ⚠️ [Point 1]
- ⚠️ [Point 2]

### Recommandations futures
- 💡 [Recommandation 1]
- 💡 [Recommandation 2]

---

## ✅ CRITÈRES DE SORTIE

### Validation complète
- ✅ Staging validé manuellement (tous parcours critiques OK)
- ✅ QA Report lu et analysé
- ✅ Documentation validée (Release Notes + Support Guide)
- ✅ Rollback plan vérifié
- ✅ Communication préparée (interne + externe)
- ✅ Approval explicite envoyée (email + Slack)

### Documentation créée
- ✅ `RELEASE-APPROVAL-[VERSION].md` rempli
- ✅ Email approval envoyé
- ✅ Slack announcement posté
- ✅ Équipe notifiée

---

## 🔗 RESSOURCES

- **Staging URL** : [URL]
- **QA Report** : `docs/reports/RAPPORT-QA-[VERSION].md`
- **Deployment Log** : `docs/reports/DEPLOYMENT-LOG-[VERSION].md`
- **Release Notes** : `docs/RELEASE-NOTES-[VERSION].md`
- **Support Guide** : `docs/SUPPORT-GUIDE-[VERSION].md`
- **Vercel Dashboard** : [URL]
- **Supabase Dashboard** : [URL]

---

**Version** : PACK 5  
**Dernière mise à jour** : 29/01/2026
