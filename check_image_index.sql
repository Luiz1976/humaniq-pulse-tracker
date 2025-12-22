-- Verificar posts com image_index problemático
SELECT 
  id,
  title,
  image_index,
  status,
  created_at
FROM linkedin_posts
WHERE status = 'ready'
ORDER BY created_at ASC
LIMIT 10;
