-- Criar tabela website_content para blog posts
CREATE TABLE IF NOT EXISTS website_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  meta_title TEXT,
  meta_description TEXT,
  image_url TEXT,
  route TEXT DEFAULT 'blog',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID,
  views_count INTEGER DEFAULT 0
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_website_content_status ON website_content(status);
CREATE INDEX IF NOT EXISTS idx_website_content_slug ON website_content(slug);
CREATE INDEX IF NOT EXISTS idx_website_content_created_at ON website_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_content_route ON website_content(route);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_website_content_updated_at
    BEFORE UPDATE ON website_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir posts de exemplo sobre NR-01, SST e IA
INSERT INTO website_content (title, slug, content, summary, route, status, meta_title, meta_description, image_url) VALUES
(
  'Como adequar sua empresa à NR-01 em 2026',
  'adequar-empresa-nr01-2026',
  E'# Como adequar sua empresa à NR-01 em 2026\n\nA [NR-01](/nr01) estabelece diretrizes fundamentais para a gestão de riscos psicossociais no ambiente de trabalho. Empresas que não se adequarem até 2026 podem enfrentar multas significativas.\n\n## O que mudou na NR-01?\n\nA atualização da norma exige que todas as empresas:\n\n- Identifiquem e avaliem riscos psicossociais\n- Implementem medidas preventivas\n- Documentem todas as ações no PGR\n- Treinem gestores e colaboradores\n\n## Gestão de [riscos psicossociais](/riscos-psicossociais)\n\nPara gerenciar adequadamente os riscos, é essencial:\n\n1. Realizar mapeamento inicial\n2. Aplicar questionários de avaliação\n3. Analisar dados coletados\n4. Implementar plano de ação\n\nEmpresas que utilizam [software especializado para SST](/software-nr01) conseguem reduzir em até 80% o tempo de adequação.\n\n## Prazos e Penalidades\n\nO não cumprimento pode resultar em:\n- Multas de até R$ 50 mil\n- Interdição de atividades\n- Processos trabalhistas\n\nPara mais informações, consulte nossa [seção de perguntas frequentes](/faq).\n\n## Próximos Passos\n\n1. Agende uma consultoria gratuita\n2. Realize o mapeamento de riscos\n3. Implemente o software de gestão\n\n**Comece agora e garanta a conformidade da sua empresa!**',
  'Guia completo com o passo a passo para garantir que sua empresa esteja 100% em conformidade com as novas exigências da NR-01 sobre riscos psicossociais.',
  'nr-01',
  'published',
  'Como adequar sua empresa à NR-01 em 2026 | HumaniQ AI',
  'Evite multas de até R$ 50 mil. Guia completo de adequação à NR-01: checklist, prazos, gestão de riscos psicossociais e cases práticos.',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
),
(
  'Sinais de Burnout na equipe: Como identificar?',
  'sinais-burnout-equipe-identificar',
  E'# Sinais de Burnout na equipe: Como identificar?\n\nAprenda a reconhecer os primeiros sinais de esgotamento profissional nos seus colaboradores e como intervir antes que se torne um problema grave.\n\n## O que é Burnout?\n\nO burnout é uma síndrome ocupacional reconhecida pela OMS, caracterizada por:\n- Exaustão emocional\n- Despersonalização\n- Baixa realização profissional\n\n## Sinais de Alerta\n\n### Comportamentais\n- Atrasos frequentes\n- Absenteísmo crescente\n- Irritabilidade e conflitos\n- Isolamento social\n\n### Performance\n- Queda na produtividade\n- Erros recorrentes\n- Dificuldade de concentração\n- Procrastinação\n\n### Físicos\n- Fadiga constante\n- Dores de cabeça\n- Problemas gastrointestinais\n- Insônia\n\n## Como Prevenir\n\nA prevenção de burnout está diretamente relacionada à gestão adequada de [riscos psicossociais](/riscos-psicossociais), conforme exigido pela [NR-01](/nr01).\n\n### Ações Práticas\n\n1. **Avaliação regular**: Use questionários validados\n2. **Cultura de feedback**: Canais abertos de comunicação\n3. **Limites saudáveis**: Respeito ao horário de trabalho\n4. **Apoio psicológico**: Disponibilize recursos\n\nEmpresas que implementam [sistemas de gestão de SST](/software-nr01) conseguem identificar padrões de risco com antecedência.\n\n## Intervenção Eficaz\n\nQuando identificar sinais:\n1. Converse individualmente\n2. Ofereça suporte\n3. Ajuste demandas temporariamente\n4. Encaminhe para profissional de saúde\n\n## Conclusão\n\nA identificação precoce é fundamental. Invista em ferramentas de monitoramento e cultive um ambiente de trabalho saudável.\n\n**Dúvidas?** Acesse nossa [página de FAQ](/faq).',
  'Aprenda a reconhecer os primeiros sinais de esgotamento profissional nos seus colaboradores e como intervir antes que se torne um problema grave.',
  'saude-mental',
  'published',
  'Sinais de Burnout na equipe: Como identificar? | HumaniQ AI',
  'Descubra os sinais de burnout em colaboradores, aprenda a identificar esgotamento profissional e implemente ações preventivas eficazes.',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800'
),
(
  'IA na Gestão de Pessoas: O futuro chegou',
  'ia-gestao-pessoas-futuro',
  E'# IA na Gestão de Pessoas: O futuro chegou\n\nComo a inteligência artificial está revolucionando a forma como o RH cuida do ativo mais precioso das empresas: as pessoas.\n\n## A Revolução da IA no RH\n\nA inteligência artificial não é mais ficção científica - ela já está transformando a gestão de pessoas.\n\n### Aplicações Práticas\n\n1. **Recrutamento e Seleção**\n   - Triagem automatizada de currículos\n   - Análise preditiva de fit cultural\n   - Entrevistas com chatbots\n\n2. **Desenvolvimento**\n   - Planos de carreira personalizados\n   - Recomendações de treinamento\n   - Mentoria virtual\n\n3. **Gestão de Performance**\n   - Feedback contínuo automatizado\n   - Identificação de padrões de desempenho\n   - Alertas de risco de turnover\n\n## IA e Saúde Mental\n\nUm dos usos mais promissores é na detecção precoce de [riscos psicossociais](/riscos-psicossociais).\n\n### Como Funciona\n\n- **Análise de sentimento**: Emails, chats, pesquisas\n- **Padrões comportamentais**: Horas trabalhadas, pausas\n- **Indicadores de estresse**: Métricas fisiológicas (se disponíveis)\n\nComplementa perfeitamente a gestão exigida pela [NR-01](/nr01).\n\n## Conformidade Legal\n\nO uso de IA deve respeitar:\n- LGPD (Lei Geral de Proteção de Dados)\n- Transparência nos algoritmos\n- Consentimento dos colaboradores\n- Auditoria regular de vieses\n\n## Software Inteligente para SST\n\nPlataformas modernas de [software para gestão de SST](/software-nr01) já incorporam IA para:\n- Automatizar relatórios\n- Prever riscos\n- Sugerir intervenções\n- Otimizar processos\n\n## O Futuro é Agora\n\n### Tendências para 2026\n\n- Assistentes virtuais 24/7\n- Wellness programs personalizados\n- Previsão de crises organizacionais\n- Integração com wearables\n\n## Implementação Responsável\n\nPara adotar IA com sucesso:\n\n1. **Comece pequeno**: Piloto em uma área\n2. **Treine a equipe**: Alfabetização digital\n3. **Seja transparente**: Comunique mudanças\n4. **Monitore resultados**: KPIs claros\n\n## Conclusão\n\nA IA é uma aliada poderosa, mas o toque humano continua essencial. O futuro da gestão de pessoas é uma parceria entre humanos e máquinas.\n\n**Quer saber mais?** Visite nossa [página de FAQ](/faq) ou agende uma demonstração.',
  'Como a inteligência artificial está revolucionando a forma como o RH cuida do ativo mais precioso das empresas: as pessoas.',
  'tecnologia',
  'published',
  'IA na Gestão de Pessoas: O futuro chegou | HumaniQ AI',
  'Descubra como a inteligência artificial está transformando o RH: recrutamento inteligente, gestão de performance e prevenção de burnout.',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
);

-- Verificar quantos posts foram inseridos
SELECT COUNT(*) as total_posts, status FROM website_content GROUP BY status;
