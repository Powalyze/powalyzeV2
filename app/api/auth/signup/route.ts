// app/api/auth/signup/route.ts - Version simplifiée et robuste
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, accountType } = await req.json();

    console.log('[Signup] Starting signup process for:', email);

    // Validation des champs requis
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Type de compte
    const validAccountTypes = ['demo', 'pro', 'admin'];
    const finalAccountType = accountType && validAccountTypes.includes(accountType) 
      ? accountType 
      : 'demo';

    // Vérifier si l'email existe déjà
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    // Hash du mot de passe
    const passwordHash = await hash(password, 10);

    // Étape 1: Créer ou récupérer l'organisation
    const orgName = `${firstName} ${lastName}`;
    const orgDomain = email.split('@')[1] || 'powalyze.com';
    let organizationId: string;

    console.log('[Signup] Creating organization:', orgName);

    // Essayer de créer l'organisation avec un nom unique
    const uniqueOrgName = `${orgName} ${Date.now()}`;
    const { data: newOrg, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        name: uniqueOrgName,
        domain: orgDomain,
        is_active: true
      })
      .select()
      .maybeSingle();

    if (orgError || !newOrg) {
      console.error('[Signup] Organization creation error:', orgError);
      return NextResponse.json(
        { 
          error: 'Erreur lors de la création de l\'organisation',
          details: orgError?.message || 'Unknown error'
        },
        { status: 500 }
      );
    }

    organizationId = newOrg.id;
    console.log('[Signup] Organization created successfully:', organizationId);

    // Étape 2: Créer l'utilisateur
    console.log('[Signup] Creating user with organization:', organizationId);
    
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        organization_id: organizationId,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role: 'PM',
        account_type: finalAccountType,
        subscription_status: finalAccountType === 'pro' ? 'trial' : 'active',
        subscription_end_date: finalAccountType === 'pro' 
          ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          : null,
        is_active: true
      })
      .select()
      .single();

    if (userError) {
      console.error('[Signup] User creation error:', userError);
      // Nettoyer l'organisation créée
      await supabaseAdmin.from('organizations').delete().eq('id', organizationId);
      return NextResponse.json(
        { 
          error: 'Erreur lors de la création du compte',
          details: userError.message
        },
        { status: 500 }
      );
    }

    if (!user) {
      await supabaseAdmin.from('organizations').delete().eq('id', organizationId);
      return NextResponse.json(
        { error: 'Erreur: utilisateur non créé' },
        { status: 500 }
      );
    }

    console.log('[Signup] User created successfully:', user.id);

    // Étape 3: Créer un projet démo pour les comptes Demo
    if (finalAccountType === 'demo') {
      console.log('[Signup] Creating demo project');
      
      try {
        const { data: demoProject } = await supabaseAdmin
          .from('projects')
          .insert({
            organization_id: organizationId,
            name: 'Projet Démo - Infrastructure Cloud',
            description: 'Découvrez le cockpit Powalyze avec ce projet de démonstration pré-configuré',
            sponsor: 'Direction IT',
            pm: `${firstName} ${lastName}`,
            business_unit: 'IT',
            budget: 500000,
            actual_cost: 325000,
            status: 'ACTIVE',
            rag_status: 'YELLOW',
            criticality: 'HIGH',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completion_percentage: 65,
            delay_probability: 35,
            created_by: user.id
          })
          .select()
          .single();

        if (demoProject) {
          console.log('[Signup] Demo project created:', demoProject.id);
          
          // Ajouter quelques données de démo (non bloquant)
          await supabaseAdmin.from('milestones').insert([
            {
              project_id: demoProject.id,
              title: 'Kickoff projet',
              due_date: '2025-08-01',
              status: 'COMPLETED',
              progress_percentage: 100,
              owner: 'Chef de Projet'
            },
            {
              project_id: demoProject.id,
              title: 'Phase de développement',
              due_date: '2026-01-20',
              status: 'IN_PROGRESS',
              progress_percentage: 75,
              owner: 'Tech Lead'
            }
          ]).then(() => console.log('[Signup] Demo milestones created'));

          await supabaseAdmin.from('risks').insert([
            {
              project_id: demoProject.id,
              title: 'Retard fournisseur infrastructure',
              description: 'Le fournisseur cloud accuse un retard',
              severity: 'HIGH',
              status: 'IDENTIFIED',
              probability: 80,
              impact: 7,
              owner: 'PMO'
            }
          ]).then(() => console.log('[Signup] Demo risks created'));
        }
      } catch (projectErr) {
        console.warn('[Signup] Demo project/data creation failed (non-blocking):', projectErr);
        // Non bloquant - on continue
      }
    }

    // Étape 4: Générer le token JWT
    const token = generateToken(user);

    // Étape 5: Définir le cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        accountType: user.account_type
      }
    });

    response.cookies.set('powalyze_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/'
    });

    console.log('[Signup] Signup process completed successfully for:', email);

    return response;

  } catch (error) {
    console.error('[Signup] Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Une erreur inattendue est survenue',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

