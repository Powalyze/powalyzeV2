# 🎨 DIRECTIVE TOTALE - Design System Powalyze

## ✅ Implémentation Phase 1 (Complétée)

### 1. Design System Unifié
**Fichier**: `styles/design-system.css`

✅ **Palette Premium**:
- Or: `#D4AF37` (titres)
- Bleu nuit: `#0A1A2F` (sous-titres)
- Neutres: `#F5F5F5`, `#E8E8E8`, `#1A1A1A`

✅ **Typographies**:
- Titres: Inter Tight / SemiBold
- Corps: Inter / Regular
- Importées depuis Google Fonts

✅ **Animations**:
- Fast: 180ms
- Base: 300ms
- Slow: 450ms
- Cubic bezier `(0.4, 0, 0.2, 1)`

✅ **Classes utilitaires**:
- `.ds-title-gold` - Titres or
- `.ds-subtitle-navy` - Sous-titres bleu nuit
- `.ds-card` - Cartes blanches avec ombres légères
- `.ds-btn-primary` / `.ds-btn-secondary` / `.ds-btn-ghost`
- `.ds-nav-top` - Navigation fixe
- `.ds-narration` - Bloc de narration avec bordure or
- `.ds-hero-video` - Hero vidéo premium

### 2. Système i18n FR/EN
**Fichiers**: 
- `lib/i18n.ts` - Hook useTranslation avec Zustand
- `components/ui/LanguageSwitcher.tsx` - Switcher FR/EN
- `locales/fr.json` - Traductions françaises complètes
- `locales/en.json` - Traductions anglaises complètes

✅ **Fonctionnalités**:
- Persistance locale (localStorage via Zustand persist)
- Paramètres dynamiques: `t('key', { param: value })`
- Switcher visuel avec classes `.ds-lang-btn`

✅ **Clés disponibles**:
- `common.*` - Éléments communs (welcome, save, cancel...)
- `nav.*` - Navigation (vitrine, features, cockpit...)
- `hero.*` - Hero section (title, subtitle, cta)
- `modules.*` - Modules (risks, decisions, projects avec narration)
- `cockpit.*` - Cockpit (dashboard, projects, risks, decisions...)
- `projects.*`, `risks.*`, `decisions.*` - Modules détaillés
- `footer.*` - Footer

### 3. Navigation Top Unifiée
**Fichier**: `components/layout/NavigationTop.tsx`

✅ **Caractéristiques**:
- Barre fixe (sticky top)
- Logo Powalyze avec icône SVG or
- Mode `vitrine` ou `cockpit`
- Liens actifs avec `.ds-nav-link-active`
- Switcher de langues intégré
- CTA "Entrer dans le cockpit" (vitrine) ou "Paramètres" (cockpit)

### 4. Composant ModuleCard
**Fichier**: `components/cockpit/ModuleCard.tsx`

✅ **Structure premium**:
- Header: titre or + sous-titre bleu + icône optionnelle
- Narration: bloc `.ds-narration` avec bordure or
- Zone de travail: cartes blanches
- Actions: alignées à droite dans le header

---

## 🚧 Phase 2 - À Implémenter

### 1. Refonte CockpitRoot avec Design Premium

**Objectif**: Appliquer le design system à tous les modules du cockpit

**Actions**:
```tsx
// Importer le design system
import '@/styles/design-system.css';
import { useTranslation } from '@/lib/i18n';
import NavigationTop from '@/components/layout/NavigationTop';
import ModuleCard from '@/components/cockpit/ModuleCard';

// Remplacer les styles actuels par les classes DS
<ModuleCard
  title={t('modules.risks.title')}
  subtitle={t('modules.risks.description')}
  narration={t('modules.risks.narration')}
  icon={<AlertTriangle />}
  actions={
    <>
      <button className="ds-btn ds-btn-ghost ds-btn-sm">{t('common.filter')}</button>
      <button className="ds-btn ds-btn-primary ds-btn-sm">{t('risks.createNew')}</button>
    </>
  }
>
  {/* Contenu du module */}
</ModuleCard>
```

### 2. Page Vitrine Hero + Modules

**Fichier à créer**: `app/vitrine/page.tsx`

