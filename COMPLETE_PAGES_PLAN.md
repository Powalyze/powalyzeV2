# 🎯 Plan d'Activation Complète des 5 Pages

## Stratégie d'Implémentation

Pour chaque page, j'implémente le pattern complet suivant :

### 1. **Imports & Types** ✅
```tsx
// UI Components
import { useToast } from '@/components/ui/ToastProvider';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { StatusBadge } from '@/components/ui/StatusBadge';
// Icons nécessaires depuis lucide-react
```

### 2. **States Management** ✅
```tsx
const [searchQuery, setSearchQuery] = useState("");
const [showFiltersPanel, setShowFiltersPanel] = useState(false);
const [showModalX, setShowModalX] = useState(false);
const [selectedFilters, setSelectedFilters] = useState({});
const { showToast } = useToast();
```

### 3. **Handlers Pattern** ✅
```tsx
const handleAction = (param?: string) => {
  // 1. Validation
  if (!valid) {
    showToast('warning', 'Attention', 'Message d\'erreur');
    return;
  }
  
  // 2. Action (API call simulation)
  // performAction()
  
  // 3. Feedback
  showToast('success', 'Succès', 'Action réussie');
  setShowModalX(false); // Close modal if any
};
```

### 4. **Modals System** ✅
```tsx
{showModalX && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModalX(false)}>
    <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      {/* Modal content */}
    </div>
  </div>
)}
```

### 5. **Search & Filters** ✅
```tsx
// Search input avec state
<input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

// Filters panel avec toggle
{showFiltersPanel && (
  <div className="filters-panel">...</div>
)}
```

---

## Détails par Page

### Page 1: **Décisions** (`app/cockpit/decisions/page.tsx`)

**Boutons à activer** (15 total):
1. ✅ Nouvelle décision → Modal formulaire complet
2. ✅ Voir décisions recommandées IA → Modal 6 recommandations
3. ✅ Reformuler → Toast IA reformule
4. ✅ Prioriser automatiquement → Toast réorganisation
5. ✅ Search input → Filtre en temps réel
6. ✅ Filtres button → Toggle panel filtres
7-10. ✅ DecisionCard actions: Valider / Rejeter / Commenter / Voir détails
11-15. ✅ Impact filters (all/critical/high/medium/low)

**Modals**:
- NewDecisionModal: Formulaire (titre, description, impact, urgence, owner, projet)
- AIRecommendationsModal: 6 décisions suggérées avec actions rapides
- FiltersPanel: Statut, Impact, Urgence, Owner, Date range

**États supplémentaires**:
- Filtered decisions basé sur search + filters
- Selected decision pour voir détails

---

### Page 2: **Risques** (`app/cockpit/risques/page.tsx`)

**Boutons à activer** (12+ total):
1. ✅ Nouveau risque → Modal formulaire complet
2. ✅ Voir risques détectés IA → Modal détection auto
3. ✅ Plans d'actions recommandés → Modal plans mitigation
4. ✅ Simuler mitigation → Modal simulation scénarios
5. ✅ Toggle Matrix/List view (DÉJÀ FAIT)
6. ✅ Search input → Filtre en temps réel
7. ✅ Filtres button → Toggle panel filtres
8-12. ✅ Matrix cell actions: Edit / Delete / Mitiger / Voir détails / Move

**Modals**:
- NewRiskModal: Formulaire (titre, description, impact 1-4, probability 1-4, projet, owner, mitigation plan)
- AIDetectedRisksModal: Risques détectés par IA avec alertes
- MitigationPlansModal: Plans d'actions recommandés par IA
- SimulateMitigationModal: Simulation "what-if" avec graphiques
- FiltersPanel: Niveau, Projet, Status, Owner

**États supplémentaires**:
- Filtered risks basé sur search + filters
- Selected risk pour voir détails/édition

---

### Page 3: **Rapports** (`app/cockpit/rapports/page.tsx`)

