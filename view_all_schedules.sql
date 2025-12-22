-- ==================================================================
-- VISUALIZAÇÃO COMPLETA: Agendamento de Todas as Postagens
-- ==================================================================
-- Execute no SQL Editor do Supabase
-- URL: https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql/new
-- ==================================================================

-- ==================================================================
-- 1. LINKEDIN - Configuração de Postagem Automática
-- ==================================================================
SELECT 
  '🔵 LINKEDIN' AS tipo,
  CASE 
    WHEN auto_post_enabled THEN '✅ Ativo'
    ELSE '❌ Desativado'
  END AS status,
  
  CASE 
    WHEN post_interval_minutes = 60 THEN 'A cada 1 hora'
    WHEN post_interval_minutes = 1440 THEN 'Uma vez por dia (24h)'
    WHEN post_interval_minutes = 720 THEN 'Duas vezes por dia (12h)'
    ELSE CONCAT('A cada ', post_interval_minutes, ' minutos')
  END AS frequencia,
  
  CONCAT(post_start_hour, ':00 - ', post_end_hour, ':00') AS janela_horaria,
  
  min_posts_ready AS minimo_posts_prontos,
  
  CASE 
    WHEN last_post_at IS NULL THEN 'Nunca postou'
    ELSE TO_CHAR(last_post_at AT TIME ZONE 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI')
  END AS ultimo_post,
  
  CASE 
    WHEN last_post_at IS NULL THEN 'Pronto para postar'
    WHEN EXTRACT(EPOCH FROM (NOW() - last_post_at))/60 >= post_interval_minutes THEN '✅ Pode postar agora'
    ELSE CONCAT('⏰ Aguardar ', 
      ROUND((post_interval_minutes - EXTRACT(EPOCH FROM (NOW() - last_post_at))/60)::numeric, 0), 
      ' min')
  END AS proximo_post
  
FROM linkedin_settings
LIMIT 1;

-- ==================================================================
-- 2. LINKEDIN - Posts Prontos para Publicação
-- ==================================================================
SELECT 
  '📝 Posts LinkedIn Prontos' AS categoria,
  COUNT(*) FILTER (WHERE status = 'ready') AS prontos,
  COUNT(*) FILTER (WHERE status = 'published') AS publicados,
  COUNT(*) FILTER (WHERE status = 'failed') AS falhos,
  COUNT(*) AS total
FROM linkedin_posts;

-- ==================================================================
-- 3. WEBSITE CONTENT - Programação por Rota
-- ==================================================================
SELECT 
  '🌐 ' || UPPER(route) AS rota,
  
  CASE 
    WHEN auto_generate_enabled THEN '✅ Ativo'
    ELSE '❌ Desativado'
  END AS status,
  
  CASE day_of_week
    WHEN 0 THEN 'Domingo'
    WHEN 1 THEN 'Segunda-feira'
    WHEN 2 THEN 'Terça-feira'
    WHEN 3 THEN 'Quarta-feira'
    WHEN 4 THEN 'Quinta-feira'
    WHEN 5 THEN 'Sexta-feira'
    WHEN 6 THEN 'Sábado'
  END AS dia_semana,
  
  CONCAT(hour, ':00') AS horario,
  
  CASE priority
    WHEN 'high' THEN '🔴 Alta'
    WHEN 'medium' THEN '🟡 Média'
    WHEN 'low' THEN '🟢 Baixa'
  END AS prioridade,
  
  CASE 
    WHEN last_generated_at IS NULL THEN 'Nunca gerou'
    ELSE TO_CHAR(last_generated_at AT TIME ZONE 'America/Sao_Paulo', 'DD/MM HH24:MI')
  END AS ultima_geracao
  
FROM website_content_schedule
ORDER BY 
  CASE 
    WHEN day_of_week = EXTRACT(DOW FROM NOW()) THEN 0 
    ELSE 1 
  END,
  day_of_week, 
  hour;

-- ==================================================================
-- 4. WEBSITE CONTENT - Posts por Rota
-- ==================================================================
SELECT 
  route AS rota,
  COUNT(*) FILTER (WHERE status = 'draft') AS rascunhos,
  COUNT(*) FILTER (WHERE status = 'scheduled') AS agendados,
  COUNT(*) FILTER (WHERE status = 'published') AS publicados,
  COUNT(*) AS total,
  
  TO_CHAR(MAX(created_at) AT TIME ZONE 'America/Sao_Paulo', 'DD/MM HH24:MI') AS ultimo_criado
  
FROM website_content_posts
GROUP BY route
ORDER BY route;

-- ==================================================================
-- 5. CRON JOBS - Status dos Agendamentos Automáticos
-- ==================================================================
SELECT 
  jobname AS nome_job,
  schedule AS expressao_cron,
  
  CASE schedule
    WHEN '0 10 * * *' THEN 'Diário às 10:00 AM UTC (~07:00 BRT)'
    WHEN '0 13 * * *' THEN 'Diário às 13:00 UTC (~10:00 BRT)'
    WHEN '0 * * * *' THEN 'A cada hora (XX:00)'
    ELSE schedule
  END AS descricao,
  
  CASE 
    WHEN active THEN '✅ Ativo'
    ELSE '❌ Inativo'
  END AS status,
  
  nodename AS servidor
  
FROM cron.job
WHERE jobname IN ('linkedin-daily-automation', 'linkedin-hourly-automation', 'website-content-automation')
ORDER BY jobname;

-- ==================================================================
-- 6. RESUMO GERAL
-- ==================================================================
WITH linkedin_stats AS (
  SELECT 
    COUNT(*) FILTER (WHERE status = 'ready') AS ready,
    COUNT(*) FILTER (WHERE status = 'published') AS published
  FROM linkedin_posts
),
website_stats AS (
  SELECT 
    COUNT(*) FILTER (WHERE status = 'scheduled') AS scheduled,
    COUNT(*) FILTER (WHERE status = 'published') AS published
  FROM website_content_posts
),
cron_stats AS (
  SELECT 
    COUNT(*) FILTER (WHERE active = true) AS active_jobs
  FROM cron.job
  WHERE jobname LIKE '%automation%'
)
SELECT 
  '
  ══════════════════════════════════════════════════════
  📊 RESUMO DO SISTEMA DE AUTOMAÇÃO
  ══════════════════════════════════════════════════════
  
  LinkedIn:
    - Posts prontos: ' || l.ready || '
    - Posts publicados: ' || l.published || '
  
  Website Content:
    - Posts agendados: ' || w.scheduled || '
    - Posts publicados: ' || w.published || '
  
  Cron Jobs Ativos: ' || c.active_jobs || '
  
  ══════════════════════════════════════════════════════
  ' AS resumo
FROM linkedin_stats l, website_stats w, cron_stats c;
