import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Sparkles, Users, Mail, TrendingUp } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.png";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen bg-hero-gradient overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "4s" }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-20">
          {/* Content */}
          <div className="flex-1 text-center lg:text-right max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-glass px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-primary-foreground/90">منصة التسويق الأولى عربياً</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-6 leading-tight animate-slide-up">
              ارفع مبيعاتك مع
              <span className="block text-gradient mt-2">حملات البريد الذكية</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/70 mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
              أدوات تسويق متقدمة بالذكاء الاصطناعي لإنشاء وإرسال وتتبع حملات البريد الإلكتروني. 
              وصّل رسالتك لآلاف العملاء بضغطة زر واحدة.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <a href="/dashboard">
                <Button variant="hero" size="xl" className="group">
                  ابدأ تجربتك المجانية
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </a>
              <Button variant="glass" size="xl" className="group">
                <Play className="w-5 h-5" />
                شاهد العرض التوضيحي
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-secondary mb-1">
                  <Users className="w-5 h-5" />
                  <span className="text-2xl font-bold text-primary-foreground">+10K</span>
                </div>
                <p className="text-sm text-primary-foreground/60">عميل سعيد</p>
              </div>
              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-secondary mb-1">
                  <Mail className="w-5 h-5" />
                  <span className="text-2xl font-bold text-primary-foreground">+50M</span>
                </div>
                <p className="text-sm text-primary-foreground/60">رسالة مُرسلة</p>
              </div>
              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-secondary mb-1">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-2xl font-bold text-primary-foreground">95%</span>
                </div>
                <p className="text-sm text-primary-foreground/60">معدل الوصول</p>
              </div>
            </div>
          </div>

          {/* Dashboard Image */}
          <div className="flex-1 w-full max-w-xl lg:max-w-2xl animate-float">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-2xl" />
              
              {/* Dashboard Image */}
              <div className="relative bg-glass rounded-2xl p-2 shadow-2xl">
                <img
                  src={heroDashboard}
                  alt="لوحة تحكم رسائل برو"
                  className="w-full h-auto rounded-xl"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-lg animate-slide-up" style={{ animationDelay: "0.8s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-gradient rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">معدل الفتح</p>
                    <p className="font-bold text-foreground">+45%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg animate-slide-up" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-gradient rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">رسائل اليوم</p>
                    <p className="font-bold text-foreground">12,450</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