**Boutons à activer** (10+ total):
1. ✅ Nouveau rapport → Modal sélection type + génération
2. ✅ Générer rapport exécutif IA → Progress bar + génération
3. ✅ Rapport COMEX auto → Génération automatique
4. ✅ Exporter PowerBI → Export vers PowerBI
5. ✅ Download PDF (DÉJÀ FAIT mais améliorer)
6. ✅ Preview rapport → Modal preview full
7. ✅ Search input → Filtre en temps réel
8. ✅ Filtres type (DÉJÀ FAIT mais connecter)
9-10. ✅ ReportCard actions: Edit / Delete / Send / Schedule

**Modals**:
- NewReportModal: Sélection type (executive/comex/technique/financier), période, destinataires
- AIGenerationModal: Progress bar avec étapes génération
- PreviewModal: Full preview du rapport avec pagination
- FiltersPanel: Type, Date, Status, Author

**États supplémentaires**:
- Generating status avec progress
- Filtered reports basé sur search + filters + type

---

### Page 4: **Méthodologie** (`app/cockpit/methodologie/page.tsx`)

**Boutons à activer** (8+ total):
1. ✅ Analyser mon portefeuille IA → Modal analyse + recommandations
2. ✅ Recommandations IA → Modal suggestions méthodo
3. ✅ Sélection méthodologie (4 cards: Agile/Hermès/Cycle-V/Hybride) → Highlight selected
4. ✅ Créer ma méthodologie → Afficher CustomMethodologyBuilder (DÉJÀ fait partiellement)
5. ✅ Appliquer configuration → Confirmation + toast
6-8. ✅ CustomMethodologyBuilder actions: Générer avec IA / Sauvegarder brouillon / Activer

**Modals**:
- PortfolioAnalysisModal: Analyse IA du portefeuille avec recommandations
- AIRecommendationsModal: Suggestions de méthodologies adaptées
- ConfirmationModal: Confirmer application de la méthodologie

**États supplémentaires**:
- Selected methodology
- Custom methodology fields
- Application status

---

### Page 5 (FLAGSHIP): **Données** (`app/cockpit/donnees/page.tsx`)

**Boutons à activer** (20+ total):

**Tab Connecteurs**:
1. ✅ Synchroniser automatiquement → Toast sync lancée
2. ✅ **Créer dashboards PowerBI** → **MODAL WIZARD 5 ÉTAPES** (FLAGSHIP)
3-8. ✅ Configuration connecteurs (6 sources):
   - PowerBI: Connecter / Configurer / Tester / Déconnecter
   - Excel: Connecter / Configurer
   - Jira: Connecter OAuth / Configurer / Tester
   - Azure DevOps: Connecter OAuth / Configurer / Tester
   - GitHub: Connecter OAuth / Configurer / Tester
   - Slack: Connecter OAuth / Configurer / Tester

**Tab Import**:
9-12. ✅ Import actions: Glisser-déposer / Import Excel / Import CSV / Import JSON / Import API

**Tab Export**:
13-16. ✅ Export actions: Export Excel / Export CSV / Export PDF / Export PowerBI
17. ✅ Créer export programmé → Modal schedule

**Tab API**:
18. ✅ Documentation API → Ouvrir docs
19. ✅ Générer clé API → Modal génération + affichage clé
20. ✅ Configurer webhook → Modal configuration
21-24. ✅ Tester endpoints → Playground interactive

**Modals FLAGSHIP**:
- **PowerBIDashboardWizard**: 5 étapes
  1. Sélection données sources (projets/risques/décisions/budget)
  2. Choix templates dashboards (6 templates prédéfinis)
  3. Configuration visuels (graphiques, KPIs, filtres)
  4. Preview temps réel (simulation du dashboard)
  5. Publication (Export .pbix / Embed code / Public link)
  
