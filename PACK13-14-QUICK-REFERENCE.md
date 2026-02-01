# PACK 13 + 14 - QUICK REFERENCE
## Guide Rapide Synthèse Exécutive + IA Chief of Staff

---

## 🚀 ACCÈS RAPIDE

**URL Prod:** https://www.powalyze.com/cockpit
**Homepage Cockpit:** Synthèse Exécutive (nouvelle page par défaut)
**Navigation:** Icône ✨ "Synthèse Exécutive" (première entrée menu)

---

## 📁 FICHIERS PRINCIPAUX

```
database/
  └── schema-executive-summary.sql        # Table cache + RLS

lib/
  └── ai-executive.ts                     # IA Chief of Staff + Interface

hooks/
  └── useExecutiveSummary.ts              # React hook

components/cockpit/
  ├── ExecutiveSummaryDesktop.tsx         # Vue desktop
  ├── ExecutiveSummaryMobile.tsx          # Vue mobile
  └── CockpitLive.tsx                     # Intégration (modifié)

app/api/ai/
  └── executive-summary/route.ts          # API endpoint
```

---

## 🎯 STRUCTURE SYNTHÈSE

```typescript
ExecutiveSummary {
  executive_summary: string          // 3-5 lignes premium
  key_indicators: {
    active_projects: number
    open_risks: number
    pending_decisions: number
    recent_ia_actions: number
  }
  critical_risks: Array<...>         // 3 max
  urgent_decisions: Array<...>       // 3 max
  trends: Array<...>                 // 3 max
  weak_signals: Array<...>           // 3 max, avec confidence %
  recommendations: Array<...>        // 3 max
  quick_actions: Array<...>          // 3-5 actions
}
```

---

## 🧠 IA CHIEF OF STAFF (ANE)

**Ton:** Premium suisse, décisionnel, synthétique
**Mission:** Synthétiser, identifier signaux faibles, recommander actions

**Sortie:**
- 3-5 lignes executive summary
- Chiffres clés quantifiés
- 1-2 tendances principales
- 1 alerte critique si présente
- 1 recommandation stratégique

**Exemple:**
> "Le portfolio compte 12 projets actifs (75% en phase execution). 3 risques critiques nécessitent arbitrage immédiat. Tendance positive sur vélocité delivery (+15% vs Q3). Prioriser arbitrage budget Projet Alpha avant fin semaine."

---

## 🔧 CONFIGURATION RAPIDE

### 1. SQL Schema
```bash
psql $DATABASE_URL -f database/schema-executive-summary.sql
```

### 2. Environment Variables
```env
# OpenAI (Option A)
OPENAI_API_KEY=sk-proj-xxxxx

# OU Azure OpenAI (Option B)
AZURE_OPENAI_API_KEY=xxxxx
AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

### 3. Deploy
```bash
npm run build
npx vercel --prod --yes
```

---

## 📱 UX PATTERNS

### Desktop
- **Layout:** Grid 1fr + 400px (main + IA panel)
- **Colors:** Gold #C9A86A + Blue #3A82F7
- **Panel IA:** Weak signals, correlations, alerts, suggestions

### Mobile
- **Layout:** Compact cards, 2x2 KPI grid
- **Drawer IA:** Slide-up (80vh max), backdrop blur
- **Quick Actions:** 2 colonnes responsive

---

## 🎨 COULEURS PREMIUM

```css
/* Primary */
--gold: #C9A86A;
--blue: #3A82F7;
--gray: #6A6A6A;

/* Severity */
--critical: red (bg-red-500/10)
--high: red (bg-red-500/10)
--medium: yellow (bg-yellow-500/10)

/* Priority */
--high: red (bg-red-500/10)
--medium: yellow (bg-yellow-500/10)
--low: blue (bg-blue-500/10)
```

---

## 🔄 HOOK USAGE

```typescript
import { useExecutiveSummary } from '@/hooks/useExecutiveSummary';
import { useLiveCockpit } from '@/hooks/useLiveCockpit';

