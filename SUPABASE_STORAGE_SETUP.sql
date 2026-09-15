-- FASE 2.1: Supabase Storage Setup - RLS Policies for model-files bucket
-- Run this SQL in Supabase SQL Editor after creating the bucket

-- ============================================================================
-- PREREQUISITE: Create bucket via Supabase Dashboard or CLI
-- bucket name: "model-files"
-- Privacy: PRIVATE
-- ============================================================================

-- Enable RLS on storage.objects (should already be enabled, but ensure it)
ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICY 1: Users can upload to their own folder (users/{userId}/*)
-- ============================================================================
CREATE POLICY "Users can upload to own folder" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'model-files'
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- ============================================================================
-- POLICY 2: Users can read their own files
-- ============================================================================
CREATE POLICY "Users can read own files" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'model-files'
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- ============================================================================
-- POLICY 3: Users can delete their own files
-- ============================================================================
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'model-files'
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- ============================================================================
-- POLICY 4: Sellers can read ModelFiles attached to their QuoteRequests
-- NOTE: This requires a JOIN with public schema, which storage.objects cannot do directly
-- WORKAROUND: Implement seller access check in application code (backend API)
-- For now, we'll add a comment and handle in the upload endpoint
-- ============================================================================
-- Sellers will verify access in: POST /api/upload/model and GET /api/files/{fileId}
-- The backend will check: QuoteRequest where modelFileId = this file AND sellerId = current seller

-- ============================================================================
-- POLICY 5: Unauthenticated users cannot access
-- ============================================================================
CREATE POLICY "Block unauthenticated access" ON storage.objects
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- NOTES:
-- 1. URL signing (signed URLs with 1-hour expiration) is handled in application code
-- 2. Seller access to QuoteRequest files will be validated in backend API
-- 3. All requests must go through POST /api/upload/model endpoint for validation
-- ============================================================================
