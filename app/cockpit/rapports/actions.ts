// app/cockpit/rapports/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { importPbix, generateEmbedToken } from '@/lib/powerbi';

export async function importReport(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get('file') as File | null;
  const projectId = formData.get('projectId') as string | null;
  const reportName = formData.get('reportName') as string | null;

  if (!file || !reportName) {
    return { error: 'Fichier ou nom de rapport manquant' };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { reportId, datasetId, workspaceId } = await importPbix(
    buffer,
    reportName,
  );

  const { error } = await supabase.from('reports').insert({
    project_id: projectId,
    report_name: reportName,
    powerbi_report_id: reportId,
    powerbi_dataset_id: datasetId,
    powerbi_workspace_id: workspaceId,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function getReportEmbedConfig(reportId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('powerbi_report_id', reportId)
    .single();

  if (error || !data) {
    return { error: 'Rapport introuvable' };
  }

  const embedToken = await generateEmbedToken(
    data.powerbi_report_id,
    data.powerbi_dataset_id ?? undefined,
  );

  const embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${data.powerbi_report_id}&groupId=${data.powerbi_workspace_id}`;

  return {
    error: null,
    embedToken,
    embedUrl,
    reportId: data.powerbi_report_id,
  };
}

export async function listReports(projectId?: string) {
  const supabase = await createClient();

  let query = supabase.from('reports').select('*').order('created_at', {
    ascending: false,
  });

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message, reports: [] };
  }

  return { error: null, reports: data };
}
