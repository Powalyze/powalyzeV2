# 🚀 Guide Rapide - Tester les Intégrations

## 1️⃣ Appliquer la Migration Database

### Option A: Via Supabase Dashboard (Recommandé)
```
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans SQL Editor
4. Nouvelle query
5. Copiez le contenu de: database/migrations/add-integrations-table.sql
6. Cliquez Run
```

### Option B: Via PowerShell
```powershell
.\apply-integrations-migration.ps1
```

### Option C: Via psql
```bash
psql $DATABASE_URL -f database/migrations/add-integrations-table.sql
```

## 2️⃣ Accéder à la Page

```
http://localhost:3000/cockpit/integrations
# ou
https://www.powalyze.com/cockpit/integrations
```

## 3️⃣ Tester une Intégration

### Exemple: Connecter Slack

1. **Cliquez** sur le bouton "Connecter" de la carte Slack
2. **Modal s'ouvre** avec le formulaire
3. **Remplissez**:
   - Webhook URL: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX`
   - Channel: `#general` (optionnel)
4. **Cliquez** "Sauvegarder & Connecter"
5. **Vérifiez**:
   - ✅ Toast de succès apparaît
   - ✅ Badge change en "Connecté" (vert)
   - ✅ Timestamp "À l'instant" affiché
   - ✅ Boutons deviennent "Configurer" et "Déconnecter"

### Exemple: Reconfigurer Jira

1. **Connectez** d'abord Jira (API Key + Domain + Email)
2. **Cliquez** "Configurer" sur la carte Jira
3. **Modifiez** un champ (ex: email)
4. **Sauvegardez**
5. **Vérifiez** que la config est bien mise à jour

### Exemple: Déconnecter GitHub

1. Sur une intégration connectée, **cliquez** "Déconnecter"
2. **Confirmez** dans la popup
3. **Vérifiez**:
   - ✅ Toast "Déconnecté"
   - ✅ Badge "Non connecté" (gris)
   - ✅ Bouton redevient "Connecter"

## 4️⃣ Vérifier dans Supabase

### Via Table Editor
```
1. Dashboard Supabase → Table Editor
2. Sélectionnez la table "integrations"
3. Vous devriez voir vos intégrations configurées
```

### Via SQL
```sql
SELECT 
  integration_name,
  enabled,
  config,
  last_sync
FROM integrations 
WHERE organization_id = 'YOUR_ORG_ID';
```

## 5️⃣ Points de Validation

### ✅ Checklist Fonctionnelle

- [ ] La page charge sans erreur
- [ ] Les 6 intégrations sont affichées
- [ ] Stats en haut sont dynamiques
- [ ] Bouton "Synchroniser tout" fonctionne (animation spinner)
- [ ] Modal s'ouvre au clic sur "Connecter"
- [ ] Formulaires sont personnalisés par intégration
- [ ] Champs requis sont marqués avec *
- [ ] Sauvegarde fonctionne et affiche toast
- [ ] État "Connecté" est persisté (refresh page)
- [ ] Bouton "Déconnecter" demande confirmation
- [ ] Configuration peut être ré-ouverte et modifiée

### ✅ Checklist Sécurité

- [ ] API Keys ne sont pas visibles en clair (type="password")
- [ ] Les données sont isolées par organization_id
- [ ] RLS policies empêchent accès inter-organisations
- [ ] Pas d'erreurs CORS ou 401 dans la console

### ✅ Checklist UX

- [ ] Modals ont animations smooth
- [ ] Toasts apparaissent et disparaissent
- [ ] Loading states sont visibles
- [ ] Couleurs et badges sont cohérents
- [ ] Mobile responsive (si applicable)

## 🐛 Troubleshooting

### Erreur: "Impossible de charger les intégrations"
**Cause**: Table `integrations` n'existe pas ou RLS bloque
**Solution**: 
1. Appliquer la migration
2. Vérifier policies RLS
3. Vérifier que l'utilisateur a un `organization_id` dans `profiles`

### Erreur: "Non authentifié"
**Cause**: Session Supabase expirée
**Solution**: Se reconnecter

### Modal ne s'ouvre pas
**Cause**: Erreur JavaScript dans la console
**Solution**: 
1. Ouvrir DevTools Console
2. Vérifier les erreurs
3. Vérifier que `useToast` est disponible

### Config ne se sauvegarde pas
**Cause**: Erreur RLS ou champs manquants
**Solution**:
1. Console → Network → Voir erreur API
2. Vérifier que tous les champs requis sont remplis
3. Vérifier policies RLS

## 📊 Données de Test

### Jira (Fake)
```
API Key: fake_jira_key_12345
Domain: test-company.atlassian.net
Email: test@company.com
```

### Slack (Fake)
```
Webhook URL: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
Channel: #test-powalyze
```

### GitHub (Fake)
```
Access Token: ghp_faketoken1234567890abcdefgh
Repository: company/powalyze
```

### Power BI (Fake)
```
Client ID: 12345678-1234-1234-1234-123456789abc
Client Secret: fake~secret~12345
Tenant ID: 87654321-4321-4321-4321-cba987654321
Workspace ID: abcd1234-5678-90ef-ghij-klmnopqrstuv
```

---

**💡 Conseil**: Commencez par tester en local avant de déployer en prod !
