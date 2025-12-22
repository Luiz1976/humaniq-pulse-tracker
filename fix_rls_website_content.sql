-- ====================================================================
-- CORREÇÃO: Verificar e Ajustar Políticas RLS
-- ====================================================================

-- 1. PRIMEIRO: Ver todas as políticas atuais
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'website_content_posts';

-- 2. Remover TODAS as políticas antigas de SELECT para authenticated
-- (ignora se não existir)
DROP POLICY IF EXISTS "Authenticated users can view published content" ON website_content_posts;
DROP POLICY IF EXISTS "Authenticated users can view all content posts" ON website_content_posts;
DROP POLICY IF EXISTS "Authenticated users can view all content" ON website_content_posts;

-- 3. Criar política NOVA que permite authenticated ver TODOS os posts
CREATE POLICY "Authenticated can view all posts"
ON website_content_posts FOR SELECT
TO authenticated
USING (true);

-- 4. VERIFICAR que funcionou
SET ROLE authenticated;
SELECT 
  id,
  route,
  title,
  status,
  created_at
FROM website_content_posts
ORDER BY created_at DESC
LIMIT 5;
RESET ROLE;

-- Deve mostrar posts com qualquer status (draft, scheduled, published)
