# 🚀 PACK 2 - Quick Reference Card

## 🎯 En bref

**Architecture dual-mode** pour séparer DEMO et LIVE avec:
- Clients Supabase séparés
- Hook useProjects avec mode switching
- Layout mobile dédié au LIVE
- Bottom navigation 4 onglets

---

## 📱 URLs

| Mode | Desktop | Mobile |
|------|---------|--------|
| **DEMO** | `/cockpit/demo` → CockpitDashboard | `/cockpit/demo` → CockpitDashboard |
| **LIVE** | `/cockpit` → CockpitDashboard | `/cockpit` → **CockpitMobile** |

---

## 🔑 Variables d'environnement

### Minimum (LIVE uniquement)
```env
NEXT_PUBLIC_SUPABASE_PROD_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY=eyJxxx...
SUPABASE_PROD_SERVICE_ROLE_KEY=eyJxxx...
JWT_SECRET=xxx
```

### Complet (DEMO + LIVE séparés)
```env
# DEMO
NEXT_PUBLIC_SUPABASE_DEMO_URL=https://demo-xxx.supabase.co
NEXT_PUBLIC_SUPABASE_DEMO_ANON_KEY=eyJxxx...
SUPABASE_DEMO_SERVICE_ROLE_KEY=eyJxxx...

# LIVE
NEXT_PUBLIC_SUPABASE_PROD_URL=https://prod-xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY=eyJxxx...
SUPABASE_PROD_SERVICE_ROLE_KEY=eyJxxx...

# AUTH
JWT_SECRET=xxx
```

---

## 💻 Utilisation dans le code

### Hook useProjects

```typescript
import { useProjects } from '@/hooks/useProjects';

function MaPage() {
  const { projects, isLoading, error, createProject, refetch } = useProjects({ 
    mode: 'live'  // ou 'demo'
  });

  // Mode DEMO: supabaseDemo → localStorage → 3 projets hardcodés
  // Mode LIVE: supabaseProd uniquement
}
```

### Clients Supabase directs

```typescript
import { supabaseDemo } from '@/lib/supabase/demoClient';
import { supabaseProd } from '@/lib/supabase/prodClient';

// DEMO
const { data: demoProjects } = await supabaseDemo.from('projects').select('*');

// LIVE
const { data: liveProjects } = await supabaseProd.from('projects').select('*');
```

### Détection mobile

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery';

const isMobile = useMediaQuery('(max-width: 768px)');

if (mode === 'live' && isMobile) {
  return <CockpitMobile />;
}
```

---

## 🗂️ Fichiers importants

| Fichier | Rôle |
|---------|------|
| `lib/supabase/demoClient.ts` | Client DEMO avec fallback |
| `lib/supabase/prodClient.ts` | Client LIVE |
| `hooks/useProjects.ts` | Hook projets avec mode switching |
| `components/cockpit/CockpitMobile.tsx` | Layout mobile avec bottom nav |
| `components/cockpit/Cockpit.tsx` | ⭐ Composant principal |

---

## 🧪 Tests rapides

### En local
```bash
# 1. Démarrer
npm run dev

# 2. Tester DEMO desktop
http://localhost:3000/cockpit/demo

# 3. Tester LIVE mobile
# Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
http://localhost:3000/cockpit
```

### Checklist
- [ ] DEMO: 3 projets visibles sans variables env
- [ ] LIVE: Empty state si aucun projet
- [ ] Mobile: Bottom nav visible en LIVE < 768px
- [ ] Isolation: Données DEMO ≠ LIVE

---

## 🔧 Commandes

```bash
# Build
npm run build

# Déploiement Vercel
npx vercel --prod --yes

# Dev
npm run dev
```

---

## 🐛 Dépannage rapide

| Problème | Solution |
|----------|----------|
| "Cannot connect to Supabase" | Vérifier `NEXT_PUBLIC_SUPABASE_PROD_URL` |
| "Projects not loading" | Vérifier table `projects` existe |
| "Demo in LIVE mode" | `localStorage.clear()` |
| "Mobile layout not showing" | Viewport < 768px ? |

---

## 📚 Documentation complète

- **Setup détaillé**: `docs/PACK2-ENVIRONMENT-SETUP.md`
- **Livraison**: `PACK2-LIVRAISON-COMPLETE.md`
- **Variables**: `.env.example`

---

## ✅ Statut: **PRODUCTION READY**

🎉 **PACK 2 terminé et testé**
