# PACK 6 — Implementation Guide

**Powalyze - Guide d'implémentation Mobile**  
**Pour VB (Développement)**  
**Version** : 1.0.0  
**Date** : 29 janvier 2026

---

## 🎯 OBJECTIF

Ce guide fournit le plan d'implémentation étape par étape du cockpit mobile Powalyze.

**Estimation totale** : 3-5 jours de développement

---

## 📋 AVANT DE COMMENCER

### Prérequis
- [ ] PACK 4 (Design System) implémenté
- [ ] Mode LIVE fonctionnel (Supabase configuré)
- [ ] API routes créées (/api/projects, /api/risks, /api/decisions)
- [ ] Types TypeScript définis (Project, Risk, Decision)
- [ ] Next.js 14 App Router configuré

### Dépendances
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "lucide-react": "^0.300.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 📂 STRUCTURE DES FICHIERS

### Arborescence cible
```
app/
  cockpit/
    (mobile)/
      page.tsx                    # Liste projets mobile
      layout.tsx                  # Layout mobile (header + bottom nav)
    projects/
      [id]/
        page.tsx                  # Détail projet mobile
    risks/
      page.tsx                    # Liste risques mobile
      [id]/
        page.tsx                  # Détail risque mobile
    decisions/
      page.tsx                    # Liste décisions mobile
      [id]/
        page.tsx                  # Détail décision mobile
    profile/
      page.tsx                    # Profil utilisateur mobile

components/
  cockpit/
    mobile/
      MobileHeader.tsx            # Header compact
      BottomNav.tsx               # Bottom navigation
      ProjectCardMobile.tsx       # Carte projet
      RiskCardMobile.tsx          # Carte risque
      DecisionCardMobile.tsx      # Carte décision
      EmptyStateLiveMobile.tsx    # État vide
      MobileModal.tsx             # Modal slide-up
      FloatingActionButton.tsx    # FAB
      LoadingSpinner.tsx          # Spinner

lib/
  hooks/
    useMediaQuery.ts              # Détection mobile
    useIsMobile.ts                # Hook mobile
    useSwipe.ts                   # Gestures swipe

styles/
  mobile.css                      # Styles spécifiques mobile
```

---

## 🚀 PLAN D'IMPLÉMENTATION

### PHASE 1 : Setup & Detection Mobile (0.5 jour)

#### Étape 1.1 : Hook de détection mobile
**Fichier** : `lib/hooks/useMediaQuery.ts`

```typescript
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
}
```

#### Étape 1.2 : Hook isMobile
**Fichier** : `lib/hooks/useIsMobile.ts`

```typescript
import { useMediaQuery } from './useMediaQuery';

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}
```

#### Étape 1.3 : Styles de base mobile
**Fichier** : `styles/mobile.css`

```css
/* Import dans app/globals.css */
@media (max-width: 768px) {
  :root {
    /* Dimensions */
    --mobile-header-height: 56px;
    --mobile-bottom-nav-height: 64px;
    --mobile-main-padding-x: 16px;
    --mobile-main-padding-y: 12px;
    
    /* Transitions */
    --transition-tap: 80ms ease;
    --transition-button: 120ms ease;
    --transition-page: 180ms ease;
    --transition-modal: 240ms ease;
  }
  
  /* Disable tap highlight (iOS) */
  * {
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Disable pull-to-refresh (Chrome mobile) */
  body {
    overscroll-behavior-y: contain;
  }
}
```

**✅ Checkpoint Phase 1** :
- [ ] `useMediaQuery` hook créé
- [ ] `useIsMobile` hook créé
- [ ] Styles de base mobile ajoutés
- [ ] Test : Console affiche `isMobile = true` sur mobile

---

### PHASE 2 : Composants de base (1 jour)

#### Étape 2.1 : MobileHeader
**Fichier** : `components/cockpit/mobile/MobileHeader.tsx`

Copier le code depuis [PACK6-MOBILE-COMPONENTS.md](PACK6-MOBILE-COMPONENTS.md) section MobileHeader.

**Test** :
```tsx
// Test dans une page
<MobileHeader title="Powalyze" subtitle="Cockpit exécutif" />
```

#### Étape 2.2 : BottomNav
**Fichier** : `components/cockpit/mobile/BottomNav.tsx`

Copier le code depuis [PACK6-MOBILE-COMPONENTS.md](PACK6-MOBILE-COMPONENTS.md) section BottomNav.

**Test** :
```tsx
<BottomNav activeTab="projects" />
```

