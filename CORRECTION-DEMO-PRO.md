# 🔧 CORRECTION INVERSION DEMO/PRO - GUIDE COMPLET

## 📋 Problème Identifié

L'architecture DEMO/PRO était inversée après déploiement:
- ❌ **MODE DEMO** était vide (0 projet) - devait contenir des données mock
- ❌ **MODE PRO** contenait 12 projets - devait être vierge
- ❌ Pas d'accès clair aux modes dans la navigation

## ✅ Solution Appliquée

### 1️⃣ Migration des Données (CRITIQUE)

**Fichiers créés:**
- `database/migrate-demo-pro-fix.sql` - Script SQL de migration
- `migrate-demo-pro-fix.ps1` - Script PowerShell d'exécution

**Actions effectuées:**
```sql
-- Copier projects → demo_projects (12 projets)
-- Copier risks → demo_risks
-- Copier decisions → demo_decisions
-- Copier anomalies → demo_anomalies
-- Copier reports → demo_reports
-- Copier connectors → demo_connectors
-- VIDER toutes les tables PRO (projects, risks, decisions, etc.)
```

**Exécution:**
```powershell
.\migrate-demo-pro-fix.ps1
```

Le script:
1. Demande le mot de passe PostgreSQL Supabase
2. Se connecte à la base de données
3. Exécute la migration avec transaction (BEGIN/COMMIT)
4. Affiche les résultats avant/après
5. Vérifie l'état final des tables

### 2️⃣ Navigation - Liens DEMO/PRO Explicites

**Fichiers modifiés:**

#### `components/layout/Sidebar.tsx`
Ajout d'une section "Environnement" avec:
- ✅ Lien "MODE PRO" → `/cockpit` (emerald gradient si actif)
- ✅ Lien "MODE DÉMO" → `/cockpit-demo` (blue gradient si actif)
- ✅ Badge "Actif" sur le mode en cours
- ✅ Animation pulse sur le mode actif

#### `components/layout/Topbar.tsx`
Ajout d'un Mode Switcher:
- ✅ Bouton "MODE PRO" (emerald, lien vers /cockpit)
- ✅ Bouton "MODE DÉMO" (gray, lien vers /cockpit-demo)
- ✅ Tooltips explicatifs pour chaque mode

#### `app/cockpit-demo/layout.tsx`
Ajout d'un lien "MODE PRO" à côté du badge "MODE DÉMO":
- ✅ Lien cliquable vers /cockpit
- ✅ Badge "Actif" sur MODE DÉMO
- ✅ Design cohérent avec le reste de l'interface

### 3️⃣ Guards & Sécurité

**Fichier créé:** `lib/guards.ts`

Fonctions de protection:
- ✅ `getUserMode()` - Récupère le mode depuis profiles.mode
- ✅ `guardProRoute()` - Bloque l'accès PRO si utilisateur en mode demo
- ✅ `guardDemoRoute()` - Bloque l'accès DEMO si utilisateur en mode pro
- ✅ `guardResourceAccess()` - Empêche les fuites de données entre tables demo_* et tables réelles

**Utilisation dans les pages:**
```typescript
import { guardDemoRoute } from '@/lib/guards';

export default async function Page() {
  await guardDemoRoute(); // Redirige si utilisateur en mode PRO
  // ... reste de la page
}
```

### 4️⃣ Vérification du Routing

**Architecture confirmée:**

```
/cockpit (MODE PRO)
├── Utilise: actions/pro/* (tables réelles)
├── Tables: projects, risks, decisions, anomalies, reports, connectors
├── État: VIERGE (0 donnée après migration)
└── Guard: guardProRoute() (bloque mode demo)

/cockpit-demo (MODE DEMO)
├── Utilise: actions/demo/* (tables demo_*)
├── Tables: demo_projects, demo_risks, demo_decisions, demo_anomalies, demo_reports, demo_connectors
├── État: PRÉ-REMPLI (12 projets + données associées après migration)
└── Guard: guardDemoRoute() (bloque mode pro)
```

**Server Actions vérifiées:**
- ✅ `/cockpit-demo` → `getDemoRisks()` → `demo_risks`
- ✅ `/cockpit` → `getProRisks()` → `risks`
- ✅ Idem pour decisions, anomalies, reports, connectors

## 📊 État Final Attendu

### Tables DEMO (demo_*)
```
demo_projects: ~12 projets
demo_risks: N risques associés
demo_decisions: N décisions associées
demo_anomalies: N anomalies associées
demo_reports: N rapports associés
demo_connectors: N connecteurs associés
```

