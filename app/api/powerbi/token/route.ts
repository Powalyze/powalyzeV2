import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedToken } from '@/lib/powerbi';

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');
    const datasetId = searchParams.get('datasetId') || undefined;

    if (!reportId) {
      return NextResponse.json({ error: 'reportId required' }, { status: 400 });
    }

    const embedToken = await generateEmbedToken(reportId, datasetId);
    
    return NextResponse.json({
      token: embedToken,
      reportId: reportId,
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${process.env.POWERBI_WORKSPACE_ID}`,
    });
  } catch (error) {
    console.error('Power BI Token error:', error);
    return NextResponse.json({ error: 'Failed to generate Power BI token' }, { status: 500 });
  }
}
