
const { google } = require('googleapis');
const key = require('./service_account.json'); // User must place their JSON key here

const JWT = google.auth.JWT;
const auth = new JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/indexing'],
    null
);

const urlsToIndex = [
    'https://human-iq-pulse.lovable.app/',
    'https://human-iq-pulse.lovable.app/nr01',
    'https://human-iq-pulse.lovable.app/riscos-psicossociais',
    'https://human-iq-pulse.lovable.app/blog'
    // Add more URLs here
];

async function submitUrl(url) {
    const options = {
        url: url,
        type: 'URL_UPDATED'
    };

    const indexing = google.indexing({ version: 'v3', auth });

    try {
        const res = await indexing.urlNotifications.publish({
            requestBody: options
        });
        console.log(`Submitted ${url}: Status ${res.status} - ${res.statusText}`);
    } catch (e) {
        console.error(`Error submitting ${url}:`, e.message);
    }
}

async function main() {
    console.log(`Starting index submission for ${urlsToIndex.length} URLs...`);
    await auth.authorize();

    for (const url of urlsToIndex) {
        await submitUrl(url);
    }

    console.log('All submissions finished.');
}

main();
