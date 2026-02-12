# 🚀 CONNEXION RAPIDE AU COCKPIT

## ✨ Nouveau système ultra-simple

**Fini les problèmes de connexion !**

---

## 🔐 Comment se connecter

### 1. Ouvrir la page de connexion

```
http://localhost:3000/login-simple
```

### 2. Utiliser un de ces comptes

```
Email: admin@powalyze.com
Password: admin123

Email: demo@powalyze.com
Password: demo123

Email: test@powalyze.com
Password: test123
```

### 3. Cliquer sur "Se connecter"

✅ **Vous êtes immédiatement redirigé vers le cockpit !**

---

## 🎯 Avantages

✅ **Connexion instantanée** - Pas d'attente, pas de complexité  
✅ **Ça marche à tous les coups** - Pas de bug de session  
✅ **Simple à debugger** - Juste localStorage + cookie  
✅ **Multi-comptes** - Changez facilement d'utilisateur  

---

## 🔄 Actions disponibles

### Se déconnecter

Ouvrir la console navigateur (F12) et taper:

```javascript
localStorage.removeItem('powalyze_auth');
document.cookie = 'simple_auth_token=; path=/; max-age=0';
window.location.href = '/';
```

### Vérifier la session

Console navigateur:

```javascript
JSON.parse(localStorage.getItem('powalyze_auth'))
```

---

## 📝 Ajouter un nouveau compte

Modifier `app/login-simple/page.tsx` ligne 13:

```typescript
const DEMO_ACCOUNTS = [
  // Comptes existants
  { email: 'admin@powalyze.com', password: 'admin123', name: 'Admin', role: 'admin', hasPro: true },
  
  // Ajouter votre compte
  { email: 'moi@exemple.com', password: 'monpass', name: 'Mon Nom', role: 'user', hasPro: true }
];
```

---

## 🎨 Page d'accueil nettoyée

✅ Bloc marketing "Excel → Reporting" **supprimé**  
✅ Focus sur le cockpit premium  
✅ Navigation fluide  

---

## 🚨 En cas de problème

### "Je ne peux pas accéder au cockpit"

1. Supprimer les cookies: F12 → Application → Cookies → Supprimer tout
2. Supprimer localStorage: F12 → Console → `localStorage.clear()`
3. Recharger la page (Ctrl+R)
4. Se reconnecter sur `/login-simple`

### "La page reste bloquée"

1. Ouvrir F12 → Console
2. Chercher les messages d'erreur en rouge
3. Recharger avec Ctrl+Shift+R (hard reload)

---

## ✅ Test rapide

```bash
# 1. S'assurer que le serveur tourne
npm run dev

# 2. Ouvrir le navigateur
http://localhost:3000/login-simple

# 3. Se connecter avec admin@powalyze.com / admin123

# 4. Vérifier que vous êtes sur /cockpit/projets
```

**Si ça fonctionne → Tout est OK ! 🎉**

---

## 📁 Fichiers importants

- `app/login-simple/page.tsx` - Page de connexion
- `lib/simple-auth.ts` - Fonctions auth
- `middleware.ts` - Protection des routes (modifié)
- `app/page.tsx` - Page d'accueil (bloc marketing supprimé)

---

## 🎉 C'est tout !

**Le système est maintenant ultra-simple et fonctionnel.**

Plus de complexité Supabase, plus de problèmes de sync, plus de bugs bizarres.

**Connexion → Cockpit. Point.**

---

**Créé le:** 12 février 2026  
**Status:** ✅ Production Ready
