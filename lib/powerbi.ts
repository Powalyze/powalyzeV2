import axios from 'axios';

interface PowerBIToken {
  token: string;
  expiration: string;
}

interface PowerBIConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  workspaceId: string;
  reportId: string;
}

const config: PowerBIConfig = {
  clientId: process.env.POWERBI_CLIENT_ID || '',
  clientSecret: process.env.POWERBI_CLIENT_SECRET || '',
  tenantId: process.env.POWERBI_TENANT_ID || '',
  workspaceId: process.env.POWERBI_WORKSPACE_ID || '',
  reportId: process.env.POWERBI_REPORT_ID || '',
};

export async function getAccessToken(): Promise<string> {
  const tokenEndpoint = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: 'https://analysis.windows.net/powerbi/api/.default',
    grant_type: 'client_credentials',
  });

  const response = await axios.post(tokenEndpoint, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data.access_token;
}

export async function getEmbedToken(reportId: string, datasetId: string): Promise<PowerBIToken> {
  const accessToken = await getAccessToken();
  
  const embedTokenEndpoint = `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/reports/${reportId}/GenerateToken`;
  
  const body = {
    accessLevel: 'View',
    datasetId: datasetId,
  };

  const response = await axios.post(embedTokenEndpoint, body, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  return {
    token: response.data.token,
    expiration: response.data.expiration,
  };
}

export { config as powerBIConfig };
