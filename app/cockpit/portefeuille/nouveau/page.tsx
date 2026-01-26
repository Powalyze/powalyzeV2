"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";

export default function NouveauProjetPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "En cours",
    priority: "Moyenne",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler un appel API (à remplacer par votre vraie logique)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Remplacer par un vrai appel à /api/projects
      console.log("Nouveau projet créé:", formData);
      
      // Rediriger vers le portefeuille
      router.push("/cockpit/portefeuille");
      
      // Optionnel: Afficher un toast de succès
      alert(`✅ Projet "${formData.name}" créé avec succès !`);
    } catch (error) {
      console.error("Erreur création projet:", error);
      alert("❌ Erreur lors de la création du projet");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/cockpit/portefeuille"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Nouveau Projet</h1>
            <p className="text-slate-400 mt-1">Créer un nouveau projet dans le portefeuille</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 space-y-6">
          {/* Nom du projet */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Nom du projet *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: Migration Cloud Azure"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Description détaillée du projet..."
            />
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-slate-300 mb-2">
              Budget (€)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: 150000"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-2">
                Date de début
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-300 mb-2">
                Date de fin prévue
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Statut et Priorité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="En cours">En cours</option>
                <option value="Planifié">Planifié</option>
                <option value="En attente">En attente</option>
                <option value="Terminé">Terminé</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-2">
                Priorité
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="Haute">Haute</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Basse">Basse</option>
              </select>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isSubmitting || !formData.name}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              {isSubmitting ? "Création..." : "Créer le projet"}
            </button>
            <Link
              href="/cockpit/portefeuille"
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <X size={18} />
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
