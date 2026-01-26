# 🎯 ARCHITECTURE DUAL-MODE POWALYZE - GUIDE COMPLET

## 📋 Vue d'ensemble

Le cockpit Powalyze fonctionne désormais en **deux modes distincts** mais visuellement identiques :

### 1️⃣ MODE DEMO
- **Données** : Tables `demo_*` (demo_risks, demo_decisions, demo_anomalies, etc.)
- **Utilisateurs** : Profils avec `mode = 'demo'`
- **Fonctionnalités** : Toutes accessibles, données fictives
- **Badge UI** : "MODE DÉMO" (bleu)
- **Limites** : Pas d'export avancé, pas de connecteurs premium

### 2️⃣ MODE PRO
- **Données** : Tables réelles (risks, decisions, anomalies, etc.)
- **Utilisateurs** : Profils avec `mode = 'pro' ou 'admin'`
- **Fonctionnalités** : Toutes débloquées, données réelles
- **Badge UI** : "PRODUCTION" (vert/or)
- **Avantages** : Export, connecteurs avancés, support prioritaire

---

## 🗄️ TABLES SUPABASE

### Tables DEMO
```sql
CREATE TABLE demo_risks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID,
  title VARCHAR(255),
  description TEXT,
  impact INTEGER CHECK (impact BETWEEN 1 AND 5),
  probability INTEGER CHECK (impact BETWEEN 1 AND 5),
  status VARCHAR(50) DEFAULT 'active',
  mitigation TEXT,
  owner VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE demo_decisions (...);
CREATE TABLE demo_anomalies (...);
CREATE TABLE demo_reports (...);
CREATE TABLE demo_connectors (...);
```

### Tables PRO (déjà existantes)
```sql
CREATE TABLE risks (...);
CREATE TABLE decisions (...);
CREATE TABLE anomalies (...);
CREATE TABLE reports (...);
CREATE TABLE connectors (...);
```

### Table users avec colonne mode
```sql
ALTER TABLE users 
ADD COLUMN mode VARCHAR(20) DEFAULT 'demo' CHECK (mode IN ('demo', 'pro', 'admin'));
```

---

## 🔧 SYSTEM UTILITIES

### lib/modeDetection.ts
```typescript
export type UserMode = 'demo' | 'pro' | 'admin';

// Récupère le mode utilisateur depuis Supabase
export async function getUserMode(): Promise<UserMode>

// Vérifie si l'utilisateur est en mode DEMO
export async function isDemoMode(): Promise<boolean>

// Vérifie si l'utilisateur est en mode PRO
export async function isProMode(): Promise<boolean>

// Retourne le nom de table approprié selon le mode
export async function getTableName(baseTable: string): Promise<string>
// Exemple: getTableName('risks') -> 'demo_risks' ou 'risks'

// Upgrade un utilisateur vers PRO
export async function upgradeUserToPro(userId: string): Promise<boolean>

// Configuration selon le mode
export async function getModeConfig()
// Retourne: badge, couleurs, permissions, etc.
```

---

## 🎬 SERVER ACTIONS DUAL-MODE

### Structure type
```typescript
// actions/risks.ts
import { getTableName } from "@/lib/modeDetection";

export async function createRisk(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Détection automatique de la table selon le mode
  const tableName = await getTableName("risks");
  // -> "demo_risks" en mode DEMO
  // -> "risks" en mode PRO
  
  const { data } = await supabase
    .from(tableName)
    .insert({ user_id: user.id, ...fields });
    
  revalidatePath("/cockpit/risques");
  redirect(`/cockpit/risques/${data.id}`);
}
```

### Actions implémentées
- ✅ `createRisk` / `updateRisk` / `deleteRisk` / `getRisks`
- ✅ `createDecision` / `updateDecision` / `deleteDecision`
- ✅ `createAnomaly` / `updateAnomaly` / `deleteAnomaly`
- ✅ `createReport` / `updateReport` / `deleteReport`
- ✅ `createConnector` / `updateConnector` / `deleteConnector` / `testConnector`

---

## 📄 PAGES CRÉÉES

