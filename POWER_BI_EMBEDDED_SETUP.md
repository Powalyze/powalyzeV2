# 🔧 Configuration Power BI Embedded pour Powalyze

## 📋 Vue d'ensemble

Ce guide décrit **toutes les étapes** pour activer Power BI Embedded dans Powalyze et permettre :
- L'import de fichiers `.pbix`
- L'affichage de rapports Power BI directement dans l'application
- La gestion complète (CRUD) des rapports
- L'export en PDF

---

## 🎯 Prérequis

Avant de commencer, assurez-vous d'avoir :

✅ **Un compte Microsoft 365 avec Power BI Pro**  
✅ **Un abonnement Azure** (pour créer une App Registration)  
✅ **Un workspace Power BI** dédié à Powalyze  
✅ **Une capacité Power BI Embedded** (A1 minimum)  
✅ **Droits d'administrateur** sur Azure AD et Power BI

---

## 📝 Étape 1 : Créer une App Registration dans Azure

### 1.1 Accéder au portail Azure
1. Allez sur [https://portal.azure.com](https://portal.azure.com)
2. Connectez-vous avec votre compte administrateur

### 1.2 Créer l'application
1. Dans le menu, cliquez sur **Azure Active Directory**
2. Dans le menu latéral, cliquez sur **App registrations**
3. Cliquez sur **+ New registration**
4. Remplissez le formulaire :
   - **Name** : `Powalyze-PowerBI-Embedded`
   - **Supported account types** : `Accounts in this organizational directory only`
   - **Redirect URI** : Laissez vide pour l'instant
5. Cliquez sur **Register**

### 1.3 Récupérer les IDs
Une fois l'application créée, notez ces informations :

```
Application (client) ID : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Directory (tenant) ID : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 1.4 Créer un client secret
1. Dans le menu latéral de votre app, cliquez sur **Certificates & secrets**
2. Cliquez sur **+ New client secret**
3. Remplissez :
   - **Description** : `Powalyze Production Secret`
   - **Expires** : `24 months` (recommandé)
4. Cliquez sur **Add**
5. **⚠️ IMPORTANT** : Copiez immédiatement la **Value** du secret (vous ne pourrez plus la voir après)

```
Client Secret Value : xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 1.5 Configurer les permissions API
1. Dans le menu latéral, cliquez sur **API permissions**
2. Cliquez sur **+ Add a permission**
3. Sélectionnez **Power BI Service**
4. Sélectionnez **Delegated permissions**, puis cochez :
   - ✅ `Report.Read.All`
   - ✅ `Report.ReadWrite.All`
   - ✅ `Dataset.Read.All`
   - ✅ `Dataset.ReadWrite.All`
   - ✅ `Workspace.Read.All`
   - ✅ `Workspace.ReadWrite.All`
5. Cliquez sur **Add permissions**
6. **⚠️ CRITIQUE** : Cliquez sur **Grant admin consent for [YourOrganization]**
7. Confirmez en cliquant **Yes**

---

## 🏢 Étape 2 : Créer un workspace Power BI dédié

### 2.1 Accéder à Power BI Service
1. Allez sur [https://app.powerbi.com](https://app.powerbi.com)
2. Connectez-vous avec votre compte Power BI Pro

### 2.2 Créer le workspace
1. Dans le menu latéral, cliquez sur **Workspaces**
2. Cliquez sur **+ Create a workspace**
3. Remplissez :
   - **Workspace name** : `Powalyze-Production`
   - **Description** : `Workspace dédié aux rapports Powalyze`
   - **Advanced** → **License mode** : Sélectionnez **Embedded** si vous avez une capacité
4. Cliquez sur **Save**

### 2.3 Ajouter l'App Registration au workspace
1. Dans votre workspace, cliquez sur **Access** (en haut à droite)
2. Cliquez sur **+ Add**
3. Dans la barre de recherche, tapez le nom de votre app : `Powalyze-PowerBI-Embedded`
4. Sélectionnez-la et donnez-lui le rôle **Admin**
5. Cliquez sur **Add**

### 2.4 Récupérer l'ID du workspace
1. Dans votre workspace, cliquez sur **Settings** (icône engrenage)
2. Dans l'URL du navigateur, notez l'ID du workspace :
   ```
   https://app.powerbi.com/groups/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/settings
                                   └─────── Workspace ID ───────┘
   ```

---

## ⚡ Étape 3 : Créer une capacité Power BI Embedded

### 3.1 Option A : Capacité A (Azure)
**Avantage** : Facturation à l'heure, activable/désactivable à la demande

1. Dans Azure Portal, recherchez **Power BI Embedded**
2. Cliquez sur **+ Create**
3. Remplissez :
   - **Resource group** : Créez-en un nouveau `rg-powalyze-powerbi`
   - **Resource name** : `powalyze-embedded-capacity`
   - **Location** : Choisissez la même région que Supabase (ex: `West Europe`)
   - **Size** : Sélectionnez **A1** (le plus petit pour commencer)
   - **Power BI Administrator** : Votre email
4. Cliquez sur **Review + create** puis **Create**

**Coût estimé** : ~€0.80 / heure = ~€576 / mois si toujours allumé  
**Recommandation** : Activez-le uniquement aux heures de bureau (8h-18h) → ~€160 / mois

### 3.2 Option B : Capacité EM (Microsoft 365)
**Avantage** : Inclus dans certains abonnements Microsoft 365

1. Contactez votre revendeur Microsoft 365
2. Demandez une capacité **EM1** ou supérieure
3. Coût : ~€125 / mois (toujours actif)

### 3.3 Assigner la capacité au workspace
1. Retournez dans [Power BI Service](https://app.powerbi.com)
2. Allez dans votre workspace `Powalyze-Production`
3. Cliquez sur **Settings** → **Premium**
4. Activez **Workspace capacity**
5. Sélectionnez votre capacité créée
6. Cliquez sur **Apply**

---

## 🔐 Étape 4 : Configurer les variables d'environnement dans Powalyze

### 4.1 Variables à ajouter dans `.env.local` (développement)

```env
# ========================================
# Power BI Embedded Configuration
# ========================================

# Azure AD App Registration
POWERBI_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
POWERBI_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
POWERBI_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Power BI Workspace
POWERBI_WORKSPACE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 4.2 Variables à ajouter dans Vercel (production)

1. Allez sur [https://vercel.com](https://vercel.com)
2. Sélectionnez votre projet **powalyze-v2**
3. Cliquez sur **Settings** → **Environment Variables**
4. Ajoutez une par une :

| Variable | Value | Environment |
|----------|-------|-------------|
| `POWERBI_CLIENT_ID` | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | Production |
| `POWERBI_CLIENT_SECRET` | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Production |
| `POWERBI_TENANT_ID` | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | Production |
| `POWERBI_WORKSPACE_ID` | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | Production |

5. Cliquez sur **Save** pour chaque variable

---

## 🗄️ Étape 5 : Créer la table Supabase

### 5.1 Exécuter le script SQL
1. Connectez-vous à [Supabase](https://supabase.com)
2. Sélectionnez votre projet Powalyze
3. Dans le menu latéral, cliquez sur **SQL Editor**
4. Cliquez sur **+ New query**
5. Copiez-collez le contenu du fichier `database/power-bi-reports.sql`
6. Cliquez sur **Run**

### 5.2 Vérifier la création
1. Dans le menu latéral, cliquez sur **Database** → **Tables**
2. Vérifiez que la table `powerbi_reports` existe
3. Vérifiez les colonnes :
   - `id` (uuid, primary key)
   - `project_id` (uuid)
   - `organization_id` (uuid)
   - `report_name` (text)
   - `powerbi_report_id` (text)
   - `powerbi_dataset_id` (text)
   - `powerbi_workspace_id` (text)
   - `created_at`, `updated_at`, etc.

---

## 🧪 Étape 6 : Tester l'intégration

### 6.1 Redémarrer l'application en local
```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

### 6.2 Tester l'import d'un rapport
1. Allez sur [http://localhost:3000/cockpit/rapports](http://localhost:3000/cockpit/rapports)
2. Cliquez sur **"Importer un rapport Power BI"**
3. Sélectionnez un fichier `.pbix` de test
4. Remplissez le nom du rapport
5. Cliquez sur **"Importer dans Power BI"**

### 6.3 Vérifier les logs
Dans la console VS Code, vous devriez voir :
```
✅ Power BI Report loaded: [Nom du rapport]
📊 Power BI component embedded
```

### 6.4 Tester l'affichage
1. Le rapport devrait apparaître dans la liste
2. Cliquez sur **"Ouvrir"**
3. Le viewer Power BI devrait s'afficher avec :
   - Le rapport complet
   - Les filtres
   - La navigation entre pages
   - Les slicers interactifs

### 6.5 Tester les fonctionnalités
- ✅ **Rafraîchir** : Cliquez sur l'icône rafraîchir → Les données doivent se mettre à jour
- ✅ **Filtres** : Cliquez sur l'icône filtre → Le panneau des filtres doit s'afficher/masquer
- ✅ **Pages** : Cliquez sur l'icône pages → La navigation doit s'afficher/masquer
- ✅ **Plein écran** : Cliquez sur l'icône plein écran → Le rapport passe en plein écran
- ✅ **Export** : Cliquez sur l'icône export → Le rapport s'ouvre pour impression/PDF

---

## 🔒 Étape 7 : Sécurité et bonnes pratiques

### 7.1 Rotation des secrets
⚠️ **Important** : Les client secrets Azure expirent. Planifiez leur rotation.

1. Créez un rappel 1 mois avant l'expiration
2. Créez un nouveau secret dans Azure
3. Mettez à jour les variables d'environnement
4. Testez en production
5. Supprimez l'ancien secret

### 7.2 Permissions minimales
Assurez-vous que l'App Registration a **uniquement** les permissions nécessaires :
- ✅ `Report.ReadWrite.All`
- ✅ `Dataset.ReadWrite.All`
- ✅ `Workspace.ReadWrite.All`
- ❌ Pas de permissions supplémentaires

### 7.3 Row Level Security (RLS)
Pour isoler les données par client :

1. Dans Power BI Desktop, configurez RLS sur votre dataset
2. Créez des rôles (ex: `client_123`, `client_456`)
3. Lors de la génération de l'embed token, ajoutez l'identité :
   ```typescript
   identities: [{
     username: user.email,
     roles: [`client_${organizationId}`],
     datasets: [datasetId]
   }]
   ```

### 7.4 Monitoring
Activez les logs dans Azure :

1. Azure Portal → Votre App Registration
2. **Diagnostic settings** → **+ Add diagnostic setting**
3. Cochez **AuditLogs** et **SignInLogs**
4. Envoyez vers **Log Analytics Workspace**

---

## 💰 Coûts estimés

### Scénario 1 : Capacité A1 (pay-as-you-go)
- **Coût horaire** : €0.80 / heure
- **8h/jour, 20j/mois** : ~€128 / mois
- **24/7** : ~€576 / mois

### Scénario 2 : Capacité EM1 (fixe)
- **Coût mensuel** : ~€125 / mois (24/7)
- **Pas de surprise** : Coût fixe

### Recommandation pour démarrer
✅ **A1 avec activation/désactivation automatique**
- Activez via Azure Automation aux heures de bureau
- Économisez ~70% des coûts

---

## 🚨 Résolution de problèmes

### Erreur : "Configuration Power BI incomplète"
**Cause** : Variables d'environnement manquantes  
**Solution** : Vérifiez que les 4 variables sont définies dans `.env.local` ou Vercel

### Erreur : "Erreur d'authentification Azure AD"
**Cause** : Client ID ou Secret incorrect  
**Solution** : 
1. Vérifiez les valeurs dans Azure Portal
2. Recréez un client secret si nécessaire
3. Mettez à jour les variables d'environnement

### Erreur : "Erreur lors de l'import"
**Cause** : Permissions insuffisantes ou workspace non configuré  
**Solution** :
1. Vérifiez que l'App Registration est **Admin** du workspace
2. Vérifiez que le workspace a une capacité assignée
3. Vérifiez les permissions API dans Azure

### Erreur : "Unable to load the service index"
**Cause** : Capacité désactivée ou expirée  
**Solution** :
1. Vérifiez que la capacité A/EM est active
2. Vérifiez le statut dans Azure Portal
3. Redémarrez la capacité si nécessaire

### Le rapport ne s'affiche pas
**Cause** : Embed token expiré ou invalide  
**Solution** :
1. Les tokens expirent après 1h
2. Le composant doit régénérer un token automatiquement
3. Rechargez la page

---

## 📚 Ressources officielles

- [Documentation Power BI Embedded](https://learn.microsoft.com/en-us/power-bi/developer/embedded/)
- [API Reference](https://learn.microsoft.com/en-us/rest/api/power-bi/)
- [powerbi-client-react](https://github.com/microsoft/powerbi-client-react)
- [Azure AD App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

---

## ✅ Checklist finale

Avant de passer en production, vérifiez :

- [ ] App Registration créée dans Azure AD
- [ ] Client ID, Secret, et Tenant ID récupérés
- [ ] Permissions API accordées avec admin consent
- [ ] Workspace Power BI créé
- [ ] App Registration ajoutée comme Admin du workspace
- [ ] Capacité A1 ou EM1 créée et assignée au workspace
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Table `powerbi_reports` créée dans Supabase
- [ ] Import d'un rapport testé avec succès
- [ ] Affichage du rapport testé avec succès
- [ ] Filtres, navigation et interactions testés
- [ ] Export PDF testé
- [ ] Suppression de rapport testée
- [ ] Logs de monitoring activés dans Azure

---

## 🎉 Félicitations !

Votre intégration Power BI Embedded est maintenant complète.  
Powalyze peut importer, afficher et gérer des rapports Power BI comme un mini Power BI Service intégré ! 🚀
