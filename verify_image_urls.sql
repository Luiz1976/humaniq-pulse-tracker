-- Verificar se os posts têm image_url preenchido

SELECT 
  id,
  title,
  image_url,
  LENGTH(image_url) as url_length,
  CASE 
    WHEN image_url IS NULL THEN 'NULL'
    WHEN image_url = '' THEN 'EMPTY'
    ELSE 'HAS_VALUE'
  END as url_status
FROM website_content_posts
ORDER BY created_at DESC
LIMIT 5;
