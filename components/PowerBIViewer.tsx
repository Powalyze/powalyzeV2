// components/PowerBIViewer.tsx
'use client';

import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

type Props = {
  embedUrl: string;
  embedToken: string;
  reportId: string;
};

export function PowerBIViewer({ embedUrl, embedToken, reportId }: Props) {
  return (
    <div className="w-full h-[70vh] rounded-xl overflow-hidden border border-slate-800 bg-black">
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          id: reportId,
          embedUrl,
          accessToken: embedToken,
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: { visible: true },
              pageNavigation: { visible: true },
            },
            navContentPaneEnabled: true,
          },
        }}
        cssClassName="w-full h-full"
      />
    </div>
  );
}
