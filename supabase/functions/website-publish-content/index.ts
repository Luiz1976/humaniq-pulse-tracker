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
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("CUSTOM_SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("CUSTOM_SERVICE_ROLE_KEY");

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Supabase credentials not configured");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const reqBody = await req.json().catch(() => ({}));
        const { post_id, auto_mode = false } = reqBody;

        console.log("📤 Website Content Publisher - Starting...");

        let postsToPublish = [];

        if (post_id) {
            // Publish specific post
            const { data, error } = await supabase
                .from("website_content_posts")
                .select("*")
                .eq("id", post_id)
                .single();

            if (error) throw error;
            if (data) postsToPublish = [data];
        } else if (auto_mode) {
            // Auto-publish scheduled posts
            const now = new Date().toISOString();
            const { data, error } = await supabase
                .from("website_content_posts")
                .select("*")
                .eq("status", "scheduled")
                .lte("scheduled_for", now);

            if (error) throw error;
            if (data) postsToPublish = data;
        }

        const published = [];

        for (const post of postsToPublish) {
            console.log(`📝 Publishing: ${post.title}`);

            const { data: updatedPost, error: updateError } = await supabase
                .from("website_content_posts")
                .update({
                    status: "published",
                    published_at: new Date().toISOString()
                })
                .eq("id", post.id)
                .select()
                .single();

            if (updateError) {
                console.error(`❌ Failed to publish ${post.id}:`, updateError);

                await supabase.from("website_content_activity_logs").insert({
                    log_type: "error",
                    action: "publish_content",
                    route: post.route,
                    post_id: post.id,
                    message: `Failed to publish "${post.title}"`,
                    details: { error: updateError.message }
                });

                continue;
            }

            // Log success
            await supabase.from("website_content_activity_logs").insert({
                log_type: "success",
                action: "publish_content",
                route: post.route,
                post_id: post.id,
                message: `Published "${post.title}"`,
                details: {
                    slug: post.slug,
                    route: post.route
                }
            });

            published.push(updatedPost);
            console.log(`✅ Published: ${post.title}`);
        }

        return new Response(JSON.stringify({
            success: true,
            published_count: published.length,
            posts: published
        }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Publisher Error:", error);

        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
});
