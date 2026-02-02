# 🚀 API & WEBHOOKS — Module d'Intégrations Externes

## Vue d'ensemble

**"L'API REST de Powalyze permet d'automatiser vos workflows, synchroniser des données externes et recevoir des notifications en temps réel via webhooks."**

---

## 1. Objectif du module API & Webhooks

### 🎯 Ce que permet ce module

- ✅ **Appeler Powalyze depuis outils externes** (Jira, Azure DevOps, ServiceNow, Power BI, Zapier)
- ✅ **Automatiser la création** de projets, risques, décisions
- ✅ **Générer des rapports IA** via API
- ✅ **Recevoir des événements en temps réel** (webhooks)
- ✅ **Construire des workflows d'entreprise** personnalisés

---

## 2. API Keys — Architecture & Sécurité

### 2.1 Table `api_keys`

**Champs essentiels**:
```sql
- id uuid
- organization_id uuid
- name text (nom descriptif de la clé)
- token_hash text (SHA-256, jamais en clair)
- permissions text[] (read, write, admin)
- is_active boolean
- expires_at timestamptz (optionnel)
- last_used_at timestamptz
- rate_limit int (défaut: 1000/h)
- usage_count int
```

**Sécurité**:
- ❌ **Jamais stocker le token en clair**
- ✅ **Hash SHA-256** du token
- ✅ **Token affiché une seule fois** lors de la création
- ✅ **Rate limiting** par clé API (1000 req/h par défaut)

---

### 2.2 Permissions API

| Permission | Accès |
|-----------|-------|
| **read** | GET uniquement (lecture seule) |
| **write** | GET + POST + PUT (lecture + écriture) |
| **admin** | Tout + DELETE (accès complet) |

**Exemple d'utilisation**:
- Clé **read** → Power BI (dashboards)
- Clé **write** → Jira (création automatique de projets/risques)
- Clé **admin** → Scripts d'administration (import/export)

---

### 2.3 RLS (Row Level Security)

**Policies existantes**:
```sql
-- Lecture: tous les membres de l'organisation
create policy "api_keys_by_org" on api_keys
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- Création/suppression: admin uniquement
create policy "api_keys_write_admin_only" on api_keys
  for all using (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() 
        and mode = 'admin'
        and plan != 'demo'  -- ❌ Interdit en mode demo
    )
  );
```

---

## 3. Premier appel API (Exemple officiel)

### 3.1 Authentification Bearer Token

**Curl**:
```bash
curl https://api.powalyze.com/v1/projects \
  -H "Authorization: Bearer pk_live_xxxxx" \
  -H "Content-Type: application/json"
```

**JavaScript/TypeScript**:
```typescript
const response = await fetch('https://api.powalyze.com/v1/projects', {
  headers: {
    'Authorization': 'Bearer pk_live_xxxxx',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

**Python**:
```python
import requests

headers = {
    'Authorization': 'Bearer pk_live_xxxxx',
    'Content-Type': 'application/json'
}
response = requests.get('https://api.powalyze.com/v1/projects', headers=headers)
data = response.json()
```

---

### 3.2 Réponse standardisée Powalyze

**Format succès (2xx)**:
```json
{
  "data": [
    {
      "id": "prj_abc123",
      "name": "Transformation Digitale",
      "status": "in_progress",
      "rag_status": "GREEN",
      "progress": 45,
      "budget": 150000,
      "spent": 67500
    }
  ],
  "pagination": {
    "total": 12,
    "limit": 50,
    "offset": 0,
    "has_more": false
  }
}
```

**Format erreur (4xx/5xx)**:
```json
{
  "error": {
    "code": "forbidden",
    "message": "You do not have permission to perform this action."
  }
}
```

---

### 3.3 Query params standardisés

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `limit` | Nombre de résultats (défaut: 50, max: 100) | `?limit=20` |
| `offset` | Pagination (défaut: 0) | `?offset=40` |
| `sort` | Tri (défaut: created_at.desc) | `?sort=name.asc` |
| `status` | Filtre par statut | `?status=in_progress` |
| `rag_status` | Filtre par santé | `?rag_status=RED` |

**Exemple complet**:
```bash
curl "https://api.powalyze.com/v1/projects?limit=10&offset=0&status=in_progress&sort=budget.desc" \
  -H "Authorization: Bearer pk_live_xxxxx"
