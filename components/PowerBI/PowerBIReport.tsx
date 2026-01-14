'use client';

import { useState, useEffect } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

interface PowerBIReportProps {
  reportId: string;
  datasetId: string;
}

export default function PowerBIReport({ reportId, datasetId }: PowerBIReportProps) {
  const [embedConfig, setEmbedConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/powerbi/token?reportId=${reportId}&datasetId=${datasetId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setEmbedConfig({
          type: 'report',
          id: data.reportId,
          embedUrl: data.embedUrl,
          accessToken: data.token,
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: true,
              },
              pageNavigation: {
                visible: true,
              },
            },
            background: models.BackgroundType.Transparent,
          },
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Power BI config:', err);
        setLoading(false);
      });
  }, [reportId, datasetId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
        <p className="text-white">Chargement du rapport Power BI...</p>
      </div>
    );
  }

  if (!embedConfig) {
    return (
      <div className="flex items-center justify-center h-96 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
        <p className="text-status-red">Échec du chargement du rapport</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 overflow-hidden">
      <PowerBIEmbed
        embedConfig={embedConfig}
        cssClassName="h-[600px] w-full"
      />
    </div>
  );
}
