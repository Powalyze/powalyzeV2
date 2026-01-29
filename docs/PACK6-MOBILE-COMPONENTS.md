# PACK 6 — Mobile Components Specs

**Powalyze - Spécifications techniques des composants mobiles**  
**Version** : 1.0.0  
**Date** : 29 janvier 2026

---

## 📱 COMPOSANTS DÉTAILLÉS

### 1. MobileHeader

**Fichier** : `components/cockpit/mobile/MobileHeader.tsx`

```tsx
import React from 'react';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  backButton?: boolean;
  onBack?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  backButton = false,
  onBack,
}) => {
  return (
    <header className="mobile-header">
      {backButton && (
        <button className="back-button" onClick={onBack}>
          <ChevronLeft size={24} />
        </button>
      )}
      
      <div className="header-content">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
};
```

**Styles** :
```css
.mobile-header {
  height: 56px;
  padding: 12px 16px;
  background: #0A0A0A;
  border-bottom: 1px solid #1E1E1E;
  display: flex;
  align-items: center;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-button {
  background: transparent;
  border: none;
  color: #FFFFFF;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-content {
  flex: 1;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1.2;
  margin: 0;
}

.header-subtitle {
  font-size: 12px;
  color: #6A6A6A;
  line-height: 1.2;
  margin: 2px 0 0 0;
}
```

---

### 2. ProjectCardMobile

**Fichier** : `components/cockpit/mobile/ProjectCardMobile.tsx`

```tsx
import React from 'react';
import { AlertTriangle, CheckSquare } from 'lucide-react';
import { Project } from '@/types';

interface ProjectCardMobileProps {
  project: Project;
  onClick: (projectId: string) => void;
}

export const ProjectCardMobile: React.FC<ProjectCardMobileProps> = ({
  project,
  onClick,
}) => {
  const openRisksCount = project.risks?.filter(r => r.status === 'OPEN').length || 0;
  const pendingDecisionsCount = project.decisions?.filter(d => d.status === 'PENDING').length || 0;
  
  return (
    <div
      className="project-card-mobile"
      onClick={() => onClick(project.id)}
    >
      <h3 className="project-title">{project.name}</h3>
      <p className="project-subtitle">
        {project.description || "Aucune description"}
      </p>
      
      <div className="project-stats">
        {openRisksCount > 0 && (
          <span className="stat-badge risk">
            <AlertTriangle size={14} />
            {openRisksCount} risque{openRisksCount > 1 ? 's' : ''} ouvert{openRisksCount > 1 ? 's' : ''}
          </span>
        )}
        
        {pendingDecisionsCount > 0 && (
          <span className="stat-badge decision">
            <CheckSquare size={14} />
            {pendingDecisionsCount} décision{pendingDecisionsCount > 1 ? 's' : ''}
          </span>
        )}
        
        {openRisksCount === 0 && pendingDecisionsCount === 0 && (
          <span className="stat-badge neutral">
            Aucun élément en attente
          </span>
        )}
      </div>
    </div>
  );
};
```

**Styles** :
```css
.project-card-mobile {
  width: 100%;
  padding: 16px;
  background: #111111;
  border: 1px solid #1E1E1E;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 120ms ease;
  -webkit-tap-highlight-color: transparent;
}

.project-card-mobile:active {
  opacity: 0.9;
  transform: scale(0.99);
}

.project-title {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 4px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.project-subtitle {
  font-size: 14px;
  color: #6A6A6A;
  margin: 0 0 12px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.project-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9A9A9A;
}

.stat-badge svg {
  width: 14px;
  height: 14px;
}

.stat-badge.risk {
  color: #EF4444;
}

.stat-badge.decision {
  color: #FBBF24;
}

.stat-badge.neutral {
  color: #6A6A6A;
}
```

---

### 3. RiskCardMobile

**Fichier** : `components/cockpit/mobile/RiskCardMobile.tsx`

```tsx
import React from 'react';
import { Risk } from '@/types';
import { cn } from '@/lib/utils';

interface RiskCardMobileProps {
  risk: Risk;
  onClick: (riskId: string) => void;
}

export const RiskCardMobile: React.FC<RiskCardMobileProps> = ({
  risk,
  onClick,
}) => {
  const getSeverityLabel = (severity: string) => {
    const labels = {
      HIGH: 'Élevé',
      MEDIUM: 'Moyen',
      LOW: 'Faible',
    };
    return labels[severity as keyof typeof labels] || severity;
  };
  
  const getSeverityIcon = (severity: string) => {
    const icons = {
      HIGH: '🔴',
      MEDIUM: '🟡',
      LOW: '🟢',
    };
    return icons[severity as keyof typeof icons] || '';
  };
  
  const getStatusLabel = (status: string) => {
    const labels = {
      OPEN: 'Ouvert',
      IN_PROGRESS: 'En cours',
      RESOLVED: 'Résolu',
      CLOSED: 'Fermé',
    };
    return labels[status as keyof typeof labels] || status;
  };
  
  return (
    <div
      className="risk-card-mobile"
      onClick={() => onClick(risk.id)}
    >
      <h4 className="risk-title">{risk.title}</h4>
      
      <div className="risk-meta">
        <span className={cn("severity-badge", risk.severity.toLowerCase())}>
          {getSeverityIcon(risk.severity)} {getSeverityLabel(risk.severity)}
        </span>
        
        <span className="status-badge">{getStatusLabel(risk.status)}</span>
      </div>
    </div>
  );
};
```

