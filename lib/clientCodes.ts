// Configuration des codes clients valides
// Ce fichier peut être remplacé par une base de données Supabase en production

export interface ClientConfig {
  code: string;
  name: string;
  organizationId: string;
  status: 'active' | 'inactive' | 'suspended';
  expiresAt?: string;
  createdAt: string;
  features?: {
    aiNarrative: boolean;
    committeePrep: boolean;
    advancedReports: boolean;
  };
}

export const CLIENT_CODES: Record<string, ClientConfig> = {
  'DEMO': {
    code: 'DEMO',
    name: 'Démonstration Powalyze',
    organizationId: '00000000-0000-0000-0000-000000000000',
    status: 'active',
    createdAt: '2026-01-01',
    features: {
      aiNarrative: true,
      committeePrep: true,
      advancedReports: true,
    },
  },
  'CLIENT-ACME': {
    code: 'CLIENT-ACME',
    name: 'ACME Corporation',
    organizationId: '00000000-0000-0000-0000-000000000000',
    status: 'active',
    createdAt: '2026-01-15',
    features: {
      aiNarrative: true,
      committeePrep: true,
      advancedReports: true,
    },
  },
  'CLIENT-TECHCO': {
    code: 'CLIENT-TECHCO',
    name: 'TechCo International',
    organizationId: '00000000-0000-0000-0000-000000000000',
    status: 'active',
    createdAt: '2026-01-10',
    features: {
      aiNarrative: true,
      committeePrep: true,
      advancedReports: false,
    },
  },
  'CLIENT-INNOVATION': {
    code: 'CLIENT-INNOVATION',
    name: 'Innovation Partners SA',
    organizationId: '00000000-0000-0000-0000-000000000000',
    status: 'active',
    expiresAt: '2026-12-31',
    createdAt: '2026-01-05',
    features: {
      aiNarrative: false,
      committeePrep: true,
      advancedReports: true,
    },
  },
  'CLIENT-POWALYZE': {
    code: 'CLIENT-POWALYZE',
    name: 'Powalyze Enterprise',
    organizationId: '00000000-0000-0000-0000-000000000000',
    status: 'active',
    createdAt: '2026-01-17',
    features: {
      aiNarrative: true,
      committeePrep: true,
      advancedReports: true,
    },
  },
  'CLIENT6POWALYZE': {
    code: 'CLIENT6POWALYZE',
    name: 'Client Pro 6 Powalyze',
    organizationId: '00000000-0000-0000-0000-000000000000',
    status: 'active',
    createdAt: '2026-01-17',
    features: {
      aiNarrative: true,
      committeePrep: true,
      advancedReports: true,
    },
  },
};

// Fonction pour valider un code client
export function validateClientCode(code: string): ClientConfig | null {
  const upperCode = code.toUpperCase().trim();
  
  const client = CLIENT_CODES[upperCode];

  if (!client) {
    return null;
  }

  // Vérifier le statut
  if (client.status !== 'active') {
    return null;
  }

  // Vérifier l'expiration
  if (client.expiresAt) {
    const expirationDate = new Date(client.expiresAt);
    if (expirationDate < new Date()) {
      return null;
    }
  }

  return client;
}

// Fonction pour obtenir tous les clients (admin)
export function getAllClients(): ClientConfig[] {
  return Object.values(CLIENT_CODES);
}

// Fonction pour créer un nouveau code client
export function generateClientCode(baseName: string): string {
  const sanitized = baseName.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `CLIENT-${sanitized}`;
}
