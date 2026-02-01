# 🚀 PACK 0 + PACK 12 — GUIDE RAPIDE

## Utilisation du nouveau cockpit LIVE

### 🎯 Accès
```
URL: https://www.powalyze.com/cockpit
```

### 📦 Composants clés

#### 1. Hook principal
```typescript
import { useLiveCockpit } from '@/hooks/useLiveCockpit';

const {
  projects,        // Project[]
  risks,           // Risk[]
  decisions,       // Decision[]
  timeline,        // TimelineEvent[]
  reports,         // Report[]
  isLoading,       // boolean
  error,           // string | null
  refetch,         // () => Promise<void>
  createProject,   // (data: Partial<Project>) => Promise<void>
  createRisk,      // (data: Partial<Risk>) => Promise<void>
  createDecision,  // (data: Partial<Decision>) => Promise<void>
} = useLiveCockpit();
```

#### 2. États vides
```typescript
import { 
  EmptyProjects, 
  EmptyRisks, 
  EmptyDecisions, 
  EmptyTimeline, 
  EmptyReports 
} from '@/components/cockpit/EmptyStates';

// Exemple
{projects.length === 0 ? (
  <EmptyProjects onAction={handleCreate} />
) : (
  <ProjectsList projects={projects} />
)}
```

#### 3. Timeline Desktop
```typescript
import { TimelineDesktop } from '@/components/cockpit/TimelineDesktop';

<TimelineDesktop
  events={timeline}
  onAnalyze={handleAnalyzeTimeline}
  insights={timelineInsights}
/>
```

#### 4. Timeline Mobile
```typescript
import { TimelineMobile } from '@/components/cockpit/TimelineMobile';

<TimelineMobile
  events={timeline}
  onAnalyze={handleAnalyzeTimeline}
  insights={timelineInsights}
/>
```

#### 5. IA Timeline
```typescript
import { analyzeTimelineCorrelations } from '@/lib/ai-timeline';

const insights = await analyzeTimelineCorrelations(events);
// insights = { correlations, weakSignals, trends, executiveSummary }
```

---

## 🗄️ Base de données

### Appliquer le schéma
```bash
psql $SUPABASE_DATABASE_URL -f database/schema-timeline.sql
```

### Structure `timeline_events`
```sql
timeline_events (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  project_id UUID,
  type TEXT,  -- 'project_created', 'risk_created', etc.
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP,
  created_by UUID
)
```

### Types d'événements
- `project_created` / `project_updated`
- `risk_created` / `risk_updated`
- `decision_created` / `decision_updated`
- `report_generated`
- `ia_action`

---

## 🔄 Flows automatiques

### Génération d'événements timeline

**Triggers SQL automatiques**:

1. Création projet → Événement `project_created`
2. Mise à jour projet (status) → Événement `project_updated`
3. Création risque → Événement `risk_created`
4. Mise à jour risque (level) → Événement `risk_updated`
5. Création décision → Événement `decision_created`
6. Mise à jour décision (status) → Événement `decision_updated`

**Pas de code nécessaire** — Les triggers SQL gèrent tout automatiquement.

---

## 🤖 IA Timeline

### Endpoint
```
POST /api/ai/timeline-insights
```

### Request
```json
{
  "events": [
    {
      "id": "uuid",
      "type": "project_created",
      "title": "Nouveau projet",
      "description": "...",
      "created_at": "2026-01-30T10:00:00Z",
      "metadata": {}
    }
  ]
}
```

### Response
```json
{
  "insights": {
    "correlations": [
      "Augmentation des risques après mise à jour planning"
    ],
    "weakSignals": [
      "Décision repoussée 3 fois consécutives"
    ],
    "trends": [
      "Activité en hausse cette semaine (+30%)"
    ],
    "executiveSummary": [
      "Portfolio sous tension: 3 risques critiques identifiés",
      "Décisions bloquées nécessitent arbitrage immédiat",
      "Tendance positive sur projets stratégiques"
    ]
  }
}
```

### Agents IA utilisés
- **ANE** (Narrateur Exécutif) → Récits clairs
- **AAR** (Analyse Réflexive) → Corrélations
- **AD** (Décisionnaire) → Actions nécessaires
- **ASR** (Spécialiste Risques) → Signaux faibles

---

## 📱 Navigation

### Desktop
- Sidebar permanente avec 6 modules
- Header avec compteurs
- Panel IA (droite) pour timeline

### Mobile
- Menu hamburger
- Navigation tabs en bas
- Drawer slide-up pour détails
- Drawer IA pour insights

---

## ✅ Checklist déploiement

### Avant déploiement
- [ ] Variables environnement Vercel configurées
- [ ] Schéma SQL appliqué sur base PROD
- [ ] Tests locaux OK

### Après déploiement
- [ ] Créer premier projet
- [ ] Vérifier cockpit s'affiche
- [ ] Vérifier timeline contient événement
- [ ] Tester analyse IA
- [ ] Vérifier mobile responsive
- [ ] Aucune erreur console

---

## 🐛 Troubleshooting

### "Utilisateur non authentifié"
→ Vérifier JWT valide, `organization_id` présent dans `user_metadata`

### "Table timeline_events does not exist"
→ Appliquer `database/schema-timeline.sql`

### Timeline vide
→ Créer projet/risque/décision pour générer événements

### IA ne répond pas
→ Vérifier `OPENAI_API_KEY` ou `AZURE_OPENAI_API_KEY` dans variables environnement

### RLS denied
→ Vérifier l'utilisateur a un `organization_id` valide et est membre de `organization_members`

---

## 📊 Performance

### Optimisations appliquées
- ✅ Chargement parallèle (5 requêtes simultanées)
- ✅ 5 index SQL timeline
- ✅ Limitation 100 événements timeline
- ✅ Limitation 50 événements pour IA
- ✅ Cache OpenAI (temperature 0.3)

### Métriques cibles
- Chargement cockpit: < 2s
- Génération insights IA: < 5s
- Navigation entre modules: < 200ms

---

## 🔗 Fichiers importants

```
hooks/useLiveCockpit.ts              # Hook principal
components/cockpit/CockpitLive.tsx   # Cockpit complet
components/cockpit/EmptyStates.tsx   # États vides
components/cockpit/TimelineDesktop.tsx
components/cockpit/TimelineMobile.tsx
lib/ai-timeline.ts                   # IA corrélations
app/api/ai/timeline-insights/route.ts
database/schema-timeline.sql         # Schéma SQL
```

---

**FIN DU GUIDE RAPIDE**
