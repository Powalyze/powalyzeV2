# GUIDE APPLICATION SCHEMA POWER BI DANS SUPABASE

## Option 1: Via Supabase Dashboard (RECOMMANDÉ)

1. **Ouvrir Supabase**:
   - URL: https://pqsgdwfsdnmozzoynefw.supabase.co
   - Se connecter avec compte admin

2. **Aller au SQL Editor**:
   - Menu gauche → SQL Editor
   - Cliquer "New query"

3. **Copier-coller le schema**:
   - Ouvrir: `database/schema-powerbi-integration.sql`
   - Copier TOUT le contenu
   - Coller dans l'éditeur SQL

4. **Exécuter**:
   - Cliquer "Run" (ou Ctrl+Enter)
   - Vérifier: "Success. No rows returned"

5. **Vérifier les tables créées**:
   - Menu gauche → Table Editor
   - Chercher: `api_keys`, `api_logs`, `powerbi_models`
   - Vérifier colonnes et RLS policies actives

---

## Option 2: Via API REST Supabase

Utiliser le script PowerShell fourni:

```powershell
# Fichier: apply-powerbi-schema.ps1

$SUPABASE_URL = "https://pqsgdwfsdnmozzoynefw.supabase.co"
$SERVICE_ROLE_KEY = "votre_service_role_key_depuis_.env.local"

$schema = Get-Content -Path "database/schema-powerbi-integration.sql" -Raw

$headers = @{
    "apikey" = $SERVICE_ROLE_KEY
    "Authorization" = "Bearer $SERVICE_ROLE_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    query = $schema
} | ConvertTo-Json

Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" -Method Post -Headers $headers -Body $body

Write-Host "Schema appliqué avec succès!" -ForegroundColor Green
```

Exécuter:
```powershell
.\apply-powerbi-schema.ps1
```

---

## Option 3: Via psql (ligne de commande)

**Prérequis**: PostgreSQL client installé

```bash
# Récupérer les credentials Supabase
SUPABASE_DB_URL="postgresql://postgres:[PASSWORD]@db.pqsgdwfsdnmozzoynefw.supabase.co:5432/postgres"

# Appliquer le schema
psql $SUPABASE_DB_URL -f database/schema-powerbi-integration.sql
```

**Note**: Le mot de passe DB est différent de la service_role_key. Voir Settings → Database.

---

## Vérification Post-Application

### 1. Vérifier les tables
```sql
select table_name 
from information_schema.tables 
where table_schema = 'public' 
  and table_name in ('api_keys', 'api_logs', 'powerbi_models');
```

**Résultat attendu**: 3 lignes

### 2. Vérifier les RLS policies
```sql
select tablename, policyname 
from pg_policies 
where tablename in ('api_keys', 'api_logs', 'powerbi_models');
```

**Résultat attendu**: Minimum 5 policies

### 3. Vérifier les indexes
```sql
select indexname 
from pg_indexes 
where tablename in ('api_keys', 'api_logs', 'powerbi_models');
```

**Résultat attendu**: Minimum 4 indexes

---

## Problèmes Courants

### Erreur: "relation already exists"
**Cause**: Tables déjà créées  
**Solution**: Ajouter `drop table if exists api_keys cascade;` avant create table

### Erreur: "permission denied"
**Cause**: Pas les droits admin  
**Solution**: Utiliser service_role_key (pas anon_key)

### Erreur: "foreign key constraint"
**Cause**: Tables `organizations` ou `profiles` manquantes  
**Solution**: Appliquer d'abord le schema principal (schema.sql)

---

## Prochaine Étape: Upload des modèles .pbix

1. **Créer bucket Supabase Storage**:
   - Aller à: Storage → New bucket
   - Nom: `powerbi-models`
   - Public: Oui

2. **Upload les fichiers**:
   - Executive_Dashboard.pbix
   - Portfolio_View.pbix
   - Risk_Heatmap.pbix
   - Financial_Tracking.pbix

3. **Insérer métadonnées**:
```sql
insert into powerbi_models (name, description, file_url, category, is_pro_only) values
('Executive Dashboard', 'RAG status, KPI, tendances', 'https://[PROJECT].supabase.co/storage/v1/object/public/powerbi-models/Executive_Dashboard.pbix', 'executive', false),
('Portfolio View', 'Vue multi-projets avec budget', 'https://[PROJECT].supabase.co/storage/v1/object/public/powerbi-models/Portfolio_View.pbix', 'portfolio', false),
('Risk Heatmap', 'Cartographie dynamique des risques', 'https://[PROJECT].supabase.co/storage/v1/object/public/powerbi-models/Risk_Heatmap.pbix', 'risk', true),
('Financial Tracking', 'Coûts, CAPEX/OPEX, forecast', 'https://[PROJECT].supabase.co/storage/v1/object/public/powerbi-models/Financial_Tracking.pbix', 'financial', true);
```

---

**FIN DU GUIDE** ✅
