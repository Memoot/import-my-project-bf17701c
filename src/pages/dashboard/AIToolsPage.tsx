import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileText,
  Languages,
  Share2,
  Mail,
  MessageSquare,
  Megaphone,
  PenLine,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Link2,
  Check,
  Edit3,
  Type,
  X,
  Move,
  Palette,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const imageStyles = [
  { value: "professional", label: "احترافي", description: "مناسب للأعمال والشركات" },
  { value: "creative", label: "إبداعي", description: "ألوان زاهية وفني" },
  { value: "minimal", label: "بسيط", description: "نظيف وأنيق" },
  { value: "realistic", label: "واقعي", description: "صور واقعية عالية الجودة" },
];

const textTypes = [
  { value: "article", label: "مقال", icon: FileText, description: "مقال كامل بعناوين وفقرات" },
  { value: "social", label: "منشور سوشيال", icon: MessageSquare, description: "منشورات لمنصات التواصل" },
  { value: "email", label: "بريد إلكتروني", icon: Mail, description: "رسائل تسويقية احترافية" },
  { value: "ad", label: "إعلان", icon: Megaphone, description: "نصوص إعلانية جذابة" },
  { value: "rewrite", label: "إعادة صياغة", icon: PenLine, description: "تحسين نص موجود" },
  { value: "translate", label: "ترجمة", icon: Languages, description: "ترجمة بين العربية والإنجليزية" },
];

const languages = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "English" },
  { value: "both", label: "كلاهما" },
];

const tones = [
  { value: "formal", label: "رسمي" },
  { value: "casual", label: "ودي" },
  { value: "marketing", label: "تسويقي" },
  { value: "informative", label: "معلوماتي" },
];

const promptSuggestions = [
  "تصميم بانر إعلاني لمنتج رقمي",
  "صورة خلفية لصفحة هبوط",
  "أيقونات احترافية للخدمات",
  "تصميم هيرو سيكشن عصري",
];

const textSuggestions = [
  "اكتب مقال عن أهمية التسويق الرقمي",
  "أنشئ منشور للترويج لدورة تدريبية",
  "اكتب بريد ترحيبي للمشتركين الجدد",
  "أنشئ نص إعلاني لمنتج جديد",
];

