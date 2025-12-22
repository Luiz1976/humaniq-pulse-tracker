-- ============================================================================
-- HumaniQ AI - Website Content Image Support
-- Migration: Add Storage Bucket and Policies
-- Created: 2025-12-20
-- ============================================================================

-- Create storage bucket for website content images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'website-content-images',
  'website-content-images',
  true, -- Public bucket for serving images on website
  5242880, -- 5MB max file size
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Allow service role to upload images
CREATE POLICY "Service role can upload website content images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'website-content-images');

-- Allow service role to update images
CREATE POLICY "Service role can update website content images"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'website-content-images');

-- Allow service role to delete images
CREATE POLICY "Service role can delete website content images"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'website-content-images');

-- Allow public read access to images
CREATE POLICY "Public can view website content images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'website-content-images');

-- ============================================================================
-- HELPER FUNCTION
-- ============================================================================

-- Function to clean up orphaned images (images without associated posts)
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_images()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Delete image records that reference non-existent posts
  DELETE FROM public.website_content_images
  WHERE post_id NOT IN (SELECT id FROM public.website_content_posts);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.cleanup_orphaned_images() IS 'Removes image records that reference deleted posts';
