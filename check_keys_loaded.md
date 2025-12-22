# Verificar Logs da Edge Function

Acesse o Supabase Dashboard:
https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/functions

1. Clique em `website-generate-content`
2. Vá na aba **Logs**
3. Procure pela mensagem: `✅ Loaded X OpenRouter API key(s) for rotation`

**Deve mostrar:** `✅ Loaded 13 OpenRouter API key(s) for rotation`

Se mostrar menos de 13, significa que as funções não estão vendo todas as chaves configuradas.

## Alternativa: Verificar via terminal

Execute no Supabase SQL Editor:

```sql
-- Isso vai forçar uma chamada GET para ver o health check
SELECT extensions.http_get(
  'https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/website-generate-content'
);
```

A resposta deve incluir informação sobre quantas chaves foram carregadas.