export default function AIToolsPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("image");

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState("professional");
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<Array<{ prompt: string; image: string }>>([]);

  // Text generation state
  const [textPrompt, setTextPrompt] = useState("");
  const [textType, setTextType] = useState("article");
  const [textLanguage, setTextLanguage] = useState("ar");
  const [textTone, setTextTone] = useState("formal");
  const [textLoading, setTextLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [textHistory, setTextHistory] = useState<Array<{ prompt: string; text: string; type: string }>>([]);

  // Share state
  const [shareOpen, setShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Image editor state
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editorTexts, setEditorTexts] = useState<Array<{
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontWeight: string;
  }>>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [newTextInput, setNewTextInput] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textFontSize, setTextFontSize] = useState(32);
  const [textFontWeight, setTextFontWeight] = useState("bold");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    supabase.auth.getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setSessionLoading(false));

    return () => subscription.unsubscribe();
  }, []);

  const canGenerate = useMemo(() => {
    return !sessionLoading && !!session;
  }, [sessionLoading, session]);

  // Image generation handler
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال وصف للصورة", variant: "destructive" });
      return;
    }

    if (!session) {
      toast({ title: "خطأ", description: "يرجى تسجيل الدخول أولاً", variant: "destructive" });
      navigate("/auth");
      return;
    }

    setImageLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt: imagePrompt, style: imageStyle },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw new Error(error.message);

      if (data?.image) {
        setGeneratedImage(data.image);
        setImageHistory((prev) => [{ prompt: imagePrompt, image: data.image }, ...prev.slice(0, 9)]);
        toast({ title: "تم!", description: "تم توليد الصورة بنجاح" });
      } else {
        throw new Error(data?.error || "لم يتم توليد صورة");
      }
    } catch (err: any) {
      console.error("Error generating image:", err);
      toast({ title: "خطأ", description: err?.message || "فشل في توليد الصورة", variant: "destructive" });
    } finally {
      setImageLoading(false);
    }
  };

  // Text generation handler
  const handleGenerateText = async () => {
    if (!textPrompt.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال الموضوع", variant: "destructive" });
      return;
    }

    if (!session) {
      toast({ title: "خطأ", description: "يرجى تسجيل الدخول أولاً", variant: "destructive" });
      navigate("/auth");
      return;
    }

    setTextLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-text", {
        body: { prompt: textPrompt, type: textType, language: textLanguage, tone: textTone },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw new Error(error.message);

      if (data?.text) {
        setGeneratedText(data.text);
        setTextHistory((prev) => [{ prompt: textPrompt, text: data.text, type: textType }, ...prev.slice(0, 9)]);
        toast({ title: "تم!", description: "تم توليد النص بنجاح" });
      } else {
        throw new Error(data?.error || "لم يتم توليد نص");
      }
    } catch (err: any) {
      console.error("Error generating text:", err);
      toast({ title: "خطأ", description: err?.message || "فشل في توليد النص", variant: "destructive" });
    } finally {
      setTextLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "تم التحميل", description: "تم تحميل الصورة بنجاح" });
  };

  const handleCopyText = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      toast({ title: "تم النسخ", description: "تم نسخ النص" });
    } catch {
      toast({ title: "خطأ", description: "فشل في النسخ", variant: "destructive" });
    }
  };

  const handleShare = (platform: string) => {
    const content = activeTab === "image" ? generatedImage : generatedText;
    if (!content) return;

    const text = activeTab === "text" ? encodeURIComponent(generatedText || "") : "";
    const url = activeTab === "image" ? encodeURIComponent(generatedImage || "") : "";

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text.substring(0, 280)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const handleCopyLink = async () => {
    const content = activeTab === "image" ? generatedImage : generatedText;
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast({ title: "تم النسخ", description: "تم نسخ المحتوى" });
    } catch {
      toast({ title: "خطأ", description: "فشل في النسخ", variant: "destructive" });
    }
  };

  // Image Editor Functions
  const addTextToImage = () => {
    if (!newTextInput.trim()) return;
    const newText = {
      id: `text-${Date.now()}`,
      text: newTextInput,
      x: 50,
      y: 50,
      fontSize: textFontSize,
      color: textColor,
      fontWeight: textFontWeight,
    };
    setEditorTexts([...editorTexts, newText]);
    setNewTextInput("");
    setSelectedTextId(newText.id);
  };

  const updateSelectedText = (updates: Partial<typeof editorTexts[0]>) => {
    if (!selectedTextId) return;
    setEditorTexts(editorTexts.map(t => 
      t.id === selectedTextId ? { ...t, ...updates } : t
    ));
  };

  const deleteSelectedText = () => {
    if (!selectedTextId) return;
    setEditorTexts(editorTexts.filter(t => t.id !== selectedTextId));
    setSelectedTextId(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    // Check if clicking on a text
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    for (let i = editorTexts.length - 1; i >= 0; i--) {
      const t = editorTexts[i];
      ctx.font = `${t.fontWeight} ${t.fontSize}px Cairo, sans-serif`;
      const metrics = ctx.measureText(t.text);
      const textWidth = metrics.width;
      const textHeight = t.fontSize;
      
      if (x >= t.x && x <= t.x + textWidth && 
          y >= t.y - textHeight && y <= t.y) {
        setSelectedTextId(t.id);
        setIsDragging(true);
        setDragOffset({ x: x - t.x, y: y - t.y });
        return;
      }
    }
    setSelectedTextId(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedTextId) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    updateSelectedText({
      x: x - dragOffset.x,
      y: y - dragOffset.y,
    });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const renderImageWithTexts = () => {
    const canvas = canvasRef.current;
    if (!canvas || !generatedImage) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      editorTexts.forEach(t => {
        ctx.font = `${t.fontWeight} ${t.fontSize}px Cairo, sans-serif`;
        ctx.fillStyle = t.color;
        ctx.textAlign = 'right';
        ctx.direction = 'rtl';
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(t.text, t.x, t.y);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw selection border if selected
        if (t.id === selectedTextId) {
          const metrics = ctx.measureText(t.text);
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(t.x - metrics.width - 10, t.y - t.fontSize - 5, metrics.width + 20, t.fontSize + 15);
          ctx.setLineDash([]);
        }
      });
    };
    img.src = generatedImage;
  };

  useEffect(() => {
    if (showImageEditor && generatedImage) {
      renderImageWithTexts();
    }
  }, [showImageEditor, generatedImage, editorTexts, selectedTextId]);

  const downloadEditedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `edited-image-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast({ title: "تم التحميل", description: "تم تحميل الصورة المعدلة بنجاح" });
  };

  const openImageEditor = () => {
    setEditorTexts([]);
    setSelectedTextId(null);
    setShowImageEditor(true);
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="أدوات الذكاء الاصطناعي" 
          description="أنشئ صوراً ونصوصاً احترافية باستخدام الذكاء الاصطناعي"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                توليد الصور
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                توليد النصوص
              </TabsTrigger>
            </TabsList>

            {/* Image Generation Tab */}
            <TabsContent value="image">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-primary" />
                        إنشاء صورة جديدة
                      </CardTitle>
                      <CardDescription>اكتب وصفاً تفصيلياً للصورة التي تريد إنشاءها</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>وصف الصورة</Label>
                        <Textarea
                          placeholder="اكتب وصفاً تفصيلياً للصورة..."
                          value={imagePrompt}
                          onChange={(e) => setImagePrompt(e.target.value)}
                          className="min-h-[120px] resize-none"
                          dir="auto"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>نمط الصورة</Label>
                        <Select value={imageStyle} onValueChange={setImageStyle}>
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
                        className="w-full"
                        onClick={handleGenerateImage}
                        disabled={!canGenerate || imageLoading}
                      >
                        {imageLoading ? (
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

                      <div className="pt-4 border-t">
                        <Label className="text-sm text-muted-foreground mb-2 block">اقتراحات سريعة:</Label>
                        <div className="flex flex-wrap gap-2">
                          {promptSuggestions.map((suggestion, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => setImagePrompt(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {imageHistory.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">الصور السابقة</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-2">
                          {imageHistory.map((item, i) => (
                            <button
                              key={i}
                              className="aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                              onClick={() => setGeneratedImage(item.image)}
                            >
                              <img src={item.image} alt={item.prompt} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        الصورة المُولّدة
                      </span>
                      {generatedImage && (
                        <Button variant="ghost" size="icon" onClick={() => setShareOpen(!shareOpen)}>
                          <Share2 className="w-4 h-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedImage ? (
                      <div className="space-y-4">
                        <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                          <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                        </div>
                        
                        {shareOpen && (
                          <div className="flex justify-center gap-2 p-3 bg-muted rounded-lg">
                            <Button variant="ghost" size="icon" onClick={() => handleShare("facebook")}>
                              <Facebook className="w-5 h-5 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShare("twitter")}>
                              <Twitter className="w-5 h-5 text-sky-500" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShare("linkedin")}>
                              <Linkedin className="w-5 h-5 text-blue-700" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShare("whatsapp")}>
                              <MessageSquare className="w-5 h-5 text-green-500" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                              {copiedLink ? <Check className="w-5 h-5 text-green-500" /> : <Link2 className="w-5 h-5" />}
                            </Button>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" onClick={handleDownloadImage}>
                            <Download className="w-4 h-4 ml-2" />
                            تحميل
                          </Button>
                          <Button variant="default" className="flex-1" onClick={openImageEditor}>
                            <Edit3 className="w-4 h-4 ml-2" />
                            تحرير وإضافة نص
                          </Button>
                          <Button variant="outline" onClick={handleGenerateImage} disabled={imageLoading}>
                            <RefreshCw className={`w-4 h-4 ${imageLoading ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-center">ستظهر الصورة المُولّدة هنا</p>
                        <p className="text-sm text-center mt-2">اكتب وصفاً واضغط على "توليد الصورة"</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Text Generation Tab */}
            <TabsContent value="text">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        إنشاء نص جديد
                      </CardTitle>
                      <CardDescription>اختر نوع المحتوى واكتب الموضوع</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Text Type Selection */}
                      <div className="space-y-2">
                        <Label>نوع المحتوى</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {textTypes.map((t) => {
                            const Icon = t.icon;
                            return (
                              <Button
                                key={t.value}
                                variant={textType === t.value ? "default" : "outline"}
                                className="flex flex-col h-auto py-3 px-2"
                                onClick={() => setTextType(t.value)}
                              >
                                <Icon className="w-5 h-5 mb-1" />
                                <span className="text-xs">{t.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>اللغة</Label>
                          <Select value={textLanguage} onValueChange={setTextLanguage}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map((l) => (
                                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>الأسلوب</Label>
                          <Select value={textTone} onValueChange={setTextTone}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {tones.map((t) => (
                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>الموضوع أو النص</Label>
                        <Textarea
                          placeholder={textType === "rewrite" ? "الصق النص الذي تريد إعادة صياغته..." : textType === "translate" ? "الصق النص الذي تريد ترجمته..." : "اكتب الموضوع الذي تريد الكتابة عنه..."}
                          value={textPrompt}
                          onChange={(e) => setTextPrompt(e.target.value)}
                          className="min-h-[120px] resize-none"
                          dir="auto"
                        />
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleGenerateText}
                        disabled={!canGenerate || textLoading}
                      >
                        {textLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                            جاري التوليد...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 ml-2" />
                            توليد النص
                          </>
                        )}
                      </Button>

                      <div className="pt-4 border-t">
                        <Label className="text-sm text-muted-foreground mb-2 block">اقتراحات سريعة:</Label>
                        <div className="flex flex-wrap gap-2">
                          {textSuggestions.map((suggestion, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => setTextPrompt(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {textHistory.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">النصوص السابقة</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {textHistory.map((item, i) => (
                            <button
                              key={i}
                              className="w-full text-right p-3 rounded-lg border border-border hover:border-primary transition-colors bg-muted/50"
                              onClick={() => setGeneratedText(item.text)}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                  {textTypes.find(t => t.value === item.type)?.label}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{item.prompt}</p>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        النص المُولّد
                      </span>
                      {generatedText && (
                        <Button variant="ghost" size="icon" onClick={() => setShareOpen(!shareOpen)}>
                          <Share2 className="w-4 h-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedText ? (
                      <div className="space-y-4">
                        <div className="min-h-[300px] max-h-[500px] overflow-y-auto rounded-lg border border-border bg-muted/50 p-4">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed" dir="auto">{generatedText}</p>
                        </div>
                        
                        {shareOpen && (
                          <div className="flex justify-center gap-2 p-3 bg-muted rounded-lg">
                            <Button variant="ghost" size="icon" onClick={() => handleShare("facebook")}>
                              <Facebook className="w-5 h-5 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShare("twitter")}>
                              <Twitter className="w-5 h-5 text-sky-500" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShare("linkedin")}>
                              <Linkedin className="w-5 h-5 text-blue-700" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShare("whatsapp")}>
                              <MessageSquare className="w-5 h-5 text-green-500" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                              {copiedLink ? <Check className="w-5 h-5 text-green-500" /> : <Link2 className="w-5 h-5" />}
                            </Button>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" onClick={handleCopyText}>
                            <Copy className="w-4 h-4 ml-2" />
                            نسخ النص
                          </Button>
                          <Button variant="outline" onClick={handleGenerateText} disabled={textLoading}>
                            <RefreshCw className={`w-4 h-4 ${textLoading ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-[300px] rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-center">سيظهر النص المُولّد هنا</p>
                        <p className="text-sm text-center mt-2">اختر نوع المحتوى واكتب الموضوع</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Image Editor Dialog */}
      <Dialog open={showImageEditor} onOpenChange={setShowImageEditor}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              تحرير الصورة وإضافة النصوص
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Canvas Area */}
            <div className="lg:col-span-2 relative">
              <div className="border rounded-lg overflow-hidden bg-muted aspect-square">
                <canvas 
                  ref={canvasRef}
                  className="w-full h-full object-contain cursor-move"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                اضغط على النص لتحديده، اسحب لتحريكه
              </p>
            </div>
            
            {/* Controls Panel */}
            <div className="space-y-4">
              {/* Add New Text */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    إضافة نص جديد
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="اكتب النص هنا..."
                    value={newTextInput}
                    onChange={(e) => setNewTextInput(e.target.value)}
                    dir="auto"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">اللون</Label>
                      <div className="flex gap-1 mt-1">
                        {['#ffffff', '#000000', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b'].map(color => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded-full border-2 ${textColor === color ? 'border-primary' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setTextColor(color)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">الحجم: {textFontSize}</Label>
                      <Slider
                        value={[textFontSize]}
                        onValueChange={([v]) => setTextFontSize(v)}
                        min={16}
                        max={120}
                        step={4}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <Select value={textFontWeight} onValueChange={setTextFontWeight}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="bold">عريض</SelectItem>
                      <SelectItem value="800">أعرض</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addTextToImage} className="w-full" size="sm">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة النص
                  </Button>
                </CardContent>
              </Card>

              {/* Edit Selected Text */}
              {selectedTextId && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Move className="w-4 h-4" />
                        تعديل النص المحدد
                      </span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={deleteSelectedText}>
                        <X className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      value={editorTexts.find(t => t.id === selectedTextId)?.text || ''}
                      onChange={(e) => updateSelectedText({ text: e.target.value })}
                      dir="auto"
                    />
                    <div className="flex gap-1">
                      {['#ffffff', '#000000', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b'].map(color => (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded-full border-2 ${editorTexts.find(t => t.id === selectedTextId)?.color === color ? 'border-primary' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => updateSelectedText({ color })}
                        />
                      ))}
                    </div>
                    <div>
                      <Label className="text-xs">الحجم: {editorTexts.find(t => t.id === selectedTextId)?.fontSize}</Label>
                      <Slider
                        value={[editorTexts.find(t => t.id === selectedTextId)?.fontSize || 32]}
                        onValueChange={([v]) => updateSelectedText({ fontSize: v })}
                        min={16}
                        max={120}
                        step={4}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Text List */}
              {editorTexts.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">النصوص ({editorTexts.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 max-h-[150px] overflow-y-auto">
                      {editorTexts.map(t => (
                        <button
                          key={t.id}
                          className={`w-full text-right p-2 rounded text-sm truncate transition-colors ${
                            selectedTextId === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                          }`}
                          onClick={() => setSelectedTextId(t.id)}
                        >
                          {t.text}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={downloadEditedImage} className="flex-1">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل الصورة
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