```

---

## 4. Webhooks — Architecture complète

### 4.1 Table `webhooks`

```sql
create table webhooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  name text not null,
  url text not null,
  secret text not null,  -- whsec_xxx pour signature HMAC
  events text[] not null,  -- ['project.created', 'risk.escalated']
  is_active boolean default true,
  retry_count int default 3,
  timeout_seconds int default 10,
  created_by uuid references profiles(id),
  last_triggered_at timestamptz
);
```

---

### 4.2 Table `webhook_logs`

```sql
create table webhook_logs (
  id uuid primary key default gen_random_uuid(),
  webhook_id uuid references webhooks(id),
  organization_id uuid references organizations(id),
  event_type text not null,
  payload jsonb not null,
  status_code int,  -- 200, 404, 500, etc.
  response_body text,
  error_message text,
  duration_ms int,
  retry_attempt int default 0,  -- 0, 1, 2, 3
  created_at timestamptz default now()
);
```

**Utilité**:
- ✅ **Audit complet** des webhooks déclenchés
- ✅ **Retry logic** (jusqu'à 3 tentatives)
- ✅ **Debugging** (voir payloads et réponses)
- ✅ **Performance** (duration_ms)

---

### 4.3 Événements disponibles (d'après la page)

| Événement | Catégorie | Description |
|-----------|-----------|-------------|
| `project.created` | project | Nouveau projet créé |
| `project.updated` | project | Projet mis à jour |
| `project.deleted` | project | Projet supprimé |
| `project.status_changed` | project | Statut RAG changé (GREEN/YELLOW/RED) |
| `risk.created` | risk | Nouveau risque créé |
| `risk.escalated` | risk | Risque escaladé (severity high/critical) |
| `risk.resolved` | risk | Risque résolu |
| `decision.created` | decision | Nouvelle décision créée |
| `decision.approved` | decision | Décision approuvée |
| `decision.rejected` | decision | Décision rejetée |
| `report.generated` | report | Rapport généré (IA ou manuel) |
| `resource.overallocated` | resource | Ressource sur-allouée (>100% FTE) |
| `sprint.completed` | agile | Sprint terminé |
| `sprint.velocity_drop` | agile | Vélocité sprint -20% vs moyenne |

---

### 4.4 Payload standardisé

**Exemple `risk.escalated`**:
```json
{
  "event": "risk.escalated",
  "timestamp": "2026-02-02T15:00:00Z",
  "organization_id": "org_abc123",
  "data": {
    "id": "risk_xyz",
    "title": "Dépassement budget",
    "description": "Budget dépassé de 22%",
    "severity": "high",
    "probability": 80,
    "impact": 90,
    "project_id": "prj_abc123",
    "project_name": "Transformation Digitale"
  }
}
```

**Signature HMAC** (header `X-Powalyze-Signature`):
```
sha256=abc123def456...
```

**Validation côté client**:
```typescript
const signature = request.headers['x-powalyze-signature'];
const payload = request.body;
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(payload)
  .digest('hex');

