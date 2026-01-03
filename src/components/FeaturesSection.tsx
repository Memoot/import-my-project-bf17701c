import { 
  Sparkles, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  Palette,
  Clock,
  Target,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Sparkles,
    title: "الذكاء الاصطناعي",
    description: "اكتب رسائل احترافية بضغطة زر واحدة باستخدام أحدث تقنيات الذكاء الاصطناعي",
    color: "from-emerald-500 to-teal-500",
    delay: "0s",
  },
  {
    icon: BarChart3,
    title: "تحليلات متقدمة",
    description: "تتبع أداء حملاتك بتقارير مفصلة وإحصائيات دقيقة في الوقت الفعلي",
    color: "from-blue-500 to-cyan-500",
    delay: "0.1s",
  },
  {
    icon: Users,
    title: "إدارة المشتركين",
    description: "نظّم قوائمك البريدية وقسّم جمهورك حسب الاهتمامات والسلوك",
    color: "from-violet-500 to-purple-500",
    delay: "0.2s",
  },
  {
    icon: Palette,
    title: "قوالب احترافية",
    description: "مكتبة ضخمة من القوالب العربية الجاهزة والقابلة للتخصيص بالكامل",
    color: "from-pink-500 to-rose-500",
    delay: "0.3s",
  },
  {
    icon: Zap,
    title: "أتمتة ذكية",
    description: "أرسل رسائل تلقائية بناءً على تصرفات عملائك وتفاعلهم",
    color: "from-amber-500 to-orange-500",
    delay: "0.4s",
  },
  {
    icon: Shield,
    title: "حماية متقدمة",
    description: "تشفير كامل لبياناتك وامتثال لمعايير الخصوصية العالمية",
    color: "from-slate-500 to-gray-600",
    delay: "0.5s",
  },
  {
    icon: Globe,
    title: "دعم عربي كامل",
    description: "واجهة عربية بالكامل مع دعم RTL ولغة عربية طبيعية",
    color: "from-teal-500 to-cyan-500",
    delay: "0.6s",
  },
  {
    icon: Clock,
    title: "جدولة ذكية",
    description: "اختر أفضل أوقات الإرسال تلقائياً لزيادة معدلات الفتح",
    color: "from-indigo-500 to-blue-500",
    delay: "0.7s",
  },
  {
    icon: Target,
    title: "استهداف دقيق",
    description: "وصّل رسالتك للجمهور المناسب في الوقت المناسب",
    color: "from-red-500 to-rose-600",
    delay: "0.8s",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-5 py-2.5 rounded-full mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-600">المميزات</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            كل ما تحتاجه في
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent"> منصة واحدة</span>
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            أدوات متكاملة لإدارة حملاتك البريدية من البداية للنهاية مع نتائج مضمونة
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-3xl p-8 border border-border hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: feature.delay }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-emerald-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Arrow */}
              <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <ArrowLeft className="w-5 h-5 text-emerald-500" />
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Corner Decoration */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-tl-3xl rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: "1s" }}>
          <Link to="/dashboard">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-2xl px-8 shadow-lg hover:shadow-xl transition-all group"
            >
              اكتشف جميع المميزات
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
