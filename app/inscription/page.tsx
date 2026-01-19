"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, User, Building, Phone, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function InscriptionPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation d'envoi - en production, envoyer à l'admin
    console.log("Demande d'accès:", formData);
    
    // Simuler l'envoi d'email à l'admin
    alert(`✅ Demande d'accès envoyée avec succès !\n\nVotre demande a été transmise à l'administrateur Powalyze.\nVous recevrez vos identifiants de connexion par email sous 24-48h.\n\nEmail de contact: ${formData.email}`);
    
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="w-20 h-20 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Demande envoyée avec succès !</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Votre demande d'accès au Cockpit Powalyze a été transmise à notre équipe.<br />
              Vous recevrez vos identifiants de connexion par email sous 24-48 heures.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <p className="text-blue-300 text-sm">
                📧 Un email de confirmation a été envoyé à <strong>{formData.email}</strong><br />
                🔐 Vos identifiants vous permettront d'accéder au cockpit et de les changer lors de votre première connexion.
              </p>
            </div>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/">
                <Button variant="outline">
                  Retour à l'accueil
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="primary">
                  Connexion
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={20} />
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">Demande d'accès au Cockpit</h1>
          <p className="text-slate-300 text-lg">
            Remplissez ce formulaire pour obtenir vos identifiants d'accès au Cockpit Exécutif Powalyze. 
            Un administrateur validera votre demande et vous enverra vos identifiants par email.
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email professionnel *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="jean.dupont@entreprise.com"
                    required
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Entreprise *
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Nom de votre entreprise"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  placeholder="Décrivez brièvement vos besoins et objectifs..."
                />
              </div>

              {/* Info Box */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                <h3 className="text-amber-400 font-semibold mb-2">📋 Processus de validation</h3>
                <ul className="text-amber-300 text-sm space-y-2">
                  <li>✓ Votre demande sera examinée par un administrateur</li>
                  <li>✓ Vous recevrez vos identifiants par email sous 24-48h</li>
                  <li>✓ Vous pourrez changer votre mot de passe à la première connexion</li>
                  <li>✓ Accès complet au Cockpit Exécutif et à toutes ses fonctionnalités</li>
                </ul>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" variant="primary" className="flex-1">
                  Envoyer la demande
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Already have an account */}
        <div className="mt-8 text-center">
          <p className="text-slate-400">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
