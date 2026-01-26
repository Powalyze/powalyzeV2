'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function test() {
      try {
        const orgId = '00000000-0000-0000-0000-000000000000';
        console.log('Testing API with orgId:', orgId);
        
        const res = await fetch(`/api/cockpit?organizationId=${orgId}`);
        console.log('Response status:', res.status);
        
        const text = await res.text();
        console.log('Response text:', text);
        
        const data = JSON.parse(text);
        setResult(data);
      } catch (e: any) {
        console.error('Error:', e);
        setError(e.message);
      }
    }
    test();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: 'monospace' }}>
      <h1>Debug Cockpit API</h1>
      {error && <div style={{ color: 'red', background: '#fdd', padding: 20, marginBottom: 20 }}>
        <strong>ERROR:</strong> {error}
      </div>}
      {result && <pre style={{ background: '#f0f0f0', padding: 20 }}>
        {JSON.stringify(result, null, 2)}
      </pre>}
      {!result && !error && <div>Loading...</div>}
    </div>
  );
}

