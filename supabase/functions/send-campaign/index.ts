import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SendCampaignRequest {
  campaignId: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  fromEmail: string;
  fromName?: string;
  subscriberIds?: string[]; // Optional: specific subscribers, if empty sends to all active
}

// AWS Signature V4 implementation for SES
async function signRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string,
  accessKeyId: string,
  secretAccessKey: string,
  region: string,
  service: string
): Promise<Record<string, string>> {
  const encoder = new TextEncoder();
  
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  
  const urlObj = new URL(url);
  const host = urlObj.host;
  const canonicalUri = urlObj.pathname || '/';
  const canonicalQuerystring = urlObj.search.slice(1);
  
  headers['host'] = host;
  headers['x-amz-date'] = amzDate;
  
  // Create canonical headers
  const signedHeaders = Object.keys(headers).sort().join(';');
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map(key => `${key}:${headers[key]}\n`)
    .join('');
  
  // Hash the payload
  const payloadHash = await crypto.subtle.digest('SHA-256', encoder.encode(body));
  const payloadHashHex = Array.from(new Uint8Array(payloadHash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Create canonical request
  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQuerystring,
    canonicalHeaders,
    signedHeaders,
    payloadHashHex
  ].join('\n');
  
  // Create string to sign
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  
  const canonicalRequestHash = await crypto.subtle.digest('SHA-256', encoder.encode(canonicalRequest));
  const canonicalRequestHashHex = Array.from(new Uint8Array(canonicalRequestHash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    canonicalRequestHashHex
  ].join('\n');
  
  // Calculate signing key
  async function hmacSha256(key: BufferSource, data: string): Promise<ArrayBuffer> {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    return await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  }
  
  const kDate = await hmacSha256(encoder.encode(`AWS4${secretAccessKey}`), dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, 'aws4_request');
  
  const signature = await hmacSha256(kSigning, stringToSign);
  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Create authorization header
  const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signatureHex}`;
  
  return {
    ...headers,
    'Authorization': authorizationHeader
  };
}

async function sendEmailViaSES(
  to: string,
  subject: string,
  htmlBody: string,
  textBody: string,
  fromEmail: string,
  fromName: string,
  accessKeyId: string,
  secretAccessKey: string,
  region: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const endpoint = `https://email.${region}.amazonaws.com/`;
  
  const params = new URLSearchParams();
  params.append('Action', 'SendEmail');
  params.append('Source', fromName ? `${fromName} <${fromEmail}>` : fromEmail);
  params.append('Destination.ToAddresses.member.1', to);
  params.append('Message.Subject.Data', subject);
  params.append('Message.Subject.Charset', 'UTF-8');
  params.append('Message.Body.Html.Data', htmlBody);
  params.append('Message.Body.Html.Charset', 'UTF-8');
  params.append('Message.Body.Text.Data', textBody);
  params.append('Message.Body.Text.Charset', 'UTF-8');
  params.append('Version', '2010-12-01');
  
  const body = params.toString();
  
  const headers: Record<string, string> = {
    'content-type': 'application/x-www-form-urlencoded',
  };
  
  const signedHeaders = await signRequest(
    'POST',
    endpoint,
    headers,
    body,
    accessKeyId,
    secretAccessKey,
    region,
    'ses'
  );
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: signedHeaders,
      body: body,
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('SES Error Response:', responseText);
      // Parse error from XML
      const errorMatch = responseText.match(/<Message>(.*?)<\/Message>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'Unknown SES error';
      return { success: false, error: errorMessage };
    }
    
    // Parse MessageId from successful response
    const messageIdMatch = responseText.match(/<MessageId>(.*?)<\/MessageId>/);
    const messageId = messageIdMatch ? messageIdMatch[1] : undefined;
    
    return { success: true, messageId };
  } catch (error: any) {
    console.error('SES Request Error:', error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "غير مصرح - يجب تسجيل الدخول" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "غير مصرح - جلسة غير صالحة" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { campaignId, subject, htmlContent, textContent, fromEmail, fromName, subscriberIds }: SendCampaignRequest = await req.json();

    // Validate required fields
    if (!campaignId || !subject || !htmlContent || !fromEmail) {
      return new Response(
        JSON.stringify({ error: "البيانات المطلوبة غير مكتملة" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get AWS credentials
    const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
    const region = Deno.env.get("AWS_SES_REGION") || "us-east-1";

    if (!accessKeyId || !secretAccessKey) {
      console.error("AWS credentials not configured");
      return new Response(
        JSON.stringify({ error: "بيانات اعتماد AWS غير مكونة" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get subscribers to send to
    let query = supabaseAdmin
      .from("subscribers")
      .select("id, email, name")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (subscriberIds && subscriberIds.length > 0) {
      query = query.in("id", subscriberIds);
    }

    const { data: subscribers, error: subError } = await query;

    if (subError) {
      console.error("Error fetching subscribers:", subError);
      return new Response(
        JSON.stringify({ error: "خطأ في جلب المشتركين" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ error: "لا يوجد مشتركين لإرسال الحملة إليهم" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending campaign ${campaignId} to ${subscribers.length} subscribers`);

    // Send emails
    const results = {
      total: subscribers.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const subscriber of subscribers) {
      // Personalize content
      let personalizedHtml = htmlContent
        .replace(/\{\{name\}\}/gi, subscriber.name || 'عزيزي المشترك')
        .replace(/\{\{email\}\}/gi, subscriber.email)
        .replace(/\{\{الاسم\}\}/gi, subscriber.name || 'عزيزي المشترك');

      let personalizedText = (textContent || '')
        .replace(/\{\{name\}\}/gi, subscriber.name || 'عزيزي المشترك')
        .replace(/\{\{email\}\}/gi, subscriber.email)
        .replace(/\{\{الاسم\}\}/gi, subscriber.name || 'عزيزي المشترك');

      const result = await sendEmailViaSES(
        subscriber.email,
        subject,
        personalizedHtml,
        personalizedText || 'Please view this email in an HTML-compatible email client.',
        fromEmail,
        fromName || '',
        accessKeyId,
        secretAccessKey,
        region
      );

      if (result.success) {
        results.sent++;
        console.log(`Email sent to ${subscriber.email}, MessageId: ${result.messageId}`);
      } else {
        results.failed++;
        results.errors.push(`${subscriber.email}: ${result.error}`);
        console.error(`Failed to send to ${subscriber.email}:`, result.error);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Update campaign status
    await supabaseAdmin
      .from("campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", campaignId)
      .eq("user_id", user.id);

    console.log(`Campaign ${campaignId} completed:`, results);

    return new Response(
      JSON.stringify({
        success: true,
        message: `تم إرسال الحملة بنجاح`,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in send-campaign function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "حدث خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
