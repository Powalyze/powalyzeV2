# Checklist VB (Développement) - PACK 5

**Rôle** : VB — Développement  
**Objectif** : Livrer du code propre, testé, documenté

---

## ✅ AVANT DE COMMENCER

### Setup
- [ ] Branch feature créée : `feature/pack-[X]-[description]`
- [ ] Environnement local fonctionnel (`npm run dev`)
- [ ] Spécifications PACK lues et comprises
- [ ] Design System consulté (Tailwind classes, composants UI)

### Documentation
- [ ] PACK specification lue
- [ ] Architecture comprise (DEMO/LIVE, dual-mode)
- [ ] APIs documentées consultées (si applicable)

---

## 🏗️ DÉVELOPPEMENT

### Code Quality
- [ ] **Zéro duplication** : Pas de code copié/collé
- [ ] **Naming clair** : Variables/fonctions nommées explicitement
- [ ] **Design System respecté** : Utilisation tokens Tailwind uniquement
- [ ] **Composants réutilisés** : Pas de réinvention (composants UI existants)
- [ ] **TypeScript strict** : Pas de `any`, typage complet
- [ ] **Zéro `console.log`** : Pas de code de debug oublié
- [ ] **Error handling** : `try/catch` partout où nécessaire
- [ ] **Loading states** : Spinners/skeletons pendant chargements

### Performance
- [ ] **Pas de re-render inutile** : `useMemo`/`useCallback` si nécessaire
- [ ] **Images optimisées** : WebP, sizes appropriées
- [ ] **Code splitting** : Dynamic imports si applicable
- [ ] **Bundle size** : Vérifier impact (`npm run build`)

### Accessibilité
- [ ] **Keyboard navigation** : Tab, Escape, Enter fonctionnent
- [ ] **aria-labels** : Tous les éléments interactifs
- [ ] **alt text** : Toutes les images
- [ ] **Contraste** : Ratio > 4.5:1 (text/background)
- [ ] **Focus visible** : Tous les éléments interactifs

### i18n (Internationalisation)
- [ ] **Micro-copies FR** : Toutes les strings externalisées
- [ ] **Micro-copies EN** : Traductions complètes
- [ ] **Hook i18n** : `useCockpitCopy()` utilisé partout
- [ ] **Pas de hardcoded text** : Zéro string en dur dans JSX

### Mobile First
- [ ] **Responsive** : Testé 320px → 2560px
- [ ] **Touch targets** : Boutons > 48x48px
- [ ] **Thumb zones** : Éléments importants accessibles au pouce
- [ ] **Bottom navigation** : Visible et fonctionnel sur mobile

---

## 🧪 TESTS

### Tests Manuels
- [ ] **Build local réussi** : `npm run build` → 0 erreurs
- [ ] **TypeScript strict** : `npx tsc --noEmit` → 0 erreurs
- [ ] **ESLint** : `npm run lint` → 0 warnings
- [ ] **Browser console** : Zéro warning/erreur
- [ ] **Navigation** : Toutes les routes fonctionnent
- [ ] **DEMO mode** : Données fixes, badge visible
- [ ] **LIVE mode** : Données Supabase (si configuré)

### Tests Cross-Browser (minimum)
- [ ] **Chrome** : Testé et OK
- [ ] **Firefox** : Testé et OK
- [ ] **Safari** : Testé et OK (si Mac disponible)
- [ ] **Edge** : Testé et OK

### Tests Mobile (minimum)
- [ ] **iPhone (Safari)** : Testé < 768px et OK
- [ ] **Android (Chrome)** : Testé < 768px et OK

### Tests Unitaires (si applicable)
- [ ] Tests écrits pour fonctions critiques
- [ ] `npm run test` : Tous les tests passent
- [ ] Coverage acceptable (> 70% si requis)

---

## 📝 DOCUMENTATION

### Inline Documentation
- [ ] **JSDoc** : Fonctions critiques documentées
  ```typescript
  /**
   * Description de la fonction
   * @param {type} param - Description
   * @returns {type} - Description
   */
  ```
- [ ] **Comments** : Code complexe commenté (WHY, pas WHAT)
- [ ] **TODO** : Aucun TODO non résolu

### CHANGELOG Technique
- [ ] **Fichier créé** : `CHANGELOG-TECHNIQUE.md`
- [ ] **Added** : Nouvelles features listées
- [ ] **Changed** : Modifications listées
- [ ] **Fixed** : Bugs résolus listés
- [ ] **Removed** : Code supprimé listé
- [ ] **Breaking changes** : Documentés si applicable
- [ ] **Dependencies** : Ajouts/suppressions listés
- [ ] **Métriques** : Build time, bundle size, Lighthouse

