// PREMIUM VITRINE STRICTEMENT CONFORME AUX EXIGENCES FOURNIES
// (Section order, palette, typography, animations, mobile-first, no sidebar, no generic images)
// Ce fichier a été entièrement remplacé conformément à la structure premium demandée.
import React from "react";

export default function VitrinePage() {
  return (
    <div>
      {/* NAVBAR STATIQUE PREMIUM */}
      <nav className="navbar-premium bg-white text-slate-900 shadow-md py-3 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 font-bold text-lg">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="46" stroke="#C9A227" strokeWidth="4" />
              <path d="M30 55 L50 25 L70 55 L50 75 Z" fill="#C9A227" />
            </svg>
            Powalyze
          </a>
        </div>
        <ul className="flex gap-7 items-center text-base font-medium">
          <li><a href="#cockpit" className="hover:text-yellow-600 transition">Cockpit</a></li>
          <li><a href="#ia" className="hover:text-yellow-600 transition">IA Narrative</a></li>
          <li><a href="#modules" className="hover:text-yellow-600 transition">Services</a></li>
          <li><a href="#faq" className="hover:text-yellow-600 transition">FAQ</a></li>
          <li><a href="/pro" className="hover:text-yellow-600 transition">Pro</a></li>
        </ul>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 mr-2">FREN</span>
          <a href="/pro" className="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold shadow hover:bg-yellow-400 transition">Accès Client</a>
        </div>
      </nav>
      {/* ===================== HERO / VITRINE ===================== */}
      <section id="hero" className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Le cockpit exécutif qui pilote votre organisation
          </h1>
          <p className="hero-subtitle">
            Une plateforme de gouvernance narrative, alimentée par une IA native, qui transforme vos données,
            vos décisions et vos opérations en un système unifié, clair et actionnable.
          </p>
          <div className="hero-cta">
            <a href="#contact" className="btn-primary">Entrer dans le cockpit</a>
            <a href="#modules" className="btn-secondary">Découvrir les modules</a>
          </div>
        </div>
        {/* Bloc vidéo cockpit premium */}
        <div className="hero-video">
          {/* Remplace la source par ta vidéo cockpit */}
          <video autoPlay muted loop playsInline className="hero-video-element">
            <source src="/assets/video/cockpit-executif-powalyze.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo HTML5.
          </video>
          <div className="hero-video-overlay"></div>
        </div>
      </section>

      {/* ===================== SECTION 1 – COCKPIT UNIFIÉ ===================== */}
      <section id="cockpit" className="section section-cockpit">
        <div className="section-inner">
          <h2 className="section-title">
            Une seule plateforme. Une seule vérité. Une seule direction.
          </h2>
          <p className="section-text">
            Powalyze centralise vos données, vos projets, vos risques, vos équipes et vos décisions dans un cockpit unique,
            conçu pour les dirigeants exigeants. Chaque signal est contextualisé, chaque vue est alignée sur la réalité
            opérationnelle, chaque décision s’inscrit dans une trajectoire claire.
          </p>
        </div>
      </section>

      {/* ===================== SECTION 2 – IA NATIVE ===================== */}
      <section id="ia" className="section section-ia">
        <div className="section-inner">
          <h2 className="section-title">
            Votre copilote stratégique, toujours en avance
          </h2>
          <p className="section-text">
            L’IA intégrée analyse, contextualise et raconte votre organisation. Elle anticipe les dérives, propose des scénarios,
            alerte sur les risques et transforme chaque signal en action concrète. Vous ne consultez plus un simple tableau de bord :
            vous dialoguez avec un copilote exécutif.
          </p>
        </div>
      </section>

      {/* ===================== SECTION 3 – MODULES ===================== */}
      <section id="modules" className="section section-modules">
        <div className="section-inner">
          <h2 className="section-title">
            Des modules conçus pour la gouvernance moderne
          </h2>
          <div className="modules-grid">
            <div className="module-card">
              <h3 className="module-title">Pilotage stratégique</h3>
              <p className="module-text">
                Vision, objectifs, trajectoires et arbitrages réunis dans un cockpit unique, aligné sur vos priorités.
              </p>
            </div>
            <div className="module-card">
              <h3 className="module-title">Projets & opérations</h3>
              <p className="module-text">
                Suivi fin des initiatives, dépendances, charges et impacts, avec une lecture immédiate des points de tension.
              </p>
            </div>
            <div className="module-card">
              <h3 className="module-title">Risques & conformité</h3>
              <p className="module-text">
                Cartographie vivante des risques, plans d’actions, responsabilités et niveaux d’exposition en temps réel.
              </p>
            </div>
            <div className="module-card">
              <h3 className="module-title">Décisions & journal exécutif</h3>
              <p className="module-text">
                Historique structuré des décisions, rationales, impacts et suivis, pour une gouvernance traçable et assumée.
              </p>
            </div>
            <div className="module-card">
              <h3 className="module-title">Équipes & responsabilités</h3>
              <p className="module-text">
                Rôles, périmètres, ownership et alignement des équipes sur les enjeux stratégiques et opérationnels.
              </p>
            </div>
            <div className="module-card">
              <h3 className="module-title">Intégrations & automatisations</h3>
              <p className="module-text">
                Connexions natives à vos outils et flux de données, avec automatisations ciblées pour réduire la friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 4 – EXPÉRIENCE DIRIGEANTS ===================== */}
      <section id="experience" className="section section-experience">
        <div className="section-inner">
          <h2 className="section-title">
            Clarté. Vitesse. Maîtrise.
          </h2>
          <p className="section-text">
            Chaque écran, chaque interaction et chaque animation est pensé pour réduire le bruit et augmenter la précision
            décisionnelle. Powalyze offre une expérience tendue, minimaliste et exigeante, à la hauteur des comités de direction
            qu’il accompagne.
          </p>
        </div>
      </section>

      {/* ===================== SECTION 5 – CONTACT / FORMULAIRE ===================== */}
      <section id="contact" className="section section-contact">
        <div className="section-inner">
          <h2 className="section-title">
            Accédez au cockpit
          </h2>
          <p className="section-text">
            Décrivez votre contexte, vos enjeux et votre niveau de maturité. Nous vous montrons comment Powalyze peut devenir
            le cockpit exécutif de votre organisation.
          </p>

          <form
            action="https://formspree.io/f/xxxxxxxx"  // remplace par ton endpoint Formspree
            method="POST"
            className="contact-form"
          >
            <div className="form-row">
              <label htmlFor="name">Nom complet</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className="form-row">
              <label htmlFor="email">Email professionnel</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className="form-row">
              <label htmlFor="company">Organisation</label>
              <input type="text" id="company" name="company" />
            </div>

            <div className="form-row">
              <label htmlFor="message">Contexte & enjeux</label>
              <textarea id="message" name="message" rows={4} required></textarea>
            </div>

            <button type="submit" className="btn-primary">
              Entrer dans le cockpit
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

