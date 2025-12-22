# 📅 Programação Completa - Website Content

## Como Visualizar

**Execute o SQL**: `view_website_content_schedule.sql`
- Acesse: https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql/new
- Cole e execute o conteúdo do arquivo
- Você verá 3 visualizações:
  1. **Programação detalhada** por rota
  2. **Estatísticas** de posts por rota
  3. **Calendário semanal** visual

---

## 📋 Estrutura da Programação

Cada rota de conteúdo pode ter:
- ✅ **Status**: Ativo ou Pausado
- 📅 **Dia da semana**: 0-6 (0=Domingo, 1=Segunda, etc.)
- ⏰ **Hora**: 0-23 (horário BRT)
- 🎯 **Prioridade**: Alta, Média ou Baixa
- 📝 **Última geração**: Quando foi gerado pela última vez

---

## 🎯 Rotas Disponíveis

### 1. **BLOG** 
Artigos gerais sobre RH, saúde mental e gestão de pessoas

### 2. **NR01**
Conteúdo sobre implementação e conformidade com NR01

### 3. **RISCOS-PSICOSSOCIAIS**
Artigos sobre identificação e gestão de riscos psicossociais

### 4. **SOFTWARE-NR01**
Conteúdo sobre ferramentas e software para SST

### 5. **FAQ**
Perguntas frequentes e tutoriais básicos

---

## ⚙️ Como Funciona a Automação

### Verificação Contínua (A Cada Hora)
```
Cron Job → website-scheduler Edge Function
    ↓
Verifica hora atual e dia da semana
    ↓
Consulta website_content_schedule
    ↓
Se encontrar rota programada para agora:
    ↓
Gera conteúdo automaticamente (1 post)
    ↓
Marca como "scheduled"
    ↓
Atualiza last_generated_at
```

### Condições para Gerar
- ✅ `auto_generate_enabled = true`
- ✅ Dia da semana corresponde (`day_of_week`)
- ✅ Hora corresponde (`hour`)
- ✅ Ainda existem templates disponíveis

---

## 📊 Exemplo de Programação

```
ROTA: BLOG
Status: ✅ ATIVO
Dia: 1 - Segunda-feira
Horário: 10:00 BRT
Prioridade: 🔴 ALTA
Última geração: 22/12/24 10:05
Próxima execução: Aguardando próxima Segunda

ROTA: NR01
Status: ✅ ATIVO
Dia: 3 - Quarta-feira
Horário: 14:00 BRT
Prioridade: 🔴 ALTA
Última geração: 18/12/24 14:02
Próxima execução: Aguardando próxima Quarta

ROTA: FAQ
Status: ❌ PAUSADO
Dia: 5 - Sexta-feira
Horário: 16:00 BRT
Prioridade: 🟢 BAIXA
Última geração: Nunca gerou
Próxima execução: ⏸️ Pausado
```

---

## 🗓️ Calendário Semanal (Exemplo)

| Dia | Rota(s) Programada(s) |
|-----|----------------------|
| **DOM** | - |
| **SEG** | blog (10h) |
| **TER** | - |
| **QUA** | nr01 (14h) |
| **QUI** | riscos-psicossociais (11h) |
| **SEX** | software-nr01 (15h), faq (16h) |
| **SAB** | - |

---

## ⚙️ Como Modificar a Programação

### Adicionar Nova Programação
```sql
INSERT INTO website_content_schedule 
(route, day_of_week, hour, priority, auto_generate_enabled)
VALUES 
('blog', 1, 10, 'high', true);
-- Segunda-feira às 10h, prioridade alta, ativo
```

### Modificar Horário Existente
```sql
UPDATE website_content_schedule
SET 
  day_of_week = 3,  -- Mudar para quarta
  hour = 14         -- Às 14h
WHERE route = 'blog';
```

### Pausar Rota Temporariamente
```sql
UPDATE website_content_schedule
SET auto_generate_enabled = false
WHERE route = 'faq';
```

### Reativar Rota
```sql
UPDATE website_content_schedule
SET auto_generate_enabled = true
WHERE route = 'faq';
```

### Alterar Prioridade
```sql
UPDATE website_content_schedule
SET priority = 'high'  -- 'high', 'medium', 'low'
WHERE route = 'blog';
```

---

## 📈 Estatísticas dos Posts

Execute o SQL para ver quantos posts cada rota tem:
- 📝 **Rascunhos** (`draft`)
- 📅 **Agendados** (`scheduled`)
- ✅ **Publicados** (`published`)

---

## 🔍 Verificação Rápida

### Ver todas as programações ativas
```sql
SELECT route, day_of_week, hour 
FROM website_content_schedule 
WHERE auto_generate_enabled = true
ORDER BY day_of_week, hour;
```

### Ver posts gerados hoje
```sql
SELECT route, title, status, created_at
FROM website_content_posts
WHERE DATE(created_at AT TIME ZONE 'America/Sao_Paulo') = CURRENT_DATE
ORDER BY created_at DESC;
```

### Verificar próxima geração programada
```sql
SELECT 
  route,
  CASE day_of_week
    WHEN 0 THEN 'Domingo'
    WHEN 1 THEN 'Segunda'
    WHEN 2 THEN 'Terça'
    WHEN 3 THEN 'Quarta'
    WHEN 4 THEN 'Quinta'
    WHEN 5 THEN 'Sexta'
    WHEN 6 THEN 'Sábado'
  END AS dia,
  hour || ':00' AS horário
FROM website_content_schedule
WHERE auto_generate_enabled = true
  AND day_of_week >= EXTRACT(DOW FROM NOW())
ORDER BY day_of_week, hour
LIMIT 5;
```

---

## 🚨 Importante

1. **Fusos Horários**: O sistema usa BRT (UTC-3). O cron ajusta automaticamente.

2. **Templates Limitados**: Cada rota tem um número limitado de templates únicos. Quando acabarem, será necessário deletar posts antigos para liberar templates.

3. **Status "Scheduled"**: Posts gerados automaticamente ficam como "scheduled". Use a interface para publicá-los ou configure publicação automática.

4. **Logs**: Verifique `website_content_activity_logs` para ver histórico de gerações.

---

## 📚 Arquivos Relacionados

- `view_website_content_schedule.sql` - Visualização completa
- `view_all_schedules.sql` - Todos os agendamentos (LinkedIn + Website)
- `AGENDAMENTO_POSTAGENS.md` - Documentação geral

---

**Última atualização**: 22/12/2024
