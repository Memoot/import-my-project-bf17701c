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

    // Verify user is authenticated
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

    const { prompt, style } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "يرجى إدخال وصف للصورة" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize prompt - remove potentially harmful content
    const sanitizedPrompt = prompt.trim().substring(0, 1000);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "خطأ في الإعدادات" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build enhanced prompt based on style - NO TEXT in images
    let enhancedPrompt = sanitizedPrompt;
    const noTextSuffix = " IMPORTANT: Do NOT include any text, letters, words, numbers, or typography in the image. Pure visual imagery only, no text overlays.";
    
    if (style) {
      switch (style) {
        case "professional":
          enhancedPrompt = `Professional, high-quality, corporate style advertising visual: ${sanitizedPrompt}. Ultra high resolution, clean and modern.${noTextSuffix}`;
          break;
        case "creative":
          enhancedPrompt = `Creative, artistic, vibrant and colorful advertising visual: ${sanitizedPrompt}. Ultra high resolution, unique and eye-catching.${noTextSuffix}`;
          break;
        case "minimal":
          enhancedPrompt = `Minimal, clean, simple and elegant advertising visual: ${sanitizedPrompt}. Ultra high resolution, white space, modern.${noTextSuffix}`;
          break;
        case "realistic":
          enhancedPrompt = `Photorealistic, highly detailed advertising visual: ${sanitizedPrompt}. Ultra high resolution, 8k quality.${noTextSuffix}`;
          break;
        default:
          enhancedPrompt = `${sanitizedPrompt}. Ultra high resolution.${noTextSuffix}`;
      }
    } else {
      enhancedPrompt = `${sanitizedPrompt}. Ultra high resolution.${noTextSuffix}`;
    }

    console.log("Generating image with prompt:", enhancedPrompt);

    console.log("Calling AI gateway with model: google/gemini-2.5-flash-image-preview");
    
    const requestBody = {
      model: "google/gemini-2.5-flash-image-preview",
      messages: [
        {
          role: "user",
          content: enhancedPrompt,
        },
      ],
      modalities: ["image", "text"],
    };
    
    console.log("Request body:", JSON.stringify(requestBody));
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("AI gateway response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      console.error("Full error details:", errorText);
      
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
        JSON.stringify({ error: "فشل في توليد الصورة" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "لم يتم العثور على صورة في الاستجابة" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({ 
        image: imageUrl,
        message: "تم توليد الصورة بنجاح"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-image:", error);
    return new Response(
      JSON.stringify({ error: "حدث خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