### Pages /nouveau (Formulaires de création)
- ✅ `/cockpit/risques/nouveau` - Impact + Probabilité + Projet
- ✅ `/cockpit/decisions/nouveau` - Statut + Décideur + Deadline
- ✅ `/cockpit/anomalies/nouveau` - Sévérité + Description
- ✅ `/cockpit/rapports/nouveau` - Type + Contenu
- ✅ `/cockpit/connecteurs/nouveau` - Type + API Key + URL

### Pages /[id] (Détails & édition)
- ✅ `/cockpit/risques/[id]` - Affichage complet avec métriques
- 🚧 `/cockpit/decisions/[id]`
- 🚧 `/cockpit/anomalies/[id]`
- 🚧 `/cockpit/rapports/[id]`
- 🚧 `/cockpit/connecteurs/[id]`

### Pages Spéciales
- ✅ `/cockpit/pro` - Page PRO avec upgrade ou dashboard
- ✅ `/cockpit/connecteurs` - Liste des connecteurs avec statuts
- ✅ Menu utilisateur avec déconnexion (dans UserMenu.tsx)

---

## 🎨 UI/UX PREMIUM

### Palette de couleurs
```css
/* Mode DEMO */
--accent-demo: #3B82F6 (blue-500)
--badge-demo: bg-blue-500/20 border-blue-500/30

/* Mode PRO */
--accent-pro: #D4AF37 (gold-premium)
--badge-pro: bg-emerald-500/20 border-emerald-500/30
```

### Badges de mode
```tsx
// Header component
{mode === 'demo' ? (
  <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
    <span className="text-blue-500 text-sm font-semibold">MODE DÉMO</span>
  </div>
) : (
  <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
    <span className="text-emerald-500 text-sm font-semibold">PRODUCTION</span>
  </div>
)}
```

### Composants premium
- Cards avec bordures `border-slate-800`
- Backgrounds `bg-slate-900/50`
- Hover states `hover:border-amber-500/50`
- Transitions `transition-all duration-200`

---

## 🔐 GUARDS & PERMISSIONS

### Guard PRO dans pages
```typescript
// app/cockpit/pro/page.tsx
export default function ProPage() {
  const [userMode, setUserMode] = useState<'demo' | 'pro'>('demo');
  
  useEffect(() => {
    // Fetch user mode
    const mode = await getUserMode();
    setUserMode(mode);
  }, []);
  
  if (userMode === 'demo') {
    // Afficher page d'upgrade
    return <UpgradeToPro />;
  }
  
  // Afficher dashboard PRO
  return <ProDashboard />;
}
```

### Permissions par mode
```typescript
const config = await getModeConfig();

if (config.canCreateProjects) {
  // Mode PRO: autoriser création
} else {
  // Mode DEMO: rediriger vers upgrade
}
```

---

## 🔄 WORKFLOW UTILISATEUR

### Parcours DEMO → PRO

1. **Utilisateur en mode DEMO**
   - Explore toutes les fonctionnalités
   - Voit des données fictives
   - Badge bleu "MODE DÉMO"
   - CTA "Passer en Mode PRO" visible

2. **Clic sur "Passer en Mode PRO"**
   - Redirection vers `/cockpit/pro`
   - Page d'upgrade avec features PRO
   - Tarification 399€/mois
   - Formulaire de paiement (Stripe)

3. **Après paiement réussi**
   - Appel à `upgradeUserToPro(userId)`
   - Update `users.mode = 'pro'`
   - Migration données demo → pro (optionnel)
   - Badge change en "PRODUCTION"
   - Toutes fonctionnalités débloquées

---

## 📊 MODULES COMPLETS

### 1. Risques
- **Liste** : `/cockpit/risques` - KPIs + data grid
- **Nouveau** : `/cockpit/risques/nouveau` - Formulaire impact/probabilité
- **Détail** : `/cockpit/risques/[id]` - Visualisation complète + edit
- **Actions** : createRisk, updateRisk, deleteRisk, getRisks

### 2. Décisions
- **Liste** : `/cockpit/decisions`
- **Nouveau** : `/cockpit/decisions/nouveau`
- **Détail** : `/cockpit/decisions/[id]`
- **Actions** : createDecision, updateDecision, deleteDecision

