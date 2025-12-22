
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wdjggjsxsvexqrhyizrn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectLinkedInData() {
    console.log('Inspecting recent LinkedIn posts...');

    // Get last 5 posts
    const { data: posts, error: postsError } = await supabase
        .from('linkedin_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (postsError) console.error('Error fetching posts:', postsError);
    else {
        console.log('--- Recent Posts ---');
        posts.forEach(p => {
            console.log(`ID: ${p.id}, Title: "${p.title.substring(0, 30)}...", Status: ${p.status}, Image Index: ${p.image_index}, Image URL: ${p.image_url}`);
        });
    }

    console.log('\nInspecting recent logs...');

    // Get last 10 logs
    const { data: logs, error: logsError } = await supabase
        .from('linkedin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (logsError) console.error('Error fetching logs:', logsError);
    else {
        console.log('--- Recent Logs ---');
        logs.forEach(l => {
            console.log(`Type: ${l.log_type}, Action: ${l.action}, Message: "${l.message}", Details: ${JSON.stringify(l.details)}`);
        });
    }
}

inspectLinkedInData();
