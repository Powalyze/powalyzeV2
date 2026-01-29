# PACK 6 — Mobile Validation Checklist

**Powalyze - Checklist de validation mobile complète**  
**Pour QA + Release Manager**  
**Version** : 1.0.0  
**Date** : 29 janvier 2026

---

## 🎯 OBJECTIF

Cette checklist garantit que le cockpit mobile Powalyze respecte **100% des critères** définis dans PACK 6.

**Critères de réussite** : ✅ Tous les items cochés

---

## ✅ SECTION 1 — STRUCTURE & LAYOUT

### 1.1 Header Mobile
- [ ] Hauteur = 56px
- [ ] Padding horizontal = 16px
- [ ] Padding vertical = 12px
- [ ] Titre = "Powalyze" (16px, blanc, bold)
- [ ] Sous-titre = "Cockpit exécutif" (12px, gris #6A6A6A)
- [ ] Bordure basse = 1px solid #1E1E1E
- [ ] Position = sticky top
- [ ] Background = #0A0A0A
- [ ] z-index = 100

### 1.2 Main Content
- [ ] Height = calc(100vh - 56px - 64px)
- [ ] Padding horizontal = 16px
- [ ] Padding vertical = 12px
- [ ] Overflow-y = scroll
- [ ] Overflow-x = hidden
- [ ] Background = #0A0A0A
- [ ] Smooth scrolling activé
- [ ] -webkit-overflow-scrolling: touch

### 1.3 Bottom Navigation
- [ ] Hauteur = 64px
- [ ] Padding = 8px
- [ ] 4 onglets visibles (Projets, Risques, Décisions, Profil)
- [ ] Icônes Lucide 24px
- [ ] Labels 11px
- [ ] Actif = bleu #3A82F7
- [ ] Inactif = gris #6A6A6A
- [ ] Position = fixed bottom
- [ ] Bordure top = 1px solid #1E1E1E
- [ ] z-index = 100

---

## ✅ SECTION 2 — COMPOSANTS MOBILES

### 2.1 ProjectCard Mobile
- [ ] Largeur = 100%
- [ ] Hauteur = 88-120px (auto selon contenu)
- [ ] Padding = 16px
- [ ] Border-radius = 12px
- [ ] Background = #111111
- [ ] Border = 1px solid #1E1E1E
- [ ] Margin-bottom = 12px
- [ ] Titre = 16px blanc bold
- [ ] Sous-titre = 14px gris #6A6A6A
- [ ] Statistiques = 12px avec icônes 14px
- [ ] Tap feedback = opacity 90% pendant 80ms
- [ ] Transform scale 0.99 au tap

### 2.2 RiskCard Mobile
- [ ] Largeur = 100%
- [ ] Hauteur = 72-96px
- [ ] Padding = 12px 16px
- [ ] Border-radius = 8px
- [ ] Titre = 15px blanc
- [ ] Badge sévérité conforme (HIGH/MEDIUM/LOW)
- [ ] Badge statut conforme
- [ ] Tap feedback actif

### 2.3 DecisionCard Mobile
- [ ] Largeur = 100%
- [ ] Hauteur = 72-96px
- [ ] Padding = 12px 16px
- [ ] Border-radius = 8px
- [ ] Titre = 15px blanc
- [ ] Owner badge avec icône User 14px
- [ ] Badge statut conforme (PENDING/APPROVED/REJECTED)
- [ ] Tap feedback actif

### 2.4 EmptyStateLive Mobile
- [ ] Centré verticalement
- [ ] Icône Briefcase 64px bleu #3A82F7
- [ ] Titre = 20px blanc bold
- [ ] Sous-titre = 14px gris #6A6A6A
- [ ] CTA = bouton blanc fond, texte noir
- [ ] CTA width = 100%
- [ ] CTA padding = 14px 24px
- [ ] CTA border-radius = 8px
- [ ] Tap feedback sur CTA

---

## ✅ SECTION 3 — INTERACTIONS & TRANSITIONS

### 3.1 Tap Feedback
- [ ] Tous les boutons ont tap feedback
- [ ] Toutes les cartes ont tap feedback
- [ ] Durée feedback = 80ms
- [ ] Opacity = 90%
- [ ] Transform scale = 0.98-0.99
- [ ] -webkit-tap-highlight-color: transparent

### 3.2 Transitions
- [ ] Slide-up page = 180ms
- [ ] Slide-down page = 180ms
- [ ] Fade onglet = 120ms
- [ ] Modal open = 240ms slide-up
- [ ] Modal close = 240ms slide-down
- [ ] Toutes les transitions fluides (60fps)
- [ ] Aucun jank visible

### 3.3 Navigation
- [ ] Bottom nav change d'onglet instantanément
- [ ] Onglet actif visuellement clair (bleu)
- [ ] Tap ProjectCard → détail projet (slide-up)
- [ ] Back button → retour (slide-down)
- [ ] Tap RiskCard → détail risque
- [ ] Tap DecisionCard → détail décision

---

## ✅ SECTION 4 — FLOWS COMPLETS

### 4.1 FLOW 1 : Arrivée /cockpit
- [ ] Détection mobile fonctionne (window.innerWidth < 768)
- [ ] Mode LIVE vérifié (pas de redirect vers /demo)
- [ ] Fetch projets exécuté
- [ ] Si aucun projet → EmptyStateLive s'affiche
- [ ] Si projets → liste de ProjectCard s'affiche
- [ ] Bottom nav visible
- [ ] Header visible

### 4.2 FLOW 2 : Création projet
- [ ] EmptyStateLive CTA cliquable
- [ ] Modal CreateProject s'ouvre (slide-up 240ms)
- [ ] Input nom projet fonctionnel
- [ ] Submit déclenche createProject()
- [ ] Modal se ferme
- [ ] Toast "Votre projet est prêt ✨" affiché
- [ ] Navigation vers `/cockpit/projects/${id}` (slide-up 180ms)

### 4.3 FLOW 3 : Navigation mobile
- [ ] Tap onglet "Projets" → liste projets
- [ ] Tap onglet "Risques" → liste tous risques
- [ ] Tap onglet "Décisions" → liste toutes décisions
- [ ] Tap onglet "Profil" → page profil
- [ ] Onglet actif mis à jour visuellement
- [ ] Transition fade 120ms entre onglets

### 4.4 FLOW 4 : Détail projet
- [ ] Tap ProjectCard → page détail projet
- [ ] Header avec nom projet + back button
- [ ] Section "Risques" avec liste RiskCard
- [ ] Section "Décisions" avec liste DecisionCard
- [ ] Back button → retour liste (slide-down 180ms)
- [ ] Tap RiskCard → détail risque
- [ ] Tap DecisionCard → détail décision

### 4.5 FLOW 5 : Détail risque/décision
- [ ] Tap RiskCard → page détail risque
- [ ] Header avec titre + back button
- [ ] Sévérité badge visible
- [ ] Statut visible
- [ ] Description affichée
- [ ] Historique affiché
- [ ] Back button fonctionne (slide-down)

---

## ✅ SECTION 5 — RÈGLES UX OBLIGATOIRES

### 5.1 Les 10 interdictions
- [ ] ✅ Aucune sidebar en mobile
- [ ] ✅ Aucune multi-colonne
- [ ] ✅ Aucun texte < 12px
- [ ] ✅ Aucun bouton < 44x44px
- [ ] ✅ Aucun scroll horizontal
- [ ] ✅ Aucun modal plein écran (max 80vh)
- [ ] ✅ Aucune animation > 240ms
- [ ] ✅ Toutes les couleurs dans la palette (PACK 4)
- [ ] ✅ Aucune surcharge visuelle
- [ ] ✅ Design mobile-first

### 5.2 Touch Targets
- [ ] Tous les boutons ≥ 44x44px
- [ ] Toutes les cartes tapables
- [ ] Bottom nav items ≥ 44px height
- [ ] Back button ≥ 44x44px
- [ ] CTA buttons ≥ 44px height

### 5.3 Typographie
- [ ] Text size min = 12px
- [ ] Text size optimal = 14-16px
- [ ] Titres cartes = 15-16px
- [ ] Labels = 11-12px
- [ ] Line-height confortable (1.3-1.5)

### 5.4 Accessibilité
- [ ] Contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Tous les boutons ont aria-label si besoin
- [ ] Navigation clavier fonctionne (tab)
- [ ] Screen reader compatible
- [ ] Focus visible sur éléments interactifs

---

## ✅ SECTION 6 — TESTS DEVICES

### 6.1 iPhone SE (375px)
- [ ] Layout correct (pas de débordement)
- [ ] Toutes les cartes lisibles
- [ ] Bottom nav items pas trop serrés
- [ ] Touch targets suffisamment grands
- [ ] Scroll fluide

### 6.2 iPhone 13 (390px)
- [ ] Layout optimal
- [ ] Spacing confortable
- [ ] Navigation facile
- [ ] Safe area respectée (notch)
- [ ] Home indicator non caché

### 6.3 iPhone 13 Pro Max (428px)
- [ ] Layout bien espacé
- [ ] Pas de vide excessif
- [ ] Cartes bien proportionnées
- [ ] Navigation confortable

### 6.4 Android (360px)
- [ ] Layout correct (viewport min)
- [ ] Tout lisible et cliquable
- [ ] Back button système fonctionne
- [ ] Navigation bar Android respectée

### 6.5 Landscape Mode
- [ ] Layout fonctionne en landscape
- [ ] Header + bottom nav visibles
- [ ] Content scrollable
- [ ] Pas de coupure

### 6.6 Safe Area
- [ ] Notch iOS respectée (safe-area-inset-top)
- [ ] Home indicator iOS respecté (safe-area-inset-bottom)
- [ ] Android nav bar respectée
- [ ] Aucun contenu caché sous notch/nav

---

## ✅ SECTION 7 — PERFORMANCE

### 7.1 Lighthouse Mobile
- [ ] Performance score ≥ 90
- [ ] Accessibility score ≥ 90
- [ ] Best Practices score ≥ 90
- [ ] SEO score ≥ 90

### 7.2 Core Web Vitals
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] INP (Interaction to Next Paint) < 200ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

