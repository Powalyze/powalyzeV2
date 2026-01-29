'use client';

import { useEffect, useState } from 'react';

export default function DebugEnvPage() {
  const [envCheck, setEnvCheck] = useState<any>({});

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const checks = {
      url: {
        value: url,
        exists: !!url,
        length: url.length,
        isASCII: /^[\x00-\xFF]*$/.test(url),
        preview: url ? `${url.substring(0, 30)}...` : 'NOT SET',
        hasNonASCII: url.split('').filter(c => c.charCodeAt(0) > 127).length > 0,
        nonASCIIChars: url.split('').filter(c => c.charCodeAt(0) > 127).map(c => ({
          char: c,
          code: c.charCodeAt(0)
        }))
      },
      key: {
        value: key,
        exists: !!key,
        length: key.length,
        isASCII: /^[\x00-\xFF]*$/.test(key),
        preview: key ? `${key.substring(0, 20)}...` : 'NOT SET',
        hasNonASCII: key.split('').filter(c => c.charCodeAt(0) > 127).length > 0,
        nonASCIIChars: key.split('').filter(c => c.charCodeAt(0) > 127).map(c => ({
          char: c,
          code: c.charCodeAt(0)
        }))
      }
    };

    setEnvCheck(checks);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Environment Variables Debug</h1>

        {/* SUPABASE_URL */}
        <div className="mb-8 p-6 bg-slate-900 border border-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">NEXT_PUBLIC_SUPABASE_URL</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Exists:</span>
              <span className={envCheck.url?.exists ? 'text-green-400' : 'text-red-400'}>
                {envCheck.url?.exists ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Length:</span>
              <span className="text-blue-400">{envCheck.url?.length || 0} chars</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Is ASCII-only:</span>
              <span className={envCheck.url?.isASCII ? 'text-green-400' : 'text-red-400'}>
                {envCheck.url?.isASCII ? 'Yes' : 'No - PROBLEM!'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Preview:</span>
              <code className="text-blue-400 bg-slate-800 px-2 py-1 rounded">{envCheck.url?.preview}</code>
            </div>
            {envCheck.url?.hasNonASCII && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded">
                <p className="text-red-400 font-semibold mb-2">Non-ASCII characters detected!</p>
                <div className="space-y-1">
                  {envCheck.url?.nonASCIIChars.map((item: any, i: number) => (
                    <div key={i} className="text-xs">
                      Character: <code className="bg-slate-800 px-2 py-1 rounded">{item.char}</code> 
                      (Unicode: {item.code})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SUPABASE_ANON_KEY */}
        <div className="mb-8 p-6 bg-slate-900 border border-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">NEXT_PUBLIC_SUPABASE_ANON_KEY</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Exists:</span>
              <span className={envCheck.key?.exists ? 'text-green-400' : 'text-red-400'}>
                {envCheck.key?.exists ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Length:</span>
              <span className="text-blue-400">{envCheck.key?.length || 0} chars</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Is ASCII-only:</span>
              <span className={envCheck.key?.isASCII ? 'text-green-400' : 'text-red-400'}>
                {envCheck.key?.isASCII ? 'Yes' : 'No - PROBLEM!'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Preview:</span>
              <code className="text-blue-400 bg-slate-800 px-2 py-1 rounded">{envCheck.key?.preview}</code>
            </div>
            {envCheck.key?.hasNonASCII && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded">
                <p className="text-red-400 font-semibold mb-2">Non-ASCII characters detected!</p>
                <div className="space-y-1">
                  {envCheck.key?.nonASCIIChars.map((item: any, i: number) => (
                    <div key={i} className="text-xs">
                      Character: <code className="bg-slate-800 px-2 py-1 rounded">{item.char}</code> 
                      (Unicode: {item.code})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Solution */}
        <div className="p-6 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Solution</h2>
          <div className="space-y-3 text-sm text-slate-300">
            <p>Si vous voyez "Non-ASCII characters detected", les variables d'environnement contiennent des caractères invalides (probablement copiés/collés avec des espaces ou caractères invisibles).</p>
            
            <p className="font-semibold text-white">Fix local (.env.local):</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Ouvrez <code className="bg-slate-800 px-2 py-1 rounded">.env.local</code></li>
              <li>Supprimez les lignes NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>Allez sur Supabase Dashboard &gt; Settings &gt; API</li>
              <li>Copiez les valeurs directement (sans espaces)</li>
              <li>Collez-les dans .env.local</li>
              <li>Redémarrez le serveur (npm run dev)</li>
            </ol>

            <p className="font-semibold text-white mt-4">Fix production (Vercel):</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Allez sur Vercel Dashboard &gt; Settings &gt; Environment Variables</li>
              <li>Supprimez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>Re-créez-les en copiant directement depuis Supabase (sans espaces)</li>
              <li>Redéployez: <code className="bg-slate-800 px-2 py-1 rounded">vercel --prod</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
