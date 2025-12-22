# Solução para Rate Limit do OpenRouter

## 📊 Situação Atual

**Erro:** Rate limit exceeded - free tier
- **Limite:** 10 requisições por período
- **Restantes:** 0 requisições
- **Reset:** Timestamp mostrado no erro (convertido: aproximadamente a cada 1 minuto)

## ✅ Soluções

### Opção 1: Aguardar Reset Automático (Recomendado)
O rate limit reseta em **1 minuto**. Simplesmente aguarde e tente novamente.

**Como fazer:**
1. Espere 1-2 minutos
2. Clique em "Gerar Agora" novamente
3. O sistema automaticamente usará a próxima chave disponível

### Opção 2: Usar Modelo Pago (Se disponível)
Se você tiver créditos no OpenRouter, pode mudar para um modelo pago que não tem rate limit.

**Modificar em:** `supabase/functions/website-generate-content/index.ts`
```typescript
// Linha ~152 - trocar de:
model: "google/gemini-2.0-flash-exp:free",

// Para (se tiver créditos):
model: "google/gemini-2.0-flash-thinking-exp:free", // Outro modelo free
// OU
model: "google/gemini-2.0-flash-exp", // Versão paga (requer créditos)
```

### Opção 3: Adicionar Mais Chaves
Se você tiver mais contas OpenRouter, pode adicionar mais chaves:

```powershell
# Adicionar chave 6, 7, 8, etc.
npx supabase secrets set OPENROUTER_API_KEY_6="sua_nova_chave"
npx supabase secrets set OPENROUTER_API_KEY_7="sua_nova_chave"
```

### Opção 4: Voltar para Gemini Direto
Se você tiver chaves do Gemini API (não OpenRouter):

```powershell
# Configurar Gemini keys diretamente
npx supabase secrets set GEMINI_API_KEY_1="AIza..."
npx supabase secrets set GEMINI_API_KEY_2="AIza..."
```

E modificar o código para usar Gemini direto ao invés de OpenRouter.

## 🔄 Como o Sistema Funciona

1. **Tentativa com Key 1** → Rate limit ❌
2. **Rotação automática para Key 2** → Rate limit ❌
3. **Rotação para Key 3** → Rate limit ❌
4. **Rotação para Key 4** → Rate limit ❌
5. **Rotação para Key 5** → Rate limit ❌
6. **Erro mostrado** (todas as 5 chaves esgotadas)

**Após ~1 minuto:**
- Todas as chaves resetam
- Sistema volta a funcionar normalmente

## ⏰ Informação do Reset

O timestamp `1766257560000` em milissegundos = **2025-12-20 16:06:00**

Isso significa que o rate limit reseta aproximadamente às **16:06** (horário de Brasília).

## 💡 Recomendação

**Para este momento:**
- Aguarde 1-2 minutos
- Tente gerar novamente
- O sistema deve funcionar normalmente

**Para o futuro:**
- O tier gratuito do OpenRouter é muito limitado (10 req/min)
- Considere usar Gemini API direto (tem cotas maiores no free tier)
- Ou adicione mais chaves do OpenRouter para distribuir a carga
