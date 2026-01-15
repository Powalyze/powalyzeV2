"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

const timelineData = [
  {
    id: 1,
    type: 'milestone',
    title: 'Release Q1 - Platform V2',
    project: 'Digital Transformation',
    date: '23 jan',
    status: 'on-track',
    daysLeft: 8,
  },
  {
    id: 2,
    type: 'decision',
    title: 'Arbitrage budget Cloud Q2',
    project: 'Infrastructure',
    date: '27 jan',
    status: 'pending',
    daysLeft: 12,
  },
  {
    id: 3,
    type: 'delay',
    title: 'Retard Go-Live CRM',
    project: 'Sales Excellence',
    date: '15 fév',
    status: 'delayed',
    delay: '+14j',
  },
  {
    id: 4,
    type: 'milestone',
    title: 'Audit sécurité ISO 27001',
    project: 'Security',
    date: '03 mar',
    status: 'on-track',
    daysLeft: 47,
  },
];

export const Timeline: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-100">Timeline des jalons critiques</h3>
        <button className="text-xs text-slate-400 hover:text-slate-300">Voir tout</button>
      </div>
      
      <div className="space-y-3">
        {timelineData.map((item, index) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {item.type === 'milestone' && (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )}
              {item.type === 'decision' && (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>
              )}
              {item.type === 'delay' && (
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-medium text-sm text-slate-200">{item.title}</div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{item.date}</span>
              </div>
              <div className="text-xs text-slate-400 mb-2">{item.project}</div>
              <div className="flex items-center gap-2">
                {item.status === 'on-track' && (
                  <Badge variant="success" className="text-xs">Dans les temps · {item.daysLeft}j</Badge>
                )}
                {item.status === 'pending' && (
                  <Badge variant="warning" className="text-xs">Décision attendue · {item.daysLeft}j</Badge>
                )}
                {item.status === 'delayed' && (
                  <Badge variant="danger" className="text-xs">Retard {item.delay}</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
