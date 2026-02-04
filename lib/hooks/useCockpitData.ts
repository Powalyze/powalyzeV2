import { useEffect, useState } from 'react';

type Overview = {
  tenant_id: string;
  projects_active: number;
  strategic_alignment: number;
  budget_spent_total: number;
  budget_planned_total: number;
  budget_variance_total: number;
  decisions_pending: number;
  risks_critical: number;
  anomalies_unresolved: number;
  generated_at: string;
};

type Project = {
  id: string;
  name: string;
  owner: string;
  status: string;
  start_date: string;
  end_date: string;
  strategic_alignment_score: number;
  risk_level: string;
  budget_planned: number;
  budget_spent: number;
  capacity_needed: number;
  capacity_allocated: number;
  bu: string;
  country: string;
  tags: string[];
};

type Decision = {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: string;
  due_date: string;
  impact_area: string;
  priority: string;
  created_at: string;
};

type Anomaly = {
  id: string;
  source: string;
  entity_type: string;
  entity_id: string;
  description: string;
  severity: string;
  detected_at: string;
  resolved: boolean;
  resolution: string;
};

type TimelineEvent = {
  id: string;
  entity_type: string;
  entity_id: string;
  label: string;
  date: string;
  type: string;
};

export function useCockpitData(filters?: { status?: string; bu?: string; country?: string }) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.bu) params.append('bu', filters.bu);
        if (filters?.country) params.append('country', filters.country);

        const [o, p, d, a, t] = await Promise.all([
          fetch('/api/cockpit/overview').then(r => r.json()),
          fetch(`/api/cockpit/projects?${params}`).then(r => r.json()),
          fetch('/api/cockpit/decisions?status=pending').then(r => r.json()),
          fetch('/api/cockpit/anomalies?resolved=false').then(r => r.json()),
          fetch('/api/cockpit/timeline').then(r => r.json()),
        ]);

        setOverview(o);
        setProjects(p);
        setDecisions(d);
        setAnomalies(a);
        setTimeline(t);
      } catch (err: any) {
        setError(err.message);
        console.error('[useCockpitData] Error:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [filters?.status, filters?.bu, filters?.country]);

  return { overview, projects, decisions, anomalies, timeline, loading, error };
}
