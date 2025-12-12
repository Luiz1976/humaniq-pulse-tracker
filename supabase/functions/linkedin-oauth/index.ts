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
    const LINKEDIN_CLIENT_ID = Deno.env.get("LINKEDIN_CLIENT_ID");
    const LINKEDIN_CLIENT_SECRET = Deno.env.get("LINKEDIN_CLIENT_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
      throw new Error("LinkedIn credentials not configured");
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Generate OAuth URL for LinkedIn login
    if (action === "authorize") {
      const redirectUri = url.searchParams.get("redirect_uri");
      const state = crypto.randomUUID();
      
      const scopes = [
        "openid",
        "profile",
        "email",
        "w_member_social"
      ].join(" ");

      const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("client_id", LINKEDIN_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", redirectUri || `${SUPABASE_URL}/functions/v1/linkedin-oauth?action=callback`);
      authUrl.searchParams.set("state", state);
      authUrl.searchParams.set("scope", scopes);

      console.log("Generated LinkedIn auth URL");
      
      return new Response(JSON.stringify({ 
        url: authUrl.toString(),
        state 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle OAuth callback and exchange code for tokens
    if (action === "callback" || action === "exchange") {
      const { code, redirect_uri, user_id } = await req.json();

      if (!code) {
        throw new Error("Authorization code is required");
      }

      console.log("Exchanging code for access token...");

      // Exchange code for access token
      const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirect_uri || `${SUPABASE_URL}/functions/v1/linkedin-oauth?action=callback`,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error("Token exchange error:", error);
        throw new Error(`Failed to exchange code: ${error}`);
      }

      const tokens = await tokenResponse.json();
      console.log("Token exchange successful");

      // Get user profile from LinkedIn
      const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      if (!profileResponse.ok) {
        const error = await profileResponse.text();
        console.error("Profile fetch error:", error);
        throw new Error(`Failed to get profile: ${error}`);
      }

      const profile = await profileResponse.json();
      console.log("Profile fetched:", profile.name);

      // Store in database
      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

      const accountData = {
        user_id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        expires_at: tokens.expires_in 
          ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
          : null,
        linkedin_user_id: profile.sub,
        name: profile.name,
        profile_url: `https://www.linkedin.com/in/${profile.sub}`,
        avatar_url: profile.picture,
        connected_at: new Date().toISOString(),
      };

      // Check if account already exists
      const { data: existingAccount } = await supabase
        .from("linkedin_accounts")
        .select("id")
        .eq("user_id", user_id)
        .eq("linkedin_user_id", profile.sub)
        .maybeSingle();

      let account;
      if (existingAccount) {
        // Update existing account
        const { data, error } = await supabase
          .from("linkedin_accounts")
          .update(accountData)
          .eq("id", existingAccount.id)
          .select()
          .single();

        if (error) throw error;
        account = data;
      } else {
        // Insert new account
        const { data, error } = await supabase
          .from("linkedin_accounts")
          .insert(accountData)
          .select()
          .single();

        if (error) throw error;
        account = data;

        // Create default settings
        await supabase.from("linkedin_settings").insert({
          account_id: account.id,
        });
      }

      // Log the connection
      await supabase.from("linkedin_activity_logs").insert({
        account_id: account.id,
        log_type: "success",
        action: "connect",
        message: `LinkedIn account "${profile.name}" connected successfully`,
        details: { linkedin_user_id: profile.sub },
      });

      console.log("Account saved to database");

      return new Response(JSON.stringify({ 
        success: true,
        account: {
          id: account.id,
          name: account.name,
          avatar_url: account.avatar_url,
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    console.error("LinkedIn OAuth error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
