-- Atualizar posts existentes sem imagem com placeholders

UPDATE website_content_posts
SET image_url = 'https://via.placeholder.com/1280x720/0A85D1/FFFFFF?text=HumaniQ+AI+-+' || 
                REPLACE(SUBSTRING(title FROM 1 FOR 50), ' ', '+')
WHERE image_url IS NULL 
   OR image_url = '';

-- Verificar resultado
SELECT 
  id,
  LEFT(title, 50) as title,
  status,
  CASE 
    WHEN image_url IS NOT NULL AND image_url != '' THEN 'Com imagem'
    ELSE 'Sem imagem'
  END as image_status
FROM website_content_posts
ORDER BY created_at DESC
LIMIT 10;
