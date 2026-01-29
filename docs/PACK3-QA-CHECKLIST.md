# ✅ PACK 3 - Checklist QA Finale

## 📋 Vue d'ensemble

Cette checklist garantit que l'expérience LIVE du cockpit Powalyze est complète, sécurisée et premium.

---

## 🎨 PARTIE 1 - Micro-copies Premium (FR/EN)

### FR - Vérifications

- [ ] **Header LIVE**
  - [ ] Desktop: "Votre cockpit exécutif" + "Pilotage stratégique en temps réel"
  - [ ] Mobile: "Votre cockpit exécutif" + "Pilotage stratégique en temps réel"
  
- [ ] **Empty State LIVE**
  - [ ] Titre: "Bienvenue dans votre cockpit Powalyze"
  - [ ] Sous-titre: "Créez votre premier projet pour activer votre pilotage exécutif."
  - [ ] CTA: "Créer mon premier projet"
  - [ ] Features: "Analytics en temps réel", "Collaboration d'équipe", "Rapports automatisés"
  
- [ ] **Mobile Navigation**
  - [ ] "Projets", "Risques", "Décisions", "Profil"
  
- [ ] **Modal Création**
  - [ ] Titre: "Nouveau projet"
  - [ ] Placeholder: "Nom du projet"
  - [ ] CTA: "Créer"

### EN - Vérifications

- [ ] **Header LIVE**
  - [ ] "Your Executive Cockpit" + "Real-time strategic governance"
  
- [ ] **Empty State LIVE**
  - [ ] "Welcome to your Powalyze Cockpit"
  - [ ] "Create your first project to activate your executive governance."
  - [ ] "Create my first project"
  
- [ ] **Mobile Navigation**
  - [ ] "Projects", "Risks", "Decisions", "Profile"

---

## 📱 PARTIE 2 - UX Mobile (LIVE uniquement)

### Layout Mobile

- [ ] **Structure**
  - [ ] Pas de sidebar
  - [ ] Header compact (titre + sous-titre)
  - [ ] Navigation bas d'écran (4 onglets)
  - [ ] Cartes projet plein écran

- [ ] **Spacing Touch-Friendly**
  - [ ] Boutons: padding 12-16px minimum
  - [ ] Onglets nav: hauteur 64px minimum
  - [ ] Cartes: spacing 16px entre chaque

### Animations

- [ ] **Transitions**
  - [ ] Changement d'onglet: fade 120ms
  - [ ] Ouverture modal: zoom-in 150ms
  - [ ] Fermeture modal: fade-out 150ms
  - [ ] Click carte: scale-98 active state

- [ ] **Performances**
  - [ ] Aucun jank visible
  - [ ] 60fps sur scroll
  - [ ] Pas de flash de contenu

### Responsive

- [ ] **Breakpoints**
  - [ ] < 768px → CockpitMobile
  - [ ] ≥ 768px → CockpitDashboard (desktop)
  - [ ] Transition fluide entre modes

---

## 🚀 PARTIE 3 - Onboarding LIVE

### Flow Complet

- [ ] **Étape 1: Arrivée**
  - [ ] User arrive sur /cockpit
  - [ ] Mode LIVE détecté
  - [ ] Aucun projet existant

- [ ] **Étape 2: Empty State**
  - [ ] EmptyStateLive affiché
  - [ ] Hero section visible
  - [ ] CTA "Créer mon premier projet" visible

- [ ] **Étape 3: Modal**
  - [ ] Click CTA → Modal s'ouvre
  - [ ] Formulaire avec: nom, description, budget
  - [ ] Validation: nom obligatoire

- [ ] **Étape 4: Création**
  - [ ] Submit → `createProject()` appelé
  - [ ] Projet créé dans Supabase
  - [ ] Feedback: "Votre projet est prêt" (toast)

- [ ] **Étape 5: Redirection**
  - [ ] Modal se ferme
  - [ ] Liste projets s'affiche
  - [ ] Nouveau projet visible

### Cas d'erreur

- [ ] **Validation**
  - [ ] Nom vide → bouton désactivé
  - [ ] Budget négatif → erreur

- [ ] **Réseau**
  - [ ] Échec Supabase → toast "Erreur lors de la création"
  - [ ] Loading state pendant création
  - [ ] Retry possible

---

## 🗄️ PARTIE 4 - Structure Supabase

### Tables créées

- [ ] **organizations**
  - [ ] Colonnes: id, name, is_demo, created_at, updated_at
  - [ ] Index sur is_demo

