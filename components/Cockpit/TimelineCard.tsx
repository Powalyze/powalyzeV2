"use client";

import { Calendar, Circle } from "lucide-react";

type TimelineEvent = {
  id: string;
  entity_type: string;
  entity_id: string;
  label: string;
  date: string;
  type: string;
};

type Props = {
  timeline: TimelineEvent[];
};

export function TimelineCard({ timeline }: Props) {
  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'milestone': return 'text-amber-400';
      case 'deadline': return 'text-red-400';
      case 'start': return 'text-green-400';
      case 'review': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const sortedTimeline = [...timeline].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const upcomingEvents = sortedTimeline.filter(
    e => new Date(e.date) >= new Date()
  ).slice(0, 8);

  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-50 mb-1">Timeline & jalons</h2>
          <p className="text-sm text-slate-400">{upcomingEvents.length} événement(s) à venir</p>
        </div>
        <Calendar className="text-amber-400" size={24} />
      </div>

      <div className="space-y-4">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            Aucun événement planifié
          </div>
        ) : (
          upcomingEvents.map((event, idx) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <Circle className={`${getTypeColor(event.type)} fill-current`} size={12} />
                {idx < upcomingEvents.length - 1 && (
                  <div className="w-px h-full bg-slate-700 mt-2" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-zinc-50">{event.label}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className={getTypeColor(event.type)}>{event.type}</span>
                  <span>·</span>
                  <span>{event.entity_type}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
