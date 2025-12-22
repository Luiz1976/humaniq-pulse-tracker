-- ==================================================================
-- ATIVAÇÃO FINAL CORRIGIDA: Website Content Automation
-- ==================================================================
-- Execute no SQL Editor do Supabase
-- ==================================================================

-- PASSO 1: Criar cron para Website Content (a cada hora)
SELECT cron.schedule(
  'website-content-automation',
  '0 * * * *',
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

-- PASSO 2: Verificar se tabela existe e criar se necessário
CREATE TABLE IF NOT EXISTS website_content_schedule (
    id BIGSERIAL PRIMARY KEY,
    route TEXT NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    auto_generate_enabled BOOLEAN DEFAULT true,
    last_generated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(route, day_of_week, hour)
);

-- PASSO 3: Inserir schedules
INSERT INTO website_content_schedule (route, day_of_week, hour, priority, auto_generate_enabled)
VALUES 
  -- Blog: 5x por semana (Seg-Sex às 10h)
  ('blog', 1, 10, 'high', true),
  ('blog', 2, 10, 'high', true),
  ('blog', 3, 10, 'high', true),
  ('blog', 4, 10, 'high', true),
  ('blog', 5, 10, 'high', true),
  
  -- NR01: Mensal (Segunda às 14h)
  ('nr01', 1, 14, 'high', true),
  
  -- Riscos Psicossociais: Bimestral (Quarta às 11h)
  ('riscos-psicossociais', 3, 11, 'medium', true),
  
  -- Software NR01: Trimestral (Quinta às 15h)
  ('software-nr01', 4, 15, 'medium', true),
  
  -- FAQ: Trimestral (Sexta às 16h)
  ('faq', 5, 16, 'low', true)
  
ON CONFLICT (route, day_of_week, hour) 
DO UPDATE SET 
  auto_generate_enabled = EXCLUDED.auto_generate_enabled,
  priority = EXCLUDED.priority,
  updated_at = NOW();

-- PASSO 4: Verificar configuração
SELECT 
  '=== CRON JOBS ===' AS secao,
  jobname,
  schedule,
  active
FROM cron.job
WHERE jobname IN ('linkedin-weekday-automation', 'website-content-automation')

UNION ALL

SELECT 
  '=== SCHEDULES ===' AS secao,
  route AS jobname,
  CONCAT('Dia ', day_of_week, ' às ', hour, 'h') AS schedule,
  auto_generate_enabled::TEXT AS active
FROM website_content_schedule
ORDER BY secao DESC, jobname;
