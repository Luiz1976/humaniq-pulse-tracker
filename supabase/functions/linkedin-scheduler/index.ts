import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * LinkedIn Daily Scheduler
 * Executa automaticamente via cron job para:
 * 1. Verificar se deve postar (baseado em settings)
 * 2. Publicar próximo post ready
 * 3. Gerar novos posts se necessário
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("🤖 LinkedIn Daily Scheduler - Starting...");

    // Get all accounts with auto-posting enabled
    const { data: settings, error: settingsError } = await supabase
      .from("linkedin_settings")
      .select("*, linkedin_accounts(*)")
      .eq("auto_post_enabled", true);

    if (settingsError) throw settingsError;

    if (!settings || settings.length === 0) {
      console.log("No accounts with auto-posting enabled");
      return new Response(JSON.stringify({
        success: true,
        message: "No accounts configured for auto-posting"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const results = [];

    for (const setting of settings) {
      const account = setting.linkedin_accounts;
      if (!account) continue;

      console.log(`\n📊 Checking account: ${account.name || account.id}`);

      // Check if today is weekend (Sat=6, Sun=0) - Skip on weekends
      const now = new Date();
      const currentDay = now.getUTCDay(); // 0 = Sunday, 6 = Saturday

      if (currentDay === 0 || currentDay === 6) {
        const dayName = currentDay === 0 ? 'Sunday' : 'Saturday';
        console.log(`⏭️ Skipping ${dayName} - LinkedIn posts only Monday-Friday`);
        results.push({
          account_id: account.id,
          action: "skipped",
          reason: `weekend (${dayName})`
        });
        continue;
      }

      console.log(`✅ Weekday check passed (day ${currentDay})`);

      // Check if we should post (time window and interval)
      const currentHour = now.getUTCHours() - 3; // Convert UTC to BRT (UTC-3)
      const startHour = setting.post_start_hour || 0;
      const endHour = setting.post_end_hour || 23;

      console.log(`⏰ Current hour (BRT): ${currentHour}, Window: ${startHour}-${endHour}`);

      if (currentHour < startHour || currentHour >= endHour) {
        console.log(`⏭️ Outside posting window - skipping`);
        results.push({
          account_id: account.id,
          action: "skipped",
          reason: "outside_time_window"
        });
        continue;
      }

      // Check last post time and interval
      if (setting.last_post_at) {
        const lastPost = new Date(setting.last_post_at);
        const minutesSinceLastPost = (now.getTime() - lastPost.getTime()) / 60000;
        const requiredInterval = setting.post_interval_minutes || 1440; // Default 24h

        console.log(`📅 Minutes since last post: ${minutesSinceLastPost.toFixed(0)}/${requiredInterval}`);

        if (minutesSinceLastPost < requiredInterval) {
          console.log(`⏭️ Too soon to post again - skipping`);
          results.push({
            account_id: account.id,
            action: "skipped",
            reason: "interval_not_met"
          });
          continue;
        }
      }

      // Post!
      console.log(`✅ Conditions met - attempting to post`);

      try {
        const postResponse = await fetch(`${SUPABASE_URL}/functions/v1/linkedin-post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({ account_id: account.id })
        });

        const postResult = await postResponse.json();

        if (postResponse.ok && postResult.success) {
          console.log(`✅ Post published successfully`);
          results.push({
            account_id: account.id,
            action: "posted",
            post_id: postResult.post_id,
            linkedin_post_id: postResult.linkedin_post_id
          });
        } else {
          console.error(`❌ Post failed:`, postResult.error);
          results.push({
            account_id: account.id,
            action: "failed",
            error: postResult.error
          });
        }
      } catch (postError) {
        console.error(`❌ Post error:`, postError);
        results.push({
          account_id: account.id,
          action: "error",
          error: postError instanceof Error ? postError.message : String(postError)
        });
      }
    }

    console.log(`\n✅ LinkedIn Daily Scheduler - Complete`);

    return new Response(JSON.stringify({
      success: true,
      checked_accounts: settings.length,
      results
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Scheduler Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
