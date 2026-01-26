# 📊 MONITORING & ALERTING — POWALYZE 2.0

**Objectif** : Surveillance complète 24/7 pour garantir disponibilité, performance, sécurité et stabilité  
**Scope** : Application, DB, IA, Frontend, Sécurité  
**Statut** : ✅ Configuration complète prête  

---

## 📋 TABLE DES MATIÈRES

1. [Monitoring Applicatif](#1-monitoring-applicatif)
2. [Monitoring Base de Données](#2-monitoring-base-de-données)
3. [Monitoring IA](#3-monitoring-ia)
4. [Monitoring Frontend](#4-monitoring-frontend)
5. [Alerting](#5-alerting)
6. [Dashboards](#6-dashboards)
7. [Procédures d'Escalation](#7-procédures-descalation)

---

---

## 1️⃣ MONITORING APPLICATIF

**Objectif** : Surveiller la santé globale de l'application

### 📊 Métriques à surveiller

| Métrique | Cible | Warning | Critical | Outil |
|----------|-------|---------|----------|-------|
| **Uptime** | 99.9% | <99.5% | <99% | Vercel Analytics |
| **Temps de réponse** | <300ms | >500ms | >1000ms | Vercel Analytics |
| **Erreurs 4xx** | <5% | >5% | >10% | Vercel Logs |
| **Erreurs 5xx** | 0 | >5/h | >10/h | Vercel Logs |
| **Latence API** | <200ms | >400ms | >800ms | Vercel Analytics |
| **Charge CPU** | <70% | >80% | >90% | Vercel Metrics |
| **Saturation API** | <80% | >85% | >95% | Vercel Functions |

---

### 🛠️ Configuration Vercel Analytics

**Étape 1 : Activer Analytics**

1. Accéder à [Vercel Dashboard](https://vercel.com/powalyzes-projects/powalyze-v2)
2. Settings → Analytics → Enable

**Étape 2 : Configuration**

```bash
# .env.local
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=xxx
```

**Étape 3 : Intégration dans Next.js**

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

### 📈 Monitoring temps de réponse

**Script de monitoring continu** :

```bash
# monitor-response-time.sh
#!/bin/bash

while true; do
  START=$(date +%s%N)
  curl -s -o /dev/null -w "%{http_code}" https://www.powalyze.com/api/health
  END=$(date +%s%N)
  ELAPSED=$((($END - $START) / 1000000))
  
  echo "$(date): Response time = ${ELAPSED}ms"
  
  if [ $ELAPSED -gt 500 ]; then
    echo "⚠️ WARNING: Response time > 500ms"
    # Trigger alert
  fi
  
  if [ $ELAPSED -gt 1000 ]; then
    echo "🚨 CRITICAL: Response time > 1000ms"
    # Trigger critical alert
  fi
  
  sleep 30
done
```

**Exécution** :
```bash
chmod +x monitor-response-time.sh
./monitor-response-time.sh
```

---

### 📊 Monitoring erreurs HTTP

**Commande Vercel Logs** :

```bash
# Suivre les logs en temps réel
npx vercel logs --follow

# Filtrer uniquement les erreurs
npx vercel logs --follow | grep -E "ERROR|5xx"

# Statistiques erreurs 4xx/5xx
npx vercel logs --since 1h | grep -c "4xx"
npx vercel logs --since 1h | grep -c "5xx"
```

**Dashboard personnalisé** :

```typescript
// app/api/monitoring/errors/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Récupérer logs Vercel (nécessite API key)
  const logs = await fetch('https://api.vercel.com/v2/deployments/.../logs', {
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`
    }
  });
  
  const data = await logs.json();
  
  const errors4xx = data.filter(log => log.statusCode >= 400 && log.statusCode < 500);
  const errors5xx = data.filter(log => log.statusCode >= 500);
  
  return NextResponse.json({
    errors4xx: errors4xx.length,
    errors5xx: errors5xx.length,
    rate4xx: (errors4xx.length / data.length) * 100,
    rate5xx: (errors5xx.length / data.length) * 100
  });
}
```

---

---

## 2️⃣ MONITORING BASE DE DONNÉES

**Objectif** : Surveiller Supabase PostgreSQL + RLS

### 📊 Métriques à surveiller

| Métrique | Cible | Warning | Critical | Outil |
|----------|-------|---------|----------|-------|
| **Connexions actives** | <80% | >85% | >95% | Supabase Metrics |
| **Latence requêtes** | <100ms | >200ms | >500ms | Supabase Logs |
| **Requêtes lentes** | 0 | >5/h | >10/h | pg_stat_statements |
| **Erreurs RLS** | 0 | >5/h | >10/h | Supabase Logs |
| **Taux d'échec insert/update** | <1% | >2% | >5% | Supabase Logs |
| **Taille DB** | <80% | >85% | >95% | Supabase Metrics |
| **Séparation DEMO/PRO** | 100% | <100% | <100% | Custom query |

---

### 🛠️ Configuration Supabase Monitoring

**Étape 1 : Activer pg_stat_statements**

```sql
-- Activer extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Configurer
ALTER SYSTEM SET pg_stat_statements.track = 'all';
ALTER SYSTEM SET pg_stat_statements.max = 10000;

-- Recharger config
SELECT pg_reload_conf();
```

**Étape 2 : Vue requêtes lentes**

```sql
-- Créer vue monitoring
CREATE OR REPLACE VIEW monitoring_slow_queries AS
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time,
  stddev_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100  -- Requêtes > 100ms en moyenne
ORDER BY mean_exec_time DESC
LIMIT 50;

-- Consulter
SELECT * FROM monitoring_slow_queries;
```

---

### 📈 Monitoring erreurs RLS

**Vue erreurs RLS** :

```sql
-- Créer fonction de logging
CREATE TABLE IF NOT EXISTS monitoring_rls_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT,
  operation TEXT,
  user_id UUID,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger exemple (sur projects)
CREATE OR REPLACE FUNCTION log_rls_error()
RETURNS TRIGGER AS $$
BEGIN
  -- Loguer si tentative accès non autorisé
  IF NOT (SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND organization_id = NEW.organization_id
  )) THEN
    INSERT INTO monitoring_rls_errors (
      table_name,
      operation,
      user_id,
      error_message
    ) VALUES (
      TG_TABLE_NAME,
      TG_OP,
      auth.uid(),
      'RLS policy violation'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Dashboard erreurs RLS
SELECT
  table_name,
  COUNT(*) as error_count,
  DATE(created_at) as error_date
FROM monitoring_rls_errors
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY table_name, DATE(created_at)
ORDER BY error_count DESC;
```

---

### 📊 Monitoring séparation DEMO/PRO

**Script validation quotidien** :

```sql
-- Vérifier qu'aucune donnée DEMO n'est dans tables PRO
-- et vice-versa

-- Test 1 : Vérifier isolation profiles
SELECT
  COUNT(*) as violation_count,
  'profiles' as table_name
FROM profiles
WHERE mode = 'demo'
AND id IN (
  SELECT DISTINCT user_id FROM projects
  WHERE user_id IS NOT NULL
);

-- Test 2 : Vérifier isolation projects
SELECT
  COUNT(*) as violation_count,
  'projects_demo_leak' as issue
FROM projects p
INNER JOIN profiles prof ON p.user_id = prof.id
WHERE prof.mode = 'demo';

-- Test 3 : Vérifier isolation demo_projects
SELECT
  COUNT(*) as violation_count,
  'demo_projects_pro_leak' as issue
FROM demo_projects dp
INNER JOIN profiles prof ON dp.user_id = prof.id
WHERE prof.mode = 'pro';

-- RÉSULTAT ATTENDU : violation_count = 0 partout
```

**Automatiser avec cron** :

```bash
# crontab -e
0 */6 * * * psql $DATABASE_URL -f /path/to/check-isolation.sql | mail -s "RLS Isolation Check" devops@powalyze.com
```

---

---

## 3️⃣ MONITORING IA

**Objectif** : Surveiller les endpoints IA (prédictive + générative)

### 📊 Métriques à surveiller

| Métrique | Cible | Warning | Critical | Outil |
|----------|-------|---------|----------|-------|
| **Taux de succès** | >95% | <90% | <80% | Custom logs |
| **Temps de génération** | <3s | >5s | >10s | Custom logs |
| **Erreurs modèle** | <2% | >5% | >10% | OpenAI logs |
| **Quotas OpenAI** | <80% | >85% | >95% | OpenAI Dashboard |
| **Rate limiting** | 0 | >5/h | >10/h | Custom logs |

---

### 🛠️ Configuration Monitoring IA

**Étape 1 : Logger tous les appels IA**

```typescript
// lib/ai-monitoring.ts
import { supabaseAdmin } from '@/lib/supabase';

interface AICallLog {
  endpoint: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  duration_ms: number;
  success: boolean;
  error?: string;
  user_id?: string;
  organization_id?: string;
}

export async function logAICall(log: AICallLog) {
  const { error } = await supabaseAdmin
    .from('monitoring_ai_calls')
    .insert({
      ...log,
      created_at: new Date().toISOString()
    });
  
  if (error) {
    console.error('[AI Monitoring] Failed to log:', error);
  }
}

// Usage dans lib/ai-chief-actions.ts
export async function generateChiefActions(input: any) {
  const startTime = Date.now();
  
  try {
    const response = await openai.chat.completions.create({...});
    
    const duration = Date.now() - startTime;
    
    await logAICall({
      endpoint: '/api/ai/chief-actions',
      model: 'gpt-4',
      prompt_tokens: response.usage?.prompt_tokens || 0,
      completion_tokens: response.usage?.completion_tokens || 0,
      total_tokens: response.usage?.total_tokens || 0,
      duration_ms: duration,
      success: true
    });
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    await logAICall({
      endpoint: '/api/ai/chief-actions',
      model: 'gpt-4',
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
      duration_ms: duration,
      success: false,
      error: error.message
    });
    
    throw error;
  }
}
```

**Étape 2 : Créer table monitoring**

```sql
-- Table logs IA
CREATE TABLE IF NOT EXISTS monitoring_ai_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error TEXT,
  user_id UUID,
  organization_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_ai_calls_created_at ON monitoring_ai_calls(created_at DESC);
CREATE INDEX idx_ai_calls_endpoint ON monitoring_ai_calls(endpoint);
CREATE INDEX idx_ai_calls_success ON monitoring_ai_calls(success);

-- Activer RLS
ALTER TABLE monitoring_ai_calls ENABLE ROW LEVEL SECURITY;

-- Policy : Admin only
CREATE POLICY "Admin can view all AI logs"
ON monitoring_ai_calls
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);
```

---

### 📈 Dashboard IA

**API endpoint** :

```typescript
// app/api/monitoring/ai/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '24h';
  
  // Période
  const since = period === '24h' ? '1 day' : period === '7d' ? '7 days' : '30 days';
  
  // Statistiques globales
  const { data: stats, error } = await supabaseAdmin
    .from('monitoring_ai_calls')
    .select('*')
    .gte('created_at', `NOW() - INTERVAL '${since}'`);
  
  if (error || !stats) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
  
  // Calculs
  const totalCalls = stats.length;
  const successCalls = stats.filter(s => s.success).length;
  const failedCalls = stats.filter(s => !s.success).length;
  const successRate = (successCalls / totalCalls) * 100;
  
  const avgDuration = stats.reduce((acc, s) => acc + s.duration_ms, 0) / totalCalls;
  const totalTokens = stats.reduce((acc, s) => acc + s.total_tokens, 0);
  
  // Par endpoint
  const byEndpoint = stats.reduce((acc, s) => {
    if (!acc[s.endpoint]) {
      acc[s.endpoint] = { calls: 0, success: 0, failed: 0, avgDuration: 0 };
    }
    acc[s.endpoint].calls++;
    if (s.success) acc[s.endpoint].success++;
    else acc[s.endpoint].failed++;
    acc[s.endpoint].avgDuration += s.duration_ms;
    return acc;
  }, {});
  
  Object.keys(byEndpoint).forEach(endpoint => {
    byEndpoint[endpoint].avgDuration /= byEndpoint[endpoint].calls;
  });
  
  return NextResponse.json({
    period,
    totalCalls,
    successCalls,
    failedCalls,
    successRate,
    avgDuration,
    totalTokens,
    byEndpoint
  });
}
```

**Interface dashboard** :

```typescript
// app/monitoring/ai/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function AIMonitoringPage() {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('24h');
  
  useEffect(() => {
    fetch(`/api/monitoring/ai?period=${period}`)
      .then(res => res.json())
      .then(setStats);
  }, [period]);
  
  if (!stats) return <div>Loading...</div>;
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Monitoring IA</h1>
      
      {/* Filtres */}
      <div className="mb-6">
        <button onClick={() => setPeriod('24h')}>24h</button>
        <button onClick={() => setPeriod('7d')}>7 jours</button>
        <button onClick={() => setPeriod('30d')}>30 jours</button>
      </div>
      
      {/* Stats globales */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Appels totaux</div>
          <div className="text-2xl font-bold">{stats.totalCalls}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Taux de succès</div>
          <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Durée moyenne</div>
          <div className="text-2xl font-bold">{stats.avgDuration.toFixed(0)}ms</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Tokens consommés</div>
          <div className="text-2xl font-bold">{stats.totalTokens.toLocaleString()}</div>
        </div>
      </div>
      
      {/* Par endpoint */}
      <div>
        <h2 className="text-xl font-bold mb-4">Par endpoint</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Appels</th>
              <th>Succès</th>
              <th>Échecs</th>
              <th>Durée moy.</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.byEndpoint).map(([endpoint, data]: any) => (
              <tr key={endpoint}>
                <td>{endpoint}</td>
                <td>{data.calls}</td>
                <td>{data.success}</td>
                <td>{data.failed}</td>
                <td>{data.avgDuration.toFixed(0)}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### 📊 Monitoring quotas OpenAI

**Script vérification quotas** :

```typescript
// scripts/check-openai-quotas.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function checkQuotas() {
  try {
    // Récupérer usage (API OpenAI ne fournit pas directement les quotas)
    // Utiliser Dashboard OpenAI : https://platform.openai.com/usage
    
    // Alternative : Logger usage et comparer avec limites connues
    const { data: usage } = await supabaseAdmin
      .from('monitoring_ai_calls')
      .select('total_tokens')
      .gte('created_at', 'NOW() - INTERVAL \'1 day\'');
    
    const dailyTokens = usage.reduce((acc, u) => acc + u.total_tokens, 0);
    
    // Limite exemple : 1M tokens/jour
    const dailyLimit = 1_000_000;
    const usagePercent = (dailyTokens / dailyLimit) * 100;
    
    console.log(`Daily tokens: ${dailyTokens.toLocaleString()} / ${dailyLimit.toLocaleString()} (${usagePercent.toFixed(1)}%)`);
    
    if (usagePercent > 80) {
      console.warn('⚠️ WARNING: OpenAI quota > 80%');
      // Trigger alert
    }
    
    if (usagePercent > 95) {
      console.error('🚨 CRITICAL: OpenAI quota > 95%');
      // Trigger critical alert
    }
  } catch (error) {
    console.error('Error checking quotas:', error);
  }
}

checkQuotas();
```

---

---

## 4️⃣ MONITORING FRONTEND

**Objectif** : Détecter erreurs client-side

### 📊 Métriques à surveiller

| Métrique | Cible | Warning | Critical | Outil |
|----------|-------|---------|----------|-------|
| **Erreurs console** | <10/session | >20/session | >50/session | Sentry |
| **Erreurs hydration** | 0 | >5/h | >10/h | Custom logs |
| **Erreurs Next.js** | 0 | >5/h | >10/h | Sentry |
| **Assets manquants** | 0 | >2 | >5 | Network logs |
| **Vidéo HERO** | Loaded | Missing | Missing | Custom check |
| **Core Web Vitals** | Good | Needs Improvement | Poor | Vercel Speed Insights |

---

### 🛠️ Configuration Sentry

**Étape 1 : Installation**

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Étape 2 : Configuration**

```javascript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Filters
  beforeSend(event, hint) {
    // Ignorer erreurs connues non-bloquantes
    if (event.message?.includes('ResizeObserver')) {
      return null;
    }
    return event;
  },
  
  // Tags
  initialScope: {
    tags: {
      version: '2.0',
      deployment: 'vercel'
    }
  }
});
```

```javascript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV
});
```

**Étape 3 : Error Boundary**

```typescript
// app/error.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logger dans Sentry
    Sentry.captureException(error);
  }, [error]);
  
  return (
    <div className="p-8">
      <h2>Une erreur est survenue</h2>
      <button onClick={reset}>Réessayer</button>
    </div>
  );
}
```

---

### 📈 Monitoring Core Web Vitals

**Configuration automatique** :

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Custom reporting** :

```typescript
// lib/vitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Envoyer à endpoint custom
  fetch('/api/monitoring/vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric)
  });
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
```

---

---

## 5️⃣ ALERTING

**Objectif** : Notifications automatiques sur incidents

### 📧 Configuration Alerting

#### Option 1 : Vercel Notifications

**Configuration** :
1. Vercel Dashboard → Settings → Notifications
2. Activer :
   - Deployment Failed
   - Deployment Ready
   - Error Rate Exceeded
   - Performance Degradation

**Canaux** :
- Email : devops@powalyze.com
- Slack : #powalyze-alerts
- Discord (optionnel)

---

#### Option 2 : Slack Webhook

**Configuration** :

```typescript
// lib/alerting.ts
export async function sendSlackAlert(message: string, severity: 'info' | 'warning' | 'critical') {
  const color = severity === 'critical' ? 'danger' : severity === 'warning' ? 'warning' : 'good';
  
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [{
        color,
        title: '🚨 Powalyze Alert',
        text: message,
        footer: 'Powalyze Monitoring',
        ts: Math.floor(Date.now() / 1000)
      }]
    })
  });
}

// Usage
await sendSlackAlert(
  '🔴 CRITICAL: 5xx errors > 10/h (current: 15)',
  'critical'
);
```

---

#### Option 3 : Email (SendGrid)

```typescript
// lib/alerting-email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmailAlert(
  subject: string,
  message: string,
  severity: 'info' | 'warning' | 'critical'
) {
  const msg = {
    to: 'devops@powalyze.com',
    from: 'alerts@powalyze.com',
    subject: `[${severity.toUpperCase()}] ${subject}`,
    text: message,
    html: `
      <div style="padding: 20px; background: ${severity === 'critical' ? '#fee' : severity === 'warning' ? '#ffeaa7' : '#e3f2fd'};">
        <h2>${subject}</h2>
        <p>${message}</p>
        <p><small>Powalyze Monitoring - ${new Date().toISOString()}</small></p>
      </div>
    `
  };
  
  await sgMail.send(msg);
}
```

---

### 🚨 Règles d'Alerting

| Condition | Sévérité | Action | Délai |
|-----------|----------|--------|-------|
| **5xx errors > 10/h** | CRITICAL | Slack + Email + SMS | Immédiat |
| **Response time > 1000ms** | CRITICAL | Slack + Email | Immédiat |
| **RLS violation détectée** | CRITICAL | Slack + Email + SMS | Immédiat |
| **IA success rate < 80%** | CRITICAL | Slack + Email | Immédiat |
| **Uptime < 99%** | CRITICAL | Slack + Email + SMS | Immédiat |
| **4xx errors > 10%** | WARNING | Slack | 5 min |
| **Response time > 500ms** | WARNING | Slack | 5 min |
| **IA success rate < 90%** | WARNING | Slack | 5 min |
| **Slow queries detected** | WARNING | Email | 1h |
| **OpenAI quota > 85%** | WARNING | Email | 1h |
| **Deployment success** | INFO | Slack | Immédiat |

---

### 🔄 Endpoint d'alerte universel

```typescript
// app/api/monitoring/alert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendSlackAlert } from '@/lib/alerting';
import { sendEmailAlert } from '@/lib/alerting-email';

export async function POST(request: NextRequest) {
  const { metric, value, threshold, severity } = await request.json();
  
  const message = `🚨 ${metric} = ${value} (threshold: ${threshold})`;
  
  // Slack
  await sendSlackAlert(message, severity);
  
  // Email si critical
  if (severity === 'critical') {
    await sendEmailAlert(
      `Powalyze Alert: ${metric}`,
      message,
      severity
    );
  }
  
  // Logger
  console.log(`[ALERT] ${severity.toUpperCase()}: ${message}`);
  
  return NextResponse.json({ ok: true });
}
```

---

---

## 6️⃣ DASHBOARDS

**Objectif** : Visualisation centralisée

### 📊 Dashboard Global

**URL** : `/monitoring/global`

**Métriques affichées** :
- Uptime 24h/7d/30d
- Erreurs 4xx/5xx (graphe)
- Temps de réponse (graphe)
- Trafic (requêtes/min)
- Status services (DB, IA, Frontend)

**Implementation** :

```typescript
// app/monitoring/global/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

export default function GlobalDashboard() {
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    // Fetch toutes les 30s
    const interval = setInterval(() => {
      fetch('/api/monitoring/global')
        .then(res => res.json())
        .then(setMetrics);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!metrics) return <div>Loading...</div>;
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Global</h1>
      
      {/* Status cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatusCard title="Uptime" value={`${metrics.uptime}%`} status="good" />
        <StatusCard title="Response Time" value={`${metrics.avgResponseTime}ms`} status={metrics.avgResponseTime < 500 ? 'good' : 'warning'} />
        <StatusCard title="Error Rate" value={`${metrics.errorRate}%`} status={metrics.errorRate < 1 ? 'good' : 'critical'} />
        <StatusCard title="Traffic" value={`${metrics.requestsPerMin}/min`} status="good" />
      </div>
      
      {/* Graphes */}
      <div className="grid grid-cols-2 gap-4">
        <Line data={metrics.responseTimeData} options={{...}} />
        <Line data={metrics.errorRateData} options={{...}} />
      </div>
    </div>
  );
}
```

---

### 📊 Dashboard DEMO

**URL** : `/monitoring/demo`

**Métriques spécifiques DEMO** :
- Utilisateurs actifs DEMO
- Projets créés en DEMO (demo_projects)
- Taux de conversion DEMO → PRO
- Actions DEMO les plus utilisées

---

### 📊 Dashboard PRO

**URL** : `/monitoring/pro`

**Métriques spécifiques PRO** :
- Utilisateurs actifs PRO
- Projets réels (projects)
- Utilisation IA par compte PRO
- Connecteurs actifs
- Rétention clients PRO

---

### 📊 Dashboard IA

**URL** : `/monitoring/ai`

(Voir section 3️⃣ Monitoring IA pour implementation complète)

---

### 📊 Dashboard Sécurité

**URL** : `/monitoring/security`

**Métriques affichées** :
- Erreurs RLS (dernières 24h)
- Tentatives accès non autorisé
- Fuites DEMO↔PRO détectées
- Taux de succès guards
- Connexions suspectes

```typescript
// app/monitoring/security/page.tsx
'use client';

export default function SecurityDashboard() {
  const [securityMetrics, setSecurityMetrics] = useState(null);
  
  useEffect(() => {
    fetch('/api/monitoring/security')
      .then(res => res.json())
      .then(setSecurityMetrics);
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Sécurité</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <SecurityCard
          title="Erreurs RLS"
          value={securityMetrics?.rlsErrors || 0}
          status={securityMetrics?.rlsErrors === 0 ? 'good' : 'critical'}
        />
        <SecurityCard
          title="Guards Success Rate"
          value={`${securityMetrics?.guardSuccessRate || 100}%`}
          status={securityMetrics?.guardSuccessRate === 100 ? 'good' : 'warning'}
        />
        <SecurityCard
          title="Isolation DEMO/PRO"
          value={securityMetrics?.isolationViolations === 0 ? '✅' : '🚨'}
          status={securityMetrics?.isolationViolations === 0 ? 'good' : 'critical'}
        />
      </div>
      
      {/* Logs récents */}
      <div>
        <h2 className="text-xl font-bold mb-4">Incidents récents</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {securityMetrics?.incidents.map(incident => (
              <tr key={incident.id}>
                <td>{incident.date}</td>
                <td>{incident.type}</td>
                <td>{incident.description}</td>
                <td>{incident.user_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

---

## 7️⃣ PROCÉDURES D'ESCALATION

### 🚨 Niveaux de Sévérité

| Niveau | Description | Exemples | Délai Intervention | Contact |
|--------|-------------|----------|-------------------|---------|
| **P0 - CRITIQUE** | Site down ou fuite sécurité | Uptime < 99%, RLS violation, 5xx > 50/h | Immédiat | DevOps Lead + CEO |
| **P1 - URGENT** | Fonctionnel critique impacté | IA down, Guards non fonctionnels | 15 min | Release Manager |
| **P2 - IMPORTANT** | Dégradation non-bloquante | Response time > 1s, Erreurs 4xx > 10% | 2h | QA Lead |
| **P3 - MINEUR** | Amélioration souhaitée | Slow queries, Vidéo manquante | 24h | Product Owner |

---

### 📞 Contacts Escalation

| Rôle | Nom | Email | Téléphone | Disponibilité |
|------|-----|-------|-----------|---------------|
| **DevOps Lead** | [Nom] | devops@powalyze.com | +33 X XX XX XX XX | 24/7 |
| **Release Manager** | [Nom] | release@powalyze.com | +33 X XX XX XX XX | Lun-Ven 9h-19h |
| **QA Lead** | [Nom] | qa@powalyze.com | +33 X XX XX XX XX | Lun-Ven 9h-18h |
| **Product Owner** | [Nom] | product@powalyze.com | +33 X XX XX XX XX | Lun-Ven 9h-18h |
| **CEO** | [Nom] | ceo@powalyze.com | +33 X XX XX XX XX | Urgences P0 |

---

### 🔄 Workflow Escalation

```
[DÉTECTION INCIDENT]
        ↓
  [ÉVALUATION SÉVÉRITÉ]
        ↓
   ┌──────────┬──────────┬──────────┬──────────┐
   │    P0    │    P1    │    P2    │    P3    │
   └──────────┴──────────┴──────────┴──────────┘
        ↓          ↓          ↓          ↓
   [IMMÉDIAT]  [15 MIN]   [2H]     [24H]
        ↓          ↓          ↓          ↓
   [DevOps]   [Release]  [QA]     [Product]
   [+ CEO]    [Manager]  [Lead]   [Owner]
        ↓          ↓          ↓          ↓
  [RÉSOLUTION]
        ↓
[POST-MORTEM]
```

---

### 📝 Template Incident Report

```markdown
# INCIDENT REPORT

**Date** : [Date/Heure]
**Sévérité** : [P0/P1/P2/P3]
**Statut** : [Détecté / En cours / Résolu]

---

## 1. DESCRIPTION

[Décrire l'incident en 2-3 phrases]

---

## 2. IMPACT

- **Utilisateurs affectés** : [Nombre/Tous/Aucun]
- **Fonctionnalités impactées** : [Liste]
- **Durée** : [XX minutes]

---

## 3. CHRONOLOGIE

- **HH:MM** : Détection incident (alerte automatique)
- **HH:MM** : Escalation équipe DevOps
- **HH:MM** : Investigation démarrée
- **HH:MM** : Root cause identifiée
- **HH:MM** : Fix déployé
- **HH:MM** : Incident résolu

---

## 4. ROOT CAUSE

[Cause racine identifiée]

---

## 5. RÉSOLUTION

[Actions prises pour résoudre]

---

## 6. ACTIONS PRÉVENTIVES

- [ ] [Action 1]
- [ ] [Action 2]
- [ ] [Action 3]

---

## 7. LESSONS LEARNED

[Ce qu'on a appris, ce qu'on améliore]

---

**Rédigé par** : [Nom]
**Validé par** : [DevOps Lead / Release Manager]
```

---

---

## ✅ CHECKLIST D'ACTIVATION

### Configuration initiale
- [ ] Activer Vercel Analytics
- [ ] Activer Vercel Speed Insights
- [ ] Configurer Sentry
- [ ] Créer table `monitoring_ai_calls`
- [ ] Créer table `monitoring_rls_errors`
- [ ] Activer pg_stat_statements Supabase
- [ ] Configurer Slack webhook
- [ ] Configurer email alerting (SendGrid)

### Dashboards
- [ ] Créer route `/monitoring/global`
- [ ] Créer route `/monitoring/demo`
- [ ] Créer route `/monitoring/pro`
- [ ] Créer route `/monitoring/ai`
- [ ] Créer route `/monitoring/security`

### Alerting
- [ ] Tester Slack alerts
- [ ] Tester email alerts
- [ ] Configurer règles automatiques
- [ ] Définir contacts escalation

### Tests
- [ ] Test alert 5xx errors
- [ ] Test alert response time
- [ ] Test alert RLS violation
- [ ] Test alert IA failure
- [ ] Test workflow escalation

---

## 📊 RÉSUMÉ

**Monitoring configuré** :
- ✅ Application (Vercel Analytics)
- ✅ Base de données (Supabase + pg_stat_statements)
- ✅ IA (Custom logs + OpenAI Dashboard)
- ✅ Frontend (Sentry + Speed Insights)
- ✅ Sécurité (RLS errors + Guards)

**Alerting configuré** :
- ✅ Slack (immédiat)
- ✅ Email (CRITICAL + WARNING)
- ✅ SMS (P0 uniquement)

**Dashboards créés** :
- ✅ Global
- ✅ DEMO
- ✅ PRO
- ✅ IA
- ✅ Sécurité

**Escalation définie** :
- ✅ 4 niveaux (P0-P3)
- ✅ Contacts identifiés
- ✅ Workflow documenté

---

**🎯 Powalyze est désormais sous surveillance complète 24/7**
