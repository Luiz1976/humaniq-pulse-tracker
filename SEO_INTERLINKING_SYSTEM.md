# 🔗 SISTEMA DE INTERLINKING AUTOMÁTICO

## Objetivo
Criar links internos estratégicos automaticamente em cada post gerado, seguindo hierarquia SEO e distribuindo PageRank de forma inteligente.

---

## 📐 ARQUITETURA DE LINKS

### Hierarquia de Autoridade
```
Homepage (Autoridade 100%)
    ↓ (passa 85%)
Páginas Pilares (/nr01, /riscos-psicossociais, /software-nr01, /faq)
    ↓ (passa 70%)
Blog Posts (long-tail, tráfego orgânico)
```

---

## 🎯 REGRAS DE INTERLINKING

### 1. Posts de Blog → Pilares (OBRIGATÓRIO)

**Regra**: Todo post do blog DEVE incluir:
- ✅ 1-2 links para páginas pilares relevantes
- ✅ Contextualizados naturalmente no texto
- ✅ Anchor text semântico (não "clique aqui")

**Implementação no Template**:

```markdown
## [Seção relevante do post]

[Conteúdo introdutório]

Para garantir conformidade legal e evitar penalidades, é fundamental 
entender os requisitos da [NR-01 sobre riscos psicossociais](/nr01). 
Empresas que implementam [ferramentas digitais especializadas](/software-nr01) 
reduzem em até 80% o tempo de adequação.

[Restante do conteúdo]
```

**Links Automáticos por Categoria de Post**:

| Tema do Post | Link Pilar 1 | Link Pilar 2 |
|--------------|--------------|--------------|
| Saúde mental, burnout, bem-estar | `/riscos-psicossociais` | `/nr01` |
| Compliance, legislação, NR-01 | `/nr01` | `/faq` |
| Software, ferramentas, automação | `/software-nr01` | `/nr01` |
| Implementação, cases, métodos | `/nr01` | `/riscos-psicossociais` |

---

### 2. Posts de Blog → Outros Posts (RECOMENDADO)

**Regra**: Incluir 1 link para post relacionado

**Seção padrão no final**:

```markdown
---

## 📚 Leia Também

**Relacionado**: [Título do post relacionado](/blog/slug-relacionado)  
*Breve descrição do que o leitor encontrará (1 linha)*

---
```

**Exemplo prático**:

```markdown
---

## 📚 Leia Também

**Relacionado**: [Como Prevenir Burnout na Sua Empresa: 7 Estratégias Práticas](/blog/prevenir-burnout-estrategias)  
*Descubra ações concretas para reduzir o estresse ocupacional e proteger a saúde mental da sua equipe.*

---
```

---

### 3. Páginas Pilares → Blog Posts (RICO EM LINKS)

**Regra**: Cada página pilar deve ter seção dedicada linkando para 5-10 posts do blog

**Template para Pilares**:

```markdown
---

## 📖 Recursos e Guias Complementares

Aprofunde seu conhecimento com nossos artigos especializados:

### Implementação Prática
- [Checklist Completo de Adequação à NR-01](/blog/checklist-nr01-adequacao)
- [Passo a Passo: Mapeamento de Riscos Psicossociais](/blog/mapeamento-riscos-passo-passo)
- [Como Criar um PGR em Conformidade](/blog/criar-pgr-conformidade)

### Cases e Resultados
- [Case: Redução de 40% no Absenteísmo com Gestão de Riscos](/blog/case-reducao-absenteismo)
- [Empresa do Setor X: ROI de 10:1 em Programa de SST](/blog/roi-programa-sst)

### Saúde Mental e Bem-Estar
- [Saúde Mental no RH: O Novo Desafio Estratégico](/blog/saude-mental-rh-desafio)
- [Burnout Ocupacional: Identificação e Prevenção](/blog/burnout-identificacao-prevencao)

### Ferramentas e Tecnologia
- [People Analytics para Gestão de Riscos](/blog/people-analytics-riscos)
- [Automação de Compliance: Vale a Pena?](/blog/automacao-compliance)

---
```

---

### 4. Pilares → Outros Pilares (CONTEXTUAL)

**Regra**: Linkar pilares relacionados em contexto natural

**Exemplo**:

```markdown
A implementação da NR-01 exige compreensão profunda dos 
[riscos psicossociais no ambiente de trabalho](/riscos-psicossociais), 
que podem ser gerenciados de forma eficiente com 
[software especializado](/software-nr01).

Para dúvidas específicas, consulte nossa [seção de perguntas frequentes](/faq).
```

---

## 🤖 AUTOMAÇÃO DE INTERLINKING

### Sistema de Detecção de Contexto

**Gatilhos para inserção automática de links**:

| Termo detectado no texto | Link automático sugerido |
|---------------------------|--------------------------|
| "nr-01", "nr 01", "norma regulamentadora 1" | `/nr01` |
| "riscos psicossociais", "fatores psicossociais" | `/riscos-psicossociais` |
| "software", "sistema", "plataforma", "ferramenta digital" | `/software-nr01` |
| "dúvidas", "perguntas", "como funciona" | `/faq` |
| "burnout", "estresse ocupacional", "saúde mental" | `/riscos-psicossociais` |
| "conformidade", "adequação", "legislação" | `/nr01` |

---

