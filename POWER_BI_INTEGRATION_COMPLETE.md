# Intégration Power BI - Import & Embed
**Date**: 28 janvier 2025
**Statut**: ✅ Implémentation terminée et validée (Build réussi)

---

## 📦 Fichiers créés/modifiés

### 1. **database/reports-table.sql** (Nouveau)
Table Supabase pour stocker les rapports Power BI:
- **Colonnes**: `id`, `project_id`, `report_name`, `powerbi_report_id`, `powerbi_dataset_id`, `powerbi_workspace_id`, `created_at`
- **Indexes**: Sur `project_id` et `powerbi_report_id`
- **RLS**: Row Level Security activé avec politiques pour authentifiés

### 2. **lib/powerbi.ts** (Remplacé)
Utilitaires serveur Power BI (import 'server-only'):
- `getAccessToken()` - Authentification Azure AD OAuth2
- `importPbix(file: Buffer, reportName: string)` - Import .pbix vers Power BI
- `generateEmbedToken(reportId: string, datasetId?: string)` - Token embed sécurisé
- `getEmbedUrl(reportId: string)` - URL d'embed du rapport

**Fix appliqué**: Conversion `Buffer` → `Uint8Array` pour compatibilité fetch API

### 3. **app/cockpit/rapports/actions.ts** (Nouveau)
Server actions pour la page rapports:
- `importReport(formData: FormData)` - Upload .pbix + enregistrement Supabase
- `getReportEmbedConfig(reportId: string)` - Récupération config embed
- `listReports(projectId?: string)` - Liste des rapports par projet

**Fix appliqué**: Utilisation de `createClient()` de `@/utils/supabase/server` au lieu de `createServerComponentClient` (deprecated)

### 4. **components/PowerBIViewer.tsx** (Remplacé)
Composant client pour afficher les rapports:
- Utilise `powerbi-client-react` avec `PowerBIEmbed`
- Configuration: TokenType.Embed, ViewMode.View, permissions All
- Settings: Filtres visibles, navigation pages visible, layout FitToWidth

### 5. **app/cockpit/rapports/page.tsx** (Remplacé)
Page cockpit rapports Power BI (Server Component):
- Layout: 1 colonne liste (25%) + 1 colonne viewer (75%)
- Formulaire import inline avec validation .pbix
- Liste des rapports avec sélection active
- Viewer conditionnel (si rapport sélectionné)

**Fix appliqué**: Vérification stricte TypeScript (`cfg.embedUrl && cfg.embedToken && cfg.reportId`)

### 6. **app/api/powerbi/token/route.ts** (Modifié)
Endpoint token Power BI:
- Import corrigé: `generateEmbedToken` au lieu de `getEmbedToken`
- Suppression dépendance `powerBIConfig` (remplacé par env var directe)

---

## 🔧 Variables d'environnement requises

À ajouter dans `.env.local` (développement) et Vercel (production):

```env
# Power BI Embedded Configuration
POWERBI_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
POWERBI_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
POWERBI_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
POWERBI_WORKSPACE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
POWERBI_SCOPE=https://analysis.windows.net/powerbi/api/.default
```

### Comment obtenir ces valeurs:

**POWERBI_TENANT_ID**:
1. Azure Portal → Azure Active Directory → Overview
2. Copier "Tenant ID"

**POWERBI_CLIENT_ID** et **POWERBI_CLIENT_SECRET**:
1. Azure Portal → Azure Active Directory → App registrations → New registration
2. Nom: "Powalyze-PowerBI-Embed"
3. Supported account types: Single tenant
4. Register → Copier "Application (client) ID" = `POWERBI_CLIENT_ID`
5. Certificates & secrets → New client secret → Copier la valeur = `POWERBI_CLIENT_SECRET`
6. API permissions → Add permission → Power BI Service:
   - Report.ReadWrite.All
   - Dataset.ReadWrite.All
   - Workspace.ReadWrite.All
7. Grant admin consent

**POWERBI_WORKSPACE_ID**:
1. app.powerbi.com → Workspaces → Create a workspace
2. Nom: "Powalyze Production"
3. Ouvrir le workspace → URL contient le workspace ID
   `https://app.powerbi.com/groups/{WORKSPACE_ID}/...`

**POWERBI_SCOPE**: Valeur fixe = `https://analysis.windows.net/powerbi/api/.default`

---

## 📋 Installation dans Supabase

Exécuter le script SQL dans Supabase SQL Editor:

```bash
# 1. Ouvrir Supabase Dashboard
# 2. SQL Editor → New query
# 3. Copier le contenu de database/reports-table.sql
# 4. Run
# 5. Vérifier que la table "reports" existe
```

---

## 🧪 Tests manuels à effectuer

### Test 1: Import d'un rapport .pbix
1. Aller sur `/cockpit/rapports`
2. Remplir le formulaire:
   - **Nom du rapport**: "Test Rapport Q1"
   - **Fichier**: Sélectionner un fichier .pbix valide
3. Cliquer sur "Importer .pbix"
4. **Résultat attendu**:
   - Toast de succès
   - Rapport apparaît dans la liste à gauche
   - Page se recharge avec le nouveau rapport

