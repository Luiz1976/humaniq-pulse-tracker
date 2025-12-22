-- ============================================================================
-- HumaniQ AI - Website Content Automation
-- Cron Jobs Configuration
-- ============================================================================

-- Enable pg_cron extension (if not already enabled)
-- Run this in the Supabase SQL Editor:
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ============================================================================
-- Daily Content Generation Check
-- Runs every day at 00:00 UTC (21:00 Brazil time)
-- Checks all routes and generates content if scheduled
-- ============================================================================

SELECT cron.schedule(
  'website-daily-content-check',
  '0 0 * * *', -- Every day at midnight UTC
  $$
  SELECT net.http_post(
    url := 'https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-scheduler',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamdnanN4c3ZleHFyaHlpenJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU3NzA0MiwiZXhwIjoyMDgxMTUzMDQyfQ.xyemYkcdM7GfKEPK71fHJOxH3Iwv8iydIoEjRUZ6o6A"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- ============================================================================
-- Hourly Auto-Publish Check
-- Runs every hour to publish scheduled content
-- ============================================================================

SELECT cron.schedule(
  'website-hourly-publish',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT net.http_post(
    url := 'https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-publish-content',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamdnanN4c3ZleHFyaHlpenJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU3NzA0MiwiZXhwIjoyMDgxMTUzMDQyfQ.xyemYkcdM7GfKEPK71fHJOxH3Iwv8iydIoEjRUZ6o6A"}'::jsonb,
    body := '{"auto_mode": true}'::jsonb
  ) as request_id;
  $$
);

-- ============================================================================
-- Weekly Cleanup (Optional)
-- Runs every Sunday at 02:00 UTC to clean old logs
-- ============================================================================

SELECT cron.schedule(
  'website-weekly-cleanup',
  '0 2 * * 0', -- Every Sunday at 2 AM UTC
  $$
  DELETE FROM public.website_content_activity_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
  $$
);

-- ============================================================================
-- View Active Cron Jobs
-- ============================================================================

-- To see all scheduled jobs:
-- SELECT * FROM cron.job;

-- To see job run history:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- ============================================================================
-- Unschedule Jobs (if needed)
-- ============================================================================

-- To remove a cron job:
-- SELECT cron.unschedule('website-daily-content-check');
-- SELECT cron.unschedule('website-hourly-publish');
-- SELECT cron.unschedule('website-weekly-cleanup');

-- ============================================================================
-- Manual Testing
-- ============================================================================

-- Test the scheduler manually:
-- SELECT net.http_post(
--   url := 'https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-scheduler',
--   headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamdnanN4c3ZleHFyaHlpenJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU3NzA0MiwiZXhwIjoyMDgxMTUzMDQyfQ.xyemYkcdM7GfKEPK71fHJOxH3Iwv8iydIoEjRUZ6o6A"}'::jsonb
-- );

-- Test content generation manually:
-- SELECT net.http_post(
--   url := 'https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-generate-content',
--   headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamdnanN4c3ZleHFyaHlpenJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU3NzA0MiwiZXhwIjoyMDgxMTUzMDQyfQ.xyemYkcdM7GfKEPK71fHJOxH3Iwv8iydIoEjRUZ6o6A"}'::jsonb,
--   body := '{"route": "blog", "count": 1}'::jsonb
-- );
