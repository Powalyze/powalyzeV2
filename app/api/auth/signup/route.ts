import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function cleanEnv(value?: string) {
  return value?.replace(/^\uFEFF/, '').trim();
}

function getBaseUrl(request: NextRequest) {
  const explicit = cleanEnv(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.replace(/\/$/, '');

  const vercelUrl = cleanEnv(process.env.VERCEL_URL);
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, '')}`;

  const origin = request.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');

  const forwardedHost = request.headers.get('x-forwarded-host');
  if (forwardedHost) {
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    return `${proto}://${forwardedHost.replace(/\/$/, '')}`;
  }

  const host = request.headers.get('host');
  if (host) {
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    return `${proto}://${host.replace(/\/$/, '')}`;
  }

  if (process.env.NODE_ENV === 'production') {
    return 'https://www.powalyze.com';
  }

  return 'http://localhost:3000';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, company } = body || {};

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const supabaseAnonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const serviceRoleKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const resendApiKey = cleanEnv(process.env.RESEND_API_KEY);

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const baseUrl = getBaseUrl(request);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          company: company || null
        },
        emailRedirectTo: `${baseUrl}/auth/confirm`
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const needsEmailConfirmation = !data.session;

    // Le profile est créé automatiquement via trigger sur auth.users
    if (needsEmailConfirmation && serviceRoleKey) {
      const admin = createClient(supabaseUrl, serviceRoleKey);
      
      if (needsEmailConfirmation) {
        if (!resendApiKey) {
          return NextResponse.json({ error: 'RESEND_API_KEY manquant' }, { status: 500 });
        }

        const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
          type: 'signup',
          email,
          password,
          options: {
            redirectTo: `${baseUrl}/auth/confirm`
          }
        });

        if (linkError) {
          return NextResponse.json({ error: linkError.message }, { status: 500 });
        }

        const actionLink = linkData?.properties?.action_link;
        if (!actionLink) {
          return NextResponse.json({ error: 'Lien de confirmation introuvable' }, { status: 500 });
        }

        const html = `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;background:#f8fafc;padding:24px;">
            <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;">
              <h2 style="margin-top:0;">Confirmez votre email</h2>
              <p>Bonjour ${firstName},</p>
              <p>Merci d'avoir créé votre compte Powalyze. Cliquez sur le bouton ci-dessous pour activer votre compte.</p>
              <div style="margin:24px 0;">
                <a href="${actionLink}" style="display:inline-block;padding:12px 18px;background:#f59e0b;color:#0f172a;text-decoration:none;border-radius:8px;font-weight:bold;">Confirmer mon email</a>
              </div>
              <p style="font-size:12px;color:#64748b;">Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
              <p style="font-size:12px;color:#0f172a;word-break:break-all;">${actionLink}</p>
              <p style="margin-top:24px;">À très vite,<br/>L'équipe Powalyze</p>
            </div>
          </div>
        `;

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Powalyze <onboarding@powalyze.com>',
            to: [email],
            subject: 'Confirmez votre email Powalyze',
            html
          })
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          return NextResponse.json({ error: errorText || 'Envoi email échoué' }, { status: 500 });
        }
      }
    }

    return NextResponse.json({
      userId: data.user?.id || null,
      needsEmailConfirmation
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erreur inconnue' },
      { status: 500 }
    );
  }
}

