'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Map, Plus, Edit2, Trash2 } from 'lucide-react';

/**
 * Page Story Mapping
 * Visualisation des epics + stories
 */
export default function StoryMappingPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <StoryMappingContent />
    </Suspense>
  );
}

interface Epic {
  id: string;
  name: string;
  description: string;
  color: string;
  position: number;
}

interface UserStory {
  id: string;
  epic_id: string | null;
  title: string;
  description: string;
  story_points: number;
  position: number;
  status: 'todo' | 'doing' | 'done';
}

function StoryMappingContent() {
  const [loading, setLoading] = useState(true);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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

      // Récupérer les epics
      const { data: epicsData, error: epicsError } = await supabase
        .from('epics')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('position', { ascending: true });

      if (epicsError) throw epicsError;

      setEpics(epicsData || []);

      // Récupérer toutes les stories
      const { data: storiesData, error: storiesError } = await supabase
        .from('user_stories')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('position', { ascending: true });

      if (storiesError) throw storiesError;

      setStories(storiesData || []);
    } catch (err: any) {
      console.error('Erreur chargement:', err);
      alert(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const storiesByEpic = (epicId: string | null) =>
    stories.filter(s => s.epic_id === epicId);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Map className="w-8 h-8 text-[#D4AF37]" />
            Story Mapping
          </h1>
          <p className="text-slate-400">Visualisation des epics et user stories</p>
        </div>

        {/* Actions */}
        {!isDemo && (
          <div className="flex gap-3 mb-6">
            <button className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Créer un Epic
            </button>
          </div>
        )}

        {/* Story Mapping Grid */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {/* Colonne pour stories sans epic */}
          <div className="flex-shrink-0 w-80">
            <div className="bg-[#1C1F26] rounded-xl p-4 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Sans Epic</h3>
              <div className="space-y-3">
                {storiesByEpic(null).map(story => (
                  <div
                    key={story.id}
                    className="bg-[#0A0F1C] rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                  >
                    <h4 className="text-sm font-semibold text-white mb-1">{story.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">SP: {story.story_points}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          story.status === 'done'
                            ? 'bg-green-500/20 text-green-400'
                            : story.status === 'doing'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {story.status}
                      </span>
                    </div>
                  </div>
                ))}
                {storiesByEpic(null).length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">Aucune story</p>
                )}
              </div>
            </div>
          </div>

          {/* Colonnes pour chaque epic */}
          {epics.map(epic => (
            <div key={epic.id} className="flex-shrink-0 w-80">
              <div
                className="rounded-xl p-4 border-2"
                style={{
                  backgroundColor: `${epic.color}20`,
                  borderColor: epic.color,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{epic.name}</h3>
                    <p className="text-xs text-slate-400">{epic.description}</p>
                  </div>
                  {!isDemo && (
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-white/10 rounded transition">
                        <Edit2 className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded transition">
                        <Trash2 className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {storiesByEpic(epic.id).map(story => (
                    <div
                      key={story.id}
                      className="bg-[#0A0F1C] rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                    >
                      <h4 className="text-sm font-semibold text-white mb-1">{story.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">SP: {story.story_points}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            story.status === 'done'
                              ? 'bg-green-500/20 text-green-400'
                              : story.status === 'doing'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {story.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {storiesByEpic(epic.id).length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">Aucune story</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {epics.length === 0 && !isDemo && (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="text-center">
                <Map className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Aucun epic créé</h2>
                <p className="text-slate-400 mb-4">Créez votre premier epic pour organiser vos user stories.</p>
                <button className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition">
                  Créer un Epic
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Demo CTA */}
        {isDemo && (
          <div className="mt-8 bg-gradient-to-r from-[#D4AF37]/20 to-[#C4A037]/10 rounded-2xl p-6 border border-[#D4AF37]/30">
            <h3 className="text-xl font-semibold text-white mb-2">Fonctionnalité limitée en Demo</h3>
            <p className="text-slate-300 mb-4">
              Créez vos propres epics et organisez vos stories avec le drag & drop en passant en mode Pro.
            </p>
            <button className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition">
              Passer en Mode Pro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
      <div className="text-white animate-pulse">Chargement du story mapping...</div>
    </div>
  );
}