**Structure**:
```tsx
export default function VitrineHome() {
  return (
    <>
      <NavigationTop mode="vitrine" />
      
      {/* 1. Hero Vidéo Premium */}
      <section className="ds-hero-video">
        <video autoPlay loop muted playsInline>
          <source src="/videos/cockpit-demo.mp4" type="video/mp4" />
        </video>
        <div className="ds-hero-overlay">
          <h1 className="ds-hero-title">{t('hero.title')}</h1>
          <p className="ds-hero-subtitle">{t('hero.subtitle')}</p>
          <a href="/cockpit" className="ds-btn ds-btn-primary ds-btn-lg">
            {t('hero.cta')}
          </a>
        </div>
      </section>

      {/* 2. Modules phares */}
      <section className="ds-section ds-container">
        <h2 className="ds-title-gold ds-title-lg text-center mb-16">
          {t('modules.title')}
        </h2>
        <div className="ds-grid ds-grid-3">
          <ModulePreview 
            title={t('modules.risks.title')}
            description={t('modules.risks.description')}
            image="/images/module-risks.png"
          />
          <ModulePreview 
            title={t('modules.decisions.title')}
            description={t('modules.decisions.description')}
            image="/images/module-decisions.png"
          />
          <ModulePreview 
            title={t('modules.projects.title')}
            description={t('modules.projects.description')}
            image="/images/module-projects.png"
          />
        </div>
      </section>

      {/* 3. Cockpit en action (vidéo courte) */}
      <section className="ds-section-compact ds-container">
        <h2 className="ds-title-gold ds-title-lg text-center mb-8">
          Le cockpit en action
        </h2>
        <video className="w-full rounded-xl shadow-xl" controls>
          <source src="/videos/cockpit-walkthrough.mp4" type="video/mp4" />
        </video>
      </section>

      {/* 4. Pourquoi Powalyze */}
      <section className="ds-section ds-container">
        <h2 className="ds-title-gold ds-title-lg text-center mb-12">
          Pourquoi Powalyze est différent
        </h2>
        <div className="ds-grid ds-grid-3">
          <Differentiator icon={<Target />} title="Narratif" description="..." />
          <Differentiator icon={<Zap />} title="Proactif" description="..." />
          <Differentiator icon={<Shield />} title="Exécutif" description="..." />
        </div>
      </section>

      {/* 5. CTA Final */}
      <section className="ds-section ds-container text-center">
        <h2 className="ds-title-gold ds-title-xl mb-6">
          Prêt à piloter vos décisions ?
        </h2>
        <a href="/cockpit" className="ds-btn ds-btn-primary ds-btn-lg">
          Accéder au cockpit
        </a>
      </section>
    </>
  );
}
```

### 3. Composants à Créer

#### ModulePreview.tsx
```tsx
interface ModulePreviewProps {
  title: string;
  description: string;
  image: string;
}

export function ModulePreview({ title, description, image }: ModulePreviewProps) {
  return (
    <div className="ds-card ds-animate-fade-in hover:scale-105 transition-transform">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-lg" />
      <div className="p-6">
        <h3 className="ds-subtitle-navy ds-subtitle-lg mb-3">{title}</h3>
        <p className="ds-body ds-body-base">{description}</p>
      </div>
    </div>
  );
}
```

#### Differentiator.tsx
```tsx
interface DifferentiatorProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function Differentiator({ icon, title, description }: DifferentiatorProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-light mb-4">
        <span className="text-navy text-2xl">{icon}</span>
      </div>
      <h3 className="ds-subtitle-navy ds-subtitle-md mb-2">{title}</h3>
      <p className="ds-body ds-body-base">{description}</p>
    </div>
  );
}
```

---

## 📋 Checklist d'Intégration

### Pour chaque module du cockpit:

- [ ] Importer `@/styles/design-system.css`
- [ ] Remplacer les titres par `.ds-title-gold`
- [ ] Remplacer les sous-titres par `.ds-subtitle-navy`
- [ ] Envelopper dans `<ModuleCard>`
- [ ] Ajouter la narration: `"Ce module vous aide à..."`
- [ ] Utiliser `.ds-btn` pour tous les boutons
- [ ] Remplacer les cartes custom par `.ds-card`
- [ ] Traduire tous les labels avec `t('key')`
- [ ] Tester en FR et EN

