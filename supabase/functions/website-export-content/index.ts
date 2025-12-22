import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // CORS Preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const SUPABASE_URL =
            Deno.env.get("SUPABASE_URL") ?? Deno.env.get("CUSTOM_SUPABASE_URL");
        const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            throw new Error("Supabase credentials not configured");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Parse query parameters
        const url = new URL(req.url);
        const route = url.searchParams.get("route") || "all";
        const limit = parseInt(url.searchParams.get("limit") || "10");
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const orderBy = url.searchParams.get("orderBy") || "published_at";
        const order = url.searchParams.get("order") || "desc";

        console.log(
            `📤 Export content request: route=${route}, limit=${limit}, offset=${offset}`
        );

        // Build query
        let query = supabase
            .from("website_content_posts")
            .select(
                `
        id,
        route,
        slug,
        title,
        content,
        excerpt,
        image_url,
        image_alt,
        meta_title,
        meta_description,
        keywords,
        published_at,
        created_at,
        website_content_images (
          url,
          alt_text,
          caption,
          width,
          height,
          format
        )
      `
            )
            .eq("status", "published")
            .order(orderBy, { ascending: order === "asc" })
            .range(offset, offset + limit - 1);

        // Filter by route if specified
        if (route !== "all" && route) {
            query = query.eq("route", route);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        // Transform data for better consumption
        const posts = data?.map((post) => ({
            id: post.id,
            route: post.route,
            slug: post.slug,
            url: `https://www.humaniqai.com.br/${post.route}/${post.slug}`,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            image: post.website_content_images?.[0] || {
                url: post.image_url,
                alt: post.image_alt,
            },
            seo: {
                title: post.meta_title,
                description: post.meta_description,
                keywords: post.keywords,
            },
            publishedAt: post.published_at,
            createdAt: post.created_at,
        }));

        return new Response(
            JSON.stringify({
                success: true,
                total: count || posts?.length || 0,
                limit,
                offset,
                posts: posts || [],
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Export Error:", error);

        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : String(error),
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
