import Link from "next/link";
import styles from "./ExecutiveStatsBlock.module.css";

export function ExecutiveStatsBlock() {
  return (
    <Link href="/cockpit/analytics" className={styles.block}>
      <div className={styles.row}>
        <div className={styles.item}>
          <div className={styles.value}>87%</div>
          <div className={styles.sub}>+5% ce mois</div>
          <div className={styles.label}>Santé portfolio</div>
        </div>

        <div className={styles.item}>
          <div className={styles.value}>12</div>
          <div className={styles.sub}>3 en cours</div>
          <div className={styles.label}>Projets actifs</div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.item}>
          <div className={styles.value}>8</div>
          <div className={styles.sub}>2 critiques</div>
          <div className={styles.label}>Risques actifs</div>
        </div>

        <div className={styles.item}>
          <div className={styles.value}>45 pts/sprint</div>
          <div className={styles.label}>Vélocité moyenne</div>
        </div>
      </div>
    </Link>
  );
}
