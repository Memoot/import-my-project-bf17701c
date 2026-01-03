import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles,
  Download,
  Loader2,
  ImageIcon,
  Wand2,
  Copy,
  RefreshCw,
} from "lucide-react";

const imageStyles = [
  { value: "professional", label: "احترافي", description: "مناسب للأعمال والشركات" },
  { value: "creative", label: "إبداعي", description: "ألوان زاهية وفني" },
  { value: "minimal", label: "بسيط", description: "نظيف وأنيق" },
  { value: "realistic", label: "واقعي", description: "صور واقعية عالية الجودة" },
];

const promptSuggestions = [
  "تصميم بانر إعلاني لمنتج رقمي",
  "صورة خلفية لصفحة هبوط",
  "أيقونات احترافية للخدمات",
  "تصميم هيرو سيكشن عصري",
  "صورة منتج على خلفية بيضاء",
];

export default function AIImageGeneratorPage() {
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ prompt: string; image: string }>>([]);

  useEffect(() => {
    // Listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    // Then read current session
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setSessionLoading(false));

    return () => subscription.unsubscribe();
  }, []);

  const canGenerate = useMemo(() => {
    return !sessionLoading && !!session && !loading;
  }, [sessionLoading, session, loading]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال وصف للصورة",
        variant: "destructive",
      });
      return;
    }

    if (sessionLoading) {
      toast({
        title: "لحظة",
        description: "جاري التحقق من تسجيل الدخول...",
      });
      return;
    }

    if (!session) {
      toast({
        title: "خطأ",
        description: "يرجى تسجيل الدخول أولاً (داخل نفس رابط المعاينة)",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt, style },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        const status: number | undefined =
          (error as any)?.context?.status ?? (error as any)?.status;

        let description = (error as any)?.message || "فشل في توليد الصورة";

        if (status === 401)
          description =
            "غير مصرح: تأكد أنك مسجل دخول داخل نفس رابط المعاينة، ثم أعد المحاولة";
        if (status === 429) description = "تم تجاوز الحد المسموح، جرّب لاحقاً";
        if (status === 402) description = "يرجى إضافة رصيد للمتابعة";

        const backendError = (error as any)?.context?.body;
        if (typeof backendError === "string") {
          try {
            const parsed = JSON.parse(backendError);
            if (parsed?.error) description = parsed.error;
          } catch {
            // ignore
          }
        }

        throw new Error(description);
      }

      if (data?.image) {
        setGeneratedImage(data.image);
        setHistory((prev) => [{ prompt, image: data.image }, ...prev.slice(0, 9)]);
        toast({
          title: "تم!",
          description: "تم توليد الصورة بنجاح",
        });
        return;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      throw new Error("لم يتم توليد صورة، حاول مرة أخرى");
    } catch (err: any) {
      console.error("Error generating image:", err);
      toast({
        title: "خطأ",
        description: err?.message || "فشل في توليد الصورة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "تم التحميل",
      description: "تم تحميل الصورة بنجاح",
    });
  };

  const handleCopyUrl = async () => {
    if (!generatedImage) return;
    
    try {
      await navigator.clipboard.writeText(generatedImage);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط الصورة",
      });
    } catch {
      toast({
        title: "خطأ",
        description: "فشل في نسخ الرابط",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="توليد الصور بالذكاء الاصطناعي" 
          description="أنشئ صوراً احترافية باستخدام الذكاء الاصطناعي"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-primary" />
                    إنشاء صورة جديدة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>وصف الصورة</Label>
                    <Textarea
                      placeholder="اكتب وصفاً تفصيلياً للصورة التي تريد إنشاءها..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>نمط الصورة</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {imageStyles.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            <div className="flex flex-col">
                              <span>{s.label}</span>
                              <span className="text-xs text-muted-foreground">{s.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full bg-primary-gradient hover:opacity-90"
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري التوليد...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 ml-2" />
                        توليد الصورة
                      </>
                    )}
                  </Button>

                  {/* Suggestions */}
                  <div className="pt-4 border-t">
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      اقتراحات سريعة:
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {promptSuggestions.map((suggestion, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setPrompt(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* History */}
              {history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">الصور السابقة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {history.map((item, i) => (
                        <button
                          key={i}
                          className="aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                          onClick={() => setGeneratedImage(item.image)}
                        >
                          <img 
                            src={item.image} 
                            alt={item.prompt}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Output Section */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  الصورة المُولّدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedImage ? (
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                      <img 
                        src={generatedImage} 
                        alt="Generated" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4 ml-2" />
                        تحميل
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleCopyUrl}
                      >
                        <Copy className="w-4 h-4 ml-2" />
                        نسخ الرابط
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handleGenerate}
                        disabled={loading}
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-center">
                      ستظهر الصورة المُولّدة هنا
                    </p>
                    <p className="text-sm text-center mt-2">
                      اكتب وصفاً واضغط على "توليد الصورة"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
