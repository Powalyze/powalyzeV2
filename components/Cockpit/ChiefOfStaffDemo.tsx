"use client";
import React from "react";
import styles from "@/app/cockpit/chief.module.css";
import chiefActionsData from "@/locales/chief-actions.json";

/**
 * ChiefOfStaffDemo - Composant de démonstration PRO
 * 
 * ✅ TOUJOURS afficher les actions fixes
 * ✅ JAMAIS de données réelles
 * ✅ JAMAIS de fetch
 * ✅ JAMAIS de Supabase
 * ✅ Stable et prédictible pour les démos
 */

interface ChiefOfStaffDemoProps {
  language?: "fr" | "en" | "de" | "it" | "es" | "no";
}

export default function ChiefOfStaffDemo({ language = "fr" }: ChiefOfStaffDemoProps) {
  const t = chiefActionsData.chief;
  const lang = language;

  // Actions fixes pour la démo Pro
  const demoActions = [
    {
      title: t.demo_actions.optimize_q2.title[lang],
      impact: t.demo_actions.optimize_q2.impact[lang],
    },
    {
      title: t.demo_actions.identify_risks.title[lang],
      impact: t.demo_actions.identify_risks.impact[lang],
    },
    {
      title: t.demo_actions.prepare_committee.title[lang],
      impact: t.demo_actions.prepare_committee.impact[lang],
    },
    {
      title: t.demo_actions.simulate_resources.title[lang],
      impact: t.demo_actions.simulate_resources.impact[lang],
    },
    {
      title: t.demo_actions.reduce_costs.title[lang],
      impact: t.demo_actions.reduce_costs.impact[lang],
    },
    {
      title: t.demo_actions.accelerate_cloud.title[lang],
      impact: t.demo_actions.accelerate_cloud.impact[lang],
    },
  ];

  return (
    <section className={styles["section-chief"]}>
      <div className={`section-inner ${styles["chief-layout"]}`}>
        <div className={styles["chief-header"]}>
          <h2 className={`section-title ${styles["section-title"]}`}>
            {t.title[lang]}
          </h2>
          <p className={styles["chief-subtitle"]}>{t.subtitle[lang]}</p>
        </div>
        <div className={styles["chief-panel"]}>
          <div className={styles["chief-status"]}>
            <p className={styles["chief-status-label"]}>{t.analyzing[lang]}</p>
            <div className={styles["chief-status-metrics"]}>
              <div className="metric">
                <span className={styles["metric-label"]}>
                  {t.metrics.projects_analyzed[lang]}
                </span>
                <span className={styles["metric-value"]}>6</span>
              </div>
              <div className="metric">
                <span className={styles["metric-label"]}>
                  {t.metrics.risks_detected[lang]}
                </span>
                <span className={styles["metric-value"]}>3</span>
              </div>
              <div className="metric">
                <span className={styles["metric-label"]}>
                  {t.metrics.opportunities_identified[lang]}
                </span>
                <span className={styles["metric-value"]}>8</span>
              </div>
            </div>
            <div className={styles["chief-portfolio-tag"]}>
              {t.portfolio_status[lang]}
            </div>
          </div>
          <div className={styles["chief-actions"]}>
            <h3 className={styles["chief-actions-title"]}>
              {t.actions_title[lang]}
            </h3>
            <div className={styles["chief-actions-grid"]}>
              {demoActions.map((action, i) => (
                <div key={i} className={styles["chief-action-card"]}>
                  <p className={styles["chief-action-main"]}>{action.title}</p>
                  <p className={styles["chief-action-impact"]}>{action.impact}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles["chief-input"]}>
            <label htmlFor="chief-question-demo" className={styles["chief-input-label"]}>
              {t.question_placeholder[lang]}
            </label>
            <div className={styles["chief-input-row"]}>
              <input
                id="chief-question-demo"
                type="text"
                className={styles["chief-input-field"]}
                placeholder={t.question_placeholder[lang]}
              />
              <button className={`btn-primary ${styles["chief-input-button"]}`} title={t.send_button[lang]}>
                {t.send_button[lang]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
