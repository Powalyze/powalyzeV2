/**
 * Dual-Mode System for Powalyze Cockpit
 * Handles DEMO and PRO modes with automatic detection and data routing
 */

import { createClient } from "@/utils/supabase/server";

export type UserMode = 'demo' | 'pro' | 'admin';

/**
 * Get the current user's mode from Supabase
 * Defaults to 'demo' if user is not authenticated or mode is not set
 */
export async function getUserMode(): Promise<UserMode> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return 'demo'; // Default to demo for unauthenticated users
    }

    // Query the user's mode from profiles or users table
    const { data: profile } = await supabase
      .from('users')
      .select('mode')
      .eq('id', user.id)
      .single();

    return (profile?.mode as UserMode) || 'demo';
  } catch (error) {
    console.error('[getUserMode] Error:', error);
    return 'demo';
  }
}

/**
 * Check if current user is in DEMO mode
 */
export async function isDemoMode(): Promise<boolean> {
  const mode = await getUserMode();
  return mode === 'demo';
}

/**
 * Check if current user is in PRO mode
 */
export async function isProMode(): Promise<boolean> {
  const mode = await getUserMode();
  return mode === 'pro' || mode === 'admin';
}

/**
 * Get the appropriate table name based on user mode
 * DEMO mode -> demo_* tables
 * PRO mode -> regular tables
 */
export async function getTableName(baseTable: string): Promise<string> {
  const mode = await getUserMode();
  return mode === 'demo' ? `demo_${baseTable}` : baseTable;
}

/**
 * Upgrade a user to PRO mode
 */
export async function upgradeUserToPro(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('users')
      .update({ mode: 'pro' })
      .eq('id', userId);

    if (error) {
      console.error('[upgradeUserToPro] Error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[upgradeUserToPro] Error:', error);
    return false;
  }
}

/**
 * Check if user has access to PRO features
 */
export async function canAccessProFeatures(): Promise<boolean> {
  const mode = await getUserMode();
  return mode === 'pro' || mode === 'admin';
}

/**
 * Get mode-specific configuration
 */
export async function getModeConfig() {
  const mode = await getUserMode();
  
  return {
    mode,
    isDemo: mode === 'demo',
    isPro: mode === 'pro' || mode === 'admin',
    badge: mode === 'demo' ? 'MODE DÉMO' : 'PRODUCTION',
    badgeColor: mode === 'demo' ? 'bg-blue-500' : 'bg-emerald-500',
    accentColor: mode === 'demo' ? 'text-blue-500' : 'text-gold-premium',
    canCreateProjects: mode !== 'demo',
    canUseAdvancedConnectors: mode === 'pro' || mode === 'admin',
    canExportData: mode === 'pro' || mode === 'admin',
  };
}

/**
 * Redirect to upgrade page if user is in DEMO mode
 */
export function requireProMode(redirectUrl: string = '/cockpit/pro') {
  return async () => {
    const isPro = await isProMode();
    if (!isPro) {
      return {
        redirect: {
          destination: redirectUrl,
          permanent: false,
        },
      };
    }
    return { props: {} };
  };
}

/**
 * Get table prefix for queries
 */
export async function getTablePrefix(): Promise<string> {
  const mode = await getUserMode();
  return mode === 'demo' ? 'demo_' : '';
}

/**
 * Execute a query with automatic table routing based on mode
 */
export async function executeModeSafeQuery<T>(
  baseTable: string,
  queryBuilder: (tableName: string) => Promise<T>
): Promise<T> {
  const tableName = await getTableName(baseTable);
  return queryBuilder(tableName);
}
