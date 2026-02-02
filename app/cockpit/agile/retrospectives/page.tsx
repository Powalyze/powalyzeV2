'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Plus, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

/**
 * Page Rétrospectives
 * 3 colonnes : went_well / to_improve / action_items
 */
export default function RetrospectivesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <RetrospectivesContent />
    </Suspense>
  );
}

interface Sprint {
  id: string;
  name: string;
  status: string;
}

interface Retrospective {
  id: string;
  sprint_id: string;
  category: 'went_well' | 'to_improve' | 'action_items';
  content: string;
  author_id: string;
  created_at: string;
}

function RetrospectivesContent() {
  const [loading, setLoading] = useState(true);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string>('');
  const [retrospectives, setRetrospectives] = useState<Retrospective[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState<'went_well' | 'to_improve' | 'action_items'>('went_well');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSprintId) {
      loadRetrospectives(selectedSprintId);
    }
  }, [selectedSprintId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Non connecté');

      // Récupérer le profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, plan, pro_active')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setIsDemo(profile.plan === 'demo' || !profile.pro_active);

      // Récupérer les sprints (active et completed)
      const { data: sprintsData, error: sprintsError } = await supabase
        .from('sprints')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .in('status', ['active', 'completed'])
        .order('created_at', { ascending: false });

      if (sprintsError) throw sprintsError;

      setSprints(sprintsData || []);

      // Sélectionner automatiquement le premier sprint
      if (sprintsData && sprintsData.length > 0) {
        setSelectedSprintId(sprintsData[0].id);
      }
    } catch (err: any) {
      console.error('Erreur chargement:', err);
      alert(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadRetrospectives = async (sprintId: string) => {
    try {
      const { data, error } = await supabase
        .from('retrospectives')
        .select('*')
        .eq('sprint_id', sprintId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setRetrospectives(data || []);
    } catch (err: any) {
      console.error('Erreur chargement rétrospectives:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Non connecté');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const { error } = await supabase.from('retrospectives').insert({
        organization_id: profile.organization_id,
        sprint_id: selectedSprintId,
        category: newCategory,
        content: newContent,
        author_id: user.id,
      });

      if (error) throw error;

      // Recharger
      loadRetrospectives(selectedSprintId);
      setShowModal(false);
      setNewContent('');
    } catch (err: any) {
      alert(err.message || 'Erreur ajout');
    }
  };

  const retrosByCategory = (category: 'went_well' | 'to_improve' | 'action_items') =>
    retrospectives.filter(r => r.category === category);

  if (loading) return <LoadingState />;

  if (sprints.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Aucun sprint disponible</h2>
            <p className="text-slate-400">
              {isDemo
                ? 'Les sprints seront générés automatiquement en mode Demo.'
                : 'Créez des sprints pour organiser des rétrospectives.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#D4AF37]" />
            Rétrospectives
          </h1>

          {/* Selector Sprint */}
          <div className="flex items-center gap-4">
            <label className="text-sm text-slate-400">Sprint:</label>
            <select
              value={selectedSprintId}
              onChange={e => setSelectedSprintId(e.target.value)}
              className="px-4 py-2 bg-[#1C1F26] border border-slate-700 rounded-lg text-white"
            >
              {sprints.map(sprint => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </option>
              ))}
            </select>

            {!isDemo && (
              <button
                onClick={() => setShowModal(true)}
                className="ml-auto px-4 py-2 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un feedback
              </button>
            )}
          </div>
        </div>

        {/* 3 colonnes */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Colonne Went Well */}
          <div className="bg-[#1C1F26] rounded-2xl p-4 border border-green-500/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Ce qui a bien fonctionné ({retrosByCategory('went_well').length})
            </h3>
            <div className="space-y-3">
              {retrosByCategory('went_well').map(retro => (
                <div key={retro.id} className="bg-[#0A0F1C] rounded-lg p-3 border border-green-500/30">
                  <p className="text-sm text-slate-300">{retro.content}</p>
                  <div className="text-xs text-slate-500 mt-2">
                    {new Date(retro.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
              {retrosByCategory('went_well').length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">Aucun feedback</p>
              )}
            </div>
          </div>

          {/* Colonne To Improve */}
          <div className="bg-[#1C1F26] rounded-2xl p-4 border border-orange-500/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              À améliorer ({retrosByCategory('to_improve').length})
            </h3>
            <div className="space-y-3">
              {retrosByCategory('to_improve').map(retro => (
                <div key={retro.id} className="bg-[#0A0F1C] rounded-lg p-3 border border-orange-500/30">
                  <p className="text-sm text-slate-300">{retro.content}</p>
                  <div className="text-xs text-slate-500 mt-2">
                    {new Date(retro.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
              {retrosByCategory('to_improve').length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">Aucun feedback</p>
              )}
            </div>
          </div>

          {/* Colonne Action Items */}
          <div className="bg-[#1C1F26] rounded-2xl p-4 border border-blue-500/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-500" />
              Actions à prendre ({retrosByCategory('action_items').length})
            </h3>
            <div className="space-y-3">
              {retrosByCategory('action_items').map(retro => (
                <div key={retro.id} className="bg-[#0A0F1C] rounded-lg p-3 border border-blue-500/30">
                  <p className="text-sm text-slate-300">{retro.content}</p>
                  <div className="text-xs text-slate-500 mt-2">
                    {new Date(retro.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
              {retrosByCategory('action_items').length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">Aucun feedback</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Ajout */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1C1F26] rounded-2xl p-6 max-w-lg w-full border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Ajouter un feedback</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Catégorie</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-4 py-2 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white"
                  >
                    <option value="went_well">Ce qui a bien fonctionné</option>
                    <option value="to_improve">À améliorer</option>
                    <option value="action_items">Actions à prendre</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Contenu</label>
                  <textarea
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white"
                    placeholder="Décrivez votre feedback..."
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
      <div className="text-white animate-pulse">Chargement des rétrospectives...</div>
    </div>
  );
}
