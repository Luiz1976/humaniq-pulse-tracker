import { supabase } from '@/integrations/supabase/client';

interface SitemapURL {
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
}

/**
 * Gera URLs estáticas do sitemap
 */
function getStaticURLs(): SitemapURL[] {
    const baseUrl = 'https://humaniqai.com.br';

    return [
        {
            loc: baseUrl,
            changefreq: 'daily',
            priority: 1.0
        },
        {
            loc: `${baseUrl}/nr01`,
            changefreq: 'monthly',
            priority: 1.0
        },
        {
            loc: `${baseUrl}/riscos-psicossociais`,
            changefreq: 'monthly',
            priority: 0.9
        },
        {
            loc: `${baseUrl}/software-nr01`,
            changefreq: 'monthly',
            priority: 0.9
        },
        {
            loc: `${baseUrl}/faq`,
            changefreq: 'weekly',
            priority: 0.8
        },
        {
            loc: `${baseUrl}/blog`,
            changefreq: 'daily',
            priority: 0.8
        }
    ];
}

/**
 * Busca posts do blog publicados
 */
async function getBlogPosts(): Promise<SitemapURL[]> {
    const baseUrl = 'https://humaniqai.com.br';

    const { data: posts } = await supabase
        .from('website_content' as any)
        .select('slug, updated_at, created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false }) as any;

    if (!posts) return [];

    return posts.map((post: any) => ({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.updated_at || post.created_at,
        changefreq: 'monthly' as const,
        priority: 0.7
    }));
}

/**
 * Gera sitemap XML completo
 */
export async function generateSitemap(): Promise<string> {
    const staticURLs = getStaticURLs();
    const blogPosts = await getBlogPosts();
    const allURLs = [...staticURLs, ...blogPosts];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allURLs.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${new Date(url.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

    return xml;
}

/**
 * Hook para downloadar sitemap (desenvolvimento)
 */
export function useSitemapGenerator() {
    const downloadSitemap = async () => {
        const xml = await generateSitemap();
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        a.click();
        URL.revokeObjectURL(url);
    };

    return { downloadSitemap };
}
