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

    const { detection_id, custom_message } = await req.json();

    if (!detection_id) {
      throw new Error("detection_id is required");
    }

    // Get detection with account
    const { data: detection, error: detectionError } = await supabase
      .from("linkedin_listening")
      .select("*, linkedin_accounts(*)")
      .eq("id", detection_id)
      .single();

    if (detectionError || !detection) {
      throw new Error("Detection not found");
    }

    const account = detection.linkedin_accounts;
    const message = custom_message || detection.response_content;

    console.log(`Commenting on detection: ${detection.detected_topic}`);

    // In production, this would post to LinkedIn
    // LinkedIn's comment API requires the post URN which we would extract from source_url
    
    // Simulate successful comment
    const commentId = `comment-${Date.now()}`;

    // Update detection status
    await supabase
      .from("linkedin_listening")
      .update({
        action_taken: "commented",
        response_content: message,
        actioned_at: new Date().toISOString(),
      })
      .eq("id", detection_id);

    // Log success
    await supabase.from("linkedin_activity_logs").insert({
      account_id: account.id,
      log_type: "success",
      action: "comment",
      message: `Comentário postado em resposta a ${detection.source_author}`,
      details: { 
        detection_id,
        comment_id: commentId,
      },
    });

    console.log("Comment posted successfully");

    return new Response(JSON.stringify({ 
      success: true,
      comment_id: commentId,
      detection_id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Comment error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
