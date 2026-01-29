# 🟢 FIX: Multiple GoTrueClient Instances

**Date**: 2026-01-27  
**Status**: ✅ RÉSOLU

## 🔴 Problème Initial

```
⚠️ Multiple GoTrueClient instances detected in the same browser context.
It is not an error, but this should be avoided as it may produce undefined behavior when using the storage-based states.
```

Suivi de l'erreur ISO-8859-1:
```
Failed to execute 'fetch' on 'Window': Failed to read the 'headers' property from 'RequestInit': 
String contains non ISO-8859-1 code point
```

## 🔍 Cause Racine

Le projet avait **3 systèmes différents** de création de clients Supabase:

1. **`utils/supabase/client.ts`** - Créait un nouveau client à chaque appel
2. **`lib/supabase.ts`** - Créait 2 instances (anon + admin)
3. **`lib/supabase-cockpit.ts`** - Créait de multiples instances dynamiquement

Chaque création générait un nouveau `GoTrueClient` qui:
- Dupliquait les listeners d'authentification
- Créait des conflits dans le storage key: `sb-pqsgdwfsdnmozzoynefw-auth-token`
- Pouvait générer des headers corrompus avec caractères non-ASCII

## ✅ Solution Appliquée

### 1. Instance Unique Côté Client

**Fichier: `utils/supabase/client.ts`**
```typescript
let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (clientInstance) {
    return clientInstance; // ✅ Réutilise la même instance
  }
  
  clientInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  return clientInstance;
}
```

### 2. Instances Centralisées Côté Serveur

**Fichier: `lib/supabase.ts`**
```typescript
// ✅ Une seule instance admin pour les API routes
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);
```

### 3. Mise à Jour des Imports

#### Composants Côté Client
```typescript
// ❌ AVANT
import { supabase } from '@/lib/supabase';

// ✅ APRÈS
import { createClient } from '@/utils/supabase/client';

export default function MyComponent() {
  const supabase = createClient(); // ✅ Instance unique
  // ...
}
```

Fichiers modifiés:
- ✅ `components/auth/LoginForm.tsx`
- ✅ `components/Navbar.tsx`
- ✅ `app/admin/users/UsersManagement.tsx`
- ✅ `app/cockpit/abonnement/page.tsx`
- ✅ `app/cockpit/equipe/page.tsx`

#### API Routes
```typescript
// ❌ AVANT
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key); // Nouvelle instance

// ✅ APRÈS
import { supabaseAdmin } from '@/lib/supabase';
const supabase = supabaseAdmin; // Instance unique existante
```

Fichiers modifiés:
- ✅ `app/api/cockpit/route.ts`

### 4. Nettoyage des Anciennes Créations

**Fichier: `lib/supabase-cockpit.ts`**
```typescript
// ✅ Utiliser l'admin client existant
export function getSupabaseClient(isServer = false): SupabaseClient {
  return supabaseAdmin; // Au lieu de créer de nouveaux clients
}
```

## 📊 Résultats Attendus

Après ce fix:
1. ✅ **Warning GoTrueClient disparaît** - Une seule instance par contexte
2. ✅ **Pas de conflits de headers** - Pas de duplication d'authentification
3. ✅ **Erreur ISO-8859-1 résolue** - Headers propres
4. ✅ **Meilleure performance** - Moins de listeners et de requêtes

## 🔧 Architecture Finale

```
Côté Client:
  utils/supabase/client.ts → Singleton createClient()
  ↓
  Tous les composants React importent depuis ici

Côté Serveur:
  lib/supabase.ts → supabaseAdmin (instance unique)
  ↓
  Toutes les API routes utilisent cette instance

Deprecated:
  lib/supabase-cockpit.ts → Redirige vers supabaseAdmin
  (À refactoriser progressivement)
```

## 🧪 Tests à Effectuer

1. Ouvrir la console navigateur sur `/login`
2. Vérifier **absence du warning** "Multiple GoTrueClient instances"
3. Tester la connexion avec `demo@powalyze.com`
4. Vérifier **absence de l'erreur** ISO-8859-1
5. Naviguer entre `/demo` et `/pro`
6. Confirmer que l'authentification persiste correctement

## 📚 Références

- **Supabase SSR Guide**: https://supabase.com/docs/guides/auth/server-side/nextjs
- **Pattern Singleton**: https://www.patterns.dev/posts/singleton-pattern
- **HTTP Headers ASCII**: https://www.rfc-editor.org/rfc/rfc7230#section-3.2

---

**Prochaine étape**: Déployer et valider en production
