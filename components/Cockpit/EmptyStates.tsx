'use client';

/**
 * PACK 0 - Composants EmptyState premium
 * Affichage élégant lorsque modules vides (projets, risques, décisions, timeline, rapports)
 */

import { Rocket, AlertTriangle, FileQuestion, Clock, FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAction?: () => void;
  actionLabel?: string;
}

/**
 * État vide: Aucun projet
 */
export function EmptyProjects({ onAction, actionLabel = 'Créer mon premier projet' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
      <div className="mb-4 rounded-full bg-blue-100 p-4">
        <Rocket size={32} className="text-blue-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        Aucun projet pour le moment
      </h3>
      <p className="mb-6 max-w-md text-gray-600">
        Créez votre premier projet pour activer votre pilotage exécutif et débloquer tous les modules du cockpit.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Plus size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * État vide: Aucun risque
 */
export function EmptyRisks({ onAction, actionLabel = 'Identifier un risque' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-4">
        <AlertTriangle size={32} className="text-red-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        Aucun risque identifié
      </h3>
      <p className="mb-6 max-w-md text-gray-600">
        C'est le moment d'analyser votre portefeuille et d'identifier les risques potentiels pour une gestion proactive.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 active:scale-95 transition-all"
        >
          <Plus size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * État vide: Aucune décision
 */
export function EmptyDecisions({ onAction, actionLabel = 'Créer une décision' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
      <div className="mb-4 rounded-full bg-purple-100 p-4">
        <FileQuestion size={32} className="text-purple-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        Aucune décision en attente
      </h3>
      <p className="mb-6 max-w-md text-gray-600">
        Documentez les décisions stratégiques à prendre pour assurer un arbitrage efficace et traçable.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 active:scale-95 transition-all"
        >
          <Plus size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * État vide: Timeline vide
 */
export function EmptyTimeline() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
      <div className="mb-4 rounded-full bg-amber-100 p-4">
        <Clock size={32} className="text-amber-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        Timeline vide
      </h3>
      <p className="max-w-md text-gray-600">
        La timeline se remplira automatiquement dès que vous créerez des projets, risques, décisions ou que l'IA effectuera des actions.
      </p>
    </div>
  );
}

/**
 * État vide: Aucun rapport
 */
export function EmptyReports({ onAction, actionLabel = 'Générer un rapport' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
      <div className="mb-4 rounded-full bg-indigo-100 p-4">
        <FileText size={32} className="text-indigo-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        Aucun rapport généré
      </h3>
      <p className="mb-6 max-w-md text-gray-600">
        Générez votre premier rapport exécutif pour communiquer l'avancement de votre portefeuille aux parties prenantes.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * État vide compact (pour cards)
 */
export function EmptyStateCompact({ 
  icon: Icon = Rocket, 
  title, 
  description,
  iconColor = 'text-gray-400'
}: { 
  icon?: any; 
  title: string; 
  description: string;
  iconColor?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Icon size={40} className={`mb-3 ${iconColor}`} />
      <h4 className="mb-1 font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
