import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Powalyze - Cockpit Exécutif Premium';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 72,
              fontWeight: 'bold',
              color: '#0f172a',
            }}
          >
            P
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #ffffff, #f59e0b)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
          Powalyze
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.4,
            padding: '0 80px',
          }}
        >
          Cockpit Exécutif Hybride, Intelligent & Méthodologique
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 60,
            fontSize: 24,
            color: '#f59e0b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            ✓ IA Narrative
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            ✓ Multi-Méthodo
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            ✓ SaaS Premium
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
