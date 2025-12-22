-- Update LinkedIn posting schedule to once daily
-- Migration: Change from hourly to daily posts

BEGIN;

-- Update linkedin_settings to post once per day
UPDATE linkedin_settings
SET 
  post_interval_minutes = 1440,  -- 24 hours = 1440 minutes
  post_start_hour = 10,           -- Start posting at 10 AM
  post_end_hour = 11,             -- End posting window at 11 AM (1 hour window)
  updated_at = NOW()
WHERE auto_post_enabled = true;

COMMIT;

-- Verification query (for manual checking)
-- SELECT id, account_id, auto_post_enabled, post_interval_minutes, 
--        post_start_hour, post_end_hour, last_post_at
-- FROM linkedin_settings;
