// ============================================================
// COMPONENT — RESET PRO BUTTON
// /components/settings/ResetProButton.tsx
// ============================================================

'use client';

import { useState } from 'react';
import { safeFetch } from '@/lib/safeFetch';

interface ResetProButtonProps {
  organizationId: string;
}

export function ResetProButton({ organizationId }: ResetProButtonProps) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleReset = async () => {
    setLoading(true);

    try {
      const res = await safeFetch('/api/admin/reset-pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          confirm: true,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Mode Pro réinitialisé avec succès!\n\n${data.totalDeleted} lignes supprimées`);
        setConfirm(false);
        // Recharger la page pour afficher l'état vide
        window.location.reload();
      } else {
        alert(`❌ Erreur: ${data.message || 'Erreur lors de la réinitialisation'}`);
      }
    } catch (error: any) {
      alert(`❌ Erreur réseau: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border border-red-500/30 bg-gradient-to-br from-red-950/40 to-red-900/20 rounded-2xl p-6">
      <h3 className="text-sm font-bold tracking-wide text-red-400 uppercase flex items-center gap-2">
        <span>⚠️</span>
        <span>Danger Zone</span>
      </h3>
      <p className="mt-3 text-sm text-slate-300 leading-relaxed">
        Réinitialise complètement le Mode Pro pour ce compte.
        <br />
        <span className="font-semibold text-red-300">
          Cette action est irréversible
        </span>
        {' '}— toutes les données seront définitivement supprimées.
      </p>

      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-700 hover:shadow-red-900/50"
        >
          <span>🔥</span>
          <span>Réinitialiser le Mode Pro</span>
        </button>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          <div className="rounded-xl bg-red-900/40 border border-red-500/40 p-4">
            <p className="text-sm font-semibold text-red-200">
              ⚠️ Confirmer la réinitialisation complète ?
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Tous les projets, risques, décisions, équipes, budgets et données seront supprimés.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Réinitialisation…</span>
                </>
              ) : (
                <>
                  <span>✔️</span>
                  <span>Oui, tout supprimer</span>
                </>
              )}
            </button>
            <button
              onClick={() => setConfirm(false)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
            >
              <span>✖️</span>
              <span>Annuler</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
