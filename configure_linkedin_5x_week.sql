-- ==================================================================
-- CONFIGURAÇÃO: LinkedIn 5x por Semana (Segunda a Sexta)
-- ==================================================================
-- Execute no SQL Editor do Supabase
-- URL: https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql/new
-- ==================================================================

-- Atualizar configurações do LinkedIn
UPDATE linkedin_settings
SET 
  post_interval_minutes = 1440,  -- 24 horas entre posts
  post_start_hour = 10,           -- Horário de postagem: 10h BRT
  post_end_hour = 11,             -- Janela de 1 hora
  min_posts_ready = 10,           -- Manter 10 posts prontos
  updated_at = NOW()
WHERE auto_post_enabled = true;

-- Verificar configuração
SELECT 
  'LinkedIn configurado para postar diariamente' AS status,
  '5x por semana (Seg-Sex)' AS frequencia,
  '10:00 BRT' AS horario,
  '24 horas' AS intervalo,
  CASE 
    WHEN auto_post_enabled THEN '✅ Ativo'
    ELSE '❌ Desativado'
  END AS automacao
FROM linkedin_settings
LIMIT 1;

-- ==================================================================
-- RESUMO
-- ==================================================================
SELECT 
  '
  ══════════════════════════════════════════════════════
  📅 LINKEDIN - FREQUÊNCIA CONFIGURADA
  ══════════════════════════════════════════════════════
  
  Frequência: 5x por semana (Segunda a Sexta)
  Horário: 10:00 BRT
  Intervalo: 24 horas entre posts
  
  Como funciona:
  1. Cron roda diariamente às 10h
  2. linkedin-scheduler verifica dia da semana
  3. Se for Seg-Sex: posta
  4. Se for Sáb-Dom: pula
  
  ══════════════════════════════════════════════════════
  ' AS resumo;
