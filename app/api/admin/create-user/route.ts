import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier que l'utilisateur actuel est admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier le rôle admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès refusé - Droits admin requis' },
        { status: 403 }
      );
    }

    // Récupérer les données du nouvel utilisateur
    const body = await request.json();
    const { email, firstName, lastName, role, company } = body;

    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'Données manquantes (email, firstName, lastName, role requis)' },
        { status: 400 }
      );
    }

    // Générer un mot de passe temporaire sécurisé
    const tempPassword = generateTemporaryPassword();

    // Utiliser l'Admin API pour créer l'utilisateur
    // Note: Nécessite SUPABASE_SERVICE_ROLE_KEY
    const supabaseAdmin = await import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
    );

    // Créer l'utilisateur dans Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Confirmer automatiquement l'email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        company: company || null,
        requires_password_change: true, // Flag custom pour forcer changement
      }
    });

    if (createError) {
      console.error('Erreur création utilisateur:', createError);
      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      );
    }

    if (!newUser.user) {
      return NextResponse.json(
        { error: 'Échec création utilisateur' },
        { status: 500 }
      );
    }

    // Créer l'entrée dans la table users
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: newUser.user.id,
        email,
        full_name: `${firstName} ${lastName}`,
        company: company || null,
        role,
        pro_active: true,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Erreur insertion DB:', dbError);
      // Continuer même si erreur (l'utilisateur Auth est créé)
    }

    // TODO: Envoyer email avec credentials temporaires
    // Pour l'instant, retourner le mot de passe dans la réponse
    console.log('✅ Utilisateur créé:', {
      email,
      role,
      tempPassword: '[REDACTED]'
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        role,
      },
      // ⚠️ ATTENTION: En production, envoyer par email au lieu de retourner
      temporaryPassword: tempPassword,
      message: 'Utilisateur créé avec succès. Mot de passe temporaire à communiquer de manière sécurisée.'
    });

  } catch (error: any) {
    console.error('Erreur création utilisateur:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

function generateTemporaryPassword(): string {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  
  // Assurer au moins: 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%'[Math.floor(Math.random() * 5)];
  
  // Compléter
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Mélanger
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
