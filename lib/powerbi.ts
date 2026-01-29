// lib/powerbi.ts
import 'server-only';

const TENANT_ID = process.env.POWERBI_TENANT_ID!;
const CLIENT_ID = process.env.POWERBI_CLIENT_ID!;
const CLIENT_SECRET = process.env.POWERBI_CLIENT_SECRET!;
const WORKSPACE_ID = process.env.POWERBI_WORKSPACE_ID!;
const SCOPE = process.env.POWERBI_SCOPE!;

const AUTH_URL = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
const POWERBI_API = 'https://api.powerbi.com/v1.0/myorg';

async function getAccessToken() {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: SCOPE,
    grant_type: 'client_credentials',
  });

  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    throw new Error('Failed to get Power BI access token');
  }

  const json = await res.json();
  return json.access_token as string;
}

export async function importPbix(file: Buffer, reportName: string) {
  const token = await getAccessToken();

  const url = `${POWERBI_API}/groups/${WORKSPACE_ID}/imports?datasetDisplayName=${encodeURIComponent(
    reportName,
  )}&nameConflict=CreateOrOverwrite`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
    },
    body: new Uint8Array(file),
  });

  if (!res.ok) {
    throw new Error('Failed to import PBIX into Power BI');
  }

  const json = await res.json();
  const importObj = json;
  const report = importObj.reports?.[0];
  const dataset = importObj.datasets?.[0];

  return {
    reportId: report?.id as string,
    datasetId: dataset?.id as string | undefined,
    workspaceId: WORKSPACE_ID,
  };
}

export async function generateEmbedToken(reportId: string, datasetId?: string) {
  const token = await getAccessToken();

  const url = `${POWERBI_API}/GenerateToken`;

  const body = {
    reports: [{ id: reportId, groupId: WORKSPACE_ID }],
    datasets: datasetId ? [{ id: datasetId }] : [],
    targetWorkspaces: [{ id: WORKSPACE_ID }],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessLevel: 'View',
      ...body,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate embed token');
  }

  const json = await res.json();
  return json.token as string;
}

export function getEmbedUrl(reportId: string) {
  return `${POWERBI_API}/groups/${WORKSPACE_ID}/reports/${reportId}`;
}
