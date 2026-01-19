# 🎯 BLOC UNIQUE — SYSTÈME POWALYZE 2026

**Version**: 2.0  
**Date**: Janvier 2026  
**Statut**: Directive maîtresse (vitrine + cockpit)

---

## 1. IDENTITÉ GLOBALE

### 1.1. Palette Premium

```css
/* Or - Titres, accents clés */
--color-gold: #D4AF37;
--color-gold-light: #E8C96A;
--color-gold-dark: #B89730;

/* Bleu nuit - Sous-titres, textes forts */
--color-navy: #0A1A2F;
--color-navy-light: #1A2A3F;
--color-navy-dark: #050D17;

/* Neutres - Fonds, séparateurs, textes */
--color-neutral-100: #F5F5F5;  /* Fond zone de travail */
--color-neutral-200: #E8E8E8;  /* Séparateurs */
--color-neutral-900: #1A1A1A;  /* Textes */
--color-white: #FFFFFF;        /* Cartes */
```

**⚠️ RÈGLE ABSOLUE**: Jamais plus de 3 couleurs visibles simultanément

### 1.2. Typographies

```css
/* Titres */
font-family: 'Inter Tight', sans-serif;
font-weight: 600; /* SemiBold */

/* Corps */
font-family: 'Inter', sans-serif;
font-weight: 400; /* Regular */
```

### 1.3. Espacements Généreux

```css
--spacing-md: 24px;
--spacing-lg: 32px;
--spacing-xl: 48px;
```

**Application**: Respiration suisse, jamais de sensation d'écrasement

### 1.4. Animations Douces

```css
/* Transitions */
transition: opacity 180ms, transform 180ms;

/* Mouvements */
transform: translateY(8px) → translateY(0);
transform: translateY(12px) → translateY(0);

/* Durées max */
180ms - 300ms
```

### 1.5. Icônes

- Minimalistes
- Monochromes (or ou bleu nuit)
- Lucide React uniquement
- Taille: 20px ou 24px

### 1.6. Layout Universel

```
┌─────────────────────────────────────────────────┐
│ TOPBAR FIXE (logo, titre, langue, actions)     │
├─────────────────────────────────────────────────┤
│                                                 │
│  CONTENU CENTRÉ (max-width: 1280px)           │
│  Grille 12 colonnes                            │
│  Pas de sidebar                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 2. COCKPIT PRO — STRUCTURE UNIQUE

**⚠️ TOUS les modules suivent cette structure, sans exception**

### 2.1. Header Module (Identique partout)

```tsx
<ModuleCard
  title="[Titre en OR]"
  subtitle="Ce module vous aide à [action concrète]"
  narration="[Phrase d'ouverture guidante]"
  actions={
    <>
      <button className="ds-btn ds-btn-primary">
        [Créer / Nouvelle entrée]
      </button>
      <button className="ds-btn ds-btn-ghost">Filtrer</button>
      <button className="ds-btn ds-btn-ghost">Exporter</button>
    </>
  }
>
```

**Exemples de sous-titres**:
- Risques: "Ce module vous aide à identifier et mitiger les menaces"
- Décisions: "Ce module vous aide à tracer et suivre les arbitrages stratégiques"
- Projets: "Ce module vous aide à piloter l'exécution du portefeuille"
- Comités: "Ce module vous aide à structurer la gouvernance exécutive"
- Journal: "Ce module vous aide à suivre les événements stratégiques"

### 2.2. Zone de Travail

```css
/* Fond */
background: var(--color-neutral-100);
padding: var(--spacing-lg);

/* Cartes */
.ds-card {
  background: var(--color-white);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: var(--spacing-md);
}
```

**Règle**: Aucune surcharge visuelle, espacement vertical constant

### 2.3. Synthèse Haute (3-4 KPI max)

```tsx
<div className="ds-grid ds-grid-4 mb-8">
  <KPICard label="Total" value="42" icon={<Target />} />
  <KPICard label="Critiques" value="7" trend="up" />
  <KPICard label="En hausse" value="3" />
  <KPICard label="Résolus" value="18" />
