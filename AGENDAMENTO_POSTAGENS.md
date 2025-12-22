# 📅 Agendamento de Todas as Postagens - Visão Geral

## Como Visualizar o Agendamento Completo

### Método 1: Executar SQL (Recomendado)

1. Acesse: https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql/new
2. Abra o arquivo: **`view_all_schedules.sql`**
3. Copie e execute no SQL Editor
4. Você verá:
   - ✅ Configuração LinkedIn (frequência, horários, status)
   - ✅ Posts LinkedIn prontos para publicação
   - ✅ Programação Website Content por rota
   - ✅ Posts Website por rota e status
   - ✅ Cron jobs ativos
   - ✅ Resumo geral do sistema

---

## Configuração Atual (Resumo)

### 🔵 LinkedIn - Postagem Automática

**Status**: Configurado para automação  
**Frequência**: 1x por dia (1440 minutos)  
**Janela horária**: 10:00 - 11:00  
**Mínimo de posts prontos**: 10  

**Como funciona**:
- Cron job executa diariamente às 10h BRT
- Verifica se há posts "ready" disponíveis
- Publica automaticamente o próximo post da fila
- Gera novos posts se quantidade cair abaixo do mínimo

---

### 🌐 Website Content - Postagem Programada

**Status**: Configurado para automação por rota  
**Verificação**: A cada hora  
**Rotas disponíveis**: blog, nr01, riscos-psicossociais, software-nr01, faq

**Como funciona**:
- Cron job executa a cada hora
- Consulta tabela `website_content_schedule`
- Para cada rota configurada:
  - Verifica se é o dia da semana correto
  - Verifica se é a hora correta
  - Gera conteúdo automaticamente se `auto_generate_enabled = true`

**Exemplo de programação**:
```
Rota: blog
Dia: Segunda-feira (1)
Hora: 10:00
Status: Ativo
Prioridade: Alta
```

---

## Cron Jobs Ativos

### 1. `linkedin-daily-automation`
- **Frequência**: `0 13 * * *` (diário às 13:00 UTC = 10:00 BRT)
- **Função**: Chama `linkedin-scheduler` Edge Function
- **Ação**: Publica posts LinkedIn automaticamente

### 2. `website-content-automation`
- **Frequência**: `0 * * * *` (a cada hora)
- **Função**: Chama `website-scheduler` Edge Function
- **Ação**: Verifica e gera conteúdo website conforme schedule

---

## Status dos Posts

### LinkedIn
Execute query para ver:
- Quantos posts estão "ready" (prontos para publicar)
- Quantos foram publicados
- Quantos falharam

### Website Content
Execute query para ver por rota:
- Quantos estão em "draft" (rascunho)
- Quantos estão "scheduled" (agendados)
- Quantos foram "published" (publicados)

---

## Como Modificar o Agendamento

### Alterar Frequência LinkedIn

```sql
UPDATE linkedin_settings
SET 
  post_interval_minutes = 1440,  -- 1440 = 24h, 720 = 12h, 60 = 1h
  post_start_hour = 10,           -- Hora de início
  post_end_hour = 11,             -- Hora de término
  updated_at = NOW();
```

### Alterar Programação Website Content

```sql
UPDATE website_content_schedule
SET 
  day_of_week = 1,               -- 0=Dom, 1=Seg, 2=Ter, etc
  hour = 10,                      -- Hora do dia (0-23)
  auto_generate_enabled = true,   -- true = ativo, false = pausado
  priority = 'high'               -- high, medium, low
WHERE route = 'blog';
```

### Pausar Automação Temporariamente

**LinkedIn**:
```sql
UPDATE linkedin_settings
SET auto_post_enabled = false;
```

**Website Content (por rota)**:
```sql
UPDATE website_content_schedule
SET auto_generate_enabled = false
WHERE route = 'blog';
```

---

## Verificação Rápida

Para ver status em tempo real, execute:
```sql
-- LinkedIn
SELECT auto_post_enabled, post_interval_minutes, last_post_at 
FROM linkedin_settings;

-- Website Content
SELECT route, day_of_week, hour, auto_generate_enabled 
FROM website_content_schedule 
ORDER BY day_of_week, hour;

-- Cron Jobs
SELECT jobname, schedule, active 
FROM cron.job 
WHERE jobname LIKE '%automation%';
```

---

## Arquivos de Referência

- **`view_all_schedules.sql`** - Visualização completa de todos os agendamentos
- **`setup_complete_automation.sql`** - Script para ativar cron jobs
- **`update_linkedin_to_daily.sql`** - Atualizar LinkedIn para diário
- **`verify_website_schedule.sql`** - Verificar programação website

---

## Suporte

Para mais detalhes sobre Edge Functions:
- `linkedin-scheduler` - https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/functions/linkedin-scheduler
- `website-scheduler` - https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/functions/website-scheduler

Para logs de execução, verifique:
- `linkedin_activity_logs` - Logs de atividade LinkedIn
- `website_content_activity_logs` - Logs de atividade Website

---

**Última atualização**: 22/12/2024
