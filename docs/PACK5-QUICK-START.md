# PACK 5 — Quick Start Guide

**Powalyze Release Pipeline**  
**Version** : 1.0.0  
**Date** : 29 janvier 2026

---

## 🎯 Vue d'ensemble 30 secondes

**Pipeline de release en 7 étapes** :
```
VB → QA → DevOps → Release Manager → Doc → Support → Monitoring (48h)
```

**Livrable obligatoire** à chaque étape. **Validation explicite** avant passage étape suivante.

---

## 🚀 Pour lancer une release

### 1️⃣ VB (Développement) — 1-5 jours

```bash
# Créer branch feature
git checkout -b feature/pack-[X]-[description]

# Développer
# ... code ...

# Build local
npm run build

# Créer CHANGELOG technique
# Voir template : docs/templates/CHANGELOG-TECHNIQUE.md

# Créer PR
git push origin feature/pack-[X]-[description]
```

**Checklist** : [docs/checklists/CHECKLIST-VB-DEV.md](checklists/CHECKLIST-VB-DEV.md)  
**Livrable** : PR + CHANGELOG technique

---

### 2️⃣ QA (Validation) — 2-4 heures

```bash
# Checkout branch
git checkout feature/pack-[X]-[description]
npm install
npm run dev

# Exécuter tests (voir checklist QA)
# Remplir rapport QA
```

**Checklist** : [docs/checklists/CHECKLIST-QA.md](checklists/CHECKLIST-QA.md)  
**Template** : [docs/templates/RAPPORT-QA.md](templates/RAPPORT-QA.md)  
**Livrable** : Rapport QA (GO/NO-GO)

---

### 3️⃣ DevOps (Déploiement) — 30-60 minutes

```bash
# Appliquer migrations Supabase (si applicable)
# Voir : database/*.sql

# Build production
npm run build

# Déployer staging
git checkout staging
git merge feature/pack-[X]-[description]
vercel --prod --yes

# Tests smoke staging
# (voir checklist DevOps)
```

**Checklist** : [docs/checklists/CHECKLIST-DEVOPS.md](checklists/CHECKLIST-DEVOPS.md)  
**Template** : [docs/templates/DEPLOYMENT-LOG.md](templates/DEPLOYMENT-LOG.md)  
**Livrable** : Deployment log + URL staging

---

### 4️⃣ Release Manager (Validation) — 30-60 minutes

```bash
# Tester staging manuellement
# URL : [staging URL]

# Vérifier documentation
# - CHANGELOG utilisateur
# - Release Notes
# - Support Guide

# Décision GO/NO-GO
```

**Checklist** : [docs/checklists/CHECKLIST-RELEASE-MANAGER.md](checklists/CHECKLIST-RELEASE-MANAGER.md)  
**Template** : [docs/templates/RELEASE-APPROVAL.md](templates/RELEASE-APPROVAL.md)  
**Livrable** : Approval explicite (email + Slack)

---

### 5️⃣ DevOps (Production) — 15-30 minutes

```bash
# Après approval Release Manager
git checkout main
git merge staging
vercel --prod --yes

# Tests smoke production
# Monitoring initial (15 min)
```

**Livrable** : Production deployed + Monitoring actif

---

### 6️⃣ Documentation (Publication) — 1-2 heures

- Publier CHANGELOG utilisateur : Site + GitHub
- Mettre à jour guide utilisateur
- Préparer communication externe (LinkedIn, Twitter)

**Template** : [docs/templates/RELEASE-NOTES.md](templates/RELEASE-NOTES.md)

---

### 7️⃣ Support (Préparation) — 1-2 heures

- Brief équipe support (30 min demo)
- Scripts de support prêts
- FAQ mise à jour

**Template** : [docs/templates/SUPPORT-GUIDE.md](templates/SUPPORT-GUIDE.md)

---

### 8️⃣ Monitoring (48h)

- Dashboard temps réel : Vercel + Supabase
- Alertes automatiques actives
- Équipe disponible

**Template** : [docs/templates/MONITORING-REPORT.md](templates/MONITORING-REPORT.md)

---

## 📦 Templates disponibles

| Rôle | Template | Chemin |
|------|----------|--------|
| VB | CHANGELOG Technique | `docs/templates/CHANGELOG-TECHNIQUE.md` |
| QA | Rapport QA | `docs/templates/RAPPORT-QA.md` |
| DevOps | Deployment Log | `docs/templates/DEPLOYMENT-LOG.md` |
| Release Manager | Release Approval | `docs/templates/RELEASE-APPROVAL.md` |
| Documentation | Release Notes | `docs/templates/RELEASE-NOTES.md` |
| Support | Support Guide | `docs/templates/SUPPORT-GUIDE.md` |
| Monitoring | Monitoring Report | `docs/templates/MONITORING-REPORT.md` |

---

## ✅ Checklists disponibles

| Rôle | Checklist | Chemin |
|------|-----------|--------|
| VB | Checklist Développement | `docs/checklists/CHECKLIST-VB-DEV.md` |
| QA | Checklist QA | `docs/checklists/CHECKLIST-QA.md` |
| DevOps | Checklist Déploiement | `docs/checklists/CHECKLIST-DEVOPS.md` |
| Release Manager | Checklist Validation | `docs/checklists/CHECKLIST-RELEASE-MANAGER.md` |

---

## 🛠️ Scripts automatiques

| Script | Usage | Chemin |
|--------|-------|--------|
| check-build | Vérifie build production | `scripts/check-build.ps1` |
| check-env | Vérifie variables environnement | `scripts/check-env.ps1` |
| deploy-staging | Déploie sur staging | `scripts/deploy-staging.ps1` |
| deploy-production | Déploie production | `scripts/deploy-production.ps1` |
| rollback | Rollback automatique | `scripts/rollback.ps1` |

