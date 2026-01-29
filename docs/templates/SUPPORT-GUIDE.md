# Support Guide - Version [X.Y.Z]

**Date de release** : [JJ/MM/AAAA]  
**Version** : [X.Y.Z]  
**Support Manager** : [Nom]

---

## 📋 TABLE DES MATIÈRES

1. [Résumé des nouveautés](#résumé-des-nouveautés)
2. [Scripts de support](#scripts-de-support)
3. [FAQ technique](#faq-technique)
4. [Troubleshooting](#troubleshooting)
5. [Escalation matrix](#escalation-matrix)
6. [Monitoring tickets](#monitoring-tickets)

---

## 🎉 Résumé des Nouveautés

### Features principales
1. **[Feature 1]** : [Description 1 phrase]
2. **[Feature 2]** : [Description 1 phrase]
3. **[Feature 3]** : [Description 1 phrase]

### Points d'attention
- ⚠️ [Point 1] : [Ce que le support doit savoir]
- ⚠️ [Point 2] : [Ce que le support doit savoir]

### Breaking changes
- [ ] ✅ OUI : [Détails ci-dessous]
- [ ] ❌ NON

---

## 📞 Scripts de Support

### Script 1 : [Feature 1] - "Comment utiliser [feature] ?"

**User question** :  
"Comment utiliser la nouvelle feature [feature 1] ?"

**Réponse type** :
```
Bonjour [Nom],

La nouvelle feature [Feature 1] vous permet de [bénéfice principal].

Voici comment l'utiliser :

1. Allez dans [Section] (exemple : Cockpit > Projets)
2. Cliquez sur [Bouton] (exemple : "Nouveau projet")
3. Remplissez [Champs] (exemple : Nom, description, budget)
4. Cliquez sur [CTA] (exemple : "Créer")

Résultat attendu : [Description résultat]

Si vous rencontrez un problème, merci de me partager :
- Votre navigateur (Chrome, Firefox, Safari, Edge)
- Device (Desktop, Mobile, Tablette)
- Screenshot de l'erreur (si applicable)

Je reste à votre disposition !

Cordialement,
[Signature]
```

**Screenshot pour le support** :  
![Feature 1](screenshots/feature-1-help.png)

**Troubleshooting** :
- ❌ **Si erreur Y** : [Solution]
- ❌ **Si bouton invisible** : [Solution]
- ❌ **Si formulaire ne se soumet pas** : [Solution]

---

### Script 2 : [Feature 2] - "Erreur lors de [action]"

**User question** :  
"J'obtiens une erreur lors de [action]"

**Réponse type** :
```
Bonjour [Nom],

Merci pour votre retour. Je vais vous aider à résoudre ce problème.

Pourriez-vous vérifier les points suivants :

1. [Vérification 1] (exemple : Êtes-vous bien connecté ?)
2. [Vérification 2] (exemple : Avez-vous les permissions nécessaires ?)
3. [Vérification 3] (exemple : Le champ [X] est-il bien rempli ?)

Si le problème persiste, merci de me partager :
- Le message d'erreur complet
- Les étapes pour reproduire le problème
- Un screenshot de l'écran

Je traite votre demande en priorité.

Cordialement,
[Signature]
```

**Checklist debug** :
- [ ] User authentifié ? (vérifier JWT token)
- [ ] Permissions OK ? (vérifier role dans Supabase)
- [ ] Données valides ? (vérifier input validation)
- [ ] RLS OK ? (vérifier memberships table)

**Logs à consulter** :
```bash
# Vercel logs
vercel logs [project-name] --since [timestamp]

# Supabase logs (SQL Editor)
SELECT * FROM auth.users WHERE email = '[user-email]';
SELECT * FROM memberships WHERE user_id = '[user-id]';
```

---

### Script 3 : Breaking Change - "Ancien code ne fonctionne plus"

**User question** :  
"Depuis la mise à jour, [ancien comportement] ne fonctionne plus"

**Réponse type** :
```
Bonjour [Nom],

Merci pour votre message. Nous avons effectivement apporté des améliorations qui modifient [comportement].

**Ce qui a changé** :
[Explication breaking change]

**Migration nécessaire** :
[Instructions migration]

**Avant** :
[Ancien code/comportement]

**Après** :
[Nouveau code/comportement]

**Documentation** : [Lien guide migration]

Si vous avez besoin d'aide pour la migration, je reste à votre disposition pour un appel de support.

Cordialement,
[Signature]
```

---

### Script 4 : Performance - "La plateforme est lente"

**User question** :  
"La plateforme est lente / met du temps à charger"

**Réponse type** :
```
Bonjour [Nom],

Merci pour votre retour. Je vais vérifier les performances.

Pourriez-vous me préciser :

1. **Page concernée** : [Quelle page est lente ?]
2. **Navigateur** : [Chrome, Firefox, Safari, Edge ?]
3. **Device** : [Desktop, Mobile, Tablette ?]
4. **Connexion internet** : [WiFi, 4G, Fibre ?]
5. **Heure du problème** : [Quand avez-vous constaté la lenteur ?]

En attendant, voici quelques solutions temporaires :
- Videz le cache de votre navigateur (Ctrl+Shift+Delete)
- Essayez en navigation privée
- Vérifiez votre connexion internet

Je consulte nos métriques de performance et reviens vers vous rapidement.

Cordialement,
[Signature]
```

**Checklist debug** :
- [ ] Vérifier Vercel Analytics (latence, taux d'erreur)
- [ ] Vérifier Supabase Logs (requêtes lentes)
- [ ] Vérifier status page (downtime ?)
- [ ] Tester la page concernée (reproduire problème)

**Métriques à consulter** :
```
Vercel Analytics :
- Latence P95 : [X]ms (seuil < 500ms)
- Taux d'erreur : [X]% (seuil < 1%)
- Uptime : [X]% (seuil > 99.9%)

Supabase :
- Slow queries : [nombre]
- Erreurs RLS : [nombre]
```

---

### Script 5 : Mobile - "Problème sur mobile"

**User question** :  
"Sur mon téléphone, [problème]"

**Réponse type** :
```
Bonjour [Nom],

Merci pour votre retour sur l'expérience mobile.

Pourriez-vous me préciser :

1. **Device** : [iPhone 12, Samsung Galaxy, etc.]
2. **OS version** : [iOS 17, Android 14, etc.]
3. **Navigateur** : [Safari, Chrome, Firefox, etc.]
4. **Screenshot** : [Si possible]

En attendant, essayez :
- Actualisez la page (swipe down)
- Videz le cache du navigateur
- Essayez en navigation privée

Nous testons l'application sur tous les devices et résolvons votre problème rapidement.

Cordialement,
[Signature]
```

**Checklist mobile** :
- [ ] Test viewport (< 768px) : OK ?
- [ ] Bottom navigation visible : OK ?
- [ ] Touch targets > 48px : OK ?
- [ ] Scroll fluide : OK ?

---

## ❓ FAQ Technique

### Q1 : "Comment accéder au mode LIVE ?"
**A** : Le mode LIVE nécessite une configuration Supabase. Voici les étapes :
1. Créer compte Supabase
2. Configurer variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Exécuter migrations SQL (voir docs)
4. Redémarrer l'application

**Doc** : [Guide LIVE Mode](link)

---

### Q2 : "Quelle est la différence entre DEMO et LIVE ?"
**A** :
- **DEMO** : Données fixes, ne nécessite aucune config, badge "Mode Démo" visible
- **LIVE** : Données réelles stockées dans Supabase, multi-tenant, RLS activé

**Doc** : [Architecture Dual-Mode](link)

---

### Q3 : "Comment créer un nouveau projet en mode LIVE ?"
**A** :
1. Aller dans Cockpit (mode LIVE activé)
2. Cliquer sur "Nouveau projet" (bouton bleu)
3. Remplir : Nom (requis), Description (optionnel), Budget (optionnel)
4. Cliquer "Créer"
5. Projet apparaît instantanément dans la liste

**Troubleshooting** :
- Si erreur : Vérifier authentification (token valide)
- Si pas visible : Vérifier RLS (memberships table)

---

### Q4 : "Comment inviter un membre à mon organisation ?"
**A** :
_[Feature à venir dans PACK futur]_

Pour l'instant, créez les utilisateurs directement dans Supabase :
```sql
-- 1. Créer user dans auth.users
-- 2. Créer profil dans user_profiles
-- 3. Créer membership dans memberships
```

**Doc** : [Guide création utilisateur](link)

---

### Q5 : "Combien de projets puis-je créer ?"
**A** :
- **DEMO** : Illimité (données non persistées)
- **LIVE** : Selon votre plan (Basic : 10, Pro : 50, Enterprise : Illimité)

**Upgrade** : Contactez commercial@powalyze.com

---

## 🛠️ Troubleshooting

### Problème 1 : "Page blanche / Erreur 500"
**Symptômes** : Écran blanc, ou message "Something went wrong"

**Causes possibles** :
1. Erreur JavaScript (console browser)
2. Erreur API (Vercel logs)
3. Erreur Supabase (RLS, SQL)

**Debug steps** :
1. **Console browser** :
   ```
   F12 > Console > Chercher erreurs rouges
   ```
2. **Vercel logs** :
   ```bash
   vercel logs [project] --since 1h
   ```
3. **Supabase logs** :
   ```sql
   -- Vérifier erreurs récentes
   SELECT * FROM logs WHERE level = 'error' ORDER BY created_at DESC LIMIT 10;
   ```

**Solution** :
- Si erreur auth : Vérifier JWT token
- Si erreur RLS : Vérifier memberships
- Si erreur 500 : Escalader DevOps

---

### Problème 2 : "Données ne s'affichent pas"
**Symptômes** : Page charge mais aucune donnée visible

**Causes possibles** :
1. RLS bloque l'accès (Supabase)
2. User pas dans la bonne organization
3. Pas de memberships

**Debug steps** :
1. **Vérifier RLS** :
   ```sql
   SELECT * FROM projects WHERE organization_id IN (
     SELECT organization_id FROM memberships WHERE user_id = '[user-id]'
   );
   ```
2. **Vérifier memberships** :
   ```sql
   SELECT * FROM memberships WHERE user_id = '[user-id]';
   ```

**Solution** :
- Ajouter membership si manquant
- Vérifier organization_id correct

---

### Problème 3 : "Login ne fonctionne pas"
**Symptômes** : Erreur "Invalid credentials" ou boucle infinie

**Causes possibles** :
1. Mauvais email/password
2. User n'existe pas dans Supabase
3. JWT_SECRET incorrect

**Debug steps** :
1. **Vérifier user existe** :
   ```sql
   SELECT * FROM auth.users WHERE email = '[email]';
   ```
2. **Vérifier password** :
   ```sql
   -- Impossible de voir password (bcrypt), mais vérifier que confirmed_at IS NOT NULL
   ```

**Solution** :
- Réinitialiser password si nécessaire
- Créer user si n'existe pas

---

## 🚨 Escalation Matrix

### Niveau 1 : Support (Vous)
**Traite** : Questions générales, bugs mineurs, guidage utilisateurs

**Temps de réponse** : < 2h (heures ouvrées)

**Tools** :
- Scripts de support (ce document)
- FAQ
- Documentation utilisateur

---

### Niveau 2 : VB (Développement)
**Traite** : Bugs majeurs (P2), features requests, questions techniques avancées

**Quand escalader** :
- Bug reproductible non documenté
- Comportement inattendu de l'application
- Demande de feature

**Comment escalader** :
```
Subject: [SUPPORT] [P2] [Titre bug]

User email: [email]
User ID: [id Supabase]
Organization ID: [id]

Description :
[Description problème]

Steps to reproduce :
1. [Étape 1]
2. [Étape 2]
3. [Résultat observé]

Expected :
[Résultat attendu]

Attachments :
- Screenshot : [link]
- Logs : [copier logs]
```

**Temps de réponse VB** : < 4h (P2), < 24h (P3)

---

### Niveau 3 : DevOps
**Traite** : Incidents production, downtime, erreurs serveur, problèmes infra

**Quand escalader** :
- Downtime > 5 min
- Taux d'erreur > 10%
- Latence > 3s
- Problème Supabase/Vercel

**Comment escalader** :
```
🚨 INCIDENT PRODUCTION 🚨

Severity: [P1/P2]
Start time: [HH:MM]
Impact: [Users affectés]

Symptoms :
[Description]

Metrics :
- Uptime : [%]
- Latence : [ms]
- Taux d'erreur : [%]

Logs :
[Copier logs pertinents]
```

**Channel** : Slack #incidents + SMS si P1

**Temps de réponse DevOps** : Immédiat (P1), < 1h (P2)

---

## 📊 Monitoring Tickets

### Metrics à suivre (première semaine)
| Métrique | Baseline | Seuil alerte |
|----------|----------|--------------|
| Volume tickets | [X]/jour | +50% |
| Temps de réponse | < 2h | > 4h |
| Taux de résolution | > 80% | < 70% |
| Tickets escaladés | < 10% | > 20% |

### Tags à utiliser
- `version:[X.Y.Z]` : Tous les tickets liés à cette release
- `feature:[nom]` : Tickets sur une feature spécifique
- `bug:[severity]` : P1/P2/P3/P4
- `question` : Question générale
- `feature-request` : Demande de feature

### Dashboard support
```
📊 Support Dashboard - Version [X.Y.Z]

Volume tickets (7 jours) : [X]
- Questions : [X] ([%])
- Bugs : [X] ([%])
- Feature requests : [X] ([%])

Temps de réponse médian : [X]h
Taux de résolution : [X]%
Tickets escaladés : [X] ([%])

Top 3 problèmes :
1. [Problème 1] : [X] tickets
2. [Problème 2] : [X] tickets
3. [Problème 3] : [X] tickets
```

---

## 📚 Ressources

- **Documentation** : docs.powalyze.com
- **Release Notes** : [Link](link)
- **Migration Guide** : [Link](link) (si breaking changes)
- **Status Page** : status.powalyze.com
- **Slack Support** : #support-team

---

## ✅ Checklist Préparation Support

- [ ] Lu les release notes : ✅
- [ ] Testé les nouvelles features : ✅
- [ ] Mémorisé les scripts de support : ✅
- [ ] Dashboard monitoring configuré : ✅
- [ ] Escalation matrix imprimée : ✅
- [ ] Channel Slack actif : ✅

---

**Version** : [X.Y.Z]  
**Date** : [JJ/MM/AAAA]  
**Support Manager** : [Nom]

---

_Powalyze Support Team - Toujours là pour vous_
