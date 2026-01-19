import { NextRequest, NextResponse } from 'next/server';
import { validateClientCode } from '@/lib/clientCodes';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code client requis' },
        { status: 400 }
      );
    }

    // Valider le code client
    const client = validateClientCode(code);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Code client invalide ou expiré' },
        { status: 401 }
      );
    }

    // Retourner les informations du client
    return NextResponse.json({
      success: true,
      client: {
        code: client.code,
        name: client.name,
        organizationId: client.organizationId,
        features: client.features,
      },
    });
  } catch (error) {
    console.error('Error validating client code:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
