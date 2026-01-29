# Configuration Environnement PACK 2 - Cockpit DEMO vs LIVE

## 📋 Vue d'ensemble

Le système Powalyze utilise maintenant une **architecture double-mode** pour séparer complètement les données de démonstration des données clients réelles.

### Modes disponibles

| Mode | Route | Source de données | Usage |
|------|-------|-------------------|-------|
| **DEMO** | `/cockpit/demo` | `supabaseDemo` → localStorage fallback | Démo commerciale, showcase, tests |
| **LIVE** | `/cockpit` | `supabaseProd` obligatoire | Clients réels, production |

---

## 🔧 Configuration Supabase

### Option 1: Configuration minimale (Production uniquement)

Pour démarrer rapidement avec uniquement le mode LIVE:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_PROD_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY=eyJxxx...
SUPABASE_PROD_SERVICE_ROLE_KEY=eyJxxx...
JWT_SECRET=your_jwt_secret_here_minimum_32_characters
```

✅ **Résultat**:
- `/cockpit` → Connecté à votre base Supabase production
- `/cockpit/demo` → Utilise localStorage avec 3 projets factices

---

### Option 2: Configuration complète (DEMO + PROD séparés)

Pour une isolation totale avec 2 projets Supabase distincts:

```env
# .env.local

# 1. Supabase DEMO (données de démo persistantes)
NEXT_PUBLIC_SUPABASE_DEMO_URL=https://demo-project.supabase.co
NEXT_PUBLIC_SUPABASE_DEMO_ANON_KEY=eyJxxx...
SUPABASE_DEMO_SERVICE_ROLE_KEY=eyJxxx...

# 2. Supabase PRODUCTION (données clients)
NEXT_PUBLIC_SUPABASE_PROD_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY=eyJxxx...
SUPABASE_PROD_SERVICE_ROLE_KEY=eyJxxx...

# 3. Auth
JWT_SECRET=your_jwt_secret_here_minimum_32_characters
```

✅ **Résultat**:
- `/cockpit/demo` → Base Supabase dédiée avec données de démo
- `/cockpit` → Base Supabase séparée pour clients

---

### Option 3: Fallback (Legacy - compatibilité)

Si aucune variable DEMO/PROD n'est définie:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://main-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

⚠️ **Comportement**:
- `/cockpit` → Utilise la base principale
- `/cockpit/demo` → Fallback localStorage (pas de persistance)

---

## 🗂️ Architecture technique

### Clients Supabase

```typescript
// lib/supabase/demoClient.ts
export const supabaseDemo = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_DEMO_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  // ...
);

// lib/supabase/prodClient.ts
export const supabaseProd = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  // ...
);
```

### Hook useProjects

```typescript
import { useProjects } from '@/hooks/useProjects';

function Cockpit({ mode }: { mode: 'demo' | 'live' }) {
  const { projects, isLoading, error, createProject, refetch } = useProjects({ mode });
  
  // Mode DEMO: supabaseDemo → localStorage fallback
  // Mode LIVE: supabaseProd (obligatoire)
}
```

### Stratégie de fallback (mode DEMO uniquement)

```typescript
// hooks/useProjects.ts
if (mode === 'demo') {
  // 1. Essayer Supabase DEMO
  const { data } = await supabaseDemo.from('projects').select('*');
  
  // 2. Si vide ou erreur → localStorage
  if (!data || data.length === 0) {
    const stored = localStorage.getItem('demo_projects');
    if (stored) return JSON.parse(stored);
    
    // 3. Sinon → 3 projets hardcodés
    return DEMO_PROJECTS;
  }
}
```

---

## 📱 Mode Mobile

### Détection automatique

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery';

const isMobile = useMediaQuery('(max-width: 768px)');

if (mode === 'live' && isMobile) {
  return <CockpitMobile />;  // Layout mobile dédié
}
```

### Layout mobile (`CockpitMobile.tsx`)

**Caractéristiques**:
- ✅ Pas de sidebar
- ✅ Header compact
- ✅ Bottom navigation (4 onglets)
- ✅ Cartes plein écran
- ✅ Optimisé pour touch

**Navigation mobile**:
1. **Projets** (`/cockpit`) - Icône: FolderKanban
2. **Risques** (`/cockpit/risques`) - Icône: Shield  
3. **Décisions** (`/cockpit/decisions`) - Icône: CheckSquare
4. **Profil** (`/cockpit/profil`) - Icône: User

---

## 🔐 Sécurité RLS (Row Level Security)

### Règles de base à créer sur Supabase

```sql
-- 1. Organisations: Utilisateurs voient uniquement leur org
CREATE POLICY "Users can read their own organization"
  ON organizations FOR SELECT
  USING (id IN (
    SELECT organization_id FROM memberships WHERE user_id = auth.uid()
  ));

-- 2. Projets: Isolation par organization_id
CREATE POLICY "Users can read organization projects"
  ON projects FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM memberships WHERE user_id = auth.uid()
  ));

-- 3. Projets: Création uniquement dans son org
CREATE POLICY "Users can create projects in their organization"
  ON projects FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM memberships WHERE user_id = auth.uid()
  ));

-- 4. Projets: Modification uniquement dans son org
CREATE POLICY "Users can update organization projects"
  ON projects FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM memberships WHERE user_id = auth.uid()
  ));

-- 5. Risques: Liés aux projets de l'org
CREATE POLICY "Users can read organization risks"
  ON risks FOR SELECT
  USING (project_id IN (
    SELECT id FROM projects WHERE organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  ));
```

