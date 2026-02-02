'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  FileText, Download, Mail, Copy, AlertTriangle,
  TrendingUp, TrendingDown, CheckCircle, XCircle, Clock
} from 'lucide-react';

interface PortfolioSummary {
  total_projects: number;
  green_projects: number;
  yellow_projects: number;
  red_projects: number;
  health_score: number;
  total_budget: number;
  total_spent: number;
  budget_consumed_pct: number;
  overallocated_resources: number;
  critical_dependencies: number;
}

export default function RapportPortefeuillePage() {
  const router = useRouter();
  const supabase = createClient();
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, plan')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      const demo = profile.plan === 'demo';
      setIsDemo(demo);

      // Récupérer résumé portefeuille
      try {
        const { data, error } = await supabase
          .rpc('get_portfolio_summary', { p_organization_id: profile.organization_id });

        if (error) {
          console.error('Error loading portfolio summary:', error);
          // Fallback en cas d'erreur
          setSummary({
            total_projects: 0,
            green_projects: 0,
            yellow_projects: 0,
            red_projects: 0,
            health_score: 0,
            total_budget: 0,
            total_spent: 0,
            budget_consumed_pct: 0,
            overallocated_resources: 0,
            critical_dependencies: 0
          });
        } else {
          setSummary(data);
        }
      } catch (err) {
        console.error('Exception loading portfolio summary:', err);
        // Fallback
        setSummary({
          total_projects: 0,
          green_projects: 0,
          yellow_projects: 0,
          red_projects: 0,
          health_score: 0,
          total_budget: 0,
          total_spent: 0,
          budget_consumed_pct: 0,
          overallocated_resources: 0,
          critical_dependencies: 0
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    // Simuler génération IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGenerating(false);
  };

  const handleCopyMarkdown = () => {
    const markdown = `# Rapport Exécutif Portefeuille

## Synthèse Globale
- **Projets totaux**: ${summary?.total_projects}
- **Santé portefeuille**: ${summary?.health_score}%
- **Budget consommé**: ${summary?.budget_consumed_pct}%

## Projets par Statut
- ✅ **Green**: ${summary?.green_projects}
- ⚠️ **Yellow**: ${summary?.yellow_projects}
- 🔴 **Red**: ${summary?.red_projects}

## Alertes
- **Ressources sur-allouées**: ${summary?.overallocated_resources}
- **Dépendances critiques**: ${summary?.critical_dependencies}

---
*Généré le ${new Date().toLocaleDateString('fr-FR')}*
`;

    navigator.clipboard.writeText(markdown);
    alert('Rapport copié en Markdown !');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0F1C]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#1a1f35] to-[#0A0F1C] text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Rapport Exécutif Portefeuille
            </h1>
            <p className="text-gray-400">
              Synthèse consolidée multi-projets
            </p>
          </div>
          {isDemo && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Mode Démo</span>
            </div>
          )}
        </div>

        {/* Bouton Générer */}
        <button
          onClick={handleGenerate}
          disabled={generating || isDemo}
          className={`
            px-6 py-3 rounded-xl font-medium flex items-center gap-2
            ${isDemo 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0A0F1C] hover:shadow-lg hover:shadow-[#D4AF37]/50'
            }
            transition-all duration-300
          `}
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#0A0F1C]"></div>
              Génération en cours...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              {isDemo ? 'Génération IA (Pro uniquement)' : 'Générer le rapport IA'}
            </>
          )}
        </button>
      </div>

      {/* Synthèse Exécutive */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* KPIs Principaux */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">Projets Totaux</p>
              <FileText className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <p className="text-4xl font-bold text-white">{summary?.total_projects || 0}</p>
          </div>

          <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">Santé Portfolio</p>
              <TrendingUp className="w-8 h-8 text-[#3DD68C]" />
            </div>
            <p className="text-4xl font-bold text-[#3DD68C]">{summary?.health_score || 0}%</p>
          </div>

          <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">Budget Consommé</p>
              <TrendingDown className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-4xl font-bold text-amber-500">{summary?.budget_consumed_pct || 0}%</p>
          </div>

          <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">Alertes</p>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-4xl font-bold text-red-500">
              {(summary?.overallocated_resources || 0) + (summary?.critical_dependencies || 0)}
            </p>
          </div>
        </div>

        {/* Projets par Statut */}
        <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#D4AF37]" />
            Répartition par Statut RAG
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-500 mb-1">{summary?.green_projects || 0}</p>
              <p className="text-gray-400 text-sm">Green</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-amber-500 mb-1">{summary?.yellow_projects || 0}</p>
              <p className="text-gray-400 text-sm">Yellow</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-red-500 mb-1">{summary?.red_projects || 0}</p>
              <p className="text-gray-400 text-sm">Red</p>
            </div>
          </div>
        </div>

        {/* Alertes Critiques */}
        <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[#D4AF37]" />
            Alertes Critiques
          </h2>
          <div className="space-y-4">
            {summary?.overallocated_resources ? (
              <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-red-400 font-semibold">
                    {summary.overallocated_resources} ressource(s) sur-allouée(s)
                  </p>
                  <p className="text-red-300/70 text-sm">
                    Charge &gt; 100% détectée. Rééquilibrer les allocations.
                  </p>
                </div>
              </div>
            ) : null}

            {summary?.critical_dependencies ? (
              <div className="flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-amber-400 font-semibold">
                    {summary.critical_dependencies} dépendance(s) critique(s)
                  </p>
                  <p className="text-amber-300/70 text-sm">
                    Projets bloquants à risque ou en retard.
                  </p>
                </div>
              </div>
            ) : null}

            {!summary?.overallocated_resources && !summary?.critical_dependencies && (
              <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <p className="text-green-400 font-semibold">
                  Aucune alerte critique détectée
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Export Actions */}
        <div className="bg-[#1a1f35]/50 border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Download className="w-6 h-6 text-[#D4AF37]" />
            Exporter le Rapport
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={handleCopyMarkdown}
              className="px-4 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg hover:bg-[#D4AF37]/20 transition-all flex items-center justify-center gap-2"
            >
              <Copy className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-medium">Markdown</span>
            </button>

            <button
              disabled={isDemo}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">PDF {isDemo && '(Pro)'}</span>
            </button>

            <button
              disabled={isDemo}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Word {isDemo && '(Pro)'}</span>
            </button>

            <button
              disabled={isDemo}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Email {isDemo && '(Pro)'}</span>
            </button>
          </div>
        </div>

        {/* Mode Demo info */}
        {isDemo && (
          <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-blue-400 font-semibold mb-2">Mode Démo — Rapport fictif</p>
                <ul className="text-blue-300/80 text-sm space-y-1">
                  <li>• Données de démonstration uniquement</li>
                  <li>• Génération IA désactivée (disponible en Pro)</li>
                  <li>• Export PDF/Word/Email réservés aux comptes Pro</li>
                  <li>• Passez en Pro pour générer vos rapports réels</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
