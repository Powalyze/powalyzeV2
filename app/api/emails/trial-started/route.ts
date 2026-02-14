import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, trialEnd } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailContent = `
Objet : Votre essai Powalyze Pro commence

Bonjour,

Votre essai de Powalyze Pro est maintenant actif.

Pendant cette période, vous disposez du même cockpit que nos clients payants :
- vue portefeuille projets,
- suivi des risques et décisions,
- narratifs exécutifs générés automatiquement,
- exports et vues cockpit.

Accéder à votre cockpit :
→ https://www.powalyze.com/cockpit

Nous vous recommandons de :
- choisir un périmètre réel (quelques projets, un comité, une BU),
- déclarer les risques et décisions comme vous le faites aujourd'hui,
- comparer la préparation de votre prochain comité avec et sans Powalyze.

Quelques jours avant la fin de l'essai, nous vous enverrons un rappel pour décider de la suite.

Si vous souhaitez échanger sur votre contexte, répondez simplement à cet email.

À bientôt,
L'équipe Powalyze
    `.trim();

    // TODO: Integrate with real email service (SendGrid, Resend, etc.)
    console.log('📧 [EMAIL] Trial Started:', { email, trialEnd, content: emailContent });

    // For now, return success (email would be sent in production)
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