</div>
```

**Par module**:

#### Risques:
- Total
- Critiques
- En hausse
- Résolus

#### Décisions:
- En attente
- Validées
- Critiques
- En retard

#### Projets:
- Actifs
- En retard
- Critiques
- Charge globale

#### Comités:
- Total comités
- Prochaines séances (7j)
- Points à traiter
- Taux de résolution

#### Journal:
- Entrées (30j)
- Signaux faibles
- Décisions tracées
- Risques émergents

### 2.4. Vue Principale

#### RISQUES — Tableau Premium

```tsx
<table className="ds-table">
  <thead>
    <tr>
      <th>Titre</th>
      <th>Niveau</th>
      <th>Probabilité</th>
      <th>Impact</th>
      <th>Responsable</th>
      <th>Statut</th>
      <th>Dernière MAJ</th>
    </tr>
  </thead>
  {/* ... */}
</table>
```

#### DÉCISIONS — Timeline + Tableau

```tsx
<div className="flex gap-8">
  <Timeline items={decisions} />
  <DecisionsTable data={decisions} />
</div>
```

**Colonnes**:
- Titre
- Origine/Comité
- Responsable
- Impact
- Statut
- Échéance

#### PROJETS — Kanban + Synthèse

```tsx
<Kanban columns={['À lancer', 'En cours', 'En revue', 'Terminé']}>
  <ProjectCard {...project} />
</Kanban>
```

#### COMITÉS — Liste Structurée

**Colonnes**:
- Nom
- Fréquence
- Prochaine séance
- Responsable
- Points à traiter

#### JOURNAL EXÉCUTIF — Timeline

```tsx
<JournalTimeline>
  <JournalEntry 
    date="2026-01-15"
    type="risque"
    title="..."
    impact="moyen"
  />
</JournalTimeline>
```

**Types d'entrées**:
- Risque
- Projet
- Décision
- Signal faible
- Info stratégique

### 2.5. Fiche Détaillée (Pattern Unique)

**⚠️ Structure identique pour TOUTES les entités**

```tsx
<DetailSheet>
  {/* BLOC 1: Informations clés */}
  <Section title="Informations">
    <Field label="Titre" value={entity.title} />
    <Field label="Statut" value={entity.status} />
    <Field label="Responsable" value={entity.owner} />
    {/* ... */}
  </Section>

  {/* BLOC 2: Contexte / Objectifs */}
  <Section title="Contexte">
    <RichText content={entity.context} />
  </Section>

  {/* BLOC 3: Liens */}
  <Section title="Liens">
    <LinkedRisks risks={entity.linkedRisks} />
    <LinkedDecisions decisions={entity.linkedDecisions} />
    <LinkedProjects projects={entity.linkedProjects} />
    <LinkedCommittees committees={entity.linkedCommittees} />
  </Section>

  {/* BLOC 4: Suivi / Historique */}
  <Section title="Historique">
    <Timeline events={entity.history} />
  </Section>

  {/* BLOC 5: IA Narrative */}
  <Section title="Synthèse IA" icon={<Sparkles />}>
    <AINarrative>
      <p><strong>Résumé exécutif:</strong> {ai.summary}</p>
      <p><strong>Analyse:</strong> {ai.analysis}</p>
      <p><strong>Recommandations:</strong> {ai.recommendations}</p>
      <p><strong>Scénarios:</strong> {ai.scenarios}</p>
      <p><strong>Alertes:</strong> {ai.alerts}</p>
    </AINarrative>
  </Section>