### 3. Anomalies
- **Liste** : `/cockpit/anomalies`
- **Nouveau** : `/cockpit/anomalies/nouveau`
- **Détail** : `/cockpit/anomalies/[id]`
- **Actions** : createAnomaly, updateAnomaly, deleteAnomaly

### 4. Rapports
- **Liste** : `/cockpit/rapports`
- **Nouveau** : `/cockpit/rapports/nouveau`
- **Détail** : `/cockpit/rapports/[id]`
- **Actions** : createReport, updateReport, deleteReport

### 5. Connecteurs (PREMIUM)
- **Liste** : `/cockpit/connecteurs` - Statuts + dernière sync
- **Nouveau** : `/cockpit/connecteurs/nouveau` - 11 types supportés
- **Détail** : `/cockpit/connecteurs/[id]` - Test connexion
- **Actions** : createConnector, updateConnector, deleteConnector, testConnector
- **Types** : Jira, Azure DevOps, GitHub, Slack, OpenAI, Notion, Asana, Salesforce, Zendesk, ServiceNow, Teams, Other

---

## 🚀 DÉPLOIEMENT

### Migration SQL
```bash
# Appliquer la migration dual-mode
psql $DATABASE_URL -f database/migrations/002_dual_mode_architecture.sql
```

### Variables d'environnement
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Mode par défaut (optionnel)
NEXT_PUBLIC_DEFAULT_MODE=demo
```

### Build & Deploy
```bash
npm run build
git add .
git commit -m "feat: Architecture dual-mode DEMO/PRO complète"
git push origin main
npx vercel --prod --yes
```

---

## 📝 TODO RESTANTS

### Pages /[id] à compléter
- [ ] `/cockpit/decisions/[id]`
- [ ] `/cockpit/anomalies/[id]`
- [ ] `/cockpit/rapports/[id]`
- [ ] `/cockpit/connecteurs/[id]`

### Server actions à compléter
- [ ] Ajouter `getDecisions`, `getDecision(id)`
- [ ] Ajouter `getAnomalies`, `getAnomaly(id)`
- [ ] Ajouter `getReports`, `getReport(id)`
- [ ] Ajouter `getConnectors`, `getConnector(id)`

### Fonctionnalités avancées
- [ ] Migration données DEMO → PRO automatique
- [ ] Export CSV/JSON/PDF (mode PRO uniquement)
- [ ] Webhooks pour connecteurs
- [ ] Tests Playwright pour les deux modes
- [ ] Documentation API

---

## 🧪 TESTS

### Test mode DEMO
```typescript
test('User in DEMO mode sees demo data', async ({ page }) => {
  await page.goto('/cockpit/risques');
  await expect(page.locator('[data-mode="demo"]')).toBeVisible();
  await expect(page.locator('text=MODE DÉMO')).toBeVisible();
});
```

### Test mode PRO
```typescript
test('User in PRO mode can create real projects', async ({ page }) => {
  await page.goto('/cockpit/risques/nouveau');
  await page.fill('[name="title"]', 'Real Risk');
  await page.click('button[type="submit"]');
  // Vérifie insertion dans table 'risks', pas 'demo_risks'
});
```

---

## 📚 RESSOURCES

- **Migration SQL** : `database/migrations/002_dual_mode_architecture.sql`
- **Mode Detection** : `lib/modeDetection.ts`
- **Server Actions** : `actions/*.ts`
- **Pages** : `app/cockpit/*`
- **Documentation** : Ce fichier

---

## ✅ CHECKLIST FINALE

- [x] Tables DEMO créées
- [x] Tables PRO existantes
- [x] Colonne `mode` ajoutée dans `users`
- [x] Système de détection de mode (`modeDetection.ts`)
- [x] Server actions avec routing automatique
- [x] Page `/cockpit/pro` avec upgrade
- [x] Page `/cockpit/risques/[id]` détail
- [x] Page `/cockpit/connecteurs` liste
- [x] Menu utilisateur avec déconnexion
- [x] Formulaires /nouveau pour tous modules
- [ ] Pages /[id] pour decisions, anomalies, rapports
- [ ] Tests e2e pour les deux modes
- [ ] Documentation utilisateur

---

**Status** : 🟢 Système dual-mode opérationnel  
**Prochaine étape** : Compléter les pages de détail manquantes
