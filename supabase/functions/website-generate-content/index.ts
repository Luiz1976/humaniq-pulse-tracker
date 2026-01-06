import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Blog Post Templates by Route
const BLOG_TEMPLATES = {
    blog: [
        {
            title: "Saúde Mental no Trabalho: O Novo Desafio do RH Moderno",
            excerpt: "Descubra como transformar a gestão de saúde mental em vantagem competitiva para sua empresa.",
            content: `# Saúde Mental no Trabalho: O Novo Desafio do RH Moderno

## Por que a saúde mental virou prioridade estratégica?

Nos últimos anos, a saúde mental dos colaboradores deixou de ser apenas uma preocupação de bem-estar para se tornar um **imperativo de negócio**. Dados recentes mostram que empresas com programas estruturados de saúde mental têm:

- 🎯 32% mais produtividade
- 📉 40% menor turnover  
- 💰 ROI de 4:1 em investimentos

## O Cenário Atual no Brasil

Segundo pesquisa da ISMA-BR, **72% dos trabalhadores** brasileiros sofrem com algum nível de stress ocupacional. Mais alarmante: apenas **18% das empresas** possuem programas estruturados de prevenção.

> **Insight importante**: A ausência de gestão adequada de saúde mental custa às empresas brasileiras mais de R$ 200 bilhões por ano em perda de produtividade e afastamentos.

## Como Implementar uma Gestão Eficaz

### 1. Mapeamento de Riscos Psicossociais

O primeiro passo é identificar os fatores de risco presentes na organização:
- Sobrecarga de trabalho
- Falta de autonomia
- Relações interpessoais conflituosas
- Assédio moral

### 2. Ferramentas de Assessment

Utilize tecnologia para avaliar continuamente o clima organizacional. A **HumaniQ AI** oferece plataforma completa para mapeamento automatizado de riscos psicossociais.

### 3. Planos de Ação Personalizados

Com base nos dados coletados, implemente intervenções específicas por área ou equipe.

### 4. Monitoramento Contínuo

A gestão de saúde mental não é projeto pontual, mas processo contínuo que requer acompanhamento regular.

## Cases de Sucesso

Empresas que implementaram soluções estruturadas reportam:
- Redução de 45% em afastamentos por questões psicossociais
- Aumento de 38% no eNPS (Employee Net Promoter Score)
- Economia média de R$ 2.500 por colaborador/ano

## Próximos Passos

Pronto para transformar a gestão de saúde mental na sua empresa?

A HumaniQ AI oferece solução completa, da avaliação ao monitoramento contínuo.

👉 **Conheça nossa plataforma**: [www.humaniqai.com.br](https://www.humaniqai.com.br)

#SaúdeMental #RH #GestãoDePessoas #BemEstar`,
            meta_title: "Saúde Mental no Trabalho: Guia Completo para RH | HumaniQ AI",
            meta_description: "Descubra estratégias eficazes para gestão de saúde mental corporativa. Dados, cases e soluções práticas para RH moderno.",
            keywords: ["saúde mental no trabalho", "gestão de pessoas", "RH", "bem-estar corporativo", "riscos psicossociais", "clima organizacional"]
        },
        {
            title: "People Analytics: Como Dados Transformam a Gestão de RH",
            excerpt: "Aprenda a usar dados para tomar decisões estratégicas em gestão de pessoas e aumentar resultados.",
            content: `# People Analytics: Como Dados Transformam a Gestão de RH

## A Revolução Data-Driven no RH

O RH tradicionalmente baseado em intuição está dando lugar a uma abordagem **orientada por dados**. People Analytics é a aplicação de métodos analíticos a dados de RH para melhorar decisões sobre pessoas.

## Principais Métricas de People Analytics

### Indicadores de Engajamento
- eNPS (Employee Net Promoter Score)
- Taxa de participação em pesquisas
- Índice de satisfação por área

### Indicadores de Retenção
- Turnover geral e por departamento
- Tempo médio de permanência
- Custo de substituição

### Indicadores de Performance
- Produtividade por colaborador
- Tempo para atingir metas
- Taxa de promoções internas

## Como Implementar

**1. Defina objetivos claros**
- O que você quer melhorar?
- Quais decisões precisa tomar?

**2. Colete dados de qualidade**
- Sistemas integrados
- Pesquisas periódicas
- Avaliações estruturadas

**3. Analise e interprete**
- Identifique padrões
- Correlacione variáveis
- Gere insights acionáveis

**4. Tome ações baseadas em dados**
- Implemente mudanças
- Monitore resultados
- Otimize continuamente

## A HumaniQ AI como Solução

Nossa plataforma oferece dashboards completos de People Analytics focados em saúde ocupacional e riscos psicossociais, integrando dados de múltiplas fontes para uma visão 360° da organização.

**Saiba mais**: [www.humaniqai.com.br](https://www.humaniqai.com.br)

#PeopleAnalytics #DataDriven #RH #Gestão`,
            meta_title: "People Analytics: Guia Completo de Gestão por Dados | HumaniQ",
            meta_description: "Aprenda a usar People Analytics para decisões estratégicas em RH. Métricas, ferramentas e cases de sucesso.",
            keywords: ["people analytics", "RH data driven", "métricas de RH", "gestão por dados", "analytics corporativo"]
        }
    ],
    nr01: [
        {
            title: "Guia Completo de Implementação da NR01: Passo a Passo Prático",
            excerpt: "Tudo que sua empresa precisa saber para estar em conformidade com a NR01 e evitar penalidades.",
            content: `# Guia Completo de Implementação da NR01: Passo a Passo Prático

## O Que É a NR01?

A Norma Regulamentadora 01 (NR01) estabelece as disposições gerais sobre segurança e saúde no trabalho no Brasil. Desde a atualização de 2022, a gestão de **riscos psicossociais** tornou-se **obrigatória**.

## Principais Requisitos da NR01

### 1. Gestão de Riscos Ocupacionais (GRO)

Todo estabelecimento deve implementar Gerenciamento de Riscos Ocupacionais compreendendo:
- ✅ Identificação de perigos
- ✅ Avaliação de riscos
- ✅ Controle de riscos
- ✅ Análise de acidentes

### 2. Programa de Gerenciamento de Riscos (PGR)

Documento que formaliza o GRO, incluindo:
- Inventário de riscos
- Plano de ação
- Cronogramas
- Responsáveis

### 3. Riscos Psicossociais

**Novidade crucial**: Avaliação obrigatória de fatores como:
- Organização do trabalho
- Jornadas de trabalho
- Relações socioprofissionais
- Assédio e violência

## Passo a Passo para Conformidade

### Etapa 1: Diagnóstico (1-2 semanas)
- Mapeie todos os riscos atuais
- Identifique gaps de conformidade
- Liste documentação necessária

### Etapa 2: Planejamento (1 semana)
- Defina cronograma de adequação
- Aloque recursos e responsáveis
- Escolha ferramentas de gestão

### Etapa 3: Implementação (4-8 semanas)
- Crie ou atualize documentos
- Implemente controles
- Treine equipes

### Etapa 4: Monitoramento (contínuo)
- Auditorias periódicas  
- Revisões regulares
- Atualizações conforme mudanças

## Penalidades por Não Conformidade

⚠️ **Atenção**: Multas podem chegar a **R$ 50.000** por infração.

Além disso:
- Interdições e embargos
- Processos trabalhistas
- Danos à reputação

## Solução Tecnológica da HumaniQ AI

Automatize todo o processo de conformidade com nossa plataforma:
- 📊 Mapeamento automatizado
- 📄 Documentação em conformidade
- 🔔 Alertas de prazos
- 📈 Relatórios executivos

**Conheça**: [www.humaniqai.com.br](https://www.humaniqai.com.br)

#NR01 #Compliance #SST #SegurançaDoTrabalho`,
            meta_title: "Guia Completo NR01: Implementação Passo a Passo | HumaniQ AI",
            meta_description: "Aprenda a implementar a NR01 na sua empresa. Guia prático com checklist, prazos e soluções para conformidade total.",
            keywords: ["NR01", "norma regulamentadora", "compliance SST", "segurança do trabalho", "riscos psicossociais NR01", "PGR"]
        },
        {
            title: "NR01 e Riscos Psicossociais: O Que Mudou e Como Se Adequar",
            excerpt: "Entenda as mudanças na NR01 sobre riscos psicossociais e garanta a conformidade da sua empresa.",
            content: `# NR01 e Riscos Psicossociais: O Que Mudou e Como Se Adequar

## A Grande Mudança de 2022

A atualização da NR01 em 2022 trouxe uma mudança **histórica** para a segurança do trabalho no Brasil: a obrigatoriedade de avaliar e gerenciar **riscos psicossociais**.

## O Que São Riscos Psicossociais?

São fatores do ambiente e organização do trabalho que podem causar danos à saúde mental e física dos trabalhadores:

### Aspectos da Organização
- Sobrecarga de trabalho
- Metas irrealistas
- Falta de clareza nas funções

### Jornadas e Pausas
- Excesso de horas extras
- Falta de pausas adequadas
- Trabalho em turnos irregulares

### Relações Interpessoais
- Assédio moral
- Conflitos não resolvidos
- Falta de suporte social

## Requisitos Legais

A NR01 agora **exige**:

1️⃣ **Identificação** dos fatores de risco psicossocial  
2️⃣ **Avaliação** do nível de exposição  
3️⃣ **Implementação** de medidas de controle  
4️⃣ **Documentação** no PGR  
5️⃣ **Monitoramento** contínuo

## Como a HumaniQ AI Ajuda

Nossa plataforma oferece:
- ✅ Questionários validados cientificamente
- ✅ Análise automatizada de riscos
- ✅ Relatórios em conformidade com NR01
- ✅ Dashboards em tempo real
- ✅ Planos de ação personalizados

**Demonstração gratuita**: [www.humaniqai.com.br](https://www.humaniqai.com.br)

#NR01 #RiscosPsicossociais #Compliance #SST`,
            meta_title: "NR01 Riscos Psicossociais: Guia de Conformidade 2024 | HumaniQ",
            meta_description: "Entenda as mudanças da NR01 sobre riscos psicossociais. Checklist completo e soluções práticas para adequação.",
            keywords: ["NR01 riscos psicossociais", "atualização NR01", "riscos psicossociais obrigatórios", "compliance NR01", "SST psicossocial"]
        }
    ],
    "riscos-psicossociais": [
        {
            title: "Mapeamento de Riscos Psicossociais: Metodologias e Ferramentas",
            excerpt: "Conheça as principais metodologias para mapear riscos psicossociais e escolha a melhor para sua organização.",
            content: `# Mapeamento de Riscos Psicossociais: Metodologias e Ferramentas

## Por Que Mapear Riscos Psicossociais?

O mapeamento é o **primeiro passo** para gestão eficaz de riscos psicossociais. Sem mapeamento adequado, você está:
- ❌ Agindo no escuro
- ❌ Desperdiçando recursos
- ❌ Expondo a empresa a passivos

## Principais Metodologias

### 1. Copenhagen Psychosocial Questionnaire (COPSOQ)

**Características**:
- Desenvolvido na Dinamarca
- 41 dimensões psicossociais
- Validado internacionalmente

**Quando usar**: Organizações que buscam avaliação abrangente e comparação internacional.

### 2. Job Content Questionnaire (JCQ)

**Características**:
- Foco em demanda-controle
- Mais compacto que COPSOQ
- Ênfase em autonomia

**Quando usar**: Avaliações rápidas focadas em organização do trabalho.

### 3. INSAT (França)

**Características**:
- Metodologia participativa
- Inclui observação do trabalho
- Foco em mudanças concretas

**Quando usar**: Organizações que querem envolver trabalhadores ativamente.

## Processo de Mapeamento em 5 Passos

### Passo 1: Planejamento
- Defina escopo e objetivos
- Escolha metodologia
- Forme equipe responsável

### Passo 2: Coleta de Dados
- Aplique questionários
- Realize entrevistas
- Observe processos

### Passo 3: Análise
- Processe dados quantitativos
- Analise dados qualitativos
- Identifique padrões

### Passo 4: Priorização
- Classifique riscos por severidade
- Considere número de expostos
- Avalie viabilidade de intervenção

### Passo 5: Ação
- Elabore planos de ação
- Implemente medidas
- Monitore resultados

## Tecnologia no Mapeamento

Ferramentas digitais como a **HumaniQ AI** trazem vantagens significativas:

✅ Automatização da coleta  
✅ Análise em tempo real  
✅ Dashboards visuais  
✅ Comparação histórica  
✅ Conformidade garantida com NR01

**Veja como funciona**: [www.humaniqai.com.br](https://www.humaniqai.com.br)

#RiscosPsicossociais #Mapeamento #SST #Avaliação`,
            meta_title: "Mapeamento de Riscos Psicossociais: Metodologias Completas | HumaniQ",
            meta_description: "Guia completo de metodologias para mapear riscos psicossociais. Compare COPSOQ, JCQ, INSAT e escolha a melhor.",
            keywords: ["mapeamento riscos psicossociais", "COPSOQ", "metodologias psicossociais", "avaliação psicossocial", "ferramentas assessment"]
        }
    ],
    "software-nr01": [
        {
            title: "Software para NR01: Como Escolher a Melhor Solução",
            excerpt: "Comparativo completo de funcionalidades essenciais em software de gestão de SST e conformidade com NR01.",
            content: `# Software para NR01: Como Escolher a Melhor Solução

## Por Que Usar Software Especializado?

Gerenciar conformidade com NR01 manualmente é:
- ⏰ Demorado (até 20h/semana)
- 📝 Propenso a erros
- 💸 Custoso em retrabalho
- ⚖️ Arriscado legalmente

Software especializado reduz esse tempo em **80%** e elimina erros críticos.

## Funcionalidades Essenciais

### 1. Mapeamento de Riscos

O software deve permitir:
- ✅ Cadastro de ambientes e processos
- ✅ Identificação de perigos
- ✅ Classificação de riscos
- ✅ Priorização automática

### 2. Avaliação Psicossocial

Recursos necessários:
- Questionários parametrizáveis
- Aplicação online/offline
- Análise estatística
- Relatórios gráficos

### 3. Gestão de Documentos

- Geração automática de PGR
- versionamento de documentos
- Assinaturas digitais
- Histórico de alterações

### 4. Monitoramento e Alertas

- Dashboards em tempo real
- Notificações de prazos
- Indicadores de performance
- Comparativos temporais

### 5. Conformidade Legal

- Atualizações automáticas de normas
- Templates em conformidade
- Rastreabilidade completa
- Pronto para auditoria

## Comparativo de Soluções

| Funcionalidade | Planilhas | Software Genérico | **HumaniQ AI** |
|---|---|---|---|
| Mapeamento Automatizado | ❌ | ⚠️ Parcial | ✅ Completo |
| Riscos Psicossociais | ❌ | ❌ | ✅ Sim |
| Conformidade NR01 | ❌ | ⚠️ Básica | ✅ Total |
| Dashboards Tempo Real | ❌ | ⚠️ Limitado | ✅ Avançado |
| Suporte Especializado | ❌ | ⚠️ Genérico | ✅ SST Expert |

## ROI: Vale a Pena?

Investimento típico em software: **R$ 500-2000/mês**

Retornos mensuráveis:
- 💰 Economia de 15h/semana = R$ 6.000/mês
- 📉 Redução de 30% em afastamentos = R$ 15.000/mês
- ⚖️ Evitar uma multa = R$ 50.000 (pontual)

**ROI médio: 10:1**

## Por Que Escolher a HumaniQ AI?

Nossa solução foi desenvolvida **especificamente** para:
- NR01 e riscos psicossociais
- Empresas brasileiras
- Conformidade total
- Facilidade de uso

**Teste gratuito por 7 dias**: [www.humaniqai.com.br](https://www.humaniqai.com.br)

#SoftwareSST #NR01 #Tecnologia #Automação`,
            meta_title: "Melhor Software NR01: Comparativo e Guia de Escolha | HumaniQ",
            meta_description: "Descubra como escolher software para NR01. Comparativo completo de funcionalidades, preços e ROI.",
            keywords: ["software NR01", "sistema SST", "software riscos psicossociais", "automação compliance", "gestão SST digital"]
        }
    ],
    faq: [
        {
            title: "Perguntas Frequentes sobre NR01 e Riscos Psicossociais",
            excerpt: "Respostas para as dúvidas mais comuns sobre implementação da NR01 e gestão de riscos psicossociais.",
            content: `# Perguntas Frequentes sobre NR01 e Riscos Psicossociais

## Sobre a NR01

### 1. A NR01 se aplica à minha empresa?

**Sim, se você tem funcionários CLT**. A NR01 é aplicável a todos os empregadores e instituições que admitam trabalhadores como empregados, independentemente do porte ou setor.

### 2. Qual o prazo para adequação?

A obrigatoriedade de gestão de riscos psicossociais **já está em vigor** desde 2022. Não há prazo de transição - a conformidade deve ser imediata.

### 3. O que acontece se eu não cumprir?

Possíveis consequências:
- Multas de R$ 1.000 a R$ 50.000
- Interdição/embargo
- Processos trabalhistas
- Responsabilização civil e criminal

## Sobre Riscos Psicossociais

### 4. O que são exatamente riscos psicossociais?

São fatores do trabalho que podem causar estresse, esgotamento e doenças mentais:
- Sobrecarga de atividades
- Falta de autonomia
- Pressão excessiva
- Assédio e conflitos
- Jornadas inadequadas

### 5. Como avaliar riscos psicossociais?

Use metodologias validadas como:
- Questionários estruturados (COPSOQ, JCQ)
- Entrevistas coletivas
- Análise de indicadores (absenteísmo, turnover)
- Plataformas digitais especializadas

### 6. Com que frequência devo avaliar?

Recomenda-se:
- **Anualmente**: avaliação completa
- **Semestralmente**: monitoramento de indicadores
- **Ad-hoc**: após mudanças organizacionais significativas

## Sobre Implementação

### 7. Por onde começar?

Siga este roteiro:
1. Mapeie riscos atuais
2. Priorize por criticidade
3. Elabore plano de ação
4. Implemente controles
5. Monitore resultados

### 8. Preciso contratar consultoria?

Não obrigatoriamente, mas recomendado para:
- Primeira implementação
- Organizações complexas
- Setores de alto risco

Alternativamente, use plataformas automatizadas como a **HumaniQ AI**.

### 9. Quanto tempo leva a implementação?

Prazos típicos:
- **Pequena empresa**: 2-4 semanas
- **Média empresa**: 1-2 meses
- **Grande empresa**: 2-4 meses

## Sobre Tecnologia

### 10. Vale a pena usar software?

**Sim!** Benefícios:
- Reduz tempo em 80%
- Elimina erros manuais
- Garante conformidade
- Facilita monitoramento
- ROI médio de 10:1

A **HumaniQ AI** oferece solução completa e especializada.

**Tire suas dúvidas com nossa equipe**: [www.humaniqai.com.br](https://www.humaniqai.com.br)

#FAQ #NR01 #Dúvidas #SST`,
            meta_title: "FAQ NR01 e Riscos Psicossociais: Perguntas Frequentes | HumaniQ",
            meta_description: "Respostas completas para dúvidas sobre NR01, riscos psicossociais, implementação e conformidade.",
            keywords: ["FAQ NR01", "dúvidas NR01", "perguntas riscos psicossociais", "compliance dúvidas", "NR01 perguntas frequentes"]
        }
    ]
};

