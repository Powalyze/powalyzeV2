"use client";

import { useEffect, useState } from "react";
import { X, Cookie } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("powalyze-cookie-consent");
    if (!cookieConsent) {
      // Show banner after 1 second
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("powalyze-cookie-consent", "accepted");
    setIsVisible(false);
    // Initialize analytics/tracking here if needed
  };

  const handleRefuse = () => {
    localStorage.setItem("powalyze-cookie-consent", "refused");
    setIsVisible(false);
  };

  const handleAcceptSelection = () => {
    // For now, same as accept all
    // Could be enhanced with granular cookie preferences
    localStorage.setItem("powalyze-cookie-consent", "custom");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto p-6">
          {!showDetails ? (
            // Compact view
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <Cookie className="text-amber-400 flex-shrink-0 mt-1" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    🍪 Nous utilisons des cookies
                  </h3>
                  <p className="text-sm text-slate-300">
                    Powalyze utilise des cookies essentiels pour le bon fonctionnement du site, 
                    et des cookies analytiques pour améliorer votre expérience. 
                    Nous respectons votre vie privée conformément au RGPD.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={handleAccept}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold transition-all whitespace-nowrap"
                >
                  Tout accepter
                </button>
                <button
                  onClick={handleRefuse}
                  className="px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold transition-all whitespace-nowrap"
                >
                  Tout refuser
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-6 py-3 rounded-lg border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-400 font-semibold transition-all whitespace-nowrap"
                >
                  Personnaliser
                </button>
              </div>
            </div>
          ) : (
            // Detailed view
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Gestion des cookies</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Fermer"
                  title="Fermer"
                >
                  <X className="text-slate-400" size={24} />
                </button>
              </div>

              <p className="text-slate-300 text-sm">
                Nous utilisons différents types de cookies pour vous offrir la meilleure expérience possible 
                sur Powalyze. Vous pouvez choisir les catégories que vous autorisez.
              </p>

              <div className="space-y-4">
                <CookieCategory
                  title="Cookies essentiels"
                  description="Nécessaires au fonctionnement du site: authentification, sécurité, préférences."
                  required
                  defaultChecked
                />
                <CookieCategory
                  title="Cookies analytiques"
                  description="Nous aident à comprendre comment vous utilisez le site pour l'améliorer (Google Analytics)."
                  defaultChecked
                />
                <CookieCategory
                  title="Cookies marketing"
                  description="Utilisés pour personnaliser les publicités et mesurer l'efficacité des campagnes."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={handleAcceptSelection}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold transition-all"
                >
                  Enregistrer mes choix
                </button>
                <button
                  onClick={handleAccept}
                  className="px-8 py-3 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold transition-all"
                >
                  Tout accepter
                </button>
                <a
                  href="/mentions-legales#cookies"
                  className="px-8 py-3 rounded-lg border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-400 font-semibold transition-all text-center"
                >
                  Politique cookies
                </a>
              </div>

              <p className="text-xs text-slate-500 pt-4 border-t border-slate-800">
                En cliquant sur "Tout accepter", vous consentez à l'utilisation de tous les cookies. 
                Vous pouvez modifier vos préférences à tout moment depuis le pied de page du site. 
                Pour plus d'informations, consultez notre{" "}
                <a href="/mentions-legales#rgpd" className="text-amber-400 hover:underline">
                  politique de confidentialité
                </a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CookieCategory({
  title,
  description,
  required = false,
  defaultChecked = false,
}: {
  title: string;
  description: string;
  required?: boolean;
  defaultChecked?: boolean;
}) {
  const [isChecked, setIsChecked] = useState(defaultChecked || required);

  return (
    <div className="flex items-start justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-semibold text-white">{title}</h4>
          {required && (
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300">
              Requis
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input
          type="checkbox"
          checked={isChecked}
          disabled={required}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="sr-only peer"
          aria-label={title}
          title={title}
        />
        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
      </label>
    </div>
  );
}
