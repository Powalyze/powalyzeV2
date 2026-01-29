# Rapport QA - Version [X.Y.Z]

**Date** : [JJ/MM/AAAA]  
**QA Engineer** : [Nom]  
**Branch testée** : `feature/pack-[X]-[description]`  
**Environnement** : [Local/Staging]  
**URL staging** : [URL] (si applicable)

---

## 📋 Résumé Exécutif

### Statut global
- ✅ **PASS** : Prêt pour production
- ⚠️ **PASS WITH WARNINGS** : Problèmes mineurs identifiés
- ❌ **FAIL** : Problèmes bloquants, retour DEV requis

### Métriques
- **Tests effectués** : [X] / [Y]
- **Tests réussis** : [X] ✅
- **Tests échoués** : [Y] ❌
- **Warnings** : [Z] ⚠️

### Recommandation
- [ ] ✅ Approuvé pour production
- [ ] ⚠️ Approuvé avec réserves (détails ci-dessous)
- [ ] ❌ Non approuvé - Retour DEV requis

---

## 🧪 Tests Fonctionnels

### 1. Routes Vitrine
| Route | Status | Notes |
|-------|--------|-------|
| `/` (homepage) | ✅/❌ | [Commentaires] |
| `/fonctionnalites` | ✅/❌ | |
| `/tarifs` | ✅/❌ | |
| `/expertise` | ✅/❌ | |
| `/resultats` | ✅/❌ | |
| `/contact` | ✅/❌ | |
| `/a-propos` | ✅/❌ | |

### 2. Routes Cockpit
| Route | DEMO | LIVE | Notes |
|-------|------|------|-------|
| `/cockpit` | ✅/❌ | ✅/❌ | |
| `/cockpit/projets` | ✅/❌ | ✅/❌ | |
| `/cockpit/risques` | ✅/❌ | ✅/❌ | |
| `/cockpit/decisions` | ✅/❌ | ✅/❌ | |
| `/cockpit/ressources` | ✅/❌ | ✅/❌ | |
| `/cockpit/rapports` | ✅/❌ | ✅/❌ | |

### 3. Authentication
| Test | Status | Notes |
|------|--------|-------|
| Login avec email/password | ✅/❌ | |
| Login avec client code | ✅/❌ | |
| Logout | ✅/❌ | |
| Token expiration (24h) | ✅/❌ | |
| Protected routes (redirect) | ✅/❌ | |

### 4. DEMO vs LIVE Mode
| Test | Status | Notes |
|------|--------|-------|
| Badge "Mode Démo" visible en DEMO | ✅/❌ | |
| Données demo isolées | ✅/❌ | |
| Données LIVE isolées par organization_id | ✅/❌ | |
| Switch DEMO → LIVE fonctionne | ✅/❌ | |

---

## 📱 Tests Mobile

### Responsive (viewports testés)
- [ ] **320px** (iPhone SE) : ✅/❌ [Notes]
- [ ] **375px** (iPhone 12/13) : ✅/❌
- [ ] **414px** (iPhone 14 Pro Max) : ✅/❌
- [ ] **768px** (iPad portrait) : ✅/❌
- [ ] **1024px** (iPad landscape) : ✅/❌

### UX Mobile
| Test | Status | Notes |
|------|--------|-------|
| Bottom navigation visible | ✅/❌ | |
| Thumb zones respectées (> 48px) | ✅/❌ | |
| Scroll fluide | ✅/❌ | |
| Touch targets suffisants | ✅/❌ | |
| Pas de contenu coupé | ✅/❌ | |

---

## 🎨 Tests Visuels

### Design System
| Test | Status | Notes |
|------|--------|-------|
| Couleurs conformes (tokens Tailwind) | ✅/❌ | |
| Typography conforme | ✅/❌ | |
| Spacing cohérent (4px grid) | ✅/❌ | |
| Composants UI réutilisés | ✅/❌ | |

### Animations & Transitions
| Test | Status | Notes |
|------|--------|-------|
| Transitions fluides (< 300ms) | ✅/❌ | |
| Pas d'animations saccadées | ✅/❌ | |
| Active states (scale-95, etc.) | ✅/❌ | |
| Loading states visibles | ✅/❌ | |

---

## 🌐 Tests i18n (Internationalisation)

### Français (FR)
| Section | Status | Notes |
|---------|--------|-------|
| Header/Navigation | ✅/❌ | |
| Empty states | ✅/❌ | |
| Buttons/CTAs | ✅/❌ | |
| Forms | ✅/❌ | |
| Error messages | ✅/❌ | |

### Anglais (EN)
| Section | Status | Notes |
|---------|--------|-------|
| Header/Navigation | ✅/❌ | |
| Empty states | ✅/❌ | |
| Buttons/CTAs | ✅/❌ | |
| Forms | ✅/❌ | |
| Error messages | ✅/❌ | |

---

## 🗄️ Tests Supabase (LIVE Mode)

### Tables
| Table | RLS activé | Policies testées | Status |
|-------|------------|------------------|--------|
| `organizations` | ✅/❌ | SELECT, INSERT | ✅/❌ |
| `user_profiles` | ✅/❌ | SELECT, UPDATE | ✅/❌ |
| `memberships` | ✅/❌ | SELECT, INSERT | ✅/❌ |
| `projects` | ✅/❌ | SELECT, INSERT, UPDATE, DELETE | ✅/❌ |
| `risks` | ✅/❌ | SELECT, INSERT, UPDATE, DELETE | ✅/❌ |
| `decisions` | ✅/❌ | SELECT, INSERT, UPDATE, DELETE | ✅/❌ |

