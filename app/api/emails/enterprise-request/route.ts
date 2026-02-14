import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

    // Si Resend est configuré, envoyer l'email
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Powalyze <noreply@powalyze.com>',
          to: email,
          subject: '✓ Demande Entreprise bien reçue – Powalyze',
          text: emailContent,
          html: `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Demande bien reçue ✓</h1>
              </div>
              <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
                <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Bonjour${fullName ? ' <strong>' + fullName + '</strong>' : ''},
                </p>
                <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Nous avons bien reçu votre demande pour le <strong>mode Entreprise Powalyze</strong>.
                </p>
                <div style="background: white; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                  <p style="margin: 0 0 15px 0; font-weight: 600; color: #0f172a;">La prochaine étape :</p>
                  <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Nous analysons votre contexte (volumes, outils, gouvernance)</li>
                    <li>Nous revenons vers vous avec quelques questions ciblées</li>
                    <li>Nous vous proposons un scénario de cockpit adapté avec devis</li>
                  </ul>
                </div>
                <p style="font-size: 15px; line-height: 1.6; margin: 20px 0; color: #64748b;">
                  L'objectif n'est pas de vous vendre un "outil de plus", mais de vérifier que Powalyze peut réellement devenir votre cockpit de gouvernance.
                </p>
                <p style="font-size: 15px; line-height: 1.6; margin: 20px 0;">
                  Vous pouvez, d'ici là, continuer à explorer le <a href="https://www.powalyze.com/pricing" style="color: #f59e0b; text-decoration: none; font-weight: 600;">mode Pro</a> si vous le souhaitez.
                </p>
                <p style="font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                  Cordialement,<br>
                  <strong>L'équipe Powalyze</strong>
                </p>
              </div>
              <div style="text-align: center; margin-top: 20px; padding: 20px; font-size: 12px; color: #94a3b8;">
                <p style="margin: 0;">Powalyze – Cockpit Exécutif & Gouvernance</p>
                <p style="margin: 5px 0 0 0;">
                  <a href="https://www.powalyze.com" style="color: #f59e0b; text-decoration: none;">www.powalyze.com</a>
                </p>
              </div>
            </div>
          `
        });

        console.log('✅ [EMAIL] Confirmation envoyée à:', email);
      } catch (emailError) {
        console.error('⚠️ [EMAIL] Erreur envoi Resend:', emailError);
        // Ne pas fail si l'email échoue
      }
    } else {
      console.log('📧 [EMAIL] Resend non configuré - Email simulé:', { email, fullName, company });
    }

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