#### Étape 2.3 : Layout mobile
**Fichier** : `app/cockpit/layout.tsx`

```tsx
'use client';

import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { MobileHeader } from '@/components/cockpit/mobile/MobileHeader';
import { BottomNav } from '@/components/cockpit/mobile/BottomNav';
import { usePathname } from 'next/navigation';

export default function CockpitLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  
  // Déterminer l'onglet actif
  const getActiveTab = () => {
    if (pathname === '/cockpit') return 'projects';
    if (pathname.startsWith('/cockpit/risks')) return 'risks';
    if (pathname.startsWith('/cockpit/decisions')) return 'decisions';
    if (pathname.startsWith('/cockpit/profile')) return 'profile';
    return 'projects';
  };
  
  if (!isMobile) {
    // Layout desktop (existant)
    return <div className="cockpit-layout-desktop">{children}</div>;
  }
  
  return (
    <div className="mobile-cockpit">
      <MobileHeader title="Powalyze" subtitle="Cockpit exécutif" />
      
      <main className="mobile-main">
        {children}
      </main>
      
      <BottomNav activeTab={getActiveTab()} />
    </div>
  );
}
```

**✅ Checkpoint Phase 2** :
- [ ] MobileHeader créé et testé
- [ ] BottomNav créé et testé
- [ ] Layout mobile activé
- [ ] Test : Navigation entre onglets fonctionne

---

### PHASE 3 : Cartes mobiles (1 jour)

#### Étape 3.1 : ProjectCardMobile
**Fichier** : `components/cockpit/mobile/ProjectCardMobile.tsx`

Copier le code depuis [PACK6-MOBILE-COMPONENTS.md](PACK6-MOBILE-COMPONENTS.md) section ProjectCardMobile.

#### Étape 3.2 : RiskCardMobile
**Fichier** : `components/cockpit/mobile/RiskCardMobile.tsx`

Copier le code depuis [PACK6-MOBILE-COMPONENTS.md](PACK6-MOBILE-COMPONENTS.md) section RiskCardMobile.

#### Étape 3.3 : DecisionCardMobile
**Fichier** : `components/cockpit/mobile/DecisionCardMobile.tsx`

Copier le code depuis [PACK6-MOBILE-COMPONENTS.md](PACK6-MOBILE-COMPONENTS.md) section DecisionCardMobile.

#### Étape 3.4 : EmptyStateLiveMobile
**Fichier** : `components/cockpit/mobile/EmptyStateLiveMobile.tsx`

Copier le code depuis [PACK6-MOBILE-COMPONENTS.md](PACK6-MOBILE-COMPONENTS.md) section EmptyStateLiveMobile.

**✅ Checkpoint Phase 3** :
- [ ] ProjectCardMobile créé
- [ ] RiskCardMobile créé
- [ ] DecisionCardMobile créé
- [ ] EmptyStateLiveMobile créé
- [ ] Test : Toutes les cartes s'affichent correctement
- [ ] Test : Tap feedback visible (opacity 90%)

---

### PHASE 4 : Pages principales (1 jour)

#### Étape 4.1 : Page liste projets
**Fichier** : `app/cockpit/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { ProjectCardMobile } from '@/components/cockpit/mobile/ProjectCardMobile';
import { EmptyStateLiveMobile } from '@/components/cockpit/mobile/EmptyStateLiveMobile';
import { Project } from '@/types';

export default function CockpitPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const router = useRouter();
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenProject = (projectId: string) => {
    router.push(`/cockpit/projects/${projectId}`);
  };
  
  const handleCreateProject = () => {
    // TODO: Ouvrir modal création projet
    console.log('Create project');
  };
  
  if (isLoading) {
    return <div className="loading-spinner">Chargement...</div>;
  }
  
  if (!isMobile) {
    // Layout desktop (existant)
    return <div>Desktop layout</div>;
  }
  
  return (
    <div className="mobile-projects-page">
      {projects.length === 0 ? (
        <EmptyStateLiveMobile onCreateProject={handleCreateProject} />
      ) : (
        <div className="projects-list">
          {projects.map(project => (
            <ProjectCardMobile
              key={project.id}
              project={project}
              onClick={handleOpenProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Étape 4.2 : Page liste risques
**Fichier** : `app/cockpit/risks/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiskCardMobile } from '@/components/cockpit/mobile/RiskCardMobile';
import { Risk } from '@/types';

