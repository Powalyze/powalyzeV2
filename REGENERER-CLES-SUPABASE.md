# 🔧 Régénération des clés Supabase

## Étape 1 : Aller sur Supabase Dashboard
1. Ouvrez : https://supabase.com/dashboard/project/pqsgdwfsdnmozzoynefw/settings/api
2. Vous verrez une section "Project API keys"

## Étape 2 : Copier les NOUVELLES clés
Copiez ces 3 valeurs EXACTEMENT comme affichées :

### Project URL
```
https://pqsgdwfsdnmozzoynefw.supabase.co
```

### anon public
Cliquez sur "Reveal" et copiez la clé complète qui commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### service_role secret
⚠️ IMPORTANT: Cliquez sur "Reveal" et copiez la clé complète.

## Étape 3 : Envoyer les clés
Envoyez-moi dans le chat les 2 clés (anon et service_role) sous cette forme:

```
ANON: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SERVICE: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Je vais les mettre à jour automatiquement dans Vercel et redéployer.

---

## Alternative : Régénérer les clés

Si vous voulez régénérer de NOUVELLES clés :

1. Sur la même page API settings
2. Trouvez "JWT Secret" 
3. Cliquez sur "Generate new JWT secret"
4. Suivez les étapes 2 et 3 ci-dessus avec les nouvelles clés