### 7.3 Optimisations
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Fonts optimisés (font-display: swap)
- [ ] JavaScript bundle < 200KB
- [ ] CSS critical inline
- [ ] Aucun console.log en production

---

## ✅ SECTION 8 — QUALITÉ CODE

### 8.1 TypeScript
- [ ] Aucune erreur TypeScript
- [ ] Aucun `any` type (sauf justifié)
- [ ] Tous les props typés
- [ ] Tous les states typés

### 8.2 ESLint
- [ ] Aucun warning ESLint
- [ ] Aucun `eslint-disable` (sauf justifié)
- [ ] Code formaté (Prettier)

### 8.3 Best Practices
- [ ] Aucun code dupliqué
- [ ] Composants réutilisables
- [ ] Hooks custom pour logique partagée
- [ ] Error boundaries en place
- [ ] Loading states gérés

---

## ✅ SECTION 9 — COHÉRENCE DESIGN SYSTEM (PACK 4)

### 9.1 Couleurs
- [ ] Background primaire = #0A0A0A
- [ ] Background secondaire = #111111
- [ ] Border = #1E1E1E
- [ ] Text primaire = #FFFFFF
- [ ] Text secondaire = #9A9A9A
- [ ] Text tertiaire = #6A6A6A
- [ ] Brand primary = #3A82F7
- [ ] Status high = #EF4444
- [ ] Status medium = #FBBF24
- [ ] Status low = #22C55E