serve(async (req) => {
    // CORS Preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // Health Check
    if (req.method === "GET") {
        const templateCounts = Object.entries(BLOG_TEMPLATES).map(([route, templates]) => ({
            route,
            count: templates.length
        }));

        return new Response(JSON.stringify({
            status: "online",
            mode: "template-based",
            templates: templateCounts,
            time: new Date().toISOString(),
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }

    try {
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("CUSTOM_SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("CUSTOM_SERVICE_ROLE_KEY");

        if (!SUPABASE_URL) throw new Error("SUPABASE_URL not configured");
        if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

        const reqBody = await req.json().catch(err => {
            throw new Error(`Failed to parse request body: ${err.message}`);
        });

        const { route, count = 1, auto_mode = false } = reqBody;

        if (!route) {
            throw new Error("route is required (blog, nr01, riscos-psicossociais, software-nr01, faq)");
        }

        if (!BLOG_TEMPLATES[route as keyof typeof BLOG_TEMPLATES]) {
            throw new Error(`Invalid route: ${route}. Available: ${Object.keys(BLOG_TEMPLATES).join(", ")}`);
        }

        console.log(`✅ Using template-based generation for route: ${route}`);

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Get existing posts to avoid duplicates
        const { data: existingPosts } = await supabase
            .from("website_content_posts")
            .select("title, slug")
            .eq("route", route);

        const existingTitles = existingPosts?.map(p => p.title) || [];

        const generatedPosts = [];
        const templates = BLOG_TEMPLATES[route as keyof typeof BLOG_TEMPLATES];

        // Filter out already used templates to ensure unique posts
        let availableTemplates = templates.filter(
            template => !existingTitles.includes(template.title)
        );

        // REMOVED LIMIT: If no unique templates, use all templates (recycling)
        if (availableTemplates.length === 0) {
            console.log("⚠️ All templates used. Recycling existing templates via unlimited mode.");
            availableTemplates = [...templates];
        }

        for (let i = 0; i < count; i++) {
            if (availableTemplates.length === 0) {
                // Refill again if we run out during generation
                console.log("⚠️ Ran out of templates in loop. Refilling...");
                availableTemplates = [...templates];
            }

            // Select random template from available ones
            const randomIndex = Math.floor(Math.random() * availableTemplates.length);
            const template = availableTemplates[randomIndex];

            // Remove selected template to prevent duplicates
            availableTemplates.splice(randomIndex, 1);

            console.log(`📝 Generating post ${i + 1}/${count} for ${route} - Template: "${template.title}"`);

            // ==================================================================================
            // SEO 10/10 ENHANCEMENT: Interlinking + E-E-A-T Author Box
            // ==================================================================================

            // 1. Determine Internal Links based on Route
            let interlinks = "";
            if (route === 'blog') {
                interlinks = `\n\n## 📚 Leia Também\n\nPara aprofundar este tema, recomendamos:\n\n- **[Guia Completo NR-01](/nr01)** - *Implementação passo a passo e conformidade*\n- **[Riscos Psicossociais](/riscos-psicossociais)** - *Como identificar e prevenir riscos mentais*`;
            } else if (route === 'nr01') {
                interlinks = `\n\n## 📚 Recursos Relacionados\n\n- **[Software para NR-01](/software-nr01)** - *Automatize a conformidade da sua empresa*\n- **[FAQ NR-01](/faq)** - *Dúvidas frequentes sobre a norma*\n- **[Riscos Psicossociais](/riscos-psicossociais)** - *Entenda a obrigatoriedade*`;
            } else if (route === 'riscos-psicossociais') {
                interlinks = `\n\n## 📚 Leia Também\n\n- **[NR-01 Atualizada](/nr01)** - *Requisitos legais para riscos psicossociais*\n- **[Saúde Mental no RH](/blog)** - *Estratégias para gestão de pessoas*\n- **[Solução HumaniQ](/software-nr01)** - *Ferramenta de mapeamento automático*`;
            } else {
                interlinks = `\n\n## 📚 Veja Também\n\n- **[Guia NR-01](/nr01)** - *Conformidade legal*\n- **[Blog HumaniQ](/blog)** - *Artigos sobre SST e RH*`;
            }

            // 2. Define E-E-A-T Author Box
            const authorBox = `\n\n---\n\n## 👤 Sobre o Autor\n\n**Dr. Carlos Mendes, TST**  \n*Diretor de Saúde Ocupacional na HumaniQ AI*\n\nEspecialista em Segurança e Saúde do Trabalho com 15 anos de experiência. Formado em Engenharia de Segurança do Trabalho pela USP, MBA em Gestão de Riscos. Técnico em Segurança do Trabalho (TST) certificado e membro da CIPA. Autor de mais de 80 artigos sobre SST e NR-01.\n\n**✓ TST Certificado** | **✓ MBA Gestão de Riscos** | **✓ 15 anos de experiência**\n\n[Perfil Completo](/sobre#carlos-mendes)`;

            // 0. Define Mid-Text Link
            let midTextLink = "";
            if (route === 'blog') {
                midTextLink = `\n\n> 💡 **Você sabia?** A conformidade com a **[NR-01](/nr01)** é o primeiro passo para evitar passivos trabalhistas. **[Saiba mais sobre adequação](/nr01)**.\n\n`;
            } else if (route === 'nr01') {
                midTextLink = `\n\n> 🚀 **Dica de Ouro**: A gestão manual de riscos consome 20h/semana. O **[Software HumaniQ](/software-nr01)** automatiza tudo isso. **[Conheça a solução](/software-nr01)**.\n\n`;
            } else if (route === 'riscos-psicossociais') {
                midTextLink = `\n\n> 🧠 **Importante**: Mapear riscos é obrigatório pela NR-01. Veja nosso **[Guia de Implementação](/nr01)** para não errar. \n\n`;
            } else {
                midTextLink = `\n\n> 💡 **Dica**: Confira nosso **[Blog](/blog)** para mais estratégias de gestão de SST.\n\n`;
            }

            // Inject Mid-Text Link
            const paragraphs = template.content.split('\n\n');
            const middleIndex = Math.floor(paragraphs.length / 2);
            if (middleIndex > 0) {
                paragraphs.splice(middleIndex, 0, midTextLink);
            }
            const contentWithMidLink = paragraphs.join('\n\n');

            // 3. Append to Content
            const enhancedContent = contentWithMidLink + interlinks + authorBox;
            // ==================================================================================

            // Generate unique slug
            const { data: slugData, error: slugError } = await supabase
                .rpc('generate_slug', {
                    p_title: template.title,
                    p_route: route
                });

            if (slugError) throw slugError;

            let slug = slugData || `${route}-${Date.now()}`;

            // SECURITY: Ensure slug is unique if we are recycling content (title already exists)
            // Even if rpc generate_slug is smart, let's be 100% sure to avoid unique constraint error
            if (existingTitles.includes(template.title)) {
                const randomSuffix = Math.floor(Math.random() * 10000);
                slug = `${slug}-${randomSuffix}`;
            }

            // Get schedule info for priority
            const { data: scheduleData } = await supabase
                .from("website_content_schedule")
                .select("priority")
                .eq("route", route)
                .single();

            const priority = scheduleData?.priority || "medium";

            // Insert into database
            const { data: newPost, error: insertError } = await supabase
                .from("website_content_posts")
                .insert({
                    route,
                    slug,
                    title: template.title,
                    content: enhancedContent, // Use enhanced content with SEO elements
                    excerpt: template.excerpt,
                    meta_title: template.meta_title,
                    meta_description: template.meta_description,
                    keywords: template.keywords,
                    status: auto_mode ? "scheduled" : "draft",
                    priority,
                    scheduled_for: auto_mode ? new Date().toISOString() : null
                })
                .select()
                .single();

            if (insertError) throw insertError;

            // Add image from same pool as LinkedIn posts
            const promoImages = [
                "https://raw.githubusercontent.com/Luiz1976/humaniq-assets/main/ARTE%2001-1.png",
                "https://raw.githubusercontent.com/Luiz1976/humaniq-assets/main/ARTE%2002-1.png",
                "https://raw.githubusercontent.com/Luiz1976/humaniq-assets/main/ARTE%2003-1.png"
            ];
            const imageIndex = Math.floor(Math.random() * 3);
            const imageUrl = promoImages[imageIndex];

            // Update post with image URL
            await supabase
                .from("website_content_posts")
                .update({ image_url: imageUrl })
                .eq("id", newPost.id);

            console.log(`✅ Image assigned: ARTE ${imageIndex + 1}`);

            generatedPosts.push({ ...newPost, image_url: imageUrl });
            existingTitles.push(template.title);

            // Log activity
            await supabase.from("website_content_activity_logs").insert({
                log_type: "success",
                action: "generate_content",
                route,
                post_id: newPost.id,
                message: `Content generated: "${template.title}"`,
                details: {
                    method: "template",
                    auto_mode,
                    word_count: template.content.split(/\s+/).length
                }
            });

            console.log(`✅ Created post: ${template.title} (${newPost.id})`);
        }

        return new Response(JSON.stringify({
            success: true,
            posts: generatedPosts,
            count: generatedPosts.length,
            method: "template-based"
        }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Handler Error:", error);

        const errorMessage = error instanceof Error ? error.message : String(error);
        const stackTrace = error instanceof Error && error.stack ? String(error.stack) : undefined;

        return new Response(JSON.stringify({
            success: false,
            error: errorMessage,
            details: stackTrace
        }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
