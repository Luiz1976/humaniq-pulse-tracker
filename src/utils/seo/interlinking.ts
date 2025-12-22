/**
 * Mapeamento de keywords para URLs e variações de anchor text
 */
interface KeywordMapping {
    url: string;
    anchors: string[];
    keywords: string[];
}

const KEYWORD_MAP: Record<string, KeywordMapping> = {
    'nr01': {
        url: '/nr01',
        keywords: ['nr-01', 'nr 01', 'norma regulamentadora 1', 'norma regulamentadora um'],
        anchors: [
            'NR-01',
            'conformidade com a NR-01',
            'adequação à NR-01',
            'requisitos da NR-01',
            'gestão de riscos conforme NR-01'
        ]
    },
    'riscos-psicossociais': {
        url: '/riscos-psicossociais',
        keywords: ['riscos psicossociais', 'fatores psicossociais', 'saúde mental trabalho', 'burnout ocupacional'],
        anchors: [
            'riscos psicossociais',
            'gestão de riscos psicossociais',
            'fatores de risco psicossocial',
            'prevenção de riscos psicossociais',
            'mapeamento de riscos psicossociais'
        ]
    },
    'software-nr01': {
        url: '/software-nr01',
        keywords: ['software nr-01', 'software sst', 'plataforma sst', 'sistema segurança trabalho', 'ferramenta digital'],
        anchors: [
            'software especializado para NR-01',
            'plataforma de SST',
            'sistema de gestão de segurança',
            'ferramentas digitais para SST',
            'software de compliance trabalhista'
        ]
    },
    'faq': {
        url: '/faq',
        keywords: ['dúvidas', 'perguntas frequentes', 'como funciona', 'faq'],
        anchors: [
            'perguntas frequentes',
            'dúvidas sobre NR-01',
            'FAQ',
            'seção de perguntas'
        ]
    }
};

/**
 * Detecta keywords no texto e retorna matches
 */
export function detectKeywords(text: string): Array<{ key: string; keyword: string; position: number }> {
    const textLower = text.toLowerCase();
    const matches: Array<{ key: string; keyword: string; position: number }> = [];

    for (const [key, mapping] of Object.entries(KEYWORD_MAP)) {
        for (const keyword of mapping.keywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            let match;

            while ((match = regex.exec(textLower)) !== null) {
                matches.push({
                    key,
                    keyword: text.substring(match.index, match.index + keyword.length),
                    position: match.index
                });
            }
        }
    }

    return matches.sort((a, b) => a.position - b.position);
}

/**
 * Seleciona anchor text variado para uma URL
 */
let anchorUsage: Record<string, number> = {};

export function getAnchorText(key: string): string {
    const mapping = KEYWORD_MAP[key];
    if (!mapping) return key;

    // Rotacionar anchor text para evitar repetição
    const usageCount = anchorUsage[key] || 0;
    const anchor = mapping.anchors[usageCount % mapping.anchors.length];

    anchorUsage[key] = usageCount + 1;

    return anchor;
}

export function resetAnchorUsage() {
    anchorUsage = {};
}

/**
 * Insere links automaticamente no conteúdo markdown
 * Limita a 1 link por keyword para evitar over-optimization
 */
export function insertLinks(content: string, maxLinksPerKeyword: number = 1): string {
    const matches = detectKeywords(content);
    const linkCounts: Record<string, number> = {};
    let result = content;
    let offset = 0;

    // Resetar uso de anchors para este conteúdo
    resetAnchorUsage();

    for (const match of matches) {
        // Limitar número de links por keyword
        const count = linkCounts[match.key] || 0;
        if (count >= maxLinksPerKeyword) continue;

        const mapping = KEYWORD_MAP[match.key];
        const anchorText = getAnchorText(match.key);

        // Verificar se já não está em um link
        const beforeText = result.substring(0, match.position + offset);
        const isAlreadyLinked = /\[([^\]]*)\]\([^)]*\)\s*$/.test(beforeText);

        if (isAlreadyLinked) continue;

        // Criar link markdown
        const originalText = match.keyword;
        const linkedText = `[${anchorText}](${mapping.url})`;

        // Inserir link
        const pos = match.position + offset;
        result = result.substring(0, pos) + linkedText + result.substring(pos + originalText.length);

        // Ajustar offset para próximas inserções
        offset += linkedText.length - originalText.length;

        linkCounts[match.key] = count + 1;
    }

    return result;
}

/**
 * Sugere links para incluir baseado no conteúdo
 */
export function suggestLinks(text: string): Array<{ url: string; anchor: string; keyword: string }> {
    const matches = detectKeywords(text);
    const suggestions: Array<{ url: string; anchor: string; keyword: string }> = [];
    const seen = new Set<string>();

    for (const match of matches) {
        if (seen.has(match.key)) continue;

        const mapping = KEYWORD_MAP[match.key];
        suggestions.push({
            url: mapping.url,
            anchor: getAnchorText(match.key),
            keyword: match.keyword
        });

        seen.add(match.key);
    }

    return suggestions;
}

/**
 * Adiciona seção "Leia Também" com link para post relacionado
 */
export function addRelatedPostSection(relatedPost: { title: string; slug: string; description: string }): string {
    return `
---

## 📚 Leia Também

**Relacionado**: [${relatedPost.title}](/blog/${relatedPost.slug})  
*${relatedPost.description}*

---
`;
}
