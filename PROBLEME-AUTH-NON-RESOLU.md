# 🔴 PROBLÈME AUTH NON RÉSOLU — ANALYSE & SOLUTIONS

**Date**: 2 février 2025  
**Status**: ⚠️ EN ATTENTE  
**Impact**: Utilisateurs ne peuvent pas confirmer leur email  
**Erreur rapportée**: `{"code":403,"error_code":"otp_expired"}`

---

## 🔍 SYMPTÔMES

### Ce qui fonctionne
- ✅ Page `/inscription` accessible
- ✅ Formulaire d'inscription submit correctement
- ✅ Email envoyé par Supabase
- ✅ Lien email contient paramètre `?code=xxx`

### Ce qui ne fonctionne PAS
- ❌ Clic sur lien email → Erreur OTP expired
- ❌ Page `/auth/confirm` reçoit le code mais échec de vérification
- ❌ Utilisateur bloqué, ne peut pas accéder au cockpit

---

## 🧪 TESTS EFFECTUÉS

### Test 1: Redirection /auth/login → /login
**Action**: Créé `app/auth/login/page.tsx` avec redirect
**Résultat**: ✅ Page 404 corrigée

### Test 2: Support PKCE flow dans /auth/confirm
**Action**: 
```typescript
if (code) {
  const result = await supabase.auth.exchangeCodeForSession(code);
} else if (tokenHash) {
  const result = await supabase.auth.verifyOtp({...});
}
```
**Résultat**: ❌ Toujours erreur OTP expired

### Test 3: emailRedirectTo changé
**Avant**: `/verification`  
**Après**: `/auth/confirm`  
**Résultat**: ❌ Pas d'amélioration

### Test 4: Console logs ajoutés
**Code**:
```typescript
console.log('Code reçu:', code);
console.log('exchangeCodeForSession result:', result);
console.error('Auth error:', error);
```
**Résultat**: ⏳ En attente logs utilisateur

---

## 🎯 CAUSES PROBABLES

### 1. Configuration Supabase Email (TRÈS PROBABLE)
**Problème**: Le projet Supabase peut avoir des settings incompatibles

**À vérifier dans Dashboard Supabase**:
- Authentication → Email Templates → Confirm signup
  * Template utilisé (Magic Link vs OTP)
  * `{{ .ConfirmationURL }}` vs `{{ .Token }}`
- Authentication → URL Configuration
  * Redirect URLs whitelist
  * `/auth/confirm` est-il autorisé?
- Authentication → Settings
  * Email confirmation: ENABLED ou DISABLED?
  * PKCE flow: ENABLED?
  * Token expiration time (par défaut 1h, peut-être trop court?)

**Solution**:
```
1. Aller à: https://pqsgdwfsdnmozzoynefw.supabase.co
2. Authentication → Settings
3. Vérifier "Confirm email" = ENABLED
4. Vérifier "Enable PKCE flow" = ENABLED
5. Authentication → URL Configuration
6. Ajouter: https://www.powalyze.com/auth/confirm
7. Optionnel: Augmenter "OTP expiry" de 3600s à 7200s (2h)
```

---

### 2. Token expiration trop courte (PROBABLE)
**Problème**: L'utilisateur reçoit l'email mais clique 5 minutes plus tard → expiré

**Vérifications**:
- Supabase default OTP expiry: 3600 secondes (1h)
- Email peut mettre quelques minutes à arriver
- Utilisateur peut ne pas cliquer immédiatement

**Solution**:
```sql
-- Dans Supabase SQL Editor
update auth.config
set 
  mailer_otp_exp = 7200,  -- 2 heures au lieu de 1h
  email_confirm_otp_exp = 7200
where id = '1';
```

---

### 3. Email template incorrect (POSSIBLE)
**Problème**: Le template email utilise `{{ .Token }}` au lieu de `{{ .ConfirmationURL }}`

**Vérification**:
```
1. Supabase Dashboard → Authentication → Email Templates
2. Confirm signup template
3. Chercher la variable utilisée dans le lien
```

**Si c'est `{{ .Token }}`**:
- C'est l'ancien flow OTP (token_hash)
- Il faut changer pour `{{ .ConfirmationURL }}` (PKCE)

**Si c'est `{{ .ConfirmationURL }}`**:
- C'est correct pour PKCE
- Le problème est ailleurs

**Solution**:
```html
<!-- Template correct pour PKCE -->
<h2>Confirmez votre adresse email</h2>
<p>Cliquez sur le lien ci-dessous pour confirmer votre compte:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
```

---

### 4. emailRedirectTo non whitelisté (POSSIBLE)
**Problème**: Supabase bloque les redirections vers URLs non autorisées

**Vérification**:
```
1. Supabase Dashboard → Authentication → URL Configuration
2. Section "Redirect URLs"
3. Vérifier si https://www.powalyze.com/auth/confirm est présent
```

**Solution**:
- Ajouter `https://www.powalyze.com/auth/confirm`
- Ajouter `http://localhost:3000/auth/confirm` (pour dev local)

---

### 5. Cache navigateur (PEU PROBABLE)
**Problème**: L'utilisateur voit une ancienne version de la page

**Solution**:
```javascript
// Forcer le rechargement sans cache
router.refresh();
router.push('/auth/confirm?code=xxx');
```