**Usage** :
```powershell
# Build check
.\scripts\check-build.ps1

# Déployer staging
.\scripts\deploy-staging.ps1 -branch "feature/pack-5-pipeline"

# Déployer production (après approval)
.\scripts\deploy-production.ps1
```

---

## 🚨 Critères de validation (Gates)

### Gate 1 : DEV → QA
- ✅ PR créée
- ✅ Build local réussi
- ✅ Zéro warning console
- ✅ CHANGELOG technique à jour

### Gate 2 : QA → DevOps
- ✅ Tous tests critiques passent
- ✅ Rapport QA : PASS
- ✅ Pas de régression visuelle
- ✅ Mobile UX conforme

### Gate 3 : DevOps → Release Manager
- ✅ Build production réussi
- ✅ Staging accessible
- ✅ Migrations SQL OK
- ✅ Tests smoke OK

### Gate 4 : Release Manager → Production
- ✅ Staging validé manuellement
- ✅ Documentation prête
- ✅ Approval explicite
- ✅ Support briefée

---

## 📣 Communication

### Interne
- **Email équipe** : "[RELEASE] Version [X.Y.Z] - [Date]"
- **Slack #releases** : Annonce + Updates temps réel
- **Brief support** : Demo 30 min

### Externe
- **CHANGELOG public** : Site + GitHub
- **Post LinkedIn** : Annonce features
- **Newsletter** : Si feature majeure

---

## 🔄 Rollback

**Trigger automatique si** :
- ❌ Downtime > 5 min
- ❌ Taux d'erreur > 10%
- ❌ Latence > 3s

**Procédure** :
```powershell
# Rollback Vercel
.\scripts\rollback.ps1 -deploymentId "[ID]"

# Revert migrations Supabase
# (SQL rollback script)

# Communication
# Slack #incidents + Email users
```

---

## 📊 Métriques critiques (48h)

| Métrique | Seuil OK | Seuil WARNING |
|----------|----------|---------------|
| Uptime | > 99.9% | < 99.9% |
| Latence P95 | < 300ms | > 500ms |
| Taux d'erreur | < 1% | > 5% |
| INP | < 200ms | > 300ms |

---

## 🆘 Escalation

| Niveau | Contact | Délai |
|--------|---------|-------|
| P1 (Downtime) | Release Manager | Immédiat |
| P2 (Bug critique) | DevOps + VB | < 1h |
| P3 (Bug majeur) | VB | < 4h |
| P4 (Bug mineur) | VB | < 24h |

---

## 📚 Documentation complète

- **Pipeline complet** : [docs/PACK5-RELEASE-PIPELINE.md](PACK5-RELEASE-PIPELINE.md)
- **Templates** : [docs/templates/](templates/)
- **Checklists** : [docs/checklists/](checklists/)
- **Scripts** : [scripts/](../scripts/)

---

## 🎓 Formation

### Pour VB
1. Lire [PACK5-RELEASE-PIPELINE.md](PACK5-RELEASE-PIPELINE.md) (section VB)
2. Lire [CHECKLIST-VB-DEV.md](checklists/CHECKLIST-VB-DEV.md)
3. Voir template [CHANGELOG-TECHNIQUE.md](templates/CHANGELOG-TECHNIQUE.md)

### Pour QA
1. Lire [PACK5-RELEASE-PIPELINE.md](PACK5-RELEASE-PIPELINE.md) (section QA)
2. Lire [CHECKLIST-QA.md](checklists/CHECKLIST-QA.md)
3. Voir template [RAPPORT-QA.md](templates/RAPPORT-QA.md)

### Pour DevOps
1. Lire [PACK5-RELEASE-PIPELINE.md](PACK5-RELEASE-PIPELINE.md) (section DevOps)
2. Lire [CHECKLIST-DEVOPS.md](checklists/CHECKLIST-DEVOPS.md)
3. Tester scripts : [scripts/](../scripts/)

### Pour Release Manager
1. Lire [PACK5-RELEASE-PIPELINE.md](PACK5-RELEASE-PIPELINE.md) (complet)
2. Lire [CHECKLIST-RELEASE-MANAGER.md](checklists/CHECKLIST-RELEASE-MANAGER.md)
3. Comprendre escalation matrix

---

## ❓ FAQ

**Q : Combien de temps prend une release complète ?**  
A : 2-7 jours selon complexité : DEV (1-5j) + QA (2-4h) + DevOps (1h) + Monitoring (48h)

**Q : Peut-on skip une étape ?**  
A : **NON**. Toutes les étapes sont obligatoires pour garantir la qualité.

**Q : Que faire si QA trouve un bug P1 ?**  
A : NO-GO. Retour VB, fix, nouvelle validation QA.

**Q : Peut-on déployer sans approval Release Manager ?**  
A : **NON**. Approval explicite obligatoire.

**Q : Combien de temps surveille-t-on post-release ?**  
A : **48h** minimum avec équipe disponible.

---

## 🚀 Premier lancement

**Checklist initiale** :
1. [ ] Tous les templates téléchargés
2. [ ] Tous les scripts installés
3. [ ] Équipe formée (VB, QA, DevOps, Release Manager)
4. [ ] Slack #releases créé
5. [ ] Dashboard monitoring configuré
6. [ ] Vercel + Supabase access OK

**Test run** : Faire une release test (ex: PACK 0 - Test) pour valider le pipeline.

---

**Prêt à lancer votre première release ?**

➡️ Commencez par lire [PACK5-RELEASE-PIPELINE.md](PACK5-RELEASE-PIPELINE.md)

**Questions ?** Slack #releases ou email release-manager@powalyze.com

---

**Version** : 1.0.0  
**Dernière mise à jour** : 29/01/2026