</DetailSheet>
```

---

## 3. IA NARRATIVE — RÈGLES TRANSVERSALES

### 3.1. Ton Obligatoire

✅ **Adopter**:
- Concis
- Exécutif
- Orienté arbitrage
- Sans jargon technique

❌ **Éviter**:
- Langue de bois
- Termes techniques non expliqués
- Phrases > 20 mots
- Euphémismes

### 3.2. Présence Systématique

**Dans chaque module**, un bloc clairement identifié:

```tsx
<div className="ds-card bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-gold">
  <div className="flex items-center gap-2 mb-4">
    <Sparkles className="text-gold" />
    <h3 className="ds-subtitle-navy">Synthèse IA</h3>
  </div>
  <div className="text-sm leading-relaxed">
    {aiNarrative}
  </div>
</div>
```

### 3.3. Longueur Max

**5-7 lignes par synthèse**, jamais plus

### 3.4. Structure Obligatoire

Toujours répondre à:
1. **Qu'est-ce qui se passe ?** (constat)
2. **Pourquoi c'est important ?** (enjeu)
3. **Que faut-il décider / surveiller ?** (action)

**Exemple (Risque)**:
```
Résumé: Ce risque fournisseur ERP affecte 3 projets critiques.
Analyse: Probabilité en hausse (0.7) avec impact fort sur roadmap Q2.
Recommandation: Négocier clauses de réversibilité sous 4 semaines.
Scénario: Si non mitigé, retard de 2 mois sur migration cloud.
Alerte: Deadline de négociation: 15 février 2026.
```

---

## 4. LANGUES — SYSTÈME UNIQUE

### 4.1. Fichier Unique

```json
// locales/fr.json & locales/en.json
{
  "common": { ... },
  "nav": { ... },
  "modules": {
    "risks": {
      "title": "Risques",
      "subtitle": "Ce module vous aide à identifier et mitiger les menaces",
      "narration": "Suivez les risques qui peuvent impacter vos projets stratégiques"
    },
    "decisions": { ... },
    "projects": { ... },
    "committees": { ... },
    "journal": { ... }
  }
}
```

### 4.2. Utilisation

```tsx
import { useTranslation } from '@/lib/i18n';

const { t } = useTranslation();

<h1>{t('modules.risks.title')}</h1>
```

### 4.3. Sélecteur de Langue

```tsx
<NavigationTop mode="cockpit">
  <LanguageSwitcher />
</NavigationTop>
```

**⚠️ RÈGLE ABSOLUE**: Aucun texte en dur dans le code

---

## 5. VITRINE — MIROIR DU COCKPIT

**Principe**: La vitrine ne vit plus sa vie, elle reflète le cockpit

### 5.1. Hero Premium

```tsx
<section className="ds-hero-video">
  <video autoPlay loop muted playsInline>
    <source src="/videos/cockpit-motion.mp4" />
  </video>
  <div className="ds-hero-overlay">
    <h1 className="ds-hero-title">
      Powalyze — Cockpit Exécutif & Gouvernance IA
    </h1>
    <p className="ds-hero-subtitle">
      {t('hero.subtitle')}
    </p>
    <Link href="/cockpit" className="ds-btn ds-btn-primary ds-btn-lg">
      Entrer dans le cockpit
    </Link>
  </div>
</section>
```

**Vidéo**: Zoom lent, ambiance premium, 10-15s loop

### 5.2. Bloc "Ce que vous voyez = Ce que vous utilisez"

```tsx
<section className="ds-section ds-container">
  <h2 className="ds-title-gold text-center mb-16">
    Les 3 modules phares
  </h2>
  <div className="ds-grid ds-grid-3">
    <ModuleShowcase
      title="Risques"
      screenshot="/images/cockpit-risks.png"
      narrative={t('modules.risks.narration')}
    />
    <ModuleShowcase
      title="Décisions"
      screenshot="/images/cockpit-decisions.png"
      narrative={t('modules.decisions.narration')}
    />
    <ModuleShowcase
      title="Projets"
      screenshot="/images/cockpit-projects.png"
      narrative={t('modules.projects.narration')}
    />
  </div>
