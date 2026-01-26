# 🔒 SÉCURITÉ POWALYZE

## 🚨 RÈGLES CRITIQUES

### ❌ SUPABASE_SERVICE_ROLE_KEY
**CETTE CLÉ NE DOIT JAMAIS ÊTRE EXPOSÉE CÔTÉ CLIENT**

```env
# ❌ INTERDIT: Ne jamais mettre dans .env.local (accessible côté client)
SUPABASE_SERVICE_ROLE_KEY=xxx

# ✅ CORRECT: Uniquement dans variables Vercel (serveur uniquement)
# Vercel Dashboard → Settings → Environment Variables → Production
```

### ✅ Variables Côté Serveur Uniquement
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ✅ CORRECT: SERVICE_ROLE_KEY utilisée uniquement dans supabaseAdmin
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ← Serveur uniquement
  { auth: { persistSession: false } }
);
```

### ✅ Variables Côté Client (NEXT_PUBLIC_*)
```env
# ✅ OK: Ces clés peuvent être exposées côté client
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# ❌ INTERDIT: Jamais de SERVICE_ROLE_KEY côté client
# SUPABASE_SERVICE_ROLE_KEY=xxx  ← NE DOIT PAS ÊTRE LÀ
```

## 🔐 Architecture Sécurisée

### Côté Client (Browser)
```typescript
// utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ← ANON_KEY uniquement
  );
}
```

### Côté Serveur (API Routes / Server Actions)
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ← SERVICE_ROLE_KEY (admin)
  { auth: { persistSession: false } }
);
```

## ✅ Checklist Déploiement

### Vercel Production
1. **Variables d'environnement:**
   ```bash
   # Production UNIQUEMENT (pas dans .env.local)
   SUPABASE_SERVICE_ROLE_KEY=xxx
   OPENAI_API_KEY=sk-xxx
   JWT_SECRET=xxx
   ```

2. **Variables publiques (.env.local OK):**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. **Vérifier:**
   - [ ] SERVICE_ROLE_KEY n'est PAS dans .env.local
   - [ ] SERVICE_ROLE_KEY est dans Vercel → Settings → Environment Variables
   - [ ] Jamais d'import `supabaseAdmin` dans composants client
   - [ ] supabaseAdmin utilisé uniquement dans API routes et server actions

## 🛡️ Guards DEMO/PRO

### Protection Routes
```typescript
// app/cockpit/layout.tsx
import { guardProRoute } from '@/lib/guards';

export default async function CockpitLayout() {
  await guardProRoute(); // ← Redirige si mode DEMO
  // ...
}

// app/cockpit-demo/layout.tsx
import { guardDemoRoute } from '@/lib/guards';

export default async function CockpitDemoLayout() {
  await guardDemoRoute(); // ← Redirige si mode PRO
  // ...
}
```

### Protection Base de Données
```sql
-- RLS (Row Level Security) activé sur toutes les tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_projects ENABLE ROW LEVEL SECURITY;

-- Policies: utilisateurs accèdent uniquement à leurs données
CREATE POLICY "Users see own projects"
  ON projects FOR SELECT
  USING (user_id = auth.uid());
```

## 📋 Audit Sécurité

### Commandes Vérification
```bash
# Rechercher clés exposées
grep -r "SERVICE_ROLE_KEY" .env.local  # ← Doit retourner 0 résultats

# Rechercher imports dangereux côté client
grep -r "supabaseAdmin" "app/**/page.tsx"  # ← Doit retourner 0 résultats

# Vérifier guards actifs
grep -r "guardProRoute\|guardDemoRoute" "app/**/layout.tsx"  # ← Doit trouver 2+
```

### Red Flags 🚩
```typescript
// ❌ DANGER: supabaseAdmin dans un composant client
"use client";
import { supabaseAdmin } from '@/lib/supabase'; // ← INTERDIT

// ❌ DANGER: SERVICE_ROLE_KEY dans .env.local
SUPABASE_SERVICE_ROLE_KEY=xxx // ← Fichier accessible côté client

// ❌ DANGER: Pas de guards sur les layouts
export default function CockpitLayout() {
  // Pas de guardProRoute() ← Vulnérabilité
}
```

### Green Flags ✅
```typescript
// ✅ CORRECT: supabaseAdmin dans server action
"use server";
import { supabaseAdmin } from '@/lib/supabase';

// ✅ CORRECT: Guards actifs
export default async function CockpitLayout() {
  await guardProRoute(); // ← Protection active
}

// ✅ CORRECT: RLS activé
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```

## 🎯 Résumé

| Variable | .env.local | Vercel Prod | Utilisation |
|----------|-----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | Client + Serveur |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | Client + Serveur |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | ✅ | Serveur UNIQUEMENT |
| `OPENAI_API_KEY` | ✅ (dev) | ✅ | Serveur UNIQUEMENT |
| `JWT_SECRET` | ✅ (dev) | ✅ | Serveur UNIQUEMENT |

**Règle d'or:** Si une variable commence par `NEXT_PUBLIC_`, elle est publique. Sinon, elle est privée (serveur uniquement).
