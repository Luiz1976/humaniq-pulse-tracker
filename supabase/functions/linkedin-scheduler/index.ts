import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get current time in Brasília timezone (UTC-3)
    const now = new Date();
    const brasiliaOffset = -3 * 60;
    const brasiliaTime = new Date(now.getTime() + (brasiliaOffset + now.getTimezoneOffset()) * 60000);
    const currentHour = brasiliaTime.getHours();

    console.log(`Scheduler running at ${brasiliaTime.toISOString()} (Brasília hour: ${currentHour})`);

    // Get all accounts with settings
    const { data: accounts, error: accountsError } = await supabase
      .from("linkedin_accounts")
      .select("*, linkedin_settings(*)");

    if (accountsError) {
      throw accountsError;
    }

    const results = {
      posts_published: 0,
      listening_scans: 0,
      errors: [] as string[],
    };

    for (const account of accounts || []) {
      const settings = account.linkedin_settings?.[0];
      
      if (!settings) {
        console.log(`No settings for account ${account.id}, skipping`);
        continue;
      }

      // Check if auto-posting is enabled and within time window
      const startHour = settings.post_start_hour || 6;
      const endHour = settings.post_end_hour || 22;
      const intervalMinutes = settings.post_interval_minutes || 60;

      if (settings.auto_post_enabled && currentHour >= startHour && currentHour < endHour) {
        // Check if enough time has passed since last post
        const lastPost = settings.last_post_at ? new Date(settings.last_post_at) : null;
        const minutesSinceLastPost = lastPost 
          ? (now.getTime() - lastPost.getTime()) / (1000 * 60)
          : Infinity;

        if (minutesSinceLastPost >= intervalMinutes) {
          console.log(`Publishing post for account ${account.name}`);
          
          try {
            const postResponse = await fetch(`${SUPABASE_URL}/functions/v1/linkedin-post`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              },
              body: JSON.stringify({ account_id: account.id }),
            });

            if (postResponse.ok) {
              results.posts_published++;
            } else {
              const error = await postResponse.text();
              results.errors.push(`Post error for ${account.name}: ${error}`);
            }
          } catch (e) {
            results.errors.push(`Post exception for ${account.name}: ${e}`);
          }
        }
      }

      // Run listening scan if enabled
      if (settings.auto_comment_enabled) {
        console.log(`Running listening scan for account ${account.name}`);
        
        try {
          const listenResponse = await fetch(`${SUPABASE_URL}/functions/v1/linkedin-listen`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ account_id: account.id }),
          });

          if (listenResponse.ok) {
            const listenData = await listenResponse.json();
            results.listening_scans++;

            // Auto-comment on high relevance detections
            if (listenData.detections && settings.auto_comment_enabled) {
              for (const detection of listenData.detections) {
                if (detection.relevance_score >= 0.7) {
                  console.log(`Auto-commenting on detection ${detection.id}`);
                  
                  await fetch(`${SUPABASE_URL}/functions/v1/linkedin-comment`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                    },
                    body: JSON.stringify({ detection_id: detection.id }),
                  });
                }
              }
            }
          } else {
            const error = await listenResponse.text();
            results.errors.push(`Listen error for ${account.name}: ${error}`);
          }
        } catch (e) {
          results.errors.push(`Listen exception for ${account.name}: ${e}`);
        }
      }
    }

    console.log("Scheduler completed:", results);

    return new Response(JSON.stringify({ 
      success: true,
      timestamp: brasiliaTime.toISOString(),
      brasilia_hour: currentHour,
      ...results,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Scheduler error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