### 9.2 Spacing
- [ ] Spacing système = 4px, 8px, 12px, 16px, 24px
- [ ] Padding cartes = 16px (ProjectCard) ou 12px 16px (Risk/Decision)
- [ ] Gap entre cartes = 12px
- [ ] Padding main = 16px horizontal

### 9.3 Border Radius
- [ ] Cartes projets = 12px
- [ ] Cartes risques/décisions = 8px
- [ ] Buttons = 8px
- [ ] Modal top = 16px
- [ ] Badges = 4px

---

## ✅ SECTION 10 — VALIDATION FINALE

### 10.1 Fonctionnel
- [ ] Tous les flows 1-5 fonctionnent
- [ ] Création projet fonctionne
- [ ] Navigation fonctionne
- [ ] Détails affichés correctement
- [ ] Back button fonctionne partout

### 10.2 Visuel
- [ ] Design conforme PACK 6
- [ ] Cohérence Design System PACK 4
- [ ] Transitions fluides
- [ ] Tap feedback visible
- [ ] Aucun bug visuel

### 10.3 Performance
- [ ] Lighthouse mobile > 90
- [ ] Transitions 60fps
- [ ] Scroll fluide
- [ ] Aucun lag

### 10.4 Accessibilité
- [ ] Touch targets ≥ 44px
- [ ] Contrast ratio ≥ 4.5:1
- [ ] Text size ≥ 12px
- [ ] Screen reader OK

