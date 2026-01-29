import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY manquant' }, { status: 500 });
    }

    const body = await request.json();
    const { email, firstName, lastName, company } = body || {};

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const displayName = `${firstName || ''} ${lastName || ''}`.trim() || 'Bonjour';
    const companyLine = company ? `chez ${company}` : 'chez Powalyze';

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;background:#f8fafc;padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;">
          <h2 style="margin-top:0;">Bienvenue ${displayName} 👋</h2>
          <p>Merci d'avoir créé votre compte ${companyLine}.</p>
          <p>Votre cockpit est prêt. Voici les <strong>3 étapes rapides</strong> pour démarrer :</p>
          <ol style="padding-left:18px;">
            <li>Créez votre premier projet pilote.</li>
            <li>Invitez 2-3 membres clés de votre équipe.</li>
            <li>Générez votre premier rapport IA.</li>
          </ol>
          <div style="margin:24px 0;">
            <a href="https://www.powalyze.com/welcome" style="display:inline-block;padding:12px 18px;background:#f59e0b;color:#0f172a;text-decoration:none;border-radius:8px;font-weight:bold;">Accéder à mon tableau de bord</a>
          </div>
          <div style="border-top:1px solid #e2e8f0;margin-top:24px;padding-top:16px;">
            <p style="margin:0 0 8px 0;"><strong>Ressources utiles</strong></p>
            <ul style="padding-left:18px;margin:0;">
              <li><a href="https://www.powalyze.com/ressources/documentation/quick-start">Guide de démarrage rapide</a></li>
              <li><a href="https://www.powalyze.com/ressources/blog">Articles & bonnes pratiques</a></li>
              <li><a href="https://www.powalyze.com/contact">Contacter un expert</a></li>
            </ul>
          </div>
          <p style="margin-top:24px;">À très vite,<br/>L'équipe Powalyze</p>
        </div>
        <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">
          Vous recevez cet email car vous venez de créer un compte Powalyze.
        </p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Powalyze <onboarding@powalyze.com>',
        to: [email],
        subject: 'Bienvenue sur Powalyze ✨',
        html
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erreur inconnue' }, { status: 500 });
  }
}