</section>
```

**Micro-animation**: Hover scale(1.02) + shadow

### 5.3. Bloc "Le cockpit en action"

```tsx
<section className="ds-section-compact ds-container">
  <h2 className="ds-title-gold text-center mb-8">
    Le cockpit en action
  </h2>
  <video className="w-full rounded-xl shadow-xl" controls>
    <source src="/videos/cockpit-demo.mp4" />
  </video>
  <p className="text-center mt-6 ds-body">
    Navigation • Création d'un risque • Journal de décision • Vue projet
  </p>
</section>
```

**Vidéo**: 60-90s, même esthétique que le cockpit réel

### 5.4. Bloc "Pourquoi Powalyze est différent"

```tsx
<section className="ds-section ds-container">
  <h2 className="ds-title-gold text-center mb-12">
    Pourquoi Powalyze est différent
  </h2>
  <div className="ds-grid ds-grid-3">
    <Pillar
      icon={<MessageSquare />}
      title="Narratif"
      description="L'IA raconte et éclaire vos décisions stratégiques"
    />
    <Pillar
      icon={<Zap />}
      title="Proactif"
      description="Alertes, scénarios et signaux faibles avant la crise"
    />
    <Pillar
      icon={<Shield />}
      title="Exécutif"
      description="Orienté arbitrage, comités et décisions de gouvernance"
    />
  </div>
</section>
```

### 5.5. CTA Final

```tsx
<section className="ds-section text-center">
  <h2 className="ds-title-gold ds-title-xl mb-6">
    Prêt à piloter vos décisions stratégiques ?
  </h2>
  <Link href="/cockpit" className="ds-btn ds-btn-primary ds-btn-lg">
    Accéder au cockpit
  </Link>
</section>
```

**Style**: Identique aux boutons du cockpit (même classe CSS)

---

## 6. PRIORITÉS D'EXÉCUTION (ORDRE STRICT)

### ✅ Phase 1: Fondations (TERMINÉE)
- [x] Design system CSS complet
- [x] Système i18n FR/EN
- [x] NavigationTop unifiée
- [x] Composant ModuleCard
- [x] LanguageSwitcher

### 🚧 Phase 2: Stabilisation Cockpit (EN COURS)

#### 2.1. Refonte module RISQUES
```tsx
// app/(dashboard)/risques/page.tsx
import ModuleCard from '@/components/cockpit/ModuleCard';
import { useTranslation } from '@/lib/i18n';

