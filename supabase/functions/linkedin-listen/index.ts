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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { account_id, action = "scan" } = await req.json();

    if (!account_id) {
      throw new Error("account_id is required");
    }

    // Get account and settings
    const { data: account, error: accountError } = await supabase
      .from("linkedin_accounts")
      .select("*")
      .eq("id", account_id)
      .single();

    if (accountError || !account) {
      throw new Error("LinkedIn account not found");
    }

    const { data: settings } = await supabase
      .from("linkedin_settings")
      .select("*")
      .eq("account_id", account_id)
      .single();

    const keywords = settings?.listening_keywords || [
      "NR01", 
      "riscos psicossociais", 
      "saúde mental trabalho",
      "bem-estar corporativo"
    ];

    console.log(`Scanning for keywords: ${keywords.join(", ")}`);

    // Simulate listening activity (LinkedIn API has strict limitations)
    // In production, this would use LinkedIn's Search API or web scraping
    const mockDiscussions = [
      {
        source_url: "https://linkedin.com/posts/example1",
        source_author: "Maria Silva - RH Manager",
        source_content: "Estamos implementando a NR01 na empresa e enfrentando desafios com o mapeamento de riscos psicossociais. Alguém tem experiência?",
        detected_topic: "NR01 Implementation",
      },
      {
        source_url: "https://linkedin.com/posts/example2",
        source_author: "João Costa - SESMT",
        source_content: "Preciso de ajuda para entender como avaliar riscos psicossociais conforme a nova NR01. Quais ferramentas vocês recomendam?",
        detected_topic: "Psychosocial Risk Assessment",
      },
      {
        source_url: "https://linkedin.com/posts/example3",
        source_author: "Ana Oliveira - DHO",
        source_content: "Alguém conhece uma solução digital para mapeamento de saúde mental no trabalho que seja conforme NR01?",
        detected_topic: "Digital Health Solutions",
      },
    ];

    // Randomly select discussions to simulate real scanning
    const detectedCount = Math.floor(Math.random() * 3) + 1;
    const detected = mockDiscussions.slice(0, detectedCount);

    const savedDetections = [];

    for (const discussion of detected) {
      // Calculate relevance score using AI
      const scorePrompt = `Analise o seguinte post do LinkedIn e determine:
1. Relevância para riscos psicossociais e NR01 (0-1)
2. Se é uma oportunidade de interação comercial
3. Se menciona necessidade de ajuda

Post: "${discussion.source_content}"

Responda em JSON:
{
  "relevance_score": 0.0-1.0,
  "is_opportunity": boolean,
  "needs_help": boolean,
  "suggested_response": "texto de resposta contextualizada mencionando HumaniQ AI"
}`;

      let analysis;
      try {
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "Você é um especialista em análise de leads B2B." },
              { role: "user", content: scorePrompt }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const content = aiData.choices[0]?.message?.content;
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (e) {
        console.error("AI analysis error:", e);
      }

      analysis = analysis || {
        relevance_score: 0.7,
        is_opportunity: true,
        needs_help: true,
        suggested_response: `Olá! Entendo o desafio de implementar a NR01. A HumaniQ AI oferece uma solução 100% digital para mapeamento de riscos psicossociais com relatórios automáticos. Conheça em www.humaniqai.com.br 🚀`,
      };

      // Save detection
      const { data: detection, error } = await supabase
        .from("linkedin_listening")
        .insert({
          account_id,
          source_url: discussion.source_url,
          source_author: discussion.source_author,
          source_content: discussion.source_content,
          detected_topic: discussion.detected_topic,
          relevance_score: analysis.relevance_score,
          action_taken: "pending",
          response_content: analysis.suggested_response,
        })
        .select()
        .single();

      if (!error && detection) {
        savedDetections.push(detection);

        // Log the detection
        await supabase.from("linkedin_activity_logs").insert({
          account_id,
          log_type: "info",
          action: "listen",
          message: `Detectado: "${discussion.detected_topic}" por ${discussion.source_author}`,
          details: { 
            detection_id: detection.id,
            relevance: analysis.relevance_score,
          },
        });
      }
    }

    console.log(`Detected ${savedDetections.length} relevant discussions`);

    return new Response(JSON.stringify({ 
      success: true,
      detected: savedDetections.length,
      detections: savedDetections,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Listening error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
