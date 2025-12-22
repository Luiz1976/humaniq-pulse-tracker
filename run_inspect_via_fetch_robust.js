
const url = "https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/inspect-linkedin-data";
const key = "sb_publishable_Dfs3tKXBeDRvDwi1W0101g_endivt-r";

console.log(`Triggering inspection at ${url}...`);

fetch(url, {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
    }
})
    .then(async res => {
        const text = await res.text();
        if (!res.ok) {
            throw new Error(`Status ${res.status}: ${text}`);
        }
        try {
            const data = JSON.parse(text);
            console.log("--- Posts ---");
            data.posts.forEach(p => console.log(JSON.stringify(p)));
            console.log("\n--- Logs ---");
            data.logs.forEach(l => console.log(`${l.created_at} [${l.log_type}]: ${l.message}`));
        } catch (e) {
            throw new Error(`Failed to parse JSON: ${text}`);
        }
    })
    .catch(err => console.error("Failed:", err));
