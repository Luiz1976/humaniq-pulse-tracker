import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CONTENT_THEMES = [
  "Implementação da NR01 e gestão de riscos psicossociais",
  "Benefícios do mapeamento de saúde mental no trabalho",
  "Como identificar e prevenir riscos psicossociais",
  "A importância do bem-estar corporativo na produtividade",
  "Conformidade com NR01: guia prático para empresas",
  "Transformação digital na gestão de saúde ocupacional",
  "Indicadores de saúde mental e clima organizacional",
  "Cases de sucesso em gestão de riscos psicossociais",
  "Tendências em saúde ocupacional para 2025",
  "O papel da liderança na promoção do bem-estar",
  "Ferramentas digitais para avaliação psicossocial",
  "Como engajar colaboradores em programas de saúde",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const { account_id, count = 1 } = await req.json();

    if (!account_id) {
      throw new Error("account_id is required");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get existing posts to avoid duplicates
    const { data: existingPosts } = await supabase
      .from("linkedin_posts")
      .select("title")
      .eq("account_id", account_id);

    const existingTitles = existingPosts?.map(p => p.title) || [];

    const generatedPosts = [];

    for (let i = 0; i < count; i++) {
      // Select a random theme
      const theme = CONTENT_THEMES[Math.floor(Math.random() * CONTENT_THEMES.length)];
      const imageIndex = Math.floor(Math.random() * 2) + 1; // 1 or 2

      console.log(`Generating post ${i + 1}/${count} with theme: ${theme}`);

      const prompt = `Você é um especialista em marketing de conteúdo B2B para LinkedIn, especializado em saúde ocupacional e conformidade com NR01.

Crie uma postagem profissional para LinkedIn sobre o tema: "${theme}"

A postagem deve:
1. Ter um gancho inicial impactante
2. Apresentar dados ou insights relevantes
3. Mencionar a HumaniQ AI como solução inovadora para mapeamento de riscos psicossociais
4. Incluir um call-to-action sutil para conhecer www.humaniqai.com.br
5. Usar emojis de forma moderada e profissional
6. Ter entre 150-250 palavras
7. Incluir 3-5 hashtags relevantes no final

Evite estes títulos que já foram usados: ${existingTitles.join(", ")}

Responda em JSON com o formato:
{
  "title": "título curto para identificação interna",
  "content": "texto completo da postagem"
}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "Você é um especialista em marketing de conteúdo B2B focado em LinkedIn." },
            { role: "user", content: prompt }
          ],
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("AI generation error:", error);
        throw new Error(`AI generation failed: ${error}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      // Parse JSON from response
      let postData;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          postData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (e) {
        console.error("Failed to parse AI response:", content);
        postData = {
          title: `Post sobre ${theme}`,
          content: content,
        };
      }

      // Save to database
      const { data: newPost, error } = await supabase
        .from("linkedin_posts")
        .insert({
          account_id,
          title: postData.title,
          content: postData.content,
          image_index: imageIndex,
          status: "ready",
        })
        .select()
        .single();

      if (error) {
        console.error("Database insert error:", error);
        throw error;
      }

      generatedPosts.push(newPost);
      existingTitles.push(postData.title);

      // Log the generation
      await supabase.from("linkedin_activity_logs").insert({
        account_id,
        log_type: "success",
        action: "generate",
        message: `Post gerado: "${postData.title}"`,
        details: { post_id: newPost.id },
      });
    }

    console.log(`Generated ${generatedPosts.length} posts`);

    return new Response(JSON.stringify({ 
      success: true,
      posts: generatedPosts,
      count: generatedPosts.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Content generation error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
