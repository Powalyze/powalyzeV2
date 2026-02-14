import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName, company, phone, message, estimatedUsers, currentTools, governanceNeeds } = body;

    // Validation
    if (!email || !fullName || !company) {
      return NextResponse.json({ 
        error: 'Email, nom et entreprise sont requis' 
      }, { status: 400 });
    }

    // Log de la demande pour traçabilité
    console.log('📋 [ENTERPRISE REQUEST]', {
      email,
      fullName,
      company,
      phone,
      estimatedUsers,
      currentTools,
      governanceNeeds,
      timestamp: new Date().toISOString()
    });

    // Préparer le contenu de l'email admin
    const adminEmailContent = `
NOUVELLE DEMANDE ENTREPRISE

👤 Contact:
- Nom: ${fullName}
- Email: ${email}
- Entreprise: ${company}
${phone ? `- Téléphone: ${phone}` : ''}

📊 Contexte:
${estimatedUsers ? `- Utilisateurs estimés: ${estimatedUsers}` : ''}
${currentTools && Array.isArray(currentTools) && currentTools.length > 0 ? `- Outils actuels: ${currentTools.join(', ')}` : ''}
${governanceNeeds ? `- Besoins gouvernance: ${governanceNeeds}` : ''}

💬 Message:
${message || '(Aucun message)'}

---
Date: ${new Date().toLocaleString('fr-FR')}
    `.trim();

    // Envoyer email de confirmation client (async, ne bloque pas)
    fetch(`${request.nextUrl.origin}/api/emails/enterprise-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        fullName,
        company
      })
    }).catch(err => console.error('❌ Email client error:', err));

    // Envoyer email notification admin (async)
    fetch(`${request.nextUrl.origin}/api/emails/admin-enterprise-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        fullName,
        company,
        phone,
        message,
        estimatedUsers,
        currentTools,
        governanceNeeds,
        content: adminEmailContent
      })
    }).catch(err => console.error('❌ Email admin error:', err));

    // Retourner succès immédiatement (ne pas attendre les emails)
    return NextResponse.json({
      success: true,
      message: 'Demande envoyée avec succès. Nous revenons vers vous très rapidement.'
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    console.error('❌ [ENTERPRISE REQUEST ERROR]', error);
    
    // Retourner une erreur claire
    return NextResponse.json(
      { 
        error: 'Impossible de traiter votre demande',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