### Isolation multi-tenant
| Test | Status | Notes |
|------|--------|-------|
| User A ne voit que ses données | ✅/❌ | |
| User B ne voit que ses données | ✅/❌ | |
| Pas de leakage entre organizations | ✅/❌ | |

---

## ⚡ Tests Performance

### Lighthouse (Desktop)
| Métrique | Score | Seuil | Status |
|----------|-------|-------|--------|
| Performance | [X]/100 | > 90 | ✅/❌ |
| Accessibility | [X]/100 | > 90 | ✅/❌ |
| Best Practices | [X]/100 | > 90 | ✅/❌ |
| SEO | [X]/100 | > 90 | ✅/❌ |

### Core Web Vitals
| Métrique | Valeur | Seuil | Status |
|----------|--------|-------|--------|
| LCP (Largest Contentful Paint) | [X.X]s | < 2.5s | ✅/❌ |
| FID (First Input Delay) | [X]ms | < 100ms | ✅/❌ |
| CLS (Cumulative Layout Shift) | [0.XX] | < 0.1 | ✅/❌ |
| INP (Interaction to Next Paint) | [X]ms | < 200ms | ✅/❌ |

### Lighthouse (Mobile)
| Métrique | Score | Seuil | Status |
|----------|-------|-------|--------|
| Performance | [X]/100 | > 80 | ✅/❌ |

---

## 🌐 Tests Cross-Browser

### Desktop
| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | [XX] | ✅/❌ | |
| Firefox | [XX] | ✅/❌ | |
| Safari | [XX] | ✅/❌ | |
| Edge | [XX] | ✅/❌ | |

### Mobile
| Browser | Device | Status | Notes |
|---------|--------|--------|-------|
| Safari | iPhone [model] | ✅/❌ | |
| Chrome | Android [model] | ✅/❌ | |

---

## ♿ Tests Accessibilité

### Keyboard Navigation
| Test | Status | Notes |
|------|--------|-------|
| Tab navigation fonctionne | ✅/❌ | |
| Focus visible | ✅/❌ | |
| Escape ferme modals | ✅/❌ | |
| Enter submit forms | ✅/❌ | |

### Screen Readers
| Test | Status | Notes |
|------|--------|-------|
| aria-labels présents | ✅/❌ | |
| alt text sur images | ✅/❌ | |
| Landmarks ARIA | ✅/❌ | |

### Contraste
| Test | Status | Notes |
|------|--------|-------|
| Ratio text/background > 4.5:1 | ✅/❌ | |
| Focus states visibles | ✅/❌ | |

---

## 🐛 Bugs Identifiés

### Bugs Bloquants (P1) ❌
#### Bug 1 : [Titre bug]
- **Sévérité** : P1 (Bloquant)
- **Description** : [Description détaillée]
- **Steps to reproduce** :
  1. [Étape 1]
  2. [Étape 2]
  3. [Résultat observé]
- **Expected** : [Résultat attendu]
- **Screenshot** : [chemin/screenshot.png]
- **Browser** : [Chrome/Firefox/etc.]
- **Device** : [Desktop/Mobile]

### Bugs Majeurs (P2) ⚠️
#### Bug 2 : [Titre bug]
- **Sévérité** : P2 (Majeur, contournable)
- **Description** : [...]
- **Workaround** : [Solution temporaire]

### Bugs Mineurs (P3) ℹ️
#### Bug 3 : [Titre bug]
- **Sévérité** : P3 (Mineur, cosmétique)
- **Description** : [...]

---

## ✅ Checklist Finale

### Code
- [ ] Build production réussi (0 erreurs)
- [ ] TypeScript strict mode : 0 erreurs
- [ ] Pas de warning console
- [ ] Pas de `console.log` oublié

### Fonctionnel
- [ ] Toutes les routes accessibles
- [ ] DEMO mode fonctionne
- [ ] LIVE mode fonctionne (si configuré)
- [ ] Authentication fonctionne
- [ ] RLS Supabase activé et testé

### UX
- [ ] Mobile UX conforme (< 768px)
- [ ] Responsive (320px - 2560px)
- [ ] Animations fluides
- [ ] Loading states visibles

### i18n
- [ ] Micro-copies FR complètes
- [ ] Micro-copies EN complètes

### Performance
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] Lighthouse > 90 (desktop)

### Accessibilité
- [ ] Keyboard navigation OK
- [ ] Contraste suffisant
- [ ] aria-labels présents

---

## 📸 Screenshots

### Test réussi
![Test réussi](screenshots/test-success.png)

### Bug identifié
![Bug](screenshots/bug-1.png)

---

## 📝 Notes Complémentaires

### Points d'attention
- ⚠️ [Point 1]
- ⚠️ [Point 2]

### Recommandations
- 💡 [Recommandation 1]
- 💡 [Recommandation 2]

---

## ✍️ Signature

**QA Engineer** : [Nom]  
**Date** : [JJ/MM/AAAA]  
**Statut final** : ✅ PASS / ⚠️ PASS WITH WARNINGS / ❌ FAIL

---

## 🔄 Next Steps

### Si PASS ✅
→ Passage DevOps pour déploiement staging

### Si PASS WITH WARNINGS ⚠️
→ Passage DevOps avec monitoring des warnings en production

### Si FAIL ❌
→ Retour DEV avec liste bugs bloquants (P1)
