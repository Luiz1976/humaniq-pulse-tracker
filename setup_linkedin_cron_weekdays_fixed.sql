-- ==================================================================
-- CRON JOB: LinkedIn 5x por Semana (Segunda a Sexta)
-- ==================================================================
-- Execute no SQL Editor do Supabase
-- ==================================================================

-- Remover cron antigo se existir (com tratamento de erro)
DO $$
BEGIN
    PERFORM cron.unschedule('linkedin-daily-automation');
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'linkedin-daily-automation não existe, continuando...';
END $$;

DO $$
BEGIN
    PERFORM cron.unschedule('linkedin-hourly-automation');
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'linkedin-hourly-automation não existe, continuando...';
END $$;

-- Criar novo cron para execução DIÁRIA
-- A função linkedin-scheduler verificará se é dia útil (Seg-Sex)
SELECT cron.schedule(
  'linkedin-weekday-automation',
  '0 13 * * *', -- Diariamente às 13:00 UTC = 10:00 BRT
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

-- Verificar cron criado
SELECT 
  jobname AS "Nome do Job",
  schedule AS "Schedule (Cron)",
  CASE 
    WHEN active THEN '✅ Ativo'
    ELSE '❌ Inativo'
  END AS "Status",
  CASE schedule
    WHEN '0 13 * * *' THEN 'Diariamente às 13:00 UTC (10:00 BRT)'
    ELSE schedule
  END AS "Descrição"
FROM cron.job
WHERE jobname = 'linkedin-weekday-automation';
