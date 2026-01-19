"use client";
import React from "react";
import styles from "@/app/cockpit/chief.module.css";
import chiefActionsData from "@/locales/chief-actions.json";
import { ChiefOfStaffState } from "@/lib/chiefOfStaffPrompt";

/**
 * ChiefOfStaffClient - Composant pour clients réels
 * 
 * ✅ TOUJOURS afficher les actions calculées par l'IA
 * ✅ JAMAIS les actions fixes
 * ✅ Dépend du store / Supabase / IA
 * ✅ Si aucune action → affiche message vide
 */

interface ChiefOfStaffClientProps {
  state: ChiefOfStaffState;
  language?: "fr" | "en" | "de" | "it" | "es" | "no";
  onSendQuestion?: (question: string) => void;
}

export default function ChiefOfStaffClient({
  state,
  language = "fr",
  onSendQuestion,
}: ChiefOfStaffClientProps) {
  const t = chiefActionsData.chief;
  const lang = language;
  const [question, setQuestion] = React.useState("");

  const handleSendQuestion = () => {
    if (question.trim() && onSendQuestion) {
      onSendQuestion(question);
      setQuestion("");
    }
  };

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
                <span className={styles["metric-value"]}>
                  {state.projectsAnalyzed}
                </span>
              </div>
              <div className="metric">
                <span className={styles["metric-label"]}>
                  {t.metrics.risks_detected[lang]}
                </span>
                <span className={styles["metric-value"]}>
                  {state.risksDetected}
                </span>
              </div>
              <div className="metric">
                <span className={styles["metric-label"]}>
                  {t.metrics.opportunities_identified[lang]}
                </span>
                <span className={styles["metric-value"]}>
                  {state.opportunitiesIdentified}
                </span>
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
              {!state.recommendedActions || state.recommendedActions.length === 0 ? (
                <div
                  className={`${styles["chief-action-card"]} ${styles["chief-action-card-disabled"]}`}
                >
                  <p className={styles["chief-action-main"]}>
                    {t.no_actions[lang]}
                  </p>
                  <p className={styles["chief-action-impact"]}>
                    {t.add_project_hint[lang]}
                  </p>
                </div>
              ) : (
                state.recommendedActions.map((action, i) => (
                  <div key={i} className={styles["chief-action-card"]}>
                    <p className={styles["chief-action-main"]}>{action}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className={styles["chief-input"]}>
            <label htmlFor="chief-question-client" className={styles["chief-input-label"]}>
              {t.question_placeholder[lang]}
            </label>
            <div className={styles["chief-input-row"]}>
              <input
                id="chief-question-client"
                type="text"
                className={styles["chief-input-field"]}
                placeholder={t.question_placeholder[lang]}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendQuestion()}
              />
              <button
                className={`btn-primary ${styles["chief-input-button"]}`}
                onClick={handleSendQuestion}
                title={t.send_button[lang]}
              >
                {t.send_button[lang]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
