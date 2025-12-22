-- ==================================================================
-- CONFIGURAÇÃO: Frequência Automática Ideal - Website Content
-- ==================================================================
-- Execute no SQL Editor do Supabase
-- URL: https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql/new
-- ==================================================================

BEGIN;

-- Limpar configurações anteriores
DELETE FROM website_content_schedule;

-- ==================================================================
-- 1. BLOG - 1 por dia (Segunda a Sexta) = 5x/semana
-- ==================================================================
-- Crescimento orgânico constante
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES 
  ('blog', 1, 10, 'high', true),   -- Segunda às 10h
  ('blog', 2, 10, 'high', true),   -- Terça às 10h
  ('blog', 3, 10, 'high', true),   -- Quarta às 10h
  ('blog', 4, 10, 'high', true),   -- Quinta às 10h
  ('blog', 5, 10, 'high', true);   -- Sexta às 10h

-- ==================================================================
-- 2. NR01 - Mensal (1x por mês)
-- ==================================================================
-- Página pilar - conteúdo profundo e bem elaborado
-- Primeira segunda do mês (scheduler controla intervalo)
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES 
  ('nr01', 1, 14, 'high', true);   -- Segunda às 14h

-- ==================================================================
-- 3. RISCOS-PSICOSSOCIAIS - Bimestral (a cada 2 meses)
-- ==================================================================
-- Conteúdo base técnico
-- Primeira quarta de meses pares (scheduler controla intervalo)
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES 
  ('riscos-psicossociais', 3, 11, 'medium', true);   -- Quarta às 11h

-- ==================================================================
-- 4. SOFTWARE-NR01 - Trimestral (a cada 3 meses)
-- ==================================================================
-- Foco em conversão
-- Primeira quinta de trimestre (jan/abr/jul/out)
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES 
  ('software-nr01', 4, 15, 'medium', true);   -- Quinta às 15h

-- ==================================================================
-- 5. FAQ - Trimestral (a cada 3 meses)
-- ==================================================================
-- Otimização para rich snippets
-- Primeira sexta de trimestre (fev/mai/ago/nov)
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES 
  ('faq', 5, 16, 'low', true);   -- Sexta às 16h

COMMIT;

-- ==================================================================
-- VERIFICAÇÃO: Ver configuração criada
-- ==================================================================
SELECT 
  route AS "Rota",
  CASE day_of_week
    WHEN 1 THEN 'Segunda'
    WHEN 2 THEN 'Terça'
    WHEN 3 THEN 'Quarta'
    WHEN 4 THEN 'Quinta'
    WHEN 5 THEN 'Sexta'
  END AS "Dia",
  hour || ':00' AS "Horário",
  CASE priority
    WHEN 'high' THEN 'Alta'
    WHEN 'medium' THEN 'Média'
    WHEN 'low' THEN 'Baixa'
  END AS "Prioridade",
  CASE 
    WHEN auto_generate_enabled THEN '✅ Ativo'
    ELSE '❌ Pausado'
  END AS "Status"
FROM website_content_schedule
ORDER BY route, day_of_week;

-- ==================================================================
-- RESUMO DA CONFIGURAÇÃO
-- ==================================================================
SELECT 
  '
  ══════════════════════════════════════════════════════
  📅 FREQUÊNCIAS CONFIGURADAS
  ══════════════════════════════════════════════════════
  
  /blog
    → 5x por semana (Seg-Sex às 10h)
    → Crescimento orgânico constante
  
  /nr01
    → 1x por mês (Segunda às 14h)
    → Página pilar - conteúdo profundo
  
  /riscos-psicossociais
    → Bimestral (Quarta às 11h)
    → Conteúdo base técnico
  
  /software-nr01
    → Trimestral (Quinta às 15h)
    → Foco em conversão
  
  /faq
    → Trimestral (Sexta às 16h)
    → Rich snippets e SEO
  
  ══════════════════════════════════════════════════════
  ⚠️ IMPORTANTE:
  
  Para rotas MENSAIS, BIMESTRAIS e TRIMESTRAIS:
  O website-scheduler verificará automaticamente se já 
  postou recentemente e aguardará o intervalo correto 
  antes de gerar novo conteúdo.
  
  ══════════════════════════════════════════════════════
  ' AS resumo;
