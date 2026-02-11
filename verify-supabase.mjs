// Script Node.js de vérification programmatique Supabase (Auth + Session)

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Charger les variables depuis .env.local
const envContent = readFileSync('.env.local', 'utf-8');
const SUPABASE_URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const ANON_KEY = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  🔍 VÉRIFICATION PROGRAMMATIQUE SUPABASE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`📍 URL: ${SUPABASE_URL}`);
console.log(`🔑 ANON_KEY: ${ANON_KEY?.substring(0, 50)}...\n`);

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('❌ Variables manquantes dans .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testAuth() {
  console.log('🔑 TEST 1/4: Création du client Supabase...');
  console.log('  ✓ Client créé\n');

  console.log('🔐 TEST 2/4: Test signInWithPassword (credentials invalides)...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    if (error) {
      if (error.message.includes('Failed to fetch')) {
        console.log('  ❌ ERREUR CRITIQUE: Supabase Auth inaccessible');
        console.log(`  📄 Message: ${error.message}\n`);
        return false;
      } else if (error.message.includes('Invalid login credentials')) {
        console.log('  ✓ Auth répond correctement (credentials invalides attendu)');
        console.log(`  📄 Message: ${error.message}\n`);
        return true;
      } else {
        console.log(`  ⚠️  Erreur Auth: ${error.message}\n`);
        return true; // Auth répond quand même
      }
    }

    if (data?.session) {
      console.log('  ✓ Session créée (credentials étaient valides!)');
      console.log(`  👤 User ID: ${data.user.id}`);
      console.log(`  📧 Email: ${data.user.email}\n`);
      return true;
    }
  } catch (e) {
    console.log(`  ❌ Exception réseau: ${e.message}`);
    console.log(`  📄 Stack: ${e.stack}\n`);
    return false;
  }
}

async function testSession() {
  console.log('🎫 TEST 3/4: Récupération de la session...');
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log(`  ⚠️  Erreur getSession: ${error.message}\n`);
      return false;
    }

    if (data.session) {
      console.log('  ✓ Session trouvée');
      console.log(`  👤 User ID: ${data.session.user.id}\n`);
      return true;
    } else {
      console.log('  ℹ️  Aucune session active (normal)\n');
      return true;
    }
  } catch (e) {
    console.log(`  ❌ Exception: ${e.message}\n`);
    return false;
  }
}

async function testHealthEndpoint() {
  console.log('🩺 TEST 4/4: Test endpoint Auth Health (fetch natif)...');
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/health`);
    
    if (response.ok) {
      const text = await response.text();
      console.log(`  ✓ Auth Health OK (${response.status})`);
      console.log(`  📄 Response: ${text}\n`);
      return true;
    } else {
      console.log(`  ⚠️  Status: ${response.status}\n`);
      return false;
    }
  } catch (e) {
    console.log(`  ❌ Fetch failed: ${e.message}\n`);
    return false;
  }
}

async function runAllTests() {
  const results = {
    auth: await testAuth(),
    session: await testSession(),
    health: await testHealthEndpoint()
  };

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  📊 RÉSULTATS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log(`  Auth signInWithPassword: ${results.auth ? '✓ OK' : '✗ FAIL'}`);
  console.log(`  Session getSession:      ${results.session ? '✓ OK' : '✗ FAIL'}`);
  console.log(`  Health endpoint:         ${results.health ? '✓ OK' : '✗ FAIL'}`);

  const allPassed = Object.values(results).every(r => r);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (allPassed) {
    console.log('  ✅ TOUS LES TESTS PASSÉS');
  } else {
    console.log('  ⚠️  CERTAINS TESTS ONT ÉCHOUÉ');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(allPassed ? 0 : 1);
}

runAllTests();
