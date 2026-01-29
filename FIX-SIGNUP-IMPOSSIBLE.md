# 🔧 Fix: Impossible de créer un compte

## Diagnostic

Le problème vient du fait que **le schéma de base de données n'est pas appliqué sur Supabase**.

## Solution

### Étape 1: Tester la connexion

1. Allez sur : **https://www.powalyze.com/test-supabase-connection**
2. Cliquez sur "Tester la connexion"
3. Si vous voyez des ❌ "Table xxx doesn't exist" → Passez à l'étape 2

### Étape 2: Appliquer le schéma SQL

#### Option A: Via le Dashboard Supabase (recommandé)

1. **Ouvrir le SQL Editor** :
   ```
   https://supabase.com/dashboard/project/pqsgdwfsdnmozzoynefw/editor/sql
   ```

2. **Créer une nouvelle requête** (bouton "+ New Query")

3. **Copier-coller le contenu** du fichier `supabase/schema.sql`

4. **Exécuter** (bouton "Run" ou Ctrl+Enter)

5. **Vérifier** : Retournez sur `/test-supabase-connection` - vous devriez voir des ✅

#### Option B: Via Supabase CLI (si installé)

```bash
npx supabase db push
```

### Étape 3: Tester la création de compte

1. Allez sur : **https://www.powalyze.com/signup**
2. Entrez un email et mot de passe (6 caractères min)
3. Cliquez sur "Entrer dans le cockpit Demo"
4. Vous devriez être redirigé vers `/cockpit/demo` avec des données d'exemple

## Erreurs détaillées

Maintenant, si vous rencontrez une erreur lors du signup, vous verrez un message détaillé :
- `"Table xxx doesn't exist"` → Le schéma n'est pas appliqué
- `"RLS policy violation"` → Problème de permissions (contactez-nous)
- `"Email already exists"` → Essayez un autre email

## Vérification finale

Une fois le schéma appliqué :
1. ✅ `/test-supabase-connection` → Toutes les tables existent
2. ✅ `/signup` → Création de compte fonctionne
3. ✅ `/cockpit/demo` → Dashboard avec données d'exemple

## Support

Si le problème persiste après avoir appliqué le schéma :
- Vérifiez que vous êtes connecté au bon projet Supabase (pqsgdwfsdnmozzoynefw)
- Vérifiez que les variables d'environnement sur Vercel sont correctes
- Regardez les logs dans la console du navigateur (F12)