## 📝 IMPLEMENTAÇÃO NOS TEMPLATES

### Template Atualizado - Blog Posts

```markdown
# [Título do Post]

[Introdução - 2-3 parágrafos]

## [H2 Primeiro Tópico]

[Conteúdo]

### ✅ Vínculo com NR-01 (INTERLINKING ESTRATÉGICO)

Este tema está diretamente relacionado à [gestão de riscos psicossociais exigida pela NR-01](/nr01). 
Empresas que implementam [soluções tecnológicas especializadas](/software-nr01) conseguem 
automatizar grande parte do processo de conformidade.

## [H2 Segundo Tópico]

[Conteúdo]

## [H2 Terceiro Tópico]

[Conteúdo]

## Conclusão

[Resumo e CTA]

👉 **Próximo passo**: Conheça nossa [plataforma completa para gestão de SST](/software-nr01)  
📞 **Dúvidas?**: Veja nossa [seção de perguntas frequentes sobre NR-01](/faq)

---

## 📚 Leia Também

**Relacionado**: [Título Post Relacionado](/blog/slug)  
*Descrição breve e atrativa (1 linha)*

---

**Publicado em**: [Data]  
**Última atualização**: [Data]  
**Categoria**: [Categoria]  
**Tags**: #tag1 #tag2 #tag3

---

## Sobre o Autor

**Dr. [Nome]** - [Cargo/Especialização]  
*Especialista em Saúde Ocupacional e Gestão de Riscos Psicossociais. [Credenciais]*

[Mini bio 2-3 linhas + foto]

---
```

---

### Template Atualizado - Páginas Pilares

```markdown
# [Título da Página Pilar]

[Introdução forte - problema + solução]

## Navegação Rápida
- [Tópico 1](#topico-1)
- [Tópico 2](#topico-2)
- [Tópico 3](#topico-3)
- [FAQs](#faqs)
- [Recursos](#recursos)

---

## [H2 Conteúdo Principal]

[Conteúdo profundo 800-1200 palavras]

### Links Contextuais para Outros Pilares

Para uma compreensão completa, recomendamos também:
- [Riscos Psicossociais no Trabalho: Guia Completo](/riscos-psicossociais)
- [FAQ: Perguntas Frequentes sobre NR-01](/faq)

---

## 📖 Recursos e Guias Complementares

### Implementação Prática
- [Link post 1](/blog/slug-1)
- [Link post 2](/blog/slug-2)
- [Link post 3](/blog/slug-3)

### Cases e Resultados
- [Link post 4](/blog/slug-4)
- [Link post 5](/blog/slug-5)

### Ferramentas
- [Link post 6](/blog/slug-6)
- [Nossa plataforma completa](/software-nr01)

---

## ❓ Perguntas Frequentes

[FAQs com Schema]

---

## 💡 Próximos Passos

1. [CTA primário]
2. [CTA secundário]
3. [Link para software/contato]

---
```

---

## 🎨 ANCHOR TEXT - Boas Práticas

### ✅ Fazer

**Anchor text descritivo e semântico**:
- "gestão de riscos psicossociais conforme NR-01"
- "software especializado para conformidade SST"
- "metodologias de mapeamento de riscos"
- "guia completo de implementação da NR-01"

### ❌ Evitar

**Anchor text genérico**:
- "clique aqui"
- "saiba mais"
- "veja mais"
- "leia este artigo"

### 🎯 Regra de Ouro

**Variação natural**: Nunca use o mesmo anchor text para o mesmo link

**Exemplo**:
- 1ª menção: [conformidade com a NR-01](/nr01)
- 2ª menção: [requisitos da Norma Regulamentadora 1](/nr01)
- 3ª menção: [adequação à legislação de SST](/nr01)

---

## 📊 MÉTRICAS DE SUCESSO

### KPIs de Interlinking

| Métrica | Meta | Verificação |
|---------|------|-------------|
| Links internos por post | 3-5 | Mensal |
| Posts linkando para pilares | 100% | Semanal |
| Pilares com seção "Recursos" | 100% | Uma vez |
| Anchor text descritivo | >90% | Mensal |
| Links quebrados | 0% | Semanal |

### Ferramentas de Monitoramento

1. **Google Search Console**
   - Internal Links Report
   - Verificar quais páginas recebem mais links

2. **Screaming Frog SEO Spider**
   - Crawl do site
   - Identificar links quebrados
   - Mapear estrutura de links

3. **Manual Mensal**
   - Revisar 5 posts aleatórios
   - Verificar relevância dos links
   - Testar se links funcionam

---

## 🔄 PROCESSO DE ATUALIZAÇÃO

### Quando Publicar Novo Post

1. ✅ Incluir links para pilares (automático via template)
2. ✅ Escolher 1 post relacionado para linkar
3. ✅ Atualizar 1-2 posts antigos para linkar de volta

### Quando Publicar Novo Pilar

1. ✅ Criar seção "Recursos" com 5-10 links
2. ✅ Atualizar outros pilares para linkar
3. ✅ Identificar 5-10 posts existentes para linkar de volta

### Manutenção Trimestral

1. Revisar links em páginas pilares
2. Adicionar novos posts relevantes
3. Remover links para conteúdo desatualizado
4. Verificar métricas de PageRank interno

---

**Próximo**: Template de Author Box + E-E-A-T
