'use client';

import { useEffect, useState } from 'react';

interface RiskData {
  id: string;
  title: string;
  probability: number;
  impact: number;
  score: number;
}

export default function HeatmapRisks() {
  const [risks, setRisks] = useState<RiskData[]>([]);

  useEffect(() => {
    fetch('/api/risks?limit=10', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRisks(data);
        } else {
          setRisks([]);
        }
      })
      .catch(err => {
        console.error(err);
        setRisks([]);
      });
  }, []);

  const getPositionClass = (probability: number, impact: number) => {
    const col = Math.ceil(probability / 25);
    const row = 5 - Math.ceil(impact / 25);
    return { gridColumn: col, gridRow: row };
  };

  const getColorClass = (score: number) => {
    if (score >= 15) return 'bg-status-red';
    if (score >= 9) return 'bg-status-yellow';
    return 'bg-status-green';
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4">Matrice des Risques</h2>
      
      <div className="relative">
        {/* Grid */}
        <div className="grid grid-cols-4 grid-rows-4 gap-2 h-96">
          {Array.from({ length: 16 }).map((_, i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            let bgColor = 'bg-status-green/20';
            
            if (row <= 1 && col >= 2) bgColor = 'bg-status-red/20';
            else if (row <= 1 || col >= 2) bgColor = 'bg-status-yellow/20';
            
            return (
              <div
                key={i}
                className={`${bgColor} rounded border border-white/10 relative`}
              />
            );
          })}
        </div>

        {/* Risks */}
        <div className="absolute inset-0 pointer-events-none">
          {risks.map((risk) => (
            <div
              key={risk.id}
              className={`absolute w-3 h-3 rounded-full ${getColorClass(risk.score)} pointer-events-auto cursor-pointer hover:scale-150 transition-transform`}
              style={{
                left: `${(risk.probability / 100) * 100}%`,
                top: `${100 - (risk.impact / 100) * 100}%`,
              }}
              title={risk.title}
            />
          ))}
        </div>
      </div>

      {/* Axes */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs text-white/60">
          <span>Probabilité →</span>
          <span>Impact ↑</span>
        </div>
      </div>
    </div>
  );
}
