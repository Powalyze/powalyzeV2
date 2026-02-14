import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailContent = `
Objet : Votre accès à Powalyze Pro est activé

Bonjour,

Merci d'avoir choisi Powalyze Pro.

Votre cockpit exécutif est maintenant prêt. Vous pouvez dès à présent :
- créer vos premiers projets,
- déclarer vos risques majeurs,
- suivre vos décisions et vos comités,
- générer des résumés exécutifs en quelques secondes.

Accéder à votre cockpit :
→ https://www.powalyze.com/cockpit

Notre intention est simple : que chaque comité parte des mêmes chiffres, des mêmes risques et des mêmes décisions, sans consolidation manuelle.

Si vous avez la moindre question, répondez simplement à cet email.

À très vite dans le cockpit,
L'équipe Powalyze
    `.trim();

    // TODO: Integrate with real email service (SendGrid, Resend, etc.)
    console.log('📧 [EMAIL] Pro Activated:', { email, content: emailContent });

    return NextResponse.json({
      success: true,
      message: 'Email queued for sending'
    });

  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
