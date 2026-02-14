import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { requestId, email, fullName, company, message } = await request.json();

    const emailContent = `
Nouvelle demande Entreprise Powalyze
=====================================

ID: ${requestId}
Email: ${email}
Nom: ${fullName || 'Non renseigné'}
Entreprise: ${company || 'Non renseignée'}

Message:
${message || 'Aucun message'}

→ Répondre rapidement pour qualifier la demande
→ Voir toutes les demandes: https://www.powalyze.com/admin/enterprise-requests

---
Notification automatique Powalyze
    `.trim();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@powalyze.com';

    // TODO: Send to real admin email
    console.log('📧 [EMAIL] Admin Notification:', { to: adminEmail, requestId, content: emailContent });

    return NextResponse.json({
      success: true,
      message: 'Admin notification sent'
    });

  } catch (error: any) {
    console.error('Admin notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification', details: error.message },
      { status: 500 }
    );
  }
}
