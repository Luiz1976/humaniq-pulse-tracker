# Diagnóstico: Chaves OpenRouter Configuradas

## Situação Atual

**O script add_new_openrouter_keys.ps1 configura:**
- OPENROUTER_API_KEY_6 até OPENROUTER_API_KEY_13 (8 chaves)
- Junto com as 5 antigas (1-5) = **13 chaves total**

## Problema

**O OpenRouter free tier tem limite muito agressivo:**
- 10 requisições/minuto **POR CHAVE**
- Com 13 chaves = 130 req/min teórico
- **MAS** todas as chaves resetam ao mesmo tempo

**Se você fizer múltiplas requisições rápidas:**
1. A primeira usa Key 1 ✅
2. A segunda tenta Key 2, mas Key 1 ainda está em cooldown
3. Eventualmente **todas** as 13 chaves ficam em rate limit
4. Você precisa esperar 60s para TODAS resetarem

## Soluções

### Opção 1: Esperar 60 segundos completos (GRÁTIS)
Aguarde 1 minuto inteiro entre cada geração de conteúdo.

### Opção 2: Usar modelo PAGO (Recomendado)
Custo: ~$0.0001 por requisição (menos de 1 centavo)
Sem rate limit agressivo

Trocar na Edge Function:
```typescript
model: "google/gemini-2.0-flash-exp:free"  // Atual
model: "google/gemini-flash-1.5"  // Pago, barato
```

### Opção 3: Adicionar MAIS chaves (Temporário)
Criar mais contas OpenRouter e adicionar até 50 chaves.
Isso aumenta o tempo antes de esgotar todas.

## Recomendação

**Use o modelo pago.** Com 100 requisições por mês você gasta apenas $0.01 (1 centavo).
É muito mais confiável e rápido.
