import { NextResponse } from 'next/server';

export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({
      error: 'Missing env vars',
      hasUrl: !!SUPABASE_URL,
      hasServiceRole: !!SUPABASE_SERVICE_ROLE_KEY,
      hasAnon: !!SUPABASE_ANON_KEY,
      url: SUPABASE_URL,
      serviceRoleKeyLength: SUPABASE_SERVICE_ROLE_KEY?.length,
    }, { status: 500 });
  }

  // Test 1: avec SERVICE_ROLE
  const headersServiceRole = {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  };

  // Test 2: avec ANON
  const headersAnon = {
    'apikey': SUPABASE_ANON_KEY!,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  };

  try {
    const url = `${SUPABASE_URL}/rest/v1/organizations?select=*`;
    
    const [resServiceRole, resAnon] = await Promise.all([
      fetch(url, { headers: headersServiceRole }),
      fetch(url, { headers: headersAnon }),
    ]);

    const [textServiceRole, textAnon] = await Promise.all([
      resServiceRole.text(),
      resAnon.text(),
    ]);

    return NextResponse.json({
      supabaseUrl: SUPABASE_URL,
      serviceRoleKeyFirst20: SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...',
      anonKeyFirst20: SUPABASE_ANON_KEY!.substring(0, 20) + '...',
      testServiceRole: {
        status: resServiceRole.status,
        body: textServiceRole.substring(0, 500),
        contentType: resServiceRole.headers.get('content-type'),
      },
      testAnon: {
        status: resAnon.status,
        body: textAnon.substring(0, 500),
        contentType: resAnon.headers.get('content-type'),
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