**Styles** :
```css
.risk-card-mobile {
  width: 100%;
  padding: 12px 16px;
  background: #111111;
  border: 1px solid #1E1E1E;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 120ms ease;
  -webkit-tap-highlight-color: transparent;
}

.risk-card-mobile:active {
  opacity: 0.9;
}

.risk-title {
  font-size: 15px;
  font-weight: 500;
  color: #FFFFFF;
  margin: 0 0 8px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.risk-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.severity-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  font-weight: 500;
}

.severity-badge.high {
  background: rgba(239, 68, 68, 0.15);
  color: #EF4444;
}

.severity-badge.medium {
  background: rgba(251, 191, 36, 0.15);
  color: #FBBF24;
}

.severity-badge.low {
  background: rgba(34, 197, 94, 0.15);
  color: #22C55E;
}

.status-badge {
  font-size: 12px;
  color: #9A9A9A;
}
```

---

### 4. DecisionCardMobile

**Fichier** : `components/cockpit/mobile/DecisionCardMobile.tsx`

```tsx
import React from 'react';
import { User } from 'lucide-react';
import { Decision } from '@/types';
import { cn } from '@/lib/utils';

interface DecisionCardMobileProps {
  decision: Decision;
  onClick: (decisionId: string) => void;
}

export const DecisionCardMobile: React.FC<DecisionCardMobileProps> = ({
  decision,
  onClick,
}) => {
  const getStatusLabel = (status: string) => {
    const labels = {
      PENDING: 'En attente',
      APPROVED: 'Approuvé',
      REJECTED: 'Rejeté',
    };
    return labels[status as keyof typeof labels] || status;
  };
  
  return (
    <div
      className="decision-card-mobile"
      onClick={() => onClick(decision.id)}
    >
      <h4 className="decision-title">{decision.title}</h4>
      
      <div className="decision-meta">
        <span className="owner-badge">
          <User size={14} />
          {decision.owner || "Non assigné"}
        </span>
        
        <span className={cn("status-badge", decision.status.toLowerCase())}>
          {getStatusLabel(decision.status)}
        </span>
      </div>
    </div>
  );
};
```

**Styles** :
```css
.decision-card-mobile {
  width: 100%;
  padding: 12px 16px;
  background: #111111;
  border: 1px solid #1E1E1E;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 120ms ease;
  -webkit-tap-highlight-color: transparent;
}

.decision-card-mobile:active {
  opacity: 0.9;
}

.decision-title {
  font-size: 15px;
  font-weight: 500;
  color: #FFFFFF;
  margin: 0 0 8px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.decision-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.owner-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9A9A9A;
}

.owner-badge svg {
  width: 14px;
  height: 14px;
}

.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.15);
  color: #FBBF24;
}

.status-badge.approved {
  background: rgba(34, 197, 94, 0.15);
  color: #22C55E;
}

.status-badge.rejected {
  background: rgba(239, 68, 68, 0.15);
  color: #EF4444;
}
```

---

### 5. EmptyStateLiveMobile

**Fichier** : `components/cockpit/mobile/EmptyStateLiveMobile.tsx`

```tsx
import React from 'react';
import { Briefcase } from 'lucide-react';

interface EmptyStateLiveMobileProps {
  onCreateProject: () => void;
}

export const EmptyStateLiveMobile: React.FC<EmptyStateLiveMobileProps> = ({
  onCreateProject,
}) => {
  return (
    <div className="empty-state-live-mobile">
      <div className="empty-content">
        <div className="empty-icon">
          <Briefcase size={64} strokeWidth={1} />
        </div>
        
        <h2 className="empty-title">Commencez votre premier projet</h2>
        <p className="empty-subtitle">
          Créez un projet pour suivre vos portefeuilles, risques et décisions
        </p>
        
        <button className="empty-cta" onClick={onCreateProject}>
          Créer mon premier projet
        </button>
      </div>
    </div>
  );
};
```

**Styles** :
```css
.empty-state-live-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 56px - 64px);
  padding: 24px 16px;
}

.empty-content {
  text-align: center;
  max-width: 320px;
  width: 100%;
}

.empty-icon {
  color: #3A82F7;
  margin: 0 auto 24px;
  opacity: 0.8;
}

.empty-icon svg {
  width: 64px;
  height: 64px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.empty-subtitle {
  font-size: 14px;
  color: #6A6A6A;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.empty-cta {
  width: 100%;
  padding: 14px 24px;
  background: #FFFFFF;
  color: #0A0A0A;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 120ms ease;
  -webkit-tap-highlight-color: transparent;
}

.empty-cta:active {
  opacity: 0.9;
  transform: scale(0.98);
}
```

