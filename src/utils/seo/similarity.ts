/**
 * Calcula similaridade entre dois textos usando TF-IDF simplificado
 */

interface TFIDFVector {
    [word: string]: number;
}

/**
 * Remove stop words e normaliza texto
 */
function preprocessText(text: string): string[] {
    const stopWords = new Set([
        'a', 'o', 'de', 'da', 'do', 'e', 'em', 'para', 'com', 'por',
        'um', 'uma', 'os', 'as', 'dos', 'das', 'ao', 'à', 'no', 'na',
        'que', 'é', 'se', 'mais', 'como', 'ou', 'ser', 'também'
    ]);

    return text
        .toLowerCase()
        .replace(/[^\w\sáéíóúàèìòùâêîôûãõç]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word));
}

/**
 * Calcula frequência de termos (TF)
 */
function calculateTF(words: string[]): TFIDFVector {
    const tf: TFIDFVector = {};
    const total = words.length;

    for (const word of words) {
        tf[word] = (tf[word] || 0) + 1;
    }

    // Normalizar
    for (const word in tf) {
        tf[word] = tf[word] / total;
    }

    return tf;
}

/**
 * Calcula similaridade de cosseno entre dois vetores
 */
function cosineSimilarity(vec1: TFIDFVector, vec2: TFIDFVector): number {
    const words = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (const word of words) {
        const val1 = vec1[word] || 0;
        const val2 = vec2[word] || 0;

        dotProduct += val1 * val2;
        magnitude1 += val1 * val1;
        magnitude2 += val2 * val2;
    }

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

export interface Post {
    id: string;
    title: string;
    content: string;
    slug?: string;
    description?: string;
}

/**
 * Calcula similaridade entre dois posts
 */
export function calculateSimilarity(post1: Post, post2: Post): number {
    // Combinar título e conteúdo (título tem peso maior)
    const text1 = `${post1.title} ${post1.title} ${post1.title} ${post1.content}`;
    const text2 = `${post2.title} ${post2.title} ${post2.title} ${post2.content}`;

    const words1 = preprocessText(text1);
    const words2 = preprocessText(text2);

    const tf1 = calculateTF(words1);
    const tf2 = calculateTF(words2);

    return cosineSimilarity(tf1, tf2);
}

/**
 * Encontra os N posts mais similares
 */
export function findRelatedPosts(
    targetPost: Post,
    allPosts: Post[],
    limit: number = 3
): Array<Post & { similarity: number }> {
    const similarities = allPosts
        .filter(post => post.id !== targetPost.id)
        .map(post => ({
            ...post,
            similarity: calculateSimilarity(targetPost, post)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

    return similarities;
}

/**
 * Cache de posts relacionados para performance
 */
const relatedPostsCache = new Map<string, Array<Post & { similarity: number }>>();

export function findRelatedPostsCached(
    targetPost: Post,
    allPosts: Post[],
    limit: number = 3
): Array<Post & { similarity: number }> {
    const cacheKey = `${targetPost.id}-${limit}`;

    if (relatedPostsCache.has(cacheKey)) {
        return relatedPostsCache.get(cacheKey)!;
    }

    const related = findRelatedPosts(targetPost, allPosts, limit);
    relatedPostsCache.set(cacheKey, related);

    return related;
}

export function clearRelatedPostsCache() {
    relatedPostsCache.clear();
}
