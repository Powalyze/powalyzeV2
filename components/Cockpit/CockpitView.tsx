// ============================================================================
// CockpitView - Composant principal du cockpit (Pro et Demo)
// ============================================================================

import CockpitKpis from './CockpitKpis';
import CockpitTable from './CockpitTable';
import { getProCockpitData, getDemoCockpitData } from '@/lib/cockpit';
import type { CockpitData } from '@/lib/types-saas';

type Props =
  | { mode: 'pro'; userId: string; demoOrg?: never }
  | { mode: 'demo'; userId?: never; demoOrg: CockpitData };

export default async function CockpitView(props: Props) {
  const data =
    props.mode === 'pro'
      ? await getProCockpitData(props.userId)
      : await getDemoCockpitData(props.demoOrg);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">{data.organisation.name}</h1>
        <p className="text-slate-400 mb-6">
          {props.mode === 'pro' ? '✅ Mode Pro – Données réelles' : '🎯 Mode Demo – Données d\'exemple'}
        </p>
      </div>
      <div className="px-8 py-6 space-y-6">
        <CockpitKpis items={data.items} />
        <CockpitTable items={data.items} mode={props.mode} />
      </div>
    </div>
  );
}