### Pour la vitrine:

- [ ] Créer `/app/vitrine/page.tsx`
- [ ] Ajouter vidéo hero dans `/public/videos/`
- [ ] Capturer screenshots des modules pour `/public/images/`
- [ ] Créer vidéo "cockpit en action"
- [ ] Implémenter `ModulePreview.tsx`
- [ ] Implémenter `Differentiator.tsx`
- [ ] Tester responsive mobile
- [ ] Tester langues FR/EN

---

## 🎯 Règles Strictes à Respecter

### Palette
❌ **Interdits**:
- Plus de 3 couleurs visibles simultanément
- Couleurs vives non-premium (rouge, vert criard...)
- Dégradés arc-en-ciel

✅ **Autorisés**:
- Or #D4AF37 pour titres et CTA
- Bleu nuit #0A1A2F pour sous-titres
- Neutres pour backgrounds

### Typographies
❌ **Interdits**:
- Comic Sans, Arial, Times New Roman
- Plus de 2 font-families

✅ **Autorisés**:
- Inter Tight (titres)
- Inter (corps)

### Animations
❌ **Interdits**:
- Animations > 450ms
- Effets "bounce", "rubber band"
- Transitions brusques

✅ **Autorisés**:
- Fade in/out (180-300ms)
- Slide (300-450ms)
- Hover scale légère (1.02-1.05)

### Narration
✅ **Obligatoire** dans chaque module:
```tsx
narration="Ce module vous aide à [action concrète]"
```

### Langues
✅ **Obligatoire**:
- Toujours utiliser `t('key')`, jamais de texte en dur
- Switcher visible en permanence
- Aucun mélange FR/EN

---

## 📦 Fichiers Créés

✅ **Phase 1 (Complété)**:
- `styles/design-system.css` (600+ lignes)
- `lib/i18n.ts` (hook useTranslation)
- `components/ui/LanguageSwitcher.tsx`
- `components/layout/NavigationTop.tsx`
- `components/cockpit/ModuleCard.tsx`
- `locales/fr.json` (enrichi)
- `locales/en.json` (enrichi)

🚧 **Phase 2 (À faire)**:
- `app/vitrine/page.tsx` - Page d'accueil vitrine
- `components/vitrine/ModulePreview.tsx` - Préview des modules
- `components/vitrine/Differentiator.tsx` - Différenciateurs
- Refonte de tous les modules du cockpit avec design system

---

## 🚀 Déploiement

### Actuellement déployé:
✅ Design System CSS
✅ Système i18n FR/EN
✅ Navigation top unifiée
✅ Composant ModuleCard

### Build Status:
```
✓ Compiled successfully in 8.9s
✓ Finished TypeScript in 14.1s
105 routes generated
```

### URL:
https://www.powalyze.com

---

## 🎨 Variables CSS Principales

Utilisez ces variables dans votre code:

```css
/* Couleurs */
var(--color-gold)
var(--color-navy)
var(--color-neutral-100)

/* Espacements */
var(--spacing-xs)   /* 8px */
var(--spacing-sm)   /* 16px */
var(--spacing-md)   /* 24px */
var(--spacing-lg)   /* 32px */
var(--spacing-xl)   /* 48px */

/* Animations */
var(--transition-fast)   /* 180ms */
var(--transition-base)   /* 300ms */
var(--transition-slow)   /* 450ms */

/* Ombres */
var(--shadow-sm)
var(--shadow-base)
var(--shadow-lg)
```

---

## ✨ Prochaines Étapes Recommandées

1. **Appliquer le design system au cockpit actuel** (CockpitRoot.tsx)
2. **Créer la page vitrine Hero + modules**
3. **Produire les vidéos** (hero + walkthrough)
4. **Capturer les screenshots** des modules
5. **Tester la cohérence** vitrine ↔ cockpit
6. **Déployer et valider** sur www.powalyze.com

**Temps estimé**: 4-6 heures pour Phase 2 complète
