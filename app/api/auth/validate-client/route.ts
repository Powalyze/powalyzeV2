import { NextRequest, NextResponse } from 'next/server';
import { validateClientCode } from '@/lib/clientCodes';
import { generateToken } from '@/lib/auth';

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

    // Générer le token JWT pour le client
    const token = generateToken({
      userId: client.organizationId,
      tenantId: client.organizationId,
      email: `${client.code.toLowerCase()}@powalyze.app`,
      role: 'COMEX',
    });

    // Retourner les informations du client avec le token
    return NextResponse.json({
      success: true,
      token,
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
