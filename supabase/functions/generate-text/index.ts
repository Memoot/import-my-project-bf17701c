import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "غير مصرح" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "غير مصرح" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { prompt, type, language, tone } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "يرجى إدخال الموضوع" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitizedPrompt = prompt.trim().substring(0, 2000);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "خطأ في الإعدادات" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build system prompt based on type and language
    let systemPrompt = "";
    const langInstruction = language === "ar" 
      ? "اكتب باللغة العربية الفصحى بشكل احترافي."
      : language === "en"
      ? "Write in professional English."
      : "Write in both Arabic and English, with Arabic first then English translation.";

    const toneInstruction = tone === "formal" 
      ? "Use a formal, professional tone."
      : tone === "casual"
      ? "Use a casual, friendly tone."
      : tone === "marketing"
      ? "Use persuasive marketing language."
      : "Use an informative, educational tone.";

    switch (type) {
      case "article":
        systemPrompt = `You are an expert content writer. Write a well-structured article with headings, introduction, body paragraphs, and conclusion. ${langInstruction} ${toneInstruction}`;
        break;
      case "social":
        systemPrompt = `You are a social media expert. Create engaging social media posts suitable for multiple platforms (Facebook, Twitter, Instagram, LinkedIn). Include relevant hashtags. ${langInstruction} ${toneInstruction}`;
        break;
      case "email":
        systemPrompt = `You are an email marketing expert. Write a professional email with subject line, greeting, body, call-to-action, and closing. ${langInstruction} ${toneInstruction}`;
        break;
      case "ad":
        systemPrompt = `You are an advertising copywriter. Create compelling ad copy with headline, body text, and call-to-action. ${langInstruction} ${toneInstruction}`;
        break;
      case "rewrite":
        systemPrompt = `You are an expert editor. Rewrite and improve the given text while maintaining its meaning but enhancing clarity, style, and impact. ${langInstruction} ${toneInstruction}`;
        break;
      case "translate":
        systemPrompt = `You are a professional translator. Translate the text accurately while maintaining the original meaning and tone. Provide both Arabic and English versions.`;
        break;
      default:
        systemPrompt = `You are a helpful AI assistant. Generate high-quality content based on the user's request. ${langInstruction} ${toneInstruction}`;
    }

    console.log("Generating text with type:", type, "language:", language);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: sanitizedPrompt },
        ],
      }),
    });

    console.log("AI gateway response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز الحد المسموح، يرجى المحاولة لاحقاً" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد للاستمرار" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "فشل في توليد النص" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      console.error("No text in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "لم يتم توليد نص" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Text generated successfully");

    return new Response(
      JSON.stringify({ 
        text: generatedText,
        message: "تم توليد النص بنجاح"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-text:", error);
    return new Response(
      JSON.stringify({ error: "حدث خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
