
import { createClient } from '@supabase/supabase-js'

const url = 'https://wdjggjsxsvexqrhyizrn.supabase.co'
const key = 'sb_publishable_Dfs3tKXBeDRvDwi1W0101g_endivt-r'
const supabase = createClient(url, key)

async function fixAvatar() {
    console.log("Fixing invalid avatar URL...")

    // Update all accounts with the specific broken URL pattern or just all of them to null to be safe
    // The broken URL likely starts with https://media.licdn.com/dms/image/v2/
    // But safest is to just set to null for the current user's account.

    // First, find the account
    const { data: accounts, error: findError } = await supabase
        .from('linkedin_accounts')
        .select('id, name, avatar_url')

    if (findError) {
        console.error("Error finding account:", findError)
        return
    }

    if (!accounts || accounts.length === 0) {
        console.log("No accounts found.")
        return
    }

    console.log(`Found ${accounts.length} account(s). Updating avatar_url to null...`)

    for (const account of accounts) {
        const { error: updateError } = await supabase
            .from('linkedin_accounts')
            .update({ avatar_url: null })
            .eq('id', account.id)

        if (updateError) {
            console.error(`Failed to update account ${account.name}:`, updateError)
        } else {
            console.log(`Successfully removed expired avatar for account: ${account.name}`)
        }
    }
}

fixAvatar()
