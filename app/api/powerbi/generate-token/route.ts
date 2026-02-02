import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

/**
 * POST /api/powerbi/generate-token
 * Génère une clé API pour Power BI
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer l'utilisateur connecté
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer le profil et vérifier Pro
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id, plan, pro_active')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 });
    }

    if (profile.plan === 'demo' || !profile.pro_active) {
      return NextResponse.json(
        { error: 'La génération de clés API est réservée aux utilisateurs Pro' },
        { status: 403 }
      );
    }

    // Générer le token (64 caractères)
    const apiToken = crypto.randomBytes(32).toString('hex'); // 64 hex chars
    const last4 = apiToken.slice(-4);

    // Hasher le token pour le stockage
    const tokenHash = crypto.createHash('sha256').update(apiToken).digest('hex');

    // Insérer dans api_keys
    const { data: apiKey, error: insertError } = await supabase
      .from('api_keys')
      .insert({
        organization_id: profile.organization_id,
        name: 'Power BI Integration',
        token_hash: tokenHash,
        last_4: last4,
        created_by: user.id,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 an
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erreur insertion API key:', insertError);
      return NextResponse.json({ error: 'Erreur création clé API' }, { status: 500 });
    }

    // Retourner le token en clair (une seule fois)
    return NextResponse.json({
      token: apiToken,
      last_4: last4,
      expires_at: apiKey.expires_at,
    });
  } catch (error: any) {
    console.error('Erreur génération token:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
