# 🔧 Configuration Supabase - URLs de redirection

## ✅ Étapes à suivre dans le dashboard Supabase

### 1. Ouvrir la configuration Auth
1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet Powalyze
3. Cliquer sur **Authentication** (menu gauche)
4. Cliquer sur **URL Configuration**

### 2. Ajouter les Redirect URLs autorisées

Dans le champ **Redirect URLs**, ajouter ces lignes (une par ligne) :

```
https://www.powalyze.com/auth/callback
https://powalyze.com/auth/callback
http://localhost:3000/auth/callback
https://www.powalyze.com
https://powalyze.com
http://localhost:3000
```

### 3. Configurer le Site URL

Dans le champ **Site URL**, mettre :
```
https://www.powalyze.com
```

### 4. Vérifier la configuration Email

1. Aller dans **Authentication > Email Templates**
2. Cliquer sur **Confirm signup**
3. Vérifier que le template contient : `{{ .ConfirmationURL }}`
4. ⚠️ **NE PAS** utiliser `{{ .Token }}` (expiration 1 minute)

### 5. Vérifier les paramètres de confirmation

1. Aller dans **Authentication > Providers > Email**
2. **Enable Email Confirmations** doit être activé
3. **Secure email change** peut être activé ou désactivé (selon préférence)

---

## 🧪 Test du flux d'inscription

### A. Inscription
1. Aller sur https://www.powalyze.com/inscription
2. Remplir le formulaire
3. Cliquer sur "Créer mon compte"
4. ✅ Message : "Un email de confirmation a été envoyé"

### B. Email reçu
1. Ouvrir l'email dans Gmail/Outlook **web** (pas l'app mobile)
2. Vérifier que le lien commence par : `https://www.powalyze.com/auth/callback?code=...`
3. Cliquer sur le lien (ne pas copier/coller)

### C. Confirmation
1. Le navigateur s'ouvre sur `/auth/callback`
2. Redirection automatique vers `/onboarding/forfait`
3. ✅ Compte confirmé et session active

---

## 🐛 Troubleshooting

### Erreur : "otp_expired"
**Cause** : Token expiré (utilisé plusieurs fois ou >24h)  
**Solution** : 
1. Supprimer l'utilisateur dans Supabase → Auth → Users
2. Réessayer l'inscription avec un nouvel email ou attendre 24h

### Erreur : "Invalid redirect URL"
**Cause** : L'URL `/auth/callback` n'est pas dans la liste autorisée  
**Solution** : Vérifier l'étape 2 ci-dessus

### Lien coupé dans l'email
**Cause** : Client email qui transforme l'URL  
**Solution** : 
- Utiliser Gmail/Outlook **web** (pas l'app)
- Copier l'URL complète dans la barre d'adresse
- Essayer un autre navigateur

### Le lien ne fonctionne qu'une seule fois
**Comportement normal** : Supabase invalide le code dès la première utilisation  
**Solution** : Ne pas recharger la page, ne pas cliquer plusieurs fois

---

## 📝 Changements appliqués dans le code

### 1. Création de `/auth/callback/route.ts`
Route qui gère la confirmation email et échange le code contre une session.

### 2. Modification de `/app/inscription/page.tsx`
Changé `emailRedirectTo` de `/auth/confirm` → `/auth/callback`

### 3. Modification de `/app/api/auth/signup/route.ts`
Changé `emailRedirectTo` de `/auth/confirm` → `/auth/callback`

---

## ✅ Checklist finale

- [ ] URLs ajoutées dans Supabase → Auth → URL Configuration
- [ ] Site URL configuré
- [ ] Email template vérifié (ConfirmationURL, pas Token)
- [ ] Enable Email Confirmations activé
- [ ] Code déployé en production
- [ ] Test inscription avec un nouvel email
- [ ] Email reçu avec lien correct
- [ ] Confirmation réussie + redirection vers /onboarding/forfait

---

## 🎯 Résumé

**Avant** : Lien expirait car pointait vers `/auth/confirm` (inexistant)  
**Après** : Lien pointe vers `/auth/callback` (route créée) avec gestion PKCE

**Durée de validité** : 24 heures (signUp avec password)  
**Flux** : Inscription → Email → Clic lien → Callback → Exchange code → Session → Onboarding