- [ ] **user_profiles**
  - [ ] Colonnes: id (FK auth.users), display_name, avatar_url, language
  - [ ] Trigger updated_at

- [ ] **memberships**
  - [ ] Colonnes: id, user_id, organization_id, role
  - [ ] UNIQUE(user_id, organization_id)
  - [ ] Index sur user_id et organization_id

- [ ] **projects**
  - [ ] Colonnes: id, organization_id, name, description, status, budget, progress
  - [ ] Index sur organization_id, status

- [ ] **risks**
  - [ ] Colonnes: id, project_id, title, severity, probability, impact, status
  - [ ] Index sur project_id, status

- [ ] **decisions**
  - [ ] Colonnes: id, project_id, title, owner, status
  - [ ] Index sur project_id, status

### Relations

- [ ] **organizations ← memberships → users**
  - [ ] FK memberships.organization_id → organizations.id
  - [ ] FK memberships.user_id → auth.users.id

- [ ] **organizations ← projects**
  - [ ] FK projects.organization_id → organizations.id

- [ ] **projects ← risks**
  - [ ] FK risks.project_id → projects.id

- [ ] **projects ← decisions**
  - [ ] FK decisions.project_id → projects.id

---

## 🔐 PARTIE 5 - RLS (Row Level Security)

### Activation RLS

- [ ] **Tables avec RLS**
  - [ ] organizations: ✅
  - [ ] user_profiles: ✅
  - [ ] memberships: ✅
  - [ ] projects: ✅
  - [ ] risks: ✅
  - [ ] decisions: ✅

### Policies Organizations

- [ ] **SELECT**
  - [ ] Users voient uniquement leurs orgs (via memberships)
  
- [ ] **UPDATE**
  - [ ] Admins uniquement

### Policies Projects

- [ ] **SELECT**
  - [ ] Members voient projets de leur org
  
- [ ] **INSERT**
  - [ ] Members/Admins peuvent créer dans leur org
  
- [ ] **UPDATE**
  - [ ] Members/Admins peuvent modifier
  
- [ ] **DELETE**
  - [ ] Admins uniquement

### Policies Risks & Decisions

- [ ] **SELECT**
  - [ ] Via projects → organization → membership
  
- [ ] **INSERT/UPDATE/DELETE**
  - [ ] Members/Admins uniquement

### Tests de sécurité

- [ ] **Isolation tenant**
  - [ ] User A ne voit pas projets de org B
  - [ ] User A ne peut pas créer projet dans org B
  - [ ] Aucune fuite de données cross-org

- [ ] **Roles**
  - [ ] Viewers: SELECT uniquement
  - [ ] Members: SELECT + INSERT + UPDATE
  - [ ] Admins: SELECT + INSERT + UPDATE + DELETE

---

## 🧪 PARTIE 6 - Tests Fonctionnels

### Mode DEMO (/cockpit/demo)

- [ ] **Données**
  - [ ] 3 projets hardcodés affichés
  - [ ] Données isolées de LIVE
  - [ ] localStorage utilisé (fallback)

- [ ] **UX**
  - [ ] Layout desktop uniquement
  - [ ] Badge "Mode Démo" visible (dev)
  - [ ] Aucun accès Supabase PROD

### Mode LIVE (/cockpit)

- [ ] **Desktop (≥ 768px)**
  - [ ] CockpitDashboard affiché
  - [ ] Sidebar visible
  - [ ] Grille projets (2-3 colonnes)

- [ ] **Mobile (< 768px)**
  - [ ] CockpitMobile affiché
  - [ ] Pas de sidebar
  - [ ] Bottom nav (4 onglets)
  - [ ] Cartes plein écran

- [ ] **Empty State**
  - [ ] Affiché si 0 projets
  - [ ] Modal création fonctionnelle
  - [ ] Projet créé dans Supabase PROD

### Création Projet

- [ ] **Formulaire**
  - [ ] Champs: nom, description, budget
  - [ ] Validation: nom obligatoire
  - [ ] Budget en euros (€)

- [ ] **Persistance**
  - [ ] Mode DEMO → localStorage
  - [ ] Mode LIVE → Supabase PROD
  - [ ] Aucun mélange DEMO/LIVE

- [ ] **Feedback**
  - [ ] Loading state pendant création
  - [ ] Toast succès: "Votre projet est prêt"
  - [ ] Toast erreur si échec

---

## 🌐 Tests Cross-Browser

### Desktop

