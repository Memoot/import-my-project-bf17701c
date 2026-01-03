import { Button } from "@/components/ui/button";
import { Check, Sparkles, Clock, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "تجريبي مجاني",
    description: "جرب المنصة لمدة 3 أيام",
    price: "0",
    currency: "$",
    period: "3 أيام",
    trialDays: 3,
    features: [
      "50 رسالة يومياً",
      "100 مشترك",
      "صفحة هبوط واحدة",
      "تقارير أساسية",
      "دعم عبر البريد",
    ],
    cta: "ابدأ التجربة المجانية",
    popular: false,
    gradient: "from-slate-500 to-gray-600",
  },
  {
    name: "الاحترافي",
    description: "للمستقلين والشركات الصغيرة",
    price: "15",
    currency: "$",
    period: "/شهرياً",
    features: [
      "5,000 رسالة شهرياً",
      "1,000 مشترك",
      "5 صفحات هبوط",
      "3 أتمتة متقدمة",
      "تحليلات متقدمة",
      "إزالة العلامة التجارية",
      "دعم أولوية",
    ],
    cta: "اشترك الآن",
    popular: true,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "الشركات",
    description: "للشركات والفرق الكبيرة",
    price: "70",
    currency: "$",
    period: "/شهرياً",
    features: [
      "50,000 رسالة شهرياً",
      "10,000 مشترك",
      "20 صفحة هبوط",
      "10 أتمتة متقدمة",
      "نطاق مخصص",
      "وصول API كامل",
      "تحليلات متقدمة",
      "مدير حساب خاص",
    ],
    cta: "تواصل معنا",
    popular: false,
    gradient: "from-violet-500 to-purple-600",
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (planName: string) => {
    navigate("/auth");
  };

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 text-emerald-600 mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">الأسعار</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            خطط مرنة
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent"> بأسعار تنافسية</span>
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            ابدأ بالتجربة المجانية لمدة 3 أيام، ثم اختر الخطة المناسبة لعملك
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-3xl p-8 border transition-all duration-500 hover:-translate-y-3 animate-fade-in-up ${
                plan.popular
                  ? "border-emerald-500/50 shadow-2xl shadow-emerald-500/20 scale-105 z-10"
                  : "border-border hover:border-emerald-500/30 hover:shadow-xl"
              }`}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Rocket className="w-4 h-4" />
                    الأكثر شعبية
                  </div>
                </div>
              )}

              {/* Trial Badge for free plan */}
              {plan.trialDays && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Clock className="w-4 h-4" />
                    تجربة مجانية
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8 pt-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {plan.currency}
                  </span>
                  <span className="text-6xl font-extrabold text-foreground">
                    {plan.price}
                  </span>
                </div>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0`}>
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                size="lg"
                className={`w-full font-semibold rounded-xl h-12 ${
                  plan.popular 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg" 
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
                onClick={() => handleSelectPlan(plan.name)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-500" />
              دعم فني متواصل
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-500" />
              إلغاء الاشتراك في أي وقت
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-500" />
              بدون بطاقة ائتمان للتجربة
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
