-- ==================================================================
-- ATUALIZAÇÃO: LinkedIn para Postar 1x por Dia
-- ==================================================================
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- URL: https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql/new
-- ==================================================================

-- 1. Atualizar configurações do LinkedIn para postagem diária
UPDATE linkedin_settings
SET 
  post_interval_minutes = 1440,  -- 24 horas (1440 minutos)
  post_start_hour = 10,           -- Inicia às 10h da manhã
  post_end_hour = 11,             -- Termina às 11h (janela de 1 hora)
  updated_at = NOW()
WHERE auto_post_enabled = true;

-- 2. Verificar as configurações atualizadas
SELECT 
  id,
  account_id,
  auto_post_enabled,
  post_interval_minutes AS intervalo_minutos,
  CASE 
    WHEN post_interval_minutes = 60 THEN 'A cada hora'
    WHEN post_interval_minutes = 1440 THEN 'Uma vez por dia'
    ELSE CONCAT('A cada ', post_interval_minutes, ' minutos')
  END AS frequencia,
  post_start_hour || ':00' AS horario_inicio,
  post_end_hour || ':00' AS horario_fim,
  min_posts_ready AS minimo_posts,
  last_post_at AS ultimo_post
FROM linkedin_settings;

-- ==================================================================
-- RESULTADO ESPERADO:
-- - post_interval_minutes: 1440 (ao invés de 60)
-- - post_start_hour: 10
-- - post_end_hour: 11  
-- - LinkedIn postará 1x por dia entre 10h-11h
-- ==================================================================
