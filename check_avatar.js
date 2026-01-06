
import { createClient } from '@supabase/supabase-js'

const url = 'https://wdjggjsxsvexqrhyizrn.supabase.co'
const key = 'sb_publishable_Dfs3tKXBeDRvDwi1W0101g_endivt-r'
const supabase = createClient(url, key)

async function check() {
    console.log("Checking linkedin_accounts...")
    const { data, error } = await supabase.from('linkedin_accounts').select('avatar_url').limit(1)
    if (data && data.length > 0) {
        console.log('Avatar URL:', data[0].avatar_url)
    } else {
        console.log('No account found')
    }
}

check()
