"use client";

import React, { useState, useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { actionDetails } from '@/lib/chiefOfStaffActions';
import { 
  Target, DollarSign, TrendingUp, Users, AlertTriangle, 
  Lightbulb, X, Rocket, Sparkles, Search, MessageSquare,
  FileText, Send, Zap, TrendingDown, Clock, CheckCircle,
  Award, Calendar, Brain, BarChart3
} from 'lucide-react';

type ViewType = 'cockpit' | 'mission' | 'sphere';

interface Project {
  id: string;
  name: string;
  status: 'green' | 'orange' | 'red';
  progress: number;
  budget: string;
  team: string;
  risk: string;
  deadline: string;
}

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  unread: boolean;
  time: string;
  project: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  project: string;
}

export default function CockpitClientSupabasePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string>('Client');
  const [error, setError] = useState<string | null>(null);
  
  const [activeView, setActiveView] = useState<ViewType>('cockpit');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [projectDetailOpen, setProjectDetailOpen] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [autoHealingRunning, setAutoHealingRunning] = useState(false);
  const [healingSolution, setHealingSolution] = useState<string>('');
  const [toast, setToast] = useState<{message: string; type: 'success' | 'info' | 'warning' | 'error'} | null>(null);
  
  // Données Supabase
  const [projects, setProjects] = useState<Project[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const orgId = sessionStorage.getItem('powalyze_client_org');
    const name = sessionStorage.getItem('powalyze_client_name');
    
    if (!orgId) {
      router.push('/pro');
      return;
    }
    
    setOrganizationId(orgId);
    setClientName(name || 'Client');
    loadCockpitData(orgId);
  }, [router]);

  async function loadCockpitData(orgId: string) {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/cockpit?organizationId=${orgId}`);
      
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}`);
      }
      
      const data = await res.json();
      
      // Convertir les données Supabase au format attendu
      const convertedProjects: Project[] = (data.projects || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        status: p.status || 'green',
        progress: 0,
        budget: '0€',
        team: '',
        risk: 'Faible',
        deadline: '',
      }));
      
      setProjects(convertedProjects);
      setKpis(data.kpis || []);
      setRisks(data.risks || []);
      setDecisions(data.decisions || []);
      
      setIsLoading(false);
      showToast(`✅ Cockpit ${clientName} chargé : ${convertedProjects.length} projets`, 'success');
    } catch (e: any) {
      console.error('Erreur chargement:', e);
      setError(e.message);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Chargement du Cockpit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Erreur: {error}</p>
          <button onClick={() => router.push('/pro')} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Fonction pour exporter en CSV (optimisée pour INP avec startTransition)
  const exportToCSV = (data: any[], filename: string) => {
    startTransition(() => {
      requestIdleCallback(() => {
        try {
          const date = new Date().toISOString().split('T')[0];
          const csvContent = [
            Object.keys(data[0]).join(','),
            ...data.map(row => 
              Object.values(row)
                .map(val => typeof val === 'string' && val.includes(',') ? `"${val}"` : val)
                .join(',')
            )
          ].join('\n');
          
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}_${date}.csv`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('CSV téléchargé avec succès!', 'success');
        } catch (error) {
          console.error('Erreur export CSV:', error);
          showToast('Erreur lors du téléchargement CSV', 'error');
        }
      }, { timeout: 1000 });
    });
  };

  // Fonction pour exporter en JSON (optimisée pour INP avec startTransition)
  const exportToJSON = (data: any, filename: string) => {
    startTransition(() => {
      requestIdleCallback(() => {
        try {
          const date = new Date().toISOString().split('T')[0];
          const jsonContent = JSON.stringify(data, null, 2);
          const blob = new Blob([jsonContent], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}_${date}.json`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('JSON téléchargé avec succès!', 'success');
        } catch (error) {
          console.error('Erreur export JSON:', error);
          showToast('Erreur lors du téléchargement JSON', 'error');
        }
      }, { timeout: 1000 });
    });
  };

  // Fonction pour télécharger un document
  const downloadDocument = (doc: Document) => {
    showToast(`Téléchargement de ${doc.name}...`, 'info');
    // Simulation d'un téléchargement
  };

  // Fonction pour envoyer un message
  const sendMessage = () => {
    if (aiMessage.trim()) {
      setAiThinking(true);
      setTimeout(() => {
        setAiThinking(false);
        setAiMessage('');
        showToast('Message envoyé avec succès !', 'success');
      }, 2000);
    }
  };

  const messages: Message[] = [];

  const documents: Document[] = [];

  const quickActions = [
    { label: 'Documents', icon: <FileText className="w-5 h-5" />, action: () => setDocumentsOpen(true) },
    { label: 'Messages', icon: <MessageSquare className="w-5 h-5" />, count: 0, action: () => setMessagesOpen(true) },
    { label: 'Notifications', icon: <Target className="w-5 h-5" />, count: 0, action: () => setNotificationsOpen(true) },
    { label: 'Nouveau Projet', icon: <Rocket className="w-5 h-5" />, action: () => setNewProjectOpen(true) },
  ];

  const chiefOfStaffActions = [
    { 
      label: 'Optimiser portefeuille Q2', 
      impact: '+12% vélocité', 
      color: 'from-purple-600 to-indigo-600',
      action: () => {
        setSelectedAction(0);
        showToast('🎯 Optimisation Portefeuille Q2\n\n✅ Analyse complète effectuée\n\n📊 Recommandations :\n• Réaffecter 2 devs de AI Platform (92%) → Mobile App (23%)\n• Augmenter budget Digital Workplace de 50K€\n• Reporter Cybersecurity Upgrade de 2 semaines\n\n📈 Impact prévu :\n• Vélocité globale : +12%\n• Risque portfolio : -18%\n• ROI estimé : +2.4M€', 'success');
      }
    },
    { 
      label: 'Identifier 3 projets à risque', 
      impact: 'Prévention -450K€', 
      color: 'from-orange-600 to-red-600',
      action: () => {
        setSelectedAction(1);
        showToast('⚠️ Projets à Risque Identifiés\n\n🔴 CRITIQUE - Mobile App Redesign\n• Retard : 2 semaines\n• Budget : dépassement prévu +15%\n• Action : Renforcer équipe + 2 devs\n\n🟠 MOYEN - Digital Workplace\n• Progression lente (45%)\n• Dépendance bloquante API externe\n• Action : Négocier fast-track fournisseur\n\n🟠 MOYEN - Cybersecurity Upgrade\n• Ressources insuffisantes\n• Action : Recruter 1 expert sécurité\n\n💰 Économie potentielle : -450K€', 'warning');
      }
    },
    { 
      label: 'Préparer comité de pilotage', 
      impact: 'Dashboard + synthèse', 
      color: 'from-blue-600 to-indigo-600',
      action: () => {
        setSelectedAction(2);
        showToast('📊 Comité de Pilotage - Préparation\n\n✅ Documents générés :\n• Dashboard exécutif (PDF 12 pages)\n• Synthèse budgétaire Q2\n• Analyse risques portfolio\n• Timeline multi-projets\n• Recommandations stratégiques\n\n📅 Prochaine session : 22 Mars 2026, 14h00\n📍 Salle Conseil - Étage 3\n\n👥 Participants confirmés : 8/10\n\n📥 Tous les docs sont prêts pour téléchargement', 'info');
      }
    },
    { 
      label: 'Simuler +2 dev sur ERP', 
      impact: 'Livraison 3 sem. avant', 
      color: 'from-green-600 to-emerald-600',
      action: () => {
        setSelectedAction(3);
        showToast('🔮 Simulation What-If - ERP Cloud Migration\n\n📊 Scénario : +2 développeurs\n\n📈 AVANT :\n• Livraison : 30 Juin 2026\n• Progression : 78%\n• Vélocité : 12 points/sprint\n\n✨ APRÈS (prévision) :\n• Livraison : 9 Juin 2026 (-21 jours)\n• Progression projetée : 100%\n• Vélocité : 18 points/sprint (+50%)\n\n💰 Coût :\n• 2 devs x 3 mois = 60K€\n• ROI : 180K€ (early delivery bonus)\n\n✅ Recommandation : APPLIQUER', 'success');
      }
    },
    { 
      label: 'Réduire coûts de 15%', 
      impact: '1.2M€ économisés', 
      color: 'from-amber-600 to-orange-600',
      action: () => {
        setSelectedAction(4);
        showToast('💰 Plan d\'Optimisation Budgétaire\n\n📉 Opportunités identifiées :\n\n1️⃣ Renégocier licences Cloud (-180K€/an)\n2️⃣ Mutualiser infra Power BI + AI Platform (-120K€)\n3️⃣ Optimiser contractors (remote vs on-site) (-250K€)\n4️⃣ Reporter features non-critiques (-150K€)\n5️⃣ Automatiser tests (gain temps équipe) (-500K€)\n\n💵 TOTAL ÉCONOMIES : 1.2M€\n📊 Impact délais : Aucun\n✅ Impact qualité : Aucun\n\n🎯 Approbation recommandée', 'success');
      }
    },
    { 
      label: 'Accélérer Cloud de 3 sem.', 
      impact: 'Fast-track activé', 
      color: 'from-cyan-600 to-blue-600',
      action: () => {
        setSelectedAction(5);
        showToast('⚡ Fast-Track ERP Cloud Migration\n\n🚀 Mode accéléré activé\n\n📋 Actions planifiées :\n• Sprint durée réduite : 2 sem → 10 jours\n• Daily standup x2 (matin + soir)\n• +1 architecte senior dédié\n• Tests parallélisés (CI/CD optimisé)\n• Revue architecture hebdomadaire\n\n📅 Nouveau planning :\n• Livraison : 9 Juin 2026 (au lieu de 30 Juin)\n• Gain : 21 jours\n\n💰 Surcoût : 85K€\n📈 Bénéfice business : 320K€ (early delivery)\n\n✅ ROI : +235K€', 'success');
      }
    },
  ];

  // Chief of Staff AI Panel (remplace le AiAssistantPanel)
  const ChiefOfStaffPanel = () => (
    <div className="w-96 h-full bg-gradient-to-b from-slate-900 to-slate-800 border-l border-purple-500/30 p-6 space-y-6 overflow-y-auto">
      {/* Header with Halo Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-purple-600/20 blur-xl rounded-full animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-white animate-pulse" />
            <div className="flex-1">
              <h3 className="font-bold text-white">Chief of Staff IA</h3>
              <p className="text-xs text-purple-200">Analyse continue • Prédiction active</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Analyse Temps Réel */}
      <div className="bg-slate-800/50 p-4 rounded-xl border border-purple-500/30">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-semibold text-purple-400">Analyse en cours...</h4>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-slate-300">• {projects.length} projets analysés</p>
          <p className="text-xs text-slate-300">• {risks.length} risques détectés</p>
          <p className="text-xs text-slate-300">• 0 opportunité identifiée</p>
          <p className="text-xs text-green-400 mt-2">✨ Portfolio {projects.length === 0 ? 'vide' : 'sain'}</p>
        </div>
      </div>

      {/* Premium Actions - Only show when there are projects */}
      {projects.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-purple-400">Actions recommandées</p>
          {chiefOfStaffActions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedAction(i);
                if (typeof action.action === 'function') {
                  action.action();
                }
              }}
              className={`w-full text-left p-4 rounded-lg bg-gradient-to-r ${action.color} shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer`}
            >
              <p className="font-semibold text-white text-sm group-hover:translate-x-1 transition-transform duration-300">
                {action.label}
              </p>
              <p className="text-xs text-white/80 mt-1">{action.impact}</p>
            </button>
          ))}
        </div>
      )}

      {/* Empty state message for IA */}
      {projects.length === 0 && (
        <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-sm text-slate-400 text-center">
            <Brain className="w-8 h-8 mx-auto mb-2 text-purple-400 opacity-50" />
            Ajoutez vos premiers projets pour recevoir des recommandations IA
          </p>
        </div>
      )}

      {/* Chat Input */}
      <div className="pt-4 border-t border-slate-700">
        <textarea
          value={aiMessage}
          onChange={(e) => setAiMessage(e.target.value)}
          placeholder="Posez une question stratégique..."
          className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
          rows={3}
        />
        <button 
          onClick={() => {
            if (aiMessage.trim()) {
              setAiThinking(true);
              setTimeout(() => {
                setAiMessage('');
                setAiThinking(false);
              }, 2000);
            }
          }}
          className="mt-2 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Envoyer
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        
        {/* Modal détails action Chief of Staff */}
        {selectedAction !== null && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full p-8 relative border border-purple-500/20 shadow-2xl shadow-purple-500/20 max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setSelectedAction(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                aria-label="Fermer le modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-bold text-white">{actionDetails[selectedAction].title}</h2>
                </div>
                <p className="text-lg text-purple-400 font-semibold">{actionDetails[selectedAction].impact}</p>
                <p className="text-gray-300 mt-3 text-lg">{actionDetails[selectedAction].description}</p>
              </div>

              {/* Plan d'action */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-blue-400" />
                  Plan d&apos;action
                </h3>
                <div className="space-y-3">
                  {actionDetails[selectedAction].actions.map((action, idx) => (
                    <div key={idx} className="bg-slate-800/50 border border-blue-500/30 p-4 rounded-lg flex items-start gap-3">
                      <div className="bg-blue-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-400 font-bold">{idx + 1}</span>
                      </div>
                      <p className="text-gray-200 flex-1">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bénéfices */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Bénéfices attendus
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {actionDetails[selectedAction].benefits.map((benefit, idx) => (
                    <div key={idx} className="bg-slate-800/50 border border-green-500/30 p-4 rounded-lg flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-200 text-sm">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risques */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Risques à considérer
                </h3>
                <div className="space-y-3">
                  {actionDetails[selectedAction].risks.map((risk, idx) => (
                    <div key={idx} className="bg-slate-800/50 border border-orange-500/30 p-4 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-200 text-sm">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métriques */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Métriques & Timeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 border border-cyan-500/30 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">Timeline</p>
                    <p className="text-white font-semibold">{actionDetails[selectedAction].timeline}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-purple-500/30 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">KPIs à suivre</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {actionDetails[selectedAction].kpis.map((kpi, idx) => (
                        <span key={idx} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                          {kpi}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    showToast('Lancement de l\'action en cours...', 'info');
                    setSelectedAction(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Exécuter l&apos;action
                </button>
                <button
                  onClick={() => {
                    showToast('Action ajoutée à la planification', 'success');
                    setSelectedAction(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Planifier
                </button>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all duration-300 font-semibold"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Header - Remplace "Cockpit Exécutif" */}
        <div className="relative w-full h-48 overflow-hidden border-b-4 border-gradient-to-r from-amber-500 via-orange-600 to-amber-500 shadow-2xl">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950">
            {/* Effet de grille */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Cockpit Exécutif
              </h1>
              <p className="text-xl text-blue-400 mt-2">Visualisation temps réel de votre portefeuille</p>
            </div>
          </div>
        </div>

        {/* Three-View Navigation */}
        <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveView('cockpit');
                setTimeout(() => {
                  showToast('🎯 Vue Cockpit Exécutif activée !\n\n📊 Modules disponibles :\n\n1️⃣ KPIs Stratégiques\n• Budget global (avec détails au clic)\n• Taux de succès projets\n• Charge équipes\n\n2️⃣ Portfolio Sphere\n• 6 projets actifs visualisés\n• Filtres IA intelligents\n• Simulations What-If\n\n3️⃣ Alertes & Opportunités\n• Risques en temps réel\n• Suggestions IA proactives\n\n4️⃣ Quick Actions\n• Documents, Messages, Notifications\n• Nouveau projet\n\n⚡ Tout est interactif et cliquable !', 'info');
                }, 300);
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeView === 'cockpit'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Target className="w-5 h-5" />
              Vue Cockpit
            </button>
            <button
              onClick={() => {
                setActiveView('mission');
                setTimeout(() => {
                  showToast('🚀 Mission Control activé !\n\n📋 Outils de pilotage avancés :\n\n1️⃣ Timeline Multi-Projets\n• Visualisation temps réel\n• Progression automatique\n• Deadlines trackées\n\n2️⃣ Charge Équipes\n• Analyse disponible avec vos projets\n• Alertes automatiques\n• Optimisation IA\n\n3️⃣ Scénarios What-If\n• Simulations intelligentes\n• Impacts prédits\n• Décisions éclairées\n\n🤖 IA calcule impacts en temps réel\n✅ Créez vos projets pour commencer !', 'info');
                }, 300);
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeView === 'mission'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Rocket className="w-5 h-5" />
              Mission Control
            </button>
            <button
              onClick={() => {
                setActiveView('sphere');
                setTimeout(() => {
                  alert('✨ Living Sphere 3D activée !\n\n🌐 Visualisation immersive du portfolio\n\n🎯 Interactions disponibles :\n• Cliquez sur un projet pour les détails\n• Survol pour info-bulle rapide\n• Les lignes montrent les dépendances\n• Animation = état en temps réel\n\n💡 Intelligence visuelle :\n• Projets critiques pulsent en rouge\n• Projets à risque en orange\n• Projets sains en vert stable\n\n🔄 Orbitale dynamique :\n• 6 projets en orbite autour du cockpit\n• Position = priorité\n• Taille = budget relatif\n\n🤖 L\'IA analyse en continu les patterns\n✨ Expérience ultra-immersive !');
                }, 300);
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeView === 'sphere'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Living Sphere
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Vue Cockpit Exécutif */}
          {activeView === 'cockpit' && (
            <div className="space-y-6">
              {/* Header avec boutons d'export */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Vue d&apos;ensemble</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setTimeout(() => {
                        showToast('Génération du PDF en cours...', 'info');
                        const exportTask = () => {
                          setTimeout(() => {
                            showToast('PDF généré avec succès!', 'success');
                          }, 100);
                        };
                        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
                          requestIdleCallback(() => exportTask(), { timeout: 200 });
                        } else {
                          setTimeout(() => exportTask(), 0);
                        }
                      }, 0);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    PDF
                  </button>
                  <button 
                    onClick={() => {
                      setTimeout(() => {
                        showToast('Génération du PowerPoint en cours...', 'info');
                        const exportTask = () => {
                          setTimeout(() => {
                            showToast('PPT généré avec succès!', 'success');
                          }, 100);
                        };
                        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
                          requestIdleCallback(() => exportTask(), { timeout: 200 });
                        } else {
                          setTimeout(() => exportTask(), 0);
                        }
                      }, 0);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    PPT
                  </button>
                  <button 
                    onClick={() => window.open('/powerbi', '_blank')}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-slate-950 font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Power BI
                  </button>
                  <button 
                    onClick={() => exportToCSV(projects, 'projets_cockpit')}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    CSV
                  </button>
                  <button 
                    onClick={() => exportToJSON(projects, 'projets_cockpit')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Exporter JSON
                  </button>
                </div>
              </div>
              
              {/* KPIs Premium — Pulsation + Seuils Critiques */}
              <div className="grid grid-cols-4 gap-4">
                  <button onClick={() => showToast('Projets actifs : ' + projects.length, 'info')} className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-blue-500/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer text-left w-full">
                    <div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <Target className="w-8 h-8 text-blue-400 animate-pulse" />
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <p className="text-3xl font-bold text-white mt-4">{projects.length}</p>
                      <p className="text-sm text-slate-400">Projets actifs</p>
                      <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        +8% vs mois dernier
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <p className="text-xs text-blue-400">💡 IA: +2 projets prévus Q2</p>
                      </div>
                    </div>
                  </button>
                
                <button onClick={() => setSelectedKpi('budget')} className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-red-500/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group animate-pulse cursor-pointer text-left">
                  <div className="absolute inset-0 bg-red-500/20 blur-xl opacity-70 rounded-xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <DollarSign className="w-8 h-8 text-amber-400" />
                      <TrendingDown className="w-5 h-5 text-red-400 animate-bounce" />
                    </div>
                    <p className="text-3xl font-bold text-white mt-4">{projects.length > 0 ? '0€' : '0€'}</p>
                    <p className="text-sm text-slate-400">Budget total</p>
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      98% consommé — Seuil critique
                    </p>
                    <div className="mt-3 pt-3 border-t border-red-700">
                      <p className="text-xs text-red-400">🚨 IA: Risque dépassement 180K€</p>
                    </div>
                  </div>
                </button>
                
                <button onClick={() => setSelectedKpi('success')} className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-green-500/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer text-left">
                  <div className="absolute inset-0 bg-green-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <Award className="w-8 h-8 text-green-400 animate-pulse" />
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mt-4">{projects.length > 0 ? '0%' : '0%'}</p>
                    <p className="text-sm text-slate-400">Taux de succès</p>
                    <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      +4% au-dessus objectif (90%)
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-green-400">✨ IA: Maturité excellente</p>
                    </div>
                  </div>
                </button>
                
                <button onClick={() => setSelectedKpi('teams')} className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-purple-500/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer text-left">
                  <div className="absolute inset-0 bg-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <Users className="w-8 h-8 text-purple-400 animate-pulse" />
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mt-4">0</p>
                    <p className="text-sm text-slate-400">Équipes actives</p>
                    <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      +12 FTE engagés ce mois
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-orange-400">⚠️ IA: Team Alpha surcharge 105%</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Portfolio Sphere Visualization — Interactive Nodes */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-blue-500/30 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-amber-400">Portfolio Sphere — Vue d'ensemble</h3>
                    <p className="text-xs text-slate-400 mt-1">{projects.length} projets • {risks.length} risques • {decisions.length} décisions</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => showToast('🤖 Filtres IA activés !\n\n• Projets à haut risque : 4\n• Projets suggérés pour audit : 2\n• Projets performants : 6\n• Projets sous-performants : 2\n\nFiltre appliqué : Projets nécessitant attention urgente', 'info')}
                      className="px-3 py-1 bg-slate-700 text-xs text-white rounded-lg hover:bg-slate-600 transition-all duration-300"
                    >
                      Filtres IA
                    </button>
                    <button 
                      onClick={() => showToast('🔮 Simulation What-If activée !\n\nTestez des scénarios :\n• +20% budget sur Projet Alpha\n• -2 semaines délai Projet Beta\n• +3 développeurs équipe Delta\n\nL\'IA calcule l\'impact sur vos KPIs en temps réel.', 'info')}
                      className="px-3 py-1 bg-blue-600 text-xs text-white rounded-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      What-If
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => { setSelectedProject(project); setProjectDetailOpen(true); }}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${
                        project.status === 'green' ? 'border-green-500 bg-green-500/10' :
                        project.status === 'orange' ? 'border-orange-500 bg-orange-500/10' :
                        'border-red-500 bg-red-500/10'
                      }`}
                    >
                      <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full ${
                        project.status === 'green' ? 'bg-green-500 animate-pulse' :
                        project.status === 'orange' ? 'bg-orange-500 animate-pulse' :
                        'bg-red-500 animate-pulse'
                      }`}></div>
                      <p className="font-semibold text-white text-sm mb-2">{project.name}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              project.status === 'green' ? 'bg-green-500' :
                              project.status === 'orange' ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400">{project.progress}%</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{project.budget}</span>
                        <span>{project.team}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs text-blue-400">→ Voir détails</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects List with Progress */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-blue-500/30 shadow-xl">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Projets en cours</h3>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">{project.name}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'green' ? 'bg-green-500/20 text-green-400' :
                          project.status === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {project.risk}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            project.status === 'green' ? 'bg-green-500' :
                            project.status === 'orange' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{project.budget}</span>
                        <span>{project.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks & Opportunities */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-red-900/20 to-slate-900 p-6 rounded-xl border border-red-500/30 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <h3 className="text-lg font-bold text-red-400">Alertes & Risques</h3>
                  </div>
                  <div className="space-y-2">
                    {risks.length === 0 ? (
                      <p className="text-sm text-slate-400">Aucune alerte pour le moment</p>
                    ) : (
                      risks.map(risk => (
                        <div key={risk.id} className="bg-slate-800 p-3 rounded-lg border-l-4 border-red-500">
                          <p className="text-sm font-semibold text-white">{risk.title}</p>
                          <p className="text-xs text-slate-400 mt-1">{risk.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-900/20 to-slate-900 p-6 rounded-xl border border-green-500/30 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-bold text-green-400">Opportunités IA</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">Aucune opportunité détectée</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-4">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-blue-500/30 shadow-xl hover:shadow-2xl hover:scale-105 hover:border-blue-400 transition-all duration-300 group"
                  >
                    {action.count && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                        {action.count}
                      </span>
                    )}
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                        {action.icon}
                      </div>
                      <span className="text-sm font-semibold text-white">{action.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vue Mission Control */}
          {activeView === 'mission' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-blue-500/30 shadow-xl">
                <h3 className="text-xl font-bold text-amber-400 mb-6">Timeline Multi-Projets</h3>
                <div className="space-y-4">
                  {projects.map((project, i) => (
                    <div key={project.id} className="relative">
                      <div className="flex items-center gap-4">
                        <div className="w-40 text-sm font-semibold text-white">{project.name}</div>
                        <div className="flex-1 bg-slate-700 rounded-full h-8 relative overflow-hidden">
                          <div
                            className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                              project.status === 'green' ? 'bg-gradient-to-r from-green-600 to-emerald-500' :
                              project.status === 'orange' ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
                              'bg-gradient-to-r from-red-600 to-rose-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          >
                            <span className="absolute right-2 top-1 text-xs font-bold text-white">{project.progress}%</span>
                          </div>
                        </div>
                        <div className="w-32 text-xs text-slate-400">{project.deadline}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-purple-500/30 shadow-xl">
                  <h3 className="text-lg font-bold text-purple-400 mb-4">Charge Équipes</h3>
                  <div className="space-y-3">
                    {projects.length === 0 ? (
                      <p className="text-sm text-slate-400">Aucune équipe à afficher</p>
                    ) : (
                      <p className="text-sm text-slate-400">Données disponibles une fois vos équipes créées</p>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-cyan-500/30 shadow-xl">
                  <h3 className="text-lg font-bold text-cyan-400 mb-4">Scénarios What-If</h3>
                  <div className="space-y-3">
                    {projects.length === 0 ? (
                      <p className="text-sm text-slate-400">Aucune simulation disponible</p>
                    ) : (
                      <p className="text-sm text-slate-400">Simulations disponibles quand vous aurez des projets</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vue Living Sphere */}
          {activeView === 'sphere' && (
            <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-12 rounded-xl border border-indigo-500/30 shadow-2xl min-h-[600px] overflow-hidden">
              {/* Animated stars background */}
              <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white rounded-full animate-pulse"
                    style={{
                      width: `${Math.random() * 3}px`,
                      height: `${Math.random() * 3}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      opacity: Math.random() * 0.7,
                    }}
                  ></div>
                ))}
              </div>

              {/* Central sphere */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 animate-pulse shadow-2xl">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-50 blur-xl animate-spin" style={{ animationDuration: '10s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              {/* Orbital projects */}
              {projects.map((project, i) => {
                const angle = (i * 360) / projects.length;
                const radius = 200;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                
                return (
                  <div
                    key={project.id}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    <button
                      onClick={() => setSelectedProject(project)}
                      className={`relative group w-20 h-20 rounded-full border-4 transition-all duration-300 hover:scale-125 hover:shadow-2xl ${
                        project.status === 'green' ? 'border-green-500 bg-green-500/30' :
                        project.status === 'orange' ? 'border-orange-500 bg-orange-500/30' :
                        'border-red-500 bg-red-500/30'
                      }`}
                      style={{
                        animation: project.status === 'red' ? 'pulse 2s infinite' : 'none'
                      }}
                    >
<div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                  {project.progress || 0}%
                </div>
                      
                      {/* Connection line to center */}
                      <div
                        className={`absolute top-1/2 left-1/2 w-1 origin-left ${
                          project.status === 'green' ? 'bg-green-500' :
                          project.status === 'orange' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{
                          height: '2px',
                          width: `${radius}px`,
                          transform: `rotate(${angle + 180}deg)`,
                          opacity: 0.3,
                        }}
                      ></div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900 p-2 rounded-lg shadow-xl border border-blue-500/30 whitespace-nowrap">
                        <p className="text-xs font-semibold text-white">{project.name}</p>
                        <p className="text-xs text-slate-400">{project.budget}</p>
                      </div>
                    </button>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-6 left-6 bg-slate-900/80 p-4 rounded-lg border border-slate-700">
                <p className="text-xs font-semibold text-white mb-2">Légende</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-slate-300">On track</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs text-slate-300">At risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs text-slate-300">Critical</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panneau Latéral Projet Ultra-Détaillé */}
        {projectDetailOpen && selectedProject && (
          <div className="fixed inset-y-0 right-0 w-[600px] bg-gradient-to-br from-slate-900 to-slate-950 border-l border-blue-500/30 z-50 shadow-2xl overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-amber-400">{selectedProject.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">Sponsor: Marie Laurent • Team: {selectedProject.team}</p>
                </div>
                <button
                  onClick={() => { setProjectDetailOpen(false); setSelectedProject(null); }}
                  className="text-slate-400 hover:text-white transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Statut & KPIs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Progression</p>
                  <p className="text-2xl font-bold text-white">{selectedProject.progress}%</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Budget</p>
                  <p className="text-xl font-bold text-white">{selectedProject.budget}</p>
                </div>
                <div className={`p-4 rounded-lg border ${
                  selectedProject.status === 'green' ? 'bg-green-500/10 border-green-500' :
                  selectedProject.status === 'orange' ? 'bg-orange-500/10 border-orange-500' :
                  'bg-red-500/10 border-red-500'
                }`}>
                  <p className="text-xs text-slate-400 mb-1">Risque</p>
                  <p className="text-lg font-bold text-white">{selectedProject.risk}</p>
                </div>
              </div>

              {/* Timeline Dynamique */}
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h4 className="text-sm font-bold text-blue-400 mb-4">Timeline & Jalons</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm text-white">Phase 1: Discovery</p>
                      <p className="text-xs text-slate-400">Complété le 15 Jan 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                    <div className="flex-1">
                      <p className="text-sm text-white">Phase 2: Development</p>
                      <p className="text-xs text-slate-400">En cours • {selectedProject.progress}% complété</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-400">Phase 3: Testing</p>
                      <p className="text-xs text-slate-500">Prévu pour 15 Mar 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-400">Phase 4: Deployment</p>
                      <p className="text-xs text-slate-500">Deadline: {selectedProject.deadline}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ressources */}
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h4 className="text-sm font-bold text-purple-400 mb-4">Ressources Allouées</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">JD</div>
                      <div>
                        <p className="text-sm text-white">John Doe</p>
                        <p className="text-xs text-slate-400">Tech Lead</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-400">95% charge</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">SM</div>
                      <div>
                        <p className="text-sm text-white">Sophie Martin</p>
                        <p className="text-xs text-slate-400">Product Owner</p>
                      </div>
                    </div>
                    <span className="text-xs text-orange-400">110% charge</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">TD</div>
                      <div>
                        <p className="text-sm text-white">Thomas Dubois</p>
                        <p className="text-xs text-slate-400">Developer</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-400">78% charge</span>
                  </div>
                </div>
              </div>

              {/* Dépendances */}
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h4 className="text-sm font-bold text-cyan-400 mb-4">Dépendances & Intégrations</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-white">Power BI Dashboard Suite</p>
                    <span className="text-xs text-green-400 ml-auto">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <p className="text-sm text-white">Digital Workplace</p>
                    <span className="text-xs text-orange-400 ml-auto">En attente</span>
                  </div>
                </div>
              </div>

              {/* Documents Récents */}
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h4 className="text-sm font-bold text-amber-400 mb-4">Documents Récents</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white hover:text-blue-400 cursor-pointer transition-colors duration-300">
                    <FileText className="w-4 h-4" />
                    <span>Project_Charter_v3.pdf</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white hover:text-blue-400 cursor-pointer transition-colors duration-300">
                    <FileText className="w-4 h-4" />
                    <span>Architecture_Diagram.fig</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white hover:text-blue-400 cursor-pointer transition-colors duration-300">
                    <FileText className="w-4 h-4" />
                    <span>Sprint_Report_Week12.docx</span>
                  </div>
                </div>
              </div>

              {/* Recommandations IA */}
              <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-5 rounded-xl border border-purple-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h4 className="text-sm font-bold text-purple-400">Recommandations IA</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-sm text-white mb-1">🎯 Action recommandée</p>
                    <p className="text-xs text-slate-400">Allouer 1 dev supplémentaire pour respecter deadline Q2</p>
                    <p className="text-xs text-green-400 mt-1">Impact: -2 semaines sur timeline</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-sm text-white mb-1">⚠️ Risque détecté</p>
                    <p className="text-xs text-slate-400">Dépendance "Digital Workplace" bloque 3 sprints</p>
                    <p className="text-xs text-orange-400 mt-1">Probabilité: 67% • Impact: -450K€</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-sm text-white mb-1">💡 Opportunité</p>
                    <p className="text-xs text-slate-400">Réutiliser composants du projet AI Platform</p>
                    <p className="text-xs text-green-400 mt-1">Économie: 120K€ • Gain: 3 semaines</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    if (selectedProject) {
                      setProjectDetailOpen(false);
                      showToast('Édition du projet ' + selectedProject.name, 'info');
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Éditer projet
                </button>
                <button 
                  onClick={() => {
                    if (selectedProject) {
                      exportToJSON(selectedProject, `rapport_${selectedProject.name.replace(/\s+/g, '_')}`);
                    }
                  }}
                  className="flex-1 bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-600 transition-all duration-300">
                  Exporter rapport
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Mission Launch (New Project) */}
        {newProjectOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-amber-500/30 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
                    <Rocket className="w-8 h-8 text-amber-400" />
                    Mission Launch
                  </h3>
                  <p className="text-slate-400 mt-2">Création de projet augmentée par IA</p>
                </div>
                <button
                  onClick={() => setNewProjectOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Left: Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Nom du projet</label>
                    <input
                      type="text"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-300"
                      placeholder="Ex: Digital Transformation Q3"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Sponsor exécutif</label>
                    <input
                      type="text"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-300"
                      placeholder="Ex: Marie Dubois"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400 mb-1 block">Budget estimé</label>
                      <input
                        type="text"
                        className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-300"
                        placeholder="Ex: 1.2M€"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 mb-1 block">Deadline</label>
                      <input
                        type="date"
                        className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Description</label>
                    <textarea
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-3 resize-none focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-300"
                      rows={4}
                      placeholder="Décrivez les objectifs du projet..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">Modules IA à activer</p>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <span className="text-sm text-white">Auto-génération du WBS</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <span className="text-sm text-white">Estimation budget IA</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <span className="text-sm text-white">Analyse des risques prédictive</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm text-white">Suggestions d'intégrations</span>
                    </label>
                  </div>
                </div>
                
                {/* Right: AI Suggestions */}
                <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h4 className="font-semibold text-purple-400">Suggestions IA</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Budget estimé</p>
                      <p className="text-lg font-bold text-white">1.2M€ - 1.5M€</p>
                      <p className="text-xs text-green-400 mt-1">Confiance: 87%</p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Durée recommandée</p>
                      <p className="text-lg font-bold text-white">6-8 mois</p>
                      <p className="text-xs text-green-400 mt-1">Basé sur projets similaires</p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Risques identifiés</p>
                      <div className="space-y-1 mt-2">
                        <p className="text-xs text-orange-400">⚠️ Dépendance externe critique</p>
                        <p className="text-xs text-yellow-400">⚠️ Compétences rares (AI/ML)</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Ressources suggérées</p>
                      <p className="text-sm text-white">• 2 Tech Leads</p>
                      <p className="text-sm text-white">• 5 Développeurs</p>
                      <p className="text-sm text-white">• 1 Product Owner</p>
                      <p className="text-sm text-white">• 1 UX Designer</p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Jalons recommandés</p>
                      <p className="text-xs text-white">• M1: POC & Architecture</p>
                      <p className="text-xs text-white">• M3: MVP & Tests</p>
                      <p className="text-xs text-white">• M6: Release Production</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setNewProjectOpen(false)}
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all duration-300"
                >
                  Annuler
                </button>
                <button 
                  onClick={async () => {
                    const projectInput = document.querySelector('input[placeholder*="Digital Transformation"]') as HTMLInputElement;
                    const budgetInput = document.querySelector('input[placeholder*="1.2M€"]') as HTMLInputElement;
                    const projectName = projectInput?.value || 'Nouveau Projet';
                    const budget = budgetInput?.value || '0€';
                    
                    if (!projectName.trim()) {
                      showToast('⚠️ Veuillez entrer un nom de projet', 'warning');
                      return;
                    }
                    
                    setNewProjectOpen(false);
                    showToast('⏳ Création du projet...', 'info');
                    
                    try {
                      const res = await fetch('/api/projects', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: projectName,
                          organizationId: organizationId,
                          status: 'green',
                        }),
                      });
                      
                      if (!res.ok) {
                        throw new Error(`Erreur ${res.status}`);
                      }
                      
                      const newProject = await res.json();
                      setProjects([...projects, newProject]);
                      
                      showToast(
                        `🚀 Projet créé avec succès !\n\n` +
                        `📋 ${projectName}\n\n` +
                        `✅ Le projet est maintenant dans votre portfolio.`,
                        'success'
                      );
                    } catch (e: any) {
                      console.error('Erreur création projet:', e);
                      showToast(`❌ Erreur création projet: ${e.message}`, 'error');
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Lancer le projet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Documents */}
        {documentsOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-blue-500/30 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
                    <FileText className="w-7 h-7" />
                    Documents
                  </h3>
                  <p className="text-slate-400 mt-1">234 fichiers dans le portfolio</p>
                </div>
                <button
                  onClick={() => setDocumentsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Recherche instantanée..."
                  className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
                />
              </div>
              
              {/* Documents List */}
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                        <div>
                          <p className="font-semibold text-white">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.project} • {doc.modified}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-slate-400">{doc.type}</p>
                          <p className="text-xs text-slate-500">{doc.size}</p>
                        </div>
                        <button
                          onClick={() => downloadDocument(doc)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          Télécharger
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Messages */}
        {messagesOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-blue-500/30 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
                    <MessageSquare className="w-7 h-7" />
                    Messages
                  </h3>
                  <p className="text-slate-400 mt-1">{messages.length} message{messages.length > 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => setMessagesOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Messages List */}
              <div className="space-y-2">
                {messages.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">Aucun message pour le moment</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer group ${
                      msg.unread 
                        ? 'bg-blue-500/10 border-blue-500/50 hover:border-blue-400' 
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {msg.sender.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{msg.sender}</p>
                            <p className="text-xs text-slate-400">{msg.time}</p>
                          </div>
                        </div>
                        {msg.unread && (
                          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-white text-sm mb-1">{msg.subject}</p>
                      <p className="text-sm text-slate-400">{msg.preview}</p>
                      <p className="text-xs text-blue-400 mt-2">📁 {msg.project}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Notifications */}
        {notificationsOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-blue-500/30 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-amber-400">Notifications</h3>
                  <p className="text-slate-400 mt-1">{risks.length} alerte{risks.length > 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="font-semibold text-white text-sm">🚨 Urgent: Mobile App retard critique</p>
                  <p className="text-xs text-slate-400 mt-1">Il y a 12 min</p>
                </div>
                <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-lg">
                  <p className="font-semibold text-white text-sm">⚠️ Important: Validation budget Q2</p>
                  <p className="text-xs text-slate-400 mt-1">Il y a 1h</p>
                </div>
                <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded-lg">
                  <p className="font-semibold text-white text-sm">💡 Opportunité: AI Platform livraison anticipée</p>
                  <p className="text-xs text-slate-400 mt-1">Il y a 3h</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal KPI Budget */}
        {selectedKpi === 'budget' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-red-500/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white">📊 Analyse Budgétaire Détaillée</h3>
                  <p className="text-slate-400 mt-2">Budget Total: 7.8M€ • Consommé: 98% • Risque: Élevé</p>
                </div>
                <button onClick={() => setSelectedKpi(null)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl">
                  <p className="text-green-400 text-sm mb-2">✅ En bonne santé</p>
                  <p className="text-4xl font-bold text-white">14</p>
                  <p className="text-slate-400 text-sm mt-2">Projets dans les clous budgétaires</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-xl">
                  <p className="text-orange-400 text-sm mb-2">⚠️ À surveiller</p>
                  <p className="text-4xl font-bold text-white">17</p>
                  <p className="text-slate-400 text-sm mt-2">Projets proches du seuil (90-100%)</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl">
                  <p className="text-red-400 text-sm mb-2">🚨 Critiques</p>
                  <p className="text-4xl font-bold text-white">11</p>
                  <p className="text-slate-400 text-sm mt-2">Projets en dépassement budgétaire</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl">
                  <p className="text-blue-400 text-sm mb-2">📈 Tendance</p>
                  <p className="text-4xl font-bold text-white">+8%</p>
                  <p className="text-slate-400 text-sm mt-2">Hausse vs mois dernier</p>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6">
                <h4 className="font-bold text-white mb-4">🚨 Top 3 Risques Budgétaires</h4>
                <div className="space-y-3">
                  <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded">
                    <p className="font-semibold text-white">ERP Cloud Migration</p>
                    <p className="text-sm text-slate-400 mt-1">Dépassement: +255K€ (+8%) • Impact: Élevé</p>
                  </div>
                  <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded">
                    <p className="font-semibold text-white">Mobile App Development</p>
                    <p className="text-sm text-slate-400 mt-1">Dépassement prévu: +120K€ (+5%) • Impact: Moyen</p>
                  </div>
                  <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded">
                    <p className="font-semibold text-white">Data Platform v2</p>
                    <p className="text-sm text-slate-400 mt-1">Risque: +90K€ (+3%) • Impact: Moyen</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/30">
                <h4 className="font-bold text-blue-400 mb-3">💡 Recommandations IA</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>✓ Renégocier les contrats consultants (-180K€ économie potentielle)</li>
                  <li>✓ Optimiser l'utilisation des licences cloud (-50K€/mois)</li>
                  <li>✓ Reporter 3 projets non-critiques au Q3 pour lisser la charge</li>
                  <li>✓ Réallouer le budget des projets terminés en avance (450K€ disponibles)</li>
                </ul>
              </div>

              <button onClick={() => setSelectedKpi(null)} className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:scale-105 transition-all">
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Modal KPI Success */}
        {selectedKpi === 'success' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-green-500/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white">🏆 Analyse Taux de Succès</h3>
                  <p className="text-slate-400 mt-2">Performance Globale: 94% • Objectif: 90% • Tendance: +4%</p>
                </div>
                <button onClick={() => setSelectedKpi(null)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl">
                  <p className="text-green-400 text-sm mb-2">✅ Livrés à temps</p>
                  <p className="text-4xl font-bold text-white">28</p>
                  <p className="text-slate-400 text-sm mt-2">Projets respect délais (67%)</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl">
                  <p className="text-blue-400 text-sm mb-2">⚡ En avance</p>
                  <p className="text-4xl font-bold text-white">8</p>
                  <p className="text-slate-400 text-sm mt-2">Livrés avant deadline (19%)</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-xl">
                  <p className="text-orange-400 text-sm mb-2">⏰ En retard</p>
                  <p className="text-4xl font-bold text-white">6</p>
                  <p className="text-slate-400 text-sm mt-2">Livraison tardive (14%)</p>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6">
                <h4 className="font-bold text-white mb-4">📊 Métriques Qualité</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Satisfaction Client</span>
                      <span className="text-green-400 font-bold">4.7/5</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full w-[94%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">ROI Moyen</span>
                      <span className="text-green-400 font-bold">+187%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Adoption Utilisateur</span>
                      <span className="text-green-400 font-bold">89%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full w-[89%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 p-6 rounded-xl border border-green-500/30">
                <h4 className="font-bold text-green-400 mb-3">✨ Best Performers</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>🥇 AI Platform: Livré 3 semaines en avance, budget -8%, satisfaction 4.9/5</li>
                  <li>🥈 Digital Workplace: Délai respecté, ROI +240%, adoption 95%</li>
                  <li>🥉 Cloud Migration: Livré à temps, économies -15% infra, 0 incident</li>
                </ul>
              </div>

              <button onClick={() => setSelectedKpi(null)} className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:scale-105 transition-all">
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Modal KPI Teams */}
        {selectedKpi === 'teams' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-purple-500/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white">👥 Analyse Équipes & Ressources</h3>
                  <p className="text-slate-400 mt-2">287 FTE Actifs • Charge Moyenne: 92% • +12 FTE ce mois</p>
                </div>
                <button onClick={() => setSelectedKpi(null)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl">
                  <p className="text-green-400 text-sm mb-2">✅ Capacité Optimale</p>
                  <p className="text-4xl font-bold text-white">18</p>
                  <p className="text-slate-400 text-sm mt-2">Équipes à 70-90% charge</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-xl">
                  <p className="text-orange-400 text-sm mb-2">⚠️ Surcharge</p>
                  <p className="text-4xl font-bold text-white">7</p>
                  <p className="text-slate-400 text-sm mt-2">Équipes à plus de 100%</p>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6">
                <h4 className="font-bold text-white mb-4">🚨 Équipes en Surcharge</h4>
                <div className="space-y-3">
                  <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded">
                    <p className="font-semibold text-white">Team Alpha (Dev Backend)</p>
                    <p className="text-sm text-slate-400 mt-1">Charge: 120% • 3 membres en congé • Burnout imminent</p>
                  </div>
                  <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded">
                    <p className="font-semibold text-white">Team Data Engineering</p>
                    <p className="text-sm text-slate-400 mt-1">Charge: 108% • Sprint urgent ajouté • Besoin renfort</p>
                  </div>
                  <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded">
                    <p className="font-semibold text-white">Team UX/UI</p>
                    <p className="text-sm text-slate-400 mt-1">Charge: 105% • 2 projets parallèles • Qualité en baisse</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/30">
                <h4 className="font-bold text-purple-400 mb-3">💡 Recommandations IA</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>✓ Réaffecter 2 devs de Team Beta vers Team Alpha (charge Beta: 75%)</li>
                  <li>✓ Recruter 3 contractors seniors pour 2 mois (coût: 120K€)</li>
                  <li>✓ Reporter 5 tâches non-critiques au sprint suivant</li>
                  <li>✓ Automatiser 15h/semaine de tâches répétitives (tests, déploiement)</li>
                </ul>
              </div>

              <button onClick={() => setSelectedKpi(null)} className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:scale-105 transition-all">
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
            <div className={`px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-sm ${
              toast.type === 'success' ? 'bg-green-900/90 border-green-500 text-green-100' :
              toast.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-100' :
              toast.type === 'warning' ? 'bg-orange-900/90 border-orange-500 text-orange-100' :
              'bg-blue-900/90 border-blue-500 text-blue-100'
            }`}>
              <div className="flex items-start gap-3 max-w-md">
                <div className="flex-1 whitespace-pre-line text-sm">{toast.message}</div>
                <button onClick={() => setToast(null)} className="text-white/70 hover:text-white">✕</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chief of Staff Panel */}
      <ChiefOfStaffPanel />
    </div>
  );
}

