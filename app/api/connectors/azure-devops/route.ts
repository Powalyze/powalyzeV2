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
    const { organization, project, pat } = await req.json();

    if (!organization || !project || !pat) {
      return NextResponse.json({ error: 'Missing Azure DevOps credentials' }, { status: 400 });
    }

    // Construire l'URL de l'API Azure DevOps
    const apiUrl = `https://dev.azure.com/${organization}/${project}/_apis/wit/wiql?api-version=7.0`;
    const auth = Buffer.from(`:${pat}`).toString('base64');

    // WIQL pour récupérer les work items
    const wiqlQuery = {
      query: "SELECT [System.Id], [System.Title], [System.State], [System.AssignedTo], [System.CreatedDate] FROM WorkItems WHERE [System.WorkItemType] = 'Epic' OR [System.WorkItemType] = 'Feature'"
    };

    const wiqlResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wiqlQuery),
    });

    if (!wiqlResponse.ok) {
      throw new Error('Failed to fetch Azure DevOps work items');
    }

    const wiqlData = await wiqlResponse.json();
    const workItemIds = wiqlData.workItems.map((wi: any) => wi.id);

    if (workItemIds.length === 0) {
      return NextResponse.json({ synced: 0, projects: [] });
    }

    // Récupérer les détails des work items
    const detailsUrl = `https://dev.azure.com/${organization}/${project}/_apis/wit/workitems?ids=${workItemIds.join(',')}&api-version=7.0`;
    const detailsResponse = await fetch(detailsUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!detailsResponse.ok) {
      throw new Error('Failed to fetch work item details');
    }

    const detailsData = await detailsResponse.json();
    const workItems = detailsData.value || [];

    // Mapper vers le format Powalyze
    const projects = workItems.map((wi: any) => ({
      name: wi.fields['System.Title'],
      description: wi.fields['System.Description'] || '',
      owner: wi.fields['System.AssignedTo']?.displayName || 'Non assigné',
      status: mapAzureStatus(wi.fields['System.State']),
      start_date: wi.fields['System.CreatedDate'],
      end_date: wi.fields['Microsoft.VSTS.Scheduling.TargetDate'],
      strategic_alignment_score: 70,
      budget_planned: 0,
      budget_spent: 0,
      bu: wi.fields['Custom.BU'] || 'Non défini',
      country: wi.fields['Custom.Country'] || 'CH',
      external_id: `ado-${wi.id}`,
      external_source: 'azure_devops',
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
      console.error('[Azure DevOps Connector] Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enregistrer le connecteur
    await supabase.from('connectors').upsert({
      name: `Azure DevOps - ${organization}/${project}`,
      type: 'azure_devops',
      status: 'active',
      last_sync: new Date().toISOString(),
      config: {
        organization,
        project,
        sync_count: projects.length
      },
      tenant_id: tenantId
    }, { onConflict: 'name,tenant_id' });

    return NextResponse.json({
      synced: projects.length,
      projects: data
    });
  } catch (error: any) {
    console.error('[Azure DevOps Connector] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function mapAzureStatus(state: string): string {
  const normalized = state?.toLowerCase().trim();
  const statusMap: Record<string, string> = {
    'new': 'planned',
    'active': 'in_progress',
    'resolved': 'done',
    'closed': 'done',
    'removed': 'cancelled',
  };
  return statusMap[normalized] || 'planned';
}
