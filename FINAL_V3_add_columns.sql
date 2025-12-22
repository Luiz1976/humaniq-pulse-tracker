-- ==================================================================
-- ATIVAÇÃO FINAL - VERSÃO 3: Adicionar Colunas Necessárias
-- ==================================================================

-- PASSO 1: Adicionar colunas que faltam (se não existirem)
DO $$ 
BEGIN
    -- Adicionar day_of_week se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'website_content_schedule' 
        AND column_name = 'day_of_week'
    ) THEN
        ALTER TABLE website_content_schedule 
        ADD COLUMN day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6);
    END IF;

    -- Adicionar hour se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'website_content_schedule' 
        AND column_name = 'hour'
    ) THEN
        ALTER TABLE website_content_schedule 
        ADD COLUMN hour INTEGER CHECK (hour >= 0 AND hour <= 23);
    END IF;
END $$;

-- PASSO 2: Limpar dados antigos (se houver)
DELETE FROM website_content_schedule;

-- PASSO 3: Inserir schedules
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES 
  -- Blog: 5x por semana
  ('blog', 1, 10, 'high', true),
  ('blog', 2, 10, 'high', true),
  ('blog', 3, 10, 'high', true),
  ('blog', 4, 10, 'high', true),
  ('blog', 5, 10, 'high', true),
  
  -- NR01: Mensal
  ('nr01', 1, 14, 'high', true),
  
  -- Riscos: Bimestral
  ('riscos-psicossociais', 3, 11, 'medium', true),
  
  -- Software: Trimestral
  ('software-nr01', 4, 15, 'medium', true),
  
  -- FAQ: Trimestral
  ('faq', 5, 16, 'low', true);

-- PASSO 4: Criar cron job
SELECT cron.schedule(
  'website-content-automation',
  '0 * * * *',
  $$
    SELECT net.http_post(
      url:='https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-scheduler',
      headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamdnanN4c3ZleHFyaHlpenJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDAzMDY0MywiZXhwIjoyMDQ5NjA2NjQzfQ.VN8tF_uf-XlkKOEJ1jDBUkjcEq7jOPpvH4VoGtKHvjE"}'::jsonb,
      body:='{}'::jsonb
    );
  $$
);

-- PASSO 5: Verificar
SELECT 'CRON JOBS' AS tipo, jobname, schedule, active::TEXT AS status
FROM cron.job
WHERE jobname LIKE '%automation%'

UNION ALL

SELECT 'SCHEDULES', route, CONCAT('Dia ', day_of_week, ' - ', hour, 'h'), auto_generate_enabled::TEXT
FROM website_content_schedule
ORDER BY tipo, jobname;
