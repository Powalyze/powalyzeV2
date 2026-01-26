'use client';

export default function EnvDebug() {
  return (
    <div style={{ padding: 40, fontFamily: 'monospace', background: '#000', color: '#0f0' }}>
      <h1>🔍 Debug Environment Variables</h1>
      <pre style={{ background: '#111', padding: 20, fontSize: 14 }}>
{`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ UNDEFINED'}
NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ SET (length: ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ')' : '❌ UNDEFINED'}
NEXT_PUBLIC_DEMO_ORG_ID: ${process.env.NEXT_PUBLIC_DEMO_ORG_ID || '❌ UNDEFINED'}

Test Supabase Client Creation:
${typeof window !== 'undefined' ? 'Running on CLIENT' : 'Running on SERVER'}`}
      </pre>
      
      <button 
        onClick={async () => {
          try {
            const res = await fetch('/api/cockpit?organizationId=00000000-0000-0000-0000-000000000000');
            const data = await res.text();
            alert(`Status: ${res.status}\n\n${data}`);
          } catch(e: any) {
            alert('Error: ' + e.message);
          }
        }}
        style={{ padding: '10px 20px', fontSize: 16, marginTop: 20, cursor: 'pointer' }}
      >
        Test API Call
      </button>
    </div>
  );
}

