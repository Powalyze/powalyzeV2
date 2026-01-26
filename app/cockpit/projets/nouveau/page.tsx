"use client";

import React, { useState, useCallback, useMemo, memo, startTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useMode } from '@/lib/ModeContext';
import { useTranslation } from '@/lib/i18n';
import { 
  ArrowLeft, Save, Plus, X, Calendar, DollarSign, Users, 
  Target, AlertTriangle, Sparkles, CheckCircle
} from 'lucide-react';

interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
}

// Optimized MilestoneItem component with memo
const MilestoneItem = memo(({ milestone, onRemove }: { milestone: Milestone; onRemove: (id: string) => void }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-600 rounded-lg group">
      <CheckCircle className="w-5 h-5 text-slate-500" />
      <div className="flex-1">
        <p className="text-white font-medium">{milestone.name}</p>
        <p className="text-sm text-slate-400">{milestone.date}</p>
      </div>
      <button
        onClick={() => onRemove(milestone.id)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
        aria-label="Supprimer le jalon"
      >
        <X className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );
});
MilestoneItem.displayName = 'MilestoneItem';

export default function NouveauProjetPage() {
  const router = useRouter();
  const { mode, isProMode, isDemoMode } = useMode();
  const { t } = useTranslation();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [team, setTeam] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [saving, setSaving] = useState(false);

  // Memoized callbacks to prevent re-renders
  const addMilestone = useCallback(() => {
    if (newMilestoneName && newMilestoneDate) {
      setMilestones(prev => [...prev, {
        id: Date.now().toString(),
        name: newMilestoneName,
        date: newMilestoneDate,
        status: 'pending'
      }]);
      setNewMilestoneName('');
      setNewMilestoneDate('');
    }
  }, [newMilestoneName, newMilestoneDate]);

  const removeMilestone = useCallback((id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  }, []);

  const handleSave = useCallback(async () => {
    if (!projectName || saving) return;
    
    setSaving(true);
    
    try {
      // Utiliser le mode centralisé
      if (isProMode) {
        // MODE PRO: Sauvegarder dans Supabase via API
        const projectData = {
          name: projectName,
          description: description || null,
          sponsor: sponsor || null,
          team_name: team || null,
          budget_amount: budget ? parseFloat(budget.replace(/[^0-9.]/g, '')) * 1000 : null,
          start_date: startDate || null,
          end_date: endDate || null,
          priority_level: priority,
          status: 'active',
          rag_status: 'GREEN',
          progress: 0,
          milestones: milestones.map(m => ({
            name: m.name,
            target_date: m.date,
            status: m.status
          }))
        };
        
        // Créer le projet en base
        const createResponse = await fetch('/api/cockpit/projects', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify(projectData)
        });
        
        if (!createResponse.ok) {
          throw new Error('Échec création projet en base');
        }
        
        const createdProject = await createResponse.json();
        
        // Lancer l'IA prédictive en arrière-plan
        try {
          const predictionResponse = await fetch('/api/ai/project-prediction', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({
              project_id: createdProject.id,
              name: projectName,
              owner_role: sponsor || 'Unknown',
              budget: projectData.budget_amount,
              deadline: endDate || null,
              status: 'active',
              complexity: priority,
              team_size: team ? 1 : null,
              dependencies: [],
              context: description || '',
              objectives: milestones.map(m => m.name)
            })
          });
          
          if (predictionResponse.ok) {
            const prediction = await predictionResponse.json();
            console.log('🤖 Analyse IA générée:', prediction);
            alert('✅ Projet créé avec succès!\n🤖 Analyse IA prédictive générée');
          } else {
            console.warn('⚠️ IA Prédictive non disponible');
            alert('✅ Projet créé avec succès!');
          }
        } catch (aiError) {
          console.warn('⚠️ Erreur IA:', aiError);
          alert('✅ Projet créé avec succès!');
        }
        
      } else {
        // MODE DEMO: Sauvegarder dans localStorage uniquement
        const newProject = {
          id: Date.now().toString(),
          name: projectName,
          description,
          budget,
          team,
          sponsor,
          startDate,
          endDate,
          priority,
          milestones,
          status: 'green',
          progress: 0,
          risk: 'Faible',
          deadline: endDate || 'Non défini',
          createdAt: new Date().toISOString()
        };
        
        const existingProjects = JSON.parse(localStorage.getItem('demo_projects') || '[]');
        existingProjects.push(newProject);
        localStorage.setItem('demo_projects', JSON.stringify(existingProjects));
        
        alert('✅ Projet créé (Mode Démo)');
      }
      
      setSaving(false);
      router.push('/cockpit/projets');
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la création du projet');
      setSaving(false);
    }
  }, [projectName, description, budget, team, sponsor, startDate, endDate, priority, milestones, saving, router]);

  // Memoized computed value
  const canSave = useMemo(() => projectName.trim().length > 0 && !saving, [projectName, saving]);

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
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Créer un nouveau projet</h1>
              <p className="text-slate-400">Renseignez les informations du projet de A à Z</p>
            </div>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform will-change-transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Enregistrer le projet
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          
          {/* Colonne 1: Informations générales */}
          <div className="col-span-2 space-y-6">
            
            {/* Informations de base */}
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-yellow-500" />
                Informations générales
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Nom du projet *
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Ex: Migration ERP vers le Cloud"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez les objectifs et le périmètre du projet..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Sponsor
                    </label>
                    <input
                      type="text"
                      value={sponsor}
                      onChange={(e) => setSponsor(e.target.value)}
                      placeholder="Nom du sponsor"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Équipe
                    </label>
                    <select
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Sélectionner une équipe</option>
                      <option value="Team Alpha">Team Alpha</option>
                      <option value="Team Beta">Team Beta</option>
                      <option value="Team Gamma">Team Gamma</option>
                      <option value="Team Delta">Team Delta</option>
                      <option value="Team Epsilon">Team Epsilon</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Budget
                    </label>
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="Ex: 2.5M€"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    Priorité
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPriority('low')}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        priority === 'low'
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-slate-600 bg-slate-900 text-slate-400 hover:border-green-500/50'
                      }`}
                    >
                      Basse
                    </button>
                    <button
                      onClick={() => setPriority('medium')}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        priority === 'medium'
                          ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                          : 'border-slate-600 bg-slate-900 text-slate-400 hover:border-orange-500/50'
                      }`}
                    >
                      Moyenne
                    </button>
                    <button
                      onClick={() => setPriority('high')}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        priority === 'high'
                          ? 'border-red-500 bg-red-500/20 text-red-400'
                          : 'border-slate-600 bg-slate-900 text-slate-400 hover:border-red-500/50'
                      }`}
                    >
                      Haute
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Jalons */}
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
                Jalons du projet
              </h2>

              <div className="space-y-4 mb-6">
                {milestones.map((milestone) => (
                  <MilestoneItem key={milestone.id} milestone={milestone} onRemove={removeMilestone} />
                ))}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newMilestoneName}
                    onChange={(e) => setNewMilestoneName(e.target.value)}
                    placeholder="Nom du jalon"
                    aria-label="Nom du jalon"
                    className="col-span-2 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="date"
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    aria-label="Date du jalon"
                    className="px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={addMilestone}
                  disabled={!newMilestoneName || !newMilestoneDate}
                  aria-label="Ajouter un jalon"
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter un jalon
                </button>
              </div>
            </div>

          </div>

          {/* Colonne 2: Assistance IA */}
          <div className="space-y-6">
            
            {/* Assistant IA */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                Assistant IA
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                L'IA Powalyze analyse votre projet et vous suggère des jalons standards basés sur les meilleures pratiques PMO.
              </p>
              <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Générer jalons IA
              </button>
            </div>

            {/* Tips */}
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">💡 Conseils</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Définissez 3 à 7 jalons clés maximum</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Incluez toujours un jalon de cadrage initial</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Prévoyez un jalon de recette avant la mise en prod</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Espacez vos jalons de 4 à 8 semaines</span>
                </li>
              </ul>
            </div>

            {/* Modèles */}
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">📋 Modèles</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-slate-900 hover:bg-slate-700 border border-slate-600 rounded-lg text-white text-sm transition-all">
                  Migration Cloud
                </button>
                <button className="w-full text-left px-4 py-3 bg-slate-900 hover:bg-slate-700 border border-slate-600 rounded-lg text-white text-sm transition-all">
                  Déploiement Agile
                </button>
                <button className="w-full text-left px-4 py-3 bg-slate-900 hover:bg-slate-700 border border-slate-600 rounded-lg text-white text-sm transition-all">
                  Transformation digitale
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </AppShell>
  );
}

