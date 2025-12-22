
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
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing env vars");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        let updatedCount = 0;

        // 1. Update website_content_posts
        // Fetch all posts that might contain 2025
        const { data: posts, error: fetchError } = await supabase
            .from("website_content_posts")
            .select("id, title, excerpt, content")
            .or('title.ilike.%2025%,excerpt.ilike.%2025%,content.ilike.%2025%');

        if (fetchError) throw fetchError;

        if (posts && posts.length > 0) {
            console.log(`Found ${posts.length} website posts to check.`);
            for (const post of posts) {
                const updates: any = {};
                if (post.title?.includes("2025")) updates.title = post.title.replace(/2025/g, "2026");
                if (post.excerpt?.includes("2025")) updates.excerpt = post.excerpt.replace(/2025/g, "2026");
                if (post.content?.includes("2025")) updates.content = post.content.replace(/2025/g, "2026");

                if (Object.keys(updates).length > 0) {
                    const { error: updateError } = await supabase
                        .from("website_content_posts")
                        .update(updates)
                        .eq("id", post.id);

                    if (!updateError) updatedCount++;
                }
            }
        }

        // 2. Update linkedin_posts
        const { data: liPosts, error: liError } = await supabase
            .from("linkedin_posts")
            .select("id, content")
            .ilike("content", "%2025%");

        if (liError) throw liError;

        if (liPosts && liPosts.length > 0) {
            console.log(`Found ${liPosts.length} LinkedIn posts.`);
            for (const post of liPosts) {
                const newContent = post.content.replace(/2025/g, "2026");
                const { error: updateError } = await supabase
                    .from("linkedin_posts")
                    .update({ content: newContent })
                    .eq("id", post.id);
                if (!updateError) updatedCount++;
            }
        }

        return new Response(JSON.stringify({ success: true, updated: updatedCount }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
