-- ==================================================================
-- CRON JOB: LinkedIn 5x por Semana (Segunda a Sexta)
-- ==================================================================
-- Execute no SQL Editor do Supabase
-- URL: https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql/new
-- ==================================================================

-- Remover cron antigo se existir
SELECT cron.unschedule('linkedin-daily-automation');
SELECT cron.unschedule('linkedin-hourly-automation');

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
  jobname,
  schedule,
  CASE 
    WHEN active THEN '✅ Ativo'
    ELSE '❌ Inativo'
  END AS status,
  CASE schedule
    WHEN '0 13 * * *' THEN 'Diariamente às 13:00 UTC (10:00 BRT)'
    ELSE schedule
  END AS descricao
FROM cron.job
WHERE jobname = 'linkedin-weekday-automation';

-- ==================================================================
-- RESUMO
-- ==================================================================
SELECT 
  '
  ══════════════════════════════════════════════════════
  🔵 LINKEDIN - AUTOMAÇÃO CONFIGURADA
  ══════════════════════════════════════════════════════
  
  Cron Job: linkedin-weekday-automation
  Execução: Diariamente às 10:00 BRT
  
  Lógica:
  ✅ Segunda a Sexta → POSTA
  ⏭️ Sábado e Domingo → PULA
  
  Resultado: 5 posts por semana automaticamente
  
  Logs disponíveis em:
  → linkedin_activity_logs (banco de dados)
  → Supabase Functions Logs (dashboard)
  
  ══════════════════════════════════════════════════════
  ' AS resumo;