---

### 6. BottomNav

**Fichier** : `components/cockpit/mobile/BottomNav.tsx`

```tsx
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Briefcase, AlertTriangle, CheckSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const tabs = [
    {
      id: 'projects',
      label: 'Projets',
      icon: Briefcase,
      path: '/cockpit',
    },
    {
      id: 'risks',
      label: 'Risques',
      icon: AlertTriangle,
      path: '/cockpit/risks',
    },
    {
      id: 'decisions',
      label: 'Décisions',
      icon: CheckSquare,
      path: '/cockpit/decisions',
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      path: '/cockpit/profile',
    },
  ];
  
  const getActiveTab = () => {
    if (activeTab) return activeTab;
    if (pathname === '/cockpit') return 'projects';
    if (pathname.startsWith('/cockpit/risks')) return 'risks';
    if (pathname.startsWith('/cockpit/decisions')) return 'decisions';
    if (pathname.startsWith('/cockpit/profile')) return 'profile';
    return 'projects';
  };
  
  const currentTab = getActiveTab();
  
  const handleTabChange = (tab: typeof tabs[0]) => {
    if (tab.id === currentTab) return;
    router.push(tab.path);
  };
  
  return (
    <nav className="mobile-bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === currentTab;
        
        return (
          <button
            key={tab.id}
            className={cn("nav-item", { active: isActive })}
            onClick={() => handleTabChange(tab)}
          >
            <Icon size={24} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
```

**Styles** :
```css
.mobile-bottom-nav {
  height: 64px;
  padding: 8px;
  background: #0A0A0A;
  border-top: 1px solid #1E1E1E;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: #6A6A6A;
  cursor: pointer;
  transition: all 120ms ease;
  -webkit-tap-highlight-color: transparent;
  min-width: 64px;
}

.nav-item svg {
  width: 24px;
  height: 24px;
}

.nav-item span {
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

.nav-item.active {
  color: #3A82F7;
}

.nav-item:active {
  opacity: 0.9;
  transform: scale(0.98);
}
```

---

### 7. MobileModal

**Fichier** : `components/cockpit/mobile/MobileModal.tsx`

```tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const MobileModal: React.FC<MobileModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={cn("modal-mobile", className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-handle"></div>
        
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};
```

**Styles** (voir PACK6-MOBILE-UX.md section Modal)

---

## 🎨 TOKENS & VARIABLES

### Dimensions
```css
:root {
  /* Header */
  --mobile-header-height: 56px;
  --mobile-header-padding-x: 16px;
  --mobile-header-padding-y: 12px;
  
  /* Bottom Nav */
  --mobile-bottom-nav-height: 64px;
  --mobile-bottom-nav-padding: 8px;
  
  /* Main Content */
  --mobile-main-padding-x: 16px;
  --mobile-main-padding-y: 12px;
  
  /* Cards */
  --mobile-card-border-radius: 12px;
  --mobile-card-padding: 16px;
  --mobile-card-gap: 12px;
  
  /* Modal */
  --mobile-modal-border-radius-top: 16px;
  --mobile-modal-handle-width: 40px;
  --mobile-modal-handle-height: 4px;
  
  /* Touch targets */
  --mobile-min-touch-target: 44px;
}
```

### Transitions
```css
:root {
  --transition-tap: 80ms ease;
  --transition-button: 120ms ease;
  --transition-page: 180ms ease;
  --transition-modal: 240ms ease;
}
```

### Colors (from PACK 4)
```css
:root {
  /* Background */
  --color-bg-primary: #0A0A0A;
  --color-bg-secondary: #111111;
  --color-bg-tertiary: #1E1E1E;
  
  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #9A9A9A;
  --color-text-tertiary: #6A6A6A;
  
  /* Brand */
  --color-brand-primary: #3A82F7;
  
  /* Status */
  --color-status-high: #EF4444;
  --color-status-medium: #FBBF24;
  --color-status-low: #22C55E;
}
```

---

## ✅ USAGE PATTERNS

### Pattern 1 : Liste de cartes
```tsx
// app/cockpit/page.tsx (mobile)
<main className="mobile-main">
  {projects.map(project => (
    <ProjectCardMobile
      key={project.id}
      project={project}
      onClick={handleOpenProject}
    />
  ))}
</main>
```

### Pattern 2 : Empty state
```tsx
<main className="mobile-main">
  {projects.length === 0 ? (
    <EmptyStateLiveMobile onCreateProject={handleCreateProject} />
  ) : (
    // Liste de cartes
  )}
</main>
```

### Pattern 3 : Modal création
```tsx
<MobileModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Créer un projet"
>
  <CreateProjectForm onSubmit={handleSubmit} />
</MobileModal>
```

### Pattern 4 : Navigation avec transition
```tsx
const handleOpenProject = (projectId: string) => {
  router.push(`/cockpit/projects/${projectId}`);
  // Transition automatique via CSS
};
```

---

**Version** : 1.0.0  
**Date** : 29 janvier 2026  
**Complément** : PACK6-MOBILE-UX.md
