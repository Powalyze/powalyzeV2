# Plan de Test - Fix Boucle de Redirection

**Date**: 1er février 2026  
**Objectif**: Valider que la boucle ERR_TOO_MANY_REDIRECTS est corrigée

## Tests Manuels à Effectuer

### ✅ Test 1: Accès Client avec Params Complets
```
URL: https://www.powalyze.com/cockpit/client?userId=XXX&organizationId=YYY
Cookie: Token valide d'un utilisateur avec role='client'

Résultat attendu:
- Pas de redirection
- Affichage du cockpit client
- Pas d'erreur ERR_TOO_MANY_REDIRECTS

Étapes:
1. Se connecter avec un compte client
2. Accéder à l'URL ci-dessus
3. Vérifier que la page s'affiche correctement
```

### ✅ Test 2: Accès Client sans OrganizationId
```
URL: https://www.powalyze.com/cockpit/client?userId=XXX
Cookie: Token valide d'un utilisateur avec role='client'

Résultat attendu:
- Récupération automatique de organizationId depuis la table users
- Affichage du cockpit client
- Pas d'erreur ERR_TOO_MANY_REDIRECTS

Étapes:
1. Se connecter avec un compte client
2. Accéder à l'URL ci-dessus (sans organizationId)
3. Vérifier que la page s'affiche correctement
4. Vérifier dans les logs que organizationId a été récupéré
```

### ✅ Test 3: Accès Admin vers Client
```
URL: https://www.powalyze.com/cockpit/client?userId=XXX
Cookie: Token valide d'un utilisateur avec role='admin'

Résultat attendu:
- Redirection unique vers /cockpit/demo
- Pas de boucle
- Pas d'erreur ERR_TOO_MANY_REDIRECTS

Étapes:
1. Se connecter avec un compte admin
2. Accéder à /cockpit/client
3. Vérifier redirection vers /cockpit/demo (1 seule redirection)
```

### ✅ Test 4: Accès Demo vers Client
```
URL: https://www.powalyze.com/cockpit/client?userId=XXX
Cookie: Token valide d'un utilisateur avec role='demo'

Résultat attendu:
- Redirection unique vers /cockpit/demo
- Pas de boucle
- Pas d'erreur ERR_TOO_MANY_REDIRECTS

Étapes:
1. Se connecter avec un compte demo
2. Accéder à /cockpit/client
3. Vérifier redirection vers /cockpit/demo (1 seule redirection)
```

### ✅ Test 5: Accès Non-Authentifié vers Client
```
URL: https://www.powalyze.com/cockpit/client
Cookie: Aucun token

Résultat attendu:
- Redirection unique vers /signup?redirect=/cockpit/client
- Pas de boucle
- Pas d'erreur ERR_TOO_MANY_REDIRECTS

Étapes:
1. Se déconnecter complètement
2. Accéder à /cockpit/client
3. Vérifier redirection vers /signup avec param redirect
```

### ✅ Test 6: Accès à /cockpit (redirection automatique)
```
URL: https://www.powalyze.com/cockpit
Cookie: Token valide

Résultat attendu selon le rôle:
- Admin → /cockpit/admin?userId=XXX
- Client → /cockpit/client?userId=XXX&organizationId=YYY
- Demo → /cockpit/demo
- Pas d'erreur ERR_TOO_MANY_REDIRECTS

Étapes:
1. Tester avec 3 comptes différents (admin, client, demo)
2. Accéder à /cockpit
3. Vérifier la redirection automatique selon le rôle
```

### ✅ Test 7: Accès Client vers Admin
```
URL: https://www.powalyze.com/cockpit/admin
Cookie: Token valide d'un utilisateur avec role='client'

Résultat attendu:
- Redirection unique vers /cockpit/demo
- Pas de boucle via /cockpit
- Pas d'erreur ERR_TOO_MANY_REDIRECTS

Étapes:
1. Se connecter avec un compte client
2. Accéder à /cockpit/admin
3. Vérifier redirection vers /cockpit/demo (1 seule redirection)
```

### ✅ Test 8: Accès Demo vers Admin
```
URL: https://www.powalyze.com/cockpit/admin
Cookie: Token valide d'un utilisateur avec role='demo'

Résultat attendu:
- Redirection unique vers /cockpit/demo
- Pas de boucle via /cockpit
- Pas d'erreur ERR_TOO_MANY_REDIRECTS

Étapes:
1. Se connecter avec un compte demo
2. Accéder à /cockpit/admin
3. Vérifier redirection vers /cockpit/demo (1 seule redirection)
```

## Tests Automatisés (Playwright/Cypress)

