-- ==================================================================
-- ATIVAÇÃO FINAL V4: Com Coluna Frequency
-- ==================================================================

-- PASSO 1: Ver estrutura atual
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'website_content_schedule'
ORDER BY ordinal_position;

-- PASSO 2: Limpar e inserir com frequency
DELETE FROM website_content_schedule;

INSERT INTO website_content_schedule (route, frequency, priority, auto_generate_enabled, last_generated_at)
VALUES 
  -- Blog: Diário (Seg-Sex)
  ('blog', 'daily', 'high', true, NULL),
  
  -- NR01: Mensal
  ('nr01', 'monthly', 'high', true, NULL),
  
  -- Riscos: Bimestral
  ('riscos-psicossociais', 'bimonthly', 'medium', true, NULL),
  
  -- Software: Trimestral
  ('software-nr01', 'quarterly', 'medium', true, NULL),
  
  -- FAQ: Trimestral
  ('faq', 'quarterly', 'low', true, NULL);

-- PASSO 3: Criar cron
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

-- PASSO 4: Verificar
SELECT * FROM website_content_schedule;

SELECT jobname, schedule, active 
FROM cron.job 
WHERE jobname LIKE '%automation%';
