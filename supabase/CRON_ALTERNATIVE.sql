-- ============================================================================
-- DIAGNÓSTICO: Verificar se pg_cron está disponível
-- ============================================================================

-- Passo 1: Verificar extensões instaladas
SELECT * FROM pg_extension WHERE extname = 'pg_cron';

-- Se retornar vazio, pg_cron NÃO está habilitado
-- NOTA: pg_cron pode não estar disponível no plano gratuito do Supabase

-- ============================================================================
-- SOLUÇÃO ALTERNATIVA: Usar Supabase Database Webhooks
-- ============================================================================

-- Em vez de pg_cron, vamos usar as Database Webhooks do Supabase
-- que funcionam em todos os planos

-- INSTRUÇÕES:
-- 1. Vá para: Database → Webhooks no dashboard do Supabase
-- 2. Crie 3 webhooks conforme abaixo:

-- ============================================================================
-- WEBHOOK 1: Daily Content Generation
-- ============================================================================
-- Name: website-daily-content-check
-- Table: (não aplicável, use um trigger manual ou ignore)
-- Events: (não aplicável)
-- Type: HTTP Request
-- Method: POST
-- URL: https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-scheduler
-- Headers:
--   Content-Type: application/json
--   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamdnanN4c3ZleHFyaHlpenJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU3NzA0MiwiZXhwIjoyMDgxMTUzMDQyfQ.xyemYkcdM7GfKEPK71fHJOxH3Iwv8iydIoEjRUZ6o6A

-- ============================================================================
-- ALTERNATIVA RECOMENDADA: Usar serviço externo de CRON
-- ============================================================================
-- Como o Supabase pode não ter pg_cron no plano gratuito,
-- a melhor solução é usar um serviço gratuito de cron:

-- OPÇÃO 1: cron-job.org (Gratuito, sem necessidade de cadastro de cartão)
-- URL: https://cron-job.org
-- 
-- Configure 2 jobs:
-- 
-- Job 1: Daily Content Generator
-- - URL: https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-scheduler
-- - Method: POST
-- - Schedule: 0 0 * * * (diariamente à meia-noite)
-- - Headers: 
--     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamdnanN4c3ZleHFyaHlpenJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU3NzA0MiwiZXhwIjoyMDgxMTUzMDQyfQ.xyemYkcdM7GfKEPK71fHJOxH3Iwv8iydIoEjRUZ6o6A
--     Content-Type: application/json
--
-- Job 2: Hourly Publisher
-- - URL: https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-publish-content
-- - Method: POST
-- - Schedule: 0 * * * * (a cada hora)
-- - Headers: Same as above
-- - Body: {"auto_mode": true}

-- OPÇÃO 2: EasyCron (https://www.easycron.com) - Até 100 tarefas grátis
-- OPÇÃO 3: cPanel Cron Jobs (se você tiver hospedagem própria)

-- ============================================================================
-- TESTE MANUAL (Execute agora para testar)
-- ============================================================================

-- Teste o scheduler manualmente:
SELECT net.http_post(
  url := 'https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-scheduler',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamdnanN4c3ZleHFyaHlpenJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU3NzA0MiwiZXhwIjoyMDgxMTUzMDQyfQ.xyemYkcdM7GfKEPK71fHJOxH3Iwv8iydIoEjRUZ6o6A"}'::jsonb,
  body := '{}'::jsonb
);
