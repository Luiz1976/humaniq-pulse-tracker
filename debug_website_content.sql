-- ====================================================================
-- DIAGNÓSTICO COMPLETO - Dashboard Website Content
-- Execute estas queries no Supabase SQL Editor para diagnosticar
-- ====================================================================

-- 1. VERIFICAR SE HÁ POSTS CRIADOS
-- Deve mostrar pelo menos 1 post se a geração funcionou
SELECT 
  id,
  route,
  title,
  status,
  priority,
  image_url,
  created_at
FROM website_content_posts
ORDER BY created_at DESC
LIMIT 10;

-- 2. CONTAR POSTS POR STATUS
-- Deve mostrar quantos posts existem em cada estado
SELECT 
  status,
  COUNT(*) as total
FROM website_content_posts
GROUP BY status;

-- 3. VERIFICAR LOGS DE GERAÇÃO
-- Deve mostrar os últimos logs de geração
SELECT 
  log_type,
  action,
  route,
  message,
  details,
  created_at
FROM website_content_activity_logs
WHERE action = 'generate_content'
ORDER BY created_at DESC
LIMIT 10;

-- 4. VERIFICAR POLÍTICAS RLS
-- Importante: verificar se authenticated users podem ler posts
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'website_content_posts';

-- 5. TESTAR ACESSO COMO AUTHENTICATED USER
-- Esta query simula o que o frontend vê
SET ROLE authenticated;
SELECT COUNT(*) as "Posts visiveis para authenticated"
FROM website_content_posts;
RESET ROLE;

-- 6. TESTAR ACESSO COMO ANON
-- Esta query simula o que usuários não autenticados veem
SET ROLE anon;
SELECT COUNT(*) as "Posts visiveis para anon"
FROM website_content_posts;
RESET ROLE;

-- 7. VERIFICAR SE RLS ESTÁ HABILITADO
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN (
  'website_content_posts',
  'website_content_schedule',
  'website_content_images',
  'website_content_activity_logs'
);

-- ====================================================================
-- SOLUÇÕES POSSÍVEIS
-- ====================================================================

-- Se nenhum post foi encontrado na query #1, o problema é na geração
-- Execute esta query para verificar erros nos logs:
SELECT *
FROM website_content_activity_logs
WHERE log_type = 'error'
ORDER BY created_at DESC
LIMIT 10;

-- Se posts existem mas não são visíveis (query #5 retorna 0):
-- SOLUÇÃO A: Adicionar política para authenticated users verem TODOS os posts
CREATE POLICY "Authenticated users can view all content"
ON website_content_posts FOR SELECT
TO authenticated
USING (true);

-- SOLUÇÃO B: Se já existe política mas só mostra published, alterar para:
DROP POLICY IF EXISTS "Authenticated users can view published content" ON website_content_posts;
CREATE POLICY "Authenticated users can view all content posts"
ON website_content_posts FOR SELECT
TO authenticated
USING (true);

-- ====================================================================
-- RESULTADO ESPERADO
-- ====================================================================
-- Query #1: Deve mostrar 1 ou mais posts
-- Query #2: Deve mostrar contagem por status (draft, scheduled, published)
-- Query #3: Deve mostrar logs de sucesso recentes
-- Query #4: Deve mostrar políticas RLS configuradas
-- Query #5: Deve retornar número > 0
-- Query #6: Deve retornar apenas posts published
