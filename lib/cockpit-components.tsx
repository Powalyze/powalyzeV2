// ============================================================
// POWALYZE COCKPIT CLIENT — UI COMPONENTS
// ============================================================

import React from 'react';
import { POWALYZE_BRAND, type CockpitKPI } from './cockpit-types';

type KpiCardProps = { kpi: CockpitKPI };

export function KpiCard({ kpi }: KpiCardProps) {
  const trendColor =
    kpi.trend === 'up'
      ? POWALYZE_BRAND.accentGreen
      : kpi.trend === 'down'
      ? POWALYZE_BRAND.accentRed
      : POWALYZE_BRAND.textSoft;

  const variationSign = kpi.variationPct > 0 ? '+' : '';
  const variationText = `${variationSign}${kpi.variationPct.toFixed(1)}%`;

  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiTopRow}>
        <span style={styles.kpiLabel}>{kpi.label}</span>
        <span style={styles.kpiHorizon}>{kpi.horizon}</span>
      </div>
      <div style={styles.kpiValueRow}>
        <span style={styles.kpiValue}>
          {kpi.value.toLocaleString('fr-FR')}
          {kpi.unit && <span style={styles.kpiUnit}> {kpi.unit}</span>}
        </span>
      </div>
      <div style={styles.kpiBottomRow}>
        <span style={{ ...styles.kpiTrend, color: trendColor }}>
          {kpi.trend === 'up' && '▲'}
          {kpi.trend === 'down' && '▼'}
          {kpi.trend === 'flat' && '■'} {variationText}
        </span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  kpiCard: {
    borderRadius: 14,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    padding: 10,
    background: 'radial-gradient(circle at top left, #151B2A 0, #05070B 70%)',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  kpiTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  kpiLabel: {
    fontSize: 11,
    color: POWALYZE_BRAND.textSoft,
  },
  kpiHorizon: {
    fontSize: 10,
    color: POWALYZE_BRAND.textSoft,
    opacity: 0.8,
  },
  kpiValueRow: {
    marginTop: 2,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 600,
  },
  kpiUnit: {
    fontSize: 11,
    color: POWALYZE_BRAND.textSoft,
    marginLeft: 4,
  },
  kpiBottomRow: {
    marginTop: 4,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiTrend: {
    fontSize: 11,
  },
};
