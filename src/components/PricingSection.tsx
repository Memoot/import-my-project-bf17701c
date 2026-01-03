import { Button } from "@/components/ui/button";
import { Check, Sparkles, Clock } from "lucide-react";
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
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (planName: string) => {
    navigate("/auth");
  };

  return (
    <section id="pricing" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
            الأسعار
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            خطط مرنة
            <span className="text-gradient"> بأسعار تنافسية</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            ابدأ بالتجربة المجانية لمدة 3 أيام، ثم اختر الخطة المناسبة لعملك
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? "border-secondary shadow-accent-glow scale-105"
                  : "border-border hover:border-primary/30 hover:shadow-lg"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-accent-gradient text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium shadow-md">
                    <Sparkles className="w-4 h-4" />
                    الأكثر شعبية
                  </div>
                </div>
              )}

              {/* Trial Badge for free plan */}
              {plan.trialDays && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium shadow-md">
                    <Clock className="w-4 h-4" />
                    تجربة مجانية
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8 pt-4">
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
                  <span className="text-xl font-medium text-muted-foreground">
                    {plan.currency}
                  </span>
                  <span className="text-5xl font-extrabold text-foreground">
                    {plan.price}
                  </span>
                </div>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-secondary/20' : 'bg-primary/10'}`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-secondary' : 'text-primary'}`} />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.popular ? "hero" : "gradient"}
                size="lg"
                className="w-full"
                onClick={() => handleSelectPlan(plan.name)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            ✓ دعم فني متواصل &nbsp; • &nbsp; ✓ إلغاء الاشتراك في أي وقت &nbsp; • &nbsp; ✓ بدون بطاقة ائتمان للتجربة
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
