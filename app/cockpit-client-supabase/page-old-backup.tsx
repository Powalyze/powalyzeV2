// ============================================================
// POWALYZE COCKPIT CLIENT PAGE — SUPABASE VERSION
// /app/cockpit-client/page.tsx
// ============================================================

'use client';

import React, { useEffect, useState } from 'react';
import { KpiCard } from '@/lib/cockpit-components';
import { POWALYZE_BRAND } from '@/lib/cockpit-types';
import type {
  CockpitKPI,
  GovernanceSignal,
  Scenario,
  ExecutiveStory,
  Risk,
  Decision,
  Integration,
  Project,
  TeamMember,
  GovernancePillar,
  GovernanceHorizon,
  RiskLevel,
  TeamRole,
  IntegrationType,
  AiInsightResponse,
} from '@/lib/cockpit-types';

type CockpitClientState = {
  loading: boolean;
  error?: string;
  kpis: CockpitKPI[];
  signals: GovernanceSignal[];
  scenarios: Scenario[];
  stories: ExecutiveStory[];
  risks: Risk[];
  decisions: Decision[];
  integrations: Integration[];
  projects: Project[];
  team: TeamMember[];
  aiLoading: boolean;
  aiStory?: ExecutiveStory;
};

const initialState: CockpitClientState = {
  loading: true,
  kpis: [],
  signals: [],
  scenarios: [],
  stories: [],
  risks: [],
  decisions: [],
  integrations: [],
  projects: [],
  team: [],
  aiLoading: false,
};

type CockpitClientProps = {
  organizationId: string;
};

