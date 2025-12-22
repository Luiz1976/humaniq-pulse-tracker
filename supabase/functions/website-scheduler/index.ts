import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Website Content Scheduler
 * Executa a cada hora para verificar se há conteúdo programado
 * e publicar automaticamente conforme schedule configurado
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

        console.log("🤖 Website Content Scheduler - Starting...");

        const now = new Date();
        const currentDay = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
        const currentHour = now.getUTCHours() - 3; // Convert UTC to BRT (UTC-3)

        console.log(`📅 Current: Day=${currentDay}, Hour=${currentHour} (BRT)`);

        // Get schedules for current day and hour
        const { data: schedules, error: schedError } = await supabase
            .from("website_content_schedule")
            .select("*")
            .eq("auto_generate_enabled", true)
            .eq("day_of_week", currentDay)
            .eq("hour", currentHour);

        if (schedError) throw schedError;

        if (!schedules || schedules.length === 0) {
            console.log("⏭️ No schedules for current time");
            return new Response(JSON.stringify({
                success: true,
                message: "No schedules for current time"
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        console.log(`✅ Found ${schedules.length} schedule(s) to process`);

        const results = [];

        for (const schedule of schedules) {
            const route = schedule.route;
            console.log(`\n📝 Processing route: ${route}`);

            // Define posting frequency by route (in days)
            const frequencyDays: Record<string, number> = {
                'blog': 1,                          // Daily (5x/week configured in schedule)
                'nr01': 30,                         // Monthly
                'riscos-psicossociais': 60,         // Bimonthly (every 2 months)
                'software-nr01': 90,                // Quarterly (every 3 months)
                'faq': 90                           // Quarterly (every 3 months)
            };

            const requiredDaysBetween = frequencyDays[route] || 30;

            // Check if enough time has passed since last generation
            if (schedule.last_generated_at) {
                const lastGenerated = new Date(schedule.last_generated_at);
                const daysSinceLastPost = (now.getTime() - lastGenerated.getTime()) / (1000 * 60 * 60 * 24);

                console.log(`⏰ Days since last post: ${daysSinceLastPost.toFixed(1)}/${requiredDaysBetween}`);

                if (daysSinceLastPost < requiredDaysBetween) {
                    console.log(`⏭️ Too soon - ${route} requires ${requiredDaysBetween} days between posts`);
                    results.push({
                        route,
                        action: "skipped",
                        reason: `frequency_not_met (needs ${requiredDaysBetween} days, only ${daysSinceLastPost.toFixed(1)} passed)`
                    });
                    continue;
                }
            }

            console.log(`✅ Frequency check passed for ${route}`);

            try {
                // Generate content
                console.log(`🔄 Generating content for ${route}...`);
                const generateResponse = await fetch(`${SUPABASE_URL}/functions/v1/website-generate-content`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                    },
                    body: JSON.stringify({
                        route,
                        count: 1,
                        auto_mode: true // Marks as scheduled
                    })
                });

                const generateResult = await generateResponse.json();

                if (generateResponse.ok && generateResult.success) {
                    console.log(`✅ Content generated for ${route}`);

                    // Update last_generated_at
                    await supabase
                        .from("website_content_schedule")
                        .update({ last_generated_at: now.toISOString() })
                        .eq("route", route);

                    results.push({
                        route,
                        action: "generated",
                        posts: generateResult.count
                    });
                } else {
                    console.error(`❌ Failed to generate ${route}:`, generateResult.error);
                    results.push({
                        route,
                        action: "failed",
                        error: generateResult.error
                    });
                }
            } catch (routeError) {
                console.error(`❌ Error processing ${route}:`, routeError);
                results.push({
                    route,
                    action: "error",
                    error: routeError instanceof Error ? routeError.message : String(routeError)
                });
            }
        }

        console.log(`\n✅ Website Content Scheduler - Complete`);

        return new Response(JSON.stringify({
            success: true,
            processed: schedules.length,
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
