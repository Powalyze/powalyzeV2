# ✅ TEST RAPIDE - Connexion Powalyze

**Déploiement** : ✅ TERMINÉ (2m)  
**URL Production** : https://www.powalyze.com  
**Date** : 9 février 2026

---

## 🧪 Test de Connexion (2 minutes)

### Étape 1 : Ouvrir la page de login

```
https://www.powalyze.com/login
```

**✅ Vérifier** :
- [ ] Page se charge sans erreur
- [ ] Pas de message "Invalid API key"
- [ ] Console navigateur propre (F12 > Console)

---

### Étape 2 : Tenter une connexion VALIDE

**Identifiants** :
- Email : `fabrice.fays@outlook.fr`
- Mot de passe : [votre mot de passe]

**✅ Comportement attendu** :
- [ ] Formulaire s'affiche correctement
- [ ] Clic sur "Se connecter" déclenche un appel à Supabase
- [ ] Si mot de passe correct → Redirection vers `/cockpit/projets`
- [ ] Si mot de passe incorrect → Message "Invalid login credentials"
- [ ] **JAMAIS** "Invalid API key"

---

### Étape 3 : Tester avec identifiants INVALIDES

**Identifiants** :
- Email : `test@example.com`
- Mot de passe : `wrongpassword`

**✅ Comportement attendu** :
- [ ] Message d'erreur : "Invalid login credentials" (ou équivalent)
- [ ] **PAS** "Invalid API key"

---

## 🐛 Si "Invalid API key" Persiste

### 1. Vider le cache navigateur
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### 2. Tester en navigation privée
```
Ctrl+Shift+N (Chrome)
Ctrl+Shift+P (Firefox)
```

### 3. Vérifier les variables Vercel
```powershell
vercel env pull .env.check --environment=production --yes
cat .env.check | Select-String "SUPABASE"
```

**Valeurs attendues** :
```env
NEXT_PUBLIC_SUPABASE_URL=https://pqsgdwfsdnmozzoynefw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (sans \r\n ni BOM)
```

### 4. Vérifier les logs en temps réel
```powershell
npx vercel logs https://www.powalyze.com/login --follow
```

---

## 📸 Captures Console (Debug)

### Console Browser (F12)

**Si tout fonctionne** :
```
✅ Supabase client initialized
✅ Auth state changed: SIGNED_IN
```

**Si erreur persiste** :
```
❌ Error: Invalid API key
❌ Failed to fetch
```

Copier les erreurs complètes et les partager.

---

## 📞 Rapport de Test

**Résultat** :
- [ ] ✅ Connexion fonctionne
- [ ] ⚠️ Erreur persiste
- [ ] ❓ Autre problème

**Détails** :
```
[Coller les erreurs console ici si applicable]
```

---

## 🔗 Liens Utiles

- **Page login** : https://www.powalyze.com/login
- **Inspect déploiement** : https://vercel.com/powalyzes-projects/powalyze-v2/2EKW7raaddjU6sPnMX5tUJPS8KWc
- **Documentation** : [FIX-INVALID-API-KEY-RESOLVED.md](FIX-INVALID-API-KEY-RESOLVED.md)

---

**Temps estimé** : 2 minutes  
**Prérequis** : Compte Powalyze actif avec email `fabrice.fays@outlook.fr`
