import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Sparkles, Users, Mail, TrendingUp, Check, Star, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import heroDashboard from "@/assets/hero-dashboard.png";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen bg-hero-gradient overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: "4s" }} />
        
        {/* Floating Particles */}
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-bounce-gentle" />
        <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-teal-400 rounded-full animate-bounce-gentle" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-bounce-gentle" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 py-16 lg:py-24">
          {/* Content */}
          <div className="flex-1 text-center lg:text-right max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-white/10 animate-fade-in-up">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-primary-foreground/90 font-medium">+10,000 عميل سعيد</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-primary-foreground mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              ارفع مبيعاتك مع
              <span className="block mt-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                حملات البريد الذكية
              </span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              أدوات تسويق متقدمة بالذكاء الاصطناعي لإنشاء وإرسال وتتبع حملات البريد الإلكتروني. 
              وصّل رسالتك لآلاف العملاء بضغطة زر واحدة.
            </p>

            {/* Features List */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              {["إنشاء بالذكاء الاصطناعي", "تحليلات متقدمة", "دعم عربي كامل"].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Link to="/dashboard">
                <Button 
                  size="xl" 
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl px-8"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ابدأ تجربتك المجانية
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="xl" 
                className="group border border-white/20 bg-white/5 hover:bg-white/10 text-primary-foreground rounded-2xl backdrop-blur-sm"
              >
                <Play className="w-5 h-5 ml-2" />
                شاهد العرض التوضيحي
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              {[
                { icon: Users, value: "+10K", label: "عميل سعيد" },
                { icon: Mail, value: "+50M", label: "رسالة مُرسلة" },
                { icon: TrendingUp, value: "95%", label: "معدل الوصول" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-right group">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <stat.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-2xl lg:text-3xl font-bold text-primary-foreground">{stat.value}</span>
                  </div>
                  <p className="text-sm text-primary-foreground/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Image */}
          <div className="flex-1 w-full max-w-xl lg:max-w-2xl animate-float">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/40 via-teal-500/30 to-cyan-500/40 rounded-3xl blur-3xl animate-pulse-slow" />
              
              {/* Main Dashboard */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-3 shadow-2xl border border-white/10">
                <img
                  src={heroDashboard}
                  alt="لوحة تحكم ماركيتلي"
                  className="w-full h-auto rounded-2xl"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-8 -right-8 bg-card p-4 rounded-2xl shadow-2xl animate-slide-in-right border border-border" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">معدل الفتح</p>
                    <p className="text-xl font-bold text-foreground">+45%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-2xl animate-slide-in-left border border-border" style={{ animationDelay: "0.8s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">رسائل اليوم</p>
                    <p className="text-xl font-bold text-foreground">12,450</p>
                  </div>
                </div>
              </div>

              {/* Success Badge */}
              <div className="absolute top-1/2 -left-4 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce-gentle text-sm font-medium">
                ✓ تم الإرسال بنجاح
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
