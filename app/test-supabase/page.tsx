'use client';

import { useEffect, useState } from 'react';

export default function TestSupabasePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test-supabase')
      .then(res => res.json())
      .then(data => {
        setResult(data);
        setLoading(false);
      })
      .catch(err => {
        setResult({ error: err.message });
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 40 }}>⏳ Test en cours...</div>;

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', fontSize: 14, background: '#000', color: '#0f0', minHeight: '100vh' }}>
      <h1>🔍 Test Supabase Direct</h1>
      <pre style={{ background: '#111', padding: 20, overflow: 'auto' }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

