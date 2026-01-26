# 🔐 SÉCURITÉ DES RÔLES EN PRODUCTION - POWALYZE

**Document de référence pour la sécurisation du système de rôles DEMO/PRO/ADMIN**

Date: 26 janvier 2026  
Version: 1.0  
Auteur: DevOps Powalyze

---

## 📋 Table des matières

1. [Architecture de sécurité](#architecture)
2. [Variables d'environnement](#variables)
3. [Row Level Security (RLS)](#rls)
4. [Guards applicatifs](#guards)
5. [Monitoring et alerting](#monitoring)
6. [Procédures d'urgence](#urgence)

---

## 1. Architecture de sécurité {#architecture}

### 1.1 Principe de défense en profondeur

Powalyze implémente **3 couches de sécurité** :

```
┌─────────────────────────────────────────┐
│  COUCHE 1: Guards Applicatifs (Next.js) │
│  → Vérifie le rôle avant le rendu       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  COUCHE 2: API Routes (Server Actions)  │
│  → Vérifie les permissions côté serveur │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  COUCHE 3: Row Level Security (Supabase)│
│  → Filtre les données au niveau DB      │
└─────────────────────────────────────────┘
```

### 1.2 Séparation des environnements

**Environnement DEMO** :
- Tables préfixées `demo_*` (demo_projects, demo_risks, demo_decisions)
- Utilisateurs avec `role = 'demo'`
- Accès: `/cockpit-demo`
- Données isolées, non persistantes en production

**Environnement PRO** :
- Tables réelles (projects, risks, decisions, resources, etc.)
- Utilisateurs avec `role = 'pro'` ou `role = 'admin'`
- Accès: `/cockpit`
- Données production, sécurisées par RLS

---

## 2. Variables d'environnement {#variables}

### 2.1 Clés Supabase

#### ✅ Variables publiques (client-side)

```env
# .env.local (SAFE pour client)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Sécurité** : Ces clés sont PUBLIQUES et limitées par RLS. Aucune donnée sensible accessible sans authentification.

#### ❌ Variables privées (server-side ONLY)

```env
# .env.local (SERVER ONLY - JAMAIS exposé au client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ CRITIQUE** : Cette clé **BYPASS toutes les RLS policies**. Elle doit :
- ✅ Être utilisée UNIQUEMENT côté serveur
- ✅ Ne JAMAIS être exposée dans le code client
- ✅ Ne JAMAIS être loggée
- ✅ Être rotée tous les 90 jours minimum

### 2.2 Validation de la séparation client/serveur

**Check automatique** :

```bash
# Rechercher les usages de SERVICE_ROLE_KEY
grep -r "SUPABASE_SERVICE_ROLE_KEY" app/ components/ lib/

# Résultat attendu: 0 occurrences dans app/, components/
# Résultat autorisé: UNIQUEMENT dans lib/supabase-admin.ts ou Server Actions
```

### 2.3 Configuration par environnement

| Environnement | SUPABASE_URL | Rotation | Backup |
|---------------|--------------|----------|--------|
| **DEV** | Local ou staging | Manuel | Non |
| **STAGING** | Staging distinct | 90 jours | Oui |
| **PROD** | Production | 60 jours | Oui + alertes |

---

## 3. Row Level Security (RLS) {#rls}

### 3.1 Policies profiles

```sql
-- Utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Utilisateurs NE PEUVENT PAS changer leur propre rôle
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND role = (SELECT role FROM profiles WHERE user_id = auth.uid()));

-- Seuls les admins peuvent modifier les rôles
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
```

### 3.2 Policies tables DEMO

```sql
-- DEMO users peuvent uniquement accéder aux tables demo_*
CREATE POLICY "Demo users can manage own demo projects"
  ON demo_projects FOR ALL
  USING (
    user_id = auth.uid() 
    AND EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'demo')
  );
```

### 3.3 Policies tables PRO

```sql
-- PRO users peuvent uniquement accéder aux tables réelles
CREATE POLICY "Pro users can manage own org projects"
  ON projects FOR ALL
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('pro', 'admin'))
  );
```

### 3.4 Tests RLS

**Test 1: Utilisateur DEMO ne peut pas lire tables PRO**

```sql
-- En tant qu'utilisateur demo
SELECT * FROM projects; -- RÉSULTAT ATTENDU: 0 rows
SELECT * FROM demo_projects; -- RÉSULTAT ATTENDU: Ses projets demo uniquement
```

**Test 2: Utilisateur PRO ne peut pas lire tables DEMO**

```sql
-- En tant qu'utilisateur pro
SELECT * FROM demo_projects; -- RÉSULTAT ATTENDU: 0 rows
SELECT * FROM projects; -- RÉSULTAT ATTENDU: Projets de son organisation uniquement
```

---

## 4. Guards applicatifs {#guards}

### 4.1 Guard DEMO (`guardDemo()`)

**Fichier** : `lib/guards.ts`

```typescript
export async function guardDemo(): Promise<void> {
  const role = await getUserRole();
  
  if (!role) {
    redirect('/login?redirect=/cockpit-demo');
  }

  if (role !== 'demo') {
    console.warn(`[GUARD DEMO] Accès refusé - rôle: ${role}`);
    logUnauthorizedAccess('/cockpit-demo', 'demo', role);
    redirect(role === 'pro' ? '/cockpit' : '/');
  }
}
```

**Usage** :

```typescript
// app/cockpit-demo/page.tsx
import { guardDemo } from '@/lib/guards';

export default async function CockpitDemoPage() {
  await guardDemo(); // ← Bloque si role !== 'demo'
  // ...reste du code
}
```

### 4.2 Guard PRO (`guardPro()`)

```typescript
export async function guardPro(): Promise<void> {
  const role = await getUserRole();
  
  if (!role) {
    redirect('/login?redirect=/cockpit');
  }

  if (role !== 'pro' && role !== 'admin') {
    console.warn(`[GUARD PRO] Accès refusé - rôle: ${role}`);
    logUnauthorizedAccess('/cockpit', 'pro', role);
    redirect(role === 'demo' ? '/cockpit-demo' : '/');
  }
}
```

### 4.3 Guard ADMIN (`guardAdmin()`)

```typescript
export async function guardAdmin(): Promise<void> {
  const role = await getUserRole();
  
  if (role !== 'admin') {
    console.warn(`[GUARD ADMIN] Accès refusé - rôle: ${role}`);
    redirect('/');
  }
}
```

---

## 5. Monitoring et alerting {#monitoring}

### 5.1 Logs de sécurité

**Événements à logger** :

```typescript
interface SecurityLog {
  timestamp: string;
  event: 'unauthorized_access_attempt' | 'role_change' | 'rls_violation';
  path: string;
  expected_role: string;
  actual_role: string | null;
  user_id: string;
  severity: 'info' | 'warning' | 'critical';
}
```

### 5.2 Alertes temps réel

**Canaux de notification** :

1. **Slack** : Alertes critiques (tentatives d'escalade de privilèges)
2. **Email** : Résumé quotidien des accès refusés
3. **Sentry** : Tracking des erreurs RLS

**Exemple d'alerte critique** :

```
🚨 ALERTE SÉCURITÉ - POWALYZE PROD

Événement: Tentative d'accès non autorisé
Chemin: /admin/users
Rôle attendu: admin
Rôle actuel: demo
Utilisateur: user@example.com (ID: abc123)
Timestamp: 2026-01-26 14:32:15 UTC

Action recommandée: Vérifier l'activité de cet utilisateur
```

### 5.3 Métriques de sécurité

**Dashboard à monitorer** :

- ✅ Nombre de tentatives d'accès refusées (par rôle, par jour)
- ✅ Nombre de violations RLS (si > 0, alerte critique)
- ✅ Temps de réponse des guards (< 100ms)
- ✅ Nombre de changements de rôle (audit trail)

---

## 6. Procédures d'urgence {#urgence}

### 6.1 Fuite de SUPABASE_SERVICE_ROLE_KEY

**Actions immédiates** (dans l'ordre) :

1. ⏱️ **0-5 min** : Révoquer la clé dans Supabase Dashboard
   ```
   Project Settings → API → Regenerate service_role key
   ```

2. ⏱️ **5-10 min** : Mettre à jour la variable dans Vercel/Hébergement
   ```bash
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   ```

3. ⏱️ **10-15 min** : Redéployer l'application
   ```bash
   vercel --prod --yes
   ```

4. ⏱️ **15-30 min** : Auditer les logs Supabase
   - Vérifier les accès suspects pendant la fenêtre de fuite
   - Identifier les données potentiellement compromises

5. ⏱️ **30-60 min** : Communication
   - Notifier l'équipe sécurité
   - Post-mortem incident

### 6.2 Escalade de privilèges détectée

**Si un utilisateur DEMO accède au PRO** :

1. Bloquer immédiatement l'utilisateur
   ```sql
   UPDATE profiles SET role = NULL WHERE user_id = 'xxx';
   ```

2. Auditer ses actions
   ```sql
   SELECT * FROM audit_logs WHERE user_id = 'xxx' ORDER BY created_at DESC LIMIT 100;
   ```

3. Vérifier l'intégrité des données

4. Notifier l'équipe sécurité + client si nécessaire

### 6.3 Contact d'urgence

| Incident | Contact | Délai de réponse |
|----------|---------|------------------|
| **Fuite clé API** | security@powalyze.com | < 15 min |
| **RLS violation** | devops@powalyze.com | < 30 min |
| **Accès non autorisé** | admin@powalyze.com | < 1h |

---

## ✅ Checklist de validation

Avant chaque déploiement production :

- [ ] RLS activé sur TOUTES les tables
- [ ] SERVICE_ROLE_KEY utilisée UNIQUEMENT côté serveur
- [ ] Guards présents sur toutes les routes protégées
- [ ] Tests de sécurité passés (demo/pro isolation)
- [ ] Monitoring et alerting configurés
- [ ] Documentation à jour
- [ ] Backup des clés en coffre-fort (1Password/Vault)
- [ ] Rotation des clés planifiée (tous les 60 jours)

---

## 📝 Historique des modifications

| Date | Version | Changements |
|------|---------|-------------|
| 2026-01-26 | 1.0 | Document initial - Sécurisation rôles DEMO/PRO |

---

**Document classifié : INTERNE - Ne pas diffuser publiquement**
