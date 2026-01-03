import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart, 
  Sparkles,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { value: "+10,000", label: "عميل سعيد" },
  { value: "+50M", label: "رسالة مُرسلة" },
  { value: "15+", label: "دولة" },
  { value: "99.9%", label: "وقت التشغيل" },
];

const values = [
  {
    icon: Target,
    title: "الابتكار",
    description: "نسعى دائماً لتقديم أحدث الحلول التقنية في مجال التسويق الرقمي"
  },
  {
    icon: Heart,
    title: "العميل أولاً",
    description: "نضع احتياجات عملائنا في مقدمة أولوياتنا ونعمل على تحقيق نجاحهم"
  },
  {
    icon: Award,
    title: "الجودة",
    description: "نلتزم بأعلى معايير الجودة في جميع خدماتنا ومنتجاتنا"
  },
  {
    icon: Globe,
    title: "الشمولية",
    description: "نخدم المجتمع العربي بأكمله بلغته وثقافته"
  },
];

const team = [
  {
    name: "أحمد محمد",
    role: "المؤسس والرئيس التنفيذي",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  },
  {
    name: "سارة علي",
    role: "مديرة التقنية",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
  },
  {
    name: "محمد خالد",
    role: "مدير المنتجات",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  },
  {
    name: "نور أحمد",
    role: "مديرة التسويق",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background font-tajawal">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />

          <div className="container mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
              <Users className="w-5 h-5" />
              <span className="font-medium">من نحن</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              نبني مستقبل
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent"> التسويق الرقمي العربي</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              ماركيتلي هي منصة التسويق الرقمي الرائدة في العالم العربي، نساعد الشركات والأفراد على الوصول لعملائهم بطريقة ذكية وفعالة باستخدام أحدث تقنيات الذكاء الاصطناعي.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-emerald-500 to-teal-500">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-600 mb-6">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">رسالتنا</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  تمكين الأعمال العربية من النجاح رقمياً
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  نؤمن بأن كل عمل تجاري في العالم العربي يستحق الوصول لأدوات تسويقية متقدمة وسهلة الاستخدام. نعمل على توفير حلول تسويقية متكاملة تساعد على نمو الأعمال وزيادة المبيعات.
                </p>
                <ul className="space-y-3">
                  {[
                    "أدوات تسويقية متقدمة بأسعار مناسبة",
                    "دعم فني متواصل باللغة العربية",
                    "تحديثات مستمرة وميزات جديدة",
                    "تكامل مع أشهر المنصات والخدمات"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-foreground">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl" />
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
                  alt="فريق العمل"
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">قيمنا</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                المبادئ التي نعمل بها
              </h2>
              <p className="text-lg text-muted-foreground">
                قيمنا الأساسية التي توجه عملنا وتشكل ثقافتنا
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-600 mb-6">
                <Users className="w-5 h-5" />
                <span className="font-medium">فريقنا</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                تعرّف على فريق العمل
              </h2>
              <p className="text-lg text-muted-foreground">
                فريق متخصص يعمل بشغف لتقديم أفضل الحلول لعملائنا
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <Card key={member.name} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-emerald-500 to-teal-500">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              انضم لآلاف العملاء السعداء
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              ابدأ رحلتك معنا اليوم واستفد من جميع مميزات المنصة
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-white/90 font-bold">
                ابدأ مجاناً الآن
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
