# 🚨 HOTFIX — Headers Non-ASCII (Production)

**Date** : 29 janvier 2026  
**Priorité** : CRITIQUE P0  
**Statut** : ANALYSE + PATCH PRÉVENTIF

---

## 🔥 PROBLÈME

**Erreur production répétée** :
```
TypeError: Failed to execute 'set' on 'Headers': String contains non ISO-8859-1 code point.
```

**Cause probable** :
- Un header HTTP contient des caractères **non-ASCII** (accents, emojis, caractères spéciaux)
- `Headers.set()` n'accepte **que des caractères ISO-8859-1** (ASCII pur)

---

## 🔍 ANALYSE

### ✅ Vérifié (pas de problème détecté)

1. **middleware.ts** : Ne définit PAS de headers `x-tenant-id` ou `x-user-id` ✅
2. **API routes** : Lisent uniquement les headers, ne les définissent pas ✅
3. **Pas de `headers.set()` ou `new Headers()` trouvés dans le code custom** ✅

### ⚠️ Causes probables

#### 1. **Supabase Auth — Métadonnées utilisateur**
Le client Supabase (`createBrowserClient` ou `createServerClient`) peut ajouter automatiquement des headers avec :
- Nom d'utilisateur (peut contenir accents : "Fabrice Fäys")
- Email (généralement OK)
- Custom claims JWT avec caractères spéciaux

#### 2. **Next.js Server Actions**
Si des Server Actions passent du contexte avec accents dans headers

#### 3. **Fetch() calls avec headers custom**
Même si pas trouvés dans le code actuel, peuvent exister dans :
- Composants externes
- Libraries tierces
- Code généré dynamiquement

---

## 🛠️ PATCH PRÉVENTIF

### Solution 1 : Encoder les métadonnées Supabase

**Fichier** : `utils/supabase/client.ts` + `utils/supabase/server.ts`

Ajouter une fonction `encodeHeaderValue()` :

```typescript
/**
 * Encode une valeur pour header HTTP (ISO-8859-1 seulement)
 * @param value - Valeur à encoder
 * @returns Valeur encodée en base64url si non-ASCII, sinon valeur originale
 */
function encodeHeaderValue(value: string): string {
  // Vérifier si la valeur contient des caractères non-ASCII
  const isAscii = /^[\x00-\x7F]*$/.test(value);
  
  if (isAscii) {
    return value;
  }
  
  // Encoder en base64url (compatible headers)
  return btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Décoder une valeur de header HTTP
 */
function decodeHeaderValue(value: string): string {
  // Vérifier si la valeur est encodée (contient des caractères base64url)
  const isEncoded = /^[A-Za-z0-9_-]+$/.test(value);
  
  if (!isEncoded) {
    return value;
  }
  
  try {
    // Décoder base64url
    const base64 = value
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    return decodeURIComponent(escape(atob(base64 + padding)));
  } catch {
    // Si décodage échoue, retourner valeur originale
    return value;
  }
}
```

### Solution 2 : Patch Supabase Auth Custom

Si Supabase Auth ajoute des metadata dans headers, configurer l'auth pour **ne PAS** le faire :

```typescript
// utils/supabase/client.ts
export function createClient() {
  if (clientInstance) {
    return clientInstance;
  }
  
  clientInstance = createBrowserClient(
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)!,
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      auth: {
        // ✅ Désactiver metadata dans headers
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Empêcher l'ajout automatique de metadata dans headers
        flowType: 'pkce',
      },
      global: {
        headers: {
          // ✅ Forcer headers ASCII seulement
          // Ne PAS ajouter de custom headers avec accents
        }
      }
    }
  );
  
  return clientInstance;
}
```

### Solution 3 : Middleware Next.js — Sanitize headers

**Fichier** : `middleware.ts`

Ajouter un sanitizer global pour tous les headers :