---

## 🛠️ PLAN D'ACTION IMMÉDIAT

### Étape 1: Vérifier config Supabase (5 min)
```
1. Ouvrir: https://pqsgdwfsdnmozzoynefw.supabase.co
2. Authentication → Settings
3. Screenshot de tous les settings
4. Authentication → Email Templates
5. Screenshot du template "Confirm signup"
6. Authentication → URL Configuration
7. Screenshot des Redirect URLs
```

### Étape 2: Tester avec OTP expiry augmenté (10 min)
```sql
-- Supabase SQL Editor
update auth.config
set mailer_otp_exp = 7200
where id = '1';
```
Puis:
1. Créer nouveau compte test
2. Attendre email
3. Cliquer immédiatement sur le lien
4. Observer le résultat

### Étape 3: Désactiver email confirmation temporairement (TEST ONLY)
**⚠️ À faire UNIQUEMENT pour tester**:
```
1. Supabase Dashboard → Authentication → Settings
2. "Enable email confirmations" → DÉSACTIVER
3. Créer nouveau compte
4. Observer: Session créée immédiatement?
```

Si ça marche:
- Problème = config email confirmation
- Solution = Corriger template ou expiry

Si ça ne marche pas:
- Problème ailleurs (JWT, profiles, RLS)

---

## 🔬 DEBUG AVANCÉ

### Logs Supabase à consulter
```
1. Supabase Dashboard → Logs → Auth Logs
2. Filtrer par: "error"
3. Chercher: OTP expired, invalid token, etc.
4. Noter le timestamp exact de l'erreur
```

### Test avec curl (bypass frontend)
```bash
# 1. Signup
curl -X POST https://pqsgdwfsdnmozzoynefw.supabase.co/auth/v1/signup \
  -H "apikey: [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "options": {
      "emailRedirectTo": "https://www.powalyze.com/auth/confirm"
    }
  }'

# 2. Récupérer le code depuis l'email
# 3. Exchange code for session
curl -X POST https://pqsgdwfsdnmozzoynefw.supabase.co/auth/v1/token?grant_type=pkce \
  -H "apikey: [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"auth_code": "[CODE_FROM_EMAIL]"}'
```

### Test avec inscription flow modifié
**Code à tester dans `app/inscription/page.tsx`**:
```typescript
// Désactiver emailRedirectTo temporairement
const { data: authData, error: authError } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  // emailRedirectTo: `${window.location.origin}/auth/confirm`  // COMMENTÉ
});

// Observer si email confirmation requise ou session créée directement
console.log('authData:', authData);
```

---

## 🎯 SOLUTIONS ALTERNATIVES

### Option 1: Désactiver email confirmation (RAPIDE)
**Avantages**:
- ✅ Onboarding immédiat
- ✅ Pas d'erreur OTP
- ✅ Meilleure UX

**Inconvénients**:
- ❌ Risque emails fake
- ❌ Moins sécurisé

**Implémentation**:
```
Supabase Dashboard → Authentication → Settings
"Enable email confirmations" → OFF
```

---

### Option 2: Magic Link au lieu de OTP (MOYEN)
**Principe**: Utiliser un lien unique qui expire mais sans code

**Implémentation**:
```typescript
// Dans app/inscription/page.tsx
const { error } = await supabase.auth.signInWithOtp({
  email: formData.email,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
});
```

**Template email**:
```html
<a href="{{ .ConfirmationURL }}">Se connecter</a>
```

---

### Option 3: Double factor avec SMS (LONG)
**Principe**: Envoyer code SMS au lieu d'email

**Implémentation**:
- Intégrer Twilio ou autre provider SMS
- Modifier flow signup pour demander téléphone
- Envoyer code SMS 6 chiffres
- Valider code dans page dédiée

---

## 📞 PROCHAINES ACTIONS

### ACTION IMMÉDIATE (VOUS)
1. Accéder à Supabase Dashboard
2. Vérifier les 3 sections mentionnées (Settings, Email Templates, URL Config)
3. Prendre screenshots
4. Partager les screenshots ou décrire ce que vous voyez

### ACTION AGENT (MOI)
1. Analyser les screenshots/informations
2. Identifier la config incorrecte
3. Proposer correction précise
4. Implémenter si besoin de code

### ACTION ALTERNATIVE (SI URGENCE)
Désactiver email confirmation temporairement:
```
1. Supabase → Auth → Settings
2. "Enable email confirmations" → OFF
3. Redémarrer test inscription
4. Utilisateur créé immédiatement
```

**⚠️ À réactiver après fix définitif**

---

## 📊 RÉCAPITULATIF

| Élément | Status | Action requise |
|---------|--------|----------------|
| Page inscription | ✅ OK | - |
| Envoi email | ✅ OK | - |
| Lien email | ❓ INCONNU | Vérifier template |
| Auth confirm | ❌ ERREUR | Vérifier PKCE + expiry |
| Config Supabase | ❓ INCONNU | **VÉRIFIER MAINTENANT** |
| emailRedirectTo whitelist | ❓ INCONNU | Vérifier URL Config |

**PRIORITÉ ABSOLUE**: Accéder au Supabase Dashboard et vérifier la configuration

---

**FIN ANALYSE AUTH** 🔴
