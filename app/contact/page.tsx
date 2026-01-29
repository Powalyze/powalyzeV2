"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    type: "demo"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Envoyer à une API ou service email
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Parlons de votre cockpit
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Que vous cherchiez une démonstration, un accompagnement expert ou un devis personnalisé, nous sommes là.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="p-8 rounded-xl bg-gradient-to-br from-amber-500/10 to-green-500/10 border border-amber-500/50 text-center">
                <CheckCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Message envoyé !</h3>
                <p className="text-slate-300">
                  Nous vous répondrons dans les 24h ouvrées.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Type de demande
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="demo">Demander une démonstration</option>
                    <option value="devis">Recevoir un devis personnalisé</option>
                    <option value="accompagnement">Accompagnement expert</option>
                    <option value="question">Question générale</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email professionnel
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="jean@entreprise.ch"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Entreprise SA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="+41 XX XXX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    placeholder="Décrivez votre contexte, vos enjeux ou vos questions..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
                >
                  Envoyer le message
                  <Send size={20} />
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Coordonnées</h3>
              <div className="space-y-4">
                <ContactInfo
                  icon={<Mail size={24} />}
                  title="Email"
                  value="contact@powalyze.com"
                />
                <ContactInfo
                  icon={<Phone size={24} />}
                  title="Téléphone"
                  value="+33 6 15 76 70 67"
                />
                <ContactInfo
                  icon={<MapPin size={24} />}
                  title="Siège"
                  value="Suisse 🇨🇭"
                />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h4 className="text-xl font-bold mb-3">Disponibilité</h4>
              <p className="text-slate-400 mb-4">
                Nous répondons sous 24h ouvrées. Pour les demandes urgentes, précisez-le dans votre message.
              </p>
              <div className="text-sm text-slate-500">
                <p>Lundi - Vendredi: 9h00 - 18h00 CET</p>
                <p>Weekend: Fermé</p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-sky-500/10 border border-amber-500/30">
              <h4 className="text-xl font-bold mb-3">Vous préférez essayer directement ?</h4>
              <p className="text-slate-300 mb-4">
                Créez un compte Demo en 2 minutes et explorez le cockpit immédiatement.
              </p>
              <a
                href="/signup?demo=true"
                className="inline-block px-6 py-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-white font-semibold transition-all"
              >
                Accès Demo gratuit
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactInfo({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-amber-400 flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-sm text-slate-400">{title}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