- ConnectorConfigModal: Configuration par connecteur (API URL, credentials, OAuth flow)
- TestConnectionModal: Test connexion avec résultat (success/error details)
- ImportModal: Glisser-déposer avec preview + mapping IA automatique
- ExportScheduleModal: Configuration exports programmés (fréquence, format, destinataires)
- APIKeyGenerationModal: Génération + affichage clé avec copy button
- WebhookConfigModal: URL webhook + événements à écouter

**États supplémentaires**:
- Active tab (connectors/import/export/api)
- Connector status per source
- PowerBI wizard step (1-5)
- PowerBI wizard data (sources, template, visuals, config)
- Import files queue
- API keys list

---

## Pattern de Code Réutilisable

### 1. **Modal Wrapper**
```tsx
{showModal && (
  <div 
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" 
    onClick={() => setShowModal(false)}
  >
    <div 
      className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Modal Title</h2>
        <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      {/* Body */}
      <div className="p-6">
        {/* Content */}
      </div>
      
      {/* Footer */}
      <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
        <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg">
          Annuler
        </button>
        <button onClick={handleSubmit} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg font-semibold">
          Confirmer
        </button>
      </div>
    </div>
  </div>
)}
```

### 2. **ActionMenu Integration dans Cards**
```tsx
<ActionMenu
  actions={[
    { label: 'Éditer', icon: Edit2, onClick: () => handleEdit(id) },
    { label: 'Dupliquer', icon: Copy, onClick: () => handleDuplicate(id) },
    { label: 'Supprimer', icon: Trash2, onClick: () => handleDelete(id), danger: true }
  ]}
/>
```

### 3. **Filters Panel**
```tsx
{showFiltersPanel && (
  <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 mb-6">
    <div className="grid md:grid-cols-3 gap-4">
      {/* Filter 1 */}
      <div>
        <label className="text-sm font-semibold text-slate-400 mb-2 block">Statut</label>
        <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg">
          <option>Tous</option>
          <option>Actif</option>
          <option>Terminé</option>
        </select>
      </div>
      {/* More filters... */}
    </div>
  </div>
)}
```

---

## Checklist Globale d'Activation

### Décisions ✅
- [ ] Search input connecté
- [ ] Filters panel créé et fonctionnel
- [ ] New decision modal
- [ ] AI recommendations modal
- [ ] DecisionCard actions (4 boutons)
- [ ] All handlers avec toasts

### Risques ✅
- [ ] Search input connecté
- [ ] Filters panel créé et fonctionnel
- [ ] New risk modal
- [ ] AI detected risks modal
- [ ] Mitigation plans modal
- [ ] Simulate mitigation modal
- [ ] Matrix cell actions
- [ ] All handlers avec toasts

### Rapports ✅
- [ ] Search input connecté
- [ ] Filters fonctionnels (type)
- [ ] New report modal
- [ ] AI generation modal
- [ ] Preview modal
- [ ] ReportCard actions (4 boutons)
- [ ] All handlers avec toasts

### Méthodologie ✅
- [ ] Portfolio analysis modal
- [ ] AI recommendations modal
- [ ] Methodology selection active
- [ ] Custom methodology builder complete
- [ ] Apply configuration avec confirmation
- [ ] All handlers avec toasts

### Données + PowerBI ⭐ FLAGSHIP ✅
- [ ] **PowerBI Dashboard Wizard (5 étapes)**
- [ ] Connector config modals (6 sources)
- [ ] Test connection handlers
- [ ] Sync auto handler
- [ ] Import modal avec drag & drop
- [ ] Export handlers (4 formats)
- [ ] Export schedule modal
- [ ] API key generation modal
- [ ] Webhook config modal
- [ ] Endpoint playground
- [ ] All handlers avec toasts

---

## Temps Estimé Total

- Décisions: 15 minutes
- Risques: 20 minutes
- Rapports: 15 minutes
- Méthodologie: 15 minutes
- Données + PowerBI Wizard: 30 minutes
- Build & Deploy: 5 minutes

**Total: ~100 minutes (1h40)**