---

## 🔍 REVUE FINALE

### Code Review (Auto)
- [ ] **Pas de code mort** : Code inutilisé supprimé
- [ ] **Imports optimisés** : Pas d'imports inutilisés
- [ ] **Files structure** : Fichiers dans les bons dossiers
- [ ] **Naming conventions** : camelCase, PascalCase respectés
- [ ] **No magic numbers** : Constants nommées
- [ ] **DRY** : Don't Repeat Yourself respecté

### Security
- [ ] **Pas de secrets** : Aucune clé API hardcodée
- [ ] **Input validation** : Tous les inputs utilisateurs validés
- [ ] **XSS protection** : Pas de `dangerouslySetInnerHTML` non sécurisé
- [ ] **SQL injection** : Prepared statements (Supabase)

### Performance Check
- [ ] **Build time** : < 15s acceptable
- [ ] **Bundle size** : Pas d'augmentation massive (> 20%)
- [ ] **Lighthouse** : Performance > 90 (desktop)
- [ ] **Core Web Vitals** :
  - LCP < 2.5s ✅
  - INP < 200ms ✅
  - CLS < 0.1 ✅

---

## 📤 PULL REQUEST

### PR Description
- [ ] **Titre clair** : `[PACK X] Feature description`
- [ ] **Description complète** :
  ```markdown
  ## What
  [Description de ce qui a été fait]
  
  ## Why
  [Pourquoi cette feature]
  
  ## How
  [Comment ça fonctionne techniquement]
  
  ## Tests
  [Tests effectués]
  
  ## Screenshots
  [Si applicable]
  ```
- [ ] **CHANGELOG technique** : Lié dans la PR
- [ ] **Breaking changes** : Documentés dans la PR
- [ ] **Labels** : `PACK-X`, `enhancement`, `bug-fix`, etc.

### Fichiers modifiés
- [ ] **Revue personnelle** : Tous les fichiers modifiés relus
- [ ] **Pas de fichiers non liés** : Pas de modifications hors scope
- [ ] **Pas de fichiers générés** : `.next`, `node_modules` exclus

### Tests dans la PR
- [ ] **Build log** : Copié dans PR (si erreur avant)
- [ ] **Screenshots** : Avant/après si visuel
- [ ] **GIF/Video** : Si animations/interactions

---

## ✅ CRITÈRES DE SORTIE

### Code
- ✅ Build local réussi (0 erreurs)
- ✅ TypeScript strict mode : 0 erreurs
- ✅ ESLint : 0 warnings
- ✅ Browser console : 0 erreurs

### Tests
- ✅ Tests manuels effectués (desktop + mobile)
- ✅ Cross-browser (Chrome, Firefox, Safari/Edge)
- ✅ Tests unitaires passent (si applicable)

### Documentation
- ✅ CHANGELOG technique à jour
- ✅ Inline documentation (JSDoc si nécessaire)
- ✅ PR description complète

### Qualité
- ✅ Design System respecté
- ✅ Accessibilité OK (keyboard, aria-labels)
- ✅ i18n complet (FR/EN)
- ✅ Mobile UX conforme

---

## 🚀 PRÊT POUR QA

Une fois toutes les cases cochées :

1. **Créer PR** sur GitHub
2. **Notifier QA** : Slack #releases ou email
3. **Attendre review** : QA + Code review
4. **Itérer** si nécessaire (feedback QA)

---

## 📋 TEMPLATE COMMIT MESSAGE

```
[PACK X] Feature: Description courte

- Added: [Liste ajouts]
- Changed: [Liste modifications]
- Fixed: [Liste bugs]

Tests: ✅ Manual + ✅ Cross-browser + ✅ Mobile
Build: ✅ Success (0 errors)
Lighthouse: 95 (desktop), 85 (mobile)

CHANGELOG: Updated
PR: #[numéro]
```

---

## 🔗 RESSOURCES

- **Design System** : `components/ui/`
- **i18n** : `lib/i18n/cockpit.ts`
- **Types** : `types/index.ts`
- **Supabase types** : `types/supabase.ts`
- **Architecture** : `docs/ARCHITECTURE_DUAL_MODE.md`
- **PACK specs** : `docs/PACK[X]-*.md`

---

**Version** : PACK 5  
**Dernière mise à jour** : 29/01/2026
