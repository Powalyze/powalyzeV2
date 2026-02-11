import Link from "next/link";
import styles from "./StatCard.module.css";

interface StatCardProps {
  value: string;
  sub?: string;
  label: string;
  href: string;
}

export function StatCard({ value, sub, label, href }: StatCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.value}>{value}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
      <div className={styles.label}>{label}</div>
    </Link>
  );
}
