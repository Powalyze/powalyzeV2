"use client";

import React from "react";
import { ProjectPrediction } from "@/types/project-prediction";

interface ProjectPredictionPanelProps {
  prediction: ProjectPrediction | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export default function ProjectPredictionPanel({
  prediction,
  isAnalyzing,
  onAnalyze,
}: ProjectPredictionPanelProps) {
  if (!prediction && !isAnalyzing) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 border border-blue-200 dark:border-gray-700">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            ProjectPredictor AI
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Analysez ce projet avec l'IA pour obtenir des risques, opportunités et recommandations
          </p>
          <button
            onClick={onAnalyze}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            🤖 Analyser avec l'IA
          </button>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 border border-blue-200 dark:border-gray-700">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Analyse en cours...
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            ProjectPredictor analyse le projet avec Claude AI
          </p>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  const confidencePercent = Math.round(prediction.confidence * 100);
  const confidenceColor =
    confidencePercent >= 70
      ? "text-green-600 dark:text-green-400"
      : confidencePercent >= 40
      ? "text-yellow-600 dark:text-yellow-400"
      : "text-red-600 dark:text-red-400";

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">📊 Analyse Prédictive</h3>
            <p className="text-blue-100 leading-relaxed">{prediction.summary}</p>
          </div>
          <div className="ml-4 text-right">
            <div className="text-sm opacity-90 mb-1">Confiance</div>
            <div className="text-3xl font-bold">{confidencePercent}%</div>
          </div>
        </div>
        <button
          onClick={onAnalyze}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-all"
        >
          🔄 Re-analyser
        </button>
      </div>

      {/* Risks Section */}
      {prediction.risks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-red-200 dark:border-red-900/50">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">⚠️</span>
            Risques Identifiés ({prediction.risks.length})
          </h4>
          <div className="space-y-4">
            {prediction.risks.map((risk, index) => {
              const probabilityPercent = Math.round(risk.probability * 100);
              const impactColor =
                risk.impact === "fort"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  : risk.impact === "moyen"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";

              return (
                <div
                  key={index}
                  className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 p-4 rounded-r-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-900 dark:text-white flex-1">
                      {risk.label}
                    </h5>
                    <div className="flex gap-2 ml-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${impactColor}`}>
                        Impact: {risk.impact}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {probabilityPercent}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Mitigation:</span> {risk.mitigation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Opportunities Section */}
      {prediction.opportunities.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-200 dark:border-green-900/50">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span>
            Opportunités Détectées ({prediction.opportunities.length})
          </h4>
          <div className="space-y-4">
            {prediction.opportunities.map((opp, index) => {
              const impactColor =
                opp.impact === "fort"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : opp.impact === "moyen"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

              return (
                <div
                  key={index}
                  className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/10 p-4 rounded-r-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-900 dark:text-white flex-1">
                      {opp.label}
                    </h5>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${impactColor} ml-4`}>
                      Impact: {opp.impact}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Bénéfice:</span> {opp.benefit}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Actions Section */}
      {prediction.recommended_actions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-blue-200 dark:border-blue-900/50">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🎯</span>
            Actions Recommandées ({prediction.recommended_actions.length})
          </h4>
          <div className="space-y-4">
            {prediction.recommended_actions.map((action, index) => {
              const priorityColor =
                action.priority === "haute"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  : action.priority === "moyenne"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";

              const typeEmoji =
                action.type === "technique"
                  ? "⚙️"
                  : action.type === "organisation"
                  ? "👥"
                  : action.type === "gouvernance"
                  ? "📋"
                  : "💰";

              return (
                <div
                  key={index}
                  className="border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-900 dark:text-white flex-1 flex items-center gap-2">
                      <span>{typeEmoji}</span>
                      {action.label}
                    </h5>
                    <div className="flex gap-2 ml-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColor}`}>
                        {action.priority}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {action.type}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Horizon:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {action.horizon}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Effet attendu:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {action.expected_effect}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
