# Sistema Automatizado de Conteúdo - HumaniQ AI

## 📋 Visão Geral

Sistema completo e autônomo de criação, armazenamento e publicação de conteúdo para o website www.humaniqai.com.br.

### Funcionalidades Implementadas

✅ **Geração de Conteúdo com IA**
- Integração com Gemini AI (suporte a múltiplas API keys com rotação automática)
- 50+ temas específicos distribuídos por rota
- Técnicas de PLN e persuasão ética
- SEO otimizado (meta title, description, keywords)
- Conteúdo entre 800-1200 palavras

✅ **Rotas Configuradas**
| Rota | Periodicidade | Prioridade | Temas |
|------|--------------|-----------|--------|
| `/blog` | Semanal | 🔴 Máxima | 10 temas |
| `/nr01` | Mensal | 🔴 Máxima | 10 temas |  
| `/riscos-psicossociais` | Bimestral | 🟠 Alta | 10 temas |
| `/software-nr01` | Trimestral | 🟠 Alta | 10 temas |
| `/faq` | Trimestral | 🟢 Média | 10 temas |

✅ **Automação Completa**
- Agendamento via Supabase Cron Jobs
- Geração automática respeitando periodicidade
- Sistema de publicação automática
- Logs de atividade e monitoramento

✅ **Dashboard de Gerenciamento**
- Interface visual para monitorar conteúdo
- Estatísticas em tempo real
- Geração manual de conteúdo
- Publicação com um clique

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas

1. **`website_content_posts`** - Armazena todos os posts gerados
2. **`website_content_schedule`** - Configuração de agendamento por rota
3. **`website_content_images`** - Imagens associadas aos posts
4. **`website_content_versions`** - Histórico de versões para reuso
5. **`website_content_activity_logs`** - Logs de todas as atividades

### Funções Auxiliares

- `generate_slug()` - Gera slugs únicos e SEO-friendly
- `calculate_next_schedule()` - Calcula próxima data de geração
- `create_content_version()` - Trigger para versionamento automático

---

## ⚙️ Setup e Instalação

### 1. Executar Migration do Banco de Dados

No Supabase SQL Editor, execute:

```sql
-- Execute o arquivo de migração
\i supabase/migrations/20251219_website_content_schema.sql
```

Ou copie e cole o conteúdo do arquivo diretamente no SQL Editor.

### 2. Deploy das Edge Functions

```bash
cd supabase/functions

# Deploy função de geração de conteúdo
npx supabase functions deploy website-generate-content

# Deploy função de agendamento
npx supabase functions deploy website-scheduler

# Deploy função de publicação
npx supabase functions deploy website-publish-content
```

### 3. Configurar Cron Jobs

No Supabase SQL Editor, execute:

```sql
\i supabase/setup_website_content_cron.sql
```

**IMPORTANTE**: Substitua `YOUR_SERVICE_ROLE_KEY` pela sua chave real antes de executar!

### 4. Acessar o Dashboard

Navegue para: `http://localhost:5173/website-content` (ou sua URL de produção)

---

## 🚀 Como Usar

### Geração Manual de Conteúdo

1. Acesse `/website-content` no dashboard
2. Na seção "Configuração de Agendamento", clique em **Gerar Agora** para a rota desejada
3. Aguarde a geração (leva ~10-15 segundos por post)
4. O conteúdo aparecerá na lista com status "draft" ou "scheduled"

### Publicação Manual

1. Localize o post na lista
2. Clique em **Publicar**
3. O status mudará para "published" e `published_at` será registrado

### Funcionamento Automático

O sistema roda automaticamente:

- **Diariamente às 00:00 UTC** - Verifica se alguma rota precisa de novo conteúdo
- **A cada hora** - Publica posts que estão agendados

---

## 🧪 Testes

### Testar Geração de Conteúdo

```bash
# Via curl
curl -X POST https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-generate-content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -d '{"route": "blog", "count": 1}'
```

### Testar Scheduler

