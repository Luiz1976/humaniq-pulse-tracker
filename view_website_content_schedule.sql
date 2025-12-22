-- ==================================================================
-- 📅 PROGRAMAÇÃO COMPLETA - WEBSITE CONTENT
-- ==================================================================
-- Execute no SQL Editor do Supabase
-- URL: https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql/new
-- ==================================================================

-- Visualização detalhada da programação por rota
SELECT 
  -- Identificação
  UPPER(route) AS "📂 ROTA",
  
  -- Status
  CASE 
    WHEN auto_generate_enabled THEN '✅ ATIVO'
    ELSE '❌ PAUSADO'
  END AS "STATUS",
  
  -- Dia da semana
  CASE day_of_week
    WHEN 0 THEN '0 - Domingo'
    WHEN 1 THEN '1 - Segunda-feira'
    WHEN 2 THEN '2 - Terça-feira'
    WHEN 3 THEN '3 - Quarta-feira'
    WHEN 4 THEN '4 - Quinta-feira'
    WHEN 5 THEN '5 - Sexta-feira'
    WHEN 6 THEN '6 - Sábado'
  END AS "📅 DIA DA SEMANA",
  
  -- Horário
  LPAD(hour::text, 2, '0') || ':00 BRT' AS "⏰ HORÁRIO",
  
  -- Prioridade
  CASE priority
    WHEN 'high' THEN '🔴 ALTA'
    WHEN 'medium' THEN '🟡 MÉDIA'
    WHEN 'low' THEN '🟢 BAIXA'
  END AS "🎯 PRIORIDADE",
  
  -- Última geração
  CASE 
    WHEN last_generated_at IS NULL THEN '❌ Nunca gerou'
    ELSE '✅ ' || TO_CHAR(last_generated_at AT TIME ZONE 'America/Sao_Paulo', 'DD/MM/YY HH24:MI')
  END AS "📝 ÚLTIMA GERAÇÃO",
  
  -- Próxima execução estimada
  CASE 
    WHEN NOT auto_generate_enabled THEN '⏸️ Pausado'
    WHEN day_of_week = EXTRACT(DOW FROM NOW()) AND hour = EXTRACT(HOUR FROM (NOW() AT TIME ZONE 'America/Sao_Paulo')) THEN '🔥 AGORA!'
    WHEN day_of_week = EXTRACT(DOW FROM NOW()) AND hour > EXTRACT(HOUR FROM (NOW() AT TIME ZONE 'America/Sao_Paulo')) THEN '📍 Hoje às ' || LPAD(hour::text, 2, '0') || ':00'
    ELSE '📆 Aguardando próximo ' || 
      CASE day_of_week
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Segunda'
        WHEN 2 THEN 'Terça'
        WHEN 3 THEN 'Quarta'
        WHEN 4 THEN 'Quinta'
        WHEN 5 THEN 'Sexta'
        WHEN 6 THEN 'Sábado'
      END
  END AS "🚀 PRÓXIMA EXECUÇÃO"
  
FROM website_content_schedule
ORDER BY 
  auto_generate_enabled DESC,  -- Ativos primeiro
  day_of_week, 
  hour;

-- ==================================================================
-- 📊 ESTATÍSTICAS POR ROTA
-- ==================================================================
SELECT 
  UPPER(wcp.route) AS "ROTA",
  COUNT(*) AS "TOTAL POSTS",
  COUNT(*) FILTER (WHERE wcp.status = 'draft') AS "📝 Rascunhos",
  COUNT(*) FILTER (WHERE wcp.status = 'scheduled') AS "📅 Agendados",
  COUNT(*) FILTER (WHERE wcp.status = 'published') AS "✅ Publicados",
  
  TO_CHAR(MAX(wcp.created_at) AT TIME ZONE 'America/Sao_Paulo', 'DD/MM HH24:MI') AS "Último Criado"
FROM website_content_posts wcp
GROUP BY wcp.route
ORDER BY wcp.route;

-- ==================================================================
-- 🗓️ CALENDÁRIO SEMANAL
-- ==================================================================
SELECT 
  'CALENDÁRIO DA SEMANA' AS "📅",
  
  STRING_AGG(
    CASE WHEN day_of_week = 0 THEN route || ' (' || hour || 'h)' END, 
    ', '
  ) AS "DOM",
  
  STRING_AGG(
    CASE WHEN day_of_week = 1 THEN route || ' (' || hour || 'h)' END, 
    ', '
  ) AS "SEG",
  
  STRING_AGG(
    CASE WHEN day_of_week = 2 THEN route || ' (' || hour || 'h)' END, 
    ', '
  ) AS "TER",
  
  STRING_AGG(
    CASE WHEN day_of_week = 3 THEN route || ' (' || hour || 'h)' END, 
    ', '
  ) AS "QUA",
  
  STRING_AGG(
    CASE WHEN day_of_week = 4 THEN route || ' (' || hour || 'h)' END, 
    ', '
  ) AS "QUI",
  
  STRING_AGG(
    CASE WHEN day_of_week = 5 THEN route || ' (' || hour || 'h)' END, 
    ', '
  ) AS "SEX",
  
  STRING_AGG(
    CASE WHEN day_of_week = 6 THEN route || ' (' || hour || 'h)' END, 
    ', '
  ) AS "SAB"
  
FROM website_content_schedule
WHERE auto_generate_enabled = true;

-- ==================================================================
-- ⚙️ COMO MODIFICAR A PROGRAMAÇÃO
-- ==================================================================
/*
-- Exemplo: Adicionar nova programação para rota "blog"
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES ('blog', 1, 10, 'high', true);  -- Segunda-feira às 10h

-- Exemplo: Modificar horário existente
UPDATE website_content_schedule
SET hour = 14, day_of_week = 3
WHERE route = 'blog';

-- Exemplo: Pausar rota temporariamente
UPDATE website_content_schedule
SET auto_generate_enabled = false
WHERE route = 'faq';

-- Exemplo: Reativar rota
UPDATE website_content_schedule
SET auto_generate_enabled = true
WHERE route = 'faq';
*/
