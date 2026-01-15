"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, DollarSign, Users } from 'lucide-react';

const projects = [
  {
    id: 1,
    name: 'Digital Transformation',
    sponsor: 'J. Dupont',
    status: 'on-track',
    progress: 78,
    budget: '1.2M€',
    budgetStatus: 'ok',
    team: 12,
    deadline: '23 jan',
  },
  {
    id: 2,
    name: 'Sales Excellence CRM',
    sponsor: 'M. Martin',
    status: 'at-risk',
    progress: 45,
    budget: '580K€',
    budgetStatus: 'warning',
    team: 8,
    deadline: '15 fév',
  },
  {
    id: 3,
    name: 'Cloud Migration AWS',
    sponsor: 'A. Bernard',
    status: 'on-track',
    progress: 92,
    budget: '2.1M€',
    budgetStatus: 'ok',
    team: 15,
    deadline: '31 jan',
  },
];

export const PortfolioList: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-100">Top projets actifs</h3>
        <button className="text-xs text-slate-400 hover:text-slate-300">Voir portefeuille complet</button>
      </div>
      
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="font-medium text-sm text-slate-200 mb-1">{project.name}</div>
                <div className="text-xs text-slate-400">Sponsor: {project.sponsor}</div>
              </div>
              {project.status === 'on-track' && <Badge variant="success">On track</Badge>}
              {project.status === 'at-risk' && <Badge variant="danger">À risque</Badge>}
            </div>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Progression</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3 h-3" />
                <span>{project.budget}</span>
                {project.budgetStatus === 'warning' && (
                  <span className="text-amber-400">⚠</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                <span>{project.team} pers.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" />
                <span>Deadline: {project.deadline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