function CockpitClientPage({ organizationId }: CockpitClientProps) {
  const [state, setState] = useState<CockpitClientState>(initialState);

  const [aiContext, setAiContext] = useState('');
  const [aiHorizon, setAiHorizon] = useState<GovernanceHorizon>('S1');
  const [aiPillars, setAiPillars] = useState<GovernancePillar[]>(['Finance', 'People', 'Clients']);

  const [newRisk, setNewRisk] = useState<{
    title: string;
    description: string;
    level: RiskLevel;
    probability: number;
    impact: number;
  }>({
    title: '',
    description: '',
    level: 'medium',
    probability: 0.5,
    impact: 0.5,
  });

  const [newDecision, setNewDecision] = useState<{
    title: string;
    description: string;
    committee: string;
    date: string;
    impacts: string;
  }>({
    title: '',
    description: '',
    committee: '',
    date: '',
    impacts: '',
  });

  const [newProject, setNewProject] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });

  const [invite, setInvite] = useState<{
    email: string;
    fullName: string;
    role: TeamRole;
  }>({
    email: '',
    fullName: '',
    role: 'member',
  });

  const [newIntegration, setNewIntegration] = useState<{
    type: IntegrationType;
    name: string;
  }>({
    type: 'powerbi',
    name: '',
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/cockpit?organizationId=${organizationId}`);
        const text = await res.text();
        console.log('[Cockpit Client] Response status:', res.status);
        console.log('[Cockpit Client] Response text:', text);
        
        if (!res.ok) {
          const errorMsg = `API Error (${res.status}): ${text}`;
          console.error('[Cockpit Client] Error:', errorMsg);
          throw new Error(errorMsg);
        }
        
        const data = JSON.parse(text);
        console.log('[Cockpit Client] Data loaded:', {
          kpis: data.kpis?.length,
          projects: data.projects?.length,
          risks: data.risks?.length,
        });
        
        if (cancelled) return;
        setState((s) => ({
          ...s,
          loading: false,
          kpis: data.kpis || [],
          signals: data.signals || [],
          scenarios: data.scenarios || [],
          stories: data.stories || [],
          risks: data.risks || [],
          decisions: data.decisions || [],
          integrations: data.integrations || [],
          projects: data.projects || [],
          team: data.team || [],
        }));
      } catch (e: any) {
        console.error('[Cockpit Client] Exception:', e);
        if (cancelled) return;
        setState((s) => ({
          ...s,
          loading: false,
          error: e.message ?? 'Erreur inconnue',
        }));
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  async function handleGenerateStory() {
    setState((s) => ({ ...s, aiLoading: true }));
    try {
      const res = await fetch('/api/ai/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: aiContext,
          focusPillars: aiPillars,
          horizon: aiHorizon,
          language: 'fr',
          organizationId,
        }),
      });
      if (!res.ok) throw new Error('Erreur IA');
      const data: AiInsightResponse = await res.json();
      setState((s) => ({
        ...s,
        aiLoading: false,
        aiStory: data.story,
        signals: mergeSignals(s.signals, data.signals),
        scenarios: mergeScenarios(s.scenarios, data.scenarios),
        stories: [data.story, ...s.stories],
      }));
    } catch (e: any) {
      setState((s) => ({
        ...s,
        aiLoading: false,
        error: e.message ?? 'Erreur IA',
      }));
    }
  }

  async function handleCreateRisk() {
    try {
      const res = await fetch('/api/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          title: newRisk.title,
          description: newRisk.description,
          level: newRisk.level,
          probability: newRisk.probability,
          impact: newRisk.impact,
        }),
      });
      if (!res.ok) throw new Error('Erreur création risque');
      const risk: Risk = await res.json();
      setState((s) => ({ ...s, risks: [risk, ...s.risks] }));
      setNewRisk({
        title: '',
        description: '',
        level: 'medium',
        probability: 0.5,
        impact: 0.5,
      });
    } catch (e: any) {
      setState((s) => ({ ...s, error: e.message ?? 'Erreur création risque' }));
    }
  }

  async function handleInviteMember() {
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          invite,
        }),
      });
      if (!res.ok) throw new Error('Erreur invitation');
      const member: TeamMember = await res.json();
      setState((s) => ({ ...s, team: [...s.team, member] }));
      setInvite({ email: '', fullName: '', role: 'member' });
    } catch (e: any) {
      setState((s) => ({ ...s, error: e.message ?? 'Erreur invitation' }));
    }
  }

  async function handleUpdateMemberRole(memberId: string, role: TeamRole) {
    try {
      const res = await fetch('/api/team/member', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId: memberId, role }),
      });
      if (!res.ok) throw new Error('Erreur mise à jour rôle');
      const updated: TeamMember = await res.json();
      setState((s) => ({
        ...s,
        team: s.team.map((m) => (m.id === updated.id ? updated : m)),
      }));
    } catch (e: any) {
      setState((s) => ({ ...s, error: e.message ?? 'Erreur mise à jour rôle' }));
    }
  }

  async function handleDeleteMember(memberId: string) {
    try {
      const res = await fetch(`/api/team/member?membershipId=${memberId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur suppression membre');
      setState((s) => ({
        ...s,
        team: s.team.filter((m) => m.id !== memberId),
      }));
    } catch (e: any) {
      setState((s) => ({ ...s, error: e.message ?? 'Erreur suppression membre' }));
    }
  }

  async function handleCreateDecision() {
    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          ...newDecision,
        }),
      });
      if (!res.ok) throw new Error('Erreur création décision');
      const decision: Decision = await res.json();
      setState((s) => ({ ...s, decisions: [decision, ...s.decisions] }));
      setNewDecision({
        title: '',
        description: '',
        committee: '',
        date: '',
        impacts: '',
      });
    } catch (e: any) {
      setState((s) => ({ ...s, error: e.message ?? 'Erreur création décision' }));
    }
  }

  async function handleCreateProject() {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          ...newProject,
        }),
      });
      if (!res.ok) throw new Error('Erreur création projet');
      const project: Project = await res.json();
      setState((s) => ({ ...s, projects: [project, ...s.projects] }));
      setNewProject({ name: '', description: '' });
    } catch (e: any) {
      setState((s) => ({ ...s, error: e.message ?? 'Erreur création projet' }));
    }
  }

  async function handleCreateIntegration() {
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          type: newIntegration.type,
          name: newIntegration.name,
        }),
      });
      if (!res.ok) throw new Error('Erreur création intégration');
      const integration: Integration = await res.json();
      setState((s) => ({ ...s, integrations: [integration, ...s.integrations] }));
      setNewIntegration({ type: 'powerbi', name: '' });
    } catch (e: any) {
      setState((s) => ({ ...s, error: e.message ?? 'Erreur création intégration' }));
    }
  }

  async function handleExport(type: 'projects' | 'decisions' | 'risks') {
    try {
      const url = `/api/reports/export?organizationId=${organizationId}&type=${type}&format=csv`;
      window.open(url, '_blank');
    } catch (e: any) {
      setState((s) => ({ ...s, error: e.message ?? 'Erreur export' }));
    }
  }

  function togglePillar(pillar: GovernancePillar) {
    setAiPillars((prev) =>
      prev.includes(pillar) ? prev.filter((p) => p !== pillar) : [...prev, pillar],
    );
  }

  if (state.loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>Chargement du cockpit…</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>
          <h1 style={styles.h1}>Powalyze Cockpit Client</h1>
          <p style={styles.errorText}>Une erreur est survenue : {state.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.brandBlock}>
          <div style={styles.brandLogoCircle}>P</div>
          <div>
            <div style={styles.brandTitle}>Powalyze Cockpit Client</div>
            <div style={styles.brandSubtitle}>Accès Pro · Structure réelle · Données Supabase</div>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button
            style={styles.headerTag}
            onClick={() => {
              window.location.href = '/cockpit';
            }}
          >
            Retour Cockpit
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Colonne gauche : KPIs, Risques, Projets */}
        <section style={styles.leftColumn}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Vue exécutive</h2>
              <span style={styles.panelSubtitle}>KPIs & Projets</span>
            </div>
            <div style={styles.kpiRow}>
              {state.kpis.map((kpi) => (
                <KpiCard key={kpi.id} kpi={kpi} />
              ))}
              {state.kpis.length === 0 && (
                <div style={styles.emptyState}>Aucun KPI pour l&apos;instant.</div>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={styles.subSectionHeader}>
                <span style={styles.subSectionTitle}>Projets</span>
                <button style={styles.smallButton} onClick={handleCreateProject}>
                  + Créer
                </button>
              </div>
              <div style={styles.inlineFormRow}>
                <input
                  style={styles.input}
                  placeholder="Nom du projet"
                  value={newProject.name}
                  onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))}
                />
                <input
                  style={styles.input}
                  placeholder="Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <ul style={styles.simpleList}>
                {state.projects.map((p) => (
                  <li key={p.id} style={styles.simpleListItem}>
                    <span>{p.name}</span>
                    <span style={styles.simpleListItemStatus}>{p.status}</span>
                  </li>
                ))}
                {state.projects.length === 0 && (
                  <li style={styles.emptyState}>Aucun projet pour l&apos;instant.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Risques */}
          <div style={{ ...styles.panel, marginTop: 16 }}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Risques</h2>
              <span style={styles.panelSubtitle}>{state.risks.length} risques</span>
            </div>
            <div style={styles.inlineFormColumn}>
              <input
                style={styles.input}
                placeholder="Titre du risque"
                value={newRisk.title}
                onChange={(e) => setNewRisk((r) => ({ ...r, title: e.target.value }))}
              />
              <textarea
                style={styles.textarea}
                placeholder="Description"
                value={newRisk.description}
                onChange={(e) => setNewRisk((r) => ({ ...r, description: e.target.value }))}
              />
              <div style={styles.inlineFormRow}>
                <select
                  style={styles.select}
                  value={newRisk.level}
                  onChange={(e) =>
                    setNewRisk((r) => ({ ...r, level: e.target.value as RiskLevel }))
                  }
                >
                  <option value="low">Faible</option>
                  <option value="medium">Modéré</option>
                  <option value="high">Élevé</option>
                </select>
                <input
                  style={styles.input}
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={newRisk.probability}
                  onChange={(e) =>
                    setNewRisk((r) => ({ ...r, probability: Number(e.target.value) }))
                  }
                  placeholder="Probabilité (0–1)"
                />
                <input
                  style={styles.input}
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={newRisk.impact}
                  onChange={(e) =>
                    setNewRisk((r) => ({ ...r, impact: Number(e.target.value) }))
                  }
                  placeholder="Impact (0–1)"
                />
                <button style={styles.smallButton} onClick={handleCreateRisk}>
                  Créer un risque
                </button>
              </div>
            </div>
            <ul style={styles.simpleList}>
              {state.risks.map((r) => (
                <li key={r.id} style={styles.simpleListItem}>
                  <div>
                    <div>{r.title}</div>
                    <div style={styles.simpleListItemSub}>{r.description}</div>
                  </div>
                  <div style={styles.simpleListItemStatus}>{r.level}</div>
                </li>
              ))}
              {state.risks.length === 0 && (
                <li style={styles.emptyState}>Aucun risque pour l&apos;instant.</li>
              )}
            </ul>
          </div>
        </section>

        {/* Colonne droite : IA, Décisions, Équipe, Intégrations, Exports */}
        <section style={styles.rightColumn}>
          {/* IA + Décisions */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Narration & Décisions</h2>
              <span style={styles.panelSubtitle}>IA + Journal des décisions</span>
            </div>

            {/* IA */}
            <div style={styles.aiForm}>
              <label style={styles.label}>Contexte exécutif</label>
              <textarea
                style={styles.textarea}
                placeholder="Ex: Tension trésorerie, croissance Allemagne, rotation RH COMEX…"
                value={aiContext}
                onChange={(e) => setAiContext(e.target.value)}
              />
              <div style={styles.aiFormRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Horizon</label>
                  <div style={styles.horizonRow}>
                    {(['S1', 'S2', 'S3'] as GovernanceHorizon[]).map((h) => (
                      <button
                        key={h}
                        style={{
                          ...styles.horizonChip,
                          ...(aiHorizon === h ? styles.horizonChipActive : {}),
                        }}
                        onClick={() => setAiHorizon(h)}
                        type="button"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ flex: 2 }}>
                  <label style={styles.label}>Piliers</label>
                  <div style={styles.pillarRow}>
                    {(['Finance', 'People', 'Clients', 'Operations', 'Innovation'] as GovernancePillar[]).map(
                      (pillar) => (
                        <button
                          key={pillar}
                          style={{
                            ...styles.pillarChip,
                            ...(aiPillars.includes(pillar) ? styles.pillarChipActive : {}),
                          }}
                          onClick={() => togglePillar(pillar)}
                          type="button"
                        >
                          {pillar}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
              <button
                style={{
                  ...styles.primaryButton,
                  ...(state.aiLoading ? styles.primaryButtonDisabled : {}),
                }}
                onClick={handleGenerateStory}
                disabled={state.aiLoading}
                type="button"
              >
                {state.aiLoading ? 'Génération en cours…' : 'Générer l&apos;histoire exécutive'}
              </button>
            </div>

            {state.aiStory && (
              <div style={styles.storyBlock}>
                <div style={styles.storyHeader}>
                  <span style={styles.storyBadge}>IA Powalyze</span>
                  <span style={styles.storyHorizon}>Horizon {state.aiStory.horizon}</span>
                </div>
                <h3 style={styles.storyTitle}>{state.aiStory.title}</h3>
                <p style={styles.storyText}>{state.aiStory.narrative}</p>
                {state.aiStory.recommendedNextSteps?.length > 0 && (
                  <div style={styles.storySteps}>
                    <div style={styles.storyStepsTitle}>Prochaines étapes exécutives</div>
                    <ol style={styles.storyStepsList}>
                      {state.aiStory.recommendedNextSteps.map((step, idx) => (
                        <li key={idx} style={styles.storyStepItem}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Décisions */}
            <div style={{ marginTop: 16 }}>
              <div style={styles.subSectionHeader}>
                <span style={styles.subSectionTitle}>Journal des décisions</span>
                <button style={styles.smallButton} onClick={handleCreateDecision}>
                  + Créer
                </button>
              </div>
              <div style={styles.inlineFormColumn}>
                <input
                  style={styles.input}
                  placeholder="Titre"
                  value={newDecision.title}
                  onChange={(e) =>
                    setNewDecision((d) => ({
                      ...d,
                      title: e.target.value,
                    }))
                  }
                />
                <textarea
                  style={styles.textarea}
                  placeholder="Description"
                  value={newDecision.description}
                  onChange={(e) =>
                    setNewDecision((d) => ({
                      ...d,
                      description: e.target.value,
                    }))
                  }
                />
                <div style={styles.inlineFormRow}>
                  <input
                    style={styles.input}
                    placeholder="Comité"
                    value={newDecision.committee}
                    onChange={(e) =>
                      setNewDecision((d) => ({
                        ...d,
                        committee: e.target.value,
                      }))
                    }
                  />
                  <input
                    style={styles.input}
                    type="date"
                    value={newDecision.date}
                    onChange={(e) =>
                      setNewDecision((d) => ({
                        ...d,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>
                <textarea
                  style={styles.textarea}
                  placeholder="Impacts"
                  value={newDecision.impacts}
                  onChange={(e) =>
                    setNewDecision((d) => ({
                      ...d,
                      impacts: e.target.value,
                    }))
                  }
                />
              </div>
              <ul style={styles.simpleList}>
                {state.decisions.map((dec) => (
                  <li key={dec.id} style={styles.simpleListItem}>
                    <div>
                      <div>{dec.title}</div>
                      <div style={styles.simpleListItemSub}>
                        {dec.committee} · {dec.date}
                      </div>
                    </div>
                    <div style={styles.simpleListItemStatus}>{dec.status}</div>
                  </li>
                ))}
                {state.decisions.length === 0 && (
                  <li style={styles.emptyState}>Aucune décision pour l&apos;instant.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Équipe, Intégrations, Exports */}
          <div style={{ ...styles.panel, marginTop: 16 }}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Équipe & Intégrations</h2>
              <span style={styles.panelSubtitle}>Gestion des accès & connecteurs</span>
            </div>

            {/* Équipe */}
            <div>
              <div style={styles.subSectionHeader}>
                <span style={styles.subSectionTitle}>Équipe</span>
              </div>
              <div style={styles.inlineFormRow}>
                <input
                  style={styles.input}
                  placeholder="Email"
                  value={invite.email}
                  onChange={(e) => setInvite((i) => ({ ...i, email: e.target.value }))}
                />
                <input
                  style={styles.input}
                  placeholder="Nom complet"
                  value={invite.fullName}
                  onChange={(e) => setInvite((i) => ({ ...i, fullName: e.target.value }))}
                />
                <select
                  style={styles.select}
                  value={invite.role}
                  onChange={(e) =>
                    setInvite((i) => ({ ...i, role: e.target.value as TeamRole }))
                  }
                >
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                  <option value="member">Membre</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button style={styles.smallButton} onClick={handleInviteMember}>
                  Inviter
                </button>
              </div>
              <ul style={styles.simpleList}>
                {state.team.map((m) => (
                  <li key={m.id} style={styles.simpleListItem}>
                    <div>
                      <div>{m.fullName ?? m.email}</div>
                      <div style={styles.simpleListItemSub}>{m.email}</div>
                    </div>
                    <div style={styles.simpleListItemRight}>
                      <select
                        style={styles.selectSmall}
                        value={m.role}
                        onChange={(e) =>
                          handleUpdateMemberRole(m.id, e.target.value as TeamRole)
                        }
                      >
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                        <option value="member">Membre</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <button
                        style={styles.smallDangerButton}
                        onClick={() => handleDeleteMember(m.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                ))}
                {state.team.length === 0 && (
                  <li style={styles.emptyState}>Aucun membre pour l&apos;instant.</li>
                )}
              </ul>
            </div>

            {/* Intégrations */}
            <div style={{ marginTop: 16 }}>
              <div style={styles.subSectionHeader}>
                <span style={styles.subSectionTitle}>Connecteurs & Intégrations</span>
              </div>
              <div style={styles.inlineFormRow}>
                <select
                  style={styles.select}
                  value={newIntegration.type}
                  onChange={(e) =>
                    setNewIntegration((i) => ({
                      ...i,
                      type: e.target.value as IntegrationType,
                    }))
                  }
                >
                  <option value="powerbi">Power BI</option>
                  <option value="jira">Jira</option>
                  <option value="sharepoint">SharePoint</option>
                  <option value="sql">SQL</option>
                  <option value="custom">Custom</option>
                </select>
                <input
                  style={styles.input}
                  placeholder="Nom du connecteur"
                  value={newIntegration.name}
                  onChange={(e) =>
                    setNewIntegration((i) => ({ ...i, name: e.target.value }))
                  }
                />
                <button style={styles.smallButton} onClick={handleCreateIntegration}>
                  Ajouter
                </button>
              </div>
              <ul style={styles.simpleList}>
                {state.integrations.map((int) => (
                  <li key={int.id} style={styles.simpleListItem}>
                    <div>
                      <div>{int.name}</div>
                      <div style={styles.simpleListItemSub}>{int.type}</div>
                    </div>
                    <div style={styles.simpleListItemStatus}>{int.status}</div>
                  </li>
                ))}
                {state.integrations.length === 0 && (
                  <li style={styles.emptyState}>Aucune intégration configurée.</li>
                )}
              </ul>
            </div>

            {/* Exports */}
            <div style={{ marginTop: 16 }}>
              <div style={styles.subSectionHeader}>
                <span style={styles.subSectionTitle}>Rapports & Exports</span>
              </div>
              <div style={styles.inlineFormRow}>
                <button
                  style={styles.smallButton}
                  onClick={() => handleExport('projects')}
                >
                  Export Projets
                </button>
                <button
                  style={styles.smallButton}
                  onClick={() => handleExport('decisions')}
                >
                  Export Décisions
                </button>
                <button style={styles.smallButton} onClick={() => handleExport('risks')}>
                  Export Risques
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ============================================================
// SERVER WRAPPER
// ============================================================

export default function CockpitClientPageWrapper() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer l'organizationId depuis sessionStorage
    const orgId = sessionStorage.getItem('powalyze_client_org');
    if (orgId) {
      setOrganizationId(orgId);
    } else {
      // Fallback vers DEMO si pas d'org ID
      setOrganizationId(process.env.NEXT_PUBLIC_DEMO_ORG_ID || '00000000-0000-0000-0000-000000000000');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!organizationId) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Erreur: ID organisation manquant</p>
      </div>
    );
  }

  return <CockpitClientPage organizationId={organizationId} />;
}

// ============================================================
// MERGE HELPERS
// ============================================================

function mergeSignals(existing: GovernanceSignal[], incoming: GovernanceSignal[]): GovernanceSignal[] {
  const map = new Map<string, GovernanceSignal>();
  for (const s of existing) map.set(s.id, s);
  for (const s of incoming) map.set(s.id, s);
  return Array.from(map.values()).sort((a, b) => {
    const riskOrder: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };
    return riskOrder[a.risk] - riskOrder[b.risk];
  });
}

function mergeScenarios(existing: Scenario[], incoming: Scenario[]): Scenario[] {
  const map = new Map<string, Scenario>();
  for (const s of existing) map.set(s.id, s);
  for (const s of incoming) map.set(s.id, s);
  return Array.from(map.values()).sort((a, b) => b.impactScore - a.impactScore);
}

// ============================================================
// STYLES INLINE — PREMIUM MINIMAL
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: `radial-gradient(circle at top, #101522 0, ${POWALYZE_BRAND.bgDark} 55%, #020308 100%)`,
    color: POWALYZE_BRAND.textMain,
    padding: '24px 32px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, system-ui, -system-ui, "SF Pro Text", "Inter", sans-serif',
    boxSizing: 'border-box',
  },
  loading: {
    color: POWALYZE_BRAND.textSoft,
    fontSize: 16,
  },
  errorBox: {
    borderRadius: 16,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    padding: 24,
    maxWidth: 480,
    background: 'rgba(10, 12, 20, 0.9)',
  },
  errorText: {
    color: POWALYZE_BRAND.accentRed,
    marginTop: 8,
    fontSize: 14,
  },
  h1: {
    fontSize: 24,
    fontWeight: 600,
    color: POWALYZE_BRAND.primaryGold,
    margin: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brandBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  brandLogoCircle: {
    width: 32,
    height: 32,
    borderRadius: '999px',
    background: `linear-gradient(135deg, ${POWALYZE_BRAND.primaryGold}, #F5E6B8)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#05070B',
    fontWeight: 700,
    fontSize: 16,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: POWALYZE_BRAND.primaryGold,
  },
  brandSubtitle: {
    fontSize: 12,
    color: POWALYZE_BRAND.textSoft,
  },
  headerRight: {
    display: 'flex',
    gap: 8,
  },
  headerTag: {
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 999,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    color: POWALYZE_BRAND.textSoft,
    background: 'rgba(5, 7, 11, 0.7)',
    cursor: 'pointer',
  },
  main: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
    gap: 16,
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  panel: {
    borderRadius: 18,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    background:
      'linear-gradient(145deg, rgba(10,14,24,0.96), rgba(5,7,11,0.98)) border-box, linear-gradient(145deg, rgba(212,175,55,0.18), rgba(27,59,95,0.4)) border-box',
    padding: 18,
    boxShadow: '0 18px 40px rgba(0,0,0,0.55)',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  panelTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: 0.02,
    color: POWALYZE_BRAND.primaryGold,
  },
  panelSubtitle: {
    fontSize: 11,
    color: POWALYZE_BRAND.textSoft,
  },
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 10,
  },
  emptyState: {
    fontSize: 11,
    color: POWALYZE_BRAND.textSoft,
    padding: 8,
  },
  aiForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    color: POWALYZE_BRAND.textSoft,
  },
  textarea: {
    width: '100%',
    minHeight: 80,
    borderRadius: 10,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    background: 'rgba(5,7,11,0.9)',
    color: POWALYZE_BRAND.textMain,
    fontSize: 12,
    padding: 8,
    resize: 'vertical',
    outline: 'none',
  },
  aiFormRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  horizonRow: {
    display: 'flex',
    gap: 6,
    marginTop: 4,
  },
  horizonChip: {
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 999,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    background: 'transparent',
    color: POWALYZE_BRAND.textSoft,
    cursor: 'pointer',
  },
  horizonChipActive: {
    borderColor: POWALYZE_BRAND.primaryGold,
    color: POWALYZE_BRAND.primaryGold,
    background: 'rgba(212,175,55,0.08)',
  },
  pillarRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  pillarChip: {
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 999,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    background: 'transparent',
    color: POWALYZE_BRAND.textSoft,
    cursor: 'pointer',
  },
  pillarChipActive: {
    borderColor: POWALYZE_BRAND.primaryBlue,
    color: POWALYZE_BRAND.primaryBlue,
    background: 'rgba(27,59,95,0.16)',
  },
  primaryButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    padding: '7px 16px',
    borderRadius: 999,
    border: 'none',
    background: `linear-gradient(135deg, ${POWALYZE_BRAND.primaryGold}, #F5E6B8)`,
    color: '#05070B',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
    cursor: 'default',
  },
  storyBlock: {
    marginTop: 10,
    borderRadius: 12,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    padding: 10,
    background: 'radial-gradient(circle at top left, #151B2A 0, #05070B 70%)',
  },
  storyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyBadge: {
    fontSize: 10,
    padding: '2px 8px',
    borderRadius: 999,
    background: 'rgba(212,175,55,0.12)',
    color: POWALYZE_BRAND.primaryGold,
  },
  storyHorizon: {
    fontSize: 10,
    color: POWALYZE_BRAND.textSoft,
  },
  storyTitle: {
    margin: '4px 0 4px',
    fontSize: 14,
    fontWeight: 500,
  },
  storyText: {
    fontSize: 12,
    color: POWALYZE_BRAND.textMain,
  },
  storySteps: {
    marginTop: 8,
  },
  storyStepsTitle: {
    fontSize: 11,
    color: POWALYZE_BRAND.textSoft,
    marginBottom: 4,
  },
  storyStepsList: {
    margin: 0,
    paddingLeft: 16,
  },
  storyStepItem: {
    fontSize: 12,
    marginBottom: 2,
  },
  subSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: 500,
  },
  smallButton: {
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 999,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    background: 'rgba(5,7,11,0.9)',
    color: POWALYZE_BRAND.textMain,
    cursor: 'pointer',
  },
  smallDangerButton: {
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 999,
    border: `1px solid rgba(255,92,92,0.7)`,
    background: 'rgba(40,10,10,0.9)',
    color: POWALYZE_BRAND.accentRed,
    cursor: 'pointer',
  },
  inlineFormRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  inlineFormColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    minWidth: 120,
    borderRadius: 8,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    background: 'rgba(5,7,11,0.9)',
    color: POWALYZE_BRAND.textMain,
    fontSize: 12,
    padding: '6px 8px',
    outline: 'none',
  },
  select: {
    minWidth: 120,
    borderRadius: 8,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    background: 'rgba(5,7,11,0.9)',
    color: POWALYZE_BRAND.textMain,
    fontSize: 12,
    padding: '6px 8px',
    outline: 'none',
  },
  selectSmall: {
    minWidth: 90,
    borderRadius: 8,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    background: 'rgba(5,7,11,0.9)',
    color: POWALYZE_BRAND.textMain,
    fontSize: 11,
    padding: '4px 6px',
    outline: 'none',
  },
  simpleList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    marginTop: 6,
  },
  simpleListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 8px',
    borderRadius: 8,
    border: `1px solid ${POWALYZE_BRAND.borderSoft}`,
    marginBottom: 4,
    background: 'rgba(5,7,11,0.8)',
  },
  simpleListItemSub: {
    fontSize: 11,
    color: POWALYZE_BRAND.textSoft,
  },
  simpleListItemStatus: {
    fontSize: 11,
    color: POWALYZE_BRAND.textSoft,
  },
  simpleListItemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
};

