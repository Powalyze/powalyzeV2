import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const tenantId = req.headers.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
  }

  try {
    const { jiraUrl, email, apiToken, projectKey } = await req.json();

    if (!jiraUrl || !email || !apiToken || !projectKey) {
      return NextResponse.json({ error: 'Missing Jira credentials' }, { status: 400 });
    }

    // Construire l'URL de l'API Jira
    const apiUrl = `${jiraUrl}/rest/api/3/search`;
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

    // Récupérer les issues du projet
    const jiraResponse = await fetch(`${apiUrl}?jql=project=${projectKey}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!jiraResponse.ok) {
      throw new Error('Failed to fetch Jira issues');
    }

    const jiraData = await jiraResponse.json();
    const issues = jiraData.issues || [];

    // Mapper les issues Jira vers le format Powalyze
    const projects = issues.map((issue: any) => ({
      name: issue.fields.summary,
      description: issue.fields.description || '',
      owner: issue.fields.assignee?.displayName || 'Non assigné',
      status: mapJiraStatus(issue.fields.status?.name),
      start_date: issue.fields.created,
      end_date: issue.fields.duedate,
      strategic_alignment_score: 70, // Score par défaut
      budget_planned: 0, // Jira ne stocke pas le budget par défaut
      budget_spent: 0,
      bu: issue.fields.customfield_bu || 'Non défini',
      country: issue.fields.customfield_country || 'CH',
      external_id: issue.key,
      external_source: 'jira',
      tenant_id: tenantId
    }));

    // Upsert dans Supabase
    const { data, error } = await supabase
      .from('projects')
      .upsert(projects, { 
        onConflict: 'external_id,tenant_id',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('[Jira Connector] Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enregistrer le connecteur
    await supabase.from('connectors').upsert({
      name: `Jira - ${projectKey}`,
      type: 'jira',
      status: 'active',
      last_sync: new Date().toISOString(),
      config: {
        jira_url: jiraUrl,
        project_key: projectKey,
        sync_count: projects.length
      },
      tenant_id: tenantId
    }, { onConflict: 'name,tenant_id' });

    return NextResponse.json({
      synced: projects.length,
      projects: data
    });
  } catch (error: any) {
    console.error('[Jira Connector] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function mapJiraStatus(status: string): string {
  const normalized = status?.toLowerCase().trim();
  const statusMap: Record<string, string> = {
    'to do': 'planned',
    'in progress': 'in_progress',
    'done': 'done',
    'closed': 'done',
    'blocked': 'on_hold',
    'on hold': 'on_hold',
  };
  return statusMap[normalized] || 'planned';
}