export default function RisquesPage() {
  const { t } = useTranslation();
  
  return (
    <ModuleCard
      title={t('modules.risks.title')}
      subtitle={t('modules.risks.subtitle')}
      narration={t('modules.risks.narration')}
      icon={<AlertTriangle />}
      actions={
        <>
          <button className="ds-btn ds-btn-primary">
            {t('risks.createNew')}
          </button>
          <button className="ds-btn ds-btn-ghost">
            {t('common.filter')}
          </button>
          <button className="ds-btn ds-btn-ghost">
            {t('common.export')}
          </button>
        </>
      }
    >
      {/* Synthèse haute */}
      <div className="ds-grid ds-grid-4 mb-8">
        <KPICard label={t('risks.total')} value={totalRisks} />
        <KPICard label={t('risks.critical')} value={criticalRisks} />
        <KPICard label={t('risks.rising')} value={risingRisks} />
        <KPICard label={t('risks.resolved')} value={resolvedRisks} />
      </div>

      {/* Tableau */}
      <RisksTable data={risks} />

      {/* IA Narrative */}
      <AINarrativeBlock 
        summary="..."
        analysis="..."
        recommendations="..."
        scenarios="..."
        alerts="..."
      />
    </ModuleCard>
  );
}
```

#### 2.2. Refonte module DÉCISIONS
- Timeline + Tableau
- Structure identique à Risques
- IA narrative

#### 2.3. Refonte module PROJETS
- Kanban + Synthèse
- Structure identique
- IA narrative + ProjectPredictor

#### 2.4. Création module COMITÉS
- Liste structurée
- Fiche détaillée comité
- IA narrative

#### 2.5. Création module JOURNAL EXÉCUTIF
- Timeline chronologique
- Catégorisation
- IA narrative

### 📐 Phase 3: Design & Animations

- [ ] Nettoyer tous les styles inline
- [ ] Appliquer palette stricte (or/bleu/neutres)
- [ ] Unifier espacements (24/32/48px)
- [ ] Micro-animations (180-300ms)
- [ ] Icônes monochromes partout

### 🤖 Phase 4: IA Narrative

- [ ] Créer composant AINarrativeBlock
- [ ] Implémenter génération IA pour chaque module
- [ ] Intégrer dans toutes les fiches détaillées
- [ ] Ton exécutif, 5-7 lignes max

### 🌐 Phase 5: Langues Globales

- [ ] Enrichir locales/fr.json avec tous les modules
- [ ] Enrichir locales/en.json (traduction complète)
- [ ] Supprimer tous les textes en dur
- [ ] Tester switcher FR/EN partout

### 🎬 Phase 6: Vitrine Alignée

- [ ] Vidéo hero (cockpit en mouvement)
- [ ] Screenshots des 3 modules phares
- [ ] Vidéo démo 60-90s
- [ ] Page vitrine complète
- [ ] Même design que cockpit

---

## 7. COMPOSANTS RÉUTILISABLES

### 7.1. KPICard

```tsx
interface KPICardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

