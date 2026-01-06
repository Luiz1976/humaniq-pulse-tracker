
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: '../.env' });

const BASE_URL = 'https://human-iq-pulse.lovable.app'; // URL pública do app (deve ser atualizada pelo usuário)

// Static Routes from App.tsx
const STATIC_ROUTES = [
    '/',
    '/blog',
    '/sobre',
    '/nr01',
    '/riscos-psicossociais',
    '/software-nr01',
    '/faq'
];

async function generateSitemap() {
    console.log('Generating sitemap...');

    let urls = [...STATIC_ROUTES];

    // If you want to fetch dynamic blog posts, you would add logic here
    // const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
    // const { data: posts } = await supabase.from('website_content_posts').select('slug');
    // if (posts) posts.forEach(p => urls.push(`/blog/${p.slug}`));

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
</urlset>`;

    const publicPath = path.resolve('../public/sitemap.xml');
    fs.writeFileSync(publicPath, sitemap);
    console.log(`Sitemap generated at ${publicPath}`);
}

generateSitemap();
