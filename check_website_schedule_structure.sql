-- ==================================================================
-- VERIFICAR ESTRUTURA: website_content_schedule
-- ==================================================================

-- Ver estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'website_content_schedule'
ORDER BY ordinal_position;

-- Ver dados atuais
SELECT * FROM website_content_schedule LIMIT 5;
