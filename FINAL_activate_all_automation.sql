-- ==================================================================
-- ATIVAÇÃO FINAL: Website Content Automation
-- ==================================================================
-- Execute no SQL Editor do Supabase
-- ==================================================================

-- Criar cron para Website Content (a cada hora)
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

-- Inserir schedule para o blog (5x por semana)
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES 
  ('blog', 1, 10, 'high', true),   -- Segunda
  ('blog', 2, 10, 'high', true),   -- Terça
  ('blog', 3, 10, 'high', true),   -- Quarta
  ('blog', 4, 10, 'high', true),   -- Quinta
  ('blog', 5, 10, 'high', true)    -- Sexta
ON CONFLICT (route, day_of_week, hour) DO UPDATE
  SET auto_generate_enabled = true, priority = 'high';

-- Inserir schedule para NR01 (mensal)
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES ('nr01', 1, 14, 'high', true)  -- Segunda às 14h
ON CONFLICT (route, day_of_week, hour) DO UPDATE
  SET auto_generate_enabled = true, priority = 'high';

-- Inserir schedule para Riscos Psicossociais (bimestral)
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES ('riscos-psicossociais', 3, 11, 'medium', true)  -- Quarta às 11h
ON CONFLICT (route, day_of_week, hour) DO UPDATE
  SET auto_generate_enabled = true, priority = 'medium';

-- Inserir schedule para Software NR01 (trimestral)
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES ('software-nr01', 4, 15, 'medium', true)  -- Quinta às 15h
ON CONFLICT (route, day_of_week, hour) DO UPDATE
  SET auto_generate_enabled = true, priority = 'medium';

-- Inserir schedule para FAQ (trimestral)
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES ('faq', 5, 16, 'low', true)  -- Sexta às 16h
ON CONFLICT (route, day_of_week, hour) DO UPDATE
  SET auto_generate_enabled = true, priority = 'low';

-- Verificar tudo criado
SELECT 
  jobname,
  schedule,
  active
FROM cron.job
WHERE jobname IN ('linkedin-weekday-automation', 'website-content-automation');

SELECT 
  route,
  day_of_week,
  hour,
  auto_generate_enabled AS ativo
FROM website_content_schedule
ORDER BY route, day_of_week, hour;
