
import pg from 'pg';

const { Client } = pg;

const connectionString = 'postgresql://postgres.ryfocppqiojggjbsdfoi:Supabase2024!@aws-0-sa-east-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function runUpdate() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // Update website_content_posts
        const websiteUpdateQuery = `
            UPDATE website_content_posts
            SET 
                title = REPLACE(title, '2025', '2026'),
                excerpt = REPLACE(excerpt, '2025', '2026'),
                content = REPLACE(content, '2025', '2026')
            WHERE 
                title LIKE '%2025%' OR 
                excerpt LIKE '%2025%' OR 
                content LIKE '%2025%';
        `;

        const websiteRes = await client.query(websiteUpdateQuery);
        console.log(`Updated ${websiteRes.rowCount} website posts.`);

        // Update linkedin_posts
        const linkedinUpdateQuery = `
            UPDATE linkedin_posts
            SET 
                content = REPLACE(content, '2025', '2026')
            WHERE 
                content LIKE '%2025%';
        `;

        const linkedinRes = await client.query(linkedinUpdateQuery);
        console.log(`Updated ${linkedinRes.rowCount} LinkedIn posts.`);

    } catch (err) {
        console.error('Error executing update:', err);
    } finally {
        await client.end();
        console.log('Disconnected.');
    }
}

runUpdate();
