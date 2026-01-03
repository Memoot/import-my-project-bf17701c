import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SubscribeRequest {
  email: string;
  name?: string;
  userId: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, userId, source }: SubscribeRequest = await req.json();

    // Validate required fields
    if (!email || !userId) {
      return new Response(
        JSON.stringify({ error: "البريد الإلكتروني ومعرف المستخدم مطلوبان" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "صيغة البريد الإلكتروني غير صحيحة" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role to insert subscriber (bypasses RLS for public subscriptions)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from("subscribers")
      .select("id, status, name")
      .eq("user_id", userId)
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      if (existing.status === 'active') {
        return new Response(
          JSON.stringify({ error: "هذا البريد الإلكتروني مشترك بالفعل" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Reactivate subscription
      const { error: updateError } = await supabaseAdmin
        .from("subscribers")
        .update({ 
          status: 'active', 
          name: name || existing.name,
          unsubscribed_at: null 
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Error reactivating subscription:", updateError);
        throw updateError;
      }

      return new Response(
        JSON.stringify({ success: true, message: "تم إعادة تفعيل الاشتراك بنجاح" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert new subscriber
    const { error: insertError } = await supabaseAdmin
      .from("subscribers")
      .insert({
        user_id: userId,
        email: email.toLowerCase(),
        name: name || null,
        source: source || 'embed_form',
        status: 'active',
      });

    if (insertError) {
      console.error("Error inserting subscriber:", insertError);
      throw insertError;
    }

    console.log("New subscriber added:", email);

    return new Response(
      JSON.stringify({ success: true, message: "تم الاشتراك بنجاح" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in subscribe function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "حدث خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
