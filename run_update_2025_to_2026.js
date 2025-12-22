
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ryfocppqiojggjbsdfoi.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runUpdate() {
    console.log('Starting update of 2025 references to 2026...');

    // 1. Update website_content_posts
    // Note: Supabase JS library doesn't support raw SQL easily without rpc, 
    // but we can fetch and update or use a text search.
    // However, for bulk update, raw SQL is best. 
    // Since we don't have a direct raw SQL function exposed, 
    // we will fetch rows with '2025' and update them one by one (or batch).

    // Fetch website posts
    const { data: websitePosts, error: websiteError } = await supabase
        .from('website_content_posts')
        .select('*')
        .textSearch('fts', "'2025'"); // Assuming full text search or just use ilike via filter if fts column doesn't exist.

    // Fallback to simple scan if textSearch fails or just use ilike
    const { data: postsToUpdate, error: scanError } = await supabase
        .from('website_content_posts')
        .select('id, title, excerpt, content')
        .or('title.ilike.%2025%,excerpt.ilike.%2025%,content.ilike.%2025%');

    if (scanError) {
        console.error('Error scanning website posts:', scanError);
    } else if (postsToUpdate) {
        console.log(`Found ${postsToUpdate.length} website posts to update.`);

        for (const post of postsToUpdate) {
            const updates = {};
            if (post.title?.includes('2025')) updates.title = post.title.replace(/2025/g, '2026');
            if (post.excerpt?.includes('2025')) updates.excerpt = post.excerpt.replace(/2025/g, '2026');
            if (post.content?.includes('2025')) updates.content = post.content.replace(/2025/g, '2026');

            if (Object.keys(updates).length > 0) {
                const { error: updateError } = await supabase
                    .from('website_content_posts')
                    .update(updates)
                    .eq('id', post.id);

                if (updateError) console.error(`Failed to update post ${post.id}:`, updateError);
                else console.log(`Updated website post ${post.id}`);
            }
        }
    }

    // 2. Update linkedin_posts
    const { data: linkedinPosts, error: linkedinError } = await supabase
        .from('linkedin_posts')
        .select('id, content')
        .ilike('content', '%2025%');

    if (linkedinError) {
        console.error('Error scanning linkedin posts:', linkedinError);
    } else if (linkedinPosts) {
        console.log(`Found ${linkedinPosts.length} linkedin posts to update.`);
        for (const post of linkedinPosts) {
            const newContent = post.content.replace(/2025/g, '2026');
            const { error: updateError } = await supabase
                .from('linkedin_posts')
                .update({ content: newContent })
                .eq('id', post.id);

            if (updateError) console.error(`Failed to update linkedin post ${post.id}:`, updateError);
            else console.log(`Updated linkedin post ${post.id}`);
        }
    }

    console.log('Update process completed.');
}

runUpdate();
