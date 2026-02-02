'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayCircle, StopCircle, Clock, Target } from 'lucide-react';

/**
 * Page Sprint Board
 * Kanban board : todo / doing / done
 */
export default function SprintPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SprintContent />
    </Suspense>
  );
}

interface Sprint {
  id: string;
  name: string;
  goal: string;
  start_date: string;
  end_date: string;
  status: 'not_started' | 'active' | 'completed';
}

interface UserStory {
  id: string;
  title: string;
  description: string;
  story_points: number;
  status: 'todo' | 'doing' | 'done';
  priority: number;
}

function SprintContent() {
  const [loading, setLoading] = useState(true);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    loadSprint();
  }, []);

  const loadSprint = async () => {
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

      // Récupérer le sprint actif
      const { data: sprintData, error: sprintError } = await supabase
        .from('sprints')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .eq('status', 'active')
        .single();

      if (sprintError && sprintError.code !== 'PGRST116') throw sprintError;

      setActiveSprint(sprintData);

      if (sprintData) {
        // Récupérer les stories du sprint
        const { data: storiesData, error: storiesError } = await supabase
          .from('user_stories')
          .select('*')
          .eq('sprint_id', sprintData.id)
          .order('priority', { ascending: true });

        if (storiesError) throw storiesError;

        setStories(storiesData || []);
      }
    } catch (err: any) {
      console.error('Erreur chargement:', err);
      alert(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const updateStoryStatus = async (storyId: string, newStatus: 'todo' | 'doing' | 'done') => {
    try {
      const { error } = await supabase
        .from('user_stories')
        .update({ status: newStatus })
        .eq('id', storyId);

      if (error) throw error;

      // Mettre à jour localement
      setStories(prev =>
        prev.map(s => (s.id === storyId ? { ...s, status: newStatus } : s))
      );
    } catch (err: any) {
      alert(err.message || 'Erreur mise à jour');
    }
  };

  const getDaysRemaining = () => {
    if (!activeSprint) return 0;
    const end = new Date(activeSprint.end_date);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getTotalPoints = () => stories.reduce((sum, s) => sum + s.story_points, 0);
  const getCompletedPoints = () => stories.filter(s => s.status === 'done').reduce((sum, s) => sum + s.story_points, 0);

  const storiesByStatus = {
    todo: stories.filter(s => s.status === 'todo'),
    doing: stories.filter(s => s.status === 'doing'),
    done: stories.filter(s => s.status === 'done'),
  };

  if (loading) return <LoadingState />;

  if (!activeSprint) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <PlayCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Aucun sprint actif</h2>
            <p className="text-slate-400 mb-6">
              {isDemo ? 'En mode Demo, le sprint est généré automatiquement.' : 'Créez un sprint pour commencer.'}
            </p>
            {!isDemo && (
              <button className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition">
                Créer un sprint
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining();
  const totalPoints = getTotalPoints();
  const completedPoints = getCompletedPoints();

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Sprint */}
        <div className="bg-[#1C1F26] rounded-2xl p-6 mb-6 border border-slate-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{activeSprint.name}</h1>
              <div className="flex items-center gap-2 text-slate-400">
                <Target className="w-4 h-4" />
                <span className="text-sm">{activeSprint.goal}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{daysRemaining}</div>
                <div className="text-xs text-slate-400">jours restants</div>
              </div>
              <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition flex items-center gap-2">
                <StopCircle className="w-4 h-4" />
                Terminer
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-[#0A0F1C] rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Total Points</div>
              <div className="text-2xl font-bold text-white">{totalPoints}</div>
            </div>
            <div className="bg-[#0A0F1C] rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Complétés</div>
              <div className="text-2xl font-bold text-green-500">{completedPoints}</div>
            </div>
            <div className="bg-[#0A0F1C] rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Progression</div>
              <div className="text-2xl font-bold text-[#D4AF37]">
                {totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Colonne TODO */}
          <div className="bg-[#1C1F26] rounded-2xl p-4 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
              À faire ({storiesByStatus.todo.length})
            </h3>
            <div className="space-y-3">
              {storiesByStatus.todo.map((story) => (
                <div
                  key={story.id}
                  className="bg-[#0A0F1C] rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                  onClick={() => updateStoryStatus(story.id, 'doing')}
                >
                  <h4 className="text-sm font-semibold text-white mb-2">{story.title}</h4>
                  {story.description && (
                    <p className="text-xs text-slate-400 mb-2">{story.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">SP: {story.story_points}</span>
                    <span className="text-xs text-slate-500">P{story.priority}</span>
                  </div>
                </div>
              ))}
              {storiesByStatus.todo.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">Aucune story</p>
              )}
            </div>
          </div>

          {/* Colonne DOING */}
          <div className="bg-[#1C1F26] rounded-2xl p-4 border border-blue-500/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              En cours ({storiesByStatus.doing.length})
            </h3>
            <div className="space-y-3">
              {storiesByStatus.doing.map((story) => (
                <div
                  key={story.id}
                  className="bg-[#0A0F1C] rounded-lg p-4 border border-blue-500/50 hover:border-blue-500 transition cursor-pointer"
                  onClick={() => updateStoryStatus(story.id, 'done')}
                >
                  <h4 className="text-sm font-semibold text-white mb-2">{story.title}</h4>
                  {story.description && (
                    <p className="text-xs text-slate-400 mb-2">{story.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-400">SP: {story.story_points}</span>
                    <span className="text-xs text-slate-500">P{story.priority}</span>
                  </div>
                </div>
              ))}
              {storiesByStatus.doing.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">Aucune story</p>
              )}
            </div>
          </div>

          {/* Colonne DONE */}
          <div className="bg-[#1C1F26] rounded-2xl p-4 border border-green-500/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Terminé ({storiesByStatus.done.length})
            </h3>
            <div className="space-y-3">
              {storiesByStatus.done.map((story) => (
                <div
                  key={story.id}
                  className="bg-[#0A0F1C] rounded-lg p-4 border border-green-500/50 opacity-75"
                >
                  <h4 className="text-sm font-semibold text-white mb-2 line-through">{story.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-400">SP: {story.story_points}</span>
                    <span className="text-xs text-slate-500">P{story.priority}</span>
                  </div>
                </div>
              ))}
              {storiesByStatus.done.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">Aucune story</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
      <div className="text-white animate-pulse">Chargement du sprint...</div>
    </div>
  );
}
