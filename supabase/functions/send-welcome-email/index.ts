import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  displayName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, displayName }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
    const region = Deno.env.get("AWS_SES_REGION") || "us-east-1";

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("AWS credentials not configured");
    }

    const name = displayName || "عزيزي المستخدم";

    const emailBody = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .content h2 { color: #333; margin-bottom: 20px; }
          .content p { color: #666; line-height: 1.8; font-size: 16px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 BossMailer</h1>
          </div>
          <div class="content">
            <h2>مرحباً ${name}! 👋</h2>
            <p>نحن سعداء جداً بانضمامك إلى عائلة BossMailer!</p>
            <p>مع BossMailer، يمكنك:</p>
            <ul style="color: #666; line-height: 2;">
              <li>✨ إنشاء حملات بريدية احترافية</li>
              <li>📊 تتبع أداء حملاتك بدقة</li>
              <li>🎨 تصميم صفحات هبوط جذابة</li>
              <li>🤖 استخدام الذكاء الاصطناعي لكتابة المحتوى</li>
            </ul>
            <p>ابدأ الآن واستكشف جميع المميزات!</p>
          </div>
          <div class="footer">
            <p>© 2024 BossMailer. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create AWS signature for SES
    const host = `email.${region}.amazonaws.com`;
    const service = "ses";
    const method = "POST";
    const amzdate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
    const datestamp = amzdate.substring(0, 8);

    // SES SendEmail action parameters
    const params = new URLSearchParams({
      Action: "SendEmail",
      Version: "2010-12-01",
      "Source": "noreply@bossmailer.com",
      "Destination.ToAddresses.member.1": email,
      "Message.Subject.Data": "مرحباً بك في BossMailer! 🎉",
      "Message.Subject.Charset": "UTF-8",
      "Message.Body.Html.Data": emailBody,
      "Message.Body.Html.Charset": "UTF-8",
    });

    const requestBody = params.toString();

    // Create canonical request
    const canonicalUri = "/";
    const canonicalQuerystring = "";
    const contentType = "application/x-www-form-urlencoded";
    
    const encoder = new TextEncoder();
    const payloadHash = await crypto.subtle.digest("SHA-256", encoder.encode(requestBody));
    const payloadHashHex = Array.from(new Uint8Array(payloadHash)).map(b => b.toString(16).padStart(2, "0")).join("");

    const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-date:${amzdate}\n`;
    const signedHeaders = "content-type;host;x-amz-date";
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHashHex}`;

    // Create string to sign
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${datestamp}/${region}/${service}/aws4_request`;
    const canonicalRequestHash = await crypto.subtle.digest("SHA-256", encoder.encode(canonicalRequest));
    const canonicalRequestHashHex = Array.from(new Uint8Array(canonicalRequestHash)).map(b => b.toString(16).padStart(2, "0")).join("");
    const stringToSign = `${algorithm}\n${amzdate}\n${credentialScope}\n${canonicalRequestHashHex}`;

    // Calculate signature
    const getSignatureKey = async (key: string, dateStamp: string, regionName: string, serviceName: string) => {
      const kDate = await crypto.subtle.sign(
        "HMAC",
        await crypto.subtle.importKey("raw", encoder.encode("AWS4" + key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
        encoder.encode(dateStamp)
      );
      const kRegion = await crypto.subtle.sign(
        "HMAC",
        await crypto.subtle.importKey("raw", kDate, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
        encoder.encode(regionName)
      );
      const kService = await crypto.subtle.sign(
        "HMAC",
        await crypto.subtle.importKey("raw", kRegion, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
        encoder.encode(serviceName)
      );
      const kSigning = await crypto.subtle.sign(
        "HMAC",
        await crypto.subtle.importKey("raw", kService, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
        encoder.encode("aws4_request")
      );
      return kSigning;
    };

    const signingKey = await getSignatureKey(secretAccessKey, datestamp, region, service);
    const signature = await crypto.subtle.sign(
      "HMAC",
      await crypto.subtle.importKey("raw", signingKey, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
      encoder.encode(stringToSign)
    );
    const signatureHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, "0")).join("");

    const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signatureHex}`;

    // Make the request to SES
    const response = await fetch(`https://${host}/`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "Host": host,
        "X-Amz-Date": amzdate,
        "Authorization": authorizationHeader,
      },
      body: requestBody,
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("SES Error:", responseText);
      throw new Error(`SES Error: ${response.status} - ${responseText}`);
    }

    console.log("Welcome email sent successfully to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
