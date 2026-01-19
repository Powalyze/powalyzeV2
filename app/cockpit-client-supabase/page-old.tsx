"use client";

import React, { useState, useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Target, DollarSign, TrendingUp, Users, AlertTriangle, 
  Lightbulb, X, Rocket, Sparkles, Search, MessageSquare,
  FileText, Send, Zap, TrendingDown, Clock, CheckCircle,
  Award, Calendar, Brain, BarChart3, Plus, UserPlus
} from 'lucide-react';

type ViewType = 'cockpit' | 'mission' | 'sphere';
type TabType = 'cockpit' | 'portfolio' | 'risks' | 'decisions' | 'reports' | 'connectors' | 'team';

interface Project {
  id: string;
  name: string;
  status: 'green' | 'orange' | 'red' | string;
  progress?: number;
  budget?: string;
  team?: string;
  risk?: string;
  deadline?: string;
  description?: string;
}

function CockpitClientSupabasePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string>('Client');
  
  const [activeView, setActiveView] = useState<ViewType>('cockpit');
  const [activeTab, setActiveTab] = useState<TabType>('cockpit');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newRiskOpen, setNewRiskOpen] = useState(false);
  const [newDecisionOpen, setNewDecisionOpen] = useState(false);
  const [newMemberOpen, setNewMemberOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'info' | 'warning' | 'error'} | null>(null);
  
  // Données Supabase
  const [projects, setProjects] = useState<Project[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  
  // Formulaires
  const [newProject, setNewProject] = useState({ name: '', description: '', budget: '', deadline: '' });
  const [newRisk, setNewRisk] = useState({ title: '', description: '', level: 'medium', probability: 0.5, impact: 0.5 });
  const [newDecision, setNewDecision] = useState({ title: '', description: '', committee: '', date: '', impacts: '' });
  const [newMember, setNewMember] = useState({ email: '', fullName: '', role: 'member' });

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 4000);
  };

  // Chargement initial
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
        const text = await res.text();
        throw new Error(`Erreur ${res.status}: ${text}`);
      }
      
      const data = await res.json();
      
      setKpis(data.kpis || []);
      setProjects(data.projects || []);
      setRisks(data.risks || []);
      setDecisions(data.decisions || []);
      setTeam(data.team || []);
      setIntegrations(data.integrations || []);
      
      setIsLoading(false);
      showToast(`✅ Cockpit chargé : ${data.projects?.length || 0} projets, ${data.risks?.length || 0} risques`, 'success');
    } catch (e: any) {
      console.error('Erreur chargement cockpit:', e);
      setError(e.message);
      setIsLoading(false);
      showToast(`❌ Erreur: ${e.message}`, 'error');
    }
  }

  // Créer un projet
  async function handleCreateProject() {
    if (!newProject.name.trim() || !organizationId) return;
    
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          name: newProject.name,
          description: newProject.description,
        }),
      });
      
      if (!res.ok) throw new Error('Erreur création projet');
      
      const project = await res.json();
      setProjects(prev => [project, ...prev]);
      setNewProject({ name: '', description: '', budget: '', deadline: '' });
      setNewProjectOpen(false);
      showToast(`✅ Projet "${project.name}" créé avec succès!`, 'success');
    } catch (e: any) {
      showToast(`❌ Erreur: ${e.message}`, 'error');
    }
  }

  // Créer un risque
  async function handleCreateRisk() {
    if (!newRisk.title.trim() || !organizationId) return;
    
    try {
      const res = await fetch('/api/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          ...newRisk,
        }),
      });
      
      if (!res.ok) throw new Error('Erreur création risque');
      
      const risk = await res.json();
      setRisks(prev => [risk, ...prev]);
      setNewRisk({ title: '', description: '', level: 'medium', probability: 0.5, impact: 0.5 });
      setNewRiskOpen(false);
      showToast(`✅ Risque créé avec succès!`, 'success');
    } catch (e: any) {
      showToast(`❌ Erreur: ${e.message}`, 'error');
    }
  }

  // Créer une décision
  async function handleCreateDecision() {
    if (!newDecision.title.trim() || !organizationId) return;
    
    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          ...newDecision,
        }),
      });
      
      if (!res.ok) throw new Error('Erreur création décision');
      
      const decision = await res.json();
      setDecisions(prev => [decision, ...prev]);
      setNewDecision({ title: '', description: '', committee: '', date: '', impacts: '' });
      setNewDecisionOpen(false);
      showToast(`✅ Décision créée avec succès!`, 'success');
    } catch (e: any) {
      showToast(`❌ Erreur: ${e.message}`, 'error');
    }
  }

  // Inviter un membre
  async function handleInviteMember() {
    if (!newMember.email.trim() || !organizationId) return;
    
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          invite: newMember,
        }),
      });
      
      if (!res.ok) throw new Error('Erreur invitation membre');
      
      const member = await res.json();
      setTeam(prev => [...prev, member]);
      setNewMember({ email: '', fullName: '', role: 'member' });
      setNewMemberOpen(false);
      showToast(`✅ Invitation envoyée à ${member.email}!`, 'success');
    } catch (e: any) {
      showToast(`❌ Erreur: ${e.message}`, 'error');
    }
  }

  function handleLogout() {
    sessionStorage.clear();
    router.push('/pro');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Chargement du Cockpit {clientName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-lg">
          <h1 className="text-2xl font-bold text-amber-500 mb-4">Erreur de chargement</h1>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-amber-500 text-slate-950 rounded-lg font-medium hover:bg-amber-400"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const quickActions = [
    { label: 'Documents', icon: <FileText className="w-5 h-5" />, action: () => setDocumentsOpen(true) },
    { label: 'Nouveau Projet', icon: <Rocket className="w-5 h-5" />, action: () => setNewProjectOpen(true) },
    { label: 'Nouveau Risque', icon: <AlertTriangle className="w-5 h-5" />, action: () => setNewRiskOpen(true) },
    { label: 'Nouvelle Décision', icon: <CheckCircle className="w-5 h-5" />, action: () => setNewDecisionOpen(true) },
    { label: 'Inviter Membre', icon: <UserPlus className="w-5 h-5" />, action: () => setNewMemberOpen(true) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[100] max-w-md p-4 rounded-xl shadow-2xl border animate-slide-in-right ${
          toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-700/50 text-emerald-100' :
          toast.type === 'error' ? 'bg-red-900/90 border-red-700/50 text-red-100' :
          toast.type === 'warning' ? 'bg-amber-900/90 border-amber-700/50 text-amber-100' :
          'bg-slate-800/90 border-slate-700/50 text-slate-100'
        }`}>
          <div className="flex items-start gap-3">
            <div className="flex-1 whitespace-pre-wrap text-sm">{toast.message}</div>
            <button onClick={() => setToast(null)} className="text-white/60 hover:text-white" aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

        {/* Header */}
        <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-amber-500">Powalyze Cockpit</h1>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-medium text-amber-400">
                  {clientName} · Supabase Live
                </span>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.action}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg transition text-sm text-slate-300"
                  >
                    {action.icon}
                    <span className="hidden xl:inline">{action.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition text-sm text-red-400"
                >
                  Déconnexion
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              {[
                { id: 'cockpit', label: 'Cockpit', icon: <Target className="w-4 h-4" /> },
                { id: 'portfolio', label: 'Portfolio', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'risks', label: 'Risques', icon: <AlertTriangle className="w-4 h-4" /> },
                { id: 'decisions', label: 'Décisions', icon: <CheckCircle className="w-4 h-4" /> },
                { id: 'team', label: 'Équipe', icon: <Users className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-8 py-8">
          {/* Tab: Cockpit */}
          {activeTab === 'cockpit' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* KPIs */}
              <div className="lg:col-span-3">
                <h2 className="text-xl font-bold text-slate-200 mb-4">KPIs Exécutifs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpis.length > 0 ? kpis.map((kpi) => (
                    <div key={kpi.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">{kpi.name}</span>
                        <Target className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="text-3xl font-bold text-slate-100">{kpi.value}</div>
                      <div className="text-sm text-slate-500 mt-1">{kpi.unit}</div>
                    </div>
                  )) : (
                    <div className="col-span-4 text-center py-8 text-slate-500">
                      Aucun KPI configuré
                    </div>
                  )}
                </div>
              </div>

              {/* Projets récents */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-200 mb-4">Projets ({projects.length})</h3>
                  <div className="space-y-3">
                    {projects.length > 0 ? projects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-slate-200">{project.name}</div>
                          {project.description && <div className="text-sm text-slate-500">{project.description}</div>}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                          project.status === 'orange' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-slate-500">
                        Aucun projet pour l'instant
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Risques */}
              <div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-200 mb-4">Risques ({risks.length})</h3>
                  <div className="space-y-3">
                    {risks.length > 0 ? risks.slice(0, 5).map((risk) => (
                      <div key={risk.id} className="p-3 bg-slate-900/50 rounded-lg">
                        <div className="font-medium text-slate-200 text-sm">{risk.title}</div>
                        <div className="text-xs text-slate-500 mt-1">{risk.level}</div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-slate-500 text-sm">
                        Aucun risque identifié
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Portfolio */}
          {activeTab === 'portfolio' && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-slate-200 mb-6">Portfolio Projets</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-200">{project.name}</h3>
                        {project.description && <p className="text-slate-400 text-sm mt-2">{project.description}</p>}
                        <div className="flex gap-4 mt-4 text-sm">
                          {project.budget && <span className="text-slate-500">Budget: {project.budget}</span>}
                          {project.deadline && <span className="text-slate-500">Deadline: {project.deadline}</span>}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                        project.status === 'orange' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    Aucun projet. Cliquez sur &quot;Nouveau Projet&quot; pour commencer.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Risques */}
          {activeTab === 'risks' && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-slate-200 mb-6">Gestion des Risques</h2>
              <div className="space-y-4">
                {risks.map((risk) => (
                  <div key={risk.id} className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-200">{risk.title}</h3>
                        <p className="text-slate-400 text-sm mt-2">{risk.description}</p>
                        <div className="flex gap-4 mt-4 text-sm">
                          <span className="text-slate-500">Probabilité: {(risk.probability * 100).toFixed(0)}%</span>
                          <span className="text-slate-500">Impact: {(risk.impact * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        risk.level === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                        risk.level === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {risk.level}
                      </span>
                    </div>
                  </div>
                ))}
                {risks.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    Aucun risque identifié. Cliquez sur &quot;Nouveau Risque&quot; pour en ajouter.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Décisions */}
          {activeTab === 'decisions' && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-slate-200 mb-6">Journal des Décisions</h2>
              <div className="space-y-4">
                {decisions.map((decision) => (
                  <div key={decision.id} className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-200">{decision.title}</h3>
                    <p className="text-slate-400 text-sm mt-2">{decision.description}</p>
                    <div className="flex gap-4 mt-4 text-sm text-slate-500">
                      <span>Comité: {decision.committee}</span>
                      <span>Date: {decision.date}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        decision.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                        decision.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-700/50 text-slate-400'
                      }`}>
                        {decision.status}
                      </span>
                    </div>
                  </div>
                ))}
                {decisions.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    Aucune décision enregistrée. Cliquez sur &quot;Nouvelle Décision&quot; pour commencer.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Équipe */}
          {activeTab === 'team' && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-slate-200 mb-6">Gestion de l'Équipe</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.map((member) => (
                  <div key={member.id} className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                        {member.email?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-200">{member.fullName || member.email}</div>
                        <div className="text-xs text-slate-500">{member.email}</div>
                      </div>
                    </div>
                    <span className="inline-block px-2 py-1 bg-slate-800/50 rounded text-xs text-slate-400">
                      {member.role}
                    </span>
                  </div>
                ))}
                {team.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-slate-500">
                    Aucun membre. Cliquez sur &quot;Inviter Membre&quot; pour commencer.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Modal: Nouveau Projet */}
        {newProjectOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-lg w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Nouveau Projet</h2>
                <button onClick={() => setNewProjectOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nom du projet</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                    placeholder="Ex: Migration Cloud AWS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 h-24"
                    placeholder="Description du projet..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCreateProject}
                    className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium rounded-lg transition"
                  >
                    Créer le projet
                  </button>
                  <button
                    onClick={() => setNewProjectOpen(false)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Nouveau Risque */}
        {newRiskOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-lg w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Nouveau Risque</h2>
                <button onClick={() => setNewRiskOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Titre</label>
                  <input
                    type="text"
                    value={newRisk.title}
                    onChange={(e) => setNewRisk(r => ({ ...r, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={newRisk.description}
                    onChange={(e) => setNewRisk(r => ({ ...r, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Niveau</label>
                  <select
                    value={newRisk.level}
                    onChange={(e) => setNewRisk(r => ({ ...r, level: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyen</option>
                    <option value="high">Élevé</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCreateRisk}
                    className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium rounded-lg transition"
                  >
                    Créer le risque
                  </button>
                  <button
                    onClick={() => setNewRiskOpen(false)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Nouvelle Décision */}
        {newDecisionOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-lg w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Nouvelle Décision</h2>
                <button onClick={() => setNewDecisionOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Titre</label>
                  <input
                    type="text"
                    value={newDecision.title}
                    onChange={(e) => setNewDecision(d => ({ ...d, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={newDecision.description}
                    onChange={(e) => setNewDecision(d => ({ ...d, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Comité</label>
                  <input
                    type="text"
                    value={newDecision.committee}
                    onChange={(e) => setNewDecision(d => ({ ...d, committee: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={newDecision.date}
                    onChange={(e) => setNewDecision(d => ({ ...d, date: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCreateDecision}
                    className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium rounded-lg transition"
                  >
                    Créer la décision
                  </button>
                  <button
                    onClick={() => setNewDecisionOpen(false)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Inviter Membre */}
        {newMemberOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-lg w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Inviter un Membre</h2>
                <button onClick={() => setNewMemberOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember(m => ({ ...m, email: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={newMember.fullName}
                    onChange={(e) => setNewMember(m => ({ ...m, fullName: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Rôle</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember(m => ({ ...m, role: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="member">Membre</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleInviteMember}
                    className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium rounded-lg transition"
                  >
                    Envoyer l'invitation
                  </button>
                  <button
                    onClick={() => setNewMemberOpen(false)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default CockpitClientSupabasePage;
