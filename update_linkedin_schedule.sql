-- Atualizar LinkedIn para postar 1x por dia ao invés de a cada hora
-- Configura intervalo de 1440 minutos (24 horas)

UPDATE linkedin_settings
SET 
  post_interval_minutes = 1440,  -- 24 horas = 1440 minutos
  post_start_hour = 10,           -- Horário de início: 10h
  post_end_hour = 11,             -- Horário de fim: 11h (janela de 1 hora)
  updated_at = NOW()
WHERE auto_post_enabled = true;

-- Verificar as configurações atualizadas
SELECT 
  id,
  account_id,
  auto_post_enabled,
  post_interval_minutes,
  post_start_hour,
  post_end_hour,
  min_posts_ready,
  last_post_at
FROM linkedin_settings;
