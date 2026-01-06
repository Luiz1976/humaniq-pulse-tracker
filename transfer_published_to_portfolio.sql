-- Transfer all 'published' posts back to 'portfolio' (ready)
-- Run this script in your Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql)

UPDATE linkedin_posts
SET status = 'ready'
WHERE status = 'published';

-- Verify the count
SELECT count(*) as portfolio_posts FROM linkedin_posts WHERE status = 'ready';
