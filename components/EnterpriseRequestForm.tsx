'use client';

import { useState } from 'react';
import { Mail, Building, User, Phone, MessageSquare, Users } from 'lucide-react';

export default function EnterpriseRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    company: '',
    phone: '',
    message: '',
    estimatedUsers: '',
    currentTools: '',
    governanceNeeds: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/subscriptions/request-enterprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentTools: formData.currentTools.split(',').map(t => t.trim()).filter(Boolean),
          estimatedUsers: formData.estimatedUsers ? parseInt(formData.estimatedUsers) : null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Impossible d\'envoyer la demande');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('❌ [FORM] Erreur envoi:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-green-500/40 shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg shadow-green-500/30">
            ✓
          </div>
          <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Demande bien reçue !
          </h3>
          <div className="space-y-4 text-left max-w-lg mx-auto">
            <p className="text-slate-300 text-center mb-6">
              Merci pour votre intérêt. Votre demande a été transmise à notre équipe.
            </p>
            
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <p className="text-sm font-semibold text-amber-400 mb-3">📋 Prochaines étapes :</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">1.</span>
                  <span>Nous analysons votre contexte (volumes, outils, gouvernance)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">2.</span>
                  <span>Nous revenons vers vous avec quelques questions ciblées</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">3.</span>
                  <span>Nous proposons un cockpit adapté avec un devis clair</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                <strong className="text-blue-400">💡 En attendant :</strong> Vous pouvez explorer le mode Pro 
                pour découvrir toutes les fonctionnalités du cockpit.
              </p>
            </div>

            <p className="text-center text-sm text-slate-400 pt-4">
              Un email de confirmation vous a été envoyé à <strong className="text-slate-300">{formData.email}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold mb-2">Demander un devis Entreprise</h3>
        <p className="text-slate-300">
          Parlez-nous de votre contexte et de vos enjeux. Nous construisons ensemble un cockpit qui
          respecte vos rituels de gouvernance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email professionnel *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition"
              placeholder="vous@entreprise.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Nom complet *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition"
              placeholder="Jean Dupont"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Entreprise *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition"
              placeholder="Votre entreprise"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Téléphone (optionnel)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Nombre d'utilisateurs estimé
          </label>
          <input
            type="number"
            value={formData.estimatedUsers}
            onChange={(e) => setFormData({ ...formData, estimatedUsers: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition"
            placeholder="Ex: 25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Outils actuels (séparés par virgule)
          </label>
          <input
            type="text"
            value={formData.currentTools}
            onChange={(e) => setFormData({ ...formData, currentTools: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition"
            placeholder="Ex: Jira, SAP, Salesforce, Excel"
          />
          <p className="text-xs text-slate-400 mt-1">ERP, CRM, outils projets, etc.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Besoins de gouvernance (optionnel)
          </label>
          <textarea
            value={formData.governanceNeeds}
            onChange={(e) => setFormData({ ...formData, governanceNeeds: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition resize-none"
            placeholder="Multi-BU, comités mensuels, sponsors multiples..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Message (optionnel)
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition resize-none"
            placeholder="Décrivez votre contexte et vos enjeux..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-slate-900 text-slate-950 font-semibold hover:brightness-110 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </button>

        <p className="text-xs text-slate-400 text-center">
          En soumettant ce formulaire, vous acceptez d'être contacté par l'équipe Powalyze concernant
          votre demande Entreprise.
        </p>
      </form>
    </div>
  );
}