```typescript
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ✅ PATCH: Sanitize tous les headers pour éviter non-ASCII
  const headers = new Headers(res.headers);
  
  for (const [key, value] of headers.entries()) {
    // Vérifier si la valeur contient des caractères non-ASCII
    if (!/^[\x00-\x7F]*$/.test(value)) {
      console.warn(`[Middleware] Header non-ASCII détecté: ${key} = ${value.substring(0, 20)}...`);
      
      // Encoder en base64url
      const encoded = btoa(unescape(encodeURIComponent(value)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      headers.set(key, encoded);
    }
  }

  // Copier les headers sanitized dans la réponse
  headers.forEach((value, key) => {
    res.headers.set(key, value);
  });

  // ... reste du middleware
  
  return res;
}
```

### Solution 4 : Catch global dans App Layout

**Fichier** : `app/layout.tsx`

Ajouter un error boundary pour capturer les erreurs Headers :

```typescript
'use client';

import { useEffect } from 'react';

export function HeadersErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Intercepter les erreurs Headers globalement
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        return await originalFetch(...args);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Headers')) {
          console.error('[Fetch] Erreur Headers détectée:', error);
          
          // Retry avec headers sanitized
          const [url, options] = args;
          
          if (options?.headers) {
            const sanitizedHeaders = new Headers();
            
            for (const [key, value] of Object.entries(options.headers)) {
              const sanitizedValue = typeof value === 'string' && !/^[\x00-\x7F]*$/.test(value)
                ? btoa(unescape(encodeURIComponent(value))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
                : value;
              
              sanitizedHeaders.append(key, sanitizedValue);
            }
            
            return originalFetch(url, { ...options, headers: sanitizedHeaders });
          }
        }
        
        throw error;
      }
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  return <>{children}</>;
}
```

---

## 🧪 TESTS À EFFECTUER

### Test 1 : Build Production
```bash
npm run build
```
**Attendu** : Aucune erreur Headers

### Test 2 : Connexion avec nom accentué
1. Créer user : `fabrice.fäys@test.com` (nom avec tréma)
2. Login
3. Ouvrir cockpit
4. Vérifier console : Pas d'erreur Headers

### Test 3 : Metadata custom
1. Ajouter metadata Supabase avec accents
2. Vérifier que les headers sont encodés
3. Vérifier côté serveur que les headers sont décodés

### Test 4 : API calls
1. Ouvrir Network tab (DevTools)
2. Naviguer dans le cockpit
3. Vérifier tous les headers des requêtes : ASCII seulement

---

## 📋 CHECKLIST DÉPLOIEMENT HOTFIX

- [ ] Identifier la cause exacte de l'erreur (logs production)
- [ ] Appliquer Solution 1 (encoder metadata Supabase)
- [ ] Appliquer Solution 2 (config auth)
- [ ] Appliquer Solution 3 (middleware sanitizer)
- [ ] Appliquer Solution 4 (error boundary)
- [ ] Tester build local : `npm run build`
- [ ] Tester en dev : `npm run dev`
- [ ] Tester avec noms accentués : "Fabrice Fäys", "José García"
- [ ] Commit : `git commit -m "hotfix: Encode non-ASCII headers (ISO-8859-1)"`
- [ ] Push staging : `git push origin staging`
- [ ] Deploy staging : `npx vercel --prod --yes`
- [ ] QA validation : Tester tous les flows
- [ ] Monitoring : Vérifier logs 30min → Pas d'erreur Headers
- [ ] Deploy production : `npx vercel --prod --yes`
- [ ] Monitoring 48h : Vérifier pas de régression

---

## 🔗 RÉFÉRENCES

- [MDN Headers API](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
- [ISO-8859-1 Encoding](https://en.wikipedia.org/wiki/ISO/IEC_8859-1)
- [Supabase Auth Custom Headers](https://supabase.com/docs/reference/javascript/auth-api)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

**FIN HOTFIX**
