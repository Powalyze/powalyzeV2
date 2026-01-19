"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { 
  ArrowLeft, Edit2, Save, Plus, X, Calendar, DollarSign, Users, 
  Target, AlertTriangle, Sparkles, CheckCircle, FileText, MessageSquare,
  Trello, ChevronRight, Clock, TrendingUp
} from 'lucide-react';

interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface Decision {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

interface Anomaly {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  status: 'open' | 'in-progress' | 'resolved';
}

interface KanbanCard {
  id: string;
  title: string;
  description: string;
  assignee: string;
  column: 'todo' | 'in-progress' | 'done';
}

interface Note {
  id: string;
  content: string;
  author: string;
  date: string;
}

export default function ProjetDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'kanban' | 'decisions' | 'anomalies' | 'notes'>('overview');
  const [editing, setEditing] = useState(false);
  
  // Project data
  const [projectName] = useState('ERP Cloud Migration');
  const [description] = useState('Migration complète de notre ERP legacy vers une solution Cloud native avec intégration Azure.');
  const [status] = useState<'green' | 'orange' | 'red'>('green');
  const [progress] = useState(78);
  const [budget] = useState('2.1M€');
  const [team] = useState('Team Alpha');
  const [sponsor] = useState('Marie Dupont');
  const [startDate] = useState('2024-01-15');
  const [endDate] = useState('2024-06-30');

  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', name: 'Cadrage et analyse', date: '2024-02-01', status: 'completed' },
    { id: '2', name: 'POC technique', date: '2024-03-15', status: 'completed' },
    { id: '3', name: 'Développement', date: '2024-05-01', status: 'in-progress' },
    { id: '4', name: 'Recette UAT', date: '2024-06-01', status: 'pending' },
    { id: '5', name: 'Mise en production', date: '2024-06-30', status: 'pending' }
  ]);

  // Kanban cards
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>([
    { id: '1', title: 'Setup environnement Azure', description: 'Configurer les ressources Azure nécessaires', assignee: 'Thomas', column: 'done' },
    { id: '2', title: 'Migration base de données', description: 'Migrer les données legacy vers Azure SQL', assignee: 'Sophie', column: 'in-progress' },
    { id: '3', title: 'Tests de charge', description: 'Valider les performances', assignee: 'Jean', column: 'todo' },
    { id: '4', title: 'Documentation utilisateur', description: 'Rédiger la documentation complète', assignee: 'Marie', column: 'todo' }
  ]);

  // Decisions
  const [decisions, setDecisions] = useState<Decision[]>([
    { id: '1', title: 'Choix Azure comme provider Cloud', description: 'Après analyse comparative, Azure sélectionné pour sa compatibilité avec notre stack Microsoft existante.', date: '2024-01-20', author: 'Marie Dupont' },
    { id: '2', title: 'Approche migration progressive', description: 'Migration en 3 phases pour limiter les risques et maintenir la continuité de service.', date: '2024-02-05', author: 'Jean Martin' }
  ]);

  // Anomalies
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    { id: '1', title: 'Latence base de données', description: 'Temps de réponse supérieur à 500ms sur certaines requêtes complexes', severity: 'medium', date: '2024-03-12', status: 'in-progress' },
    { id: '2', title: 'Bug interface utilisateur', description: 'Erreur d\'affichage sur le module de reporting', severity: 'low', date: '2024-03-18', status: 'resolved' }
  ]);

  // Notes
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', content: 'Réunion kickoff réussie. Toutes les équipes alignées sur les objectifs.', author: 'Marie Dupont', date: '2024-01-16' },
    { id: '2', content: 'POC validé par le sponsor. Green light pour la phase de développement.', author: 'Thomas Petit', date: '2024-03-20' }
  ]);

  // New item forms
  const [newDecisionTitle, setNewDecisionTitle] = useState('');
  const [newDecisionDesc, setNewDecisionDesc] = useState('');
  const [newAnomalyTitle, setNewAnomalyTitle] = useState('');
  const [newAnomalyDesc, setNewAnomalyDesc] = useState('');
  const [newAnomalySeverity, setNewAnomalySeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [newNote, setNewNote] = useState('');
  const [newKanbanTitle, setNewKanbanTitle] = useState('');
  const [newKanbanDesc, setNewKanbanDesc] = useState('');
  const [newKanbanAssignee, setNewKanbanAssignee] = useState('');

  const addDecision = () => {
    if (newDecisionTitle && newDecisionDesc) {
      setDecisions([...decisions, {
        id: Date.now().toString(),
        title: newDecisionTitle,
        description: newDecisionDesc,
        date: new Date().toISOString().split('T')[0],
        author: 'Utilisateur courant'
      }]);
      setNewDecisionTitle('');
      setNewDecisionDesc('');
    }
  };

  const addAnomaly = () => {
    if (newAnomalyTitle && newAnomalyDesc) {
      setAnomalies([...anomalies, {
        id: Date.now().toString(),
        title: newAnomalyTitle,
        description: newAnomalyDesc,
        severity: newAnomalySeverity,
        date: new Date().toISOString().split('T')[0],
        status: 'open'
      }]);
      setNewAnomalyTitle('');
      setNewAnomalyDesc('');
    }
  };

  const addNote = () => {
    if (newNote) {
      setNotes([...notes, {
        id: Date.now().toString(),
        content: newNote,
        author: 'Utilisateur courant',
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewNote('');
    }
  };

  const addKanbanCard = (column: 'todo' | 'in-progress' | 'done') => {
    if (newKanbanTitle) {
      setKanbanCards([...kanbanCards, {
        id: Date.now().toString(),
        title: newKanbanTitle,
        description: newKanbanDesc,
        assignee: newKanbanAssignee,
        column
      }]);
      setNewKanbanTitle('');
      setNewKanbanDesc('');
      setNewKanbanAssignee('');
    }
  };

  const moveCard = (cardId: string, newColumn: 'todo' | 'in-progress' | 'done') => {
    setKanbanCards(kanbanCards.map(card => 
      card.id === cardId ? { ...card, column: newColumn } : card
    ));
  };

  const deleteCard = (cardId: string) => {
    setKanbanCards(kanbanCards.filter(card => card.id !== cardId));
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/cockpit/projets">
            <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 transition-all">
              <ArrowLeft className="w-5 h-5" />
              <span>Retour à la liste</span>
            </button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${
                status === 'green' ? 'bg-green-500' :
                status === 'orange' ? 'bg-orange-500' :
                'bg-red-500'
              } animate-pulse`}></div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{projectName}</h1>
                <p className="text-slate-400">{description}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Edit2 className="w-5 h-5" />
              {editing ? 'Mode lecture' : 'Modifier'}
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Progression</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-700 rounded-full h-2">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="text-lg font-bold text-white">{progress}%</span>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Budget</p>
            <p className="text-lg font-bold text-white">{budget}</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Équipe</p>
            <p className="text-lg font-bold text-white">{team}</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Sponsor</p>
            <p className="text-lg font-bold text-white">{sponsor}</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Début</p>
            <p className="text-sm font-bold text-white">{new Date(startDate).toLocaleDateString('fr-FR')}</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Fin prévue</p>
            <p className="text-sm font-bold text-white">{new Date(endDate).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Target className="w-5 h-5" />
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'kanban'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Trello className="w-5 h-5" />
            Kanban
          </button>
          <button
            onClick={() => setActiveTab('decisions')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'decisions'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Décisions ({decisions.length})
          </button>
          <button
            onClick={() => setActiveTab('anomalies')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'anomalies'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            Anomalies ({anomalies.filter(a => a.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            Notes ({notes.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Milestones */}
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Jalons du projet
              </h2>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      milestone.status === 'completed' ? 'bg-green-500' :
                      milestone.status === 'in-progress' ? 'bg-orange-500 animate-pulse' :
                      'bg-slate-700'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white font-bold">{index + 1}</span>
                      )}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className={`w-full h-1 ${
                        milestone.status === 'completed' ? 'bg-green-500' : 'bg-slate-700'
                      }`}></div>
                    )}
                    <div className="min-w-[200px]">
                      <p className="text-white font-semibold">{milestone.name}</p>
                      <p className="text-xs text-slate-400">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(milestone.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-800/50 border border-blue-500/30 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Décisions récentes</h3>
                <p className="text-4xl font-bold text-blue-400 mb-2">{decisions.length}</p>
                <button
                  onClick={() => setActiveTab('decisions')}
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Voir toutes
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="bg-slate-800/50 border border-orange-500/30 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Anomalies ouvertes</h3>
                <p className="text-4xl font-bold text-orange-400 mb-2">
                  {anomalies.filter(a => a.status !== 'resolved').length}
                </p>
                <button
                  onClick={() => setActiveTab('anomalies')}
                  className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  Voir toutes
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="bg-slate-800/50 border border-purple-500/30 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Tâches Kanban</h3>
                <p className="text-4xl font-bold text-purple-400 mb-2">{kanbanCards.length}</p>
                <button
                  onClick={() => setActiveTab('kanban')}
                  className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  Ouvrir Kanban
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'kanban' && (
          <div className="grid grid-cols-3 gap-6">
            {/* TODO Column */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                À faire ({kanbanCards.filter(c => c.column === 'todo').length})
              </h3>
              <div className="space-y-3 mb-4">
                {kanbanCards.filter(c => c.column === 'todo').map((card) => (
                  <div key={card.id} className="bg-slate-900 border border-slate-600 p-4 rounded-lg group">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold text-sm">{card.title}</h4>
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {card.description && (
                      <p className="text-xs text-slate-400 mb-3">{card.description}</p>
                    )}
                    {card.assignee && (
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-400">{card.assignee}</span>
                      </div>
                    )}
                    <button
                      onClick={() => moveCard(card.id, 'in-progress')}
                      className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs rounded transition-all"
                    >
                      Démarrer →
                    </button>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newKanbanTitle}
                  onChange={(e) => setNewKanbanTitle(e.target.value)}
                  placeholder="Titre de la tâche"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  value={newKanbanDesc}
                  onChange={(e) => setNewKanbanDesc(e.target.value)}
                  placeholder="Description (optionnel)"
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                />
                <input
                  type="text"
                  value={newKanbanAssignee}
                  onChange={(e) => setNewKanbanAssignee(e.target.value)}
                  placeholder="Assigné à"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => addKanbanCard('todo')}
                  disabled={!newKanbanTitle}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
            </div>

            {/* IN PROGRESS Column */}
            <div className="bg-slate-800/50 border border-orange-500/50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                En cours ({kanbanCards.filter(c => c.column === 'in-progress').length})
              </h3>
              <div className="space-y-3">
                {kanbanCards.filter(c => c.column === 'in-progress').map((card) => (
                  <div key={card.id} className="bg-slate-900 border border-orange-500/30 p-4 rounded-lg group">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold text-sm">{card.title}</h4>
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {card.description && (
                      <p className="text-xs text-slate-400 mb-3">{card.description}</p>
                    )}
                    {card.assignee && (
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-400">{card.assignee}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveCard(card.id, 'todo')}
                        className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-all"
                      >
                        ← Retour
                      </button>
                      <button
                        onClick={() => moveCard(card.id, 'done')}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition-all"
                      >
                        Terminer →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DONE Column */}
            <div className="bg-slate-800/50 border border-green-500/50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Terminé ({kanbanCards.filter(c => c.column === 'done').length})
              </h3>
              <div className="space-y-3">
                {kanbanCards.filter(c => c.column === 'done').map((card) => (
                  <div key={card.id} className="bg-slate-900 border border-green-500/30 p-4 rounded-lg group opacity-75">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold text-sm line-through">{card.title}</h4>
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {card.description && (
                      <p className="text-xs text-slate-400 mb-3">{card.description}</p>
                    )}
                    {card.assignee && (
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-400">{card.assignee}</span>
                      </div>
                    )}
                    <button
                      onClick={() => moveCard(card.id, 'in-progress')}
                      className="w-full px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-all"
                    >
                      ← Réouvrir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="space-y-6">
            {/* Add Decision Form */}
            <div className="bg-slate-800/50 border border-blue-500/30 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-400" />
                Nouvelle décision
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newDecisionTitle}
                  onChange={(e) => setNewDecisionTitle(e.target.value)}
                  placeholder="Titre de la décision"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  value={newDecisionDesc}
                  onChange={(e) => setNewDecisionDesc(e.target.value)}
                  placeholder="Description détaillée, contexte, rationale..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                />
                <button
                  onClick={addDecision}
                  disabled={!newDecisionTitle || !newDecisionDesc}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  Enregistrer la décision
                </button>
              </div>
            </div>

            {/* Decisions List */}
            <div className="space-y-4">
              {decisions.map((decision) => (
                <div key={decision.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:border-blue-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white">{decision.title}</h3>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      {new Date(decision.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-4">{decision.description}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>{decision.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'anomalies' && (
          <div className="space-y-6">
            {/* Add Anomaly Form */}
            <div className="bg-slate-800/50 border border-orange-500/30 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-6 h-6 text-orange-400" />
                Signaler une anomalie
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newAnomalyTitle}
                  onChange={(e) => setNewAnomalyTitle(e.target.value)}
                  placeholder="Titre de l'anomalie"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  value={newAnomalyDesc}
                  onChange={(e) => setNewAnomalyDesc(e.target.value)}
                  placeholder="Description détaillée, impact, contexte..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                />
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Sévérité</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setNewAnomalySeverity('low')}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                        newAnomalySeverity === 'low'
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-slate-600 bg-slate-900 text-slate-400'
                      }`}
                    >
                      Faible
                    </button>
                    <button
                      onClick={() => setNewAnomalySeverity('medium')}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                        newAnomalySeverity === 'medium'
                          ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                          : 'border-slate-600 bg-slate-900 text-slate-400'
                      }`}
                    >
                      Moyenne
                    </button>
                    <button
                      onClick={() => setNewAnomalySeverity('high')}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                        newAnomalySeverity === 'high'
                          ? 'border-red-500 bg-red-500/20 text-red-400'
                          : 'border-slate-600 bg-slate-900 text-slate-400'
                      }`}
                    >
                      Haute
                    </button>
                  </div>
                </div>
                <button
                  onClick={addAnomaly}
                  disabled={!newAnomalyTitle || !newAnomalyDesc}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  Enregistrer l'anomalie
                </button>
              </div>
            </div>

            {/* Anomalies List */}
            <div className="space-y-4">
              {anomalies.map((anomaly) => (
                <div key={anomaly.id} className={`bg-slate-800/50 border p-6 rounded-xl hover:border-opacity-100 transition-all ${
                  anomaly.severity === 'high' ? 'border-red-500/50' :
                  anomaly.severity === 'medium' ? 'border-orange-500/50' :
                  'border-green-500/50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        anomaly.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        anomaly.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {anomaly.severity === 'high' ? 'Haute' : anomaly.severity === 'medium' ? 'Moyenne' : 'Faible'}
                      </span>
                      <h3 className="text-xl font-semibold text-white">{anomaly.title}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      anomaly.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                      anomaly.status === 'in-progress' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {anomaly.status === 'resolved' ? 'Résolue' : anomaly.status === 'in-progress' ? 'En cours' : 'Ouverte'}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-4">{anomaly.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>
                      <Clock className="w-4 h-4 inline mr-1" />
                      {new Date(anomaly.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            {/* Add Note Form */}
            <div className="bg-slate-800/50 border border-purple-500/30 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-6 h-6 text-purple-400" />
                Ajouter une note
              </h2>
              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Écrivez votre note ici..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                />
                <button
                  onClick={addNote}
                  disabled={!newNote}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  Enregistrer la note
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:border-purple-500/50 transition-all">
                  <p className="text-slate-200 mb-4">{note.content}</p>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{note.author}</span>
                    </div>
                    <span>
                      <Clock className="w-4 h-4 inline mr-1" />
                      {new Date(note.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