---

## 🧪 Tests d'isolation

### Checklist de validation

#### Mode DEMO (`/cockpit/demo`)
- [ ] Affiche 3 projets hardcodés si localStorage vide
- [ ] Projets créés sauvegardés dans localStorage
- [ ] Aucune donnée ne va dans Supabase PROD
- [ ] Fonctionne SANS variables d'environnement
- [ ] Badge "Mode Démo" visible en développement

#### Mode LIVE (`/cockpit`)
- [ ] Affiche uniquement les projets Supabase PROD
- [ ] Création de projet enregistrée dans Supabase PROD
- [ ] Empty state si aucun projet
- [ ] Aucune donnée de DEMO visible
- [ ] Mode mobile activé sur viewport < 768px
- [ ] Bottom nav fonctionnelle (4 onglets)

#### Isolation
- [ ] Données DEMO ≠ Données LIVE
- [ ] localStorage DEMO isolé du LIVE
- [ ] Supabase DEMO ≠ Supabase PROD (si configurés)
- [ ] Aucun mélange de données entre modes

---

## 📦 Déploiement Vercel

### Variables d'environnement à configurer

1. **Aller dans Vercel Dashboard** → Projet Powalyze → Settings → Environment Variables

2. **Ajouter ces variables**:

```
NEXT_PUBLIC_SUPABASE_PROD_URL = https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY = eyJxxx...
SUPABASE_PROD_SERVICE_ROLE_KEY = eyJxxx...
JWT_SECRET = [générer avec: openssl rand -base64 32]
```

3. **Variables optionnelles (DEMO dédié)**:

```
NEXT_PUBLIC_SUPABASE_DEMO_URL = https://demo-project.supabase.co
NEXT_PUBLIC_SUPABASE_DEMO_ANON_KEY = eyJxxx...
SUPABASE_DEMO_SERVICE_ROLE_KEY = eyJxxx...
```

4. **Redéployer**:
```bash
npx vercel --prod --yes
```

---

## 🚀 Commandes de développement

### Démarrage local
```bash
npm run dev
# Accès:
# - LIVE: http://localhost:3000/cockpit
# - DEMO: http://localhost:3000/cockpit/demo
```

### Build de production
```bash
npm run build
npm run start
```

### Déploiement
```bash
npx vercel --prod --yes
```

---

## 📚 Fichiers créés (PACK 2)

| Fichier | Description |
|---------|-------------|
| `lib/supabase/demoClient.ts` | Client Supabase pour mode DEMO |
| `lib/supabase/prodClient.ts` | Client Supabase pour mode LIVE |
| `hooks/useProjects.ts` | Hook de gestion projets avec mode switching |
| `components/cockpit/CockpitMobile.tsx` | Layout mobile avec bottom nav |
| `components/cockpit/Cockpit.tsx` | ✏️ Modifié - Utilise `useProjects` |
| `.env.example` | ✏️ Modifié - Variables DEMO/PROD ajoutées |

---

## 🐛 Dépannage

### Problème: "Cannot connect to Supabase"
**Solution**: Vérifier que `NEXT_PUBLIC_SUPABASE_PROD_URL` est défini dans `.env.local`

### Problème: "Projects not loading in LIVE mode"
**Solution**: 
1. Vérifier que la table `projects` existe dans Supabase PROD
2. Exécuter `database/schema.sql` si besoin

### Problème: "Demo projects appear in LIVE mode"
**Solution**: 
1. Vider le cache localStorage: `localStorage.clear()`
2. Vérifier que le composant reçoit bien `mode="live"`

### Problème: "Mobile layout not showing"
**Solution**: 
1. Tester avec viewport < 768px
2. Vérifier que `useMediaQuery` fonctionne
3. Console: `window.innerWidth` doit être < 768

---

## ✅ Checklist finale

### Développeur
- [ ] Variables d'environnement configurées dans `.env.local`
- [ ] `npm run build` réussit sans erreur
- [ ] Tests manuels DEMO et LIVE
- [ ] Tests sur mobile (Chrome DevTools)
- [ ] Pas de mélange de données entre modes

### DevOps
- [ ] Variables Vercel configurées
- [ ] Déploiement réussi
- [ ] Tests sur production (www.powalyze.com)
- [ ] Monitoring activé

### Product Owner
- [ ] `/cockpit/demo` accessible pour démos commerciales
- [ ] `/cockpit` prêt pour onboarding clients
- [ ] Documentation à jour
- [ ] Formation équipe commerciale effectuée

---

## 📞 Support

Pour toute question sur la configuration:
1. Consulter: `README.md`, `MIGRATION_GUIDE.md`, `GUIDE-NOUVEAU-CLIENT.md`
2. Vérifier les logs: `npm run dev` (console browser)
3. Contact: [support technique]

---

**Dernière mise à jour**: PACK 2 - Architecture DEMO/LIVE complète
**Version**: Powalyze Cockpit v2.0
