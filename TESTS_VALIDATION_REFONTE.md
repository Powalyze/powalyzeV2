# 🧪 GUIDE TESTS POST-DÉPLOIEMENT

**Date**: 1er février 2026  
**Commits**: `07b09b0` + `5fc131d`  
**Production**: https://www.powalyze.com

---

## ✅ TESTS À EFFECTUER

### 1️⃣ Redirects 301 Legacy (après redéploiement)

Tester avec curl ou navigateur (mode réseau) :

```bash
# Devrait rediriger avec HTTP 301
curl -I https://www.powalyze.com/pro
# → Expect: 301 → Location: /cockpit/pro

curl -I https://www.powalyze.com/cockpit-demo
# → Expect: 301 → Location: /cockpit/demo

curl -I https://www.powalyze.com/cockpit-real
# → Expect: 301 → Location: /cockpit

curl -I https://www.powalyze.com/cockpit-client
# → Expect: 301 → Location: /cockpit/client

curl -I https://www.powalyze.com/demo
# → Expect: 301 → Location: /signup?demo=true
```

**✅ Critère succès** : Tous retournent 301 avec bonne Location header

---

### 2️⃣ Flow Login Admin

**Pré-requis** : Compte avec `users.role = 'admin'`

1. Aller sur https://www.powalyze.com/login
2. Entrer email/password admin
3. Cliquer "Connexion"
4. **✅ Devrait rediriger vers** : `/cockpit/admin`
5. Vérifier accès dashboard admin
6. Essayer d'accéder `/cockpit/demo` → devrait redirecter vers `/cockpit/admin`

**✅ Critère succès** : Admin reste sur routes admin, pas de boucle

---

### 3️⃣ Flow Login Demo

**Pré-requis** : Compte avec `users.role = 'demo'`

1. Aller sur https://www.powalyze.com/login
2. Entrer email/password demo
3. Cliquer "Connexion"
4. **✅ Devrait rediriger vers** : `/cockpit/demo`
5. Vérifier accès dashboard demo
6. Essayer d'accéder `/cockpit/admin` → devrait redirecter vers `/cockpit/demo`
7. Voir badge "Mode Démo"

**✅ Critère succès** : Demo reste sur routes demo, badge visible

---

### 4️⃣ Flow Login Client (Pro)

**Pré-requis** : Compte avec `users.role = 'client'`

1. Aller sur https://www.powalyze.com/login
2. Entrer email/password client
3. Cliquer "Connexion"
4. **✅ Devrait rediriger vers** : `/cockpit/client`
5. Vérifier accès dashboard client avec projets réels
6. Essayer d'accéder `/cockpit/admin` → devrait redirecter vers `/cockpit/client`
7. Essayer d'accéder `/cockpit/demo` → devrait redirecter vers `/cockpit/client`

**✅ Critère succès** : Client accède à ses données réelles

---

### 5️⃣ Création Projet (Client/Pro)

**Pré-requis** : Connecté en tant que client

1. Aller sur `/cockpit/projets`
2. Cliquer "Nouveau projet"
3. Remplir formulaire :
   - Nom: "Test Projet $(date)"
   - Description: "Test création après refonte"
   - Budget: 100000
   - Status: active
4. Cliquer "Créer"
5. **✅ Devrait voir** : Toast "Projet créé avec succès"
6. **❌ Ne devrait PAS voir** : Erreur RLS ou "Organisation non trouvée"
7. Projet apparaît dans liste

**✅ Critère succès** : Création sans erreur, projet visible immédiatement

---

### 6️⃣ Guards Protection Routes

**Test accès non autorisés** :

| Connecté comme | Accède à | Résultat attendu |
|----------------|----------|------------------|
| Non connecté | `/cockpit` | → `/signup?redirect=/cockpit` |
| Non connecté | `/cockpit/admin` | → `/signup?redirect=/cockpit/admin` |
| Demo | `/cockpit/admin` | → `/cockpit/demo` |
| Client | `/cockpit/admin` | → `/cockpit/client` |
| Admin | `/cockpit/demo` | → `/cockpit/admin` |

**✅ Critère succès** : Aucun accès non autorisé possible

---

### 7️⃣ Navigation Modules (Client)

**Pré-requis** : Connecté en tant que client

Tester navigation fluide entre modules :

