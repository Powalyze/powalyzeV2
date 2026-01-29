# 🎯 Instructions d'Activation Complète

## Pages à Activer (6 pages)

### 1. /cockpit/decisions ✅
**Boutons à activer**:
- Nouvelle décision (modal complet)
- Voir décisions recommandées (modal IA avec 6 recommandations)
- Reformuler une décision
- Prioriser automatiquement
- Recherche temps réel
- Toggle filtres
- Actions cards: Valider / Rejeter / Commenter / Voir détails

### 2. /cockpit/risques
**Boutons à activer**:
- Nouveau risque (modal complet)
- Voir risques détectés IA (modal détection auto)
- Plans d'actions recommandés
- Simuler mitigation
- Toggle Matrix/List view
- Recherche temps réel
- Toggle filtres
- Actions matrix: Edit / Delete / Mitiger / Voir détails
- Click cells pour drill-down

###  /cockpit/rapports
**Boutons à activer**:
- Nouveau rapport (modal sélection type)
- Générer rapport exécutif (IA génération)
- Rapport COMEX auto
- Exporter PowerBI
- Download PDF pour chaque rapport
- Preview rapport
- Recherche temps réel
- Filtres par type
- Actions: Edit / Delete / Send / Schedule

### 4. /cockpit/methodologie
**Boutons à activer**:
- Sélection méthodologie (Agile/Hermès/Cycle-V/Hybride)
- Analyser mon portefeuille (IA recommande méthodo)
- Recommandations IA
- Créer ma méthodologie (formulaire custom complet)
- Appliquer configuration
- Sauvegarder modifications

### 5. /cockpit/donnees
**Boutons à activer**:
- Synchroniser automatiquement
- Créer dashboards PowerBI (modal wizard)
- Configuration connecteurs (6 connecteurs):
  - PowerBI: Connecter / Tester / Configurer
  - Excel: Import / Export
  - Jira: OAuth / Config / Test
  - Azure DevOps: OAuth / Config / Test
  - GitHub: OAuth / Config / Test
  - Slack: OAuth / Config / Test
- Test connexion pour chaque connecteur
- Import fichiers (Excel/CSV)
- Export multi-formats (Excel/CSV/JSON/PowerBI)
- Génération API key

### 6. PowerBI (élément phare)
**Localisation**: /cockpit/donnees → Créer dashboards PowerBI
**Fonctionnalités**:
- Wizard 5 étapes:
  1. Sélection données source
  2. Choix templates dashboards
  3. Configuration visuels
  4. Preview temps réel
  5. Publication/Export
- Templates prédéfinis:
  - Portfolio Executive Dashboard
  - Risques Heat Map
  - Décisions Timeline
  - Budget Tracking
  - Vélocité & Burndown
- Export formats: .pbix / Embed code / Public link
- Refresh auto-configuration

## Pattern de Code

```tsx
// Imports requis
import { useToast } from '@/components/ui/ToastProvider';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { StatusBadge } from '@/components/ui/StatusBadge';

// States
const [showModal, setShowModal] = useState(false);
const [showAIModal, setShowAIModal] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [showFilters, setShowFilters] = useState(false);
const { showToast } = useToast();

// Handlers
const handleAction = () => {
  // Validation
  if (!valid) {
    showToast('warning', 'Attention', 'Message');
    return;
  }
  
  // Action
  performAction();
  
  // Feedback
  showToast('success', 'Succès', 'Action réussie');
};

// Modals avec click outside
<div onClick={closeModal}>
  <div onClick={(e) => e.stopPropagation()}>
    {/* Content */}
  </div>
</div>
```

## Ordre d'Activation

1. ✅ /cockpit/projets (FAIT)
2. ⏳ /cockpit/decisions (EN COURS)
3. ⏳ /cockpit/risques
4. ⏳ /cockpit/rapports
5. ⏳ /cockpit/methodologie
6. ⏳ /cockpit/donnees + PowerBI wizard

## Checklist par Page

### Décisions
- [ ] Modal nouvelle décision (formulaire complet)
- [ ] Modal IA recommandations (6 suggestions)
- [ ] Reformulation IA
- [ ] Priorisation auto
- [ ] Recherche fonctionnelle
- [ ] Panel filtres (statut/impact/urgence)
- [ ] Actions cards (Valider/Rejeter/Commenter/Détails)
- [ ] Toasts sur toutes actions

### Risques
- [ ] Modal nouveau risque
- [ ] Modal risques détectés IA
- [ ] Plans d'actions IA
- [ ] Simulation mitigation
- [ ] Toggle Matrix/List
- [ ] Recherche fonctionnelle
- [ ] Panel filtres
- [ ] Actions (Edit/Delete/Mitiger/Détails)
- [ ] Click cells matrix
- [ ] Toasts

### Rapports
- [ ] Modal nouveau rapport
- [ ] Génération exécutif IA
- [ ] Rapport COMEX auto
- [ ] Export PowerBI
- [ ] Download PDF tous rapports
- [ ] Preview modal
- [ ] Recherche
- [ ] Filtres par type
- [ ] Actions (Edit/Delete/Send/Schedule)
- [ ] Toasts

### Méthodologie
- [ ] Cartes sélectionnables
- [ ] Analyse portefeuille IA
- [ ] Recommandations IA
- [ ] Modal méthodologie custom (formulaire 5 sections)
- [ ] Appliquer configuration
- [ ] Sauvegarder
- [ ] Toasts

### Données
- [ ] Sync auto
- [ ] Modal PowerBI wizard (5 étapes)
- [ ] Config 6 connecteurs
- [ ] Test connexions
- [ ] Import fichiers
- [ ] Export multi-formats
- [ ] API key generation
- [ ] Toasts

## Temps Estimé

- Décisions: 15min
- Risques: 20min
- Rapports: 15min
- Méthodologie: 20min
- Données + PowerBI: 30min
- Build & Deploy: 5min

**Total**: ~105 minutes (1h45)
