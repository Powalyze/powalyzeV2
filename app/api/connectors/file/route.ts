import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

// Client service role pour les opérations qui nécessitent bypass RLS
const supabaseAdmin = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    console.log('🔍 [File Connector] Début de la requête');
    
    // Utiliser le client SSR qui gère automatiquement les cookies de session
    const supabase = await createClient();
    
    // Récupérer l'utilisateur depuis la session (cookies)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    console.log('🔍 [File Connector] Vérification auth:', {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
      errorMessage: authError?.message,
      errorName: authError?.name
    });

    if (authError || !user) {
      console.error('❌ [File Connector] Utilisateur non authentifié:', authError?.message);
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    console.log('✅ [File Connector] User authentifié:', user.id, user.email);

    // Récupérer et parser le fichier
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    let text = await file.text();
    
    // Supprimer le BOM UTF-8 (caractère invisible 0xFEFF / 65279)
    if (text.charCodeAt(0) === 0xFEFF) {
      text = text.substring(1);
      console.log('🔧 [File Connector] BOM UTF-8 supprimé');
    }
    
    // Détecter automatiquement le délimiteur
    const firstLine = text.split('\n')[0];
    let delimiter = ',';
    
    if (firstLine.includes(';')) {
      delimiter = ';';
    } else if (firstLine.includes('\t')) {
      delimiter = '\t';
    }
    
    console.log('📋 [File Connector] Détection délimiteur:', {
      delimiter: delimiter === '\t' ? 'TAB' : delimiter,
      firstLine: firstLine.substring(0, 100)
    });
    
    let records;
    try {
      records = parse(text, { 
        columns: true, 
        skip_empty_lines: true,
        delimiter: delimiter,
        relax_quotes: true,
        trim: true,
        skip_records_with_error: true
      });
    } catch (parseError: any) {
      console.error('❌ [File Connector] Parse error:', parseError);
      return NextResponse.json({ 
        error: `Erreur de parsing CSV: ${parseError.message}. Assurez-vous que votre fichier utilise des virgules ou points-virgules comme séparateur.` 
      }, { status: 400 });
    }

    console.log('📋 [File Connector] Fichier parsé:', {
      filename: file.name,
      rowCount: records.length,
      columns: records[0] ? Object.keys(records[0]) : []
    });

    // Mapping des colonnes CSV vers le schéma Powalyze
    // Utiliser user_id ou owner_id selon le schéma de la table projects dans Supabase
    const mapped = records.map((r: any) => ({
      name: r['Nom projet'] || r['Project Name'] || r['name'] || 'Projet sans nom',
      description: r['Description'] || r['description'] || null,
      owner_id: user.id, // Propriétaire = utilisateur qui importe
      status: mapStatus(r['Statut'] || r['Status'] || r['status']),
      start_date: r['Début'] || r['Start Date'] || r['start_date'] || null,
      end_date: r['Fin'] || r['End Date'] || r['end_date'] || null,
      progress: parseFloat(r['Progression'] || r['Progress'] || r['progress'] || '0'),
      // Champs optionnels
      budget_planned: parseFloat(r['Budget prévu'] || r['Planned Budget'] || r['budget_planned'] || '0') || null,
      budget_spent: parseFloat(r['Budget consommé'] || r['Spent Budget'] || r['budget_spent'] || '0') || null,
    }));

    console.log('🔄 [File Connector] Données mappées:', {
      count: mapped.length,
      sample: mapped[0]
    });

    // Insertion dans Supabase avec le client ADMIN pour bypass RLS
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(mapped)
      .select();

    if (error) {
      console.error('❌ [File Connector] Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ [File Connector] Projets insérés:', data?.length);

    // Enregistrer le connecteur
    await supabaseAdmin.from('connectors').insert({
      user_id: user.id,
      name: file.name,
      connector_type: 'file',
      status: 'active',
      last_sync: new Date().toISOString(),
      metadata: {
        filename: file.name,
        rows_imported: mapped.length
      }
    });

    return NextResponse.json({ 
      imported: mapped.length,
      projects: data
    });
  } catch (error: any) {
    console.error('[File Connector] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function mapStatus(status: string): string {
  const normalized = status?.toLowerCase().trim();
  const statusMap: Record<string, string> = {
    'planifié': 'planned',
    'planned': 'planned',
    'en cours': 'in_progress',
    'in progress': 'in_progress',
    'actif': 'in_progress',
    'active': 'in_progress',
    'en attente': 'on_hold',
    'on hold': 'on_hold',
    'pause': 'on_hold',
    'terminé': 'done',
    'done': 'done',
    'completed': 'done',
    'annulé': 'cancelled',
    'cancelled': 'cancelled',
    'canceled': 'cancelled'
  };
  return statusMap[normalized] || 'planned';
}
