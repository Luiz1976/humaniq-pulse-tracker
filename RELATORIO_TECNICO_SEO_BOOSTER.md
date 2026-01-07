# Relatório Técnico: Módulo SEO Booster (Aceleração de Ranking)

## 1. Visão Geral
O **SEO Booster** é um módulo de automação de tráfego e monitoramento de disponibilidade desenvolvido em **React/TypeScript**, integrado diretamente ao painel administrativo (Front-end) da aplicação HumaniQ Pulse.

Seu objetivo técnico é manter um padrão de atividade constante ("Heartbeat") nas páginas estratégicas, garantindo:
1.  Renovação de cache em nível de servidor/CDN (Cache Warming).
2.  Geração de sinais de tráfego e disponibilidade para indexadores.
3.  Monitoramento em tempo real da latência de resposta.

## 2. Especificações Técnicas

### 2.1. Mecanismo de Execução ("Ping Engine")
O núcleo do sistema opera através de requisições HTTP assíncronas geradas pelo navegador do cliente (Client-Side).

*   **Protocolo**: HTTPS.
*   **Método**: `GET`.
*   **Modo de Requisição**: `no-cors` (Opaque Request).
    *   *Justificativa Técnica*: O modo `no-cors` é utilizado para permitir que o script do painel (hosteado em um domínio/local) acesse as páginas do site público (hosteado em outro) sem ser bloqueado pelas políticas de segurança do navegador. Embora o navegador não tenha acesso ao "conteúdo" da resposta (body), a requisição **chega** ao servidor de destino, gerando o log de acesso e ativando os processos de backend (SSR/ISR).
*   **Concorrência**: Sequencial (Loop for-await) para evitar sobrecarga de thread única do navegador e garantir medição precisa de latência individual.

### 2.2. Automação e Frequência
O sistema utiliza um `Watchdog Timer` baseado em `setInterval` do JavaScript, gerenciado pelo ciclo de vida do componente React (`useEffect`).

*   **Intervalos Configuráveis**:
    *   **Turbo (30s)**: Alta agressividade. Ideal para pós-deploy imediato.
    *   **Alta (60s - Padrão)**: Balanço ideal entre manutenção de cache e carga.
    *   **Média (5 min)**: Manutenção de rotina.
    *   **Baixa (10 min)**: Monitoramento passivo.

### 2.3. Alvos (Target Map)
O sistema está hardcoded para monitorar 10 endpoints críticos da arquitetura de informação do site:
1.  `/` (Homepage)
2.  `/nr01` (Landing Page Pilar)
3.  `/riscos-psicossociais` (Landing Page Pilar)
4.  `/software-nr01` (Página de Produto)
5.  `/blog` (Hub de Conteúdo)
6.  `/blog/nr01-2026` (Artigo Cornerstone)
7.  `/blog/checklist-multas-nr01` (Artigo Satélite)
8.  `/blog/inventario-riscos-pgr` (Artigo Satélite)
9.  `/blog/sinais-burnout` (Artigo Satélite)
10. `/blog/ia-gestao-pessoas` (Artigo Satélite)

## 3. Impacto na Infraestrutura e SEO

### 3.1. Cache Warming (Aquecimento de Cache)
Sistemas modernos (Next.js, Vercel, CDNs) utilizam estratégias de cache para entregar conteúdo rápido. Se uma página não é acessada por um tempo, o cache expira ("Fica Frio").
*   **Ação do SEO Booster**: Ao visitar a página a cada 60s, o sistema garante que o cache esteja sempre "Quente" (HIT).
*   **Resultado**: Quando o Googlebot ou um cliente real acessa a página, ela é entregue em milissegundos (Time to First Byte - TTFB otimizado), o que é um fator direto de ranqueamento (Core Web Vital).

### 3.2. Sinais de Disponibilidade
O Google penaliza sites que apresentam instabilidade ou erros 5xx/4xx.
*   **Ação**: O monitoramento constante permite identificar, via coloração no painel, se alguma rota parou de responder, permitindo ação corretiva imediata antes que afete o ranking.

## 4. Limitações e Escopo
*   **Execução**: Requer que a aba do navegador esteja aberta e ativa (ou em segundo plano com permissão de execução de timers). Se a aba for fechada, o ciclo para.
*   **Origem**: O tráfego é originado do seu IP atual.

## 5. Conclusão Técnica
O SEO Booster funciona como um **monitor de uptime ativo e mantenedor de cache**. Ele não manipula o algoritmo do Google diretamente (o que seria "Black Hat"), mas otimiza a infraestrutura do site para que ela entregue a melhor performance possível quando o Googlebot passar, o que indiretamente favorece o posicionamento privilegiado.