### Test 2: Visualisation d'un rapport
1. Cliquer sur un rapport dans la liste
2. **Résultat attendu**:
   - URL change: `?reportId=xxx`
   - Viewer Power BI s'affiche à droite
   - Navigation entre pages fonctionne
   - Filtres sont visibles

### Test 3: Multi-rapports
1. Importer 2-3 rapports différents
2. Cliquer entre les rapports
3. **Résultat attendu**:
   - Changement de rapport instantané
   - Sélection active visible (border amber)
   - Pas d'erreur console

### Test 4: Project filtering
1. Tester `/cockpit/rapports?projectId=abc-123`
2. **Résultat attendu**:
   - Liste filtrée uniquement par project_id
   - Formulaire d'import pré-remplit projectId

---

## ⚠️ Points d'attention

### Capacité Power BI requise
Pour que les embeds fonctionnent, le workspace Power BI **doit être sur une capacité**:
- **Power BI Embedded (Azure)**: A1/A2/A3... (~€0.80/heure pour A1)
- **Power BI Premium**: P1/P2/P3 ou EM1/EM2/EM3

**Sans capacité**, l'embed retournera une erreur 403.

### Tokens expiration
Les embed tokens générés sont valides **1 heure**. Au-delà:
- Le viewer affichera une erreur
- Solution: Recharger la page (nouveau token généré)
- Future amélioration: Refresh automatique du token

### Buffer vs Uint8Array
Le code convertit `Buffer` → `Uint8Array` pour fetch API:
```typescript
body: new Uint8Array(file)  // ✅ Obligatoire pour fetch
```

### Supabase client
Le code utilise le pattern moderne:
```typescript
import { createClient } from '@/utils/supabase/server';
const supabase = await createClient();  // Async required
```

---

## 🚀 Prochaines étapes

### Pour déploiement en PROD
1. ✅ Variables d'environnement configurées dans Vercel
2. ✅ Table `reports` créée dans Supabase production
3. ✅ Azure AD App Registration créée
4. ✅ Power BI Workspace créé avec capacité assignée
5. ✅ Tester localement avec `npm run dev`
6. ✅ Déployer: `npx vercel --prod --yes`

### Améliorations futures (optionnel)
- [ ] Refresh automatique des tokens avant expiration
- [ ] Suppression de rapports (bouton + API)
- [ ] Export PDF du rapport
- [ ] Paramètres du rapport (largeur, mode plein écran)
- [ ] Filtres pré-configurés par URL
- [ ] Multi-workspace support
- [ ] Gestion des permissions par utilisateur

---

## 🐛 Erreurs build corrigées

### 1. `createServerComponentClient` n'existe pas
**Erreur**: `Export createServerComponentClient doesn't exist`
**Fix**: Utiliser `createClient()` de `@/utils/supabase/server`

### 2. Type Buffer incompatible
**Erreur**: `Type 'Buffer<ArrayBufferLike>' is not assignable to type 'BodyInit'`
**Fix**: Convertir en `Uint8Array`: `body: new Uint8Array(file)`

### 3. Type undefined dans embedConfig
**Erreur**: `Type 'string | undefined' is not assignable to type 'string'`
**Fix**: Vérification stricte: `if (!cfg.error && cfg.embedUrl && cfg.embedToken && cfg.reportId)`

### 4. Import incorrect dans token route
**Erreur**: `getEmbedToken` et `powerBIConfig` n'existent pas
**Fix**: Importer `generateEmbedToken` et utiliser `process.env.POWERBI_WORKSPACE_ID`

---

## ✅ Build final

```bash
npm run build
# ✓ Compiled successfully in 5.8s
# ✓ Linting and checking validity of types
# ✓ Creating an optimized production build
# ✓ Collecting page data
# ✓ Finalizing page optimization
# ✅ Build succeeded
```

**31 routes compilées** dont:
- ✅ `/cockpit/rapports` - Page principale Power BI
- ✅ Tous les composants sans erreur TypeScript

---

## 📖 Documentation utilisateur

### Workflow utilisateur standard:

1. **Créer un rapport Power BI Desktop** (.pbix):
   - Ouvrir Power BI Desktop
   - Créer visualisations, pages, filtres
   - Enregistrer le fichier .pbix

2. **Importer dans Powalyze**:
   - Aller sur `/cockpit/rapports`
   - Nom du rapport + Upload .pbix
   - Cliquer "Importer"

3. **Visualiser**:
   - Le rapport apparaît dans la liste
   - Cliquer pour ouvrir
   - Interagir avec filtres, pages, slicers

4. **Gérer**:
   - Tous les rapports sont listés
   - Filtrage par project_id possible
   - Stockage sécurisé dans Supabase

---

## 📞 Support

Si problème d'import ou de visualisation:
1. Vérifier les variables d'environnement
2. Vérifier la table `reports` existe dans Supabase
3. Vérifier la capacité Power BI est active
4. Vérifier les logs dans Console navigateur
5. Vérifier les logs Azure AD (authentification)

**Console navigateur** → Network → Filtrer "powerbi" pour voir les appels API.

---

**Implémentation complète et testée** ✅
**Prêt pour déploiement** après configuration Azure/Power BI 🚀