export default function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    loadRisks();
  }, []);
  
  const loadRisks = async () => {
    const response = await fetch('/api/risks');
    const data = await response.json();
    setRisks(data);
  };
  
  const handleOpenRisk = (riskId: string) => {
    router.push(`/cockpit/risks/${riskId}`);
  };
  
  return (
    <div className="mobile-risks-page">
      <h2 className="page-title">Tous les risques</h2>
      
      {risks.length === 0 ? (
        <div className="empty-state">Aucun risque</div>
      ) : (
        <div className="risks-list">
          {risks.map(risk => (
            <RiskCardMobile
              key={risk.id}
              risk={risk}
              onClick={handleOpenRisk}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Étape 4.3 : Page liste décisions
**Fichier** : `app/cockpit/decisions/page.tsx`

Similaire à `risks/page.tsx`, remplacer `Risk` par `Decision`.

**✅ Checkpoint Phase 4** :
- [ ] Page liste projets créée
- [ ] Page liste risques créée
- [ ] Page liste décisions créée
- [ ] Test : Navigation entre pages fonctionne
- [ ] Test : EmptyState s'affiche si aucun projet

---

### PHASE 5 : Pages détails (1 jour)

#### Étape 5.1 : Détail projet
**Fichier** : `app/cockpit/projects/[id]/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MobileHeader } from '@/components/cockpit/mobile/MobileHeader';
import { RiskCardMobile } from '@/components/cockpit/mobile/RiskCardMobile';
import { DecisionCardMobile } from '@/components/cockpit/mobile/DecisionCardMobile';
import { Project, Risk, Decision } from '@/types';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    loadProjectData();
  }, [params.id]);
  
  const loadProjectData = async () => {
    const [projectRes, risksRes, decisionsRes] = await Promise.all([
      fetch(`/api/projects/${params.id}`),
      fetch(`/api/projects/${params.id}/risks`),
      fetch(`/api/projects/${params.id}/decisions`),
    ]);
    
    setProject(await projectRes.json());
    setRisks(await risksRes.json());
    setDecisions(await decisionsRes.json());
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <div className="mobile-project-detail">
      <MobileHeader
        title={project?.name || 'Projet'}
        backButton
        onBack={handleBack}
      />
      
      <div className="project-content">
        <section className="risks-section">
          <h2 className="section-title">Risques ({risks.length})</h2>
          {risks.map(risk => (
            <RiskCardMobile key={risk.id} risk={risk} onClick={() => {}} />
          ))}
        </section>
        
        <section className="decisions-section">
          <h2 className="section-title">Décisions ({decisions.length})</h2>
          {decisions.map(decision => (
            <DecisionCardMobile key={decision.id} decision={decision} onClick={() => {}} />
          ))}
        </section>
      </div>
    </div>
  );
}
```

#### Étape 5.2 : Détail risque
**Fichier** : `app/cockpit/risks/[id]/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MobileHeader } from '@/components/cockpit/mobile/MobileHeader';
import { Risk } from '@/types';

export default function RiskDetailPage({ params }: { params: { id: string } }) {
  const [risk, setRisk] = useState<Risk | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    loadRisk();
  }, [params.id]);
  
  const loadRisk = async () => {
    const response = await fetch(`/api/risks/${params.id}`);
    const data = await response.json();
    setRisk(data);
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <div className="mobile-risk-detail">
      <MobileHeader
        title={risk?.title || 'Risque'}
        backButton
        onBack={handleBack}
      />
      
      <div className="risk-content">
        {/* Détails du risque */}
        <div className="risk-meta">
          <span className="severity-badge">{risk?.severity}</span>
          <span className="status-badge">{risk?.status}</span>
        </div>
        
        <div className="risk-description">
          <h3>Description</h3>
          <p>{risk?.description}</p>
        </div>
      </div>
    </div>
  );
}
```

**✅ Checkpoint Phase 5** :
- [ ] Détail projet créé
- [ ] Détail risque créé
- [ ] Détail décision créé
- [ ] Test : Navigation vers détail fonctionne
- [ ] Test : Bouton retour fonctionne

---

### PHASE 6 : Modals & Interactions (0.5 jour)

#### Étape 6.1 : MobileModal
**Fichier** : `components/cockpit/mobile/MobileModal.tsx`

Copier le code depuis [PACK6-MOBILE-COMPONENTS.md](PACK6-MOBILE-COMPONENTS.md) section MobileModal.

#### Étape 6.2 : Modal création projet
Ajouter dans `app/cockpit/page.tsx` :

```tsx
const [isModalOpen, setIsModalOpen] = useState(false);

const handleCreateProject = () => {
  setIsModalOpen(true);
};

// Dans le JSX
<MobileModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Créer un projet"
>
  <CreateProjectForm onSubmit={handleSubmitProject} />
</MobileModal>
```

**✅ Checkpoint Phase 6** :
- [ ] MobileModal créé
- [ ] Modal création projet intégré
- [ ] Test : Modal s'ouvre avec slide-up
- [ ] Test : Modal se ferme (overlay + bouton X)

---

### PHASE 7 : Transitions & Polish (0.5 jour)

#### Étape 7.1 : Animations CSS
**Fichier** : `styles/mobile.css`

```css
/* Slide-up page transition */
@keyframes slideUpPage {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.page-transition-slide-up {
  animation: slideUpPage 180ms ease;
}

/* Slide-down page transition */
@keyframes slideDownPage {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

.page-transition-slide-down {
  animation: slideDownPage 180ms ease;
}

/* Fade transition */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 120ms ease;
}
```

#### Étape 7.2 : Tap feedback universel
Ajouter dans tous les composants cliquables :

```css
.tappable {
  transition: opacity var(--transition-tap), transform var(--transition-tap);
}

.tappable:active {
  opacity: 0.9;
  transform: scale(0.98);
}
```

**✅ Checkpoint Phase 7** :
- [ ] Animations slide-up / slide-down ajoutées
- [ ] Fade transition ajoutée
- [ ] Tap feedback sur tous les éléments cliquables
- [ ] Test : Toutes les transitions fluides (60fps)

---

## ✅ CHECKLIST FINALE

### Code Quality
- [ ] Aucun warning TypeScript
- [ ] Aucun warning ESLint
- [ ] Aucun console.log
- [ ] Aucun code mort
- [ ] Aucun TODO

### Fonctionnel
- [ ] Détection mobile fonctionne
- [ ] Layout mobile activé en LIVE uniquement
- [ ] Bottom nav fonctionne (4 onglets)
- [ ] Toutes les cartes s'affichent
- [ ] EmptyState s'affiche si aucun projet
- [ ] Navigation vers détails fonctionne
- [ ] Bouton retour fonctionne
- [ ] Modal création projet fonctionne

### Visuel
- [ ] Header conforme (56px)
- [ ] Bottom nav conforme (64px)
- [ ] Cartes conformes (dimensions, padding, radius)
- [ ] Couleurs conformes (Design System PACK 4)
- [ ] Typographie conforme (≥ 12px)
- [ ] Spacing conforme (16px, 12px)

### Performance
- [ ] Transitions fluides (120-240ms)
- [ ] Tap feedback immédiat (<100ms)
- [ ] Scroll fluide (no jank)
- [ ] Lighthouse mobile score > 90

### Accessibilité
- [ ] Touch targets ≥ 44x44px
- [ ] Contrast ratio ≥ 4.5:1
- [ ] Text size ≥ 12px
- [ ] Labels présents sur boutons

### Tests devices
- [ ] iPhone SE (375px)
- [ ] iPhone 13 (390px)
- [ ] iPhone 13 Pro Max (428px)
- [ ] Android (360px)
- [ ] Landscape mode
- [ ] Safe area (notch + home indicator)

---

## 🐛 TROUBLESHOOTING

### Problème : Layout mobile ne s'active pas
**Solution** : Vérifier que `useIsMobile` retourne `true` sur mobile.
```tsx
console.log('isMobile:', isMobile);
```

### Problème : Transitions saccadées
**Solution** : Utiliser `will-change` CSS pour optimiser les animations.
```css
.page-transition {
  will-change: transform, opacity;
}
```

### Problème : Touch targets trop petits
**Solution** : Utiliser `min-width: 44px; min-height: 44px` sur tous les boutons.

### Problème : Scroll bloqué sous le header
**Solution** : Utiliser `position: sticky` pour le header et bottom nav.

---

## 📚 RESSOURCES

- [PACK6-MOBILE-UX.md](PACK6-MOBILE-UX.md) — Spec complète
- [PACK6-MOBILE-COMPONENTS.md](PACK6-MOBILE-COMPONENTS.md) — Code des composants
- [PACK4-DESIGN-SYSTEM.md](PACK4-DESIGN-SYSTEM.md) — Design System

---

**Version** : 1.0.0  
**Date** : 29 janvier 2026  
**Pour** : VB (Développement)