function MyComponent() {
  const cockpit = useLiveCockpit();
  const { summary, isLoading, error, refresh } = useExecutiveSummary({
    projects: cockpit.projects,
    risks: cockpit.risks,
    decisions: cockpit.decisions,
    timeline: cockpit.timeline,
    reports: cockpit.reports,
  });

  // summary: ExecutiveSummary | null
  // isLoading: boolean
  // error: string | null
  // refresh: () => Promise<void>
}
```

---

## 🌐 API ENDPOINT

**POST** `/api/ai/executive-summary`

**Request:**
```json
{
  "projects": [...],
  "risks": [...],
  "decisions": [...],
  "timeline": [...],
  "reports": [...]
}
```

**Response:**
```json
{
  "executive_summary": "Le portfolio compte 12 projets actifs...",
  "key_indicators": {
    "active_projects": 12,
    "open_risks": 7,
    "pending_decisions": 3,
    "recent_ia_actions": 5
  },
  "critical_risks": [...],
  "urgent_decisions": [...],
  "trends": [...],
  "weak_signals": [...],
  "recommendations": [...],
  "quick_actions": [...]
}
```

---

## ⚡ QUICK ACTIONS

**Types disponibles:**
- `project` → Ouvre modal création projet
- `risk` → Navigate vers vue risques
- `decision` → Navigate vers vue décisions
- `report` → Navigate vers vue rapports
- `analysis` → (custom action)

**Icons (lucide-react):**
- Rocket, AlertTriangle, FileQuestion, FileText, BarChart3, Target, TrendingUp

---

## 🔐 SÉCURITÉ

**RLS Policies:**
1. SELECT: filtré par organization_id
2. INSERT: vérifie user authentifié
3. UPDATE: own organization seulement
4. DELETE: own organization seulement

**Cache TTL:** 24h (auto-cleanup via fonction SQL)

---

## 🧪 TESTS VALIDATION

### Empty State
```
Données: 0 projets, 0 risques, 0 décisions
Attendu: Synthèse onboarding + 1 recommandation
```

### Nominal Case
```
Données: 5 projets, 3 risques, 2 décisions
Attendu: Synthèse complète + 3 risques critiques
```

### Cache Behavior
```
Action: Recharger page < 24h
Attendu: Load from cache (< 50ms)
```

### Mobile
```
Device: Smartphone
Attendu: Layout compact + drawer fonctionnel
```

### Error Handling
```
Scenario: OpenAI timeout
Attendu: Synthèse par défaut + bouton réessayer
```

---

## 📊 SECTIONS SYNTHÈSE

### 1. Executive Summary
- 3-5 lignes max
- Ton premium
- Chiffres clés
- Tendances principales

### 2. Key Indicators (4 KPIs)
- Projets actifs
- Risques ouverts
- Décisions en attente
- Actions IA récentes

### 3. Critical Risks (3 max)
- Title + Severity (critical/high/medium)
- Trend (rising/stable/declining)
- Action recommandée

### 4. Urgent Decisions (3 max)
- Title + Deadline
- Impact (high/medium/low)
- Action recommandée

### 5. Trends (3 max)
- Title + Direction (positive/negative/neutral)
- Description factuelle

### 6. Weak Signals (3 max)
- Title + Confidence (0-100%)
- Description + Potential impact

### 7. Recommendations (3 max)
- Title + Priority (high/medium/low)
- Description + Action

### 8. Quick Actions (3-5)
- Label + Icon + Type

---

## 🚨 TROUBLESHOOTING

### Synthèse ne charge pas
```bash
# Vérifier OpenAI config
echo $OPENAI_API_KEY

# Vérifier logs API
curl https://www.powalyze.com/api/ai/executive-summary -H "Authorization: Bearer <TOKEN>"
```

### Cache ne fonctionne pas
```sql
-- Vérifier table
SELECT * FROM executive_summary_cache WHERE organization_id = 'xxx';

-- Vérifier RLS
SELECT * FROM pg_policies WHERE tablename = 'executive_summary_cache';
```

### Panel IA invisible (desktop)
```
Vérifier: Layout grid-cols-[1fr_400px]
Breakpoint: lg: (min-width: 1024px)
```

### Drawer IA ne s'ouvre pas (mobile)
```
Vérifier: drawerOpen state
Backdrop: onClick={() => setDrawerOpen(false)}
```

---

## 📚 RESSOURCES

**Documentation:**
- Livraison complète: `/PACK13-14-LIVRAISON-COMPLETE.md`
- PACK 0 + 12: `/PACK0-PACK12-LIVRAISON-COMPLETE.md`
- Architecture: `/ARCHITECTURE_DUAL_MODE.md`

**Support:**
- Email: dev@powalyze.com
- Slack: #pack-13-14-support

---

## ✅ CHECKLIST DÉPLOIEMENT

- [ ] SQL schema appliqué sur PROD
- [ ] OpenAI API key configurée
- [ ] Build réussi (163 pages)
- [ ] Deploy Vercel terminé
- [ ] Synthèse visible en homepage
- [ ] 4 KPIs affichés correctement
- [ ] Panel IA fonctionnel (desktop)
- [ ] Drawer IA fonctionnel (mobile)
- [ ] Quick actions cliquables
- [ ] Aucun warning console

---

**Status:** 🚀 DEPLOYED - https://www.powalyze.com
**Version:** PACK 13 + 14
**Date:** 11 Janvier 2026