if (signature !== `sha256=${expectedSignature}`) {
  return res.status(401).send('Invalid signature');
}
```

---

## 5. Exemple d'automatisation (officiel)

### 5.1 Cas d'usage: Jira Integration

**Objectif**: Créer automatiquement un ticket Jira quand un risque devient critique

**Endpoint côté client**:
```typescript
// server.ts (Node.js)
app.post("/webhook/powalyze", async (req, res) => {
  const { event, data } = req.body;

  if (event === "risk.escalated") {
    // Créer un ticket Jira
    await jira.createIssue({
      fields: {
        project: { key: "PMO" },
        summary: data.title,
        description: data.description,
        priority: { name: data.severity === 'critical' ? 'Highest' : 'High' },
        labels: ['powalyze', 'risk', data.project_id]
      }
    });
  }

  res.status(200).send("OK");
});
```

---

### 5.2 Cas d'usage: Slack Notifications

**Objectif**: Notifier Slack quand un projet passe en RED

```typescript
app.post("/webhook/powalyze", async (req, res) => {
  const { event, data } = req.body;

  if (event === "project.status_changed" && data.rag_status === "RED") {
    // Envoyer notification Slack
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 ALERTE: Le projet "${data.name}" est passé en statut RED`,
        blocks: [
          {
            type: "section",
            text: { type: "mrkdwn", text: `*Projet:* ${data.name}\n*Statut:* 🔴 RED\n*Budget:* ${data.budget_consumed_pct}% consommé` }
          }
        ]
      })
    });
  }

  res.status(200).send("OK");
});
```

---

### 5.3 Cas d'usage: Azure DevOps Integration

**Objectif**: Créer un work item quand une décision est approuvée

```typescript
app.post("/webhook/powalyze", async (req, res) => {
  const { event, data } = req.body;

  if (event === "decision.approved") {
    await azureDevOps.createWorkItem({
      type: 'Task',
      title: `[Powalyze] ${data.title}`,
      description: data.description,
      assignedTo: data.decision_maker,
      tags: ['powalyze', 'decision']
    });
  }

  res.status(200).send("OK");
});
```

---

## 6. Endpoints principaux (officiels)

### 6.1 Structure API Powalyze

```
/v1/projects              # Projets
/v1/risks                 # Risques
/v1/decisions             # Décisions
/v1/reports               # Rapports
/v1/webhooks              # Gestion webhooks
/v1/metrics               # Métriques agrégées
/v1/resources             # Ressources (FTE)
/v1/sprints               # Sprints (Agile)
```

---

### 6.2 Endpoints détaillés

#### **Projects**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/v1/projects` | Liste tous les projets |
| GET | `/v1/projects/:id` | Détail d'un projet |
| POST | `/v1/projects` | Créer un projet |
| PUT | `/v1/projects/:id` | Mettre à jour un projet |
| DELETE | `/v1/projects/:id` | Supprimer un projet |

**Exemple POST** `/v1/projects`:
```json
{
  "name": "Nouveau projet API",
  "description": "Créé via API",
  "status": "planned",
  "rag_status": "GREEN",
  "budget": 100000,
  "start_date": "2026-03-01",
  "end_date": "2026-12-31"
}
```

---

#### **Risks**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/v1/risks` | Liste tous les risques |
| GET | `/v1/risks/:id` | Détail d'un risque |
| POST | `/v1/risks` | Créer un risque |
| PUT | `/v1/risks/:id` | Mettre à jour un risque |
| PUT | `/v1/risks/:id/resolve` | Marquer comme résolu |

**Exemple POST** `/v1/risks`:
```json
{
  "project_id": "prj_abc123",
  "title": "Retard livraison",
  "description": "Risque de retard de 2 semaines",
  "severity": "high",
  "probability": 75,
  "impact": 80,
  "mitigation": "Ajouter 1 développeur"
}
```

---

#### **Reports**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/v1/reports` | Liste tous les rapports |
| POST | `/v1/reports/generate` | Générer un rapport IA |
| GET | `/v1/reports/:id` | Récupérer un rapport |
| GET | `/v1/reports/:id/download` | Télécharger PDF/Word |

**Exemple POST** `/v1/reports/generate`:
```json
{
  "type": "executive",
  "project_ids": ["prj_abc123", "prj_def456"],
  "include_risks": true,
  "include_decisions": true,
  "format": "markdown"
}
```

**Réponse**:
```json
{
  "data": {
    "id": "report_xyz",
    "type": "executive",
    "content": "# Rapport Exécutif\n\n## Résumé...",
    "generated_at": "2026-02-02T15:00:00Z",
    "duration_ms": 3200
  }
}
```

---

## 7. Mode Demo vs Pro

| Fonction | Demo | Pro |
|----------|------|-----|
| **API Keys** | ❌ Désactivé | ✔ Complet |
| **Webhooks** | ❌ Désactivé | ✔ Complet |
| **Endpoints** | Lecture seule (mock) | Lecture + écriture |
| **Rate limit** | N/A | 1000 req/h (configurable) |
| **Rapports IA via API** | Exemple statique | Réel (GPT-4) |
| **Intégrations Jira/DevOps** | ❌ | ✔ |
| **Logs API** | ❌ | ✔ (30 jours) |
| **Support API** | Community | Prioritaire |

---

## 8. Pages UI créées

### 8.1 `/cockpit/parametres/api`

**Fonctionnalités**:
- ✅ Liste des clés API
- ✅ Créer une nouvelle clé (nom + permissions)
- ✅ Afficher le token **une seule fois** (one-time view)
- ✅ Copier le token dans le presse-papiers
- ✅ Supprimer une clé
- ✅ Voir statistiques d'utilisation (last_used_at, usage_count)
- ✅ Documentation API intégrée (curl examples)

**Composants**:
- Token viewer (one-time display avec alerte verte)
- API key cards (nom, permissions badges, statistiques)
- Create modal (nom + checkboxes permissions)
- Documentation section (curl + endpoints)

**Blocage Demo**:
```tsx
if (isDemo) {
  return (
    <Card>
      <AlertCircle />
      <h3>Fonctionnalité Pro</h3>
      <p>Les clés API sont disponibles uniquement dans les plans Pro et Enterprise.</p>
      <Button onClick={() => window.location.href = '/pricing'}>
        Passer en Pro
      </Button>
    </Card>
  );
}
```

---

### 8.2 `/cockpit/parametres/webhooks`

**Fonctionnalités**:
- ✅ Liste des webhooks configurés
- ✅ Créer un webhook (nom + URL + événements)
- ✅ Statistiques globales (total déclenchements, succès, échecs, taux de succès)
- ✅ Activer/désactiver un webhook
- ✅ Supprimer un webhook
- ✅ Voir les logs récents (10 derniers déclenchements)
- ✅ Exemple de payload webhook

**Composants**:
- Stats cards (total, succès, échecs, taux de succès)
- Webhook cards (nom, URL, événements badges, statut actif/inactif)
- Create modal (nom + URL + checkboxes événements)
- Logs viewer (event_type, status_code, duration_ms)
- Documentation section (payload example + retry logic)

**Blocage Demo**: Identique à la page API

---

## 9. UX Premium

### 9.1 Design System

**Couleurs**:
- Success: `bg-green-500` (webhooks actifs, clés actives)
- Warning: `bg-orange-500` (rate limit proche)
- Error: `bg-red-500` (webhooks échecs, clés expirées)
- Muted: `bg-muted/50` (documentation sections)

**Icônes** (Lucide):
- `Key` → API keys
- `Webhook` → Webhooks
- `Copy` → Copier token
- `Trash2` → Supprimer
- `Plus` → Créer
- `Activity` → Statistiques
- `CheckCircle` → Succès
- `XCircle` → Échecs

---

### 9.2 Animations

**Token one-time display**:
```tsx
<Card className="border-2 border-green-500/20 bg-green-500/5">
  <div className="flex items-start gap-4">
    <Key className="h-6 w-6 text-green-500 animate-pulse" />
    <div>
      <h3>Clé API créée avec succès</h3>
      <p>Copiez cette clé maintenant. Elle ne sera plus jamais affichée.</p>
      <Input value={generatedToken} readOnly className="font-mono" />
      <Button onClick={() => copyToClipboard(generatedToken)}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  </div>
</Card>
```

**Toast notifications**:
```tsx
toast({
  title: 'Clé API créée',
  description: 'Copiez votre clé maintenant, elle ne sera plus affichée.',
  duration: 10000  // 10 secondes
});
```

---

## 10. IA — Automatisations intelligentes

### 10.1 IA peut générer des workflows

**Exemple**:
> **User**: "Je veux créer un ticket Jira automatiquement quand un risque est escaladé"
>
> **IA**: 
> ```typescript
> // 1. Créer un webhook dans Powalyze
> // URL: https://your-domain.com/webhook/powalyze
> // Événements: risk.escalated
> 
> // 2. Code de votre endpoint
> app.post("/webhook/powalyze", async (req, res) => {
>   const { event, data } = req.body;
>   if (event === "risk.escalated") {
>     await jira.createIssue({
>       fields: {
>         project: { key: "PMO" },
>         summary: data.title,
>         priority: { name: "High" }
>       }
>     });
>   }
>   res.status(200).send("OK");
> });
> ```

---

### 10.2 IA recommande des webhooks

**Exemple**:
> "Je détecte que 3 risques critiques ont été escaladés cette semaine.  
> Je recommande de créer un webhook Slack pour notifier le PMO immédiatement."

**IA génère le code**:
```typescript
// Webhook Slack pour risques critiques
const slackWebhook = {
  name: "Alertes risques critiques",
  url: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
  events: ["risk.escalated"],
  filter: (data) => data.severity === "critical"
};
```

---

### 10.3 IA détecte des patterns d'événements

**Exemple**:
> "J'ai détecté un pattern: Chaque fois qu'un projet passe en RED, 2 risques sont créés dans les 48h suivantes.  
> Je recommande de créer un webhook pour notifier le PMO **avant** que le projet ne passe en RED."

**IA propose un événement prédictif**:
```json
{
  "event": "project.risk_prediction",
  "timestamp": "2026-02-02T15:00:00Z",
  "data": {
    "project_id": "prj_abc123",
    "predicted_status": "RED",
    "probability": 85,
    "factors": ["budget_overrun", "velocity_drop", "dependencies_blocked"]
  }
}
```

---

## 11. Fonctions RPC créées

### 11.1 `trigger_webhook()`

**Signature**:
```sql
create or replace function trigger_webhook(
  p_organization_id uuid,
  p_event_type text,
  p_payload jsonb
)
returns void
```

**Utilisation**:
```sql
-- Déclencher tous les webhooks abonnés à 'risk.escalated'
select trigger_webhook(
  'org_abc123',
  'risk.escalated',
  '{"risk": {"id": "risk_xyz", "title": "Budget overrun"}}'::jsonb
);
```

**Comportement**:
- ✅ Insère un log dans `webhook_logs` (sera traité par worker async)
- ✅ Update `last_triggered_at` du webhook
- ✅ Ne bloque pas l'exécution (async)

---

### 11.2 `get_api_usage_stats()`

**Signature**:
```sql
create or replace function get_api_usage_stats(
  p_organization_id uuid,
  p_period_days int default 30
)
returns jsonb
```

**Retour**:
```json
{
  "total_requests": 1245,
  "successful_requests": 1198,
  "failed_requests": 47,
  "success_rate": 96.2,
  "avg_duration_ms": 234.5,
  "top_endpoints": [
    { "endpoint": "/v1/projects", "requests": 456 },
    { "endpoint": "/v1/risks", "requests": 234 }
  ],
  "period_days": 30
}
```

---

### 11.3 `get_webhook_stats()`

**Signature**:
```sql
create or replace function get_webhook_stats(
  p_organization_id uuid,
  p_webhook_id uuid default null,
  p_period_days int default 30
)
returns jsonb
```

**Retour**:
```json
{
  "total_triggers": 567,
  "successful_triggers": 543,
  "failed_triggers": 24,
  "success_rate": 95.8,
  "avg_duration_ms": 187.3,
  "recent_logs": [
    {
      "id": "log_abc",
      "event_type": "risk.escalated",
      "status_code": 200,
      "duration_ms": 145,
      "created_at": "2026-02-02T15:00:00Z"
    }
  ],
  "period_days": 30
}
```

---

### 11.4 `validate_api_key()`

**Signature**:
```sql
create or replace function validate_api_key(
  p_token_hash text,
  p_required_permission text default 'read'
)
returns table(
  valid boolean,
  organization_id uuid,
  permissions text[]
)
```

**Utilisation**:
```sql
select * from validate_api_key(
  'sha256_hash_of_token',
  'write'
);
```

**Retour**:
```
| valid | organization_id | permissions |
|-------|-----------------|-------------|
| true  | org_abc123      | {read,write}|
```

**Validations**:
- ✅ API key existe
- ✅ API key active (`is_active = true`)
- ✅ Pas expirée (`expires_at > now()`)
- ✅ Plan != demo
- ✅ Permission requise présente

---

## 12. Rate Limiting

### 12.1 Stratégie

**Par défaut**:
- 1000 requêtes par heure par clé API
- Configurable par clé (`rate_limit` + `rate_window`)

**Headers de réponse**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 743
X-RateLimit-Reset: 1706889600
```

**Erreur 429** (Too Many Requests):
```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "You have exceeded the rate limit of 1000 requests per hour."
  }
}
```

---

### 12.2 Implémentation

**Middleware API** (Edge Runtime):
```typescript
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();

function checkRateLimit(apiKeyId: string, limit: number = 1000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(apiKeyId) || { count: 0, resetAt: now + 3600000 };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + 3600000;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  rateLimitMap.set(apiKeyId, entry);
  return true;
}
```

---

## 13. Retry Logic (Webhooks)

### 13.1 Stratégie

**Par défaut**:
- **3 tentatives** maximum
- **Backoff exponentiel**: 1s, 2s, 4s
- **Timeout**: 10 secondes par tentative

**Conditions de retry**:
- Status code 5xx (erreur serveur)
- Timeout
- Network error

**Pas de retry**:
- Status code 2xx (succès)
- Status code 4xx (erreur client → problème de configuration)

---

### 13.2 Implémentation

**Worker async** (traite `webhook_logs` avec `retry_attempt < 3`):
```typescript
async function processWebhookLog(log: WebhookLog) {
  try {
    const response = await fetch(log.webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Powalyze-Signature': generateSignature(log.payload, log.webhook.secret)
      },
      body: JSON.stringify(log.payload),
      signal: AbortSignal.timeout(10000)  // 10s timeout
    });

    // Update log
    await supabase
      .from('webhook_logs')
      .update({
        status_code: response.status,
        response_body: await response.text(),
        duration_ms: Date.now() - startTime
      })
      .eq('id', log.id);

    // Retry si 5xx
    if (response.status >= 500 && log.retry_attempt < 3) {
      await scheduleRetry(log, log.retry_attempt + 1);
    }
  } catch (error) {
    // Retry si timeout/network error
    if (log.retry_attempt < 3) {
      await scheduleRetry(log, log.retry_attempt + 1);
    }
  }
}
```

---

## 14. Exemples d'intégrations prêtes à l'emploi

### 14.1 Jira

**Webhook Powalyze** → **Jira API**

```typescript
// risk.escalated → Jira Issue
app.post("/webhook/powalyze-to-jira", async (req, res) => {
  const { event, data } = req.body;

  if (event === "risk.escalated") {
    await jira.issues.createIssue({
      fields: {
        project: { key: process.env.JIRA_PROJECT_KEY },
        summary: `[Powalyze] ${data.title}`,
        description: data.description,
        issuetype: { name: 'Bug' },
        priority: { name: data.severity === 'critical' ? 'Highest' : 'High' },
        labels: ['powalyze', 'risk', data.project_id]
      }
    });
  }

  res.status(200).send("OK");
});
```

---

### 14.2 Slack

**Webhook Powalyze** → **Slack Incoming Webhook**

```typescript
// project.status_changed → Slack notification
app.post("/webhook/powalyze-to-slack", async (req, res) => {
  const { event, data } = req.body;

  if (event === "project.status_changed") {
    const emoji = data.rag_status === 'RED' ? '🔴' : data.rag_status === 'YELLOW' ? '🟡' : '🟢';
    
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${emoji} Projet "${data.name}" → ${data.rag_status}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Projet:* ${data.name}\n*Statut:* ${emoji} ${data.rag_status}\n*Progress:* ${data.progress}%\n*Budget:* ${data.budget_consumed_pct}% consommé`
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Voir le projet" },
                url: `https://app.powalyze.com/cockpit/projets/${data.id}`
              }
            ]
          }
        ]
      })
    });
  }

  res.status(200).send("OK");
});
```

---

### 14.3 Power BI

**API Powalyze** → **Power BI Dataset**

```python
# refresh_powerbi_dataset.py
import requests
from azure.identity import ClientSecretCredential