```bash
curl -X POST https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-scheduler \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

### Verificar no Banco de Dados

```sql
-- Ver posts gerados
SELECT route, title, status, created_at 
FROM website_content_posts 
ORDER BY created_at DESC 
LIMIT 10;

-- Ver próximas gerações agendadas
SELECT route, frequency, next_scheduled_at 
FROM website_content_schedule;

-- Ver logs de atividade
SELECT log_type, action, message, created_at 
FROM website_content_activity_logs 
ORDER BY created_at DESC 
LIMIT 20;
```

---

## 📊 Monitoramento

### Verificar Cron Jobs

```sql
-- Ver jobs agendados
SELECT * FROM cron.job WHERE jobname LIKE 'website%';

-- Ver histórico de execução
SELECT * FROM cron.job_run_details 
WHERE jobname LIKE 'website%' 
ORDER BY start_time DESC 
LIMIT 10;
```

### Dashboard de Métricas

O dashboard em `/website-content` mostra:

- Total de posts criados
- Posts por status (draft, scheduled, published)
- Próximas gerações agendadas
- Lista completa de conteúdos com filtros por rota

---

## 🔄 Reutilização de Conteúdo

Todo conteúdo fica armazenado permanentemente e pode ser reutilizado:

### Exportar para outros canais

```sql
-- Buscar posts publicados para usar em email marketing
SELECT title, excerpt, content 
FROM website_content_posts 
WHERE status = 'published' 
AND route = 'blog'
ORDER BY published_at DESC;

-- Buscar conteúdo por keywords
SELECT title, content 
FROM website_content_posts 
WHERE 'NR01' = ANY(keywords);
```

### Histórico de Versões

```sql
-- Ver todas as versões de um post
SELECT version_number, title, created_at 
FROM website_content_versions 
WHERE post_id = 'UUID_DO_POST' 
ORDER BY version_number DESC;
```

---

## 🛠️ Manutenção

### Atualizar Temas

Edite os arrays de temas em:
```
supabase/functions/website-generate-content/index.ts
```

### Modificar Frequência

```sql
UPDATE website_content_schedule 
SET frequency = 'monthly' 
WHERE route = 'blog';
```

### Desabilitar Geração Automática

```sql
UPDATE website_content_schedule 
SET auto_generate_enabled = false 
WHERE route = 'faq';
```

---

## 📝 Próximos Passos

### Para Publicação Real no Website

Implemente uma das seguintes opções:

**Opção 1: API REST Pública**
- Criar endpoint público no Supabase para buscar posts publicados
- Integrar no website com `fetch()`
  
**Opção 2: Webhook**
- Configurar webhook em `website-publish-content`
- Disparar rebuild do site quando novo conteúdo for publicado

**Opção 3: Export Automático**
- Criar Edge Function que exporta posts para GitHub/CMS
- Automatizar com Actions/Pipelines

### Melhorias Futuras

- [ ] Geração de imagens com IA
- [ ] Sistema de preview antes da publicação
- [ ] Analytics de performance de conteúdo
- [ ] A/B testing de títulos
- [ ] Integração com redes sociais (compartilhamento automático)

---

## 🐛 Troubleshooting

### Conteúdo não está sendo gerado

1. Verifique se as Gemini API keys estão configuradas no Supabase
2. Confira os logs em `website_content_activity_logs`
3. Teste a Edge Function manualmente

### Cron Job não está rodando

1. Verifique se `pg_cron` está habilitado
2. Confira `cron.job_run_details` para erros
3. Valide se a URL e Service Role Key estão corretos

### Erro de rate limit no Gemini

O sistema rotaciona automaticamente entre as API keys configuradas. Adicione mais keys:

```bash
# No Supabase Dashboard > Settings > Edge Functions
GEMINI_API_KEY_3=sua_terceira_key
GEMINI_API_KEY_4=sua_quarta_key
```

---

## 📞 Suporte

Para questões técnicas, verifique:
- Logs das Edge Functions no Supabase Dashboard
- Tabela `website_content_activity_logs`
- Console do navegador para erros de frontend

---

**Sistema desenvolvido para HumaniQ AI - Automação Inteligente de Conteúdo** 🤖✨
