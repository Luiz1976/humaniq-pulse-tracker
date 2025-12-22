-- Verificar se as imagens foram geradas e qual o problema

-- 1. Ver os posts e seus image_url
SELECT 
  id,
  title,
  image_url,
  created_at
FROM website_content_posts
ORDER BY created_at DESC
LIMIT 5;

-- 2. Ver registros na tabela de imagens
SELECT 
  post_id,
  url,
  alt_text,
  width,
  height,
  created_at
FROM website_content_images
ORDER BY created_at DESC
LIMIT 5;

-- 3. Ver logs detalhados da geração de conteúdo
SELECT 
  log_type,
  message,
  details,
  created_at
FROM website_content_activity_logs
WHERE action = 'generate_content'
ORDER BY created_at DESC
LIMIT 5;

-- 4. Ver se há erros de geração de imagem
SELECT 
  log_type,
  action,
  message,
  details,
  created_at
FROM website_content_activity_logs
WHERE log_type = 'error'
  OR message LIKE '%image%'
  OR message LIKE '%Image%'
ORDER BY created_at DESC
LIMIT 10;