### 10.5 Tests Devices
- [ ] iPhone SE OK
- [ ] iPhone 13 OK
- [ ] iPhone 13 Pro Max OK
- [ ] Android 360px OK
- [ ] Landscape OK
- [ ] Safe area OK

---

## 📊 SCORING

### Calcul du score
Total items : ~150

**Score** = (Items cochés / Total items) × 100

### Critères de validation

| Score | Status | Action |
|-------|--------|--------|
| 100% | ✅ PASS | Validation complète, GO production |
| 95-99% | ⚠️ MINOR | Quelques points mineurs à corriger |
| 90-94% | ⚠️ MAJOR | Points importants à corriger avant GO |
| < 90% | ❌ FAIL | Trop de critères non respectés, NO-GO |

---

## 🎯 DÉCISION FINALE

### Release Manager Approval

**Date** : _______________

**Score final** : _______ %

**Décision** :
- [ ] ✅ **GO PRODUCTION** — Tous les critères respectés
- [ ] ⚠️ **GO WITH CONDITIONS** — Quelques points mineurs (préciser) :
  - _______________________________
  - _______________________________
- [ ] ❌ **NO-GO** — Critères critiques non respectés (préciser) :
  - _______________________________
  - _______________________________

**Signature Release Manager** : _______________

---

## 📚 ANNEXES

### A. Tests manuels supplémentaires
- [ ] Test avec connexion 3G (slow network)
- [ ] Test avec mode avion → offline
- [ ] Test avec battery saver mode
- [ ] Test avec zoom 200%
- [ ] Test avec Dark Mode iOS/Android

### B. Tests edge cases
- [ ] 0 projet (EmptyState)
- [ ] 1 projet
- [ ] 100+ projets (scroll performance)
- [ ] Projet sans risques ni décisions
- [ ] Risque sans description
- [ ] Décision sans owner

### C. Tests navigation
- [ ] Deep link vers détail projet
- [ ] Back browser history
- [ ] Refresh page maintient état
- [ ] Navigation pendant loading
- [ ] Double-tap prevention

---

**Version** : 1.0.0  
**Date** : 29 janvier 2026  
**Pour** : QA + Release Manager  
**Complément** : PACK6-MOBILE-UX.md, PACK6-IMPLEMENTATION-GUIDE.md
