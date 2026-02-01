/**
 * 🔥 CRITICAL FIX: Headers ISO-8859-1 Protection
 * 
 * Ce fichier DOIT être importé en PREMIER dans layout.tsx
 * pour garantir que le patch est appliqué avant toute autre initialisation
 */

// Vérification environnement client
if (typeof window !== 'undefined' && typeof Headers !== 'undefined') {
  const originalSet = Headers.prototype.set;
  const originalAppend = Headers.prototype.append;
  
  // Patch Headers.set()
  Headers.prototype.set = function(name: string, value: string) {
    // Supprimer tous les caractères non-ASCII
    const cleanValue = String(value).replace(/[^\x00-\x7F]/g, '');
    return originalSet.call(this, name, cleanValue);
  };
  
  // Patch Headers.append()
  Headers.prototype.append = function(name: string, value: string) {
    // Supprimer tous les caractères non-ASCII
    const cleanValue = String(value).replace(/[^\x00-\x7F]/g, '');
    return originalAppend.call(this, name, cleanValue);
  };
}

// Export vide pour permettre l'import
export {};
