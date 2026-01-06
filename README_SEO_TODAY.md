
# 🚀 Guia de Indexação Imediata no Google (Sem Custo)

Este guia contém as "programações" e passos para tentar posicionar o HumaniQ Pulse na primeira página (ou pelo menos ser indexado) ainda hoje, utilizando a **Google Indexing API** e **Schema Automation**.

## 1. Preparação (Obrigatório)

Para que os scripts funcionem, você precisa de uma "Service Account" do Google. Isso é gratuito.

1.  Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2.  Crie um novo projeto (ex: "HumaniQ SEO").
3.  Vá em **APIs e Serviços > Ativar APIs e Serviços**.
4.  Busque e ative a **"Google Search Indexing API"**.
5.  Vá em **IAM e Admin > Contas de Serviço** e crie uma nova conta.
6.  Na conta criada, vá em **Chaves > Adicionar Chave > Criar nova chave JSON**.
7.  Baixe o arquivo JSON, renomeie para `service_account.json` e coloque na pasta `scripts/` deste projeto.
8.  **IMPORTANTE:** Copie o e-mail da conta de serviço (algo como `seo-bot@projeto.iam.serviceaccount.com`).
9.  Vá no [Google Search Console](https://search.google.com/search-console) do seu domínio, vá em **Configurações > Usuários e Permissões** e ADICIONE esse e-mail como **Proprietário**.

## 2. Instalar Dependências

Abra o terminal neste projeto e rode:

```bash
npm install googleapis dotenv
```

## 3. Rodar a Indexação Automática (O "Pulo do Gato")

Este script envia suas URLs diretamente para a fila de prioridade do Google.

1.  Edite o arquivo `scripts/submit-indexing.js` e atualize a lista `urlsToIndex` com as URLs reais do seu site publicado (ex: `https://humaniq.com.br/...`).
2.  Rode o script:

```bash
node scripts/submit-indexing.js
```

Se der tudo certo, você verá mensagens de "Sucesso". O Google deve visitar suas páginas em alguns minutos.

## 4. Gerar Sitemap XML

Para garantir que o Google encontre tudo:

1.  Edite `scripts/generate-sitemap.js` e ajuste a `BASE_URL`.
2.  Rode:

```bash
node scripts/generate-sitemap.js
```

Isso vai criar um arquivo `sitemap.xml` na pasta pública. Faça o deploy do site novamente para que este arquivo vá para o ar.

## 5. Estratégia de Conteúdo (Schema Markup)

Já implementamos no código (`SchemaMarkup.tsx`) tags especiais que dizem ao Google: "Ei, este é um artigo técnico verificado". Isso aumenta a chance de aparecer em destaques (Rich Snippets).

---

**Resumo para "Hoje":**
1. Configure a conta no Google Cloud.
2. Rode `node scripts/submit-indexing.js`.
3. Aguarde algumas horas e verifique no Google pesquisando `site:seudominio.com`.
