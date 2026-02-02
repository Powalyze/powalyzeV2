import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from './supabase';

/**
 * Middleware d'authentification API
 * Valide le Bearer token contre la table api_keys
 */
export async function validateApiKey(request: NextRequest): Promise<{
  valid: boolean;
  organizationId?: string;
  apiKeyId?: string;
  error?: string;
}> {
  try {
    // Extraire le token du header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'Missing or invalid Authorization header' };
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return { valid: false, error: 'Empty token' };
    }

    // Hasher le token pour comparaison
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Chercher la clé API dans Supabase
    const { data: apiKey, error: queryError } = await supabaseAdmin
      .from('api_keys')
      .select('id, organization_id, expires_at, is_active')
      .eq('token_hash', tokenHash)
      .single();

    if (queryError || !apiKey) {
      return { valid: false, error: 'Invalid API key' };
    }

    // Vérifier que la clé est active
    if (!apiKey.is_active) {
      return { valid: false, error: 'API key is inactive' };
    }

    // Vérifier l'expiration
    if (new Date(apiKey.expires_at) < new Date()) {
      return { valid: false, error: 'API key has expired' };
    }

    // Mettre à jour last_used_at (async, sans attendre)
    void supabaseAdmin
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', apiKey.id);

    return {
      valid: true,
      organizationId: apiKey.organization_id,
      apiKeyId: apiKey.id,
    };
  } catch (error: any) {
    console.error('Erreur validation API key:', error);
    return { valid: false, error: 'Internal error' };
  }
}

/**
 * Logger un appel API
 */
export async function logApiCall(params: {
  organizationId: string;
  apiKeyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await supabaseAdmin.from('api_logs').insert({
      organization_id: params.organizationId,
      api_key_id: params.apiKeyId,
      endpoint: params.endpoint,
      method: params.method,
      status_code: params.statusCode,
      response_time_ms: params.responseTimeMs,
      ip_address: params.ipAddress || null,
      user_agent: params.userAgent || null,
    });
  } catch (error: any) {
    console.error('Erreur log API:', error);
  }
}

/**
 * Rate limiter simple en mémoire
 * 60 requêtes par minute par clé API
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(apiKeyId: string): { allowed: boolean; remainingRequests: number } {
  const now = Date.now();
  const limit = 60; // requêtes par minute
  const windowMs = 60 * 1000; // 1 minute

  const record = rateLimitStore.get(apiKeyId);

  if (!record || now > record.resetAt) {
    // Nouvelle fenêtre
    rateLimitStore.set(apiKeyId, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remainingRequests: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remainingRequests: 0 };
  }

  record.count += 1;
  return { allowed: true, remainingRequests: limit - record.count };
}
