# 🚀 Quick Start - Power BI Embedded dans Powalyze

**Pour les pressés** : Commandes à exécuter après la configuration Azure

---

## ⚡ Configuration express (5 étapes)

### 1️⃣ Variables d'environnement

Ajoutez dans **`.env.local`** :

```env
# Power BI Embedded
POWERBI_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
POWERBI_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
POWERBI_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
POWERBI_WORKSPACE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 2️⃣ Table Supabase

```bash
# Dans Supabase SQL Editor, exécutez :
cat database/power-bi-reports.sql
# Puis copiez-collez dans SQL Editor et cliquez "Run"
```

### 3️⃣ Redémarrer l'application

```bash
# Arrêtez le serveur (Ctrl+C dans le terminal)
npm run dev
```

### 4️⃣ Tester localement

1. Ouvrez [http://localhost:3000/cockpit/rapports](http://localhost:3000/cockpit/rapports)
2. Cliquez "Importer un rapport Power BI"
3. Uploadez un fichier `.pbix`
4. Cliquez "Ouvrir" sur le rapport importé
5. ✅ Le viewer Power BI doit s'afficher

### 5️⃣ Déployer en production

```bash
npx vercel --prod --yes
```

**⚠️ N'oubliez pas** : Ajoutez aussi les 4 variables d'environnement dans Vercel (Settings → Environment Variables)

---

## 📖 Guides complets

Si vous rencontrez des problèmes ou voulez comprendre l'architecture :

| Guide | Contenu |
|-------|---------|
| **[POWER_BI_EMBEDDED_README.md](./POWER_BI_EMBEDDED_README.md)** | Démarrage rapide + checklist |
| **[POWER_BI_EMBEDDED_SETUP.md](./POWER_BI_EMBEDDED_SETUP.md)** | Configuration Azure complète |
| **[POWER_BI_EMBEDDED_IMPLEMENTATION.md](./POWER_BI_EMBEDDED_IMPLEMENTATION.md)** | Architecture technique |
| **[POWER_BI_EMBEDDED_SYNTHESE_FINALE.md](./POWER_BI_EMBEDDED_SYNTHESE_FINALE.md)** | Synthèse complète |

---

## 🎯 Résultat attendu

Après configuration, Powalyze peut :

✅ Importer des fichiers `.pbix`  
✅ Afficher des rapports Power BI avec interactions complètes  
✅ Naviguer entre pages, filtrer, slicer  
✅ Exporter en PDF  
✅ Supprimer des rapports  
✅ Rafraîchir les données  

**C'est un mini Power BI Service intégré !** 🚀

---

**Besoin d'aide ?** → Lisez [POWER_BI_EMBEDDED_SETUP.md](./POWER_BI_EMBEDDED_SETUP.md)
