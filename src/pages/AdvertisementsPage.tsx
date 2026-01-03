import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Megaphone, 
  Check, 
  Star, 
  Sparkles, 
  Eye, 
  Clock,
  ExternalLink,
  Send,
  Loader2,
  Upload,
  Image as ImageIcon,
  CreditCard
} from "lucide-react";
import { useActiveAdvertisements, useAdPricing, useSubmitAdvertisement, useIncrementAdClick } from "@/hooks/useAdvertisements";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdvertisementsPage = () => {
  const { data: ads, isLoading: adsLoading } = useActiveAdvertisements();
  const { data: pricing, isLoading: pricingLoading } = useAdPricing();
  const submitAd = useSubmitAdvertisement();
  const incrementClick = useIncrementAdClick();

  const [showAdForm, setShowAdForm] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    advertiser_name: "",
    advertiser_email: "",
    advertiser_phone: "",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const plan = pricing?.find(p => p.id === selectedPlan);
    if (!plan) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار باقة إعلانية",
        variant: "destructive",
      });
      return;
    }

    // Show payment dialog
    setShowAdForm(false);
    setShowPaymentDialog(true);
  };

  const handlePayment = async () => {
    const plan = pricing?.find(p => p.id === selectedPlan);
    if (!plan) return;

    // Simulate payment processing
    toast({
      title: "جاري معالجة الدفع...",
      description: "يرجى الانتظار",
    });

    // After "successful" payment, submit the ad
    await submitAd.mutateAsync({
      ...formData,
      ad_type: plan.ad_type,
      price: plan.price,
      duration_days: plan.duration_days,
    });

    setShowPaymentDialog(false);
    setFormData({
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      advertiser_name: "",
      advertiser_email: "",
      advertiser_phone: "",
    });
    setPaymentData({
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    });
    setSelectedPlan(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `ads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("advertisements")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("advertisements")
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      toast({ title: "تم رفع الصورة بنجاح" });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({ title: "خطأ في رفع الصورة", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleAdClick = (adId: string, linkUrl: string | null) => {
    incrementClick.mutate(adId);
    if (linkUrl) {
      window.open(linkUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background font-cairo">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          
          <div className="container mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Megaphone className="w-5 h-5" />
              <span className="font-medium">منصة الإعلانات</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              أعلن معنا واصل لآلاف الزوار
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              احصل على فرصة فريدة للوصول إلى جمهور واسع من خلال إعلانك المميز على منصتنا
            </p>
            <Dialog open={showAdForm} onOpenChange={setShowAdForm}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-primary-gradient shadow-lg shadow-primary/25">
                  <Megaphone className="w-5 h-5 ml-2" />
                  أضف إعلانك الآن
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">إضافة إعلان جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  {/* Plan Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">اختر الباقة</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pricing?.map((plan) => (
                        <div
                          key={plan.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedPlan === plan.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold">{plan.name}</span>
                            {plan.is_popular && (
                              <Badge className="bg-amber-500">الأكثر طلباً</Badge>
                            )}
                          </div>
                          <div className="text-2xl font-bold text-primary mb-1">
                            {plan.price} ر.س
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {plan.duration_days} يوم
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">عنوان الإعلان *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="عنوان جذاب لإعلانك"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="advertiser_name">اسم المعلن *</Label>
                      <Input
                        id="advertiser_name"
                        value={formData.advertiser_name}
                        onChange={(e) => setFormData({ ...formData, advertiser_name: e.target.value })}
                        placeholder="اسمك أو اسم الشركة"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف الإعلان</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="وصف مختصر لإعلانك"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="advertiser_email">البريد الإلكتروني *</Label>
                      <Input
                        id="advertiser_email"
                        type="email"
                        value={formData.advertiser_email}
                        onChange={(e) => setFormData({ ...formData, advertiser_email: e.target.value })}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="advertiser_phone">رقم الهاتف</Label>
                      <Input
                        id="advertiser_phone"
                        value={formData.advertiser_phone}
                        onChange={(e) => setFormData({ ...formData, advertiser_phone: e.target.value })}
                        placeholder="+966 5xx xxx xxxx"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label>صورة الإعلان</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-dashed border-border">
                        {formData.image_url ? (
                          <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full"
                        >
                          {uploading ? (
                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 ml-2" />
                          )}
                          رفع صورة
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          أو أدخل رابط الصورة أدناه
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="image_url">رابط صورة الإعلان (اختياري)</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link_url">رابط الإعلان</Label>
                      <Input
                        id="link_url"
                        value={formData.link_url}
                        onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary-gradient"
                    disabled={submitAd.isPending || !selectedPlan}
                  >
                    <CreditCard className="w-4 h-4 ml-2" />
                    متابعة للدفع
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Payment Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    الدفع الإلكتروني
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">الباقة:</span>
                      <span className="font-medium">
                        {pricing?.find(p => p.id === selectedPlan)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">المبلغ:</span>
                      <span className="text-xl font-bold text-primary">
                        {pricing?.find(p => p.id === selectedPlan)?.price} ر.س
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">رقم البطاقة</Label>
                    <Input
                      id="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">اسم صاحب البطاقة</Label>
                    <Input
                      id="cardName"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                      placeholder="الاسم كما هو مكتوب على البطاقة"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                      <Input
                        id="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                        placeholder="***"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowPaymentDialog(false);
                        setShowAdForm(true);
                      }}
                    >
                      رجوع
                    </Button>
                    <Button
                      className="flex-1 bg-primary-gradient"
                      onClick={handlePayment}
                      disabled={submitAd.isPending || !paymentData.cardNumber || !paymentData.cardName}
                    >
                      {submitAd.isPending ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 ml-2" />
                      )}
                      إتمام الدفع
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    جميع المعاملات المالية آمنة ومشفرة
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                باقات الإعلانات
              </h2>
              <p className="text-muted-foreground">
                اختر الباقة المناسبة لاحتياجاتك
              </p>
            </div>

            {pricingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="h-80 animate-pulse bg-muted" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pricing?.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                      plan.is_popular ? "border-primary shadow-lg shadow-primary/20 scale-105" : "border-border"
                    }`}
                  >
                    {plan.is_popular && (
                      <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-center py-1 text-sm font-medium">
                        <Star className="w-4 h-4 inline ml-1" />
                        الأكثر طلباً
                      </div>
                    )}
                    <CardHeader className={plan.is_popular ? "pt-10" : ""}>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-primary">{plan.price}</span>
                        <span className="text-muted-foreground"> ر.س</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Clock className="w-4 h-4" />
                          <span>{plan.duration_days} يوم</span>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {plan.features?.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className={`w-full ${plan.is_popular ? "bg-primary-gradient" : ""}`}
                        variant={plan.is_popular ? "default" : "outline"}
                        onClick={() => {
                          setSelectedPlan(plan.id);
                          setShowAdForm(true);
                        }}
                      >
                        اختر هذه الباقة
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Active Ads Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                الإعلانات النشطة
              </h2>
              <p className="text-muted-foreground">
                تصفح الإعلانات المعروضة حالياً على منصتنا
              </p>
            </div>

            {adsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-64 animate-pulse bg-muted" />
                ))}
              </div>
            ) : ads && ads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map((ad) => (
                  <Card
                    key={ad.id}
                    className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    onClick={() => handleAdClick(ad.id, ad.link_url)}
                  >
                    {ad.is_featured && (
                      <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500">
                        <Sparkles className="w-3 h-3 ml-1" />
                        مميز
                      </Badge>
                    )}
                    <div className="aspect-video overflow-hidden">
                      {ad.image_url ? (
                        <img
                          src={ad.image_url}
                          alt={ad.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Megaphone className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {ad.title}
                      </h3>
                      {ad.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {ad.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{ad.advertiser_name}</span>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {ad.views_count}
                          </span>
                          <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Megaphone className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  لا توجد إعلانات حالياً
                </h3>
                <p className="text-muted-foreground mb-6">
                  كن أول من يضيف إعلانه على منصتنا!
                </p>
                <Button 
                  className="bg-primary-gradient"
                  onClick={() => setShowAdForm(true)}
                >
                  <Megaphone className="w-4 h-4 ml-2" />
                  أضف إعلانك الآن
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdvertisementsPage;
