# 🚀 DEVOPS GUIDE — POWALYZE PRODUCTION
**Date**: 26 janvier 2026  
**Objectif**: Finaliser déploiement production sécurisé, performant, monitoré  
**Statut**: ✅ Configuration prête pour déploiement

---

## 📋 TABLE DES MATIÈRES

1. [Environnements](#1-environnements)
2. [Supabase Configuration](#2-supabase-configuration)
3. [Vercel Deployment](#3-vercel-deployment)
4. [CI/CD Pipeline](#4-cicd-pipeline)
5. [Optimisations Performance](#5-optimisations-performance)
6. [Sécurité](#6-sécurité)
7. [Monitoring & Logs](#7-monitoring--logs)
8. [Rollback Strategy](#8-rollback-strategy)
9. [Post-Deployment Tests](#9-post-deployment-tests)
10. [Maintenance](#10-maintenance)

---

## 1️⃣ ENVIRONNEMENTS

### Architecture 3-Tier

```
┌──────────────┐
│  LOCAL (DEV) │  ← Développement local
└──────────────┘
       │
       ↓
┌──────────────┐
│   STAGING    │  ← Tests pré-production
└──────────────┘
       │
       ↓
┌──────────────┐
│  PRODUCTION  │  ← Environnement live
└──────────────┘
```

### Configuration par Environnement

#### LOCAL (DEV)
**URL**: `http://localhost:3000`  
**Branch**: `develop`  
**Database**: Supabase DEV Project  
**Variables**:
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Variables serveur (Vercel local)
SUPABASE_SERVICE_ROLE_KEY=xxx
OPENAI_API_KEY=sk-xxx
JWT_SECRET=dev-secret-key-123
```

**Commandes**:
```bash
npm run dev          # Port 3000
npm run build        # Test build local
npm run lint         # ESLint
```

#### STAGING
**URL**: `https://powalyze-staging.vercel.app`  
**Branch**: `staging`  
**Database**: Supabase STAGING Project  
**Deploy**: Automatique via GitHub push  

**Variables Vercel**:
```bash
# Settings → Environment Variables → Preview
NEXT_PUBLIC_SUPABASE_URL=https://xxx-staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=xxx-staging
OPENAI_API_KEY=sk-xxx-staging
JWT_SECRET=staging-secret-key-456
```

**Tests**:
- ✅ Smoke tests automatiques
- ✅ E2E tests (Playwright)
- ✅ Performance tests (Lighthouse)

#### PRODUCTION
**URL**: `https://powalyze.com` (ou `.vercel.app`)  
**Branch**: `main`  
**Database**: Supabase PROD Project  
**Deploy**: Manuel ou automatique après approval  

**Variables Vercel**:
```bash
# Settings → Environment Variables → Production
NEXT_PUBLIC_SUPABASE_URL=https://xxx-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=xxx-prod
OPENAI_API_KEY=sk-xxx-prod
AZURE_OPENAI_API_KEY=xxx         # Si Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
JWT_SECRET=production-secret-key-789-CHANGE-ME
```

**Protection**:
- ✅ Branch protection (main)
- ✅ Required reviews (2+)
- ✅ CI checks pass
- ✅ No force push

---

## 2️⃣ SUPABASE CONFIGURATION

### Projets Supabase

#### DEV Project
**URL**: `https://xxx-dev.supabase.co`  
**Usage**: Développement local  
**RLS**: Optionnel (désactivable pour debug)  
**Data**: Seed demo data

#### STAGING Project
**URL**: `https://xxx-staging.supabase.co`  
**Usage**: Tests pré-production  
**RLS**: ✅ Activée  
**Data**: Anonymized production data

#### PROD Project
**URL**: `https://xxx-prod.supabase.co`  
**Usage**: Production live  
**RLS**: ✅ Activée (OBLIGATOIRE)  
**Data**: Real user data  
**Backup**: Daily (Supabase automatic)

### Tables Configuration

#### Schema Application
**Fichier**: `database/schema.sql`  
**Tables**:
```sql
-- Users & Auth
profiles (mode: 'demo' | 'pro')

-- DEMO Tables
demo_projects
demo_risks
demo_decisions
demo_anomalies
demo_reports
demo_connectors

-- PRO Tables
projects
risks
decisions
anomalies
reports
connectors
```

#### RLS Policies (CRITICAL)

**Activation RLS**:
```sql
-- Via Supabase Dashboard ou SQL Editor

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_connectors ENABLE ROW LEVEL SECURITY;
```

**Policies Définies** (voir `database/schema.sql` lines 206-224):
```sql
-- Exemple pour demo_projects
CREATE POLICY "Users can view their own demo projects"
ON demo_projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own demo projects"
ON demo_projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own demo projects"
ON demo_projects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own demo projects"
ON demo_projects FOR DELETE
USING (auth.uid() = user_id);
```

**Vérification RLS**:
```bash
# Via psql ou Supabase SQL Editor
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename LIKE '%demo%';

# Doit retourner rowsecurity = true pour toutes les tables
```

### Backups

**Supabase Automatic**:
- Daily backups (7 jours retention)
- Point-in-time recovery (PITR) si plan Pro

**Manual Backups**:
```bash
# Export schema
pg_dump $DATABASE_URL --schema-only > backup-schema.sql

# Export data
pg_dump $DATABASE_URL --data-only > backup-data.sql

# Full backup
pg_dump $DATABASE_URL > backup-full.sql
```

---

## 3️⃣ VERCEL DEPLOYMENT

### Configuration Vercel

#### Projet Vercel
**Framework**: Next.js 16.1.3  
**Build Command**: `npm run build`  
**Output Directory**: `.next`  
**Install Command**: `npm install`  
**Node Version**: 20.x  

**Settings → General**:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

#### Environment Variables (Production)

**Aller dans**: Vercel Dashboard → Project → Settings → Environment Variables

**Variables à configurer**:

| Variable | Value | Scope | Required |
|----------|-------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Production | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Production | ✅ |
| `OPENAI_API_KEY` | `sk-xxx` | Production | ✅ |
| `JWT_SECRET` | `secure-random-string` | Production | ✅ |
| `AZURE_OPENAI_API_KEY` | `xxx` | Production | ⚠️ Si Azure |
| `AZURE_OPENAI_ENDPOINT` | `https://xxx.openai.azure.com` | Production | ⚠️ Si Azure |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | `gpt-4` | Production | ⚠️ Si Azure |

**🚨 CRITIQUE**: Ne jamais mettre `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local` (exposé côté client)

#### Domaine Custom

**Configuration DNS** (si domaine custom):
```bash
# Type A Record
powalyze.com → 76.76.21.21 (Vercel IP)

# Type CNAME Record
www.powalyze.com → cname.vercel-dns.com
```

**Vercel → Settings → Domains**:
1. Ajouter `powalyze.com`
2. Ajouter `www.powalyze.com` (redirect)
3. Activer HTTPS (automatic)
4. Activer HSTS (recommended)

#### Deployment

**Déploiement Production**:
```bash
# Via CLI
npx vercel --prod --yes

# Via Git (push main)
git push origin main  # Déclenchera Vercel auto-deploy
```

**Vérification Deployment**:
```bash
# Logs temps réel
npx vercel logs --follow

# Statut deployment
npx vercel ls
```

**Rollback**:
```bash
# Revenir au deployment précédent
npx vercel rollback
```

---

## 4️⃣ CI/CD PIPELINE

### GitHub Actions Workflow

**Fichier**: `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  build:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      
  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test  # Si tests configurés

  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    needs: [lint, build, test]
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: [lint, build, test]
    environment: production
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

### Secrets GitHub

**Aller dans**: GitHub Repo → Settings → Secrets and variables → Actions

**Secrets à ajouter**:
- `VERCEL_TOKEN` - Token Vercel (Account Settings → Tokens)
- `VERCEL_ORG_ID` - Organization ID (.vercel/project.json)
- `VERCEL_PROJECT_ID` - Project ID (.vercel/project.json)

---

## 5️⃣ OPTIMISATIONS PERFORMANCE

### Next.js Optimizations

#### next.config.js
```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Images optimization
  images: {
    domains: ['xxx.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Compression
  compress: true,
  
  // Cache headers
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

#### Bundle Splitting
```javascript
// Automatic code splitting (Next.js default)
// Dynamic imports pour lazy loading
const AICopilot = dynamic(() => import('@/components/AICopilot'), {
  loading: () => <Loading />,
  ssr: false, // Si côté client uniquement
});
```

### Database Optimization

#### Indexes Supabase
```sql
-- Indexes pour améliorer performance queries
CREATE INDEX idx_demo_projects_user_id ON demo_projects(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_demo_risks_project_id ON demo_risks(project_id);
CREATE INDEX idx_risks_project_id ON risks(project_id);
CREATE INDEX idx_demo_decisions_project_id ON demo_decisions(project_id);
CREATE INDEX idx_decisions_project_id ON decisions(project_id);

-- Composite indexes pour queries fréquentes
CREATE INDEX idx_demo_projects_user_status ON demo_projects(user_id, status);
CREATE INDEX idx_projects_user_status ON projects(user_id, status);
```

### CDN & Cache

**Vercel Edge Network**:
- Static assets → CDN automatique
- ISR (Incremental Static Regeneration) pour pages dynamiques
- Edge functions pour IA endpoints (si configuré)

**Cache Strategy**:
```typescript
// Page statique avec revalidation
export const revalidate = 3600; // 1 heure

// Page dynamique avec cache client
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-cache';
```

### Performance Metrics

**Target Metrics**:
| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint (FCP) | <1.8s | TBD |
| Largest Contentful Paint (LCP) | <2.5s | TBD |
| Time to Interactive (TTI) | <3.8s | TBD |
| Cumulative Layout Shift (CLS) | <0.1 | TBD |
| Interaction to Next Paint (INP) | <200ms | TBD |

**Monitoring**:
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=https://powalyze.com

# Vercel Analytics (activé par défaut)
# Voir: Vercel Dashboard → Analytics
```

---

## 6️⃣ SÉCURITÉ

### Checklist Sécurité Production

#### ✅ Environment Variables
- [ ] `SUPABASE_SERVICE_ROLE_KEY` uniquement dans Vercel (JAMAIS .env.local)
- [ ] `OPENAI_API_KEY` / `AZURE_OPENAI_API_KEY` côté serveur uniquement
- [ ] `JWT_SECRET` unique et complexe (32+ caractères)
- [ ] Aucune clé commitée dans Git (vérifier `.gitignore`)

#### ✅ Supabase RLS
- [ ] RLS activée sur toutes les tables
- [ ] Policies testées (SELECT, INSERT, UPDATE, DELETE)
- [ ] Service Role Key utilisée uniquement dans API routes

#### ✅ Guards
- [ ] `guardProRoute()` actif dans `/cockpit/layout.tsx`
- [ ] `guardDemoRoute()` actif dans `/cockpit-demo/layout.tsx`
- [ ] Tests guards (user demo → cockpit → redirect cockpit-demo)

#### ✅ HTTPS & Headers
- [ ] HTTPS activé (Vercel automatique)
- [ ] HSTS activé
- [ ] CSP (Content Security Policy) configuré si requis
- [ ] CORS configuré sur API routes

#### ✅ Rate Limiting
```typescript
// Optionnel: Rate limiting API routes IA
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests max
});

export default limiter;
```

#### ✅ Audit Logs
```sql
-- Table audit_logs (optionnel)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

### Scan Sécurité

**Outils Recommandés**:
```bash
# npm audit
npm audit

# Snyk (scan dependencies)
npx snyk test

# OWASP ZAP (scan app)
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://powalyze.com
```

---

## 7️⃣ MONITORING & LOGS

### Vercel Analytics

**Activation**:
1. Vercel Dashboard → Project → Analytics
2. Activer Web Analytics
3. Activer Speed Insights

**Métriques Disponibles**:
- Page views
- Unique visitors
- Bounce rate
- LCP, FCP, CLS, TTFB
- Erreurs runtime

### Supabase Monitoring

**Dashboard Supabase**:
- Database → Logs
- API → Logs
- Auth → Logs
- Storage → Logs

**Alertes**:
- Database CPU > 80%
- API latency > 1s
- Disk usage > 80%

### Error Tracking (Optionnel)

**Sentry**:
```bash
npm install @sentry/nextjs

# next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(nextConfig, {
  org: 'powalyze',
  project: 'powalyze-web',
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

**Datadog** (Enterprise):
```bash
npm install dd-trace
```

### Custom Logging

**lib/logger.ts**:
```typescript
export function logError(error: Error, context: Record<string, any>) {
  console.error('[ERROR]', {
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString(),
  });
  
  // Envoyer à service externe (Sentry, Datadog, etc.)
}

export function logInfo(message: string, data?: Record<string, any>) {
  console.log('[INFO]', {
    message,
    ...data,
    timestamp: new Date().toISOString(),
  });
}
```

**Usage**:
```typescript
import { logError, logInfo } from '@/lib/logger';

try {
  // Code
} catch (error) {
  logError(error, { userId, action: 'create_project' });
}
```

---

## 8️⃣ ROLLBACK STRATEGY

### Rollback Vercel

**Automatic Rollback**:
```bash
# Revenir au deployment précédent (immediate)
npx vercel rollback

# Promouvoir un deployment spécifique
npx vercel promote <deployment-url>
```

**Manual Rollback** (Git):
```bash
# Revenir au commit précédent
git revert HEAD
git push origin main

# Vercel auto-deploy le revert
```

### Database Rollback

**Migration Rollback**:
```sql
-- Si migration appliquée, créer migration inverse
-- Exemple: si ajout colonne → migration inverse supprime colonne

-- migration_001_add_column.sql
ALTER TABLE projects ADD COLUMN new_field TEXT;

-- migration_001_rollback.sql
ALTER TABLE projects DROP COLUMN new_field;
```

**Restore from Backup**:
```bash
# Restore Supabase backup
# Via Dashboard → Database → Backups → Restore

# Ou via CLI
psql $DATABASE_URL < backup-full.sql
```

### Incident Response

**Playbook**:
1. **Detect** → Alertes Vercel/Supabase
2. **Assess** → Logs, métriques, impact utilisateurs
3. **Rollback** → Si critique, rollback immédiat
4. **Fix** → Correction en local, tests
5. **Deploy** → Redéploiement
6. **Monitor** → Surveillance 24h
7. **Postmortem** → Documentation incident

---

## 9️⃣ POST-DEPLOYMENT TESTS

### Smoke Tests (Immediate)

```bash
# 1. Vitrine accessible
curl -I https://powalyze.com
# Expected: 200 OK

# 2. API Health
curl https://powalyze.com/api/test-supabase
# Expected: {"status": "ok"}

# 3. Guards DEMO
# User DEMO → Navigate /cockpit → Should redirect /cockpit-demo

# 4. Guards PRO
# User PRO → Navigate /cockpit-demo → Should redirect /cockpit

# 5. IA Endpoint
curl -X POST https://powalyze.com/api/ai/chief-actions \
  -H "Content-Type: application/json" \
  -d '{"projects": [], "risks": []}'
# Expected: 200 + 6 actions
```

### E2E Tests (Critical Flows)

**Playwright Tests**:
```typescript
// tests/e2e/auth.spec.ts
test('user can login and access DEMO cockpit', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'demo@powalyze.com');
  await page.fill('[name=password]', 'password');
  await page.click('button[type=submit]');
  
  await expect(page).toHaveURL('/cockpit-demo');
  await expect(page.locator('h1')).toContainText('Mode DEMO');
});

// tests/e2e/crud.spec.ts
test('user can create DEMO risk', async ({ page }) => {
  await page.goto('/cockpit-demo/risques/nouveau');
  await page.fill('[name=title]', 'Test Risk');
  await page.fill('[name=description]', 'Test description');
  await page.selectOption('[name=impact]', '5');
  await page.selectOption('[name=probability]', '3');
  await page.click('button[type=submit]');
  
  await expect(page).toHaveURL('/cockpit-demo/risques');
  await expect(page.locator('text=Test Risk')).toBeVisible();
});
```

**Run Tests**:
```bash
npx playwright test
npx playwright test --headed  # Mode visuel
npx playwright test --debug   # Mode debug
```

### Performance Tests

**Lighthouse CI**:
```bash
lhci autorun --collect.url=https://powalyze.com
# Target: Performance > 90, Accessibility > 95
```

**Load Testing** (k6):
```javascript
// tests/load/api.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  let res = http.get('https://powalyze.com/api/cockpit');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
```

```bash
k6 run tests/load/api.js
```

---

## 🔟 MAINTENANCE

### Daily Tasks
- ✅ Check Vercel deployment status
- ✅ Review error logs (Sentry/Vercel)
- ✅ Monitor database size (Supabase)
- ✅ Check API response times

### Weekly Tasks
- ✅ Review security alerts (npm audit)
- ✅ Update dependencies (patch versions)
- ✅ Backup database manually (optionnel)
- ✅ Performance review (Lighthouse)

### Monthly Tasks
- ✅ Update dependencies (minor versions)
- ✅ Security scan (OWASP ZAP)
- ✅ Cost review (Vercel + Supabase)
- ✅ Capacity planning

### Quarterly Tasks
- ✅ Major dependencies update
- ✅ Architecture review
- ✅ Disaster recovery drill
- ✅ Performance optimization review

---

## 🎯 DEPLOYMENT CHECKLIST FINALE

### Pre-Deployment
- [ ] Code review completed
- [ ] All tests passing
- [ ] Build successful (npm run build)
- [ ] Environment variables configured (Vercel)
- [ ] Supabase RLS activated
- [ ] Documentation updated
- [ ] Backup database
- [ ] Notify team

### Deployment
- [ ] Deploy to staging first
- [ ] Run smoke tests staging
- [ ] Deploy to production
- [ ] Monitor deployment logs
- [ ] Run smoke tests production
- [ ] Verify guards working
- [ ] Test CRUD operations
- [ ] Test IA endpoints

### Post-Deployment
- [ ] Monitor errors (1 hour)
- [ ] Check performance metrics
- [ ] Verify user activity
- [ ] Update status page
- [ ] Document issues
- [ ] Celebrate 🎉

---

## 📞 CONTACTS & SUPPORT

### Équipe DevOps
- **Lead DevOps**: [Nom] - [email]
- **SRE**: [Nom] - [email]
- **On-call**: [Rotation]

### Services Externes
- **Vercel Support**: support@vercel.com
- **Supabase Support**: support@supabase.io
- **OpenAI Support**: support@openai.com

### Escalation
1. **P0 (Critical)**: Immediate notification, rollback if needed
2. **P1 (High)**: Fix within 2 hours
3. **P2 (Medium)**: Fix within 24 hours
4. **P3 (Low)**: Fix in next sprint

---

**DevOps Agent**  
**Date**: 26 janvier 2026  
**Status**: ✅ READY FOR PRODUCTION DEPLOYMENT
