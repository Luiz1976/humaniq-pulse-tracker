-- ==================================================================
-- ATIVAÇÃO FINAL V5: Recriar Tabela Compatível com Edge Function
-- ==================================================================
-- MOTIVO: A estrutura atual da tabela está incompatível com o código
--         da Edge Function "website-scheduler" que exige day_of_week/hour.
-- ==================================================================

-- 1. Recriar Tabela Corretamente
DROP TABLE IF EXISTS website_content_schedule;

CREATE TABLE website_content_schedule (
    id BIGSERIAL PRIMARY KEY,
    route TEXT NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Dom, 6=Sab
    hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    auto_generate_enabled BOOLEAN DEFAULT true,
    last_generated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(route, day_of_week, hour)
);

-- 2. Inserir Agendamentos (Schedule)
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
  ('faq', 5, 16, 'low', true);

-- 3. Configurar Cron Job (Executa a cada hora)
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

-- 4. Verificar Resultado Final
SELECT 
  route,
  CASE day_of_week
    WHEN 1 THEN 'Segunda'
    WHEN 2 THEN 'Terca'
    WHEN 3 THEN 'Quarta'
    WHEN 4 THEN 'Quinta'
    WHEN 5 THEN 'Sexta'
  END as dia,
  hour as hora,
  auto_generate_enabled as ativo
FROM website_content_schedule
ORDER BY day_of_week, hour;
