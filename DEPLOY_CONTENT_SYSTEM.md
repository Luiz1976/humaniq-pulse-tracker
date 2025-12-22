# Sistema de Conteúdo com Geração de Imagens - Deploy Script

## 📋 Pré-requisitos

- Supabase CLI instalado
- Acesso ao projeto Supabase
- Chaves de API do Gemini configuradas

## 🚀 Passos para Deploy

### 1. Executar Migration do Banco de Dados

```sql
-- Execute no Supabase SQL Editor
-- c:\Users\ALICEBELLA\Desktop\NOVO HQ PULSE\humaniq-pulse-tracker\supabase\migrations\20251220_add_image_generation_support.sql
```

Copia e cola o conteúdo do arquivo de migração no SQL Editor do Supabase.

### 2. Deploy Edge Functions

```powershell
# Navigate to project directory
cd "c:\Users\ALICEBELLA\Desktop\NOVO HQ PULSE\humaniq-pulse-tracker"

# Deploy updated content generation function (with image support)
npx supabase functions deploy website-generate-content

# Deploy new export content function
npx supabase functions deploy website-export-content

# Verify deployment
npx supabase functions list
```

### 3. Configurar Secrets (API Keys)

```powershell
# Configure Gemini API keys (adicione quantas tiver)
npx supabase secrets set GEMINI_API_KEY_1=sua_chave_aqui
npx supabase secrets set GEMINI_API_KEY_2=sua_chave_aqui
npx supabase secrets set GEMINI_API_KEY_3=sua_chave_aqui

# Verify secrets
npx supabase secrets list
```

### 4. Testar Geração de Conteúdo com Imagem

**Via Dashboard:**
1. Acesse `http://localhost:5173/website-content`
2. Clique em"Gerar Agora" para qualquer rota
3. Verifique que a imagem foi gerada e anexada

**Via cURL:**
```bash
curl -X POST https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-generate-content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [SERVICE_ROLE_KEY]" \
  -d '{"route": "blog", "count": 1}'
```

### 5. Testar API de Exportação

```bash
# Get all published posts
curl "https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-export-content?limit=10"

# Get posts from specific route
curl "https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-export-content?route=blog&limit=5"
```

## 🗄️ Verificação do Banco de Dados

```sql
-- Verificar storage bucket criado
SELECT * FROM storage.buckets WHERE id = 'website-content-images';

-- Verificar posts com imagens
SELECT 
  p.title,
  p.image_url,
  i.url as image_table_url,
  i.is_primary
FROM website_content_posts p
LEFT JOIN website_content_images i ON i.post_id = p.id
ORDER BY p.created_at DESC
LIMIT 10;

-- Verificar logs de geração
SELECT 
  log_type,
  action,
  message,
  details->>'has_image' as has_image,
  created_at
FROM website_content_activity_logs
WHERE action = 'generate_content'
ORDER BY created_at DESC
LIMIT 10;
```

## 🔧 Troubleshooting

### Imagem não está sendo gerada

1. Verificar logs da Edge Function:
   - Vá para Supabase Dashboard > Edge Functions > website-generate-content > Logs
   - Procure por erros relacionados a Imagen API

2. Verificar API keys:
   ```powershell
   npx supabase secrets list
   ```

3. Testar API do Gemini manualmente (se Imagen falhar, usa placeholder)

### Storage não está acessível

1. Verificar policies do storage bucket:
   ```sql
   SELECT * FROM storage.policies WHERE bucket_id = 'website-content-images';
   ```

2. Tentar acessar uma imagem direto pela URL pública

### Cron Jobs não estão rodando

```sql
-- Ver status dos jobs
SELECT * FROM cron.job WHERE jobname LIKE 'website%';

-- Ver última execução
SELECT * FROM cron.job_run_details 
WHERE jobname LIKE 'website%' 
ORDER BY start_time DESC 
LIMIT 5;
```

## 📊 Monitoramento

### Métricas para Acompanhar

1. **Taxa de sucesso de geração de imagens**
   ```sql
   SELECT 
     COUNT(*) FILTER (WHERE details->>'has_image' = 'true') as with_image,
     COUNT(*) as total,
     ROUND(COUNT(*) FILTER (WHERE details->>'has_image' = 'true') * 100.0 / COUNT(*), 2) as success_rate
   FROM website_content_activity_logs
   WHERE action = 'generate_content'
   AND created_at > NOW() - INTERVAL '7 days';
   ```

2. **Tamanho do storage**
   ```sql
   SELECT 
     bucket_id,
     SUM((metadata->>'size')::bigint) / 1024 / 1024 as size_mb
   FROM storage.objects
   WHERE bucket_id = 'website-content-images'
   GROUP BY bucket_id;
   ```

3. **Posts por rota**
   ```sql
   SELECT 
     route,
     COUNT(*) as total,
     COUNT(*) FILTER (WHERE image_url IS NOT NULL) as with_image
   FROM website_content_posts
   GROUP BY route
   ORDER BY total DESC;
   ```

## ✅ Checklist de Deploy

- [ ] Migration executada
- [ ] Edge Functions deployed
- [ ] API Keys configuradas
- [ ] Storage bucket criado e acessível
- [ ] Teste de geração com imagem realizado
- [ ] API de exportação testada
- [ ] Cron jobs verificados
- [ ] Dashboard atualizado
- [ ] Monitoramento configurado

## 📝 Próximos Passos

1. Integrar API de exportação no website www.humaniqai.com.br
2. Configurar webhook para rebuild automático quando novo conteúdo for publicado
3. Adicionar analytics para métricas de performance do conteúdo
4. Implementar A/B testing de títulos (futuro)
