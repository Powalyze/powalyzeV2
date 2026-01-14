import { NextRequest, NextResponse } from 'next/server';
import { getEmbedToken, powerBIConfig } from '@/lib/powerbi';

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId') || powerBIConfig.reportId;
    const datasetId = searchParams.get('datasetId') || '';

    if (!datasetId) {
      return NextResponse.json({ error: 'datasetId required' }, { status: 400 });
    }

    const embedToken = await getEmbedToken(reportId, datasetId);
    
    return NextResponse.json({
      token: embedToken.token,
      expiration: embedToken.expiration,
      reportId: reportId,
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${powerBIConfig.workspaceId}`,
    });
  } catch (error) {
    console.error('Power BI Token error:', error);
    return NextResponse.json({ error: 'Failed to generate Power BI token' }, { status: 500 });
  }
}
