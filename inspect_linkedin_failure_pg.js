
import pg from 'pg';

const { Client } = pg;

const connectionString = 'postgresql://postgres.ryfocppqiojggjbsdfoi:Supabase2024!@aws-0-sa-east-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function inspectLinkedInData() {
    try {
        await client.connect();

        console.log('--- Last 5 LinkedIn Posts ---');
        const postsRes = await client.query(`
            SELECT id, title, status, image_index, image_url, created_at 
            FROM linkedin_posts 
            ORDER BY created_at DESC 
            LIMIT 5
        `);

        postsRes.rows.forEach(p => {
            console.log(`ID: ${p.id}, Date: ${p.created_at}, Status: ${p.status}, ImgIdx: ${p.image_index}, ImgURL: ${p.image_url}`);
        });

        console.log('\n--- Last 5 LinkedIn Logs ---');
        const logsRes = await client.query(`
            SELECT log_type, action, message, created_at 
            FROM linkedin_activity_logs 
            ORDER BY created_at DESC 
            LIMIT 5
        `);

        logsRes.rows.forEach(l => {
            console.log(`[${l.created_at}] ${l.log_type} / ${l.action}: ${l.message}`);
        });

    } catch (err) {
        console.error('Error executing query:', err);
    } finally {
        await client.end();
    }
}

inspectLinkedInData();
