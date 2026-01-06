
import { createClient } from '@supabase/supabase-js'

const url = 'https://wdjggjsxsvexqrhyizrn.supabase.co'
const key = 'sb_publishable_Dfs3tKXBeDRvDwi1W0101g_endivt-r'
const supabase = createClient(url, key)

async function check() {
    console.log("Checking linkedin_posts status...")
    const { data, error } = await supabase.from('linkedin_posts').select('*').limit(5)
    if (error) {
        console.error('Error:', error)
    } else {
        console.log('Posts found:', data.length)
        data.forEach(p => console.log(`- ID: ${p.id}, Status: ${p.status}, ImageIndex: ${p.image_index}`))
    }

    console.log("Checking linkedin_listening...")
    const { data: lData, error: lError } = await supabase.from('linkedin_listening').select('*').limit(1)
    if (lError) {
        console.error('Error fetching linkedin_listening:', lError)
    } else {
        console.log('Listening table accessible. Rows:', lData.length)
    }

    console.log("Checking linkedin_activity_logs...")
    const { data: aData, error: aError } = await supabase.from('linkedin_activity_logs').select('*').limit(1)
    if (aError) {
        console.error('Error fetching linkedin_activity_logs:', aError)
    } else {
        console.log('Logs table accessible. Rows:', aData.length)
    }
}

check()
