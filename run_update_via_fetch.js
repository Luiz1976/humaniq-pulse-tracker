
const url = "https://wdjggjsxsvexqrhyizrn.supabase.co/functions/v1/update-content-year";
const key = "sb_publishable_Dfs3tKXBeDRvDwi1W0101g_endivt-r";

console.log(`Triggering update at ${url}...`);

fetch(url, {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
    }
})
    .then(async res => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Status ${res.status}: ${text}`);
        }
        return res.json();
    })
    .then(data => console.log("Success:", data))
    .catch(err => console.error("Failed:", err));
