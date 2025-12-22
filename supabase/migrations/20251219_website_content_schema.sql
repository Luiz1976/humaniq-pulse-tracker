-- ============================================================================
-- HumaniQ AI - Website Content Automation System
-- Migration: Website Content Schema
-- Created: 2025-12-19
-- ============================================================================

-- Table: website_content_posts
-- Stores all generated content for the website routes
CREATE TABLE public.website_content_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route TEXT NOT NULL CHECK (route IN ('blog', 'nr01', 'riscos-psicossociais', 'software-nr01', 'faq')),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  image_alt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,
  priority TEXT NOT NULL CHECK (priority IN ('maximum', 'high', 'medium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: website_content_schedule
-- Controls automatic content generation schedule per route
CREATE TABLE public.website_content_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route TEXT NOT NULL UNIQUE CHECK (route IN ('blog', 'nr01', 'riscos-psicossociais', 'software-nr01', 'faq')),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'bimonthly', 'quarterly')),
  priority TEXT NOT NULL CHECK (priority IN ('maximum', 'high', 'medium')),
  last_generated_at TIMESTAMP WITH TIME ZONE,
  next_scheduled_at TIMESTAMP WITH TIME ZONE,
  auto_publish_enabled BOOLEAN DEFAULT false,
  auto_generate_enabled BOOLEAN DEFAULT true,
  posts_per_generation INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: website_content_images
-- Stores images associated with content posts
CREATE TABLE public.website_content_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES website_content_posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  width INTEGER,
  height INTEGER,
  format TEXT CHECK (format IN ('jpg', 'png', 'webp', 'svg')),
  size_bytes INTEGER,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: website_content_versions
-- Stores version history for content reuse and tracking
CREATE TABLE public.website_content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES website_content_posts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  changed_by TEXT,
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: website_content_activity_logs
-- Logs all system activities for monitoring
CREATE TABLE public.website_content_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_type TEXT NOT NULL CHECK (log_type IN ('success', 'error', 'warning', 'info')),
  action TEXT NOT NULL,
  route TEXT,
  post_id UUID REFERENCES website_content_posts(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_content_posts_route ON public.website_content_posts(route);
CREATE INDEX idx_content_posts_status ON public.website_content_posts(status);
CREATE INDEX idx_content_posts_scheduled ON public.website_content_posts(scheduled_for) WHERE status = 'scheduled';
CREATE INDEX idx_content_posts_published ON public.website_content_posts(published_at) WHERE status = 'published';
CREATE INDEX idx_content_posts_slug ON public.website_content_posts(slug);
CREATE INDEX idx_content_versions_post_id ON public.website_content_versions(post_id);
CREATE INDEX idx_content_images_post_id ON public.website_content_images(post_id);
CREATE INDEX idx_content_logs_created ON public.website_content_activity_logs(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.website_content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content_activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for Edge Functions)
CREATE POLICY "Service role has full access to content posts"
ON public.website_content_posts FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to content schedule"
ON public.website_content_schedule FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to content images"
ON public.website_content_images FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to content versions"
ON public.website_content_versions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to content logs"
ON public.website_content_activity_logs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated users read access
CREATE POLICY "Authenticated users can view published content"
ON public.website_content_posts FOR SELECT
TO authenticated
USING (status = 'published');

CREATE POLICY "Authenticated users can view content schedule"
ON public.website_content_schedule FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view content images"
ON public.website_content_images FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view content logs"
ON public.website_content_activity_logs FOR SELECT
TO authenticated
USING (true);

-- Allow public (anon) read access to published content
CREATE POLICY "Public can view published content"
ON public.website_content_posts FOR SELECT
TO anon
USING (status = 'published');

CREATE POLICY "Public can view content images"
ON public.website_content_images FOR SELECT
TO anon
USING (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE TRIGGER update_website_content_posts_updated_at
BEFORE UPDATE ON public.website_content_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_content_schedule_updated_at
BEFORE UPDATE ON public.website_content_schedule
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create version history on content update
CREATE OR REPLACE FUNCTION public.create_content_version()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.title IS DISTINCT FROM NEW.title) OR (OLD.content IS DISTINCT FROM NEW.content) THEN
    INSERT INTO public.website_content_versions (
      post_id,
      version_number,
      title,
      content,
      excerpt,
      meta_title,
      meta_description,
      keywords,
      changed_by
    ) VALUES (
      OLD.id,
      OLD.version,
      OLD.title,
      OLD.content,
      OLD.excerpt,
      OLD.meta_title,
      OLD.meta_description,
      OLD.keywords,
      current_user
    );
    
    NEW.version = OLD.version + 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER create_content_version_on_update
BEFORE UPDATE ON public.website_content_posts
FOR EACH ROW EXECUTE FUNCTION public.create_content_version();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default schedule configuration
INSERT INTO public.website_content_schedule (route, frequency, priority, auto_generate_enabled, posts_per_generation) VALUES
  ('blog', 'weekly', 'maximum', true, 1),
  ('nr01', 'monthly', 'maximum', true, 1),
  ('riscos-psicossociais', 'bimonthly', 'high', true, 1),
  ('software-nr01', 'quarterly', 'high', true, 1),
  ('faq', 'quarterly', 'medium', true, 1);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate next scheduled date based on frequency
CREATE OR REPLACE FUNCTION public.calculate_next_schedule(
  p_frequency TEXT,
  p_from_date TIMESTAMP WITH TIME ZONE DEFAULT now()
)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  RETURN CASE p_frequency
    WHEN 'weekly' THEN p_from_date + INTERVAL '7 days'
    WHEN 'monthly' THEN p_from_date + INTERVAL '1 month'
    WHEN 'bimonthly' THEN p_from_date + INTERVAL '2 months'
    WHEN 'quarterly' THEN p_from_date + INTERVAL '3 months'
    ELSE p_from_date + INTERVAL '1 month'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to generate unique slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(p_title TEXT, p_route TEXT)
RETURNS TEXT AS $$
DECLARE
  v_slug TEXT;
  v_counter INTEGER := 0;
  v_final_slug TEXT;
BEGIN
  -- Convert to lowercase and replace spaces with hyphens
  v_slug := lower(regexp_replace(p_title, '[^a-zA-Z0-9\s-]', '', 'g'));
  v_slug := regexp_replace(v_slug, '\s+', '-', 'g');
  v_slug := regexp_replace(v_slug, '-+', '-', 'g');
  v_slug := trim(both '-' from v_slug);
  
  -- Add route prefix
  v_slug := p_route || '-' || v_slug;
  
  v_final_slug := v_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM public.website_content_posts WHERE slug = v_final_slug) LOOP
    v_counter := v_counter + 1;
    v_final_slug := v_slug || '-' || v_counter::TEXT;
  END LOOP;
  
  RETURN v_final_slug;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for activity logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.website_content_activity_logs;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.website_content_posts IS 'Stores all generated content for HumaniQ AI website routes';
COMMENT ON TABLE public.website_content_schedule IS 'Controls automatic content generation schedule and settings';
COMMENT ON TABLE public.website_content_images IS 'Stores images associated with content posts';
COMMENT ON TABLE public.website_content_versions IS 'Version history for content tracking and reuse';
COMMENT ON TABLE public.website_content_activity_logs IS 'Activity logs for monitoring and debugging';
