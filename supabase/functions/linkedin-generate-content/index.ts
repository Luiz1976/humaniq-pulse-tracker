
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// LinkedIn Post Templates - Professional B2B Content
const LINKEDIN_TEMPLATES = [
  {
    title: "Implementação da NR01: Por Onde Começar?",
    content: `🎯 A NR01 trouxe uma mudança fundamental para a segurança do trabalho no Brasil.

Mas por onde começar a implementação dos riscos psicossociais na sua empresa?

📋 Passos essenciais:

1️⃣ Mapeamento inicial - Identifique os fatores de risco
2️⃣ Avaliação de impacto - Mensure a exposição dos colaboradores  
3️⃣ Plano de ação - Defina medidas preventivas
4️⃣ Monitoramento contínuo - Acompanhe a evolução

💡 A HumaniQ AI oferece uma plataforma completa para automatizar todo esse processo, desde o mapeamento até o acompanhamento contínuo.

👉 Conheça nossa solução: www.humaniqai.com.br

#NR01 #RiscosPsicossociais #SegurançaDoTrabalho #SST #HumaniQAI`
  },
  {
    title: "Os 5 Principais Riscos Psicossociais no Ambiente de Trabalho",
    content: `⚠️ Você conhece os principais riscos psicossociais que afetam sua equipe?

A NR01 exige que as empresas identifiquem e gerenciem esses fatores:

🔴 Sobrecarga de trabalho
📉 Falta de autonomia
😰 Assédio moral e pressão excessiva
⏰ Jornadas extenuantes
🤝 Falta de suporte social

Consequências ignoradas:
• Aumento do absenteísmo
• Queda na produtividade
• Turnover elevado  
• Passivos trabalhistas

✅ A HumaniQ AI ajuda sua empresa a mapear, avaliar e controlar esses riscos de forma automatizada e contínua.

Proteja seus colaboradores e sua empresa.

www.humaniqai.com.br

#SaúdeMental #NR01 #GestãoDePessoas #RH #BemEstarCorporativo`
  },
  {
    title: "Transformação Digital na Gestão de SST",
    content: `🚀 A segurança do trabalho está passando por uma revolução digital.

Você ainda gerencia riscos psicossociais com planilhas e formulários manuais?

📊 A tecnologia permite:

✓ Mapeamento automatizado de riscos
✓ Análise de dados em tempo real
✓ Dashboards intuitivos para tomada de decisão
✓ Alertas preditivos de situações de risco
✓ Conformidade garantida com a NR01

O futuro da SST é data-driven e preventivo.

A HumaniQ AI une inteligência artificial e expertise em saúde ocupacional para revolucionar sua gestão de riscos psicossociais.

Agende uma demo: www.humaniqai.com.br

#TransformaçãoDigital #SST #Inovação #TechRH #NR01`
  },
  {
    title: "Case de Sucesso: Redução de 40% no Absenteísmo",
    content: `📈 Resultados reais de empresas que investiram na gestão de riscos psicossociais:

Uma empresa do setor de serviços implementou nossa solução e em 6 meses:

✅ 40% de redução no absenteísmo
✅ 35% de aumento na satisfação dos colaboradores
✅ 28% de melhora nos indicadores de clima organizacional
✅ 100% de conformidade com a NR01

Como conseguiram?

1. Mapeamento completo dos fatores de risco
2. Planos de ação personalizados por área
3. Monitoramento contínuo e preventivo
4. Engajamento da liderança

Quer alcançar resultados semelhantes?

A HumaniQ AI pode ajudar sua empresa nessa transformação.

👉 www.humaniqai.com.br

#CaseDeSucesso #RH #GestãoDePessoas #Resultados #NR01`
  },
  {
    title: "Compliance com NR01: Evite Multas e Passivos",
    content: `⚖️ Sua empresa está em conformidade com a NR01?

Desde 2022, a avaliação de riscos psicossociais é OBRIGATÓRIA.

Não cumprir pode resultar em:
• Multas de até R$ 50 mil
• Interdições e embargos
• Ações trabalhistas
• Danos à reputação

⚠️ Muitas empresas ainda não sabem como fazer essa avaliação corretamente.

A boa notícia? É mais simples do que parece.

Com a plataforma certa, você:
✓ Automatiza todo o processo
✓ Garante conformidade total
✓ Protege seus colaboradores
✓ Evita passivos trabalhistas

A HumaniQ AI oferece uma solução completa e eficiente.

Não deixe para depois. A fiscalização está aumentando.

www.humaniqai.com.br

#Compliance #NR01 #Legislação #SST #RH`
  },
  {
    title: "O Que a Liderança Precisa Saber Sobre Riscos Psicossociais",
    content: `👔 Mensagem para gestores e líderes:

Os riscos psicossociais não são apenas uma questão de RH ou SST.
São um desafio estratégico de negócio.

Por quê?

📊 Impactam diretamente:
• Produtividade da equipe
• Qualidade das entregas
• Retenção de talentos
• Clima organizacional
• Resultados financeiros

Como líder, você precisa:

1️⃣ Compreender os fatores de risco na sua área
2️⃣ Identificar sinais de alerta precocemente
3️⃣ Criar um ambiente saudável e produtivo
4️⃣ Dar o exemplo em práticas de bem-estar

A HumaniQ AI fornece as ferramentas e insights que você precisa para liderar com dados e empatia.

Seja um líder transformador.

www.humaniqai.com.br

#Liderança #GestãoDePessoas #BemEstar #NR01 #RH`
  },
  {
    title: "Mapeamento de Riscos: Por Que É Tão Importante?",
    content: `🗺️ Você não consegue gerenciar o que não consegue medir.

Essa máxima é especialmente verdadeira para riscos psicossociais.

O mapeamento permite:

🔍 Identificar problemas antes que se tornem crises
📈 Priorizar ações com base em dados
💰 Otimizar investimentos em bem-estar
⚖️ Demonstrar conformidade legal
👥 Proteger a saúde dos colaboradores

Sem mapeamento, você está:
❌ Agindo no escuro
❌ Desperdiçando recursos
❌ Assumindo riscos desnecessários
❌ Expondo a empresa a passivos

A HumaniQ AI torna o mapeamento simples, rápido e eficaz.

Tecnologia + expertise = resultados concretos.

Faça um teste gratuito: www.humaniqai.com.br

#Mapeamento #Gestão #NR01 #SST #RH`
  },
  {
    title: "Saúde Mental no Trabalho: Um Tema Estratégico",
    content: `🧠 Saúde mental deixou de ser tabu e virou prioridade estratégica.

Dados alarmantes:
• 1 em cada 5 trabalhadores sofre de ansiedade ou depressão
• Burnout cresceu 48% nos últimos 2 anos
• Custo anual com afastamentos: bilhões de reais

As empresas líderes já entenderam:
Investir em saúde mental é investir em:
✓ Produtividade
✓ Engajamento
✓ Retenção
✓ Inovação
✓ Sustentabilidade do negócio

E você? Já mapeou os riscos psicossociais na sua organização?

A NR01 exige. A saúde dos colaboradores merece. O negócio precisa.

A HumaniQ AI tem a solução que você procura.

👉 www.humaniqai.com.br

#SaúdeMental #Burnout #NR01 #RH #BemEstar`
  },
  {
    title: "Indicadores de Clima: O Termômetro da Organização",
    content: `🌡️ Como está o clima na sua empresa?

Criar indicadores de clima organizacional é essencial para:

📊 Monitorar a saúde do ambiente de trabalho
🚨 Detectar problemas antes que escalem
📈 Acompanhar evolução de ações implementadas
💼 Tomar decisões baseadas em dados

Principais indicadores:
• Taxa de absenteísmo
• Índice de turnover
• Pesquisas de satisfação (eNPS)
• Avaliação de riscos psicossociais
• Produtividade por equipe

Com a HumaniQ AI, você tem dashboards completos e atualizados em tempo real.

Transforme dados em insights. Insights em ações. Ações em resultados.

Conheça: www.humaniqai.com.br

#Indicadores #ClimaCorporativo #Gestão #NR01 #DataDriven`
  },
  {
    title: "Prevenção vs Remediação: Onde Investir?",
    content: `💡 Uma pergunta crucial para gestores:

Vale mais a pena prevenir ou remediar problemas de saúde ocupacional?

A resposta é clara: PREVENIR.

Comparação de custos:

🔴 Remediação:
• Afastamentos médicos
• Processos trabalhistas
• Perda de produtividade
• Danos à reputação
• Custo: até 10x mais caro

🟢 Prevenção:
• Mapeamento de riscos
• Ações antecipatórias
• Engajamento proativo
• Compliance garantido
• ROI positivo em meses

A escolha é óbvia. Mas muitas empresas ainda reagem ao invés de prevenir.

A HumaniQ AI te ajuda a mudar essa realidade com tecnologia e inteligência.

Seja preventivo. Seja estratégico.

www.humaniqai.com.br

#Prevenção #SST #NR01 #Gestão #ROI`
  },
  {
    title: "Engajamento: A Chave Para Programas de Sucesso",
    content: `🎯 98% dos programas de bem-estar corporativo falham.

Por quê? Falta de engajamento.

Não basta ter ferramentas. É preciso que as pessoas usem.

Como engajar colaboradores:

1️⃣ Comunicação clara sobre benefícios
2️⃣ Processos simples e acessíveis
3️⃣ Tecnologia intuitiva (mobile-first)
4️⃣ Feedback contínuo e visível
5️⃣ Liderança dando o exemplo

A HumaniQ AI foi desenvolvida pensando em UX:
✓ Interface amigável
✓ Acesso mobile
✓ Notificações inteligentes
✓ Gamificação
✓ Resultados visíveis

Transforme dados em engajamento real.

👉 www.humaniqai.com.br

#Engajamento #BemEstar #RH #UX #NR01`
  },
  {
    title: "Tendências em SST Para 2026",
    content: `🔮 O futuro da segurança do trabalho já começou.

Principais tendências para 2026:

🤖 IA e Machine Learning
Previsão de riscos antes que aconteçam

📱 Monitoramento Mobile
Dados em tempo real, onde quer que esteja

🧠 Foco em Saúde Mental
Riscos psicossociais no centro da estratégia

📊 Analytics Avançado
Dashboards preditivos e prescritivos

🌐 Trabalho Híbrido
Novos desafios, novas soluções

⚖️ Compliance Automatizado
Menos burocracia, mais eficiência

Sua empresa está preparada?

A HumaniQ AI já incorpora todas essas tendências em uma única plataforma.

Seja pioneiro, não reativo.

www.humaniqai.com.br

#Tendências #Inovação #SST #Futuro #NR01`
  },
  {
    title: "ROI em Programas de Bem-Estar: É Possível Medir?",
    content: `💰 "Quanto custa?" vs "Qual o retorno?"

Investir em gestão de riscos psicossociais tem ROI mensurável:

📈 Retornos típicos:
• 3:1 até 6:1 em redução de custos
• -30% absenteísmo
• -25% turnover
• +20% produtividade
• +35% satisfação

Mas como medir?

KPIs essenciais:
✓ Taxa de absenteísmo (antes/depois)
✓ Custo de substituição de funcionários
✓ Produtividade por equipe
✓ Redução de processos trabalhistas
✓ Melhora no eNPS

A HumaniQ AI fornece relatórios automáticos de ROI, facilitando a justificativa de investimentos.

Gestão baseada em dados. Decisões baseadas em resultados.

👉 www.humaniqai.com.br

#ROI #Resultados #Gestão #NR01 #BemEstar`
  },
  {
    title: "NR01: O Que Mudou e O Que Você Precisa Fazer",
    content: `📋 Atualização importante sobre a NR01:

O que mudou desde 2022?

🆕 Novo requisito: Gestão de riscos psicossociais
📊 Obrigatórias: Avaliações periódicas
📝 Documentação: PGR deve incluir fatores psicossociais
⚖️ Fiscalização: Está mais rigorosa

O que sua empresa DEVE fazer:

1️⃣ Mapear riscos psicossociais
2️⃣ Avaliar níveis de exposição
3️⃣ Implementar medidas de controle
4️⃣ Monitorar resultados
5️⃣ Documentar tudo

Prazo? AGORA. A conformidade é retroativa.

Não sabe por onde começar?

A HumaniQ AI simplifica todo o processo:
• Mapeamento automatizado
• Relatórios em conformidade
• Monitoramento contínuo
• Suporte especializado

Evite problemas. Proteja sua empresa.

www.humaniqai.com.br

#NR01 #Compliance #Legislação #SST #Segurança`
  },
  {
    title: "Teste Gratuito: Conheça a Plataforma HumaniQ AI",
    content: `🎁 Que tal conhecer uma solução completa para gestão de riscos psicossociais?

A HumaniQ AI oferece teste gratuito da plataforma!

O que você vai testar:

✅ Mapeamento automatizado de riscos
✅ Dashboards em tempo real
✅ Relatórios de conformidade NR01
✅ Planos de ação personalizados
✅ Análises preditivas

Perfeito para:
• Gestores de RH
• Profissionais de SST
• Líderes de equipe
• Executivos C-level

Sem compromisso. Sem cartão de crédito. Apenas 7 dias para conhecer a solução que está transformando a gestão de saúde ocupacional no Brasil.

👉 Solicite seu acesso: www.humaniqai.com.br

Experimente antes de decidir.

#TesteGrátis #Demo #NR01 #SST #RH`
  }
];

serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health Check (GET)
  if (req.method === "GET") {
    return new Response(JSON.stringify({
      status: "online",
      mode: "template-based",
      templates_count: LINKEDIN_TEMPLATES.length,
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

    console.log(`✅ Using template-based generation (${LINKEDIN_TEMPLATES.length} templates available)`);

    const reqBody = await req.json().catch(err => {
      throw new Error(`Failed to parse request body JSON: ${err.message}`);
    });

    const { account_id, count = 1 } = reqBody;

    if (!account_id) {
      throw new Error("account_id is required in body");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get existing posts to avoid duplicates
    const { data: existingPosts } = await supabase
      .from("linkedin_posts")
      .select("title")
      .eq("account_id", account_id);

    const existingTitles = existingPosts?.map(p => p.title) || [];

    const generatedPosts = [];

    // Filter out already used templates to ensure unique posts
    let availableTemplates = LINKEDIN_TEMPLATES.filter(
      template => !existingTitles.includes(template.title)
    );

    // If all templates are used, recycle them to remove limitations
    if (availableTemplates.length === 0) {
      console.log("All templates used. Recycling templates to continue generating content.");
      availableTemplates = [...LINKEDIN_TEMPLATES];
    }

    for (let i = 0; i < count; i++) {
      if (availableTemplates.length === 0) {
        // Refill templates if we run out during a batch generation
        availableTemplates = [...LINKEDIN_TEMPLATES];
      }

      // Select random template from available ones
      const randomIndex = Math.floor(Math.random() * availableTemplates.length);
      const template = availableTemplates[randomIndex];

      // Remove selected template to prevent duplicates
      availableTemplates.splice(randomIndex, 1);

      const imageIndex = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3

      console.log(`📝 Generating post ${i + 1}/${count} - Template: "${template.title}"`);

      // Save to database
      const { data: newPost, error } = await supabase
        .from("linkedin_posts")
        .insert({
          account_id,
          title: template.title,
          content: template.content,
          image_index: imageIndex,
          status: "ready",
        })
        .select()
        .single();

      if (error) throw error;

      generatedPosts.push(newPost);
      existingTitles.push(template.title);

      await supabase.from("linkedin_activity_logs").insert({
        account_id,
        log_type: "success",
        action: "generate",
        message: `Post gerado: "${template.title}"`,
        details: { post_id: newPost.id, method: "template" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      posts: generatedPosts,
      count: generatedPosts.length,
      method: "template-based",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Handler Error:", error);

    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null) {
      errorMessage = JSON.stringify(error);
    } else {
      errorMessage = String(error);
    }

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