# Auth Power BI
credential = ClientSecretCredential(
    tenant_id=os.getenv("AZURE_TENANT_ID"),
    client_id=os.getenv("AZURE_CLIENT_ID"),
    client_secret=os.getenv("AZURE_CLIENT_SECRET")
)
token = credential.get_token("https://analysis.windows.net/powerbi/api/.default")

# Get data from Powalyze API
response = requests.get(
    "https://api.powalyze.com/v1/projects",
    headers={"Authorization": f"Bearer {os.getenv('POWALYZE_API_KEY')}"}
)
projects = response.json()['data']

# Push to Power BI
powerbi_response = requests.post(
    f"https://api.powerbi.com/v1.0/myorg/datasets/{dataset_id}/tables/{table_name}/rows",
    headers={
        "Authorization": f"Bearer {token.token}",
        "Content-Type": "application/json"
    },
    json={"rows": projects}
)
```

---

## 15. Prochaines étapes

### Phase 1: Core API (Complété ✅)
- [x] Schema SQL (api_keys, webhooks, webhook_logs, api_usage_logs)
- [x] RPC functions (trigger_webhook, get_api_usage_stats, get_webhook_stats, validate_api_key)
- [x] Endpoints API (/v1/projects, /v1/risks)
- [x] Pages UI (/parametres/api, /parametres/webhooks)

### Phase 2: Endpoints supplémentaires
- [ ] `/v1/decisions` (GET, POST, PUT)
- [ ] `/v1/reports/generate` (POST)
- [ ] `/v1/resources` (GET, POST, PUT)
- [ ] `/v1/sprints` (GET, POST, PUT)
- [ ] `/v1/metrics` (GET)

### Phase 3: Worker async
- [ ] Traiter webhook_logs (retry logic)
- [ ] Rate limiting distribué (Redis)
- [ ] Monitoring Sentry

### Phase 4: Intégrations préconfigurées
- [ ] Jira connector (UI + API)
- [ ] Slack connector (UI + API)
- [ ] Azure DevOps connector (UI + API)
- [ ] Zapier integration
- [ ] Make.com integration

---

## 16. Checklist de déploiement

- [x] Schema SQL créé (`schema-api-webhooks.sql`)
- [x] Page API Keys créée (`/cockpit/parametres/api`)
- [x] Page Webhooks créée (`/cockpit/parametres/webhooks`)
- [ ] Appliquer schema SQL à Supabase
- [ ] Tester création clé API
- [ ] Tester appel API `/v1/projects`
- [ ] Tester création webhook
- [ ] Tester déclenchement webhook
- [ ] Documenter dans README.md
- [ ] Ajouter lien dans navigation (`/cockpit/parametres`)

---

## ✅ Résumé

Le module **API & Webhooks** est maintenant **prêt pour déploiement**:

1. ✅ **Schema SQL complet** (500+ lignes, 4 tables, 4 RPC functions)
2. ✅ **Pages UI Premium** (API Keys + Webhooks avec stats)
3. ✅ **Mode Demo blocage** (redirection vers pricing)
4. ✅ **Sécurité** (token hash SHA-256, RLS, rate limiting)
5. ✅ **Documentation** (14 événements, exemples curl/JS/Python, intégrations)
6. ✅ **IA recommendations** (workflows auto, patterns detection)

**Prochaine action**: Appliquer le schema SQL à Supabase et tester les endpoints.

---

**Dernière mise à jour**: 2 février 2026  
**Version**: 1.0  
**Auteur**: Équipe Powalyze
