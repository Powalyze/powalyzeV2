'use server';

/**
 * Actions Server pour Power BI Embedded
 * =====================================
 * Ces actions gèrent l'intégration complète avec l'API Power BI :
 * - Import de fichiers .pbix
 * - Génération de tokens d'embed sécurisés
 * - Gestion des rapports (CRUD)
 * - Export de rapports
 */

import { supabaseAdmin } from '@/lib/supabase';

// Types
interface PowerBIConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  workspaceId: string;
}

interface EmbedToken {
  token: string;
  tokenId: string;
  expiration: string;
}

interface PowerBIReport {
  id: string;
  name: string;
  webUrl: string;
  embedUrl: string;
  datasetId: string;
}

// Configuration Power BI (à remplir dans .env.local)
const getPowerBIConfig = (): PowerBIConfig => {
  const config = {
    clientId: process.env.POWERBI_CLIENT_ID || '',
    clientSecret: process.env.POWERBI_CLIENT_SECRET || '',
    tenantId: process.env.POWERBI_TENANT_ID || '',
    workspaceId: process.env.POWERBI_WORKSPACE_ID || ''
  };

  // Validation
  if (!config.clientId || !config.clientSecret || !config.tenantId || !config.workspaceId) {
    throw new Error('Configuration Power BI incomplète. Vérifiez les variables d\'environnement.');
  }

  return config;
};

/**
 * Obtenir un access token Azure AD pour l'API Power BI
 */
