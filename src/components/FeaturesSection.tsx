import { 
  Sparkles, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  Palette,
  Clock,
  Target
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "الذكاء الاصطناعي",
    description: "اكتب رسائل احترافية بضغطة زر واحدة باستخدام أحدث تقنيات الذكاء الاصطناعي",
    color: "from-primary to-primary-glow",
  },
  {
    icon: BarChart3,
    title: "تحليلات متقدمة",
    description: "تتبع أداء حملاتك بتقارير مفصلة وإحصائيات دقيقة في الوقت الفعلي",
    color: "from-secondary to-secondary/80",
  },
  {
    icon: Users,
    title: "إدارة المشتركين",
    description: "نظّم قوائمك البريدية وقسّم جمهورك حسب الاهتمامات والسلوك",
    color: "from-accent to-accent/80",
  },
  {
    icon: Palette,
    title: "قوالب احترافية",
    description: "مكتبة ضخمة من القوالب العربية الجاهزة والقابلة للتخصيص بالكامل",
    color: "from-primary to-secondary",
  },
  {
    icon: Zap,
    title: "أتمتة ذكية",
    description: "أرسل رسائل تلقائية بناءً على تصرفات عملائك وتفاعلهم",
    color: "from-secondary to-accent",
  },
  {
    icon: Shield,
    title: "حماية متقدمة",
    description: "تشفير كامل لبياناتك وامتثال لمعايير الخصوصية العالمية",
    color: "from-accent to-primary",
  },
  {
    icon: Globe,
    title: "دعم عربي كامل",
    description: "واجهة عربية بالكامل مع دعم RTL ولغة عربية طبيعية",
    color: "from-primary-glow to-primary",
  },
  {
    icon: Clock,
    title: "جدولة ذكية",
    description: "اختر أفضل أوقات الإرسال تلقائياً لزيادة معدلات الفتح",
    color: "from-secondary to-primary",
  },
  {
    icon: Target,
    title: "استهداف دقيق",
    description: "وصّل رسالتك للجمهور المناسب في الوقت المناسب",
    color: "from-accent to-secondary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            المميزات
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            كل ما تحتاجه في
            <span className="text-gradient"> منصة واحدة</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            أدوات متكاملة لإدارة حملاتك البريدية من البداية للنهاية مع نتائج مضمونة
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
