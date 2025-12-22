-- ==================================================================
-- VERIFICAÇÃO: Programação Website Content
-- ==================================================================
-- Execute no SQL Editor do Supabase para ver a programação atual
-- ==================================================================

-- Ver todas as rotas configuradas e suas programações
SELECT 
  route,
  auto_generate_enabled AS automatico_ativo,
  
  CASE day_of_week
    WHEN 0 THEN 'Domingo'
    WHEN 1 THEN 'Segunda'
    WHEN 2 THEN 'Terça'
    WHEN 3 THEN 'Quarta'
    WHEN 4 THEN 'Quinta'
    WHEN 5 THEN 'Sexta'
    WHEN 6 THEN 'Sábado'
  END AS dia_semana,
  
  hour || ':00' AS horario,
  
  CASE priority
    WHEN 'high' THEN 'Alta'
    WHEN 'medium' THEN 'Média'
    WHEN 'low' THEN 'Baixa'
  END AS prioridade,
  
  last_generated_at AS ultima_geracao
  
FROM website_content_schedule
ORDER BY day_of_week, hour;

-- Contagem de posts por rota
SELECT 
  route,
  COUNT(*) AS total_posts,
  COUNT(CASE WHEN status = 'published' THEN 1 END) AS publicados,
  COUNT(CASE WHEN status = 'scheduled' THEN 1 END) AS agendados,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) AS rascunhos
FROM website_content_posts
GROUP BY route
ORDER BY route;
