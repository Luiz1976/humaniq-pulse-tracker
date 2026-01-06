
import { createClient } from '@supabase/supabase-js'

const url = 'https://wdjggjsxsvexqrhyizrn.supabase.co'
const key = 'sb_publishable_Dfs3tKXBeDRvDwi1W0101g_endivt-r'
const supabase = createClient(url, key)

async function check() {
    console.log("Checking linkedin_posts table...")
    const { data, error } = await supabase.from('linkedin_posts').select('*').limit(1)
    if (error) {
        console.error('Error fetching linkedin_posts:', error)
    } else {
        console.log('Success! Connection workable. Rows found:', data.length)
    }

    console.log("Checking linkedin_settings table...")
    const { data: sData, error: sError } = await supabase.from('linkedin_settings').select('*').limit(1)
    if (sError) {
        console.error('Error fetching linkedin_settings:', sError)
    } else {
        console.log('Success! Settings accessible.')
    }
}

check()
