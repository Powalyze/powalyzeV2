'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

/**
 * Page Backlog
 * Liste des user stories avec drag & drop, tri par priorité
 */
export default function BacklogPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BacklogContent />
    </Suspense>
  );
}

interface UserStory {
  id: string;
  title: string;
  description: string;
  story_points: number;
  priority: number;
  status: 'todo' | 'doing' | 'done';
  sprint_id: string | null;
  epic_id: string | null;
  is_demo: boolean;
}

function BacklogContent() {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    story_points: 0,
    priority: 0,
  });

  useEffect(() => {
    loadBacklog();
  }, []);

  const loadBacklog = async () => {
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

      // Récupérer les stories (sans sprint assigné = backlog)
      const { data: storiesData, error: storiesError } = await supabase
        .from('user_stories')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .is('sprint_id', null)
        .order('priority', { ascending: true });

      if (storiesError) throw storiesError;

      setStories(storiesData || []);
    } catch (err: any) {
      console.error('Erreur chargement:', err);
      alert(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, project_id')
        .eq('id', user.id)
        .single();

      if (editingStory) {
        // Update
        const { error } = await supabase
          .from('user_stories')
          .update({
            title: formData.title,
            description: formData.description,
            story_points: formData.story_points,
            priority: formData.priority,
          })
          .eq('id', editingStory.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('user_stories')
          .insert({
            organization_id: profile?.organization_id,
            title: formData.title,
            description: formData.description,
            story_points: formData.story_points,
            priority: formData.priority,
            status: 'todo',
            is_demo: isDemo,
          });

        if (error) throw error;
      }

      setShowModal(false);
      setEditingStory(null);
      setFormData({ title: '', description: '', story_points: 0, priority: 0 });
      loadBacklog();
    } catch (err: any) {
      console.error('Erreur:', err);
      alert(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette story ?')) return;

    try {
      const { error } = await supabase.from('user_stories').delete().eq('id', id);
      if (error) throw error;
      loadBacklog();
    } catch (err: any) {
      alert(err.message || 'Erreur suppression');
    }
  };

  const openModal = (story?: UserStory) => {
    if (story) {
      setEditingStory(story);
      setFormData({
        title: story.title,
        description: story.description || '',
        story_points: story.story_points,
        priority: story.priority,
      });
    } else {
      setEditingStory(null);
      setFormData({ title: '', description: '', story_points: 0, priority: 0 });
    }
    setShowModal(true);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Backlog</h1>
            <p className="text-slate-400 mt-1">
              {stories.length} user stories • {isDemo && 'Mode Demo'}
            </p>
          </div>
          <button
            onClick={() => openModal()}
            disabled={isDemo && stories.length >= 10}
            className="flex items-center gap-2 px-4 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Story
          </button>
        </div>

        {isDemo && stories.length >= 10 && (
          <div className="mb-6 bg-blue-500/10 border border-blue-500/50 rounded-lg p-3 text-sm text-blue-400">
            📌 Mode Demo — Maximum 10 stories. Passez en Pro pour un backlog illimité.
          </div>
        )}

        {/* Liste des stories */}
        <div className="space-y-3">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-[#1C1F26] rounded-lg p-4 border border-slate-700 hover:border-[#D4AF37] transition group"
            >
              <div className="flex items-start gap-4">
                <div className="text-slate-500 cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{story.title}</h3>
                  {story.description && (
                    <p className="text-sm text-slate-400 mb-3">{story.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-300">
                      <strong>Points:</strong> {story.story_points}
                    </span>
                    <span className="text-slate-300">
                      <strong>Priorité:</strong> {story.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      story.status === 'done' ? 'bg-green-500/20 text-green-400' :
                      story.status === 'doing' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {story.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => openModal(story)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {stories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">Aucune story dans le backlog</p>
              <button
                onClick={() => openModal()}
                className="text-[#D4AF37] hover:underline"
              >
                Créer votre première story
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nouvelle/Éditer Story */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-[#1C1F26] rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingStory ? 'Éditer la story' : 'Nouvelle story'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  placeholder="US-1 : Connexion utilisateur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  placeholder="En tant qu'utilisateur, je veux..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Story Points</label>
                  <input
                    type="number"
                    value={formData.story_points}
                    onChange={(e) => setFormData({ ...formData, story_points: parseInt(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priorité</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition"
                >
                  {editingStory ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
      <div className="text-white animate-pulse">Chargement du backlog...</div>
    </div>
  );
}
