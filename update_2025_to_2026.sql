-- Update website_content_posts
UPDATE website_content_posts
SET 
  title = REPLACE(title, '2025', '2026'),
  excerpt = REPLACE(excerpt, '2025', '2026'),
  content = REPLACE(content, '2025', '2026')
WHERE 
  title LIKE '%2025%' OR 
  excerpt LIKE '%2025%' OR 
  content LIKE '%2025%';

-- Update linkedin_posts
UPDATE linkedin_posts
SET 
  content = REPLACE(content, '2025', '2026')
WHERE 
  content LIKE '%2025%';