async function getAccessToken(): Promise<string> {
  const config = getPowerBIConfig();
  
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: 'https://analysis.windows.net/powerbi/api/.default'
  });

  const response = await fetch(
    `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur d'authentification Azure AD: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Importer un fichier .pbix dans Power BI
 * @param file - Fichier .pbix (FormData)
 * @param reportName - Nom du rapport
 * @param projectId - ID du projet Powalyze
 * @param organizationId - ID de l'organisation
 */
export async function importReport(
  fileBuffer: Buffer,
  reportName: string,
  projectId: string,
  organizationId: string
): Promise<{ success: boolean; reportId?: string; error?: string }> {
  try {
    const config = getPowerBIConfig();
    const accessToken = await getAccessToken();

    // 1. Upload du fichier .pbix vers Power BI
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: 'application/octet-stream' });
    formData.append('file', blob, `${reportName}.pbix`);

    const importResponse = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/imports?datasetDisplayName=${encodeURIComponent(reportName)}&nameConflict=CreateOrOverwrite`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      }
    );

    if (!importResponse.ok) {
      const error = await importResponse.text();
      throw new Error(`Erreur lors de l'import: ${error}`);
    }

    const importData = await importResponse.json();
    const importId = importData.id;

    // 2. Attendre que l'import soit terminé
    let report: PowerBIReport | null = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes

      const statusResponse = await fetch(
        `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/imports/${importId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        
        if (statusData.importState === 'Succeeded') {
          report = statusData.reports[0];
          break;
        } else if (statusData.importState === 'Failed') {
          throw new Error('L\'import du rapport a échoué dans Power BI');
        }
      }

      attempts++;
    }

    if (!report) {
      throw new Error('Timeout lors de l\'import du rapport');
    }

    // 3. Enregistrer dans Supabase
    const { data: dbReport, error: dbError } = await supabaseAdmin
      .from('powerbi_reports')
      .insert({
        project_id: projectId,
        organization_id: organizationId,
        report_name: reportName,
        powerbi_report_id: report.id,
        powerbi_dataset_id: report.datasetId,
        powerbi_workspace_id: config.workspaceId,
        file_size: fileBuffer.length,
        status: 'active',
        metadata: {
          embed_url: report.embedUrl,
          web_url: report.webUrl
        }
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Erreur Supabase: ${dbError.message}`);
    }

    return {
      success: true,
      reportId: dbReport.id
    };
  } catch (error) {
    console.error('❌ Error importing report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Générer un embed token pour afficher un rapport
 * @param reportId - ID du rapport dans Supabase
 */
export async function getEmbedToken(
  reportId: string
): Promise<{ success: boolean; embedUrl?: string; embedToken?: string; error?: string }> {
  try {
    const config = getPowerBIConfig();
    const accessToken = await getAccessToken();

    // 1. Récupérer les infos du rapport depuis Supabase
    const { data: report, error: dbError } = await supabaseAdmin
      .from('powerbi_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (dbError || !report) {
      throw new Error('Rapport introuvable');
    }

    // 2. Générer un embed token
    const tokenResponse = await fetch(
      'https://api.powerbi.com/v1.0/myorg/GenerateToken',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          datasets: [{ id: report.powerbi_dataset_id }],
          reports: [{ id: report.powerbi_report_id }],
          targetWorkspaces: [{ id: config.workspaceId }],
          identities: [],
          lifetimeInMinutes: 60 // Token valide 1 heure
        })
      }
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Erreur lors de la génération du token: ${error}`);
    }

    const tokenData: EmbedToken = await tokenResponse.json();

    return {
      success: true,
      embedUrl: report.metadata.embed_url,
      embedToken: tokenData.token
    };
  } catch (error) {
    console.error('❌ Error generating embed token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Supprimer un rapport
 * @param reportId - ID du rapport dans Supabase
 */
export async function deleteReport(
  reportId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getPowerBIConfig();
    const accessToken = await getAccessToken();

    // 1. Récupérer les infos du rapport
    const { data: report, error: dbError } = await supabaseAdmin
      .from('powerbi_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (dbError || !report) {
      throw new Error('Rapport introuvable');
    }

    // 2. Supprimer dans Power BI
    const deleteResponse = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/reports/${report.powerbi_report_id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!deleteResponse.ok) {
      console.warn('Erreur lors de la suppression dans Power BI (peut-être déjà supprimé)');
    }

    // 3. Supprimer dans Supabase
    const { error: deleteError } = await supabaseAdmin
      .from('powerbi_reports')
      .delete()
      .eq('id', reportId);

    if (deleteError) {
      throw new Error(`Erreur Supabase: ${deleteError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Exporter un rapport en PDF
 * @param reportId - ID du rapport dans Supabase
 */
export async function exportReport(
  reportId: string
): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
  try {
    const config = getPowerBIConfig();
    const accessToken = await getAccessToken();

    // 1. Récupérer les infos du rapport
    const { data: report, error: dbError } = await supabaseAdmin
      .from('powerbi_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (dbError || !report) {
      throw new Error('Rapport introuvable');
    }

    // 2. Demander l'export
    const exportResponse = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/reports/${report.powerbi_report_id}/ExportTo`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format: 'PDF'
        })
      }
    );

    if (!exportResponse.ok) {
      const error = await exportResponse.text();
      throw new Error(`Erreur lors de l'export: ${error}`);
    }

    const exportData = await exportResponse.json();
    const exportId = exportData.id;

    // 3. Attendre que l'export soit terminé
    let pdfUrl: string | null = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const statusResponse = await fetch(
        `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/reports/${report.powerbi_report_id}/exports/${exportId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'Succeeded') {
          // Télécharger le fichier
          const fileResponse = await fetch(
            `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/reports/${report.powerbi_report_id}/exports/${exportId}/file`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            }
          );

          if (fileResponse.ok) {
            const blob = await fileResponse.blob();
            pdfUrl = URL.createObjectURL(blob);
            break;
          }
        } else if (statusData.status === 'Failed') {
          throw new Error('L\'export du rapport a échoué');
        }
      }

      attempts++;
    }

    if (!pdfUrl) {
      throw new Error('Timeout lors de l\'export');
    }

    return {
      success: true,
      pdfUrl
    };
  } catch (error) {
    console.error('❌ Error exporting report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Lister tous les rapports d'un projet
 * @param projectId - ID du projet
 */
export async function listReports(projectId: string) {
  try {
    const { data: reports, error } = await supabaseAdmin
      .from('powerbi_reports')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      reports: reports || []
    };
  } catch (error) {
    console.error('❌ Error listing reports:', error);
    return {
      success: false,
      reports: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Rafraîchir le dataset d'un rapport
 * @param reportId - ID du rapport dans Supabase
 */
export async function refreshDataset(reportId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getPowerBIConfig();
    const accessToken = await getAccessToken();

    // 1. Récupérer les infos du rapport
    const { data: report, error: dbError } = await supabaseAdmin
      .from('powerbi_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (dbError || !report) {
      throw new Error('Rapport introuvable');
    }

    // 2. Rafraîchir le dataset
    const refreshResponse = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/datasets/${report.powerbi_dataset_id}/refreshes`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notifyOption: 'NoNotification'
        })
      }
    );

    if (!refreshResponse.ok) {
      const error = await refreshResponse.text();
      throw new Error(`Erreur lors du rafraîchissement: ${error}`);
    }

    // 3. Mettre à jour last_refreshed_at dans Supabase
    await supabaseAdmin
      .from('powerbi_reports')
      .update({ last_refreshed_at: new Date().toISOString() })
      .eq('id', reportId);

    return { success: true };
  } catch (error) {
    console.error('❌ Error refreshing dataset:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}