### Tables PRO (réelles)
```
projects: 0 (vierge)
risks: 0 (vierge)
decisions: 0 (vierge)
anomalies: 0 (vierge)
reports: 0 (vierge)
connectors: 0 (vierge)
```

## 🚀 Déploiement

### Étapes de déploiement:

1. **Exécuter la migration SQL:**
   ```powershell
   .\migrate-demo-pro-fix.ps1
   ```

2. **Vérifier l'état des tables:**
   ```sql
   SELECT COUNT(*) FROM demo_projects; -- Doit être ~12
   SELECT COUNT(*) FROM projects;      -- Doit être 0
   ```

3. **Commit des changements:**
   ```bash
   git add .
   git commit -m "fix: Correction inversion DEMO/PRO + navigation + guards"
   git push
   ```

4. **Build et déploiement:**
   ```bash
   npm run build
   npx vercel --prod --yes
   ```

## 🧪 Tests de Vérification

### Test 1: Navigation DEMO/PRO
- ✅ Cliquer sur "MODE PRO" dans la sidebar → Redirection vers /cockpit
- ✅ Cliquer sur "MODE DÉMO" dans la sidebar → Redirection vers /cockpit-demo
- ✅ Vérifier que le badge "Actif" suit le mode courant

### Test 2: Données DEMO
- ✅ Aller sur /cockpit-demo/portefeuille → Doit afficher ~12 projets
- ✅ Aller sur /cockpit-demo/risques → Doit afficher les risques associés
- ✅ Créer un nouveau risque → Doit fonctionner (table demo_risks)

### Test 3: Données PRO (vierges)
- ✅ Aller sur /cockpit → Dashboard vide (0 projet)
- ✅ Créer un nouveau projet → Doit fonctionner (table projects vierge)
- ✅ Vérifier qu'aucune donnée DEMO n'apparaît

### Test 4: Guards
- ✅ Utilisateur mode demo → Accès /cockpit refusé (redirection vers /cockpit-demo)
- ✅ Utilisateur mode pro → Accès /cockpit-demo refusé (redirection vers /cockpit)
- ✅ Vérifier les logs console pour les messages de guard

### Test 5: Server Actions
- ✅ Formulaire /cockpit-demo/risques/nouveau → Appelle createDemoRisk()
- ✅ Formulaire /cockpit/risques/nouveau → Appelle createProRisk()
- ✅ Vérifier dans la BDD que les données vont dans les bonnes tables

## 📦 Fichiers Livrés

### SQL
- ✅ `database/migrate-demo-pro-fix.sql` (134 lignes)

### Scripts
- ✅ `migrate-demo-pro-fix.ps1` (142 lignes)

### Guards
- ✅ `lib/guards.ts` (108 lignes)

### UI Modifiés
- ✅ `components/layout/Sidebar.tsx` (ajout Mode Switcher)
- ✅ `components/layout/Topbar.tsx` (ajout boutons DEMO/PRO)
- ✅ `app/cockpit-demo/layout.tsx` (ajout lien MODE PRO)

### Documentation
- ✅ `CORRECTION-DEMO-PRO.md` (ce fichier)

## ⚠️ Avertissements

### Migration SQL
- ⚠️ **IRRÉVERSIBLE** sans backup
- ⚠️ Vider les tables PRO = **perte de données définitive**
- ⚠️ Toujours tester en staging avant production

### Profiles.mode
- ⚠️ Les utilisateurs doivent avoir une colonne `mode` dans la table `profiles`
- ⚠️ Valeurs attendues: `'demo'` ou `'pro'`
- ⚠️ Par défaut: `'demo'` si non défini

### Guards
- ⚠️ Les guards nécessitent une session authentifiée
- ⚠️ Si pas de session → Redirection vers `/login`
- ⚠️ Vérifier que `profiles.mode` est bien rempli pour tous les users

## 🎯 Résultat Final

✅ **MODE DEMO** contient les données mock (12 projets)  
✅ **MODE PRO** est complètement vierge (0 projet)  
✅ Navigation claire avec liens DEMO/PRO explicites  
✅ Guards empêchent les fuites de données  
✅ Routing correct: /cockpit → PRO, /cockpit-demo → DEMO  
✅ Server actions correctement séparées (demo_* vs tables réelles)  
✅ Architecture DEMO/PRO complètement fonctionnelle  

## 📞 Support

En cas de problème:
1. Vérifier les logs du script de migration
2. Vérifier l'état des tables dans Supabase Dashboard
3. Vérifier les logs console (messages [Guard])
4. Vérifier que profiles.mode est défini pour tous les users

---

**Date de création:** 26 janvier 2026  
**Version:** 1.0.0  
**Status:** ✅ COMPLET - Prêt pour déploiement
