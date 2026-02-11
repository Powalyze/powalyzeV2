"use client";

import { useState, useEffect } from "react";
import { Send, Reply, Trash2, Edit2, AtSign } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  mentions: string[];
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

interface CommentsProps {
  entityType: "project" | "task" | "risk" | "decision";
  entityId: string;
}

export function Comments({ entityType, entityId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadComments();
  }, [entityType, entityId]);

  async function loadComments() {
    // TODO: Charger depuis l'API
    setComments([
      {
        id: "1",
        content: "Super avancée sur ce projet ! 🚀",
        user_id: "1",
        user_name: "Jean Dupont",
        mentions: [],
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "2",
        content: "@Marie Martin peux-tu vérifier les specs ?",
        user_id: "2",
        user_name: "Pierre Dubois",
        mentions: ["Marie Martin"],
        created_at: new Date(Date.now() - 1800000).toISOString(),
        updated_at: new Date(Date.now() - 1800000).toISOString(),
      },
    ]);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      user_id: "current_user",
      user_name: "Vous",
      mentions: extractMentions(newComment),
      parent_id: replyTo || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment("");
    setReplyTo(null);
    showToast("success", "Commentaire ajouté", "Votre commentaire a été publié");
  }

  function extractMentions(text: string): string[] {
    const matches = text.match(/@(\w+\s?\w+)/g);
    return matches ? matches.map(m => m.substring(1)) : [];
  }

  function formatRelativeTime(date: string): string {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
    return `Il y a ${Math.floor(diff / 86400)} j`;
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-slate-400">
        Chargement des commentaires...
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">
        Commentaires ({comments.length})
      </h3>

      {/* Comments List */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-semibold flex-shrink-0">
              {comment.user_name.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{comment.user_name}</span>
                  <span className="text-xs text-slate-500">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                </div>
                <p className="text-slate-300 text-sm">
                  {comment.content.split(/(@\w+\s?\w+)/g).map((part, i) => 
                    part.startsWith('@') ? (
                      <span key={i} className="text-amber-400 font-medium">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-2 text-xs">
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="text-slate-400 hover:text-amber-400 flex items-center gap-1"
                >
                  <Reply size={14} />
                  Répondre
                </button>
                <button className="text-slate-400 hover:text-blue-400 flex items-center gap-1">
                  <Edit2 size={14} />
                  Modifier
                </button>
                <button className="text-slate-400 hover:text-red-400 flex items-center gap-1">
                  <Trash2 size={14} />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            Aucun commentaire pour le moment. Soyez le premier à commenter !
          </div>
        )}
      </div>

      {/* Reply indicator */}
      {replyTo && (
        <div className="mb-3 p-2 bg-slate-800 rounded-lg flex items-center justify-between text-sm">
          <span className="text-slate-400">
            Réponse à {comments.find(c => c.id === replyTo)?.user_name}
          </span>
          <button
            onClick={() => setReplyTo(null)}
            className="text-slate-500 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Écrivez un commentaire... (@mention pour notifier)"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            type="button"
            title="Mentionner quelqu'un"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <AtSign size={18} />
          </button>
        </div>
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Send size={18} />
          Envoyer
        </button>
      </form>
    </div>
  );
}
