-- ============================================================================
-- STORAGE RLS POLICIES POUR LE BUCKET "documents"
-- À configurer dans Supabase Dashboard → Storage → documents → Policies
-- ============================================================================

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Policy 1 : Upload (INSERT)
CREATE POLICY "Users can upload their own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2 : Read (SELECT)
CREATE POLICY "Users can read their own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3 : Delete (DELETE)
CREATE POLICY "Users can delete their own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- EXPLICATION DES POLICIES
-- ============================================================================
-- Les fichiers sont stockés avec la structure : user-{uuid}/{timestamp}-{filename}
-- (storage.foldername(name))[1] extrait "user-{uuid}" du path complet
-- auth.uid()::text contient l'UUID de l'utilisateur connecté
-- La comparaison garantit qu'un user ne peut accéder qu'à ses propres fichiers