1. `/cockpit/client` → Dashboard
2. `/cockpit/projets` → Liste projets
3. `/cockpit/risques` → Liste risques
4. `/cockpit/decisions` → Liste décisions
5. `/cockpit/rapports` → Rapports
6. `/cockpit/equipe` → Gestion équipe

**✅ Critère succès** : Chargement < 2s, pas d'erreur console

---

### 8️⃣ Signup Demo

**Test inscription demo** :

1. Aller sur https://www.powalyze.com/signup?demo=true
2. Remplir formulaire inscription
3. **✅ Devrait** : Créer compte avec `role = 'demo'`
4. Auto-login
5. Redirection → `/cockpit/demo`
6. Données demo pré-chargées (projets, risques, décisions)

**✅ Critère succès** : Inscription rapide, données demo visibles

---

### 9️⃣ Signup Pro

**Test inscription pro** :

1. Aller sur https://www.powalyze.com/signup
2. Remplir formulaire inscription
3. **✅ Devrait** : Créer compte avec `role = 'client'`
4. Auto-login
5. Redirection → `/cockpit/client`
6. Dashboard vide (prêt pour vrais projets)

**✅ Critère succès** : Inscription fluide, cockpit vide prêt à l'emploi

---

### 🔟 Performance & Erreurs

**Console navigateur** :
- ❌ Aucune erreur JavaScript
- ❌ Aucune 404 pour assets
- ❌ Aucune erreur Supabase

**Performance** :
- ✅ Lighthouse Performance > 80
- ✅ INP < 200ms
- ✅ LCP < 2.5s

**Méthode** :
1. F12 → Console
2. Naviguer sur 5-6 pages
3. Vérifier aucune erreur rouge
4. F12 → Network → Vérifier toutes ressources 200 OK

---

## 📊 CHECKLIST COMPLÈTE

### Redirects 301
- [ ] `/pro` → `/cockpit/pro`
- [ ] `/cockpit-demo` → `/cockpit/demo`
- [ ] `/cockpit-real` → `/cockpit`
- [ ] `/cockpit-client` → `/cockpit/client`
- [ ] `/demo` → `/signup?demo=true`

### Flows Auth
- [ ] Login admin → `/cockpit/admin`
- [ ] Login demo → `/cockpit/demo`
- [ ] Login client → `/cockpit/client`
- [ ] Signup demo → `/cockpit/demo` + données
- [ ] Signup pro → `/cockpit/client` vide

### Fonctionnalités
- [ ] Création projet (client) → OK sans erreur RLS
- [ ] Création risque (client) → OK
- [ ] Création décision (client) → OK
- [ ] Navigation modules → Fluide
- [ ] Dashboard KPIs → Chargent correctement

### Guards
- [ ] Non connecté → redirect `/signup`
- [ ] Demo → bloqué sur admin/client routes
- [ ] Client → bloqué sur admin routes
- [ ] Admin → accès partout (ou redirect admin)

### Performance
- [ ] Console → Aucune erreur
- [ ] Network → Toutes ressources 200
- [ ] Lighthouse → Score > 80
- [ ] Chargement pages < 2s

---

## 🚨 EN CAS D'ERREUR

### Erreur RLS pendant création
```
Symptôme: "new row violates row-level security policy"
Solution: Vérifier service_role_key dans actions.ts
```

### Boucle de redirection
```
Symptôme: ERR_TOO_MANY_REDIRECTS
Solution: Vérifier middleware.ts guards + LoginForm.tsx redirect
```

### 404 sur routes
```
Symptôme: Route retourne 404 au lieu de redirect
Solution: Vérifier middleware matcher inclut la route
```

### Organisation non trouvée
```
Symptôme: "Organisation non trouvée" pendant création projet
Solution: Vérifier getOrganizationId() auto-création fonctionne
```

---

## ✅ VALIDATION FINALE

**Site OK si** :
- ✅ 10/10 redirects 301 fonctionnent
- ✅ 5/5 flows auth redirigent correctement
- ✅ Création projet sans erreur
- ✅ Guards bloquent accès non autorisés
- ✅ Aucune erreur console
- ✅ Performance acceptable (< 2s chargement)

**Prêt pour utilisateurs réels** 🎉

---

## 📝 NOTES

- **Priorité 1** : Redirects 301 + Auth flows
- **Priorité 2** : Création projet sans erreur
- **Priorité 3** : Performance & console propre

**Durée estimée tests complets** : 15-20 minutes