export function KPICard({ label, value, icon, trend }: KPICardProps) {
  return (
    <div className="ds-card p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-neutral-600">{label}</span>
        {icon && <span className="text-gold">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-navy">{value}</span>
        {trend && <TrendIndicator trend={trend} />}
      </div>
    </div>
  );
}
```

### 7.2. AINarrativeBlock

```tsx
interface AINarrativeBlockProps {
  summary: string;
  analysis: string;
  recommendations: string;
  scenarios?: string;
  alerts?: string;
}

export function AINarrativeBlock(props: AINarrativeBlockProps) {
  return (
    <div className="ds-card bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-gold mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-gold" />
        <h3 className="ds-subtitle-navy ds-subtitle-md">Synthèse IA</h3>
      </div>
      <div className="space-y-3 text-sm leading-relaxed">
        <p><strong>Résumé exécutif:</strong> {props.summary}</p>
        <p><strong>Analyse:</strong> {props.analysis}</p>
        <p><strong>Recommandations:</strong> {props.recommendations}</p>
        {props.scenarios && (
          <p><strong>Scénarios:</strong> {props.scenarios}</p>
        )}
        {props.alerts && (
          <p className="text-warning font-medium">
            <strong>Alertes:</strong> {props.alerts}
          </p>
        )}
      </div>
    </div>
  );
}
```

### 7.3. DetailSheet

```tsx
interface DetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function DetailSheet({ isOpen, onClose, title, children }: DetailSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 flex items-center justify-between">
          <h2 className="ds-title-gold ds-title-lg">{title}</h2>
          <button onClick={onClose} className="ds-btn ds-btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
```

---

## 8. RÈGLES DE VALIDATION

### Avant chaque commit:

- [ ] Aucune couleur hors palette (or/bleu/neutres)
- [ ] Aucun texte en dur (tout passe par `t()`)
- [ ] Structure ModuleCard respectée
- [ ] Espacements multiples de 8px
- [ ] Animations ≤ 300ms
- [ ] Build sans erreur TypeScript
- [ ] Test FR et EN

### Avant chaque déploiement:

- [ ] Capture d'écran de chaque module
- [ ] Test navigation complète
- [ ] Test switcher de langues
- [ ] Test responsive mobile
- [ ] IA narrative visible partout
- [ ] Performance Lighthouse > 90

---

## 9. ARCHITECTURE FICHIERS

```
powalyze/
├── app/
│   ├── (dashboard)/
│   │   ├── risques/
│   │   │   ├── page.tsx              # Module Risques
│   │   │   └── [id]/page.tsx         # Fiche détaillée
│   │   ├── decisions/
│   │   │   ├── page.tsx              # Module Décisions
│   │   │   └── [id]/page.tsx
│   │   ├── projets/
│   │   │   ├── page.tsx              # Module Projets
│   │   │   └── [id]/page.tsx
│   │   ├── comites/
│   │   │   ├── page.tsx              # Module Comités
│   │   │   └── [id]/page.tsx
│   │   └── journal/
│   │       ├── page.tsx              # Journal exécutif
│   │       └── [id]/page.tsx
│   ├── vitrine/
│   │   └── page.tsx                  # Page vitrine
│   └── cockpit/
│       └── page.tsx                  # Dashboard cockpit
├── components/
│   ├── cockpit/
│   │   ├── ModuleCard.tsx           # ✅ Créé
│   │   ├── KPICard.tsx              # À créer
│   │   ├── AINarrativeBlock.tsx     # À créer
│   │   ├── DetailSheet.tsx          # À créer
│   │   ├── RisksTable.tsx
│   │   ├── DecisionsTimeline.tsx
│   │   ├── ProjectsKanban.tsx
│   │   ├── CommitteesList.tsx
│   │   └── JournalTimeline.tsx
│   ├── layout/
│   │   └── NavigationTop.tsx        # ✅ Créé
│   ├── ui/
│   │   └── LanguageSwitcher.tsx     # ✅ Créé
│   └── vitrine/
│       ├── ModuleShowcase.tsx       # À créer
│       └── Pillar.tsx               # À créer
├── lib/
│   ├── i18n.ts                      # ✅ Créé
│   └── ai-narrative.ts              # À créer
├── locales/
│   ├── fr.json                      # ✅ Créé (à enrichir)
│   └── en.json                      # ✅ Créé (à enrichir)
├── styles/
│   └── design-system.css            # ✅ Créé
└── public/
    ├── videos/
    │   ├── cockpit-motion.mp4       # À produire
    │   └── cockpit-demo.mp4         # À produire
    └── images/
        ├── cockpit-risks.png        # À capturer
        ├── cockpit-decisions.png    # À capturer
        └── cockpit-projects.png     # À capturer
```

---

## 10. GLOSSAIRE

| Terme | Définition |
|-------|-----------|
| **ModuleCard** | Composant wrapper pour tous les modules, avec header premium + narration |
| **KPICard** | Carte de métrique clé (3-4 max par module) |
| **IA narrative** | Bloc de synthèse exécutive généré par IA, présent dans chaque module |
| **DetailSheet** | Panneau latéral pour afficher les fiches détaillées |
| **Synthèse haute** | Zone KPI en haut de chaque module |
| **Zone de travail** | Fond neutre contenant les cartes et tableaux |
| **Pattern unique** | Structure répétée à l'identique dans tous les modules |
| **Ton exécutif** | Concis, orienté arbitrage, sans jargon |

---

## ✅ CHECKLIST DE MIGRATION

### Pour chaque module à migrer:

1. [ ] Créer le fichier `app/(dashboard)/[module]/page.tsx`
2. [ ] Importer ModuleCard
3. [ ] Ajouter titre/sous-titre/narration depuis i18n
4. [ ] Créer les 3-4 KPICard
5. [ ] Implémenter la vue principale (tableau/timeline/kanban)
6. [ ] Ajouter AINarrativeBlock
7. [ ] Créer la fiche détaillée avec DetailSheet
8. [ ] Tester FR/EN
9. [ ] Valider palette or/bleu/neutres
10. [ ] Capturer screenshot pour vitrine

---

**🎯 OBJECTIF FINAL**: Un système unifié, prévisible, élégant, où vitrine et cockpit partagent la même identité visuelle et narrative.
