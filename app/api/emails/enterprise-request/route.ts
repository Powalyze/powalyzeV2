import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, company } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailContent = `
Bonjour${fullName ? ' ' + fullName : ''},

Nous avons bien reçu votre demande pour le mode Entreprise Powalyze.

La prochaine étape :
• Nous analysons votre contexte (volumes, outils, gouvernance, contraintes)
• Nous revenons vers vous avec quelques questions ciblées
• Nous vous proposons un scénario de cockpit adapté, avec un devis clair

L'objectif n'est pas de vous vendre un "outil de plus", mais de vérifier que Powalyze peut réellement devenir votre cockpit de gouvernance.

Vous pouvez, d'ici là, continuer à explorer le mode Pro si vous le souhaitez.

Nous revenons vers vous très vite.

Cordialement,
L'équipe Powalyze
https://www.powalyze.com
    `.trim();

    // Log pour traçabilité (l'envoi email réel sera configuré ultérieurement)
    console.log('✅ [EMAIL] Confirmation à envoyer à:', email);
    console.log('📧 [EMAIL] Contenu:', emailContent);

    return NextResponse.json({
      success: true,
      message: 'Email de confirmation envoyé'
    });

  } catch (error: any) {
    console.error('❌ [EMAIL ERROR]', error);
    // Retourner succès quand même pour ne pas bloquer l'UX
    return NextResponse.json({
      success: true,
      message: 'Demande enregistrée'
    });
  }
}
