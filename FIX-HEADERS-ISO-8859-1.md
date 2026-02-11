# Fix: Failed to execute 'fetch' - Non ISO-8859-1 headers

## Problème rencontré

```
Failed to execute 'fetch' on 'Window': Failed to read the 'headers' property from 'RequestInit': String contains non ISO-8859-1 code point.
```

Cette erreur se produit quand on tente d'envoyer des caractères non-ASCII (accents français, emojis, etc.) dans les headers HTTP.

## Solution implémentée

### 1. **Utilitaires de nettoyage des headers** ([lib/headerUtils.ts](lib/headerUtils.ts))

Trois fonctions créées :
- `encodeHeaderValue()` : Encode les valeurs avec caractères spéciaux en base64
- `decodeHeaderValue()` : Décode les valeurs encodées
- `sanitizeHeaders()` : Nettoie un objet complet de headers

### 2. **Wrapper sécurisé pour fetch** ([lib/safeFetch.ts](lib/safeFetch.ts))

Un wrapper `safeFetch()` qui nettoie automatiquement tous les headers avant l'envoi.

### 3. **Fichiers corrigés**

- ✅ [components/cockpit/ExecutiveSummaryCard.tsx](components/cockpit/ExecutiveSummaryCard.tsx)
  - Import de `sanitizeHeaders`
  - Nettoyage des headers `x-tenant-id`
  - Message d'erreur sans accents

- ✅ [app/api/reports/generate/route.ts](app/api/reports/generate/route.ts)
  - Import de `sanitizeHeaders`
  - Nettoyage dans le fetch interne vers `/api/ai/summary`

## Comment l'utiliser

### Option 1 : Utiliser `sanitizeHeaders()` manuellement

```typescript
import { sanitizeHeaders } from "@/lib/headerUtils";

const headers = sanitizeHeaders({
  'x-tenant-id': tenantId,
  'x-user-name': 'François' // sera encodé en base64
});

fetch('/api/endpoint', { headers });
```

### Option 2 : Utiliser le wrapper `safeFetch()`

```typescript
import { safeFetch } from "@/lib/safeFetch";

// Remplacer fetch par safeFetch
await safeFetch('/api/endpoint', {
  headers: {
    'x-tenant-id': tenantId, // automatiquement nettoyé
    'x-user-name': 'François' // automatiquement encodé
  }
});
```

## Où appliquer la correction

### Pages à vérifier en priorité :

1. **Composants cockpit** : Tous les composants qui utilisent `x-tenant-id`
2. **Routes API internes** : Toute route API qui fait un fetch interne avec headers
3. **Formulaires** : Tout formulaire qui envoie des données utilisateur dans des headers
4. **Authentification** : Routes qui manipulent des tokens ou identifiants

### Pattern de recherche :

```bash
# Trouver tous les usages de headers dans fetch
grep -r "headers:" --include="*.ts" --include="*.tsx"

# Trouver les x-tenant-id et x-user-id
grep -r "x-tenant-id\|x-user-id" --include="*.ts" --include="*.tsx"
```

## Décodage côté serveur

Si vous avez encodé des headers, pensez à les décoder côté serveur :

```typescript
import { decodeHeaderValue } from "@/lib/headerUtils";

export async function POST(req: Request) {
  const rawTenantId = req.headers.get('x-tenant-id');
  const tenantId = decodeHeaderValue(rawTenantId);
  
  // tenantId est maintenant décodé si nécessaire
}
```

## Prévention

Pour éviter ce problème à l'avenir :

1. **Toujours** utiliser `safeFetch` au lieu de `fetch` natif
2. **Jamais** mettre de caractères accentués dans des headers
3. **Encoder** en base64 ou URL-encode les valeurs suspectes
4. **Valider** les headers avant envoi en dev

## Tests

Pour tester la correction :

```typescript
// Avant (❌ erreur)
fetch('/api/test', {
  headers: { 'x-name': 'François' } // ❌ caractère é non-ASCII
});

// Après (✅ fonctionne)
import { sanitizeHeaders } from "@/lib/headerUtils";
fetch('/api/test', {
  headers: sanitizeHeaders({ 'x-name': 'François' }) // ✅ b64:RnJhbsOnb2lz
});
```
