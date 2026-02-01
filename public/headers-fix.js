/**
 * 🔥 CRITICAL FIX: Headers ISO-8859-1 Protection (Vanilla JS)
 * 
 * Script chargé en PREMIER via <script> dans le HTML
 * pour garantir le patch AVANT React et tout autre code
 */

(function() {
  'use strict';
  
  if (typeof Headers === 'undefined') return;
  
  var originalSet = Headers.prototype.set;
  var originalAppend = Headers.prototype.append;
  
  // Fonction de nettoyage
  function cleanValue(value) {
    // Supprimer TOUS les caractères non-ASCII
    return String(value).replace(/[^\x00-\x7F]/g, '');
  }
  
  // Patch Headers.set()
  Headers.prototype.set = function(name, value) {
    return originalSet.call(this, name, cleanValue(value));
  };
  
  // Patch Headers.append()
  Headers.prototype.append = function(name, value) {
    return originalAppend.call(this, name, cleanValue(value));
  };
  
  console.log('✅ Headers ISO-8859-1 protection active');
})();
