import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Mettre à jour le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
      data: {
        requires_password_change: false, // Marquer comme changé
      }
    });

    if (updateError) {
      console.error('Erreur changement mot de passe:', updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });

  } catch (error: any) {
    console.error('Erreur changement mot de passe:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