```typescript
// test/redirects.spec.ts

describe('Cockpit Redirects - No Loop', () => {
  
  it('should not loop on /cockpit/client with valid client user', async () => {
    // Login as client
    await login('client@example.com', 'password');
    
    // Navigate to /cockpit/client?userId=XXX&organizationId=YYY
    const response = await page.goto('/cockpit/client?userId=XXX&organizationId=YYY');
    
    // Check no redirect loop
    expect(response.status()).toBe(200);
    expect(page.url()).toContain('/cockpit/client');
  });
  
  it('should redirect admin to /cockpit/demo when accessing /cockpit/client', async () => {
    // Login as admin
    await login('admin@example.com', 'password');
    
    // Navigate to /cockpit/client
    await page.goto('/cockpit/client?userId=XXX');
    
    // Check redirect to /cockpit/demo
    await page.waitForURL('**/cockpit/demo');
    expect(page.url()).toContain('/cockpit/demo');
  });
  
  it('should not create loop on /cockpit with session', async () => {
    // Login as client
    await login('client@example.com', 'password');
    
    // Navigate to /cockpit
    const response = await page.goto('/cockpit');
    
    // Check redirect to /cockpit/client
    await page.waitForURL('**/cockpit/client**');
    expect(page.url()).toContain('/cockpit/client');
  });
  
  it('should redirect unauthenticated user to /signup', async () => {
    // Clear cookies
    await context.clearCookies();
    
    // Navigate to /cockpit/client
    await page.goto('/cockpit/client');
    
    // Check redirect to /signup
    await page.waitForURL('**/signup**');
    expect(page.url()).toContain('/signup');
    expect(page.url()).toContain('redirect=/cockpit/client');
  });
  
  it('should auto-fetch organizationId when missing', async () => {
    // Login as client
    await login('client@example.com', 'password');
    
    // Mock Supabase response
    await mockSupabaseUserData({ tenant_id: 'org-123' });
    
    // Navigate without organizationId
    await page.goto('/cockpit/client?userId=user-456');
    
    // Check page renders correctly
    expect(page.url()).toContain('/cockpit/client');
    await expect(page.locator('[data-testid="cockpit-shell"]')).toBeVisible();
  });
});
```

## Outils de Test

### DevTools Network Monitor
```bash
# 1. Ouvrir Chrome DevTools (F12)
# 2. Aller dans l'onglet Network
# 3. Cocher "Preserve log"
# 4. Naviguer vers /cockpit/client
# 5. Vérifier:
#    - Nombre de requêtes < 5
#    - Pas de status 301/302 en boucle
#    - Dernière requête: status 200
```

### cURL Test
```bash
# Test avec redirection suivie
curl -L -I "https://www.powalyze.com/cockpit/client" \
  -H "Cookie: sb-access-token=..." \
  -v

# Vérifier dans la sortie:
# - Nombre de redirections < 3
# - Dernière ligne: HTTP/2 200
```

### Vercel Logs
```bash
# Monitorer les logs en temps réel
vercel logs --follow

# Rechercher les erreurs de boucle
vercel logs | grep -i "redirect"
vercel logs | grep -i "ERR_TOO_MANY"
```

## Checklist de Validation

- [ ] Test 1: Client avec params complets ✅
- [ ] Test 2: Client sans organizationId ✅
- [ ] Test 3: Admin vers client ✅
- [ ] Test 4: Demo vers client ✅
- [ ] Test 5: Non-authentifié vers client ✅
- [ ] Test 6: Redirection automatique /cockpit ✅
- [ ] Test 7: Client vers admin ✅
- [ ] Test 8: Demo vers admin ✅
- [ ] DevTools: Pas de boucle visible ✅
- [ ] cURL: < 3 redirections ✅
- [ ] Vercel Logs: Pas d'erreur de boucle ✅

## Résultats Attendus

✅ **Tous les tests passent**
✅ **Aucune boucle de redirection**
✅ **Performance stable (INP < 200ms)**
✅ **Logs propres sans erreur**

## Actions en Cas d'Échec

Si un test échoue:

1. **Vérifier les logs Vercel**
   ```bash
   vercel logs --follow
   ```

2. **Activer le debug dans middleware**
   ```typescript
   console.log('[MIDDLEWARE]', { path, session: !!session, role: userData?.role });
   ```

3. **Vérifier la table users**
   ```sql
   SELECT id, role, tenant_id FROM users WHERE id = 'XXX';
   ```

4. **Tester en local**
   ```bash
   npm run dev
   # Tester sur http://localhost:3000/cockpit/client
   ```

---

**Next Steps**:
1. Exécuter tous les tests manuels
2. Valider avec des utilisateurs réels
3. Déployer sur production
4. Monitorer les logs pendant 24h
