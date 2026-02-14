import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, daysLeft } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailContent = `
Objet : Votre essai Powalyze Pro arrive à échéance

Bonjour,

Votre essai de Powalyze Pro arrive à échéance dans ${daysLeft || 'quelques'} jours.

Si le cockpit vous apporte de la clarté dans vos comités (projets, risques, décisions), vous pouvez continuer sans interruption en passant sur un abonnement Pro.

Gérer votre abonnement :
→ https://www.powalyze.com/account/billing

Si vous avez besoin de :
- prolonger légèrement l'essai,
- présenter le cockpit à un sponsor ou à un COMEX,
- discuter d'un passage en mode Entreprise,

répondez simplement à cet email. Nous préférons une décision claire à un abonnement subi.

Bien à vous,
L'équipe Powalyze
    `.trim();

    // TODO: Integrate with real email service
    console.log('📧 [EMAIL] Trial Reminder:', { email, daysLeft, content: emailContent });

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