- [ ] **Chrome** (latest)
  - [ ] Layout correct
  - [ ] Animations fluides
  - [ ] Modal fonctionnel

- [ ] **Firefox** (latest)
  - [ ] Idem Chrome

- [ ] **Edge** (latest)
  - [ ] Idem Chrome

- [ ] **Safari** (latest macOS)
  - [ ] Backdrop-blur fonctionne
  - [ ] Animations CSS

### Mobile

- [ ] **iOS Safari**
  - [ ] Bottom nav fixe
  - [ ] Scroll fluide
  - [ ] Touch events

- [ ] **Android Chrome**
  - [ ] Idem iOS

---

## 🚀 Tests Performance

- [ ] **Métriques**
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
  - [ ] INP < 200ms

- [ ] **Build**
  - [ ] `npm run build` sans erreurs TypeScript
  - [ ] Bundle size raisonnable
  - [ ] Tree-shaking effectif

- [ ] **Runtime**
  - [ ] Pas de memory leaks
  - [ ] Scroll 60fps
  - [ ] Navigation instantanée

---

## 🔍 Tests Console

- [ ] **Erreurs**
  - [ ] Aucune erreur console
  - [ ] Aucun warning React
  - [ ] Aucune erreur réseau (sauf si offline)

- [ ] **Logs**
  - [ ] Pas de logs sensibles (tokens, passwords)
  - [ ] Logs dev uniquement en mode dev

---

## 📱 Tests Accessibility

- [ ] **Keyboard**
  - [ ] Tab navigation fonctionnelle
  - [ ] Modal trap focus
  - [ ] Esc ferme modal

- [ ] **Screen Readers**
  - [ ] Labels aria corrects
  - [ ] Boutons avec aria-label
  - [ ] Landmarks (header, main, nav)

- [ ] **Contraste**
  - [ ] WCAG AA respecté
  - [ ] Texte lisible sur fond

---

## 🌍 Tests Internationalization

- [ ] **FR**
  - [ ] Toutes les micro-copies en français
  - [ ] Pas de texte en anglais

- [ ] **EN**
  - [ ] Hook `useCockpitCopy('en')` fonctionne
  - [ ] Toutes les micro-copies traduites

---

## ✅ Checklist Déploiement

### Pré-déploiement

- [ ] **Code**
  - [ ] Tous les tests passent
  - [ ] Build réussit
  - [ ] Pas de TODOs critiques

- [ ] **Environnement**
  - [ ] Variables Vercel configurées
  - [ ] SUPABASE_PROD_* définies
  - [ ] JWT_SECRET sécurisé

- [ ] **Base de données**
  - [ ] Schema PROD appliqué
  - [ ] RLS activé
  - [ ] Policies testées

### Post-déploiement

- [ ] **Production**
  - [ ] www.powalyze.com accessible
  - [ ] /cockpit fonctionne
  - [ ] /cockpit/demo fonctionne

- [ ] **Monitoring**
  - [ ] Vercel Analytics actif
  - [ ] Erreurs Sentry (si activé)
  - [ ] Logs Supabase

---

## 📝 Documentation

- [ ] **README**
  - [ ] Variables d'environnement documentées
  - [ ] Setup Supabase expliqué
  - [ ] Commandes de développement

- [ ] **Code**
  - [ ] Commentaires pertinents
  - [ ] Types TypeScript complets
  - [ ] JSDoc pour fonctions complexes

---

## 🎯 Critères de Validation Finale

### Bloquants (Must-Have)

- [ ] Build sans erreurs ✅
- [ ] RLS actif sur toutes les tables ✅
- [ ] Mode DEMO/LIVE isolés ✅
- [ ] Création projet LIVE fonctionne ✅
- [ ] Mobile responsive ✅

### Important (Should-Have)

- [ ] Micro-copies premium appliquées ✅
- [ ] Animations fluides ✅
- [ ] Modal création complète ✅
- [ ] Empty state onboarding ✅

### Nice-to-Have

- [ ] i18n FR/EN complet
- [ ] Animations avancées
- [ ] Tests unitaires
- [ ] Documentation complète

---

## 🎉 PACK 3 Validé Si

✅ **Tous les bloquants** sont cochés  
✅ **95% des importants** sont cochés  
✅ **Aucune erreur critique** en production  
✅ **UX mobile fluide** (< 768px)  
✅ **Sécurité RLS** testée et validée  

---

**Dernière mise à jour**: PACK 3 - Finalisation expérience LIVE
**Responsable QA**: [Nom]
**Date validation**: [Date]
