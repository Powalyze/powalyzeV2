'use client';

import { useState } from 'react';
import { Search, Database, Download, Upload, Code, Link, Check, X, ChevronRight, Power, Settings, TestTube, Trash2, FileText, Table, PieChart, BarChart3, TrendingUp, Zap, Copy, Calendar, Bell, Key } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { CockpitShell } from '@/components/cockpit/CockpitShell';
import { FileUpload } from '@/components/cockpit/FileUpload';
import { PowerBIViewer } from '@/components/cockpit/PowerBIViewer';

type TabType = 'connectors' | 'import' | 'export' | 'api';
type ConnectorType = 'powerbi' | 'excel' | 'jira' | 'azure' | 'github' | 'slack';
type WizardStep = 1 | 2 | 3 | 4 | 5;

interface Connector {
  id: ConnectorType;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected';
  lastSync?: string;
}

interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  previewImage: string;
}

interface DataSource {
  id: string;
  name: string;
  checked: boolean;
}

export default function DonneesPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('connectors');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPowerBIWizard, setShowPowerBIWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [showConnectorConfig, setShowConnectorConfig] = useState<ConnectorType | null>(null);
  const [showTestConnection, setShowTestConnection] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportScheduleModal, setShowExportScheduleModal] = useState(false);
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [generatedAPIKey, setGeneratedAPIKey] = useState('');

  const [wizardData, setWizardData] = useState({
    dataSources: [
      { id: 'projects', name: 'Projets', checked: true },
      { id: 'risks', name: 'Risques', checked: true },
      { id: 'decisions', name: 'Décisions', checked: false },
      { id: 'budget', name: 'Budget', checked: true },
      { id: 'resources', name: 'Ressources', checked: false }
    ] as DataSource[],
    selectedTemplate: '',
    visuals: [] as string[],
    refreshSchedule: 'daily'
  });

  const [connectors, setConnectors] = useState<Connector[]>([
    { id: 'powerbi', name: 'Power BI', description: 'Microsoft Power BI dashboards', icon: '📊', status: 'connected', lastSync: 'Il y a 2h' },
    { id: 'excel', name: 'Excel', description: 'Microsoft Excel spreadsheets', icon: '📗', status: 'connected', lastSync: 'Il y a 1 jour' },
    { id: 'jira', name: 'Jira', description: 'Atlassian Jira project management', icon: '🔷', status: 'disconnected' },
    { id: 'azure', name: 'Azure DevOps', description: 'Microsoft Azure DevOps', icon: '☁️', status: 'disconnected' },
    { id: 'github', name: 'GitHub', description: 'GitHub repositories', icon: '🐙', status: 'disconnected' },
    { id: 'slack', name: 'Slack', description: 'Slack workspace integration', icon: '💬', status: 'disconnected' }
  ]);

  const dashboardTemplates: DashboardTemplate[] = [
    { id: 'executive', name: 'Portfolio Executive Dashboard', description: 'Vue d\'ensemble stratégique pour COMEX', icon: TrendingUp, previewImage: '/preview-exec.png' },
    { id: 'risks', name: 'Risques Heat Map', description: 'Matrice de risques interactive', icon: BarChart3, previewImage: '/preview-risks.png' },
    { id: 'decisions', name: 'Décisions Timeline', description: 'Chronologie des décisions stratégiques', icon: Calendar, previewImage: '/preview-timeline.png' },
    { id: 'budget', name: 'Budget Tracking', description: 'Suivi budgétaire en temps réel', icon: PieChart, previewImage: '/preview-budget.png' },
    { id: 'velocity', name: 'Vélocité & Burndown', description: 'Métriques agiles et performance', icon: Zap, previewImage: '/preview-velocity.png' },
    { id: 'custom', name: 'Custom Dashboard', description: 'Créez votre dashboard sur mesure', icon: Settings, previewImage: '/preview-custom.png' }
  ];

  const handleCreateDashboard = () => {
    setShowPowerBIWizard(true);
    setWizardStep(1);
    showToast('info', "🚀 Wizard PowerBI", "Création guidée de votre dashboard");
  };

  const handleSyncAuto = () => {
    showToast('success', "🔄 Synchronisation lancée", "Mise à jour automatique de tous les connecteurs");
  };

  const handleConnectConnector = (id: ConnectorType) => {
    setShowConnectorConfig(id);
  };

  const handleTestConnection = () => {
    setShowTestConnection(true);
    setTimeout(() => {
      showToast('success', "✅ Connexion réussie", "Le connecteur fonctionne correctement");
    }, 1500);
  };

  const handleDisconnect = (id: ConnectorType) => {
    setConnectors(prev => prev.map(c => c.id === id ? { ...c, status: 'disconnected' as const, lastSync: undefined } : c));
    showToast('info', "Déconnecté", `${connectors.find(c => c.id === id)?.name} déconnecté`);
  };

  const handleImportFile = (format: string) => {
    setShowImportModal(true);
    showToast('info', `📥 Import ${format}`, "Glissez votre fichier ou cliquez pour parcourir");
  };

  const handleExportFormat = (format: string) => {
    showToast('info', `📤 Export ${format}`, `Génération du fichier ${format} en cours...`);
    setTimeout(() => {
      showToast('success', "✅ Export terminé", `Fichier ${format} téléchargé`);
    }, 2000);
  };

  const handleScheduleExport = () => {
    setShowExportScheduleModal(true);
  };

  const handleGenerateAPIKey = () => {
    const newKey = 'pk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setGeneratedAPIKey(newKey);
    setShowAPIKeyModal(true);
    showToast('success', "🔑 Clé API générée", "Copiez votre clé, elle ne sera plus affichée");
  };

  const handleCopyAPIKey = () => {
    navigator.clipboard.writeText(generatedAPIKey);
    showToast('success', "✅ Copié", "Clé API copiée dans le presse-papier");
  };

  const handleConfigureWebhook = () => {
    setShowWebhookModal(true);
  };

  const handleTestEndpoint = (endpoint: string) => {
    showToast('info', `🧪 Test ${endpoint}`, "Requête envoyée...");
    setTimeout(() => {
      showToast('success', "✅ Endpoint OK", `${endpoint} fonctionne correctement`);
    }, 1000);
  };

  const handleWizardNext = () => {
    if (wizardStep < 5) {
      setWizardStep((wizardStep + 1) as WizardStep);
    }
  };

  const handleWizardBack = () => {
    if (wizardStep > 1) {
      setWizardStep((wizardStep - 1) as WizardStep);
    }
  };

  const handleWizardComplete = () => {
    showToast('success', "✅ Dashboard créé!", "Votre dashboard PowerBI est prêt");
    setShowPowerBIWizard(false);
    setWizardStep(1);
  };

  const handleToggleDataSource = (id: string) => {
    setWizardData(prev => ({
      ...prev,
      dataSources: prev.dataSources.map(ds => ds.id === id ? { ...ds, checked: !ds.checked } : ds)
    }));
  };

  const handleSelectTemplate = (templateId: string) => {
    setWizardData(prev => ({ ...prev, selectedTemplate: templateId }));
  };

  return (
    <CockpitShell>
      <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Données & Intégrations</h1>
            <p className="text-slate-400">Connectez vos outils et créez des dashboards PowerBI</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreateDashboard}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20"
            >
              <BarChart3 size={20} />
              Créer dashboards PowerBI
            </button>
            <button
              onClick={handleSyncAuto}
              className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center gap-2"
            >
              <Database size={18} />
              Synchroniser automatiquement
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un connecteur, endpoint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#111113] border border-slate-800 rounded-lg focus:border-purple-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-800">
        {[
          { id: 'connectors' as TabType, label: 'Connecteurs', icon: Link },
          { id: 'import' as TabType, label: 'Import', icon: Upload },
          { id: 'export' as TabType, label: 'Export', icon: Download },
          { id: 'api' as TabType, label: 'API', icon: Code }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 flex items-center gap-2 transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Connectors Tab */}
      {activeTab === 'connectors' && (
        <div className="space-y-6">
          {/* Power BI Viewer Section */}
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 2h4v20H2V2zm6 8h4v12H8V10zm6-6h4v18h-4V4zm6 4h4v14h-4V8z"/>
              </svg>
              Power BI Integration
            </h2>
            <PowerBIViewer reportUrl="" embedUrl="" />
          </div>

          {/* Other Connectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectors.map((connector) => (
              <div key={connector.id} className="bg-[#111113] border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{connector.icon}</span>
                  <div>
                    <h3 className="font-semibold">{connector.name}</h3>
                    <p className="text-xs text-slate-400">{connector.description}</p>
                  </div>
                </div>
                {connector.status === 'connected' && (
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Check size={12} />
                    Connecté
                  </span>
                )}
              </div>

              {connector.lastSync && (
                <p className="text-xs text-slate-500 mb-4">Dernière sync: {connector.lastSync}</p>
              )}

              <div className="flex gap-2">
                {connector.status === 'disconnected' ? (
                  <button
                    onClick={() => handleConnectConnector(connector.id)}
                    className="flex-1 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm"
                  >
                    Connecter
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleConnectConnector(connector.id)}
                      className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
                    >
                      <Settings size={14} className="inline mr-1" />
                      Configurer
                    </button>
                    <button
                      onClick={handleTestConnection}
                      className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm"
                    >
                      <TestTube size={14} className="inline" />
                    </button>
                    <button
                      onClick={() => handleDisconnect(connector.id)}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm"
                    >
                      <Trash2 size={14} className="inline" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* Upload Zone avec FileUpload Component */}
          <FileUpload 
            onFileUpload={(file) => {
              showToast('success', `📥 Import ${file.name}`, 'Fichier en cours d\'analyse...');
              setTimeout(() => {
                showToast('success', '✅ Mapping terminé', 'Données importées avec succès');
              }, 2000);
            }}
            acceptedTypes=".xlsx,.xls,.csv,.json,.xml,.pdf,.doc,.docx,.pbix"
            maxSize={100}
            multiple={true}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { format: 'Excel', icon: '📗', desc: 'Feuilles de calcul' },
              { format: 'CSV', icon: '📊', desc: 'Valeurs séparées' },
              { format: 'JSON', icon: '📋', desc: 'Format structuré' },
              { format: 'Power BI', icon: '📊', desc: 'Fichiers .pbix' }
            ].map((item) => (
              <button
                key={item.format}
                onClick={() => handleImportFile(item.format)}
                className="p-6 bg-[#111113] border border-slate-800 rounded-xl hover:border-purple-500/30 transition-all group"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="font-semibold mb-1">Import {item.format}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap size={20} className="text-amber-400" />
              Mapping automatique IA
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              L'IA détecte automatiquement les colonnes et mappe vos données vers les champs Powalyze :
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-400" />
                <span className="text-slate-300">Projets & Budgets</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-400" />
                <span className="text-slate-300">Risques & Problèmes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-400" />
                <span className="text-slate-300">Ressources & Équipes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-400" />
                <span className="text-slate-300">KPIs & Métriques</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Excel', 'CSV', 'PDF', 'PowerBI'].map((format) => (
              <button
                key={format}
                onClick={() => handleExportFormat(format)}
                className="p-6 bg-[#111113] border border-slate-800 rounded-xl hover:border-purple-500/30 transition-all"
              >
                <Download size={32} className="mx-auto mb-2 text-green-400" />
                <p className="font-semibold">Export {format}</p>
              </button>
            ))}
          </div>

          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar size={20} />
                Exports programmés
              </h3>
              <button
                onClick={handleScheduleExport}
                className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm"
              >
                Créer export programmé
              </button>
            </div>
            <p className="text-slate-400 text-sm">Planifiez des exports automatiques (quotidiens, hebdomadaires, mensuels)</p>
          </div>
        </div>
      )}

      {/* API Tab */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Key size={20} />
                Clés API
              </h3>
              <button
                onClick={handleGenerateAPIKey}
                className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm"
              >
                Générer clé API
              </button>
            </div>
            <p className="text-slate-400 text-sm">Gérez vos clés d'accès pour l'API REST</p>
          </div>

          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell size={20} />
                Webhooks
              </h3>
              <button
                onClick={handleConfigureWebhook}
                className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm"
              >
                Configurer webhook
              </button>
            </div>
            <p className="text-slate-400 text-sm">Recevez des notifications en temps réel sur vos endpoints</p>
          </div>

          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Endpoints disponibles</h3>
            <div className="space-y-2">
              {['GET /api/projects', 'POST /api/projects', 'GET /api/risks', 'POST /api/decisions'].map((endpoint) => (
                <div key={endpoint} className="flex items-center justify-between p-3 bg-[#0A0A0B] rounded-lg">
                  <code className="text-sm text-purple-400">{endpoint}</code>
                  <button
                    onClick={() => handleTestEndpoint(endpoint)}
                    className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded text-xs"
                  >
                    Tester
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-purple-400 hover:text-purple-300">
              📖 Documentation API complète →
            </button>
          </div>
        </div>
      )}

      {/* PowerBI Dashboard Wizard Modal */}
      {showPowerBIWizard && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowPowerBIWizard(false)}>
          <div className="bg-[#111113] border border-slate-800 rounded-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Wizard Header */}
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Assistant PowerBI Dashboard</h2>
                <button onClick={() => setShowPowerBIWizard(false)}><X size={24} /></button>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`h-1 w-full rounded-full ${step <= wizardStep ? 'bg-purple-500' : 'bg-slate-700'}`} />
                    {step < 5 && <ChevronRight size={16} className="text-slate-600 mx-1" />}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>Sources</span>
                <span>Template</span>
                <span>Visuels</span>
                <span>Preview</span>
                <span>Publication</span>
              </div>
            </div>

            {/* Wizard Content */}
            <div className="p-6">
              {/* Step 1: Data Sources */}
              {wizardStep === 1 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">1. Sélectionnez vos sources de données</h3>
                  <div className="space-y-3">
                    {wizardData.dataSources.map((ds) => (
                      <label key={ds.id} className="flex items-center gap-3 p-4 bg-[#0A0A0B] border border-slate-800 rounded-lg cursor-pointer hover:border-purple-500/30">
                        <input
                          type="checkbox"
                          checked={ds.checked}
                          onChange={() => handleToggleDataSource(ds.id)}
                          className="w-5 h-5"
                        />
                        <span className="font-semibold">{ds.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Template Selection */}
              {wizardStep === 2 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">2. Choisissez un template</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <div
                          key={template.id}
                          onClick={() => handleSelectTemplate(template.id)}
                          className={`p-6 bg-[#0A0A0B] border rounded-xl cursor-pointer transition-all ${
                            wizardData.selectedTemplate === template.id
                              ? 'border-purple-500 bg-purple-500/5'
                              : 'border-slate-800 hover:border-purple-500/30'
                          }`}
                        >
                          <Icon size={32} className="mb-3 text-purple-400" />
                          <h4 className="font-semibold mb-2">{template.name}</h4>
                          <p className="text-sm text-slate-400">{template.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Visual Configuration */}
              {wizardStep === 3 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">3. Configuration des visuels</h3>
                  <div className="space-y-4">
                    <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Types de graphiques</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Bar Chart', 'Line Chart', 'Pie Chart', 'Gauge', 'Table', 'Card'].map((type) => (
                          <button key={type} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm">
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">KPIs à afficher</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Projets actifs', 'Budget total', 'Risques critiques', 'Vélocité', 'Taux de réussite', 'ROI'].map((kpi) => (
                          <label key={kpi} className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" defaultChecked />
                            <span className="text-sm">{kpi}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Live Preview */}
              {wizardStep === 4 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">4. Aperçu en temps réel</h3>
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-lg p-6">
                    {/* Header Dashboard */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-1">{dashboardTemplates.find(t => t.id === wizardData.selectedTemplate)?.name || 'Portfolio Executive Dashboard'}</h2>
                      <p className="text-slate-400 text-sm">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')} • Sources: {wizardData.dataSources.filter(ds => ds.checked).length} connectées</p>
                    </div>

                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">Projets Actifs</span>
                          <TrendingUp size={16} className="text-purple-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">42</div>
                        <div className="text-xs text-green-400">+12% vs mois dernier</div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">Budget Total</span>
                          <PieChart size={16} className="text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">12.8M€</div>
                        <div className="text-xs text-slate-400">98% consommé</div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">Risques Actifs</span>
                          <Bell size={16} className="text-amber-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">7</div>
                        <div className="text-xs text-amber-400">3 critiques</div>
                      </div>

                      <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">Vélocité</span>
                          <Zap size={16} className="text-green-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">87%</div>
                        <div className="text-xs text-green-400">+15% amélioration</div>
                      </div>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Budget Chart */}
                      <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <BarChart3 size={16} className="text-blue-400" />
                          Budget par Projet (Top 5)
                        </h4>
                        <div className="space-y-3">
                          {[
                            { name: 'Migration Cloud Azure', budget: 3200, color: 'bg-blue-500' },
                            { name: 'Refonte ERP', budget: 2800, color: 'bg-purple-500' },
                            { name: 'Mobile App v2', budget: 2100, color: 'bg-green-500' },
                            { name: 'Data Lake', budget: 1900, color: 'bg-amber-500' },
                            { name: 'CRM Upgrade', budget: 1500, color: 'bg-pink-500' }
                          ].map((project, i) => (
                            <div key={i}>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-slate-400 truncate">{project.name}</span>
                                <span className="text-white font-semibold">{project.budget}K€</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className={`${project.color} h-2 rounded-full`} style={{ width: `${(project.budget / 3200) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Distribution */}
                      <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <PieChart size={16} className="text-purple-400" />
                          Distribution des Statuts
                        </h4>
                        <div className="flex items-center justify-center h-32 mb-3 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-3xl font-bold">42</div>
                              <div className="text-xs text-slate-400">Projets</div>
                            </div>
                          </div>
                          <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="56" fill="none" stroke="#1e293b" strokeWidth="16" />
                            <circle cx="64" cy="64" r="56" fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray="220 352" strokeLinecap="round" />
                            <circle cx="64" cy="64" r="56" fill="none" stroke="#f59e0b" strokeWidth="16" strokeDasharray="88 352" strokeDashoffset="-220" strokeLinecap="round" />
                            <circle cx="64" cy="64" r="56" fill="none" stroke="#ef4444" strokeWidth="16" strokeDasharray="44 352" strokeDashoffset="-308" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500" />
                              <span className="text-slate-400">Actif</span>
                            </div>
                            <span className="text-white font-semibold">28 (67%)</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-amber-500" />
                              <span className="text-slate-400">En attente</span>
                            </div>
                            <span className="text-white font-semibold">11 (26%)</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500" />
                              <span className="text-slate-400">Bloqué</span>
                            </div>
                            <span className="text-white font-semibold">3 (7%)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Velocity Trend */}
                      <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp size={16} className="text-green-400" />
                          Tendance Vélocité
                        </h4>
                        <div className="h-24 flex items-end justify-between gap-1">
                          {[65, 58, 72, 68, 75, 82, 78, 87].map((value, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t" style={{ height: `${value}%` }} />
                              <span className="text-[10px] text-slate-500 mt-1">S{i + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Risk Matrix */}
                      <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Table size={16} className="text-amber-400" />
                          Matrice des Risques
                        </h4>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="aspect-square bg-red-500/80 rounded flex items-center justify-center text-white font-bold text-xs">3</div>
                          <div className="aspect-square bg-red-500/50 rounded flex items-center justify-center text-white font-bold text-xs">2</div>
                          <div className="aspect-square bg-amber-500/50 rounded flex items-center justify-center text-white font-bold text-xs">1</div>
                          <div className="aspect-square bg-amber-500/80 rounded flex items-center justify-center text-white font-bold text-xs">2</div>
                          <div className="aspect-square bg-amber-500/50 rounded flex items-center justify-center text-white font-bold text-xs">3</div>
                          <div className="aspect-square bg-green-500/50 rounded flex items-center justify-center text-white font-bold text-xs">4</div>
                          <div className="aspect-square bg-green-500/80 rounded flex items-center justify-center text-white font-bold text-xs">5</div>
                          <div className="aspect-square bg-green-500/50 rounded flex items-center justify-center text-white font-bold text-xs">8</div>
                          <div className="aspect-square bg-green-500/30 rounded flex items-center justify-center text-white font-bold text-xs">12</div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                          <span>Faible</span>
                          <span>Impact</span>
                          <span>Élevé</span>
                        </div>
                      </div>

                      {/* ROI Gauge */}
                      <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp size={16} className="text-purple-400" />
                          ROI Portfolio
                        </h4>
                        <div className="flex flex-col items-center justify-center">
                          <div className="relative w-24 h-24">
                            <svg className="w-24 h-24 transform -rotate-90">
                              <circle cx="48" cy="48" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
                              <circle cx="48" cy="48" r="40" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="251" strokeDashoffset="63" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <div className="text-2xl font-bold text-purple-400">75%</div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-400 mt-2 text-center">
                            <div className="text-green-400 font-semibold">+25% vs objectif</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer info */}
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <span>✅ Actualisation automatique activée</span>
                        <span>🔄 Dernière synchro: Il y a 2 min</span>
                      </div>
                      <span>Powered by Powalyze AI</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Publication */}
              {wizardStep === 5 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">5. Publication</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => showToast('success', '📥 Téléchargé', 'Fichier .pbix généré avec succès')}
                      className="w-full p-6 bg-[#0A0A0B] border border-slate-800 rounded-lg hover:border-purple-500/30 text-left"
                    >
                      <Download size={24} className="mb-2 text-purple-400" />
                      <h4 className="font-semibold mb-1">Télécharger fichier .pbix</h4>
                      <p className="text-sm text-slate-400">Ouvrir dans Power BI Desktop</p>
                    </button>

                    <button
                      onClick={() => showToast('success', '📋 Copié', 'Code d\'intégration copié dans le presse-papier')}
                      className="w-full p-6 bg-[#0A0A0B] border border-slate-800 rounded-lg hover:border-purple-500/30 text-left"
                    >
                      <Code size={24} className="mb-2 text-purple-400" />
                      <h4 className="font-semibold mb-1">Code d'intégration</h4>
                      <p className="text-sm text-slate-400">Embarquer dans votre site web</p>
                    </button>

                    <button
                      onClick={() => showToast('success', '🔗 Lien créé', 'Lien partageable copié: https://powalyze.com/powerbi/dashboard-123')}
                      className="w-full p-6 bg-[#0A0A0B] border border-slate-800 rounded-lg hover:border-purple-500/30 text-left"
                    >
                      <Link size={24} className="mb-2 text-purple-400" />
                      <h4 className="font-semibold mb-1">Lien public</h4>
                      <p className="text-sm text-slate-400">Partager avec votre équipe</p>
                    </button>

                    <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm">Actualisation automatique quotidienne</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wizard Footer */}
            <div className="p-6 border-t border-slate-800 flex justify-between">
              <button
                onClick={handleWizardBack}
                disabled={wizardStep === 1}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
              >
                Précédent
              </button>
              {wizardStep < 5 ? (
                <button
                  onClick={handleWizardNext}
                  className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold"
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={handleWizardComplete}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold"
                >
                  Publier le dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Connector Config Modal */}
      {showConnectorConfig && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowConnectorConfig(null)}>
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Configuration {connectors.find(c => c.id === showConnectorConfig)?.name}</h2>
              <button onClick={() => setShowConnectorConfig(null)}><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Client ID" className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg" />
              <input type="password" placeholder="Client Secret" className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg" />
              <button
                onClick={() => {
                  setConnectors(prev => prev.map(c => c.id === showConnectorConfig ? { ...c, status: 'connected' as const, lastSync: 'À l\'instant' } : c));
                  setShowConnectorConfig(null);
                  showToast('success', "✅ Connecté", "Connexion établie avec succès");
                }}
                className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold"
              >
                Connecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showAPIKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAPIKeyModal(false)}>
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Clé API générée</h2>
              <button onClick={() => setShowAPIKeyModal(false)}><X size={24} /></button>
            </div>
            <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4 mb-4">
              <code className="text-sm text-purple-400 break-all">{generatedAPIKey}</code>
            </div>
            <button
              onClick={handleCopyAPIKey}
              className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Copy size={18} />
              Copier la clé
            </button>
          </div>
        </div>
      )}
      </div>
    </CockpitShell>
  );
}
