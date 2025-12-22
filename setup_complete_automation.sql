-- ==================================================================
-- AUTOMAÇÃO COMPLETA: LinkedIn + Website Content
-- ==================================================================
-- Execute este SQL no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql/new
-- ==================================================================

-- SERVICE ROLE KEY (NÃO COMPARTILHE!)
-- eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamdnanN4c3ZleHFyaHlpenJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDAzMDY0MywiZXhwIjoyMDQ5NjA2NjQzfQ.VN8tF_uf-XlkKOEJ1jDBUkjcEq7jOPpvH4VoGtKHvjE

-- ==================================================================
-- 1. LINKEDIN AUTOMATION (Diário às 10h)
-- ==================================================================

-- Remover cron antigo (horário) se existir
SELECT cron.unschedule('linkedin-hourly-automation');

-- Criar novo cron para postagem DIÁRIA às 10h
SELECT cron.schedule(
  'linkedin-daily-automation',
  '0 10 * * *', -- Todos os dias às 10:00 AM (horário do servidor UTC)
  $$
    SELECT
      net.http_post(
          url:='https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/linkedin-scheduler',
          headers:='{
            "Content-Type": "application/json", 
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamdnanN4c3ZleHFyaHlpenJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDAzMDY0MywiZXhwIjoyMDQ5NjA2NjQzfQ.VN8tF_uf-XlkKOEJ1jDBUkjcEq7jOPpvH4VoGtKHvjE"
          }'::jsonb,
          body:='{}'::jsonb
      ) as request_id;
  $$
);

-- ==================================================================
-- 2. WEBSITE CONTENT AUTOMATION (Conforme Schedule)
-- ==================================================================

-- Criar cron para verificar e publicar website content a cada hora
SELECT cron.schedule(
  'website-content-automation',
  '0 * * * *', -- A cada hora no minuto 0
  $$
    SELECT
      net.http_post(
          url:='https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-scheduler',
          headers:='{
            "Content-Type": "application/json", 
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamdnanN4c3ZleHFyaHlpenJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDAzMDY0MywiZXhwIjoyMDQ5NjA2NjQzfQ.VN8tF_uf-XlkKOEJ1jDBUkjcEq7jOPpvH4VoGtKHvjE"
          }'::jsonb,
          body:='{}'::jsonb
      ) as request_id;
  $$
);

-- ==================================================================
-- 3. VERIFICAÇÃO DOS CRON JOBS
-- ==================================================================

-- Listar todos os cron jobs ativos
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  nodename
FROM cron.job
WHERE jobname IN ('linkedin-daily-automation', 'website-content-automation')
ORDER BY jobname;

-- ==================================================================
-- RESULTADO ESPERADO:
-- ==================================================================
-- Você deve ver 2 cron jobs:
-- 1. linkedin-daily-automation      → '0 10 * * *' (diário às 10h)
-- 2. website-content-automation     → '0 * * * *'  (a cada hora)
-- ==================================================================

-- ==================================================================
-- OBSERVAÇÕES IMPORTANTES:
-- ==================================================================
-- ⚠️ HORÁRIO UTC: O servidor Supabase usa UTC (3 horas à frente do Brasil)
--    - '0 10 * * *' UTC = ~07:00 AM BRT
--    - Ajuste conforme necessário: '0 13 * * *' = ~10:00 AM BRT
-- 
-- ⚠️ Para ajustar para 10h BRT, use: '0 13 * * *'
-- ==================================================================
