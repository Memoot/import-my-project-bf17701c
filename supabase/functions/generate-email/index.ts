import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "غير مصرح - يرجى تسجيل الدخول" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "غير مصرح - جلسة غير صالحة" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", user.id);

    const { prompt, type } = await req.json();
    
    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.length > 2000) {
      return new Response(
        JSON.stringify({ error: "الوصف غير صالح أو طويل جداً" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try Gemini API first, then OpenAI as fallback, then Lovable AI
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    // Determine which AI provider to use
    let aiProvider: 'gemini' | 'openai' | 'lovable' | null = null;
    if (GEMINI_API_KEY) {
      aiProvider = 'gemini';
    } else if (OPENAI_API_KEY) {
      aiProvider = 'openai';
    } else if (LOVABLE_API_KEY) {
      aiProvider = 'lovable';
    }
    
    if (!aiProvider) {
      console.error("No AI API key configured");
      return new Response(
        JSON.stringify({ error: "لم يتم تكوين مفتاح الذكاء الاصطناعي. يرجى إضافة GEMINI_API_KEY أو OPENAI_API_KEY" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Using AI provider:", aiProvider);
    let systemPrompt = "";
    
    if (type === "welcome") {
      systemPrompt = `أنت كاتب محتوى تسويقي محترف باللغة العربية. اكتب رسالة ترحيبية للمشتركين الجدد.
      - استخدم أسلوب ودي ومرحب
      - اذكر فوائد الاشتراك
      - أضف دعوة للعمل (CTA)
      - اجعل الرسالة قصيرة ومؤثرة`;
    } else if (type === "offer") {
      systemPrompt = `أنت كاتب محتوى تسويقي محترف باللغة العربية. اكتب رسالة عرض ترويجي.
      - استخدم أسلوب حماسي ومشوق
      - أبرز قيمة العرض
      - اخلق إحساس بالإلحاح
      - أضف دعوة للعمل واضحة`;
    } else if (type === "newsletter") {
      systemPrompt = `أنت كاتب محتوى تسويقي محترف باللغة العربية. اكتب نشرة إخبارية.
      - استخدم أسلوب احترافي وممتع
      - قسم المحتوى لأقسام واضحة
      - أضف قيمة حقيقية للقارئ`;
    } else {
      systemPrompt = `أنت كاتب محتوى تسويقي محترف باللغة العربية. اكتب رسالة بريد إلكتروني تسويقية بناءً على طلب المستخدم.
      - استخدم أسلوب احترافي وجذاب
      - اجعل الرسالة مؤثرة وقصيرة
      - أضف دعوة للعمل`;
    }

    console.log("Generating email for user:", user.id, "with prompt:", prompt.substring(0, 50) + "...");

    let response: Response;
    let generatedText = "";
    
    if (aiProvider === 'gemini') {
      // Use Gemini API directly
      console.log("Calling Gemini API...");
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nالطلب: ${prompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", response.status, errorText);
        throw new Error("فشل في توليد المحتوى عبر Gemini");
      }
      
      const data = await response.json();
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
    } else if (aiProvider === 'openai') {
      // Use OpenAI API directly
      console.log("Calling OpenAI API...");
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          max_tokens: 2048,
          temperature: 0.7,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", response.status, errorText);
        throw new Error("فشل في توليد المحتوى عبر OpenAI");
      }
      
      const data = await response.json();
      generatedText = data.choices?.[0]?.message?.content || "";
      
    } else {
      // Use Lovable AI Gateway as fallback
      console.log("Calling Lovable AI Gateway...");
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح، حاول مرة أخرى لاحقاً" }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "الرصيد غير كافي، يرجى إضافة رصيد" }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errorText = await response.text();
        console.error("Lovable AI gateway error:", response.status, errorText);
        throw new Error("فشل في توليد المحتوى");
      }

      const data = await response.json();
      generatedText = data.choices?.[0]?.message?.content || "";
    }

    console.log("Generated email content successfully for user:", user.id);

    return new Response(JSON.stringify({ content: generatedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in generate-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
